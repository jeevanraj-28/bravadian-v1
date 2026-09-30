/**
 * THE BRAVADIAN WALL — admin (dashboard, posts, add/edit with live preview, featured order, media)
 * Writes go straight to Supabase as the signed-in admin; db/009_wall.sql decides what is allowed
 * (only admins write, nothing publishes without permission and a photo, private notes stay private).
 */
import {
  BASE, PHOTO_BUCKET, LIMITS, CUSTOMER_KINDS, KIND_LABELS, esc, isSafeUrl, titleCase,
  renderPiece, photoUrl, collectionName, formatDate, productFor, place, isCustomer
} from './wall-shared.js';

const STATUS = { draft: 'Draft', pending: 'Pending review', approved: 'Approved', rejected: 'Rejected', published: 'Published' };
const PERMISSION = { pending: 'Permission pending', granted: 'Permission granted', rejected: 'Permission refused' };
const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_INPUT = 20 * 1024 * 1024;       // what we accept from the admin's computer
const MAX_STORED = 5 * 1024 * 1024;       // what the bucket accepts per file (db/009)
const MIN_SHORT_SIDE = 800;
const MAX_SIDE = 12000;
const OTHER = '__other__';

const $ = (id) => document.getElementById(id);
const S = {
  ready: false, posts: [], priv: new Map(), activity: [], error: null, loading: null,
  filter: 'all', q: '', view: 'grid', previewMode: 'desktop', previewDark: false,
  ed: null, dirty: false, saving: false, featuredOrder: null
};
const client = () => window.BravadianDB && window.BravadianDB.supabaseClient;
const bucket = () => client().storage.from(PHOTO_BUCKET);

/* ================================================================ lifecycle */

function init() {
  if (S.ready) return;
  S.ready = true;
  wireStatic();
  fixSiteLinks();
  load();
}

async function show(tab) {
  if (!S.ready) init();
  if (tab === 'walleditor' && !S.ed) newPost(false);
  await load();
  render(tab);
}

function canLeave(nextTab) {
  if (nextTab === 'walleditor' || !S.dirty || !isEditorOpen()) return true;
  if (window.confirm('This piece has unsaved changes. Leave without saving?')) { S.dirty = false; return true; }
  return false;
}
const isEditorOpen = () => $('pane-walleditor') && $('pane-walleditor').classList.contains('active');
const currentTab = () => (window.location.hash || '').replace('#', '');

async function load(force) {
  if (S.loading) return S.loading;
  if (S.loaded && !force) return;
  S.loading = (async () => {
    const c = client();
    if (!c) throw new Error('Supabase is not connected.');
    const [posts, priv, act] = await Promise.all([
      c.from('wall_posts').select('*').order('created_at', { ascending: false }).limit(5000),
      c.from('wall_post_private').select('*').limit(5000),
      c.from('wall_activity').select('*').order('at', { ascending: false }).limit(25)
    ]);
    if (posts.error) throw posts.error;
    S.posts = posts.data || [];
    S.priv = new Map(((priv.data) || []).map(r => [r.post_id, r]));
    S.activity = act.data || [];
    S.loaded = true;
    S.error = null;
  })().catch(err => { S.error = err; S.loaded = false; })
    .finally(() => { S.loading = null; renderSetup(); updateNavCount(); });
  return S.loading;
}

async function reload(tab) {
  S.loaded = false;
  await load(true);
  render(tab || currentTab());
}

function render(tab) {
  if (tab === 'wall') renderDashboard();
  if (tab === 'wallposts') renderPosts();
  if (tab === 'walleditor') renderEditor();
  if (tab === 'wallfeatured') renderFeaturedOrder();
  if (tab === 'wallmedia') renderMedia();
}

// db/009 not run yet (or no connection): say exactly what to do
function renderSetup() {
  const box = $('waSetup');
  if (!box) return;
  if (!S.error) { box.hidden = true; return; }
  const missing = /wall_posts|42P01|PGRST205|schema cache|does not exist/i.test(`${S.error.message} ${S.error.code}`);
  const db = window.BravadianDB ? window.BravadianDB.dbLabel : '';
  box.innerHTML = missing
    ? `<b>The Wall's tables are not set up in the ${esc(db)} database yet.</b> In Supabase → SQL Editor, run <code>db/009_wall.sql</code> (and optionally <code>db/010_wall_demo.sql</code> for demo posts), then reload this page.`
    : `<b>The Wall could not load.</b> ${esc(S.error.message || 'Check your connection.')} <button type="button" class="btn-action-icon" data-wall-retry>Try again</button>`;
  box.hidden = false;
}

function updateNavCount() {
  const el = $('wallNavCount');
  if (!el) return;
  const n = S.posts.filter(p => p.status === 'pending').length;
  el.hidden = !n;
  el.textContent = String(n);
  el.title = `${n} waiting for review`;
}

/* ================================================================ helpers */

const dbParam = () => {
  const v = new URLSearchParams(window.location.search).get('db');
  return v ? `db=${encodeURIComponent(v)}` : '';
};
const wallUrl = (extra = '') => {
  const q = [extra, dbParam()].filter(Boolean).join('&');
  return `${BASE}wall${q ? `?${q}` : ''}`;
};

function fixSiteLinks() {
  document.querySelectorAll('.wa-view-wall').forEach(a => { a.href = wallUrl(); });
  const asset = (u) => (window.BravadianDB && window.BravadianDB.assetUrl ? window.BravadianDB.assetUrl(u) : u);
  document.querySelectorAll('.wa-qr img, .wa-qr a[download]').forEach(el => {
    const attr = el.tagName === 'IMG' ? 'src' : 'href';
    el.setAttribute(attr, asset(el.getAttribute(attr)));
  });
}

function ago(iso) {
  const t = Date.parse(iso);
  if (isNaN(t)) return '';
  const s = Math.round((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return formatDate(iso);
}

const statusPill = (s) => `<span class="wa-pill is-${esc(s)}">${esc(STATUS[s] || s)}</span>`;
const permissionPill = (s) => `<span class="wa-pill is-perm-${esc(s)}">${esc(PERMISSION[s] || s)}</span>`;
const kindOf = (post) => (post.featured ? 'featured' : (post.kind || 'photo'));
const kindPill = (post) => `<span class="wa-pill is-kind">${esc(KIND_LABELS[kindOf(post)] || post.kind)}</span>`;
const thumb = (post, cls = 'wa-thumb') => {
  const img = (post.images || [])[0];
  const src = img ? photoUrl(img, 480) : '';
  if (src) return `<img class="${cls}" src="${esc(src)}" alt="" loading="lazy">`;
  return `<span class="${cls} is-empty">${isCustomer(post) ? 'No photo' : esc(KIND_LABELS[post.kind] || 'Card')}</span>`;
};
const placeOf = (post) => (isCustomer(post) ? place(post) : KIND_LABELS[post.kind] || '');
const storagePath = (url) => {
  const m = String(url || '').match(/\/storage\/v1\/object\/public\/wall-photos\/([^?#]+)/);
  return m ? decodeURIComponent(m[1]) : null;
};
const photoPaths = (img) => Object.values((img && img.sizes) || {}).map(storagePath).filter(Boolean);

function publishProblems(post) {
  const out = [];
  const kind = post.kind || 'photo';
  if (!isCustomer(post)) {
    if (!String(post.display_name || '').trim()) out.push(kind === 'quote' ? 'who said it' : 'a title');
    if (kind === 'quote' && !String(post.quote || '').trim()) out.push('the quote');
    if (kind === 'note' && !String(post.body || '').trim()) out.push('the note text');
    if (kind === 'collection' && !post.collection_slug) out.push('a collection');
    if ((post.images || []).some(i => !String(i.alt || '').trim())) out.push('alt text on every photo');
    return out;
  }
  if (!String(post.display_name || '').trim()) out.push('a display name');
  if (!String(post.city || '').trim()) out.push('a city');
  if (!(post.images || []).length) out.push('at least one photo');
  if ((post.images || []).some(i => !String(i.alt || '').trim())) out.push('alt text on every photo');
  if (post.permission_status !== 'granted') out.push('permission granted by the customer');
  return out;
}

function friendly(error) {
  const msg = (error && (error.message || error.error_description)) || String(error || 'Something went wrong');
  if (/wall_publish_needs_permission_and_photo/.test(msg)) return 'It can\'t be published yet: it needs permission granted and at least one photo.';
  if (/wall_customer_needs_city/.test(msg)) return 'Add the customer\'s city.';
  if (/wall_link_valid/.test(msg)) return 'The button link must be a full https:// link or a site path starting with /.';
  if (/wall_kind_valid|wall_layout_valid|column .* does not exist|PGRST204/.test(msg)) return 'The database needs the latest Wall update: run db/009_wall.sql again in Supabase → SQL Editor, then retry.';
  if (/row-level security|permission denied|not authorized|JWT/i.test(msg)) return 'You are not signed in as an admin any more. Sign in again and retry.';
  if (/maximum allowed size|Payload too large|413/i.test(msg)) return 'A photo is too large to upload. Try a smaller photo.';
  if (/mime type|invalid_mime/i.test(msg)) return 'That file type can\'t be uploaded.';
  if (/Failed to fetch|NetworkError|network|503/i.test(msg)) return 'The database could not be reached. Check your connection and try again. Nothing was lost on this page.';
  return msg;
}

/* ---------------------------------------------------------------- toast + confirm */

let toastTimer = 0;
function toast(message, kind = 'ok') {
  const el = $('waToast');
  el.textContent = message;
  el.className = `wa-toast is-on is-${kind}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.className = 'wa-toast'; }, kind === 'error' ? 7000 : 3200);
}

function confirmBox({ title, body, ok = 'Confirm', danger = false }) {
  const d = $('waConfirm');
  $('waConfirmTitle').textContent = title;
  $('waConfirmBody').textContent = body;
  const okBtn = $('waConfirmOk');
  okBtn.textContent = ok.toUpperCase();
  okBtn.classList.toggle('is-danger', danger);
  return new Promise(resolve => {
    d.addEventListener('close', () => resolve(d.returnValue === 'ok'), { once: true });
    d.returnValue = '';
    d.showModal();
    $('waConfirmCancel').focus();
  });
}

/* ================================================================ static wiring */

function wireStatic() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-wall-new], [data-wall-tab], [data-wall-act], [data-wall-retry]');
    if (!t) return;
    if (t.hasAttribute('data-wall-new')) { e.preventDefault(); newPost(true); return; }
    if (t.hasAttribute('data-wall-tab')) { e.preventDefault(); go(t.dataset.wallTab); return; }
    if (t.hasAttribute('data-wall-retry')) { reload(); return; }
    const { wallAct: act, id } = t.dataset;
    if (act) { e.preventDefault(); runAction(act, id, t); }
  });

  $('waFilters').addEventListener('click', (e) => {
    const b = e.target.closest('[data-f]');
    if (!b) return;
    S.filter = b.dataset.f;
    $('waFilters').querySelectorAll('[data-f]').forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    renderPosts();
  });
  let qt = 0;
  $('waSearch').addEventListener('input', (e) => { clearTimeout(qt); qt = setTimeout(() => { S.q = e.target.value.trim().toLowerCase(); renderPosts(); }, 150); });
  document.querySelector('#pane-wallposts .wa-view-toggle').addEventListener('click', (e) => {
    const b = e.target.closest('[data-view]');
    if (!b) return;
    S.view = b.dataset.view;
    b.parentElement.querySelectorAll('[data-view]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    renderPosts();
  });
  $('waRemoveDemo').addEventListener('click', removeDemo);
  $('waSaveOrder').addEventListener('click', saveFeaturedOrder);
  $('waPhotoClose').addEventListener('click', () => $('waPhotoDialog').close());
  $('waPhotoDialog').addEventListener('click', (e) => { if (e.target === $('waPhotoDialog')) $('waPhotoDialog').close(); });
  wireEditor();
  window.addEventListener('beforeunload', (e) => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });
}

function go(tab) {
  if (window.BravadianAdmin && window.BravadianAdmin.switchTab) {
    if (window.location.hash !== `#${tab}`) history.pushState(null, '', `#${tab}`);
    window.BravadianAdmin.switchTab(tab);
  } else window.location.hash = `#${tab}`;
}

/* ================================================================ dashboard */

function renderDashboard() {
  const posts = S.posts;
  const count = (fn) => posts.filter(fn).length;
  const metrics = [
    ['TOTAL WALL POSTS', posts.length, ''],
    ['PUBLISHED', count(p => p.status === 'published'), 'is-green'],
    ['PENDING REVIEW', count(p => p.status === 'pending'), 'is-amber'],
    ['DRAFTS', count(p => p.status === 'draft'), ''],
    ['FEATURED', count(p => p.featured), 'is-red'],
    ['AWAITING PERMISSION', count(p => isCustomer(p) && p.permission_status === 'pending' && p.status !== 'rejected'), '']
  ];
  $('waMetrics').innerHTML = metrics.map(([t, v, c]) =>
    `<div class="metric-card"><div class="metric-title">${t}</div><div class="metric-val ${c}">${S.error ? '—' : v}</div></div>`).join('');

  const recent = posts.slice(0, 6);
  $('waRecent').innerHTML = recent.length ? `<ul class="wa-recent">${recent.map(p => `
    <li>
      ${thumb(p)}
      <div class="wa-recent-who"><b>${esc(p.display_name)}</b><span>${esc(placeOf(p))}${p.is_demo ? ' · <em>demo</em>' : ''}</span></div>
      <div class="wa-recent-state">${statusPill(p.status)}<small>${esc(ago(p.created_at))}</small></div>
      <button type="button" class="btn-action-icon" data-wall-act="edit" data-id="${esc(p.id)}">✎ Edit</button>
    </li>`).join('')}</ul>`
    : `<p class="wa-empty-note">No customers yet. <button type="button" class="btn-action-icon" data-wall-new>+ Add the first one</button></p>`;

  $('waActivity').innerHTML = S.activity.length ? S.activity.slice(0, 10).map(a => `
    <li><span class="wa-act-dot is-${esc(String(a.action).replace(/\s+/g, '-'))}"></span>
      <p><b>${esc(titleCase(a.action))}</b> · ${esc(a.display_name || 'a post')}</p>
      <small>${esc(ago(a.at))}${a.actor ? ` · ${esc(a.actor)}` : ''}</small></li>`).join('')
    : '<li class="wa-empty-note">Adds, edits and publishes appear here.</li>';

  const byCity = new Map();
  posts.filter(p => p.status === 'published' && isCustomer(p)).forEach(p => byCity.set(p.city, (byCity.get(p.city) || 0) + 1));
  const cities = [...byCity.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = cities.length ? cities[0][1] : 1;
  $('waCities').innerHTML = cities.length ? `<ul class="wa-bars">${cities.map(([c, n]) => `
    <li><span class="wa-bar-label">${esc(c)}</span><span class="wa-bar"><i style="width:${Math.max(6, Math.round(n / max * 100))}%"></i></span><b>${n}</b></li>`).join('')}</ul>`
    : '<p class="wa-empty-note">Cities appear once posts are published.</p>';
}

/* ================================================================ posts */

function filteredPosts() {
  const q = S.q;
  return S.posts.filter(p => {
    if (S.filter === 'featured' ? !p.featured : S.filter !== 'all' && p.status !== S.filter) return false;
    if (!q) return true;
    const product = productFor(p);
    return [p.display_name, p.city, p.state, product.name, p.collection_slug, p.quote, p.body, KIND_LABELS[kindOf(p)]]
      .some(v => String(v || '').toLowerCase().includes(q));
  });
}

function actionButtons(p, compact) {
  const b = [];
  b.push(`<button type="button" class="btn-action-icon" data-wall-act="edit" data-id="${esc(p.id)}">✎ Edit</button>`);
  b.push(`<button type="button" class="btn-action-icon" data-wall-act="preview" data-id="${esc(p.id)}">👁 Preview</button>`);
  if (p.status === 'pending') {
    b.push(`<button type="button" class="btn-action-icon" data-wall-act="approve" data-id="${esc(p.id)}">✓ Approve</button>`);
    b.push(`<button type="button" class="btn-action-icon" data-wall-act="reject" data-id="${esc(p.id)}">✕ Reject</button>`);
  }
  if (p.status === 'published') b.push(`<button type="button" class="btn-action-icon" data-wall-act="unpublish" data-id="${esc(p.id)}">⤓ Unpublish</button>`);
  else if (p.status !== 'rejected') b.push(`<button type="button" class="btn-action-icon is-go" data-wall-act="publish" data-id="${esc(p.id)}">⤒ Publish</button>`);
  b.push(`<button type="button" class="btn-action-icon danger" data-wall-act="delete" data-id="${esc(p.id)}">✕ Delete</button>`);
  return `<div class="wa-row-actions${compact ? ' is-compact' : ''}">${b.join('')}</div>`;
}

function renderPosts() {
  const list = filteredPosts();
  const box = $('waPosts');
  const demo = S.posts.filter(p => p.is_demo).length;
  $('waRemoveDemo').hidden = !demo;
  $('waRemoveDemo').textContent = `REMOVE ${demo} DEMO POST${demo === 1 ? '' : 'S'}`;
  $('waPostsNote').textContent = S.error ? '' : `${S.posts.length} ${S.posts.length === 1 ? 'post' : 'posts'} · ${S.posts.filter(p => p.status === 'published').length} on the Wall${S.filter !== 'all' || S.q ? ` · ${list.length} shown` : ''}`;
  box.className = `wa-posts is-${S.view}`;
  if (S.error) { box.innerHTML = ''; return; }
  if (!list.length) {
    box.innerHTML = `<p class="wa-empty-note">${S.posts.length ? 'Nothing matches this filter.' : 'Nothing on the Wall yet.'} <button type="button" class="btn-action-icon" data-wall-new>+ Add to the Wall</button></p>`;
    return;
  }
  const productName = (p) => productFor(p).name || '—';
  if (S.view === 'list') {
    box.innerHTML = `<div class="wa-table-wrap"><table class="admin-table wa-table"><thead><tr>
      <th>PHOTO</th><th>PIECE</th><th>TYPE · TEE</th><th>STATUS</th><th>ADDED</th><th>ACTIONS</th></tr></thead><tbody>
      ${list.map(p => `<tr>
        <td>${thumb(p, 'wa-thumb is-small')}</td>
        <td><b>${esc(p.display_name)}</b>${p.featured ? ' <span class="wa-star" title="Featured">★</span>' : ''}${p.is_demo ? ' <span class="wa-pill is-demo">Demo</span>' : ''}<br><small>${esc(placeOf(p))}</small></td>
        <td>${kindPill(p)}<br><small>${esc(isCustomer(p) ? productName(p) : '')}</small></td>
        <td>${statusPill(p.status)}${isCustomer(p) ? `<br>${permissionPill(p.permission_status)}` : ''}</td>
        <td><small>${esc(formatDate(p.submitted_at || p.created_at))}</small></td>
        <td>${actionButtons(p, true)}</td></tr>`).join('')}
      </tbody></table></div>`;
    return;
  }
  box.innerHTML = list.map(p => `
    <article class="wa-post">
      <button type="button" class="wa-post-media" data-wall-act="edit" data-id="${esc(p.id)}" aria-label="Edit ${esc(p.display_name)}">
        ${thumb(p, 'wa-post-img')}
        <span class="wa-post-badges">${p.featured ? '<span class="wa-pill is-featured">★ Featured</span>' : ''}${p.is_demo ? '<span class="wa-pill is-demo">Demo</span>' : ''}</span>
      </button>
      <div class="wa-post-body">
        <p class="wa-post-name"><b>${esc(p.display_name)}</b><span>${esc(placeOf(p))}</span></p>
        <p class="wa-post-product">${kindPill(p)} ${isCustomer(p) ? esc(productName(p)) : ''}</p>
        <p class="wa-post-pills">${statusPill(p.status)} ${isCustomer(p) ? permissionPill(p.permission_status) : ''}</p>
        <p class="wa-post-date">Added ${esc(formatDate(p.created_at))}${p.published_at ? ` · live since ${esc(formatDate(p.published_at))}` : ''}</p>
        ${actionButtons(p)}
      </div>
    </article>`).join('');
}

/* ---------------------------------------------------------------- actions from lists */

async function runAction(act, id, button) {
  const post = S.posts.find(p => p.id === id);
  if (!post) return;
  if (act === 'edit') return openPost(post);
  if (act === 'preview') return window.open(wallUrl(`preview=${encodeURIComponent(post.id)}`), '_blank', 'noopener');
  if (act === 'photo') return showPhoto(post, Number(button.dataset.photo || 0));
  if (act === 'publish') return publishPost(post);
  if (act === 'unpublish') return setStatus(post, 'approved', { confirm: { title: `Take ${post.display_name} off the Wall?`, body: 'The post stays saved here as Approved. You can publish it again any time.', ok: 'Unpublish' } });
  if (act === 'approve') return setStatus(post, 'approved');
  if (act === 'reject') return setStatus(post, 'rejected', { confirm: { title: `Reject ${post.display_name}?`, body: 'The post stays saved as Rejected and will not appear on the Wall.', ok: 'Reject', danger: true } });
  if (act === 'delete') return deletePost(post);
  if (act === 'up' || act === 'down') return moveFeatured(id, act === 'up' ? -1 : 1);
  if (act === 'unfeature') return unfeature(post);
  if (act === 'delphoto') return deletePhoto(post, Number(button.dataset.photo));
}

async function publishPost(post) {
  const problems = publishProblems(post);
  if (problems.length) {
    toast(`${post.display_name} can't be published yet. It needs ${problems.join(', ')}.`, 'error');
    return false;
  }
  const ok = await confirmBox({ title: `Publish ${post.display_name} to the Wall?`, body: publishBody(post), ok: 'Publish' });
  if (!ok) return false;
  return setStatus(post, 'published');
}

function publishBody(post) {
  return isCustomer(post)
    ? 'Everyone visiting bravadian.in/wall will see their photo, name, city, words and the tee they wear. Their order reference and permission note stay private.'
    : 'Everyone visiting bravadian.in/wall will see this card.';
}

async function setStatus(post, status, opts = {}) {
  if (opts.confirm && !(await confirmBox(opts.confirm))) return false;
  const { error } = await client().from('wall_posts').update({ status }).eq('id', post.id);
  if (error) { toast(friendly(error), 'error'); return false; }
  toast(status === 'published' ? `${post.display_name} is live on the Wall.` : `${post.display_name}: ${STATUS[status]}.`);
  if (S.ed && S.ed.id === post.id) S.ed.status = status;
  await reload();
  return true;
}

async function deletePost(post) {
  const ok = await confirmBox({ title: `Delete ${post.display_name}?`, body: `This removes the post, its ${(post.images || []).length} photo(s) and its private notes for good. It can't be undone.`, ok: 'Delete', danger: true });
  if (!ok) return false;
  const { error } = await client().from('wall_posts').delete().eq('id', post.id);
  if (error) { toast(friendly(error), 'error'); return false; }
  const paths = (post.images || []).flatMap(photoPaths);
  if (paths.length) await bucket().remove(paths).catch(() => {});
  toast(`${post.display_name} was deleted.`);
  if (S.ed && S.ed.id === post.id) { S.ed = null; S.dirty = false; if (isEditorOpen()) go('wallposts'); }
  await reload();
  return true;
}

async function removeDemo() {
  const demo = S.posts.filter(p => p.is_demo);
  if (!demo.length) return;
  const ok = await confirmBox({ title: `Remove all ${demo.length} demo posts?`, body: 'Demo posts are the examples from db/010_wall_demo.sql. Real customers are not touched.', ok: 'Remove demo posts', danger: true });
  if (!ok) return;
  const { error } = await client().from('wall_posts').delete().eq('is_demo', true);
  if (error) return toast(friendly(error), 'error');
  toast('Demo posts removed. The Wall now shows only real customers.');
  await reload();
}

/* ================================================================ featured order */

function featuredList() {
  if (S.featuredOrder) return S.featuredOrder.map(id => S.posts.find(p => p.id === id)).filter(Boolean);
  return S.posts.filter(p => p.featured)
    .sort((a, b) => a.display_order - b.display_order || String(b.published_at || '').localeCompare(String(a.published_at || '')));
}

function renderFeaturedOrder() {
  const list = featuredList();
  const box = $('waFeaturedList');
  $('waSaveOrder').disabled = !S.featuredOrder;
  if (!list.length) {
    box.innerHTML = '<li class="wa-empty-note">No featured customers yet. Open a customer and turn on “Featured story”.</li>';
    return;
  }
  let shown = 0;
  box.innerHTML = list.map((p, i) => {
    const live = p.status === 'published' && p.permission_status === 'granted';
    const onWall = live && shown++ < 3;
    return `<li class="wa-feat" draggable="true" data-id="${esc(p.id)}">
      <span class="wa-grip" aria-hidden="true">⋮⋮</span>
      <span class="wa-feat-num">${i + 1}</span>
      ${thumb(p, 'wa-thumb is-small')}
      <div class="wa-feat-who"><b>${esc(p.display_name)}</b><small>${esc(p.featured_headline || 'This is what Bravadian looks like.')}</small></div>
      <div class="wa-feat-state">${statusPill(p.status)}${onWall ? '<span class="wa-pill is-featured">On the Wall now</span>' : live ? '' : '<small>Not public</small>'}</div>
      <div class="wa-row-actions is-compact">
        <button type="button" class="btn-action-icon" data-wall-act="up" data-id="${esc(p.id)}" aria-label="Move ${esc(p.display_name)} up"${i === 0 ? ' disabled' : ''}>↑</button>
        <button type="button" class="btn-action-icon" data-wall-act="down" data-id="${esc(p.id)}" aria-label="Move ${esc(p.display_name)} down"${i === list.length - 1 ? ' disabled' : ''}>↓</button>
        <button type="button" class="btn-action-icon" data-wall-act="edit" data-id="${esc(p.id)}">✎ Edit</button>
        <button type="button" class="btn-action-icon danger" data-wall-act="unfeature" data-id="${esc(p.id)}">☆ Unfeature</button>
      </div>
    </li>`;
  }).join('');
  wireDrag(box);
}

function wireDrag(box) {
  let dragged = null;
  box.querySelectorAll('.wa-feat').forEach(li => {
    li.addEventListener('dragstart', (e) => { dragged = li; li.classList.add('is-dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', li.dataset.id); });
    li.addEventListener('dragend', () => {
      li.classList.remove('is-dragging');
      dragged = null;
      S.featuredOrder = [...box.querySelectorAll('.wa-feat')].map(x => x.dataset.id);
      renderFeaturedOrder();
    });
    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (!dragged || dragged === li) return;
      const r = li.getBoundingClientRect();
      box.insertBefore(dragged, e.clientY > r.top + r.height / 2 ? li.nextSibling : li);
    });
  });
}

function moveFeatured(id, dir) {
  const ids = featuredList().map(p => p.id);
  const i = ids.indexOf(id), j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  S.featuredOrder = ids;
  renderFeaturedOrder();
  const btn = $('waFeaturedList').querySelector(`[data-id="${CSS.escape(id)}"] [data-wall-act="${dir < 0 ? 'up' : 'down'}"]`);
  if (btn && !btn.disabled) btn.focus();
}

async function saveFeaturedOrder() {
  if (!S.featuredOrder) return;
  const btn = $('waSaveOrder');
  btn.disabled = true;
  btn.textContent = 'SAVING…';
  try {
    for (const [i, id] of S.featuredOrder.entries()) {
      const { error } = await client().from('wall_posts').update({ display_order: i + 1 }).eq('id', id);
      if (error) throw error;
    }
    S.featuredOrder = null;
    toast('Featured order saved.');
    await reload('wallfeatured');
  } catch (err) {
    toast(friendly(err), 'error');
    btn.disabled = false;
  } finally {
    btn.textContent = 'SAVE ORDER';
  }
}

async function unfeature(post) {
  const { error } = await client().from('wall_posts').update({ featured: false }).eq('id', post.id);
  if (error) return toast(friendly(error), 'error');
  if (S.featuredOrder) S.featuredOrder = S.featuredOrder.filter(id => id !== post.id);
  toast(`${post.display_name} is no longer featured.`);
  await reload();
}

/* ================================================================ media */

function renderMedia() {
  const items = [];
  S.posts.forEach(p => (p.images || []).forEach((img, i) => items.push({ p, img, i })));
  items.sort((a, b) => String(b.img.uploadedAt || b.p.created_at).localeCompare(String(a.img.uploadedAt || a.p.created_at)));
  $('waMediaNote').textContent = S.error ? '' : `${items.length} photo${items.length === 1 ? '' : 's'} across ${S.posts.length} post${S.posts.length === 1 ? '' : 's'}.`;
  const fileName = (img) => {
    const url = (img.sizes && (img.sizes[960] || img.sizes[1600] || img.sizes[480])) || '';
    return url.split('/').pop() || img.id;
  };
  $('waMedia').innerHTML = items.length ? items.map(({ p, img, i }) => `
    <figure class="wa-media-item">
      <button type="button" class="wa-media-thumb" data-wall-act="photo" data-id="${esc(p.id)}" data-photo="${i}" aria-label="Preview photo of ${esc(p.display_name)}">
        <img src="${esc(photoUrl(img, 480))}" alt="${esc(img.alt || '')}" loading="lazy">
        ${i === 0 ? '<span class="wa-pill is-cover">Cover</span>' : ''}
      </button>
      <figcaption>
        <b title="${esc(fileName(img))}">${esc(fileName(img))}</b>
        <span>${esc(p.display_name)} · ${esc(formatDate(img.uploadedAt || p.created_at))}${img.w ? ` · ${Math.round(img.w)}×${Math.round(img.h)}` : ''}</span>
        <span>${statusPill(p.status)}${p.featured ? ' <span class="wa-star" title="Featured">★</span>' : ''}${img.alt ? '' : ' <span class="wa-pill is-warn">No alt text</span>'}</span>
        <div class="wa-row-actions is-compact">
          <button type="button" class="btn-action-icon" data-wall-act="photo" data-id="${esc(p.id)}" data-photo="${i}">👁</button>
          <button type="button" class="btn-action-icon" data-wall-act="edit" data-id="${esc(p.id)}">✎ Edit</button>
          ${p.status === 'published'
            ? `<button type="button" class="btn-action-icon" data-wall-act="unpublish" data-id="${esc(p.id)}">⤓ Unpublish</button>`
            : p.status !== 'rejected' ? `<button type="button" class="btn-action-icon is-go" data-wall-act="publish" data-id="${esc(p.id)}">⤒ Publish</button>` : ''}
          <button type="button" class="btn-action-icon danger" data-wall-act="delphoto" data-id="${esc(p.id)}" data-photo="${i}">✕ Delete</button>
        </div>
      </figcaption>
    </figure>`).join('')
    : '<p class="wa-empty-note">Photos you add to Wall posts appear here.</p>';
}

function showPhoto(post, index) {
  const img = (post.images || [])[index];
  if (!img) return;
  $('waPhotoBody').innerHTML = `
    <img src="${esc(photoUrl(img, 1600))}" alt="${esc(img.alt || '')}">
    <p><b>${esc(post.display_name)}</b> · ${esc(place(post))} · photo ${index + 1} of ${(post.images || []).length}</p>
    <p class="wa-muted">${img.alt ? `Alt text: ${esc(img.alt)}` : 'No alt text yet.'}${img.caption ? ` · Caption: ${esc(img.caption)}` : ''}</p>`;
  $('waPhotoDialog').showModal();
}

async function deletePhoto(post, index) {
  const imgs = [...(post.images || [])];
  if (!imgs[index]) return;
  if (post.status === 'published' && imgs.length === 1) {
    toast(`That is ${post.display_name}'s only photo and the post is live. Unpublish it first, or add another photo.`, 'error');
    return;
  }
  const ok = await confirmBox({ title: 'Delete this photo?', body: `It is removed from ${post.display_name}'s post and from storage. It can't be undone.`, ok: 'Delete photo', danger: true });
  if (!ok) return;
  const [gone] = imgs.splice(index, 1);
  const patch = { images: imgs, featured_image: Math.min(post.featured_image || 0, Math.max(0, imgs.length - 1)) };
  const { error } = await client().from('wall_posts').update(patch).eq('id', post.id);
  if (error) return toast(friendly(error), 'error');
  const paths = photoPaths(gone);
  if (paths.length) await bucket().remove(paths).catch(() => {});
  toast('Photo deleted.');
  await reload();
}

/* ================================================================ editor */

const F = (id) => $(id);
const FIELDS = ['waKind', 'waName', 'waCity', 'waState', 'waCountry', 'waDate', 'waQuote',
  'waProduct', 'waCollection', 'waProductName', 'waProductUrl', 'waHeadline', 'waFeaturedQuote', 'waFeaturedImage', 'waPermission',
  'waOrderRef', 'waPermissionNote', 'waStatus', 'waOrder'];
const KIND_HELP = {
  photo: 'A customer photo on the Wall: a print taped at four corners. Needs their permission and a photo.',
  featured: 'A featured customer: a larger print near the top of the Wall. Needs permission and a photo.'
};
const currentKind = () => F('waKind').value || 'photo';
const kindIsCustomer = () => true;   // the Wall shows customers only (old brand cards can only be deleted)

function newPost(navigate) {
  if (S.dirty && isEditorOpen() && !window.confirm('This piece has unsaved changes. Start a new one anyway?')) return;
  S.ed = { id: null, isNew: true, status: 'draft', photos: [], removed: [] };
  S.dirty = false;
  fillForm({ kind: 'photo', country: 'India', permission_status: 'pending', status: 'draft', display_order: 0, size: 'auto', tape: 'auto', submitted_at: new Date().toISOString().slice(0, 10) }, {});
  if (navigate) go('walleditor');
  else renderEditor();
}

function openPost(post) {
  if (S.dirty && isEditorOpen() && S.ed && S.ed.id !== post.id && !window.confirm('This piece has unsaved changes. Open another one anyway?')) return;
  S.ed = {
    id: post.id, isNew: false, status: post.status, is_demo: post.is_demo, created_at: post.created_at,
    photos: (post.images || []).map(img => ({ ...img, saved: true })), removed: []
  };
  S.dirty = false;
  fillForm(post, S.priv.get(post.id) || {});
  go('walleditor');
  renderEditor();
}

function fillOptions() {
  const products = (window.BravadianDB ? window.BravadianDB.getProducts() : [])
    .slice().sort((a, b) => a.name.localeCompare(b.name));
  F('waProduct').innerHTML = '<option value="">None / not sure</option>'
    + products.map(p => `<option value="${esc(p.id)}">${esc(titleCase(p.name))}${p.status === 'DRAFT' ? ' (draft)' : ''}</option>`).join('')
    + `<option value="${OTHER}">Other product (enter a link)…</option>`;
  const cols = (window.BravadianDB ? window.BravadianDB.getCollections() : []).filter(c => c.slug !== 'all');
  F('waCollection').innerHTML = '<option value="">None</option>' + cols.map(c => `<option value="${esc(c.slug)}">${esc(titleCase(c.name))}</option>`).join('');
  const cities = [...new Set(S.posts.map(p => p.city).filter(Boolean))].sort();
  F('waCityList').innerHTML = cities.map(c => `<option value="${esc(c)}"></option>`).join('');
}

function fillForm(post, priv) {
  fillOptions();
  const manual = !post.product_id && (post.product_url || post.product_name);
  const set = (id, v) => { F(id).value = v == null ? '' : v; };
  set('waName', post.display_name);
  set('waCity', post.city);
  set('waState', post.state);
  set('waCountry', post.country || 'India');
  set('waDate', post.submitted_at || '');
  set('waQuote', post.quote);
  F('waKind').value = post.featured ? 'featured' : 'photo';
  F('waProduct').value = post.product_id && [...F('waProduct').options].some(o => o.value === post.product_id) ? post.product_id : (manual ? OTHER : '');
  set('waCollection', post.collection_slug || '');
  set('waProductName', manual ? post.product_name : '');
  set('waProductUrl', manual ? post.product_url : '');
  set('waHeadline', post.featured_headline);
  set('waFeaturedQuote', post.featured_quote);
  set('waPermission', post.permission_status || 'pending');
  set('waOrderRef', priv.order_reference);
  set('waPermissionNote', priv.permission_note);
  set('waStatus', post.status || 'draft');
  set('waOrder', post.display_order || 0);
  S.ed.featuredImage = post.featured_image || 0;
  clearErrors();
  syncEditorUi();
}

function wireEditor() {
  const form = F('waForm');
  form.addEventListener('submit', (e) => e.preventDefault());
  form.addEventListener('input', (e) => {
    if (e.target.closest('.wa-photo')) return;
    S.dirty = true;
    if (e.target.id && e.target.closest('.admin-field')) fieldError(e.target.id, '');
    syncEditorUi();
  });
  form.addEventListener('change', (e) => {
    if (e.target.id === 'waProduct') {
      const p = window.BravadianDB.getProducts().find(x => x.id === e.target.value);
      if (p && p.collection) F('waCollection').value = p.collection;
    }
    if (e.target.id === 'waProductUrl') validateField(e.target.id);
    S.dirty = true;
    syncEditorUi();
  });
  F('waFiles').addEventListener('change', (e) => { addFiles([...e.target.files]); e.target.value = ''; });
  const drop = F('waDrop');
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => addFiles([...(e.dataTransfer.files || [])]));

  const list = F('waPhotoList');
  list.addEventListener('input', (e) => {
    const card = e.target.closest('.wa-photo');
    const ph = card && S.ed.photos.find(p => p.id === card.dataset.id);
    if (!ph || !e.target.dataset.k) return;
    ph[e.target.dataset.k] = e.target.value;
    S.dirty = true;
    syncEditorUi(false);
  });
  list.addEventListener('click', (e) => {
    const card = e.target.closest('.wa-photo');
    if (!card) return;
    const i = S.ed.photos.findIndex(p => p.id === card.dataset.id);
    const act = e.target.closest('[data-photo-act]');
    if (act) {
      const a = act.dataset.photoAct;
      if (a === 'cover' && i > 0) { const [ph] = S.ed.photos.splice(i, 1); S.ed.photos.unshift(ph); S.ed.featuredImage = 0; }
      if (a === 'left' && i > 0) [S.ed.photos[i - 1], S.ed.photos[i]] = [S.ed.photos[i], S.ed.photos[i - 1]];
      if (a === 'right' && i < S.ed.photos.length - 1) [S.ed.photos[i + 1], S.ed.photos[i]] = [S.ed.photos[i], S.ed.photos[i + 1]];
      if (a === 'remove') removePhoto(i);
      if (a === 'replace') { card.querySelector('.wa-replace-input').click(); return; }
      S.dirty = true;
      renderPhotos();
      syncEditorUi();
      return;
    }
    const frame = e.target.closest('.wa-photo-frame');
    if (frame) {       // click sets the focus point used when the photo is cropped on the Wall
      const r = frame.getBoundingClientRect();
      const ph = S.ed.photos[i];
      ph.focal = [Math.round((e.clientX - r.left) / r.width * 100), Math.round((e.clientY - r.top) / r.height * 100)];
      S.dirty = true;
      renderPhotos();
      syncEditorUi();
    }
  });
  list.addEventListener('change', async (e) => {
    if (!e.target.classList.contains('wa-replace-input')) return;
    const card = e.target.closest('.wa-photo');
    const i = S.ed.photos.findIndex(p => p.id === card.dataset.id);
    const file = e.target.files[0];
    e.target.value = '';
    if (!file || i < 0) return;
    try {
      const next = await processFile(file);
      const old = S.ed.photos[i];
      if (old.saved) S.ed.removed.push(...photoPaths(old));
      if (old.preview) URL.revokeObjectURL(old.preview);
      next.alt = old.alt || '';
      next.caption = old.caption || '';
      S.ed.photos[i] = next;
      S.dirty = true;
      renderPhotos();
      syncEditorUi();
    } catch (err) { F('waPhotosError').textContent = err.message; }
  });

  F('waActions').addEventListener('click', (e) => {
    const b = e.target.closest('[data-ed]');
    if (!b || S.saving) return;
    const a = b.dataset.ed;
    if (a === 'draft') save();
    if (a === 'publish') save('published');
    if (a === 'unpublish') save('approved', true);
    if (a === 'preview') previewOnWall();
    if (a === 'delete') { const p = S.posts.find(x => x.id === S.ed.id); if (p) deletePost(p); }
  });
  document.querySelector('#pane-walleditor .wa-view-toggle').addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.hasAttribute('data-preview-theme')) { S.previewDark = !S.previewDark; b.setAttribute('aria-pressed', String(S.previewDark)); }
    else {
      S.previewMode = b.dataset.preview;
      b.parentElement.querySelectorAll('[data-preview]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }
    renderPreview();
  });
}

function removePhoto(i) {
  const [ph] = S.ed.photos.splice(i, 1);
  if (!ph) return;
  if (ph.saved) S.ed.removed.push(...photoPaths(ph));
  if (ph.preview) URL.revokeObjectURL(ph.preview);
  if (S.ed.featuredImage >= S.ed.photos.length) S.ed.featuredImage = 0;
}

/* ---------------------------------------------------------------- photos: validate, resize, preview */

async function addFiles(files) {
  const err = F('waPhotosError');
  err.textContent = '';
  const room = LIMITS.photos - S.ed.photos.length;
  if (!files.length) return;
  if (room <= 0) { err.textContent = `A post can have up to ${LIMITS.photos} photos. Remove one first.`; return; }
  const problems = [];
  for (const file of files.slice(0, room)) {
    const card = { id: `busy-${Math.random().toString(36).slice(2)}`, busy: true, name: file.name };
    S.ed.photos.push(card);
    renderPhotos();
    try {
      const ph = await processFile(file);
      const at = S.ed.photos.indexOf(card);
      S.ed.photos.splice(at, 1, ph);
      S.dirty = true;
    } catch (e) {
      S.ed.photos.splice(S.ed.photos.indexOf(card), 1);
      problems.push(`${file.name}: ${e.message}`);
    }
    renderPhotos();
    syncEditorUi();
  }
  if (files.length > room) problems.push(`Only ${room} more photo${room === 1 ? '' : 's'} fit; the rest were skipped.`);
  err.textContent = problems.join(' ');
}

async function sniff(file) {
  const b = new Uint8Array(await file.slice(0, 32).arrayBuffer());
  const s = (from, to) => String.fromCharCode(...b.slice(from, to));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && s(1, 4) === 'PNG') return 'image/png';
  if (s(0, 4) === 'RIFF' && s(8, 12) === 'WEBP') return 'image/webp';
  if (s(4, 8) === 'ftyp' && /avif|avis|mif1/.test(s(8, 12))) return 'image/avif';
  if (s(4, 8) === 'ftyp' && /heic|heix|hevc|heim/.test(s(8, 12))) return 'image/heic';
  return '';
}

async function processFile(file) {
  if (file.size > MAX_INPUT) throw new Error(`too large (${(file.size / 1048576).toFixed(1)} MB). The limit is 20 MB.`);
  const kind = await sniff(file);
  if (kind === 'image/heic') throw new Error('HEIC photos from iPhones can\'t be read here. Export it as JPG (or set Camera → Formats → Most Compatible) and try again.');
  if (!ACCEPT.includes(kind)) throw new Error('not a JPG, PNG, WebP or AVIF photo.');
  let bmp;
  try { bmp = await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch (e) { throw new Error('this photo could not be read. It may be damaged; try exporting it again.'); }
  const { width: w, height: h } = bmp;
  if (Math.min(w, h) < MIN_SHORT_SIDE) { bmp.close(); throw new Error(`too small (${w}×${h}). The short side needs at least ${MIN_SHORT_SIDE} px so it looks sharp on the Wall.`); }
  if (Math.max(w, h) > MAX_SIDE) { bmp.close(); throw new Error(`too large (${w}×${h}). Keep each side under ${MAX_SIDE} px.`); }
  const blobs = {};
  let bytes = 0;
  for (const target of [480, 960, 1600]) {
    if (target === 1600 && w < 1200) continue;               // no upscaling past the original
    const outW = Math.min(target, w), outH = Math.round(h * outW / w);
    const canvas = document.createElement('canvas');
    canvas.width = outW; canvas.height = outH;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, outW, outH);
    let quality = 0.82, blob;
    do {
      blob = await new Promise(r => canvas.toBlob(r, 'image/webp', quality));
      quality -= 0.12;
    } while (blob && blob.size > MAX_STORED && quality > 0.3);
    if (!blob || blob.type !== 'image/webp') { bmp.close(); throw new Error('this browser can\'t make WebP images. Use a recent Chrome, Edge or Firefox.'); }
    if (blob.size > MAX_STORED) { bmp.close(); throw new Error('still over 5 MB after compressing. Try a smaller photo.'); }
    blobs[target] = blob;
    bytes += blob.size;
  }
  bmp.close();
  return {
    id: crypto.randomUUID(), w, h, alt: '', caption: '', focal: [50, 50], uploadedAt: new Date().toISOString(),
    blobs, bytes, name: file.name, sizes: {}, preview: URL.createObjectURL(blobs[960] || blobs[480])
  };
}

function renderPhotos() {
  const list = F('waPhotoList');
  list.innerHTML = S.ed.photos.map((ph, i) => {
    if (ph.busy) return `<div class="wa-photo is-busy"><div class="wa-photo-frame"><span class="wa-spinner" aria-hidden="true"></span></div><p class="wa-photo-meta">Preparing ${esc(ph.name)}…</p></div>`;
    const f = ph.focal || [50, 50];
    const widths = ph.blobs ? Object.keys(ph.blobs) : Object.keys(ph.sizes || {});
    return `<div class="wa-photo" data-id="${esc(ph.id)}">
      <div class="wa-photo-frame" title="Click the most important part of the photo; the Wall crops around it">
        <img src="${esc(photoUrl(ph, 480))}" alt="" style="object-position:${f[0]}% ${f[1]}%">
        <span class="wa-focal" style="left:${f[0]}%;top:${f[1]}%" aria-hidden="true"></span>
        ${i === 0 ? '<span class="wa-pill is-cover">Cover</span>' : ''}
        ${ph.saved ? '' : '<span class="wa-pill is-new">Not uploaded yet</span>'}
      </div>
      <p class="wa-photo-meta">${ph.w ? `${Math.round(ph.w)}×${Math.round(ph.h)}` : ''}${widths.length ? ` → WebP ${esc(widths.join(' / '))} px` : ''}${ph.bytes ? ` · ${Math.round(ph.bytes / 1024)} KB` : ''}</p>
      <label class="wa-mini-label" for="alt-${esc(ph.id)}">ALT TEXT <span class="wa-hint">needed to publish</span></label>
      <input id="alt-${esc(ph.id)}" class="admin-input" data-k="alt" maxlength="${LIMITS.alt}" value="${esc(ph.alt || '')}" placeholder="e.g. Arjun in the black Trinetra tee at a temple">
      <label class="wa-mini-label" for="cap-${esc(ph.id)}">CAPTION</label>
      <input id="cap-${esc(ph.id)}" class="admin-input" data-k="caption" maxlength="${LIMITS.caption}" value="${esc(ph.caption || '')}" placeholder="Optional">
      <div class="wa-photo-actions">
        ${i > 0 ? '<button type="button" class="btn-action-icon" data-photo-act="cover">★ Cover</button>' : ''}
        <button type="button" class="btn-action-icon" data-photo-act="left" aria-label="Move photo earlier"${i === 0 ? ' disabled' : ''}>←</button>
        <button type="button" class="btn-action-icon" data-photo-act="right" aria-label="Move photo later"${i === S.ed.photos.length - 1 ? ' disabled' : ''}>→</button>
        <button type="button" class="btn-action-icon" data-photo-act="replace">⟳ Replace</button>
        <button type="button" class="btn-action-icon danger" data-photo-act="remove">✕ Remove</button>
        <input type="file" class="wa-replace-input" accept="${ACCEPT.join(',')}" hidden>
      </div>
    </div>`;
  }).join('');
  F('waDrop').classList.toggle('is-full', S.ed.photos.length >= LIMITS.photos);
}

/* ---------------------------------------------------------------- form → post, validation */

function readForm() {
  const productSel = F('waProduct').value;
  const manual = productSel === OTHER;
  const product = !manual && productSel ? window.BravadianDB.getProducts().find(p => p.id === productSel) : null;
  const trim = (id) => F(id).value.trim();
  const photos = S.ed.photos.filter(p => !p.busy);
  const featuredImage = Math.min(Number(F('waFeaturedImage').value || S.ed.featuredImage || 0), Math.max(0, photos.length - 1));
  return {
    id: S.ed.id,
    kind: 'photo',
    display_name: trim('waName'),
    city: trim('waCity'),
    state: trim('waState') || null,
    country: trim('waCountry') || 'India',
    submitted_at: F('waDate').value || null,
    quote: trim('waQuote') || null,
    product_id: product ? product.id : null,
    product_name: manual ? (trim('waProductName') || null) : (product ? titleCase(product.name) : null),
    product_url: manual ? (trim('waProductUrl') || null) : null,
    collection_slug: F('waCollection').value || null,
    featured: currentKind() === 'featured',
    featured_headline: trim('waHeadline') || null,
    featured_quote: trim('waFeaturedQuote') || null,
    featured_image: featuredImage,
    permission_status: F('waPermission').value,
    display_order: Number.parseInt(F('waOrder').value, 10) || 0,
    status: S.ed.status === 'published' ? 'published' : F('waStatus').value,
    is_demo: !!S.ed.is_demo,
    images: photos,
    private: { order_reference: trim('waOrderRef') || null, permission_note: trim('waPermissionNote') || null }
  };
}

function fieldError(id, message) {
  const p = document.querySelector(`.wa-field-error[data-for="${id}"]`);
  if (p) p.textContent = message;
  const input = F(id);
  if (input) input.setAttribute('aria-invalid', message ? 'true' : 'false');
}
function clearErrors() {
  document.querySelectorAll('#waForm .wa-field-error').forEach(p => { p.textContent = ''; });
  document.querySelectorAll('#waForm [aria-invalid="true"]').forEach(i => i.setAttribute('aria-invalid', 'false'));
}

function validateField(id) {
  const v = F(id).value.trim();
  let msg = '';
  if (id === 'waName' && !v) msg = 'Add the name to show in their story.';
  if (id === 'waCity' && !v) msg = 'Add their city.';
  if (id === 'waProductUrl' && v && !isSafeUrl(v)) msg = 'Use a full https:// link, or a site path starting with /.';
  if (id === 'waProductName' && F('waProduct').value === OTHER && !v && F('waProductUrl').value.trim()) msg = 'Give the product a name.';
  fieldError(id, msg);
  return !msg;
}

function validate(forPublish) {
  clearErrors();
  const ids = ['waName', 'waCity', 'waProductUrl', 'waProductName'];
  const bad = ids.filter(id => !validateField(id));
  const customer = kindIsCustomer();
  const photos = S.ed.photos.filter(p => !p.busy);
  let photoMsg = '';
  if (S.ed.photos.some(p => p.busy)) photoMsg = 'Wait for the photos to finish preparing.';
  else if (forPublish && customer && !photos.length) photoMsg = 'Add at least one photo to publish.';
  else if (forPublish && photos.some(p => !String(p.alt || '').trim())) photoMsg = 'Add alt text to every photo before publishing: describe what is in it.';
  F('waPhotosError').textContent = photoMsg;
  if (forPublish && customer && F('waPermission').value !== 'granted') bad.push('waPermission');
  if (bad.length || photoMsg) {
    const first = photoMsg ? F('waDrop') : F(bad[0]);
    first.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (first.focus) first.focus({ preventScroll: true });
    if (bad.includes('waPermission')) toast('Set Permission to feature to Granted before publishing.', 'error');
    return false;
  }
  return true;
}

/* ---------------------------------------------------------------- preview + checklist + buttons */

let previewRaf = 0;
function syncEditorUi(withPhotos = true) {
  if (!S.ed) return;
  const quote = F('waQuote').value.length;
  F('waQuoteCount').textContent = `${quote} / ${LIMITS.quote}`;
  syncKindUi();
  document.querySelectorAll('.wa-manual').forEach(el => { el.hidden = !kindIsCustomer() || F('waProduct').value !== OTHER; });
  F('waFeaturedFields').hidden = currentKind() !== 'featured';
  const photos = S.ed.photos.filter(p => !p.busy);
  const sel = F('waFeaturedImage');
  const keep = Math.min(Number(sel.value || S.ed.featuredImage || 0), Math.max(0, photos.length - 1));
  sel.innerHTML = photos.length ? photos.map((p, i) => `<option value="${i}">Photo ${i + 1}${i === 0 ? ' (cover)' : ''}</option>`).join('') : '<option value="0">Add a photo first</option>';
  sel.value = String(keep);
  if (withPhotos && !F('waPhotoList').children.length && photos.length) renderPhotos();
  cancelAnimationFrame(previewRaf);
  previewRaf = requestAnimationFrame(() => { renderPreview(); renderChecklist(); renderActions(); });
}

function syncKindUi() {
  F('waKindHelp').textContent = KIND_HELP[currentKind()] || '';
}

// The live preview is the real photo on a patch of the wall, next to two blank prints for scale
function renderPreview() {
  if (!S.ed) return;
  const post = readForm();
  post.id = post.id || S.ed.previewId || (S.ed.previewId = crypto.randomUUID());
  const box = F('waPreview');
  box.dataset.theme = S.previewDark ? 'dark' : 'light';
  const phone = S.previewMode === 'phone';
  const label = post.status === 'published' ? '' : STATUS[post.status];
  const blank = '<li class="wp is-photo is-in wa-ghost" aria-hidden="true"><div class="wp-body"><span class="wp-photo-print"><span class="wp-print"></span></span></div></li>';
  box.innerHTML = `<ul class="wall-canvas wa-preview-wall" style="--cols:2">${renderPiece(post, { label, want: 960, sizes: '300px' })}${blank}</ul>
    <p class="wa-preview-note">${phone ? 'Phone: 2 photos across' : 'Desktop: 4 to 5 photos across'}${post.featured ? ' · featured photos are twice as big' : ''}. Name, city and words show when a visitor opens the photo.</p>`;
  const li = box.querySelector('.wp');
  if (li) li.classList.add('is-in');
  box.querySelectorAll('a').forEach(a => { a.setAttribute('tabindex', '-1'); a.addEventListener('click', ev => ev.preventDefault()); });
  box.querySelectorAll('button').forEach(b => { b.setAttribute('tabindex', '-1'); b.disabled = true; });
}

function renderChecklist() {
  const post = readForm();
  const items = isCustomer(post) ? [
    ['Name and city', !!(post.display_name && post.city)],
    ['At least one photo', post.images.length > 0],
    ['Alt text on every photo', post.images.length > 0 && post.images.every(i => String(i.alt || '').trim())],
    ['Permission granted', post.permission_status === 'granted'],
    ['Tee linked (optional)', !!(post.product_id || post.product_url)]
  ] : publishProblems(post).length
    ? publishProblems(post).map(p => [`Add ${p}`, false])
    : [['Ready to publish (no customer, so no permission needed)', true]];
  F('waChecklist').innerHTML = items.map(([label, ok]) => `<li class="${ok ? 'is-ok' : ''}"><span aria-hidden="true">${ok ? '✓' : '○'}</span>${esc(label)}<span class="wall-sr">${ok ? ': done' : ': not yet'}</span></li>`).join('');
}

function renderActions() {
  const ed = S.ed;
  const published = ed.status === 'published';
  const statusNow = published ? 'published' : F('waStatus').value;
  $('waEditorTitle').textContent = ed.isNew ? 'ADD TO THE WALL' : `EDIT ${String(F('waName').value || 'PIECE').toUpperCase()}`;
  $('waEditorState').innerHTML = ed.isNew
    ? 'New post, not saved yet.'
    : `${statusPill(ed.status)}${ed.is_demo ? ' <span class="wa-pill is-demo">Demo</span>' : ''} <span>Added ${esc(formatDate(ed.created_at))}</span>`;
  F('waStatus').disabled = published;
  const saveLabel = published ? 'SAVE CHANGES' : statusNow === 'draft' ? 'SAVE DRAFT' : `SAVE AS ${STATUS[statusNow].toUpperCase()}`;
  const html = `
    <button type="button" class="btn-admin-secondary" data-ed="draft">${esc(saveLabel)}</button>
    <button type="button" class="btn-admin-secondary" data-ed="preview">PREVIEW ON THE WALL ↗</button>
    ${published
      ? '<button type="button" class="btn-admin-secondary" data-ed="unpublish">UNPUBLISH</button>'
      : '<button type="button" class="btn-admin-primary" data-ed="publish">PUBLISH TO THE WALL</button>'}
    ${ed.isNew ? '' : '<button type="button" class="btn-action-icon danger wa-delete" data-ed="delete">✕ Delete post</button>'}`;
  // Rebuild the buttons only when they change, so typing never swaps a button out from under a click or focus
  if (F('waActions').dataset.html !== html) {
    F('waActions').innerHTML = html;
    F('waActions').dataset.html = html;
  }
  if (S.saving) F('waActions').querySelectorAll('button').forEach(b => { b.disabled = true; });
  F('waSaveState').textContent = S.saving ? S.saving : (S.dirty ? 'Unsaved changes' : (ed.isNew ? '' : 'All changes saved'));
}

function renderEditor() {
  if (!S.ed) return newPost(false);
  if (!F('waProduct').options.length) fillOptions();
  renderPhotos();
  syncEditorUi(false);
}

/* ---------------------------------------------------------------- save */

async function save(targetStatus, confirmUnpublish) {
  if (S.saving) return false;
  const publishing = targetStatus === 'published';
  const keepLive = !targetStatus && S.ed.status === 'published';
  if (!validate(publishing || keepLive)) return false;
  const post = readForm();
  if (targetStatus) post.status = targetStatus;
  if (publishing) {
    const ok = await confirmBox({ title: `Publish ${post.display_name} to the Wall?`, body: publishBody(post), ok: 'Publish' });
    if (!ok) return false;
  }
  if (confirmUnpublish) {
    const ok = await confirmBox({ title: `Take ${post.display_name} off the Wall?`, body: 'The post stays saved here as Approved. You can publish it again any time.', ok: 'Unpublish' });
    if (!ok) return false;
  }

  const c = client();
  const id = S.ed.id || crypto.randomUUID();
  const uploaded = [];
  let rowSaved = false;
  const setBusy = (text) => { S.saving = text; F('waSaveState').textContent = text; F('waActions').querySelectorAll('button').forEach(b => { b.disabled = !!text; }); };
  try {
    const fresh = post.images.filter(p => p.blobs);
    let n = 0;
    for (const ph of fresh) {
      n++;
      ph.sizes = {};
      for (const [w, blob] of Object.entries(ph.blobs)) {
        setBusy(`Uploading photo ${n} of ${fresh.length}…`);
        const path = `${id}/${ph.id}-${w}.webp`;
        const { error } = await bucket().upload(path, blob, { contentType: 'image/webp', upsert: true, cacheControl: '31536000' });
        if (error) throw error;
        uploaded.push(path);
        ph.sizes[w] = bucket().getPublicUrl(path).data.publicUrl;
      }
    }
    setBusy('Saving…');
    const images = post.images.map(p => {
      const out = { id: p.id, w: Math.round(p.w), h: Math.round(p.h), alt: String(p.alt || '').trim(), sizes: p.sizes };
      if (String(p.caption || '').trim()) out.caption = String(p.caption).trim();
      if (p.focal && (p.focal[0] !== 50 || p.focal[1] !== 50)) out.focal = p.focal;
      if (p.uploadedAt) out.uploadedAt = p.uploadedAt;
      return out;
    });
    const row = { ...post, id, images };
    delete row.private;
    const { error } = await c.from('wall_posts').upsert(row).select('id').single();
    if (error) throw error;
    rowSaved = true;
    const priv = post.private;
    if (isCustomer(row) && (priv.order_reference || priv.permission_note || S.priv.has(id))) {
      const { error: pe } = await c.from('wall_post_private').upsert({ post_id: id, ...priv });
      if (pe) throw Object.assign(new Error(`The post was saved, but the private notes were not: ${friendly(pe)}`), { partial: true });
    }
    if (S.ed.removed.length) await bucket().remove(S.ed.removed).catch(() => {});

    // Now saved: the editor carries on with the stored version
    S.ed.photos.forEach(p => { if (p.preview) URL.revokeObjectURL(p.preview); });
    S.ed = { ...S.ed, id, isNew: false, status: row.status, photos: images.map(img => ({ ...img, saved: true })), removed: [] };
    S.dirty = false;
    setBusy('');
    toast(publishing ? `${post.display_name} is live on the Wall.` : confirmUnpublish ? `${post.display_name} is off the Wall.` : `${post.display_name} saved.`);
    await reload('walleditor');
    const stored = S.posts.find(p => p.id === id);
    if (stored) S.ed.created_at = stored.created_at;
    renderPhotos();
    syncEditorUi(false);
    return true;
  } catch (err) {
    if (!rowSaved && uploaded.length) await bucket().remove(uploaded).catch(() => {});
    setBusy('');
    const msg = err.partial ? err.message : friendly(err);
    F('waSaveState').textContent = msg;
    toast(msg, 'error');
    renderActions();
    return false;
  }
}

async function previewOnWall() {
  if (S.ed.isNew || S.dirty) {
    const saved = await save();
    if (!saved) return;
  }
  window.open(wallUrl(`preview=${encodeURIComponent(S.ed.id)}`), '_blank', 'noopener');
}

window.BravadianWallAdmin = { init, show, canLeave, newPost: () => newPost(true) };
