-- Run once in Supabase → SQL Editor, after 007_clean_placeholders.sql. Safe to re-run.
-- Brand copy refresh: plain-language product text, collection lines, homepage marketing text,
-- and free delivery on every order. Prices, stock and photos are not touched.

BEGIN;

-- 1. Free delivery on every order (the admin form used to put back ₹99 / ₹1,999)
UPDATE site_settings
   SET value = coalesce(value, '{}'::jsonb) || jsonb_build_object('shipping_charge', 0, 'free_shipping_threshold', 0, 'estimated_days', '3–5 working days')
 WHERE key = 'shipping';

-- 2. Homepage marketing text (merged in, so the headline and other admin fields stay as they are)
UPDATE site_settings
   SET value = coalesce(value, '{}'::jsonb) || $q${"announcementText":"🇮🇳 FREE DELIVERY ACROSS INDIA ✦ CUSTOM & PERSONALISED TEES ON WHATSAPP ✦ YOUR NAME, YOUR DESIGN, YOUR SIZE ✦ ORIGINAL INDIAN ARTWORK","announcementWaText":"CUSTOM ORDERS ON WHATSAPP","heroTag":"[ 🇮🇳 INDIAN ROOTS. MODERN FORM. ]","heroDesc":"Original Indian art on heavy, oversized cotton tees. Every design carries a story, from temple walls to folk paintings. Soft to wear, made to last, delivered free across India.","heroTicker":"🇮🇳 A STORY WORTH WEARING ✦ ORIGINAL INDIAN ARTWORK ✦ HEAVY 240 GSM COTTON ✦ WASHED SOFT ✦ MADE IN INDIA ✦ FREE DELIVERY ACROSS INDIA"}$q$::jsonb
 WHERE key = 'content';

-- 3. Collection descriptions
UPDATE collections SET description = $q$Every Bravadian tee in one place. Original Indian artwork on heavy, oversized cotton.$q$ WHERE slug = $q$all$q$;
UPDATE collections SET description = $q$Anime and manga-style artwork, drawn with an Indian heart.$q$ WHERE slug = $q$anime$q$;
UPDATE collections SET description = $q$Shiva, Ganesha, Garuda and the stories we grew up hearing, drawn bold.$q$ WHERE slug = $q$mythology$q$;
UPDATE collections SET description = $q$Temple walls, folk paintings and national symbols, carried from India’s crafts onto cotton.$q$ WHERE slug = $q$heritage$q$;
UPDATE collections SET description = $q$Loud type and street art inspired by the walls of Indian cities.$q$ WHERE slug = $q$street-culture$q$;
UPDATE collections SET description = $q$Clean designs and quiet symbols for every day.$q$ WHERE slug = $q$minimal$q$;

-- 4. One wording for fit and fabric on every tee
UPDATE products SET fit = $q$Oversized, drop shoulder$q$, fabric = $q$240 GSM French Terry cotton, bio + silicone washed$q$, material = $q$240 GSM French Terry cotton, bio + silicone washed$q$, updated_at = NOW()
 WHERE id IN ($q$prod-018$q$, $q$prod-017$q$, $q$prod-016$q$, $q$prod-015$q$, $q$prod-014$q$, $q$prod-013$q$, $q$prod-003$q$, $q$prod-005$q$, $q$prod-007$q$, $q$prod-008$q$, $q$prod-009$q$, $q$prod-010$q$, $q$prod-011$q$, $q$prod-012$q$);

-- 5. Product descriptions and stories
UPDATE products SET description = $q$Shiva's third eye rises over the Himalaya, circled by the moon and the words See Beyond. Printed large across the back, with a small BRAVADIAN mark on the left chest. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-018$q$;
UPDATE products SET description = $q$Om Namah Shivaya in Devanagari beneath a trishul, printed as one vertical line down the left chest, over the heart. Plain back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-017$q$;
UPDATE products SET description = $q$Lord Ganesha seated before a red sun, with Om and Vakratunda in brush-stroke Devanagari across the back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-016$q$;
UPDATE products SET description = $q$A black eagle with blazing red wings under the words Born to Rise, printed large across the back, with a small BRAVADIAN mark on the left chest. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-015$q$;
UPDATE products SET description = $q$A map of India drawn in its crafts. Kalamkari, Warli, Madhubani, Pattachitra, Phad, Gond, Cheriyal, Pichwai and Ikat come together around one elephant on the back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-014$q$;
UPDATE products SET description = $q$The peacock, the tiger, the lotus and the elephant: four symbols of India drawn together as one story across the back, with a small BRAVADIAN mark on the chest. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, updated_at = NOW() WHERE id = $q$prod-013$q$;
UPDATE products SET description = $q$The many-armed goddess of learning, printed in gold. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$For the ones who never stop learning. Knowledge, music and art, held in many hands at once.$q$, updated_at = NOW() WHERE id = $q$prod-003$q$;
UPDATE products SET description = $q$A blazing sun printed large on the back, with the Sanskrit line ॐ सह नाववतु (Om Saha Navavatu). Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$Om Saha Navavatu is an old Sanskrit prayer that asks for protection together, teacher and student side by side. Here it sits beside a sun that never stops burning.$q$, updated_at = NOW() WHERE id = $q$prod-005$q$;
UPDATE products SET description = $q$The nine-tailed fox spirit from old legends, printed large across the back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$A creature from old stories that grows wiser, and stronger, with every tail.$q$, updated_at = NOW() WHERE id = $q$prod-007$q$;
UPDATE products SET description = $q$Garuda, the great eagle of Indian mythology, printed wing to wing across the back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$Garuda carries Vishnu across the sky and fears nothing. Wings wide open, always.$q$, updated_at = NOW() WHERE id = $q$prod-008$q$;
UPDATE products SET description = $q$A clean tee with the Ashoka chakra and the coordinates of Delhi on the back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$Rooted in Indian soil. A quiet way to wear where you come from.$q$, updated_at = NOW() WHERE id = $q$prod-009$q$;
UPDATE products SET description = $q$Loud street typography inspired by the painted walls of Indian cities. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$Every Indian city talks through its walls: shop signs, posters, hand-painted letters. This one talks back.$q$, updated_at = NOW() WHERE id = $q$prod-010$q$;
UPDATE products SET description = $q$No graphics, just a great tee. Thick rib collar, dropped shoulders and a relaxed oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$The tee you reach for every morning. Made to outlast the trend.$q$, updated_at = NOW() WHERE id = $q$prod-011$q$;
UPDATE products SET description = $q$The 24-spoke Ashoka chakra in glowing ember tones across the chest and back. Oversized fit in heavy 240 GSM cotton, washed soft.$q$, story = $q$Twenty-four spokes, one for every hour of the day. A reminder to keep moving forward.$q$, updated_at = NOW() WHERE id = $q$prod-012$q$;

-- 5b. Unique design numbers: Sri Yoga and Asura repeated 03 and 05. Asura can be bought, so it is a new drop.
UPDATE products SET relic_tag = 'DESIGN 13', updated_at = NOW() WHERE id = 'prod-003';
UPDATE products SET relic_tag = 'DESIGN 14', relic_badge = 'NEW DROP', updated_at = NOW() WHERE id = 'prod-005';

-- 6. Only tees for now: remove the jacket and the old placeholder tees (all were hidden drafts).
--    Anything that already appears in an order is kept as a hidden draft instead.
DELETE FROM products p
 WHERE p.id IN ('prod-001', 'prod-002', 'prod-004', 'prod-006')
   AND NOT EXISTS (SELECT 1 FROM orders o, jsonb_array_elements(o.items) it WHERE it->>'productId' = p.id);
UPDATE products SET status = 'DRAFT' WHERE id IN ('prod-001', 'prod-002', 'prod-004', 'prod-006');

COMMIT;

-- Check: expect shipping_charge 0 and free_shipping_threshold 0, and 14 tees listed
SELECT value FROM site_settings WHERE key = 'shipping';
SELECT id, name, fit, left(description, 60) AS description FROM products ORDER BY id;
