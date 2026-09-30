-- Run once in Supabase → SQL Editor, after 003_sync_catalog.sql. Safe to re-run.
-- Stops admin saves from overwriting stock that orders have already used up.
--   * Saving a product from the admin panel keeps each existing size's current stock.
--   * Stock changes go through admin_set_stock(), which changes only the sizes you edited.
-- Orders (place_order) and SQL Editor scripts are not affected.

-- 1. KEEP LIVE STOCK ON PRODUCT SAVES ----------------------------------------
-- Runs as the caller (not SECURITY DEFINER), so current_user tells us who is writing:
-- 'authenticated' is the admin panel; place_order() and admin_set_stock() run as the owner.
CREATE OR REPLACE FUNCTION keep_live_stock() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF current_user = 'authenticated'
     AND jsonb_typeof(OLD.variants) = 'array'
     AND jsonb_typeof(NEW.variants) = 'array' THEN
    NEW.variants := coalesce((
      SELECT jsonb_agg(
               CASE WHEN o.v IS NULL THEN n.v
                    ELSE jsonb_set(n.v, '{stock}', coalesce(o.v->'stock', '0'::jsonb)) END
               ORDER BY n.ord)
      FROM jsonb_array_elements(NEW.variants) WITH ORDINALITY AS n(v, ord)
      LEFT JOIN LATERAL (
        SELECT e.v FROM jsonb_array_elements(OLD.variants) AS e(v)
         WHERE lower(e.v->>'color') = lower(n.v->>'color') AND e.v->>'size' = n.v->>'size'
         LIMIT 1) o ON true
    ), '[]'::jsonb);
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS products_keep_live_stock ON products;
CREATE TRIGGER products_keep_live_stock
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION keep_live_stock();

-- 2. CHANGE STOCK FOR CHOSEN SIZES ONLY ---------------------------------------
-- p_changes: [{ "productId": "prod-017", "color": "Black", "size": "M", "stock": 12 }, ...]
CREATE OR REPLACE FUNCTION admin_set_stock(p_changes JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ch JSONB;
  idx INT;
  st INT;
  n INT := 0;
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Only admins can change stock.';
  END IF;
  IF jsonb_typeof(p_changes) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Expected a list of stock changes.';
  END IF;

  FOR ch IN SELECT value FROM jsonb_array_elements(p_changes) LOOP
    st := (ch->>'stock')::INT;
    IF st IS NULL OR st < 0 OR st > 100000 THEN
      RAISE EXCEPTION 'Stock for % / % must be a whole number, 0 or more.', ch->>'color', ch->>'size';
    END IF;

    PERFORM 1 FROM products WHERE id = ch->>'productId' FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % was not found.', ch->>'productId';
    END IF;

    SELECT (e.ord - 1)::INT INTO idx
      FROM products p, jsonb_array_elements(coalesce(p.variants, '[]'::jsonb)) WITH ORDINALITY AS e(v, ord)
     WHERE p.id = ch->>'productId'
       AND lower(e.v->>'color') = lower(ch->>'color') AND e.v->>'size' = ch->>'size'
     LIMIT 1;

    IF idx IS NULL THEN
      UPDATE products
         SET variants = coalesce(variants, '[]'::jsonb)
                        || jsonb_build_array(jsonb_build_object('color', ch->>'color', 'size', ch->>'size', 'stock', st)),
             updated_at = NOW()
       WHERE id = ch->>'productId';
    ELSE
      UPDATE products
         SET variants = jsonb_set(variants, ARRAY[idx::TEXT, 'stock'], to_jsonb(st)), updated_at = NOW()
       WHERE id = ch->>'productId';
    END IF;

    UPDATE inventory SET stock_quantity = st, updated_at = NOW()
     WHERE variant_id IN (SELECT id FROM product_variants
                           WHERE product_id = ch->>'productId'
                             AND lower(color) = lower(ch->>'color') AND size = ch->>'size');
    n := n + 1;
  END LOOP;

  RETURN jsonb_build_object('updated', n);
END $$;

REVOKE ALL ON FUNCTION admin_set_stock(JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION admin_set_stock(JSONB) TO authenticated;
