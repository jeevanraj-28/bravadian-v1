-- Run once in Supabase → SQL Editor, after 005_order_safety.sql. Safe to re-run.
-- Draft products stay private: visitors cannot see them (or their photos and stock)
-- and cannot order them. Signed-in admins still see everything.

-- 1. WHO CAN READ ----------------------------------------------------------------
DROP POLICY IF EXISTS "Public Read Products" ON products;
CREATE POLICY "Public Read Products" ON products FOR SELECT
  USING (status IS DISTINCT FROM 'DRAFT' OR is_admin());

-- The rows below belong to a product; the check on products above applies inside these lookups.
DROP POLICY IF EXISTS "Public Read Product Images" ON product_images;
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_images.product_id));

DROP POLICY IF EXISTS "Public Read Product Variants" ON product_variants;
CREATE POLICY "Public Read Product Variants" ON product_variants FOR SELECT
  USING (EXISTS (SELECT 1 FROM products p WHERE p.id = product_variants.product_id));

DROP POLICY IF EXISTS "Public Read Inventory" ON inventory;
CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT
  USING (EXISTS (SELECT 1 FROM product_variants v WHERE v.id = inventory.variant_id));

-- 2. NO ORDERS FOR DRAFTS ----------------------------------------------------------
-- place_order() reads products with owner rights, so it would still find a draft by its id.
CREATE OR REPLACE FUNCTION order_items_available() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  it JSONB;
BEGIN
  FOR it IN SELECT value FROM jsonb_array_elements(coalesce(NEW.items, '[]'::jsonb)) LOOP
    IF EXISTS (SELECT 1 FROM products WHERE id = it->>'productId' AND status = 'DRAFT') THEN
      RAISE EXCEPTION 'One item in your bag is no longer available. Please remove it and try again.';
    END IF;
  END LOOP;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS orders_items_available ON orders;
CREATE TRIGGER orders_items_available
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION order_items_available();
