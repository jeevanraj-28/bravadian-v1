-- Run once in Supabase → SQL Editor, after 006_hide_drafts.sql. Safe to re-run.
-- Removes placeholder tee drawings (data: URIs) that admin edits saved into product photos.
-- The site draws those placeholders itself; only real photo addresses belong in the database.

-- Top-level views (front, back, closeup, lifestyle, ...)
UPDATE products p
   SET images = (
         SELECT nullif(coalesce(jsonb_object_agg(e.k, e.v), '{}'::jsonb), '{}'::jsonb)
           FROM jsonb_each(p.images) AS e(k, v)
          WHERE NOT (jsonb_typeof(e.v) = 'string' AND e.v #>> '{}' LIKE 'data:%'))
 WHERE jsonb_typeof(p.images) = 'object' AND p.images::text LIKE '%data:%';

-- Per-colour photos (images -> colors -> <colour> -> front/model/...)
UPDATE products p
   SET images = p.images || jsonb_build_object('colors', (
         SELECT coalesce(jsonb_object_agg(c.colour, c.kept), '{}'::jsonb)
           FROM (SELECT col.key AS colour,
                        (SELECT jsonb_object_agg(v.key, v.value)
                           FROM jsonb_each(col.value) AS v
                          WHERE NOT (jsonb_typeof(v.value) = 'string' AND v.value #>> '{}' LIKE 'data:%')) AS kept
                   FROM jsonb_each(p.images->'colors') AS col) c
          WHERE c.kept IS NOT NULL))
 WHERE jsonb_typeof(p.images->'colors') = 'object' AND (p.images->'colors')::text LIKE '%data:%';

DELETE FROM product_images WHERE image_url LIKE 'data:%';

-- Check: expect 0
SELECT count(*) AS products_with_drawings FROM products WHERE images::text LIKE '%data:%';
