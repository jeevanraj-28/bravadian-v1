/**
 * THE BRAVADIAN WALL — public page (/wall)
 * Reads only published customer photos (the database hides anyone without permission, see db/009_wall.sql).
 *
 * The wall is a grid of prints, each taped at its four corners and tilted a touch. Featured customers
 * are larger prints (two by two). There is no text on the wall itself: a photo opens its story.
 * Photos load 24 at a time as the visitor scrolls; the wall just gets longer.
 */
import {
  BASE, PUBLIC_COLUMNS, HASHTAG, CUSTOMER_KINDS, esc, photoTag, productFor, collectionName, place, formatDate,
  brandInstagram, isCustomer, renderPiece
} from './wall-shared.js';

const PAGE_SIZE = 24;
const FEATURE_EVERY = 11;    // a featured (large) photo after every this many photos
const SEARCH_FROM = 12;      // the search box appears once the Wall has this many people
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (id) => document.getElementById(id);
const state = {
  client: null, facets: [], people: 0,
  filter: 'all', city: '', collection: '', product: '', q: '',
  offset: 0, done: false, loading: false, token: 0,
  featured: [], preview: null,
  seq: null, lb: { list: [], index: 0, photo: 0, opener: null }
};

async function init() {
  const brand = brandInstagram();
  fillBrand(document);
  initJoin(brand);
  initLightbox();
  initBrokenPhotos();
  initCanvas();

  state.client = window.BravadianDB && window.BravadianDB.supabaseClient;
  if (!state.client) return showLoadError('The Wall could not connect right now.');

  const params = new URLSearchParams(window.location.search);
  const previewId = params.get('preview');
  const postId = params.get('post');

  try {
    await Promise.all([loadFacets(), loadFeatured()]);
  } catch (err) {
    return showLoadError();
  }
  initFilters();
  if (previewId && UUID_RE.test(previewId)) await loadPreview(previewId);
  await loadPage(true);
  if (postId && UUID_RE.test(postId)) openById(postId);
}

function fillBrand(root) {
  const brand = brandInstagram();
  root.querySelectorAll('[data-brand-handle]').forEach(el => { el.textContent = `@${brand.handle}`; });
  root.querySelectorAll('[data-brand-ig]').forEach(el => { el.href = brand.url; });
}

/* ================================================================== data */

async function loadFacets() {
  const { data, error } = await state.client.from('wall_posts')
    .select('kind,city,collection_slug,product_id,product_name,featured,published_at').in('kind', CUSTOMER_KINDS).limit(5000);
  if (error) throw error;
  state.facets = data || [];
  state.people = state.facets.length;
  $('wallCount').textContent = state.people ? `${state.people} ${state.people === 1 ? 'person' : 'people'} on the Wall` : '';
}

async function loadFeatured() {
  const { data, error } = await state.client.from('wall_posts').select(PUBLIC_COLUMNS)
    .in('kind', CUSTOMER_KINDS).eq('featured', true)
    .order('display_order', { ascending: true }).order('published_at', { ascending: false }).limit(60);
  if (error) throw error;
  state.featured = data || [];
}

const isWallMode = () => state.filter === 'all' && !state.city && !state.collection && !state.product && !state.q.trim();

function buildQuery() {
  let q = state.client.from('wall_posts').select(PUBLIC_COLUMNS).in('kind', CUSTOMER_KINDS);
  if (isWallMode()) {
    q = q.eq('featured', false);                        // featured photos are woven in separately
  } else {
    if (state.filter === 'featured') q = q.eq('featured', true);
    if (state.city) q = q.eq('city', state.city);
    if (state.collection) q = q.eq('collection_slug', state.collection);
    if (state.product) q = state.product.startsWith('name:') ? q.eq('product_name', state.product.slice(5)) : q.eq('product_id', state.product);
    const term = state.q.replace(/[^\p{L}\p{N} .'-]/gu, ' ').replace(/\s+/g, ' ').trim();
    if (term) {
      const like = `"*${term}*"`;
      q = q.or(`display_name.ilike.${like},city.ilike.${like},product_name.ilike.${like},collection_slug.ilike.${like}`);
    }
  }
  if (state.filter === 'new') return q.order('published_at', { ascending: false }).order('id', { ascending: true });
  return q.order('display_order', { ascending: true }).order('published_at', { ascending: false }).order('id', { ascending: true });
}

async function loadPage(reset) {
  const token = reset ? ++state.token : state.token;
  if (reset) {
    state.offset = 0; state.done = false; state.loading = false;
    state.seq = { n: 0, feature: 0, nextFeature: 0 };
    canvas.el.classList.add('is-updating');
  }
  if (state.loading || state.done) return;
  state.loading = true;
  canvas.el.setAttribute('aria-busy', 'true');
  $('wallLoader').hidden = false;
  $('wallMore').hidden = true;

  const { data, error } = await buildQuery().range(state.offset, state.offset + PAGE_SIZE - 1);
  if (token !== state.token) return;                  // a newer filter replaced this request
  state.loading = false;
  canvas.el.setAttribute('aria-busy', 'false');
  $('wallLoader').hidden = true;
  if (error) return showLoadError(null, !reset);

  const rows = (data || []).filter(p => !(state.preview && p.id === state.preview.id));
  state.offset += (data || []).length;
  state.done = (data || []).length < PAGE_SIZE;

  if (reset) clearCanvas();
  const items = [];
  if (reset && state.preview) { items.push({ ...state.preview, _label: 'Preview' }); state.seq.n++; }
  rows.forEach(row => { weaveFeatured(items); items.push(row); state.seq.n++; });
  if (state.done && isWallMode()) {
    while (state.seq.feature < state.featured.length) items.push(state.featured[state.seq.feature++]);
  }
  addPieces(items);
  $('wallMore').hidden = state.done || !!observer;
  updateStatus();
  if (!state.done) maybeLoadMore();
}

// Featured photos go first, then one after every FEATURE_EVERY photos, so the wall reads the same on every visit
function weaveFeatured(items) {
  const s = state.seq;
  while (isWallMode() && s.n >= s.nextFeature && s.feature < state.featured.length) {
    items.push(state.featured[s.feature++]);
    s.n++;
    s.nextFeature = s.n + FEATURE_EVERY;
  }
}

async function loadPreview(id) {
  const notice = $('wallPreviewNotice');
  const { data: session } = await state.client.auth.getSession();
  if (!session || !session.session) {
    notice.innerHTML = '<p>This preview link only works for a signed-in Bravadian admin, on the browser they use for the admin panel.</p>';
    notice.hidden = false;
    return;
  }
  const { data, error } = await state.client.from('wall_posts').select(`${PUBLIC_COLUMNS},status,permission_status`).eq('id', id).maybeSingle();
  if (error || !data) {
    notice.innerHTML = '<p>That photo was not found, or this account cannot see it.</p>';
    notice.hidden = false;
    return;
  }
  if (!isCustomer(data)) {
    notice.innerHTML = '<p>That is an old brand card. The Wall now shows customer photos only, so it does not appear here.</p>';
    notice.hidden = false;
    return;
  }
  state.preview = data;
  state.featured = state.featured.filter(f => f.id !== data.id);
  const live = data.status === 'published' && data.permission_status === 'granted';
  notice.innerHTML = `<p><b>Preview.</b> ${live
    ? 'This photo is live on the Wall. It is pinned first here so you can find it.'
    : `This photo is <b>${esc(data.status)}</b>${data.permission_status !== 'granted' ? `, permission <b>${esc(data.permission_status)}</b>` : ''}. Only you can see it; it is not on the public Wall.`}</p>`;
  notice.hidden = false;
}

async function openById(id) {
  const all = storyList();
  const at = all.findIndex(p => p.id === id);
  if (at >= 0) return openLightbox(all, at, null, true);
  const { data } = await state.client.from('wall_posts').select(PUBLIC_COLUMNS).eq('id', id).maybeSingle();
  if (data && isCustomer(data)) openLightbox([data], 0, null);
}

/** The people on the wall, in wall order: what the story viewer steps through. */
function storyList() {
  return canvas.pieces.map(p => p.item);
}

/* ================================================================== the wall (a CSS grid, css/wall.css) */

const canvas = { el: null, pieces: [] };
let observer = null;       // pins photos in as they scroll into view
let tailObserver = null;   // loads the next page before the visitor reaches the bottom

function initCanvas() {
  canvas.el = $('wallCanvas');
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      let d = 0;
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.style.setProperty('--d', `${Math.min(d++, 6) * 70}ms`);
        en.target.classList.add('is-in');
        observer.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -6% 0px' });
    tailObserver = new IntersectionObserver((entries) => {
      if (entries.some(en => en.isIntersecting)) maybeLoadMore();
    }, { rootMargin: '1400px 0px' });
    tailObserver.observe($('wallTail'));
  }
  $('wallMore').addEventListener('click', () => loadPage(false));
  // Backstop for the observer: if a batch lands in the same frame as a scroll to the bottom, the observer
  // never sees the end of the wall leave the view, so it would not fire again.
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; maybeLoadMore(); });
  }, { passive: true });
  $('wallStatus').addEventListener('click', (e) => {
    if (e.target.closest('[data-clear-filters]')) clearFilters();
  });
}

function maybeLoadMore() {
  if (state.loading || state.done || !canvas.pieces.length) return;
  const r = $('wallTail').getBoundingClientRect();
  if (r.top < window.innerHeight + 1400) loadPage(false);
}

function clearCanvas() {
  canvas.pieces.forEach(p => { if (observer) observer.unobserve(p.el); });
  canvas.el.innerHTML = '';
  canvas.pieces = [];
  canvas.el.classList.remove('is-updating');
}

const SIZES = '(max-width: 600px) 50vw, (max-width: 1023px) 33vw, (max-width: 1439px) 25vw, 20vw';
const FEATURE_SIZES = '(max-width: 600px) 100vw, (max-width: 1023px) 66vw, (max-width: 1439px) 50vw, 40vw';

function addPieces(items) {
  if (!items.length) return;
  const start = canvas.pieces.length;
  canvas.el.insertAdjacentHTML('beforeend', items.map((item, i) => renderPiece(item, {
    label: item._label || '', eager: start + i < 4,
    sizes: item.featured ? FEATURE_SIZES : SIZES, want: item.featured ? 1600 : 960
  })).join(''));
  const els = [...canvas.el.children].slice(start);
  const fresh = items.map((item, i) => ({ item, el: els[i] }));
  canvas.pieces.push(...fresh);
  fresh.forEach(p => {
    if (reduceMotion || !observer) p.el.classList.add('is-in');
    else observer.observe(p.el);
  });
  // re-arm: observing again reports where the end of the wall is right now
  if (tailObserver) { tailObserver.unobserve($('wallTail')); tailObserver.observe($('wallTail')); }
}

/* ================================================================== filters */

function initFilters() {
  if (!state.people) return;
  const counts = (key) => {
    const m = new Map();
    state.facets.forEach(r => { const k = r[key]; if (k) m.set(k, (m.get(k) || 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const pills = [['all', 'All']];
  if (state.facets.some(r => r.featured)) pills.push(['featured', 'Featured']);
  pills.push(['new', 'Newest']);
  counts('city').slice(0, 8).forEach(([city]) => pills.push([`city:${city}`, city]));
  $('wallPills').innerHTML = pills.map(([v, label]) =>
    `<button type="button" class="wall-pill" data-v="${esc(v)}" aria-pressed="${v === 'all'}">${esc(label)}</button>`).join('');

  const cols = counts('collection_slug');
  $('wallCollection').insertAdjacentHTML('beforeend', cols.map(([slug]) => `<option value="${esc(slug)}">${esc(collectionName(slug))}</option>`).join(''));
  $('wallCollection').closest('.wall-field').hidden = cols.length < 2;

  const products = new Map();
  state.facets.forEach(r => {
    const key = r.product_id || (r.product_name ? `name:${r.product_name}` : '');
    if (key && !products.has(key)) products.set(key, productFor(r).name || r.product_name);
  });
  const productList = [...products.entries()].filter(([, n]) => n).sort((a, b) => a[1].localeCompare(b[1]));
  $('wallProduct').insertAdjacentHTML('beforeend', productList.map(([k, n]) => `<option value="${esc(k)}">${esc(n)}</option>`).join(''));
  $('wallProduct').closest('.wall-field').hidden = productList.length < 2;

  $('wallSearchWrap').hidden = state.people < SEARCH_FROM;
  $('wallTools').hidden = false;

  $('wallPills').addEventListener('click', (e) => {
    const b = e.target.closest('.wall-pill');
    if (!b) return;
    $('wallPills').querySelectorAll('.wall-pill').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    const v = b.dataset.v;
    state.filter = v.startsWith('city:') ? 'all' : v;
    state.city = v.startsWith('city:') ? v.slice(5) : '';
    loadPage(true);
  });
  $('wallCollection').addEventListener('change', (e) => { state.collection = e.target.value; loadPage(true); });
  $('wallProduct').addEventListener('change', (e) => { state.product = e.target.value; loadPage(true); });
  let t = 0;
  $('wallSearch').addEventListener('input', (e) => {
    clearTimeout(t);
    t = setTimeout(() => { state.q = e.target.value; loadPage(true); }, 280);
  });
}

function clearFilters() {
  Object.assign(state, { filter: 'all', city: '', collection: '', product: '', q: '' });
  $('wallPills').querySelectorAll('.wall-pill').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.v === 'all')));
  $('wallCollection').value = '';
  $('wallProduct').value = '';
  $('wallSearch').value = '';
  loadPage(true);
}

function updateStatus() {
  const n = storyList().filter(p => !p._label).length;
  if (isWallMode()) {
    $('wallStatus').textContent = !n && state.done && !state.preview ? 'The Wall is just getting started. Be one of the first faces on it.' : '';
    return;
  }
  if (!n && state.done) {
    const where = state.city ? ` from ${state.city}` : state.q.trim() ? ` matching "${state.q.trim()}"` : '';
    $('wallStatus').innerHTML = `${esc(`Nobody${where} is on the Wall yet.`)} <button type="button" class="wall-retry" data-clear-filters>Show the whole Wall</button>`;
    return;
  }
  const parts = [];
  if (state.filter === 'featured') parts.push('featured');
  const where = state.city ? ` from ${state.city}` : '';
  const sort = state.filter === 'new' ? ', newest first' : '';
  $('wallStatus').textContent = n
    ? `${n}${state.done ? '' : '+'} ${parts.join(' ')} ${n === 1 ? 'person' : 'people'}${where}${state.q.trim() ? ` matching "${state.q.trim()}"` : ''}${sort}`.replace(/\s+/g, ' ')
    : '';
}

/* ================================================================== states */

function showLoadError(message, keepPieces) {
  state.loading = false;
  canvas.el.setAttribute('aria-busy', 'false');
  canvas.el.classList.remove('is-updating');
  $('wallLoader').hidden = true;
  if (!keepPieces) { canvas.el.innerHTML = ''; canvas.pieces = []; }
  $('wallStatus').innerHTML = `${esc(message || 'The Wall did not load. Check your connection and try again.')} <button type="button" class="wall-retry">Try again</button>`;
  $('wallStatus').querySelector('.wall-retry').addEventListener('click', () => {
    $('wallStatus').textContent = '';
    if (!state.client) return window.location.reload();
    if (keepPieces) loadPage(false);
    else init();
  }, { once: true });
}

function initBrokenPhotos() {
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.wall-page, .wall-lightbox')) return;
    const box = img.parentElement;
    img.remove();   // the print keeps its size (aspect-ratio), so nothing on the wall moves
    if (box && !box.querySelector('.wall-card-empty')) box.insertAdjacentHTML('afterbegin', '<span class="wall-card-empty">Photo unavailable</span>');
  }, true);
}

/* ================================================================== story viewer */

function initLightbox() {
  const dialog = $('wallLightbox');
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (!opener || !opener.closest('.wall-page')) return;
    const id = opener.dataset.open;
    const list = storyList();
    const at = list.findIndex(p => p.id === id);
    const focusBack = opener.matches('button') ? opener : opener.closest('.wp').querySelector('button[data-open]') || opener;
    if (at >= 0) openLightbox(list, at, focusBack, true);
  });
  $('wallLbClose').addEventListener('click', closeLightbox);
  $('wallLbPrev').addEventListener('click', () => step(-1));
  $('wallLbNext').addEventListener('click', () => step(1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeLightbox(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeLightbox(); });
  // Arrow keys step between stories wherever focus is while the viewer is open
  document.addEventListener('keydown', (e) => {
    if (!dialog.open || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  });
  $('wallLbThumbs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-photo]');
    if (!b) return;
    state.lb.photo = Number(b.dataset.photo);
    drawLightbox();
    const again = $('wallLbThumbs').querySelector(`[data-photo="${state.lb.photo}"]`);
    if (again) again.focus({ preventScroll: true });
  });
  // Swipe between stories on touch screens
  let x0 = null, y0 = null;
  const stage = dialog.querySelector('.wall-lb-stage');
  stage.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') { x0 = e.clientX; y0 = e.clientY; } });
  stage.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0, dy = e.clientY - y0;
    x0 = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  });
}

function openLightbox(list, index, opener, fromWall = false) {
  const dialog = $('wallLightbox');
  state.lb = { list, index, photo: 0, opener: opener || document.activeElement, fromWall };
  drawLightbox();
  if (!dialog.open) dialog.showModal();
  document.documentElement.classList.add('wall-lb-open');
  $('wallLbClose').focus({ preventScroll: true });
}

function closeLightbox() {
  const dialog = $('wallLightbox');
  if (!dialog.open) return;
  dialog.close();
  document.documentElement.classList.remove('wall-lb-open');
  const url = new URL(window.location.href);
  if (url.searchParams.has('post')) { url.searchParams.delete('post'); history.replaceState(null, '', url); }
  const back = state.lb.opener;
  if (back && document.contains(back)) back.focus({ preventScroll: true });
}

async function step(dir) {
  const lb = state.lb;
  const next = lb.index + dir;
  // Stepping past the last loaded story fetches the next page, like scrolling would
  if (lb.fromWall && next >= lb.list.length && !state.done && !state.loading) {
    await loadPage(false);
    lb.list = storyList();
  }
  if (!lb.list.length) return;
  lb.index = (next + lb.list.length) % lb.list.length;
  lb.photo = 0;
  drawLightbox();
}

function drawLightbox() {
  const { list, index, photo } = state.lb;
  const post = list[index];
  if (!post) return;
  const imgs = post.images || [];
  const img = imgs[photo] || imgs[0];
  const product = productFor(post);
  const collection = collectionName(product.collection);

  $('wallLbPhoto').innerHTML = img
    ? photoTag(img, { sizes: '(max-width: 1023px) 100vw, 64vw', want: 1600, eager: true, className: 'wall-lb-img' })
      + (img.caption ? `<p class="wall-lb-caption">${esc(img.caption)}</p>` : '')
    : '<span class="wall-card-empty">Photo unavailable</span>';
  $('wallLbThumbs').innerHTML = imgs.length > 1 ? imgs.map((im, i) =>
    `<button type="button" data-photo="${i}" aria-label="Photo ${i + 1} of ${imgs.length}" aria-pressed="${i === photo}">${photoTag(im, { sizes: '64px', want: 480 })}</button>`).join('') : '';

  $('wallLbInfo').innerHTML = `
    <div class="wall-lb-tags">
      ${post.featured ? '<span class="wall-tag is-featured">Featured</span>' : ''}
      ${post.is_demo ? '<span class="wall-tag is-demo">Demo</span>' : ''}
      ${state.preview && post.id === state.preview.id ? '<span class="wall-tag is-draft">Preview</span>' : ''}
    </div>
    <h2 class="wall-lb-name" id="wallLbName">${esc(post.display_name)}</h2>
    <p class="wall-lb-place">${esc([place(post), post.state && post.state !== post.city ? post.state : ''].filter(Boolean).join(' · '))}</p>
    ${(post.featured_quote || post.quote) ? `<blockquote class="wall-lb-quote">&ldquo;${esc(post.featured && post.featured_quote ? post.featured_quote : post.quote)}&rdquo;</blockquote>` : ''}
    ${product.name || collection ? `<dl class="wall-lb-facts">
      ${product.name ? `<div><dt>Wearing</dt><dd>Bravadian &mdash; ${esc(product.name)}</dd></div>` : ''}
      ${collection ? `<div><dt>Collection</dt><dd>${esc(collection)}</dd></div>` : ''}
      ${post.published_at ? `<div><dt>On the Wall</dt><dd>${esc(formatDate(post.published_at))}</dd></div>` : ''}
    </dl>` : ''}
    <div class="wall-lb-actions">
      ${product.href ? `<a class="wp-btn is-red" href="${esc(product.href)}"${product.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>View product <span aria-hidden="true">&rarr;</span></a>` : ''}
      <button type="button" class="wp-btn is-ink" data-join>Get on the Wall</button>
      <button type="button" class="wall-lb-share" id="wallLbShare">Share this story</button>
    </div>
    <p class="wall-lb-count" aria-live="polite">${list.length > 1 ? `${index + 1} of ${list.length}${state.lb.fromWall && !state.done ? '+' : ''}` : ''}</p>`;

  $('wallLbPrev').hidden = $('wallLbNext').hidden = list.length < 2;
  $('wallLbShare').addEventListener('click', () => share(post));

  const url = new URL(window.location.href);
  if (!url.searchParams.has('preview')) { url.searchParams.set('post', post.id); history.replaceState(null, '', url); }
}

async function share(post) {
  const url = new URL(`${BASE}wall`, window.location.origin);
  url.searchParams.set('post', post.id);
  const data = { title: `${post.display_name} on the Bravadian Wall`, url: url.href };
  const btn = $('wallLbShare');
  try {
    if (navigator.share) { await navigator.share(data); return; }
    await navigator.clipboard.writeText(url.href);
    btn.textContent = 'Link copied';
  } catch (e) {
    if (e && e.name === 'AbortError') return;
    btn.textContent = 'Copy failed';
  }
  setTimeout(() => { if (document.contains(btn)) btn.textContent = 'Share this story'; }, 2200);
}

/* ================================================================== "Show us your Bravadian" */

function initJoin(brand) {
  const dialog = $('wallJoin');
  let opener = null;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-join]');
    if (!b) return;
    opener = b;
    if ($('wallLightbox').open) closeLightbox();
    $('wallCopied').textContent = '';
    dialog.showModal();
    $('wallJoinClose').focus({ preventScroll: true });
  });
  const close = () => { dialog.close(); if (opener && document.contains(opener)) opener.focus({ preventScroll: true }); };
  $('wallJoinClose').addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });

  const caption = `Wearing my Bravadian. @${brand.handle} ${HASHTAG}`;
  $('wallCopyCaption').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(caption);
      $('wallCopied').textContent = 'Caption copied. Paste it into your post.';
    } catch (e) {
      $('wallCopied').textContent = `Your caption: ${caption}`;
    }
  });
}

// Start last, once every declaration above exists
if (document.body.dataset.page === 'wall') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}
