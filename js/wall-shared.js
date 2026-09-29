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
  'featured_quote', 'featured_image', 'display_order', 'submitted_at', 'published_at', 'is_demo'
].join(',');

export const LIMITS = { name: 60, city: 60, state: 60, country: 60, quote: 280, headline: 80, featuredQuote: 280, productName: 80, alt: 200, caption: 200, photos: 6 };

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

/* ---------------------------------------------------------------- markup */

const ARROW = '<span class="wall-arrow" aria-hidden="true">&rarr;</span>';

/** One card on the Wall grid. opts.wide gives it two columns on wider screens. */
export function renderCard(post, opts = {}) {
  const img = coverPhoto(post);
  const product = productFor(post);
  const name = post.display_name || 'Your name';
  const count = (post.images || []).length;
  const ratio = img ? `${Math.round(img.w) || 4} / ${Math.round(img.h) || 5}` : '4 / 5';
  const tags = [
    post.featured ? '<span class="wall-tag is-featured">Featured</span>' : '',
    post.is_demo ? '<span class="wall-tag is-demo">Demo</span>' : '',
    opts.draftLabel ? `<span class="wall-tag is-draft">${esc(opts.draftLabel)}</span>` : ''
  ].join('');
  return `
    <article class="wall-card${post.featured ? ' is-featured' : ''}${opts.wide ? ' is-wide' : ''}" data-id="${esc(post.id || '')}" style="--ar:${ratio}">
      <button type="button" class="wall-card-media" data-open="${esc(post.id || '')}" aria-label="${esc(`See ${name}'s photo${post.city ? ` from ${post.city}` : ''}`)}">
        ${img ? photoTag(img, { sizes: opts.wide ? '(max-width: 600px) 100vw, 50vw' : undefined, eager: opts.eager }) : '<span class="wall-card-empty">Photo</span>'}
        ${tags ? `<span class="wall-card-tags">${tags}</span>` : ''}
        ${count > 1 ? `<span class="wall-card-count" aria-label="${count} photos">${count}</span>` : ''}
      </button>
      <div class="wall-card-body">
        <p class="wall-card-who"><span class="wall-card-name">${esc(name)}</span>${post.city ? `<span class="wall-card-city">${esc(place(post))}</span>` : ''}</p>
        ${post.quote ? `<p class="wall-card-quote">&ldquo;${esc(post.quote)}&rdquo;</p>` : ''}
        ${product.name ? `<p class="wall-card-meta">
          ${product.name ? (product.href
            ? `<a class="wall-card-product" href="${esc(product.href)}"${product.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>Wearing ${esc(product.name)} ${ARROW}</a>`
            : `<span class="wall-card-product">Wearing ${esc(product.name)}</span>`) : ''}
        </p>` : ''}
      </div>
    </article>`;
}

/** A featured customer as a mini editorial story. */
export function renderFeature(post, opts = {}) {
  const img = featuredPhoto(post);
  const product = productFor(post);
  const quote = post.featured_quote || post.quote;
  const collection = collectionName(product.collection);
  return `
    <article class="wall-feature${opts.compact ? ' is-compact' : ''}" data-id="${esc(post.id || '')}">
      <button type="button" class="wall-feature-media" data-open="${esc(post.id || '')}" aria-label="${esc(`See ${post.display_name || 'this person'}'s photo`)}">
        ${img ? photoTag(img, { sizes: opts.compact ? '(max-width: 1023px) 50vw, 20vw' : '(max-width: 1023px) 100vw, 55vw', want: opts.compact ? 480 : 1600, eager: !opts.compact && opts.eager }) : '<span class="wall-card-empty">Photo</span>'}
        ${post.is_demo ? '<span class="wall-card-tags"><span class="wall-tag is-demo">Demo</span></span>' : ''}
      </button>
      <div class="wall-feature-copy">
        <span class="wall-eyebrow">Featured Bravadian</span>
        <h3 class="wall-feature-headline">${esc(post.featured_headline || 'This is what Bravadian looks like.')}</h3>
        ${quote ? `<blockquote class="wall-feature-quote">&ldquo;${esc(quote)}&rdquo;</blockquote>` : ''}
        <p class="wall-feature-who"><b>${esc(post.display_name || 'Your name')}</b>${post.city ? ` <span>${esc(place(post))}</span>` : ''}</p>
        ${product.name ? `<p class="wall-feature-wearing">Wearing ${esc(product.name)}${collection ? ` <span>&middot; ${esc(collection)}</span>` : ''}</p>` : ''}
        <div class="wall-feature-actions">
          ${product.href ? `<a class="wall-btn wall-btn-primary" href="${esc(product.href)}"${product.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>View this tee ${ARROW}</a>` : ''}
        </div>
      </div>
    </article>`;
}
