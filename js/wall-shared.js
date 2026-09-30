/**
 * BRAVADIAN WALL — shared pieces
 * Used by the public Wall (js/wall.js) and the admin editor's live preview (js/admin-wall.js),
 * so a card looks exactly the same in both places. Everything that reaches HTML is escaped here.
 */

export const BASE = (import.meta.env && import.meta.env.BASE_URL) || '/';
export const PHOTO_BUCKET = 'wall-photos';
export const HASHTAG = '#BravadianWall';
export const PHOTO_WIDTHS = [480, 960, 1600];

// Columns a visitor may read (db/009 keeps private details in a separate admin-only table)
export const PUBLIC_COLUMNS = [
  'id', 'display_name', 'city', 'state', 'country', 'quote',
  'product_id', 'product_name', 'product_url', 'collection_slug', 'images', 'featured', 'featured_headline',
  'featured_quote', 'featured_image', 'display_order', 'submitted_at', 'published_at', 'is_demo',
  'kind', 'body', 'link_url', 'link_label', 'size', 'tilt', 'nudge_x', 'nudge_y', 'layer', 'tape'
].join(',');

export const LIMITS = { name: 60, city: 60, state: 60, country: 60, quote: 280, headline: 80, featuredQuote: 280, productName: 80, alt: 200, caption: 200, photos: 6, body: 400, linkLabel: 40 };

export const IG_HANDLE_RE = /^[A-Za-z0-9._]{1,30}$/;
const SAFE_URL_RE = /^(https:\/\/|\/)[^\s<>"'()\\]+$/;

export function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function titleCase(text) {
  return String(text || '').toLowerCase().replace(/(^|[\s-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
}

/** The brand's Instagram setting ("@bravadian.in" or a profile link) → "bravadian.in". Customers' Instagram details are not kept. */
export function cleanHandle(value) {
  return String(value || '').trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '').replace(/[/?#].*$/, '');
}

export function igProfileUrl(handle) {
  return IG_HANDLE_RE.test(handle || '') ? `https://www.instagram.com/${handle}/` : '';
}

export function isSafeUrl(url) {
  return typeof url === 'string' && url.length <= 500 && SAFE_URL_RE.test(url);
}

/** The brand's own Instagram, from admin settings (falls back to @bravadian.in). */
export function brandInstagram() {
  const url = (window.BravadianDB && window.BravadianDB.getSettings().instagramUrl) || 'https://www.instagram.com/bravadian.in';
  const handle = cleanHandle(url) || 'bravadian.in';
  return { url: igProfileUrl(handle) || 'https://www.instagram.com/bravadian.in/', handle };
}

/* ---------------------------------------------------------------- photos */

function siteUrl(url) {
  if (!isSafeUrl(url)) return '';
  const db = window.BravadianDB;
  return db && db.assetUrl ? db.assetUrl(url) : url;
}

/** Best URL for a photo at a given display width (falls back to the largest stored size). */
export function photoUrl(img, want = 960) {
  if (!img || !img.sizes) return '';
  if (img.preview) return img.preview;                  // admin: a photo chosen but not uploaded yet
  const widths = Object.keys(img.sizes).map(Number).filter(Boolean).sort((a, b) => a - b);
  const pick = widths.find(w => w >= want) || widths[widths.length - 1];
  return siteUrl(img.sizes[pick]);
}

export function photoSrcset(img) {
  if (!img || !img.sizes || img.preview) return '';
  return Object.keys(img.sizes).map(Number).filter(Boolean).sort((a, b) => a - b)
    .map(w => { const u = siteUrl(img.sizes[w]); return u ? `${u} ${w}w` : ''; })
    .filter(Boolean).join(', ');
}

export function focalStyle(img) {
  const f = img && Array.isArray(img.focal) ? img.focal : null;
  if (!f) return '';
  const x = Math.min(100, Math.max(0, Number(f[0]) || 50)), y = Math.min(100, Math.max(0, Number(f[1]) || 50));
  return `object-position:${x}% ${y}%;`;
}

export function photoTag(img, { sizes = '(max-width: 600px) 50vw, (max-width: 1023px) 33vw, 25vw', want = 960, eager = false, className = '' } = {}) {
  if (!img) return '';
  const src = photoUrl(img, want);
  if (!src) return '';
  const set = photoSrcset(img);
  const w = Math.round(Number(img.w) || 4), h = Math.round(Number(img.h) || 5);
  return `<img class="${esc(className)}" src="${esc(src)}"${set ? ` srcset="${esc(set)}" sizes="${esc(sizes)}"` : ''}`
    + ` width="${w}" height="${h}" alt="${esc(img.alt || '')}" style="${esc(focalStyle(img))}"`
    + ` ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

/* ---------------------------------------------------------------- product and collection */

export function productFor(post) {
  const db = window.BravadianDB;
  const product = post.product_id && db ? db.getProducts().find(p => p.id === post.product_id) : null;
  const name = post.product_name || (product && titleCase(product.name)) || '';
  let href = '';
  if (product && product.slug) href = `${BASE}#/product/${encodeURIComponent(product.slug)}`;
  else if (isSafeUrl(post.product_url)) href = post.product_url.startsWith('/') ? siteUrl(post.product_url) : post.product_url;
  const external = /^https:\/\//.test(href) && !href.startsWith(window.location.origin);
  return { name, href, external, collection: post.collection_slug || (product && product.collection) || '' };
}

export function collectionName(slug) {
  if (!slug) return '';
  const db = window.BravadianDB;
  const col = db && db.getCollections().find(c => c.slug === slug);
  return titleCase(col ? col.name : slug.replace(/-/g, ' '));
}

export function coverPhoto(post) {
  return (post.images || [])[0] || null;
}

export function featuredPhoto(post) {
  const imgs = post.images || [];
  return imgs[post.featured_image] || imgs[0] || null;
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function place(post) {
  return [post.city, post.country && post.country !== 'India' ? post.country : ''].filter(Boolean).join(', ');
}

/* ---------------------------------------------------------------- wall pieces */

// The Wall shows photos of customers only (they need permission and a photo; db/009 enforces it).
// Older rows may be brand cards (quote, note, ...): the Wall no longer shows them; the admin can delete them.
export const CUSTOMER_KINDS = ['photo', 'polaroid'];
export const KIND_LABELS = {
  photo: 'Photo', polaroid: 'Photo', featured: 'Featured (large)',
  quote: 'Old card (not shown)', note: 'Old card (not shown)', brand: 'Old card (not shown)', collection: 'Old card (not shown)', campaign: 'Old card (not shown)'
};
export const TAPE_COLOURS = ['cream', 'white', 'red', 'blue', 'black'];
export const isCustomer = (post) => !post.kind || CUSTOMER_KINDS.includes(post.kind);

/** Same id → same random numbers, so a photo keeps its tilt and tape every visit. */
export function seeded(key) {
  let h = 2166136261;
  for (const ch of String(key)) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  let a = h >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A slight tilt and a tape colour for each photo. Saved admin values (tilt, tape colour) win. */
export function pieceLook(item) {
  const r = seeded(item.id || item.display_name || 'piece');
  const type = item.featured ? 'feature' : 'photo';
  const range = type === 'feature' ? 0.8 : 1.8;
  let tilt = (r() * 2 - 1) * range;
  if (Math.abs(tilt) < range * 0.3) tilt = (tilt < 0 ? -1 : 1) * range * 0.4;   // never dead straight
  if (item.tilt !== null && item.tilt !== undefined && item.tilt !== '') tilt = Number(item.tilt) || 0;
  let colour = ['cream', 'cream', 'white', 'red', 'blue', 'black', 'cream', 'white'][Math.floor(r() * 8)];
  if (TAPE_COLOURS.includes(item.tape)) colour = item.tape;
  return { type, tilt: Math.round(tilt * 10) / 10, colour, tapeTilt: Math.round((r() * 2 - 1) * 5) };
}

/* ---------------------------------------------------------------- markup */

const CORNERS = ['tl', 'tr', 'bl', 'br'];

/**
 * One photo on the wall, as an <li>: the print, taped at all four corners. No text on the wall;
 * the name, place and tee are in the button's label and in the story viewer it opens.
 * opts: label (a Preview/Draft stamp, admin only), eager, sizes, want
 */
export function renderPiece(post, opts = {}) {
  const look = pieceLook(post);
  const img = look.type === 'feature' ? featuredPhoto(post) : coverPhoto(post);
  const product = productFor(post);
  const label = `${post.display_name || 'A Bravadian'}${post.city ? `, ${place(post)}` : ''}${product.name ? `. Wearing ${product.name}` : ''}. View story`;
  const photo = img ? photoTag(img, { sizes: opts.sizes, want: opts.want || 960, eager: opts.eager }) : '<span class="wall-card-empty" aria-hidden="true"></span>';
  const tape = CORNERS.map(c => `<span class="wp-tape at-${c} is-${look.colour}" aria-hidden="true"></span>`).join('');
  const stamp = opts.label ? `<span class="wp-stamp is-draft">${esc(opts.label)}</span>` : '';
  return `<li class="wp is-${look.type}" data-id="${esc(post.id || '')}" data-type="${look.type}" style="--r:${look.tilt}deg">
    <div class="wp-body">
      <button type="button" class="wp-hit" data-open="${esc(post.id || '')}" aria-label="${esc(label)}">
        <span class="wp-photo-print"><span class="wp-print">${photo}</span></span>
      </button>${tape}${stamp}
    </div></li>`;
}
