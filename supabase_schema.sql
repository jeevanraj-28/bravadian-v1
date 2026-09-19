-- ==========================================================================
-- BRAVADIAN (BRAVE INDIAN) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to set up all tables.
-- ==========================================================================

-- Clean Reset (Safe for initial setup or upgrading from old UUID schema)
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS size_guide CASCADE;
DROP TABLE IF EXISTS site_settings CASCADE;

-- 1. COLLECTIONS TABLE
CREATE TABLE collections (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  compare_price NUMERIC(10, 2),
  collection_slug TEXT NOT NULL REFERENCES collections(slug) ON UPDATE CASCADE,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  fabric TEXT DEFAULT '240 GSM French Interlock Combed Cotton',
  gsm INT DEFAULT 240,
  fit TEXT DEFAULT 'Oversized Boxy Silhouette',
  material TEXT DEFAULT '100% Combed Cotton',
  sku TEXT UNIQUE,
  is_featured BOOLEAN DEFAULT false,
  is_new_drop BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'SOLD_OUT')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  view_type TEXT DEFAULT 'front' CHECK (view_type IN ('front', 'back', 'closeup', 'lifestyle', 'detail')),
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('S', 'M', 'L', 'XL', 'XXL')),
  sku TEXT,
  price_override NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (product_id, color, size)
);

-- 5. INVENTORY TABLE
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  variant_id TEXT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE UNIQUE,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT DEFAULT 2,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SIZE GUIDE TABLE
CREATE TABLE IF NOT EXISTS size_guide (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  size TEXT NOT NULL UNIQUE CHECK (size IN ('S', 'M', 'L', 'XL', 'XXL')),
  chest_inches NUMERIC(4, 1) NOT NULL,
  length_inches NUMERIC(4, 1) NOT NULL,
  shoulder_inches NUMERIC(4, 1) NOT NULL,
  sleeve_inches NUMERIC(4, 1) NOT NULL,
  display_order INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE size_guide ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public READ access (Customer Storefront)
CREATE POLICY "Public Read Collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Read Product Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Product Variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public Read Inventory" ON inventory FOR SELECT USING (true);
CREATE POLICY "Public Read Size Guide" ON size_guide FOR SELECT USING (true);
CREATE POLICY "Public Read Site Settings" ON site_settings FOR SELECT USING (true);

-- Allow Public/Anon ALL access if using anon key in static demo mode
-- (Or restrict to authenticated admin role when Supabase Auth is added)
CREATE POLICY "Allow Anon All Collections" ON collections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Products" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Product Images" ON product_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Product Variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Inventory" ON inventory FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Size Guide" ON size_guide FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow Anon All Site Settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==========================================================================
-- SEED DATA (Default Bravadian Setup)
-- ==========================================================================

-- Insert Collections
INSERT INTO collections (name, slug, description, display_order) VALUES
  ('Anime', 'anime', 'Neo-Tokyo underground graphics meets raw Indian silhouette weight.', 1),
  ('Mythology', 'mythology', 'Ancient warrior spirits deconstructed for modern high-street culture.', 2),
  ('Heritage', 'heritage', 'Rooted in Bharat. Architectural heavy cotton silhouettes.', 3),
  ('Street Culture', 'street-culture', 'Raw brutalist typography and oversized cuts for the relentless.', 4),
  ('Minimal', 'minimal', 'Pure monolithic 240 GSM drape. No distractions.', 5),
  ('New Drop', 'new-drop', 'Limited batch unreleased archive silhouettes.', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert Default Size Guide (Inches)
INSERT INTO size_guide (size, chest_inches, length_inches, shoulder_inches, sleeve_inches, display_order) VALUES
  ('S', 44.0, 28.5, 21.5, 8.5, 1),
  ('M', 46.0, 29.5, 22.5, 9.0, 2),
  ('L', 48.0, 30.5, 23.5, 9.5, 3),
  ('XL', 50.0, 31.5, 24.5, 10.0, 4),
  ('XXL', 52.0, 32.5, 25.5, 10.5, 5)
ON CONFLICT (size) DO NOTHING;

-- Insert Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"brand_name": "BRAVADIAN", "tagline": "BRAVE INDIAN", "currency": "₹", "support_email": "bravadian.clothing@gmail.com"}'::jsonb),
  ('whatsapp', '{"phone_number": "917975362526", "business_name": "BRAVADIAN Official"}'::jsonb),
  ('shipping', '{"shipping_charge": 99, "free_shipping_threshold": 1999, "estimated_days": "3-5 Business Days"}'::jsonb),
  ('social', '{"instagram": "https://instagram.com/bravadian"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
