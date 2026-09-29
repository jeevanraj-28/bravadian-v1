-- Run once in Supabase → SQL Editor, after 008_brand_copy.sql. Safe to re-run.
--
-- THE BRAVADIAN WALL: photos of real customers wearing Bravadian, added and published from the admin panel.
--
--   wall_posts          what a Wall card shows. Visitors can read a post only when it is PUBLISHED
--                       and the customer GRANTED permission. Admins read and write everything.
--   wall_post_private   order reference and permission note. Admins only; never readable by visitors.
--   wall_activity       a log of adds, edits, publishes and deletes, written by the database itself.
--   wall-photos         storage bucket for the photos (admins upload; files are served publicly by URL,
--                       but nobody can list the bucket, so unpublished photos cannot be discovered).

-- 1. POSTS ---------------------------------------------------------------------------------------

-- Every photo is { "id", "w", "h", "alt", "caption"?, "focal"? [x%, y%], "uploadedAt"?, "sizes": { "480": url, "960": url, "1600": url } }.
-- URLs must be https:// or a site path (/images/...): nothing else can reach an <img> on the Wall.
CREATE OR REPLACE FUNCTION wall_images_valid(imgs JSONB) RETURNS BOOLEAN
LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  img JSONB;
  url JSONB;
BEGIN
  IF jsonb_typeof(imgs) <> 'array' OR jsonb_array_length(imgs) > 6 THEN RETURN false; END IF;
  FOR img IN SELECT value FROM jsonb_array_elements(imgs) LOOP
    IF jsonb_typeof(img) <> 'object'
       OR jsonb_typeof(img->'sizes') <> 'object'
       OR NOT (img ? 'w' AND img ? 'h' AND jsonb_typeof(img->'w') = 'number' AND jsonb_typeof(img->'h') = 'number')
       OR char_length(coalesce(img->>'alt', '')) > 200
       OR char_length(coalesce(img->>'caption', '')) > 200 THEN
      RETURN false;
    END IF;
    FOR url IN SELECT value FROM jsonb_each(img->'sizes') LOOP
      IF jsonb_typeof(url) <> 'string' OR char_length(url #>> '{}') > 500
         OR NOT ((url #>> '{}') ~ '^(https://|/)[^\s<>"''()\\]+$') THEN
        RETURN false;
      END IF;
    END LOOP;
  END LOOP;
  RETURN true;
END $$;

CREATE TABLE IF NOT EXISTS wall_posts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name       TEXT NOT NULL CHECK (char_length(btrim(display_name)) BETWEEN 1 AND 60),
  city               TEXT NOT NULL CHECK (char_length(btrim(city)) BETWEEN 1 AND 60),
  state              TEXT CHECK (state IS NULL OR char_length(state) <= 60),
  country            TEXT NOT NULL DEFAULT 'India' CHECK (char_length(country) BETWEEN 1 AND 60),
  quote              TEXT CHECK (quote IS NULL OR char_length(quote) <= 280),
  product_id         TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name       TEXT CHECK (product_name IS NULL OR char_length(product_name) <= 80),
  product_url        TEXT CHECK (product_url IS NULL OR (char_length(product_url) <= 300 AND product_url ~ '^(https://|/)[^\s<>"''\\]+$')),
  collection_slug    TEXT CHECK (collection_slug IS NULL OR collection_slug ~ '^[a-z0-9-]{1,40}$'),
  images             JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (wall_images_valid(images)),
  featured           BOOLEAN NOT NULL DEFAULT false,
  featured_headline  TEXT CHECK (featured_headline IS NULL OR char_length(featured_headline) <= 80),
  featured_quote     TEXT CHECK (featured_quote IS NULL OR char_length(featured_quote) <= 280),
  featured_image     SMALLINT NOT NULL DEFAULT 0 CHECK (featured_image BETWEEN 0 AND 5),
  -- draft → (pending review from a future customer form) → approved → published; rejected at any point
  status             TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
  permission_status  TEXT NOT NULL DEFAULT 'pending' CHECK (permission_status IN ('pending', 'granted', 'rejected')),
  display_order      INT NOT NULL DEFAULT 0,
  submitted_at       DATE,
  is_demo            BOOLEAN NOT NULL DEFAULT false,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at       TIMESTAMPTZ,
  -- Nothing reaches the Wall without the customer's permission and at least one photo
  CONSTRAINT wall_publish_needs_permission_and_photo
    CHECK (status <> 'published' OR (permission_status = 'granted' AND jsonb_array_length(images) > 0))
);

CREATE INDEX IF NOT EXISTS wall_posts_public_order ON wall_posts (display_order, published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS wall_posts_city ON wall_posts (city) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS wall_posts_featured ON wall_posts (display_order) WHERE status = 'published' AND featured;

-- Customers' Instagram usernames and post links are not kept. If an earlier run of this file created
-- those columns, they are removed here (with anything stored in them).
ALTER TABLE wall_posts DROP COLUMN IF EXISTS instagram_handle, DROP COLUMN IF EXISTS instagram_post_url;

-- 2. PRIVATE DETAILS (admins only) -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wall_post_private (
  post_id          UUID PRIMARY KEY REFERENCES wall_posts(id) ON DELETE CASCADE,
  order_reference  TEXT CHECK (order_reference IS NULL OR char_length(order_reference) <= 60),
  permission_note  TEXT CHECK (permission_note IS NULL OR char_length(permission_note) <= 500),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ACTIVITY LOG ---------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS wall_activity (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  post_id       UUID,              -- no foreign key: the history of a deleted post stays
  display_name  TEXT,
  action        TEXT NOT NULL,
  actor         TEXT,
  at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS wall_activity_at ON wall_activity (at DESC);

-- 4. TIMESTAMPS AND LOG, kept by the database ---------------------------------------------------------
CREATE OR REPLACE FUNCTION wall_posts_touch() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := NOW();
    NEW.created_at := OLD.created_at;
  END IF;
  IF NEW.status = 'published' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'published') THEN
    NEW.published_at := NOW();
  ELSIF NEW.status <> 'published' THEN
    NEW.published_at := NULL;
  END IF;
  NEW.display_name := btrim(NEW.display_name);
  NEW.city := btrim(NEW.city);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS wall_posts_touch ON wall_posts;
CREATE TRIGGER wall_posts_touch BEFORE INSERT OR UPDATE ON wall_posts
  FOR EACH ROW EXECUTE FUNCTION wall_posts_touch();

CREATE OR REPLACE FUNCTION wall_posts_log() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  who TEXT := nullif(auth.jwt() ->> 'email', '');
  act TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    act := CASE WHEN NEW.status = 'published' THEN 'published' ELSE 'added' END;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO wall_activity (post_id, display_name, action, actor) VALUES (OLD.id, OLD.display_name, 'deleted', who);
    RETURN OLD;
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    act := CASE
      WHEN NEW.status = 'published' THEN 'published'
      WHEN OLD.status = 'published' THEN 'unpublished'
      WHEN NEW.status = 'approved'  THEN 'approved'
      WHEN NEW.status = 'rejected'  THEN 'rejected'
      WHEN NEW.status = 'pending'   THEN 'sent to review'
      ELSE 'moved to drafts' END;
  ELSIF NEW.featured IS DISTINCT FROM OLD.featured THEN
    act := CASE WHEN NEW.featured THEN 'featured' ELSE 'unfeatured' END;
  ELSIF (to_jsonb(NEW) - 'display_order' - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'display_order' - 'updated_at') THEN
    act := 'edited';
  ELSE
    RETURN NEW;   -- a reorder alone is not worth a log line
  END IF;
  INSERT INTO wall_activity (post_id, display_name, action, actor) VALUES (NEW.id, NEW.display_name, act, who);
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS wall_posts_log ON wall_posts;
CREATE TRIGGER wall_posts_log AFTER INSERT OR UPDATE OR DELETE ON wall_posts
  FOR EACH ROW EXECUTE FUNCTION wall_posts_log();

-- 5. WHO CAN DO WHAT ------------------------------------------------------------------------------
ALTER TABLE wall_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_post_private ENABLE ROW LEVEL SECURITY;
ALTER TABLE wall_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads published wall posts" ON wall_posts;
CREATE POLICY "Public reads published wall posts" ON wall_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' AND permission_status = 'granted');

DROP POLICY IF EXISTS "Admin manages wall posts" ON wall_posts;
CREATE POLICY "Admin manages wall posts" ON wall_posts FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admin manages wall private details" ON wall_post_private;
CREATE POLICY "Admin manages wall private details" ON wall_post_private FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- The log is written only by the trigger above; admins read it.
DROP POLICY IF EXISTS "Admin reads wall activity" ON wall_activity;
CREATE POLICY "Admin reads wall activity" ON wall_activity FOR SELECT TO authenticated
  USING (is_admin());

-- Visitors never write, and never see private details or the log (row rules above do the rest).
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON wall_posts FROM anon;
REVOKE ALL ON wall_post_private FROM anon;
REVOKE ALL ON wall_activity FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON wall_activity FROM authenticated;

-- 6. PHOTO STORAGE --------------------------------------------------------------------------------
-- Public bucket: a photo's URL works for everyone (the Wall's <img> tags need that), but there is
-- deliberately NO public read policy, so the bucket cannot be listed. Admin uploads must be WebP
-- files named "<post id>/<photo id>-<480|960|1600>.webp" (the admin panel makes these), at most 5 MB.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('wall-photos', 'wall-photos', true, 5242880, ARRAY['image/webp'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/webp'];

DROP POLICY IF EXISTS "Admin manages wall photos" ON storage.objects;
CREATE POLICY "Admin manages wall photos" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'wall-photos' AND public.is_admin())
  WITH CHECK (
    bucket_id = 'wall-photos' AND public.is_admin()
    AND name ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-(480|960|1600)\.webp$'
  );

-- Check: expect the three tables and the bucket
SELECT (SELECT count(*) FROM wall_posts) AS posts,
       (SELECT count(*) FROM wall_post_private) AS private_rows,
       (SELECT count(*) FROM storage.buckets WHERE id = 'wall-photos') AS bucket;
