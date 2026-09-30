-- OPTIONAL. Demo photos for trying out the Bravadian Wall before real customers are added.
-- Run in Supabase → SQL Editor after 009_wall.sql. Safe to re-run.
--
-- These are NOT real customers. Every row has is_demo = true, and the Wall shows a DEMO stamp on each.
-- The photos are the brand's own shoots from the site, not customer photos.
--
-- REMOVE ALL DEMO PHOTOS BEFORE LAUNCH, either:
--   • Admin → The Wall → All posts → "Remove demo posts", or
--   • DELETE FROM wall_posts WHERE is_demo;

-- The Wall shows customer photos only: demo text cards from an earlier version of this file are removed
DELETE FROM wall_posts WHERE is_demo AND kind NOT IN ('photo', 'polaroid');

INSERT INTO wall_posts (id, kind, display_name, city, state, quote, body, product_id, product_name, collection_slug,
                        images, featured, featured_headline, featured_quote, link_url, link_label,
                        status, permission_status, display_order, submitted_at, is_demo)
VALUES
  -- Featured (shown as larger photos)
  ('d0000000-0000-4000-8000-000000000001', 'photo', 'Arjun', 'Bengaluru', 'Karnataka',
   'More than a shirt. It''s something I connect with.', NULL, 'prod-017', 'Hara Hara Mahadeva Tee', 'mythology',
   '[{"id":"demo-1","w":1000,"h":1250,"alt":"Arjun in the black Hara Hara Mahadeva tee beside carved temple stone","sizes":{"960":"/images/products/hara-hara-mahadeva/black-model.webp"}}]',
   true, 'THIS IS WHAT BRAVADIAN LOOKS LIKE.', 'I wear it on days I need to remember where I come from.', NULL, NULL,
   'published', 'granted', 1, '2026-09-20', true),
  ('d0000000-0000-4000-8000-000000000004', 'photo', 'Ishaan', 'Delhi', 'Delhi',
   'Heavy, soft, and it still looks new after a month.', NULL, 'prod-013', 'Bharat Spirit Tee', 'heritage',
   '[{"id":"demo-4","w":1100,"h":1375,"alt":"Ishaan in the Bharat Spirit tee at a temple","sizes":{"960":"/images/products/bharat-spirit/worn-temple.webp"}}]',
   true, 'FOUR SYMBOLS. ONE STORY.', 'Peacock, tiger, lotus, elephant. My grandmother named every one of them.', NULL, NULL,
   'published', 'granted', 2, '2026-09-18', true),

  -- Customers, in wall order (display_order 1, 2, 3...)
  ('d0000000-0000-4000-8000-000000000002', 'photo', 'Rhea', 'Mumbai', 'Maharashtra',
   'Wore it to college. Three people asked where it''s from.', NULL, 'prod-015', 'Born to Rise Tee', 'street-culture',
   '[{"id":"demo-2","w":1000,"h":1250,"alt":"Rhea in the white Born to Rise tee on a city street","sizes":{"960":"/images/products/born-to-rise/white-model.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 1, '2026-09-22', true),
  ('d0000000-0000-4000-8000-000000000003', 'photo', 'Kabir', 'Hyderabad', 'Telangana',
   'The back print says everything I don''t.', NULL, 'prod-015', 'Born to Rise Tee', 'street-culture',
   '[{"id":"demo-3","w":1000,"h":1250,"alt":"Kabir in the black Born to Rise tee at night","sizes":{"960":"/images/products/born-to-rise/black-model.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 3, '2026-09-23', true),
  ('d0000000-0000-4000-8000-000000000005', 'photo', 'Ananya', 'Chennai', 'Tamil Nadu',
   'Red on red. Festival ready.', NULL, 'prod-017', 'Hara Hara Mahadeva Tee', 'mythology',
   '[{"id":"demo-5","w":1000,"h":1250,"alt":"Ananya in the red Hara Hara Mahadeva tee","sizes":{"960":"/images/products/hara-hara-mahadeva/red-model.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 4, '2026-09-24', true),
  ('d0000000-0000-4000-8000-000000000008', 'photo', 'The Craft Atlas crew', 'Hyderabad', 'Telangana',
   'We bought three. Nobody is giving theirs back.', NULL, 'prod-014', 'Indian Craft Atlas Tee', 'heritage',
   '[{"id":"demo-8","w":1672,"h":941,"alt":"Friends in Bravadian tees on stone steps","sizes":{"960":"/images/lookbook/lb-hero.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 6, '2026-09-21', true),
  ('d0000000-0000-4000-8000-000000000006', 'photo', 'Vikram', 'Pune', 'Maharashtra',
   'Quiet on the front, loud on the back. Exactly my style.', NULL, 'prod-013', 'Bharat Spirit Tee', 'heritage',
   '[{"id":"demo-6","w":1000,"h":1500,"alt":"Vikram in the Bharat Spirit tee in the studio","sizes":{"960":"/images/products/bharat-spirit/worn-studio.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 7, '2026-09-25', true),
  ('d0000000-0000-4000-8000-000000000007', 'photo', 'Meera', 'Bengaluru', 'Karnataka',
   'Royal blue was the right call.', NULL, 'prod-017', 'Hara Hara Mahadeva Tee', 'mythology',
   '[{"id":"demo-7","w":1000,"h":1250,"alt":"Meera in the royal blue Hara Hara Mahadeva tee","sizes":{"960":"/images/products/hara-hara-mahadeva/royal-blue-model.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 9, '2026-09-26', true),
  ('d0000000-0000-4000-8000-000000000009', 'photo', 'Sana', 'Mumbai', 'Maharashtra',
   'Ivory with the chant down the side. Simple and strong.', NULL, 'prod-017', 'Hara Hara Mahadeva Tee', 'mythology',
   '[{"id":"demo-9","w":1000,"h":1250,"alt":"Sana in the ivory Hara Hara Mahadeva tee","sizes":{"960":"/images/products/hara-hara-mahadeva/ivory-model.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'published', 'granted', 10, '2026-09-27', true),

  -- Waiting for permission, so it stays off the Wall
  ('d0000000-0000-4000-8000-000000000010', 'photo', 'Rohan', 'Chennai', 'Tamil Nadu',
   'Waiting on permission, so this one stays off the Wall.', NULL, 'prod-013', 'Bharat Spirit Tee', 'heritage',
   '[{"id":"demo-10","w":1000,"h":1250,"alt":"Rohan in a Bravadian tee","sizes":{"960":"/images/lookbook/lb-look-01.webp"}}]',
   false, NULL, NULL, NULL, NULL, 'approved', 'pending', 12, '2026-09-28', true)
ON CONFLICT (id) DO UPDATE SET
  kind = EXCLUDED.kind, display_name = EXCLUDED.display_name, city = EXCLUDED.city, state = EXCLUDED.state,
  quote = EXCLUDED.quote, body = EXCLUDED.body, product_id = EXCLUDED.product_id, product_name = EXCLUDED.product_name,
  collection_slug = EXCLUDED.collection_slug, images = EXCLUDED.images, featured = EXCLUDED.featured,
  featured_headline = EXCLUDED.featured_headline, featured_quote = EXCLUDED.featured_quote,
  link_url = EXCLUDED.link_url, link_label = EXCLUDED.link_label, status = EXCLUDED.status,
  permission_status = EXCLUDED.permission_status, display_order = EXCLUDED.display_order,
  submitted_at = EXCLUDED.submitted_at, is_demo = true;

-- Check: expect 9 demo photos on the Wall; the 10th is waiting for permission
SELECT count(*) FILTER (WHERE status = 'published') AS on_the_wall, count(*) AS demo_photos FROM wall_posts WHERE is_demo;
