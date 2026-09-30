-- Run once in Supabase → SQL Editor, after 004_protect_stock.sql. Safe to re-run.
--   1. Cancelling an order puts its stock back; re-opening a cancelled order takes it off again.
--   2. Limits how many orders one phone number or one connection can place, so nobody can
--      empty the stock with fake orders. Only a one-way hash of the IP address is kept.

-- 1. STOCK FOLLOWS ORDER STATUS ---------------------------------------------
-- Owner rights (SECURITY DEFINER) so the stock guard from 004 treats this as a trusted change.
CREATE OR REPLACE FUNCTION adjust_variant_stock(p_product_id TEXT, p_color TEXT, p_size TEXT, p_delta INT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  idx INT;
  cur INT;
  pname TEXT;
BEGIN
  SELECT (e.ord - 1)::INT, coalesce((e.v->>'stock')::INT, 0), p.name INTO idx, cur, pname
    FROM products p, jsonb_array_elements(coalesce(p.variants, '[]'::jsonb)) WITH ORDINALITY AS e(v, ord)
   WHERE p.id = p_product_id AND lower(e.v->>'color') = lower(p_color) AND e.v->>'size' = p_size
   LIMIT 1
   FOR UPDATE OF p;

  IF idx IS NULL THEN
    RETURN;  -- product or size was removed since the order; nothing to put back
  END IF;
  IF cur + p_delta < 0 THEN
    RAISE EXCEPTION 'Only % left of % in % / %, so this order cannot be re-opened.', cur, pname, p_color, p_size;
  END IF;

  UPDATE products SET variants = jsonb_set(variants, ARRAY[idx::TEXT, 'stock'], to_jsonb(cur + p_delta))
   WHERE id = p_product_id;
  UPDATE inventory SET stock_quantity = greatest(stock_quantity + p_delta, 0), updated_at = NOW()
   WHERE variant_id IN (SELECT id FROM product_variants
                         WHERE product_id = p_product_id AND lower(color) = lower(p_color) AND size = p_size);
END $$;
REVOKE ALL ON FUNCTION adjust_variant_stock(TEXT, TEXT, TEXT, INT) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION order_status_stock() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  it JSONB;
  sign INT;
BEGIN
  IF NEW.status = OLD.status THEN RETURN NEW; END IF;
  IF NEW.status = 'CANCELLED' THEN sign := 1;          -- put stock back
  ELSIF OLD.status = 'CANCELLED' THEN sign := -1;      -- re-opened: take it off again
  ELSE RETURN NEW;
  END IF;

  FOR it IN SELECT value FROM jsonb_array_elements(coalesce(NEW.items, '[]'::jsonb)) LOOP
    PERFORM adjust_variant_stock(it->>'productId', it->>'color', it->>'size', sign * coalesce((it->>'quantity')::INT, 0));
  END LOOP;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS orders_status_stock ON orders;
CREATE TRIGGER orders_status_stock
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION order_status_stock();

-- 2. ORDER RATE LIMITS --------------------------------------------------------
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_ip_hash TEXT;
CREATE INDEX IF NOT EXISTS orders_phone_created_idx ON orders (phone, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_ip_created_idx ON orders (client_ip_hash, created_at DESC);

CREATE OR REPLACE FUNCTION order_rate_limit() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ip TEXT;
  n INT;
BEGIN
  -- Supabase passes the visitor's address in the request headers; absent in the SQL Editor
  ip := nullif(btrim(split_part(
          coalesce(nullif(current_setting('request.headers', true), '')::json->>'x-forwarded-for', ''), ',', 1)), '');
  IF ip IS NOT NULL THEN
    NEW.client_ip_hash := md5('bravadian:' || ip);
  END IF;

  SELECT count(*) INTO n FROM orders
   WHERE phone = NEW.phone AND created_at > NOW() - INTERVAL '1 hour';
  IF n >= 3 THEN
    RAISE EXCEPTION 'You have placed several orders in the last hour. Please message us on WhatsApp to add more.';
  END IF;

  IF NEW.client_ip_hash IS NOT NULL THEN
    SELECT count(*) INTO n FROM orders
     WHERE client_ip_hash = NEW.client_ip_hash AND created_at > NOW() - INTERVAL '1 hour';
    IF n >= 5 THEN
      RAISE EXCEPTION 'Too many orders from this connection in the last hour. Please message us on WhatsApp.';
    END IF;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS orders_rate_limit ON orders;
CREATE TRIGGER orders_rate_limit
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION order_rate_limit();
