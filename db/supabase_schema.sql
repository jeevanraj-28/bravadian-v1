-- ==========================================================================
-- BRAVADIAN (BRAVE INDIAN) - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to set up all tables and seed data.
-- ==========================================================================

-- Clean Reset (Safe for initial setup or schema upgrades)
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
  is_coming_soon BOOLEAN DEFAULT false,
  relic_tag TEXT,
  relic_badge TEXT,
  images JSONB,
  variants JSONB,
  status TEXT DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'SOLD_OUT')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCT IMAGES TABLE
CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  view_type TEXT DEFAULT 'front' CHECK (view_type IN ('hero', 'front', 'back', 'closeup', 'lifestyle', 'detail')),
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

-- Allow Authenticated Admin WRITE access (INSERT, UPDATE, DELETE)
-- Only users logged in via Supabase Auth can modify data.
-- To set up admin: create a user in Supabase Auth dashboard,
-- then use that user's session to access the admin CMS.
CREATE POLICY "Admin Insert Collections" ON collections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Collections" ON collections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Collections" ON collections FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Products" ON products FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Products" ON products FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Product Images" ON product_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Product Images" ON product_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Product Images" ON product_images FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Product Variants" ON product_variants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Product Variants" ON product_variants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Product Variants" ON product_variants FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Inventory" ON inventory FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Inventory" ON inventory FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Inventory" ON inventory FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Size Guide" ON size_guide FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Size Guide" ON size_guide FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Size Guide" ON size_guide FOR DELETE TO authenticated USING (true);

CREATE POLICY "Admin Insert Site Settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Site Settings" ON site_settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Delete Site Settings" ON site_settings FOR DELETE TO authenticated USING (true);

-- ==========================================================================
-- SEED DATA (Official Bravadian Multi-Chapter Manifest)
-- ==========================================================================

-- 1. Insert Collections (The Ten Civilizational Chapters)
INSERT INTO collections (name, slug, description, image_url, is_active, display_order) VALUES
  ('ALL', 'all', 'Browse and secure your relics from our structural multi-chapter manifest. Every garment is heavily engineered and strictly numbered.', NULL, true, 0),
  ('HERITAGE', 'heritage', 'Rooted in the earth of Bharat. Cultural brutalism and ancient stone friezes.', NULL, true, 1),
  ('GARUDA', 'garuda', 'Geometric winged dissent. Sovereign avian iconography on 240+ GSM drape.', NULL, true, 2),
  ('ASURA', 'asura', 'Chaos doctrine // Duality. Underground mythological armor and sun-burnt patinas.', NULL, true, 3),
  ('BERUNDA', 'berunda', 'Twin-headed sovereignty. Heavy canvas and monumental bullion embroidery.', NULL, true, 4),
  ('CHOLA', 'chola', 'Maritime dominion in bronze. Imperial temple armor and tactical outer shells.', NULL, true, 5),
  ('SIMHA', 'simha', 'Lion crest of sovereign pillars. Heavyweight armor forged in stone silence.', NULL, false, 6),
  ('NAGARA', 'nagara', 'Spires reaching toward heavens. Serpent coil geometry and architectural relief.', NULL, false, 7),
  ('KALPA', 'kalpa', 'Cycles of cosmic dissolution. Monolithic granite block with geometric engravings.', NULL, false, 8),
  ('AYUDHA', 'ayudha', 'Weapons forged in stone silence. Dark techwear accessory with high-spec modular straps.', NULL, false, 9),
  ('DRAVIDA', 'dravida', 'Brutalist temple gopuram tower silhouette towering vertically into midnight sky.', NULL, false, 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  image_url = COALESCE(collections.image_url, EXCLUDED.image_url),
  is_active = EXCLUDED.is_active,
  display_order = EXCLUDED.display_order;

-- 2. Insert Default Products (All 12 Official Relics)
INSERT INTO products (
  id, name, slug, description, price, compare_price, collection_slug,
  tags, fabric, gsm, fit, material, sku,
  is_featured, is_new_drop, is_coming_soon, relic_tag, relic_badge, status, images, variants
) VALUES
  (
    'prod-001',
    'HOYSALA OVERSIZED RELIC TEE',
    'hoysala-oversized-relic-tee',
    'A severe tactical garment engineered from 280 GSM heavyweight French Terry. Imprinted with sacred architectural friezes from the historic Halebidu temple complex, modified as modern metropolitan armor.',
    4800, 5800, 'heritage',
    ARRAY['oversized', 'hoysala', 'heavyweight', '280gsm', 'heritage'],
    '280 GSM HEAVYWEIGHT FRENCH TERRY', 280, 'Oversized Boxy', '280 GSM Long-Staple Indian Combed Cotton',
    'BRVD-HYS-01', true, true, false, 'RELIC 01', 'PRE-ORDER ACTIVATED', 'PUBLISHED',
    NULL,
    '[{"color": "Obsidian Black", "size": "S", "stock": 8}, {"color": "Obsidian Black", "size": "M", "stock": 15}, {"color": "Obsidian Black", "size": "L", "stock": 12}, {"color": "Obsidian Black", "size": "XL", "stock": 6}, {"color": "Obsidian Black", "size": "XXL", "stock": 4}]'::jsonb
  ),
  (
    'prod-002',
    'HOYSALA LINGESHWARA RELIC TEE',
    'hoysala-lingeshwara-relic-tee',
    'Engineered boxy heavyweight silhouette featuring the sacred Lingeshwara stone sanctuary geometry across dropped shoulder lines.',
    3200, 3800, 'heritage',
    ARRAY['heritage', 'hoysala', 'lingeshwara', 'heavyweight', '240gsm'],
    '240 GSM FRENCH TERRY // BOX FIT SILHOUETTE', 240, 'Boxy Drop Shoulder', '240 GSM Long-Staple Combed Cotton',
    'BRVD-LNG-02', true, true, false, 'RELIC 02', '300 NUMBERED', 'PUBLISHED',
    NULL,
    '[{"color": "Washed Black", "size": "S", "stock": 6}, {"color": "Washed Black", "size": "M", "stock": 10}, {"color": "Washed Black", "size": "L", "stock": 8}, {"color": "Washed Black", "size": "XL", "stock": 4}, {"color": "Washed Black", "size": "XXL", "stock": 3}]'::jsonb
  ),
  (
    'prod-003',
    'SRI YOGA SARASVATHESHWARA TEE',
    'sri-yoga-sarasvatheshwara-tee',
    'Monumental archival 300 GSM cotton tee presenting the multi-armed Yogic sovereign deity in pure metallic gold foil screenprint.',
    3600, 4200, 'garuda',
    ARRAY['garuda', 'mythology', 'gold-foil', '300gsm', 'yoga'],
    '300 GSM ARCHIVAL COTTON // GOLD FOIL PRINT', 300, 'Architectural Boxy', '300 GSM 100% Archival Cotton',
    'BRVD-YOG-03', true, true, false, 'RELIC 03', 'EDITION NUMBERED', 'PUBLISHED',
    NULL,
    '[{"color": "Obsidian Black", "size": "S", "stock": 7}, {"color": "Obsidian Black", "size": "M", "stock": 12}, {"color": "Obsidian Black", "size": "L", "stock": 9}, {"color": "Obsidian Black", "size": "XL", "stock": 5}, {"color": "Obsidian Black", "size": "XXL", "stock": 3}]'::jsonb
  ),
  (
    'prod-004',
    'NRITYA PRIMACY DESCENSION JACKET',
    'nritya-primacy-descension-jacket',
    'Heavyweight tactical bomber constructed in 450 GSM canvas shell with custom antique brass zippers, rib knit cuffs, and tonal warrior embroidery.',
    6500, 7999, 'chola',
    ARRAY['chola', 'jacket', 'bomber', 'nritya', '450gsm', 'heritage'],
    '450 GSM DUCK CANVAS // BOMBER ARCHITECTURE', 450, 'Bomber Flight Cut', '450 GSM Heavy Canvas & Satin Lining',
    'BRVD-NRT-04', true, true, false, 'ARTIFACT 04', '150 VAULT EDITION', 'PUBLISHED',
    NULL,
    '[{"color": "Pitch Black", "size": "S", "stock": 5}, {"color": "Pitch Black", "size": "M", "stock": 8}, {"color": "Pitch Black", "size": "L", "stock": 6}, {"color": "Pitch Black", "size": "XL", "stock": 3}, {"color": "Pitch Black", "size": "XXL", "stock": 2}]'::jsonb
  ),
  (
    'prod-005',
    'ASURA SOLAR FIRE OVERSIZED TEE',
    'asura-solar-fire-oversized-tee',
    'Sun-burnt charcoal compact jersey featuring high-density sacred Sanskrit hymn "ॐ सह नाववतु" and radiating solar celestial sigil.',
    2900, 3500, 'asura',
    ARRAY['asura', 'mythology', 'solar-fire', '280gsm', 'oversized'],
    '280 GSM COMPACT JERSEY // SUN BURNT PATINA', 280, 'Relaxed Drop-Shoulder', '280 GSM 100% Combed Cotton',
    'BRVD-ASR-05', true, true, false, 'RELIC 05', 'PROTOTYPE LOCKED', 'PUBLISHED',
    NULL,
    '[{"color": "Washed Charcoal", "size": "S", "stock": 7}, {"color": "Washed Charcoal", "size": "M", "stock": 11}, {"color": "Washed Charcoal", "size": "L", "stock": 8}, {"color": "Washed Charcoal", "size": "XL", "stock": 4}, {"color": "Washed Charcoal", "size": "XXL", "stock": 2}]'::jsonb
  ),
  (
    'prod-006',
    'BERUNDA DUAL VISION ARMOR TEE',
    'berunda-dual-vision-armor-tee',
    '280 GSM heavyweight cotton tee with monumental twin-headed Gandaberunda imperial crest rendered in antique gold embroidery.',
    3500, 4200, 'berunda',
    ARRAY['berunda', 'heritage', 'embroidery', '280gsm', 'armor'],
    '280 GSM HEAVY TERRY // GOLD EMBROIDERY', 280, 'Oversized', '100% Combed Heavy Cotton',
    'BRVD-BRD-06', true, true, true, 'RELIC 06', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Pitch Black", "size": "S", "stock": 5}, {"color": "Pitch Black", "size": "M", "stock": 8}, {"color": "Pitch Black", "size": "L", "stock": 6}, {"color": "Pitch Black", "size": "XL", "stock": 3}, {"color": "Pitch Black", "size": "XXL", "stock": 2}]'::jsonb
  ),
  (
    'prod-007',
    'BRAVADIAN NINETAILS',
    'bravadian-ninetails',
    '240 GSM heavyweight oversized silhouette featuring high-density back-print of the mythical celestial fox spirit. Constructed with double-combed long-staple yarns for architectural boxy drape.',
    1499, 1999, 'heritage',
    ARRAY['oversized', 'anime', 'heavyweight', '240gsm'],
    '240 GSM INTERLOCK COTTON', 240, 'Oversized', '100% Combed Heavy Interlock Cotton',
    'BRVD-NT-07', false, false, true, 'ARCHIVE 07', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Black", "size": "S", "stock": 8}, {"color": "Black", "size": "M", "stock": 12}, {"color": "Black", "size": "L", "stock": 0}, {"color": "Black", "size": "XL", "stock": 5}, {"color": "Black", "size": "XXL", "stock": 2}]'::jsonb
  ),
  (
    'prod-008',
    'BRAVADIAN GARUDA REBEL',
    'bravadian-garuda-rebel',
    'An ode to the supreme avian sovereign. Geometric feathered wingspan printed in reflective metallic pigments across dropped shoulder seams on 240 GSM heavy French cotton.',
    1699, 2199, 'garuda',
    ARRAY['mythology', 'garuda', 'heavyweight', '240gsm'],
    '240 GSM HEAVYWEIGHT FRENCH COTTON', 240, 'Oversized', '100% Combed Cotton Heavy Interlock',
    'BRVD-GRD-08', true, false, true, 'ARCHIVE 08', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Charcoal", "size": "S", "stock": 5}, {"color": "Charcoal", "size": "M", "stock": 8}, {"color": "Charcoal", "size": "L", "stock": 6}, {"color": "Charcoal", "size": "XL", "stock": 0}, {"color": "Charcoal", "size": "XXL", "stock": 3}]'::jsonb
  ),
  (
    'prod-009',
    'BRAVADIAN MONOLITH BHARAT',
    'bravadian-monolith-bharat',
    'Rooted in Indian soil. 240 GSM high-density knit featuring brutalist longitude coordinates (28°36 N 77°12 E) and architectural Ashoka geometry across the back yoke.',
    1599, 2099, 'heritage',
    ARRAY['heritage', 'bharat', 'oversized', '240gsm'],
    '240 GSM HIGH DENSITY KNIT', 240, 'Oversized', '100% Combed Cotton',
    'BRVD-BHT-09', true, true, true, 'ARCHIVE 09', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Black", "size": "S", "stock": 12}, {"color": "Black", "size": "M", "stock": 15}, {"color": "Black", "size": "L", "stock": 8}, {"color": "Black", "size": "XL", "stock": 6}, {"color": "Black", "size": "XXL", "stock": 4}]'::jsonb
  ),
  (
    'prod-010',
    'BRAVADIAN CYBER REBEL',
    'bravadian-cyber-rebel',
    'Underground dystopian Indian streetwear. High-impact typography with anti-surveillance warning tapes engineered on 240 GSM ultra-heavy cotton.',
    1499, 1899, 'chola',
    ARRAY['street', 'cyber', 'oversized', '240gsm', 'chola'],
    '240 GSM ULTRA-HEAVY COTTON', 240, 'Oversized', '100% Combed Cotton',
    'BRVD-CR-10', false, false, true, 'ARCHIVE 10', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Pitch Black", "size": "S", "stock": 4}, {"color": "Pitch Black", "size": "M", "stock": 6}, {"color": "Pitch Black", "size": "L", "stock": 3}, {"color": "Pitch Black", "size": "XL", "stock": 2}, {"color": "Pitch Black", "size": "XXL", "stock": 0}]'::jsonb
  ),
  (
    'prod-011',
    'BRAVADIAN ESSENTIAL 240',
    'bravadian-essential-240',
    'Zero graphics. Zero noise. Pure structural drape, thick 1.25" Lycra rib collar, and drop-shoulder presence. Designed to outlast seasonal trends.',
    1299, 1599, 'heritage',
    ARRAY['minimal', 'essential', 'plain', '240gsm', 'heritage'],
    '240 GSM COMBED INTERLOCK', 240, 'Oversized', '100% Combed Cotton Heavy Interlock',
    'BRVD-ES-11', false, false, true, 'ARCHIVE 11', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Pure Black", "size": "S", "stock": 20}, {"color": "Pure Black", "size": "M", "stock": 25}, {"color": "Pure Black", "size": "L", "stock": 18}, {"color": "Pure Black", "size": "XL", "stock": 15}, {"color": "Pure Black", "size": "XXL", "stock": 8}]'::jsonb
  ),
  (
    'prod-012',
    'BRAVADIAN ASHOKA EMBER',
    'bravadian-ashoka-ember',
    'Unreleased archive drop. 24-spoke Solar Chakra motif in neon solar ember across the chest and oversized drop spine. Limited to 500 numbered pieces.',
    1799, 2299, 'asura',
    ARRAY['asura', 'ashoka', 'limited', '240gsm'],
    '240 GSM COMBED HEAVY COTTON', 240, 'Oversized', '100% Combed Heavy Cotton',
    'BRVD-ASH-12', true, true, true, 'ARCHIVE 12', 'COMING SOON', 'PUBLISHED',
    NULL,
    '[{"color": "Black Ember", "size": "S", "stock": 5}, {"color": "Black Ember", "size": "M", "stock": 7}, {"color": "Black Ember", "size": "L", "stock": 4}, {"color": "Black Ember", "size": "XL", "stock": 0}, {"color": "Black Ember", "size": "XXL", "stock": 2}]'::jsonb
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  compare_price = EXCLUDED.compare_price,
  collection_slug = EXCLUDED.collection_slug,
  tags = EXCLUDED.tags,
  fabric = EXCLUDED.fabric,
  gsm = EXCLUDED.gsm,
  fit = EXCLUDED.fit,
  material = EXCLUDED.material,
  sku = EXCLUDED.sku,
  is_featured = EXCLUDED.is_featured,
  is_new_drop = EXCLUDED.is_new_drop,
  is_coming_soon = EXCLUDED.is_coming_soon,
  relic_tag = EXCLUDED.relic_tag,
  relic_badge = EXCLUDED.relic_badge,
  images = EXCLUDED.images,
  variants = EXCLUDED.variants,
  status = EXCLUDED.status,
  updated_at = NOW();

-- 3. Insert Default Size Guide (Inches)
INSERT INTO size_guide (size, chest_inches, length_inches, shoulder_inches, sleeve_inches, display_order) VALUES
  ('S', 44.0, 28.5, 21.5, 8.5, 1),
  ('M', 46.0, 29.5, 22.5, 9.0, 2),
  ('L', 48.0, 30.5, 23.5, 9.5, 3),
  ('XL', 50.0, 31.5, 24.5, 10.0, 4),
  ('XXL', 52.0, 32.5, 25.5, 10.5, 5)
ON CONFLICT (size) DO UPDATE SET
  chest_inches = EXCLUDED.chest_inches,
  length_inches = EXCLUDED.length_inches,
  shoulder_inches = EXCLUDED.shoulder_inches,
  sleeve_inches = EXCLUDED.sleeve_inches,
  display_order = EXCLUDED.display_order;

-- 4. Insert Site Settings
INSERT INTO site_settings (key, value) VALUES
  ('general', '{"brand_name": "BRAVADIAN", "tagline": "BRAVE INDIAN", "currency": "₹", "support_email": "bravadian.clothing@gmail.com"}'::jsonb),
  ('whatsapp', '{"phone_number": "917975362526", "business_name": "BRAVADIAN Official"}'::jsonb),
  ('shipping', '{"shipping_charge": 99, "free_shipping_threshold": 1999, "estimated_days": "3-5 Business Days"}'::jsonb),
  ('social', '{"instagram": "https://instagram.com/bravadian"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
