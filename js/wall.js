/**
 * THE BRAVADIAN WALL — public page (/wall)
 * Reads only published, permission-granted posts (the database enforces this, see db/009_wall.sql).
 * Loads 18 at a time, filters on the server, and lays cards out as an editorial masonry grid.
 */
import {
  BASE, PUBLIC_COLUMNS, HASHTAG, esc, renderCard, renderFeature, photoTag, productFor, collectionName, place,
  formatDate, brandInstagram
} from './wall-shared.js';

const PAGE_SIZE = 18;
const NEW_DAYS = 30;          // "New" = published in the last 30 days
const SEARCH_FROM = 12;       // the search box appears once the Wall has this many people
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const $ = (id) => document.getElementById(id);
const state = {
  client: null, facets: [], total: 0,
  filter: 'all', city: '', collection: '', product: '', q: '',
  posts: [], offset: 0, done: false, loading: false, token: 0,
  preview: null, lb: { list: [], index: 0, photo: 0, opener: null }
};

if (document.body.dataset.page === 'wall') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
}

async function init() {
  const brand = brandInstagram();
  document.querySelectorAll('[data-brand-handle]').forEach(el => { el.textContent = `@${brand.handle}`; });
  document.querySelectorAll('[data-brand-ig]').forEach(el => { el.href = brand.url; });
  initCaption(brand);
  initLightbox();
  initBrokenPhotos();

  state.client = window.BravadianDB && window.BravadianDB.supabaseClient;
  const grid = $('wallGridBody');
  grid.innerHTML = skeletons(8);
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
  if (state.total > 0) await loadPage(true);
  else if (!previewId) showEmpty();
  if (previewId && UUID_RE.test(previewId)) await loadPreview(previewId);
  if (postId && UUID_RE.test(postId)) openById(postId);
}

/* ------------------------------------------------------------------ data */

async function loadFacets() {
  const { data, error } = await state.client.from('wall_posts')
    .select('city,collection_slug,product_id,product_name,featured,published_at').limit(5000);
  if (error) throw error;
  state.facets = data || [];
  state.total = state.facets.length;
}

async function loadFeatured() {
  const { data, error } = await state.client.from('wall_posts').select(PUBLIC_COLUMNS)
    .eq('featured', true).order('display_order', { ascending: true }).order('published_at', { ascending: false }).limit(3);
  if (error) throw error;
  const rows = data || [];
  const section = $('wallFeatured');
  if (!rows.length) { section.hidden = true; return; }
  $('wallFeaturedBody').innerHTML = renderFeature(rows[0], { eager: true })
    + (rows.length > 1 ? `<div class="wall-featured-more">${rows.slice(1).map(p => renderFeature(p, { compact: true })).join('')}</div>` : '');
  section.hidden = false;
  state.featured = rows;
}

function buildQuery() {
  let q = state.client.from('wall_posts').select(PUBLIC_COLUMNS);
  if (state.filter === 'featured') q = q.eq('featured', true);
  if (state.filter === 'new') q = q.gte('published_at', new Date(Date.now() - NEW_DAYS * 864e5).toISOString());
  if (state.city) q = q.eq('city', state.city);
  if (state.collection) q = q.eq('collection_slug', state.collection);
  if (state.product) q = state.product.startsWith('name:') ? q.eq('product_name', state.product.slice(5)) : q.eq('product_id', state.product);
  const term = state.q.replace(/[^\p{L}\p{N} .'-]/gu, ' ').replace(/\s+/g, ' ').trim();
  if (term) {
    const like = `"*${term}*"`;
    q = q.or(`display_name.ilike.${like},city.ilike.${like},product_name.ilike.${like},collection_slug.ilike.${like}`);
  }
  return q.order('display_order', { ascending: true }).order('published_at', { ascending: false }).order('id', { ascending: true });
}

async function loadPage(reset) {
  const grid = $('wallGridBody');
  const token = reset ? ++state.token : state.token;
  if (reset) {
    state.offset = 0; state.posts = []; state.done = false;
    grid.classList.add('is-updating');
  }
  if (state.loading && !reset) return;
  state.loading = true;
  grid.setAttribute('aria-busy', 'true');
  $('wallMore').hidden = true;

  const { data, error } = await buildQuery().range(state.offset, state.offset + PAGE_SIZE - 1);
  if (token !== state.token) return;          // a newer filter replaced this request
  state.loading = false;
  grid.setAttribute('aria-busy', 'false');
  grid.classList.remove('is-updating');
  if (error) return showLoadError(null, !reset);

  const rows = (data || []).filter(p => !(state.preview && p.id === state.preview.id));
  const start = state.posts.length;
  state.posts.push(...rows);
  state.offset += (data || []).length;
  state.done = (data || []).length < PAGE_SIZE;

  const html = rows.map((p, i) => renderCard(p, { wide: isWide(p, start + i), eager: start + i < 4 })).join('');
  if (reset) grid.innerHTML = (state.preview ? previewCard() : '') + html;
  else grid.insertAdjacentHTML('beforeend', html);
  grid.hidden = false;
  animateIn(grid, start);
  watchCards(grid);
  $('wallMore').hidden = state.done;
  updateStatus();
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
    notice.innerHTML = '<p>That post was not found, or this account cannot see it.</p>';
    notice.hidden = false;
    return;
  }
  state.preview = data;
  const live = data.status === 'published' && data.permission_status === 'granted';
  notice.innerHTML = `<p><b>Preview.</b> ${live
    ? 'This post is live on the Wall. It is pinned first here so you can find it.'
    : `This post is <b>${esc(data.status)}</b>${data.permission_status !== 'granted' ? `, permission <b>${esc(data.permission_status)}</b>` : ''}. Only you can see it; it is not on the public Wall.`}</p>`;
  notice.hidden = false;
  $('wallEmpty').hidden = true;
  const grid = $('wallGridBody');
  grid.querySelectorAll(`[data-id="${data.id}"]`).forEach(el => el.remove());
  state.posts = state.posts.filter(p => p.id !== data.id);
  grid.insertAdjacentHTML('afterbegin', previewCard());
  grid.hidden = false;
  grid.setAttribute('aria-busy', 'false');
  grid.querySelectorAll('.is-skeleton').forEach(el => el.remove());
  watchCards(grid);
  openLightbox(allLoaded(), 0, null, true);
}

function previewCard() {
  return renderCard(state.preview, { draftLabel: 'Preview', eager: true, wide: false });
}

async function openById(id) {
  const all = allLoaded();
  const at = all.findIndex(p => p.id === id);
  if (at >= 0) return openLightbox(all, at, null, true);
  const { data } = await state.client.from('wall_posts').select(PUBLIC_COLUMNS).eq('id', id).maybeSingle();
  if (data) openLightbox([data], 0, null);
}

function allLoaded() {
  const list = [...(state.preview ? [state.preview] : []), ...state.posts];
  (state.featured || []).forEach(f => { if (!list.some(p => p.id === f.id)) list.push(f); });
  return list;
}

// Wide (two-column) cards give the grid its rhythm: landscape photos, and every fifth featured post
function isWide(post, index) {
  const img = (post.images || [])[0];
  if (img && img.w > img.h * 1.15) return true;
  return post.featured && index % 5 === 0;
}

/* ------------------------------------------------------------------ filters */

function initFilters() {
  if (!state.total) return;
  const counts = (key) => {
    const m = new Map();
    state.facets.forEach(r => { const k = r[key]; if (k) m.set(k, (m.get(k) || 0) + 1); });
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };
  const recent = Date.now() - NEW_DAYS * 864e5;
  const pills = [['all', 'All']];
  if (state.facets.some(r => r.published_at && Date.parse(r.published_at) >= recent)) pills.push(['new', 'New']);
  if (state.facets.some(r => r.featured)) pills.push(['featured', 'Featured']);
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

  $('wallSearchWrap').hidden = state.total < SEARCH_FROM;
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

  $('wallMore').addEventListener('click', () => loadPage(false));
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      if (entries.some(en => en.isIntersecting) && !state.loading && !state.done && state.posts.length) loadPage(false);
    }, { rootMargin: '600px 0px' }).observe($('wallMore').parentElement);
  }
}

function updateStatus() {
  const n = state.posts.length;
  const filtered = state.filter !== 'all' || state.city || state.collection || state.product || state.q.trim();
  const brand = brandInstagram();
  let text;
  if (!filtered) {
    text = `${state.total} ${state.total === 1 ? 'person' : 'people'} on the Wall`;
  } else if (!n && !state.preview) {
    const where = state.city ? ` from ${state.city}` : '';
    text = `No one${where} here yet. Wear it, capture it, tag @${brand.handle}. You could be the first.`;
  } else {
    const parts = [];
    if (state.filter === 'new') parts.push('new');
    if (state.filter === 'featured') parts.push('featured');
    const where = state.city ? ` from ${state.city}` : '';
    text = `${n}${state.done ? '' : '+'} ${parts.join(' ')} ${n === 1 ? 'person' : 'people'}${where}${state.q.trim() ? ` matching "${state.q.trim()}"` : ''}`;
  }
  $('wallStatus').textContent = text.replace(/\s+/g, ' ');
}

/* ------------------------------------------------------------------ states */

function skeletons(n) {
  const ratios = ['4 / 5', '4 / 6', '1 / 1', '4 / 5', '3 / 4', '4 / 5.5', '4 / 5', '1 / 1'];
  return Array.from({ length: n }, (_, i) =>
    `<div class="wall-card is-skeleton" aria-hidden="true" style="--ar:${ratios[i % ratios.length]}"><div class="wall-sk-media"></div><div class="wall-sk-line"></div><div class="wall-sk-line is-short"></div></div>`).join('');
}

function showEmpty() {
  $('wallGridBody').innerHTML = '';
  $('wallGridBody').hidden = true;
  $('wallGridBody').setAttribute('aria-busy', 'false');
  $('wallTools').hidden = true;
  $('wallStatus').textContent = '';
  $('wallEmpty').hidden = false;
}

function showLoadError(message, keepCards) {
  state.loading = false;
  const grid = $('wallGridBody');
  grid.setAttribute('aria-busy', 'false');
  grid.classList.remove('is-updating');
  if (!keepCards) grid.innerHTML = '';
  $('wallStatus').innerHTML = `${esc(message || 'The Wall did not load. Check your connection and try again.')} <button type="button" class="wall-retry">Try again</button>`;
  $('wallStatus').querySelector('.wall-retry').addEventListener('click', () => {
    $('wallStatus').textContent = '';
    if (!state.client) return window.location.reload();
    if (keepCards) loadPage(false);
    else init();
  }, { once: true });
}

function initBrokenPhotos() {
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement) || !img.closest('.wall-page, .wall-lightbox')) return;
    const box = img.parentElement;
    img.remove();
    if (box && !box.querySelector('.wall-card-empty')) box.insertAdjacentHTML('afterbegin', '<span class="wall-card-empty">Photo unavailable</span>');
  }, true);
}

/* ------------------------------------------------------------------ masonry */

let cardObserver = null;
const ROW = 4;   // px; must match grid-auto-rows in css/wall.css
function watchCards(grid) {
  if (!('ResizeObserver' in window)) return;
  grid.classList.add('is-masonry');
  if (!cardObserver) {
    cardObserver = new ResizeObserver((entries) => {
      const gap = parseFloat(getComputedStyle(grid).getPropertyValue('--wall-gap')) || 16;
      entries.forEach(({ target }) => {
        const h = target.getBoundingClientRect().height;
        target.style.gridRowEnd = `span ${Math.ceil((h + gap) / ROW)}`;
      });
    });
  }
  grid.querySelectorAll('.wall-card:not([data-watched])').forEach(card => {
    card.dataset.watched = '1';
    cardObserver.observe(card);
  });
}

function animateIn(grid, from) {
  if (reduceMotion) return;
  [...grid.querySelectorAll('.wall-card:not(.is-skeleton)')].slice(from).forEach((card, i) => {
    card.style.setProperty('--delay', `${Math.min(i, 8) * 45}ms`);
    card.classList.add('is-entering');
  });
}

/* ------------------------------------------------------------------ lightbox */

function initLightbox() {
  const dialog = $('wallLightbox');
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (!opener || !opener.closest('.wall-page')) return;
    const id = opener.dataset.open;
    const list = allLoaded();
    const at = list.findIndex(p => p.id === id);
    if (at >= 0) openLightbox(list, at, opener, true);
  });
  $('wallLbClose').addEventListener('click', closeLightbox);
  $('wallLbPrev').addEventListener('click', () => step(-1));
  $('wallLbNext').addEventListener('click', () => step(1));
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeLightbox(); });
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); closeLightbox(); });
  // Arrow keys step between people wherever focus is while the viewer is open
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
    // the thumbnails are redrawn: keep keyboard focus on the chosen one
    const again = $('wallLbThumbs').querySelector(`[data-photo="${state.lb.photo}"]`);
    if (again) again.focus({ preventScroll: true });
  });
  // Swipe between people on touch screens
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

function openLightbox(list, index, opener, fromGrid = false) {
  const dialog = $('wallLightbox');
  state.lb = { list, index, photo: 0, opener: opener || document.activeElement, fromGrid };
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
  // Stepping past the last loaded person fetches the next page, like scrolling would
  if (lb.fromGrid && next >= lb.list.length && !state.done && !state.loading) {
    await loadPage(false);
    lb.list = allLoaded();
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
    ${post.is_demo ? '<span class="wall-tag is-demo">Demo</span>' : ''}
    ${state.preview && post.id === state.preview.id ? '<span class="wall-tag is-draft">Preview</span>' : ''}
    <h2 class="wall-lb-name" id="wallLbName">${esc(post.display_name)}</h2>
    <p class="wall-lb-place">${esc([place(post), post.state && post.state !== post.city ? post.state : ''].filter(Boolean).join(' · '))}</p>
    ${post.quote ? `<blockquote class="wall-lb-quote">&ldquo;${esc(post.quote)}&rdquo;</blockquote>` : ''}
    ${product.name ? `<dl class="wall-lb-facts">
      <div><dt>Wearing</dt><dd>${esc(product.name)}</dd></div>
      ${collection ? `<div><dt>Collection</dt><dd>${esc(collection)}</dd></div>` : ''}
      ${post.published_at ? `<div><dt>On the Wall</dt><dd>${esc(formatDate(post.published_at))}</dd></div>` : ''}
    </dl>` : ''}
    <div class="wall-lb-actions">
      ${product.href ? `<a class="wall-btn wall-btn-primary" href="${esc(product.href)}"${product.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>View this tee <span aria-hidden="true">&rarr;</span></a>` : ''}
      <button type="button" class="wall-btn wall-btn-link" id="wallLbShare">Share</button>
    </div>
    <p class="wall-lb-count" aria-live="polite">${list.length > 1 ? `${index + 1} of ${list.length}${state.lb.fromGrid && !state.done ? '+' : ''}` : ''}</p>`;

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
  setTimeout(() => { if (document.contains(btn)) btn.textContent = 'Share'; }, 2200);
}

/* ------------------------------------------------------------------ caption */

function initCaption(brand) {
  const btn = $('wallCopyCaption');
  const out = $('wallCopied');
  if (!btn) return;
  const caption = `Wearing my Bravadian. @${brand.handle} ${HASHTAG}`;
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(caption);
      out.textContent = 'Caption copied. Paste it into your post.';
    } catch (e) {
      out.textContent = `Your caption: ${caption}`;
    }
  });
}
