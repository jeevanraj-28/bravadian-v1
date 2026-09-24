-- Run once in Supabase → SQL Editor, after supabase_schema.sql.
-- Then add your admin login email:  INSERT INTO admin_users (email) VALUES ('you@example.com');

-- 1. ADMIN ALLOW-LIST ------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_users (
  email TEXT PRIMARY KEY CHECK (email = lower(email))
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE email = lower(auth.jwt() ->> 'email'));
$$;

-- Any signed-in Supabase user could write before; now only listed admins can.
DO $$
DECLARE
  tbls TEXT[] := ARRAY['collections','products','product_images','product_variants','inventory','size_guide','site_settings'];
  t TEXT;
  r RECORD;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
           WHERE schemaname = 'public' AND tablename = ANY (tbls) AND policyname LIKE 'Admin %' LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
  FOREACH t IN ARRAY tbls LOOP
    EXECUTE format('CREATE POLICY %I ON public.%I FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin())',
                   'Admin Write ' || t, t);
  END LOOP;
END $$;

-- 1b. LAUNCH PRICING --------------------------------------------------------
ALTER TABLE products ADD COLUMN IF NOT EXISTS launch_price NUMERIC(10, 2);
INSERT INTO site_settings (key, value) VALUES ('launch', '{"ends_at": "2026-10-01T23:59:59+05:30"}')
  ON CONFLICT (key) DO NOTHING;
-- Regular oversized tees: MRP 799, offer 699, launch 649
UPDATE products SET price = 699, compare_price = 799, launch_price = 649 WHERE name NOT ILIKE '%JACKET%';

-- 1c. PRODUCT IMAGE STORAGE (public read, admins upload) -----------------------
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true)
  ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
DROP POLICY IF EXISTS "Admin write product images" ON storage.objects;
CREATE POLICY "Admin write product images" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- 2. ORDERS ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS orders (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  landmark TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping NUMERIC(10, 2) NOT NULL,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW'
    CHECK (status IN ('NEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin Manage Orders" ON orders;
CREATE POLICY "Admin Manage Orders" ON orders FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
-- No public policy: customers can only create orders through place_order().

-- 3. PLACE ORDER -----------------------------------------------------------
-- Prices, stock and shipping come from the database, never from the browser.
CREATE OR REPLACE FUNCTION place_order(p_customer JSONB, p_items JSONB)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  it JSONB;
  prod RECORD;
  qty INT;
  idx INT;
  stock INT;
  line_items JSONB := '[]'::jsonb;
  sub NUMERIC := 0;
  fee NUMERIC;
  threshold NUMERIC;
  ship NUMERIC;
  ord_no TEXT;
  unit NUMERIC;
  launch_end TIMESTAMPTZ;
BEGIN
  SELECT (value->>'ends_at')::TIMESTAMPTZ INTO launch_end FROM site_settings WHERE key = 'launch';

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array'
     OR jsonb_array_length(p_items) = 0 OR jsonb_array_length(p_items) > 20 THEN
    RAISE EXCEPTION 'Your bag is empty.';
  END IF;

  IF coalesce(p_customer->>'phone', '') !~ '^[6-9][0-9]{9}$'
     OR coalesce(p_customer->>'pincode', '') !~ '^[0-9]{6}$'
     OR btrim(coalesce(p_customer->>'name', '')) = ''
     OR btrim(coalesce(p_customer->>'address', '')) = ''
     OR btrim(coalesce(p_customer->>'city', '')) = ''
     OR btrim(coalesce(p_customer->>'state', '')) = '' THEN
    RAISE EXCEPTION 'Please check your delivery details.';
  END IF;

  FOR it IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    qty := (it->>'quantity')::INT;
    IF qty IS NULL OR qty < 1 OR qty > 10 THEN
      RAISE EXCEPTION 'Quantity must be between 1 and 10.';
    END IF;

    SELECT id, name, price, launch_price, variants, is_coming_soon INTO prod
    FROM products WHERE id = it->>'productId' FOR UPDATE;
    IF NOT FOUND OR prod.is_coming_soon THEN
      RAISE EXCEPTION 'One item in your bag is no longer available. Please remove it and try again.';
    END IF;

    SELECT (e.ord - 1)::INT, (e.v->>'stock')::INT INTO idx, stock
    FROM jsonb_array_elements(coalesce(prod.variants, '[]'::jsonb)) WITH ORDINALITY AS e(v, ord)
    WHERE lower(e.v->>'color') = lower(it->>'color') AND e.v->>'size' = it->>'size';

    IF idx IS NULL THEN
      RAISE EXCEPTION '% in % / % is not available.', prod.name, it->>'color', it->>'size';
    END IF;
    IF coalesce(stock, 0) < qty THEN
      RAISE EXCEPTION 'Only % left of % in % / %.', coalesce(stock, 0), prod.name, it->>'color', it->>'size';
    END IF;

    UPDATE products
       SET variants = jsonb_set(variants, ARRAY[idx::TEXT, 'stock'], to_jsonb(stock - qty))
     WHERE id = prod.id;

    UPDATE inventory SET stock_quantity = greatest(stock_quantity - qty, 0), updated_at = NOW()
     WHERE variant_id IN (SELECT id FROM product_variants
                          WHERE product_id = prod.id AND lower(color) = lower(it->>'color') AND size = it->>'size');

    unit := CASE WHEN prod.launch_price IS NOT NULL AND launch_end IS NOT NULL AND NOW() < launch_end
                 THEN prod.launch_price ELSE prod.price END;
    sub := sub + unit * qty;
    line_items := line_items || jsonb_build_object(
      'productId', prod.id, 'name', prod.name, 'color', it->>'color',
      'size', it->>'size', 'quantity', qty, 'price', unit);
  END LOOP;

  SELECT (value->>'shipping_charge')::NUMERIC, (value->>'free_shipping_threshold')::NUMERIC
    INTO fee, threshold FROM site_settings WHERE key = 'shipping';
  ship := CASE WHEN sub >= coalesce(threshold, 1999) THEN 0 ELSE coalesce(fee, 99) END;

  ord_no := 'BRV-' || to_char(NOW() AT TIME ZONE 'Asia/Kolkata', 'YYMMDD') || '-'
            || upper(substr(md5(random()::TEXT || clock_timestamp()::TEXT), 1, 5));

  INSERT INTO orders (order_number, customer_name, phone, email, address, city, state, pincode, landmark,
                      items, subtotal, shipping, total)
  VALUES (ord_no,
          left(btrim(p_customer->>'name'), 120),
          p_customer->>'phone',
          left(nullif(btrim(p_customer->>'email'), ''), 160),
          left(btrim(p_customer->>'address'), 400),
          left(btrim(p_customer->>'city'), 80),
          left(btrim(p_customer->>'state'), 80),
          p_customer->>'pincode',
          left(nullif(btrim(p_customer->>'landmark'), ''), 160),
          line_items, sub, ship, sub + ship);

  RETURN jsonb_build_object('order_number', ord_no, 'subtotal', sub, 'shipping', ship, 'total', sub + ship);
END $$;

REVOKE ALL ON FUNCTION place_order(JSONB, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION place_order(JSONB, JSONB) TO anon, authenticated;
REVOKE ALL ON FUNCTION is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated;
