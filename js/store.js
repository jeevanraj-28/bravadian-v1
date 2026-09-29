/**
 * BRAVADIAN | BRAVE INDIAN — STOREFRONT CONTROLLER
 * Handles Routing, Catalog Rendering, PDP Variant Matrix,
 * Cart Management, Checkout Validation & WhatsApp Order Generation
 *
 * TABLE OF CONTENTS
 * ─────────────────────────────────────────────────────
 *  1. STATE & INITIALIZATION .............. ~L10
 *  2. ROUTER ............................. ~L68
 *  3. HEADER & UI EVENTS ................. ~L190
 *  4. HOMEPAGE RENDERER .................. ~L330
 *  5. CATALOG & PRODUCT PAGES ............ ~L650
 *  6. CART MANAGEMENT .................... ~L1900
 *  7. CHECKOUT & WHATSAPP ORDER .......... ~L2055
 *  8. ABOUT PAGE ......................... ~L2450
 *  9. CONTACT / PRIVACY / TERMS .......... ~L2545
 * 10. PUBLIC API (window.BravadianStore) .. ~L2570
 * ─────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // ── Shared SVG Markup ──────────────────────────────────────────────────
  // Centralized WhatsApp SVG to avoid duplicating the 800-byte path data
  const WA_SVG_PATH = 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z';

  function whatsappSVG(size = 18, extraClass = '', ariaHidden = true) {
    return `<svg class="btn-wa-icon ${extraClass}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"${ariaHidden ? ' aria-hidden="true"' : ''}><path d="${WA_SVG_PATH}"/></svg>`;
  }

  // Gold glow-ring disc used on the buying buttons
  const BAG_SVG = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';
  function glowDisc(icon) {
    return `<span class="gr-disc" aria-hidden="true">${icon}</span>`;
  }

  // ── WhatsApp message templates (same layout as the checkout order message) ──
  const WA_LINE = '--------------------';
  const WA_MSG = {
    order: `Hello Bravadian,

I would like to place an order on WhatsApp.

ORDER DETAILS
${WA_LINE}

Product:
Color: (Black / White / Red / Royal Blue)
Size: (S / M / L / XL / XXL)
Quantity:

DELIVERY DETAILS
${WA_LINE}

Name:
City:
Pincode:

Please share the total and payment details.

Thank you.`,
    custom: `Hello Bravadian,

I would like to place a custom order.

CUSTOM ORDER DETAILS
${WA_LINE}

Design idea:
Text or name to print (if any):
T-shirt color:
Sizes and quantity:
Needed by (date):

DELIVERY DETAILS
${WA_LINE}

Name:
City:
Pincode:

I will share reference images in this chat.

I understand custom orders are made just for me and cannot be exchanged or returned once placed.

Thank you.`,
    question: `Hello Bravadian,

I have a question.

Topic: (Product / Size / Delivery / Payment / Other)
Product (if any):
My question:

Thank you.`,
    orderHelp: `Hello Bravadian,

I need help with my order.

ORDER HELP
${WA_LINE}

Order No:
Name:
Phone:
Help needed: (Delivery status / Change size / Cancel / Return or exchange / Other)
Details:

Thank you.`,
    dropAlerts: `Hello Bravadian,

Please add me to your new drop alerts.

Name:
Collections I like: (Anime / Mythology / Heritage / Street Culture / Minimal)

Thank you.`,
    // "Coming soon" enquiry: the admin's VIP message template, with {productName} filled in
    notify: (name) => siteCopy('vipMessageTemplate').split('{productName}').join(name)
  };

  // ── Marketing copy from the admin panel ─────────────────────────────────
  // An empty field falls back to the built-in copy, so the page never shows a blank headline
  function siteCopy(key) {
    const v = window.BravadianDB.getSettings()[key];
    return (typeof v === 'string' ? v.trim() : v) || window.BravadianDefaults.DEFAULT_SETTINGS[key];
  }
  const escapeHTML = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // "WEAR YOUR | ROOTS LOUD" → two lines at the "|". Without one, titles of 3+ words split in half.
  function heroTitleHTML(title) {
    let lines = title.split('|').map(s => s.trim()).filter(Boolean);
    if (lines.length === 1) {
      const words = lines[0].split(/\s+/);
      if (words.length >= 3) {
        const half = Math.ceil(words.length / 2);
        lines = [words.slice(0, half).join(' '), words.slice(half).join(' ')];
      }
    }
    return lines.map(escapeHTML).join('<br>\n');
  }

  // Running strip under the hero: items separated by ✦
  function heroTickerHTML() {
    return siteCopy('heroTicker').split(/\s*✦\s*/).filter(Boolean)
      .map(t => `<span>${escapeHTML(t)}</span> <span class="marquee-star">✦</span>`).join('\n');
  }

  // Top announcement bar: text, WhatsApp button label, and on/off
  function applyAnnouncementBar() {
    const text = siteCopy('announcementText');
    document.querySelectorAll('.top-announcement-bar .announcement-text').forEach(el => { el.textContent = text; });
    document.querySelectorAll('.top-announcement-bar .wa-box-text').forEach(el => { el.textContent = siteCopy('announcementWaText'); });
    return window.BravadianDB.getSettings().announcementEnabled !== false;
  }

  // ── Dynamic WhatsApp URL builder ───────────────────────────────────────
  function waURL(message) {
    const settings = window.BravadianDB ? window.BravadianDB.getSettings() : {};
    const num = settings.whatsappNumber || '917975362526';
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  }

  // State Management
  const StoreState = {
    currentRoute: '',
    activeCollection: 'all',
    cataloguePage: 1,
    activeFilters: {
      color: '',
      size: '',
      sort: 'newest',
      inStockOnly: false,
      search: ''
    },
    currentProduct: null,
    selectedColor: '',
    selectedSize: '',
    selectedQty: 1,
    cart: []
  };

  // Load Cart from localStorage
  function loadCart() {
    try {
      const stored = localStorage.getItem('bravadian_cart');
      StoreState.cart = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(StoreState.cart)) StoreState.cart = [];
      // Bag line ids go into the bag buttons' code, so keep them to plain characters
      StoreState.cart.forEach(item => {
        if (!/^[\w-]+$/.test(String(item.id))) item.id = bagLineId(item.productId, item.color, item.size);
        item.quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
        item.price = Number(item.price) || 0;
      });
    } catch (e) {
      StoreState.cart = [];
    }
    refreshCartFromCatalog(false);
    updateCartUI();
  }
  // Once the live catalog arrives, prices and stock in the bag are checked against it
  window.addEventListener('bravadian:catalog-updated', () => refreshCartFromCatalog(true));

  // A bag line's id: letters, digits, - and _ only (it is used inside onclick="...('id')")
  function bagLineId(productId, color, size) {
    const safe = (v) => String(v ?? '').replace(/[^\w-]+/g, '_');
    return `${safe(productId)}-${safe(color)}-${safe(size)}-${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
  }

  function saveCart() {
    try {
      localStorage.setItem('bravadian_cart', JSON.stringify(StoreState.cart));
    } catch (e) {}
    updateCartUI();
  }

  // DOM Elements
  let mainContainer, cartDrawer, cartOverlay, searchModal, sizeGuideModal, checkoutModal;

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    mainContainer = document.getElementById('storeMainApp');
    cartDrawer = document.getElementById('cartDrawer');
    cartOverlay = document.getElementById('cartDrawerOverlay');
    searchModal = document.getElementById('searchModal');
    sizeGuideModal = document.getElementById('sizeGuideModal');
    checkoutModal = document.getElementById('checkoutModal');

    loadCart();
    initImageFallbacks();
    initHeaderEvents();
    initRouter();
    initSearchEvents();
  });

  // A tee photo that fails to load (moved or deleted file, bad address saved in admin) is swapped
  // for the same tee's next photo, and finally for its drawing, so no broken image ever shows.
  function initImageFallbacks() {
    const failed = new Set();
    const abs = (u) => { try { return new URL(u, location.href).href; } catch (e) { return u; } };
    const photosOf = (p) => {
      const out = [];
      const walk = (o) => Object.values(o || {}).forEach(v => {
        if (v && typeof v === 'object') walk(v);
        else if (typeof v === 'string' && v && !v.startsWith('data:')) out.push(v);
      });
      walk(p.images);
      return [...new Set(out)];
    };
    document.addEventListener('error', (e) => {
      const img = e.target;
      if (!(img instanceof HTMLImageElement) || !window.BravadianDB) return;
      const src = abs(img.getAttribute('src') || '');
      if (!src || src.startsWith('data:')) return;
      failed.add(src);
      const product = window.BravadianDB.getProducts().find(p => photosOf(p).some(u => abs(u) === src));
      if (!product) return;
      const next = photosOf(product).find(u => !failed.has(abs(u)));
      if (next) { img.src = next; return; }
      const draw = window.BravadianDefaults && window.BravadianDefaults.createTeeSVG;
      if (draw) img.src = draw(product.name, product.collection || 'Heritage', '#111116', '#ED1C24', 'front');
    }, true);
  }

  /* --------------------------------------------------------------------------
     ROUTER
     -------------------------------------------------------------------------- */
  function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    // The home hero builds a different animation for phones and desktops; rebuild it when the width crosses over
    const phoneQuery = window.matchMedia('(max-width: 1023px)');
    let bpTimer = 0;
    const onBreakpoint = () => {
      clearTimeout(bpTimer);
      bpTimer = setTimeout(() => {
        const h = window.location.hash || '#/';
        const onHome = h === '#/' || h === '#/home';
        if (onHome && StoreState.heroIsPhone !== undefined && StoreState.heroIsPhone !== phoneQuery.matches) handleRoute();
      }, 200);
    };
    if (phoneQuery.addEventListener) phoneQuery.addEventListener('change', onBreakpoint);
    else if (phoneQuery.addListener) phoneQuery.addListener(onBreakpoint);
    window.addEventListener('resize', onBreakpoint, { passive: true });
    // Fresh catalog from Supabase: redraw the page in place only if something actually changed
    window.addEventListener('bravadian:catalog-updated', (e) => {
      if (!e.detail || e.detail.changed) handleRoute({ soft: true });
    });
    handleRoute();
  }

  // opts.soft: redraw the current page for new data, keeping scroll position, open drawers and
  // the product page's colour and size. Otherwise (a real navigation) start at the top.
  function handleRoute(opts) {
    const soft = !!(opts && opts.soft === true);
    const hash = window.location.hash || '#/';
    if (soft && hash === '#/checkout') return;
    const keep = soft && StoreState.currentProduct && hash.startsWith('#/product/')
      ? { id: StoreState.currentProduct.id, color: StoreState.selectedColor, size: StoreState.selectedSize }
      : null;
    const scrollY = window.scrollY;
    StoreState.currentRoute = hash;
    clearInterval(StoreState.galleryTimer);
    (StoreState.spotTimers || []).forEach(clearInterval);
    if (StoreState.reel) { StoreState.reel.destroy(); StoreState.reel = null; }
    if (StoreState.heroRingStop) { StoreState.heroRingStop(); StoreState.heroRingStop = null; }
    if (StoreState.heroFanStop) { StoreState.heroFanStop(); StoreState.heroFanStop = null; }
    if (StoreState.heroMeshStop) { StoreState.heroMeshStop(); StoreState.heroMeshStop = null; }
    StoreState.spotTimers = [];
    if (!soft) window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide top announcement marquee bar on Heritage collection chapter page (matches Figma full-bleed hero),
    // or everywhere when the admin has switched it off
    const isHeritage = (hash === '#/collections/heritage' || hash === '#/heritage');
    const announcementOn = applyAnnouncementBar();
    document.body.classList.toggle('hide-announcement-bar', isHeritage || !announcementOn);

    // Close any open drawers/modals on navigation
    if (!soft) {
      closeCartDrawer();
      closeSearchModal();
      closeCheckoutModal();
      closeSizeGuideModal();
    }

    if (hash === '#/' || hash === '#/home' || hash === '') {
      renderHomeView();
    } else if (hash === '#/collections' || hash === '#/collections/' || hash === '#/universe-wall') {
      renderUniverseWallView();
    } else if (hash === '#/collections/heritage' || hash === '#/heritage') {
      renderHeritageChapterView();
    } else if (hash.startsWith('#/collections/') || hash === '#/shop') {
      const parts = hash.split('/');
      let colSlug = parts[2] || 'all';
      // 5 Official Categories + ALL
      const ACTIVE_COLLECTIONS = ['all', 'anime', 'mythology', 'heritage', 'street-culture', 'minimal'];
      if (!ACTIVE_COLLECTIONS.includes(colSlug.toLowerCase())) {
        colSlug = 'all';
      }
      if (StoreState.activeCollection !== colSlug) {
        StoreState.cataloguePage = 1;
      }
      StoreState.activeCollection = colSlug;
      renderShopView(colSlug);
    } else if (hash.startsWith('#/product/')) {
      const slug = hash.replace('#/product/', '');
      renderPDPView(slug);
    } else if (hash === '#/cart') {
      renderCartPageView();
    } else if (hash === '#/checkout') {
      openCheckoutModal();
    } else if (hash === '#/order-success') {
      renderOrderSuccessView();
    } else if (hash === '#/lookbook') {
      renderLookbookView();
    } else if (hash === '#/about') {
      renderAboutView();
    } else if (hash === '#/care' || hash === '#/garment-care' || hash === '#/care-guide') {
      renderGarmentCareView();
    } else if (hash === '#/contact') {
      renderContactView();
    } else if (hash.startsWith('#/policy/')) {
      const type = hash.replace('#/policy/', '');
      renderPolicyView(type);
    } else {
      renderShopView('all');
    }

    updateActiveNavLinks();
    initFocusReveal(mainContainer);
    initMobileMotion(mainContainer);

    if (soft) {
      // Put the shopper's colour and size back (through the buttons, so gallery and stock update too)
      if (keep && StoreState.currentProduct && StoreState.currentProduct.id === keep.id) {
        const dot = [...document.querySelectorAll('.pdp-color-dot')].find(d => d.dataset.color === keep.color);
        if (dot && keep.color !== StoreState.selectedColor) dot.click();
        const box = document.querySelector(`.pdp-size-box[data-size="${keep.size}"]`);
        if (box && !box.disabled) box.click();
      }
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    }
  }

  function updateActiveNavLinks() {
    const links = document.querySelectorAll('.nav-link, .mobile-nav-item a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (
        href === StoreState.currentRoute ||
        (href === '#/collections' && StoreState.currentRoute && StoreState.currentRoute.startsWith('#/collections')) ||
        (href === '#/shop' && StoreState.currentRoute === '#/shop')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     HEADER & GLOBAL CONTROLS
     -------------------------------------------------------------------------- */
  function initHeaderEvents() {
    // Populate Mega-Menu Collections
    const megaList = document.getElementById('megaCollectionsList');
    const mobileList = document.getElementById('mobileCollectionsList');
    const collections = window.BravadianDB.getCollections();

    // 5 Official Collections (ANIME, MYTHOLOGY, HERITAGE, STREET CULTURE, MINIMAL)
    const filteredCollections = collections.filter(c => c.slug !== 'all');

    if (megaList) {
      megaList.innerHTML = filteredCollections.map(c => `
        <li class="mega-item">
          <a href="#/collections/${c.slug}">
            <span>${c.name}</span>
            <span class="item-dot"></span>
          </a>
        </li>
      `).join('');
    }

    if (mobileList) {
      // Swipeable collection tiles in the phone menu
      mobileList.innerHTML = filteredCollections.map(c => `
        <a href="#/collections/${c.slug}" class="mnav-tile">
          ${COLLECTION_IMAGES[c.slug] ? `<img src="${COLLECTION_IMAGES[c.slug]}" alt="" loading="lazy">` : ''}
          <span>${c.name}</span>
        </a>
      `).join('');
    }
    const mobileFeature = document.getElementById('mobileNavFeature');
    const featured = window.BravadianDB.getProducts().find(p => p.newDrop && !p.isComingSoon);
    if (mobileFeature && featured) {
      mobileFeature.href = `#/product/${featured.slug}`;
      mobileFeature.innerHTML = `
        <div class="mnav-feature-media"><img src="${featured.images.front}" alt="" loading="lazy"></div>
        <div class="mnav-feature-copy">
          <span class="mnav-feature-tag">NEW DROP</span>
          <b>${featured.name}</b>
          <span class="mnav-feature-price">${priceHTML(featured)}</span>
        </div>`;
    } else if (mobileFeature) {
      mobileFeature.remove();
    }

    // Collections Accordion Toggle in Mobile Drawer
    const collectionsGroup = document.getElementById('mobileNavGroupCollections');
    const collectionsToggle = document.getElementById('mobileCollectionsToggle');
    if (collectionsToggle && collectionsGroup) {
      collectionsToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        collectionsGroup.classList.toggle('is-open');
      });
    }

    // Cart Buttons
    const cartTriggers = document.querySelectorAll('[data-action="open-cart"]');
    cartTriggers.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    }));

    if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
    const cartCloseBtn = document.getElementById('closeCartBtn');
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);

    // Search Buttons
    const searchTriggers = document.querySelectorAll('[data-action="open-search"]');
    searchTriggers.forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearchModal();
    }));

    const searchClose = document.getElementById('closeSearchBtn');
    if (searchClose) searchClose.addEventListener('click', closeSearchModal);

    // Dark & White Theme Switcher (Header & Mobile Drawer)
    function toggleThemeMode(e) {
      if (e) e.preventDefault();
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bravadian-theme', next);
      syncThemeColor();
    }

    // Phone status bar matches the page background in both themes
    function syncThemeColor() {
      const meta = document.getElementById('themeColorMeta');
      if (meta) meta.setAttribute('content', document.documentElement.getAttribute('data-theme') === 'light' ? '#EDE8D0' : '#000000');
    }
    syncThemeColor();

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleThemeMode);

    // Light / Dark switch in the phone menu
    const themeSetBtns = document.querySelectorAll('[data-theme-set]');
    function syncThemeSwitch() {
      const t = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      themeSetBtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.themeSet === t)));
    }
    themeSetBtns.forEach(b => b.addEventListener('click', () => {
      document.documentElement.setAttribute('data-theme', b.dataset.themeSet);
      localStorage.setItem('bravadian-theme', b.dataset.themeSet);
      syncThemeColor();
      syncThemeSwitch();
    }));
    if (themeBtn) themeBtn.addEventListener('click', syncThemeSwitch);
    syncThemeSwitch();

    // Mobile Hamburger & Fullscreen Drawer
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileClose = document.getElementById('closeMobileNavBtn');

    function openMobileDrawer() {
      if (!mobileDrawer) return;
      // Highlight the page the shopper is on
      const here = window.location.hash || '#/';
      mobileDrawer.querySelectorAll('.mnav-row[href], .mnav-tile').forEach(a => {
        const on = a.getAttribute('href') === here;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
      mobileDrawer.classList.add('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileDrawer() {
      if (!mobileDrawer) return;
      mobileDrawer.classList.remove('is-open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openMobileDrawer();
      });
      if (mobileClose) mobileClose.addEventListener('click', closeMobileDrawer);
      
      // Any link, search or size guide tap closes the menu first
      mobileDrawer.addEventListener('click', (e) => {
        const t = e.target.closest('a, [data-action]');
        if (!t) return;
        closeMobileDrawer();
        if (t.dataset.action === 'open-size-guide' && window.BravadianStore) window.BravadianStore.openSizeGuideModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
          closeMobileDrawer();
        }
      });
    }

    // Floating WhatsApp Button
    const waFloating = document.getElementById('floatingWhatsAppBtn');
    if (waFloating) {
      const settings = window.BravadianDB.getSettings();
      waFloating.addEventListener('click', (e) => {
        e.preventDefault();
        window.open(waURL(WA_MSG.question), '_blank');
      });
    }

    // Size Guide Modal Close
    const closeSizeGuide = document.getElementById('closeSizeGuideBtn');
    if (closeSizeGuide && sizeGuideModal) {
      closeSizeGuide.addEventListener('click', closeSizeGuideModal);
      sizeGuideModal.addEventListener('click', (e) => {
        if (e.target === sizeGuideModal) closeSizeGuideModal();
      });
    }

    // Checkout Modal Close
    const closeCheckout = document.getElementById('closeCheckoutBtn');
    if (closeCheckout && checkoutModal) {
      closeCheckout.addEventListener('click', closeCheckoutModal);
      checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeCheckoutModal();
      });
    }
  }

  /* --------------------------------------------------------------------------
     1. HOME VIEW (MATCHING FIGMA REDESIGN)
     -------------------------------------------------------------------------- */
  // Phones only: collection cards become a swipeable spotlight row that advances by itself
  function initSpotlight(grid) {
    if (!grid || !window.matchMedia('(max-width: 600px)').matches) return;
    const cards = [...grid.children];
    if (cards.length < 2) return;
    grid.classList.add('is-spotlight');
    const dots = document.createElement('div');
    dots.className = 'spot-dots';
    dots.innerHTML = cards.map((_, i) => `<button type="button" aria-label="Show collection ${i + 1}"></button>`).join('');
    grid.after(dots);

    let active = -1;
    const setActive = (i) => {
      if (i === active) return;
      active = i;
      cards.forEach((c, n) => c.classList.toggle('is-active', n === i));
      [...dots.children].forEach((d, n) => d.classList.toggle('is-on', n === i));
    };
    const centreIndex = () => {
      const mid = grid.scrollLeft + grid.clientWidth / 2;
      let best = 0, dist = Infinity;
      cards.forEach((c, n) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (d < dist) { dist = d; best = n; }
      });
      return best;
    };
    const goTo = (i) => grid.scrollTo({ left: cards[i].offsetLeft - (grid.clientWidth - cards[i].offsetWidth) / 2, behavior: 'smooth' });

    let resumeAt = 0;
    const pause = () => { resumeAt = Date.now() + 6000; };
    grid.addEventListener('scroll', () => setActive(centreIndex()), { passive: true });
    ['touchstart', 'pointerdown', 'wheel'].forEach(ev => grid.addEventListener(ev, pause, { passive: true }));
    [...dots.children].forEach((d, n) => d.addEventListener('click', () => { pause(); goTo(n); }));
    setActive(0);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    StoreState.spotTimers = StoreState.spotTimers || [];
    StoreState.spotTimers.push(setInterval(() => {
      if (Date.now() < resumeAt || document.hidden) return;
      const r = grid.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;  // only moves while on screen
      goTo((active + 1) % cards.length);
    }, 3200));
  }

  function renderHomeView() {
    const products = window.BravadianDB.getProducts();
    const isPhone = window.matchMedia('(max-width: 1023px)').matches;   // phones and tablets get the swipe card; the 3D ring needs laptop width
    StoreState.heroIsPhone = isPhone;
    const heroItems = HERO_RING.filter(it => window.BravadianDB.getProductBySlug(it.slug));
    // Latest designs for the home reel (worn photos first)
    const featuredPieces = products.filter(p => !p.isComingSoon).slice(0, 8);

    mainContainer.innerHTML = `
      <!-- HERO SECTION (Full-Width Hero Ready for Future Background Image) -->
      <section class="figma-hero-section">
        <!-- Ambient Grid & Atmosphere (Active when no image is loaded) -->
        <div class="hero-brutalist-bg" aria-hidden="true"></div>
        <div class="hero-ambient-amber" aria-hidden="true"></div>
        ${siteCopy('heroBgImage') ? '<div class="hero-custom-bg" id="heroCustomBg" aria-hidden="true"></div>' : ''}

        <!-- Products gliding on a ring behind the headline -->
        ${isPhone ? '' : `
        <div class="hero-ring" id="heroRing" aria-hidden="true">
          <div class="hero-ring-stage">
            ${HERO_RING.filter(it => window.BravadianDB.getProductBySlug(it.slug)).map(it => `
            <a href="#/product/${it.slug}" class="ring-card ${it.photo ? 'is-photo' : 'is-art'}" tabindex="-1" draggable="false">
              <img src="/images/hero-ring/${it.img}.webp" alt="" draggable="false" decoding="async">
              <span>${titleCase(window.BravadianDB.getProductBySlug(it.slug).name.replace(/ TEE$/, ''))}</span>
            </a>`).join('')}
          </div>
        </div>
        <div class="hero-veil" aria-hidden="true"></div>
        <div class="hero-mark" aria-hidden="true">BRAVADIAN</div>
        <div class="hero-ring-label" aria-hidden="true">
          <span>ADHYAYA 01 &mdash; THE FIRST CHAPTER</span>
          <i></i>
          <span class="hero-ring-hint">&larr; DRAG TO EXPLORE &rarr;</span>
        </div>`}

        <canvas class="hero-mesh" id="heroMesh" aria-hidden="true"></canvas>

        <div class="container hero-container-inner">
          <div class="hero-content-row">
            <div class="hero-narrative-col">
              ${isPhone ? `
              <div class="hero-fan" id="heroFan" aria-roledescription="carousel" aria-label="Featured tees">
                <div class="fan-stage">
                  <div class="fan-bars">${heroItems.map((_, i) => `<button type="button" aria-label="Show tee ${i + 1}"><i></i></button>`).join('')}</div>
                  ${heroItems.map((it, i) => {
                    const p = window.BravadianDB.getProductBySlug(it.slug);
                    const now = window.BravadianDB.effectivePrice(p);
                    return `<a href="#/product/${it.slug}" class="fan-card ${it.photo ? 'is-photo' : 'is-art'}" data-i="${i}" draggable="false">
                      <img src="${it.full || `/images/hero-ring/${it.img}.webp`}" alt="${titleCase(p.name)}" draggable="false" decoding="async" ${i > 1 && i < heroItems.length - 1 ? 'loading="lazy"' : 'fetchpriority="high"'}>
                      <span class="fan-meta"><b>${titleCase(p.name.replace(/ TEE$/, ''))}</b><em>${window.BravadianDB.getSettings().currency}${now.toLocaleString('en-IN')}${p.comparePrice ? ` <s>${window.BravadianDB.getSettings().currency}${p.comparePrice.toLocaleString('en-IN')}</s>` : ''}</em><span class="fan-shop">Shop now &rarr;</span></span>
                    </a>`;
                  }).join('')}
                </div>
              </div>` : ''}

              <div class="figma-hero-tag">
                <span class="hero-amber-dot"></span>
                <span>${escapeHTML(siteCopy('heroTag'))}</span>
              </div>

              <h1 class="figma-hero-title">
                ${heroTitleHTML(siteCopy('heroTitle'))}
              </h1>

              <p class="figma-hero-desc">
                ${escapeHTML(siteCopy('heroDesc'))}
              </p>


              <div class="figma-hero-cta-wrap">
                <a href="#/shop" class="btn-figma-primary">
                  <span>SHOP ALL TEES</span>
                  <svg class="btn-vault-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="${waURL(WA_MSG.order)}" target="_blank" rel="noopener noreferrer" class="btn-figma-whatsapp">
                  ${whatsappSVG(18)}
                  <span>ORDER ON WHATSAPP</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SUB-HEADER MARQUEE TICKER (RUNNING TICKER) -->
      <div class="figma-sub-marquee" aria-hidden="true">
        <div class="sub-marquee-track">
          <div class="sub-marquee-content">
            ${heroTickerHTML()}
          </div>
          <div class="sub-marquee-content">
            ${heroTickerHTML()}
          </div>
        </div>
      </div>

      <!-- ROOTED IN STONE COLLECTION SECTION -->
      <section class="rooted-stone-section">
        <div class="container">
          <div class="figma-section-header">
            <div class="section-header-left">
              <span class="figma-tag">— JUST DROPPED</span>
              <h2 class="figma-section-title">NEW DROPS</h2>
            </div>
            <div class="section-header-right">
              <p class="figma-section-narrative">
                Original Indian artwork on heavy, oversized cotton tees. Every design has a story behind it. Free delivery across India.
              </p>
            </div>
          </div>

          <div class="reel" id="homeReel" aria-roledescription="carousel" aria-label="New drops">
            <div class="reel-track">
              ${featuredPieces.map(p => {
                const worn = p.images.lifestyle && !String(p.images.lifestyle).startsWith('data:') ? p.images.lifestyle : null;
                return `
              <a href="#/product/${p.slug}" class="reel-card">
                <div class="reel-media ${worn ? 'is-worn' : ''}">
                  <img src="${worn || p.images.front}" alt="${titleCase(p.name)}" loading="lazy" draggable="false">
                </div>
                <h3>${p.name.replace(/ TEE$/, '')}</h3>
                <div class="reel-price">
                  <b>${window.BravadianDB.getSettings().currency}${window.BravadianDB.effectivePrice(p).toLocaleString('en-IN')}</b>
                  ${p.comparePrice ? `<s>${window.BravadianDB.getSettings().currency}${p.comparePrice.toLocaleString('en-IN')}</s>` : ''}
                </div>
              </a>`;
              }).join('')}
            </div>
          </div>
          <div class="reel-foot">
            <div class="reel-progress" aria-hidden="true"><span id="homeReelBar"></span></div>
            <a href="#/shop" class="reel-all">View all tees</a>
          </div>
        </div>
      </section>

      <!-- THE BRAVADIAN MANIFESTO QUOTE SECTION (With Authentic Panoramic Architectural Heritage Relief) -->
      <section class="figma-manifesto-section" id="manifestoSection">
        <!-- Authentic Panoramic Heritage Architectural Backdrop (Light & Dark Theme Specific) -->
        <div class="manifesto-panoramic-wrap" aria-hidden="true">
          <img src="/images/manifesto-panoramic-light.webp" alt="" class="manifesto-panoramic-img manifesto-bg-light manifesto-img-desktop" loading="eager">
          <img src="/images/manifesto-panoramic-dark-alt.webp" alt="" class="manifesto-panoramic-img manifesto-bg-dark manifesto-img-desktop" loading="eager">
          <!-- Mobile Flanking Architecture (Temple Left, Celestial Maiden Right) -->
          <div class="manifesto-mobile-flank manifesto-mobile-flank-left" aria-hidden="true">
            <img src="/images/manifesto-panoramic-light.webp" alt="" class="manifesto-bg-light" loading="eager">
            <img src="/images/manifesto-panoramic-dark-alt.webp" alt="" class="manifesto-bg-dark" loading="eager">
          </div>
          <div class="manifesto-mobile-flank manifesto-mobile-flank-right" aria-hidden="true">
            <img src="/images/manifesto-panoramic-light.webp" alt="" class="manifesto-bg-light" loading="eager">
            <img src="/images/manifesto-panoramic-dark-alt.webp" alt="" class="manifesto-bg-dark" loading="eager">
          </div>
          <div class="manifesto-scrim-overlay"></div>
        </div>

        <!-- Center Editorial Content -->
        <div class="container manifesto-inner">
          <span class="manifesto-tag">[ WHAT WE STAND FOR ]</span>
          <blockquote class="manifesto-quote" data-focus-reveal>
            “INDIAN ROOTS. MODERN FORM. A STORY WORTH WEARING.”
          </blockquote>
          <div class="manifesto-divider">
            <span class="divider-line"></span>
            <span class="coordinates-label">— DESIGNED AND MADE IN INDIA —</span>
            <span class="divider-line"></span>
          </div>
        </div>

      </section>

      <!-- THE TEN ARCHIVE SECTION -->
      <section class="figma-ten-archive-section">
        <div class="container">
          <div class="archive-section-header">
            <div class="archive-header-left">
              <span class="figma-tag">[ SHOP BY COLLECTION ]</span>
              <h2 class="archive-title">THE FIVE COLLECTIONS</h2>
            </div>
            <div class="archive-header-right">
              <span class="archive-cadence">NEW DESIGNS IN EVERY CHAPTER</span>
            </div>
          </div>

          <div class="archive-cards-grid">
            ${(window.BravadianDB ? window.BravadianDB.getArchiveEditions() : []).map(card => {
              if (card.status === 'active') {
                return `
                  <a href="#/collections/${card.slug || 'all'}" class="archive-card status-active ${COLLECTION_IMAGES[card.slug] ? 'has-custom-img' : ''}" data-edition="${card.num}">
                    ${COLLECTION_IMAGES[card.slug] ? `
                    <div class="archive-card-bg-img" style="background-image: url('${COLLECTION_IMAGES[card.slug]}');"></div>
                    <div class="archive-card-bg-overlay"></div>` : ''}
                    <div class="archive-card-top">
                      <span class="archive-num">${card.num}</span>
                      <span class="archive-plus">+</span>
                    </div>
                    <div class="archive-card-bottom">
                      <h3 class="archive-card-title">${card.title}</h3>
                      <span class="archive-card-desc">${card.desc}</span>
                    </div>
                    <span class="archive-card-corner-pip" aria-hidden="true"></span>
                  </a>
                `;
              } else if (card.status === 'next') {
                return `
                  <div class="archive-card status-next" data-edition="${card.num}" aria-disabled="true" role="region" aria-label="${card.title}, coming soon">
                    <div class="archive-card-top">
                      <span class="archive-num">${card.num}</span>
                      <span class="archive-badge badge-next">COMING SOON</span>
                    </div>
                    <div class="archive-card-bottom">
                      <h3 class="archive-card-title">${card.title}</h3>
                      <span class="archive-card-desc">${card.desc}</span>
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div class="archive-card status-vault" data-edition="${card.num}" aria-disabled="true" role="region" aria-label="${card.title}, coming later">
                    <div class="archive-card-top">
                      <span class="archive-num">${card.num}</span>
                      <span class="archive-badge badge-vault">COMING LATER</span>
                    </div>
                    <div class="archive-card-bottom">
                      <h3 class="archive-card-title">${card.title}</h3>
                      <span class="archive-card-desc">${card.desc}</span>
                    </div>
                  </div>
                `;
              }
            }).join('')}
          </div>
        </div>
      </section>
    `;

    initSpotlight(mainContainer.querySelector('.archive-cards-grid'));
    // Admin's hero background image, set as a style (not HTML) so the address cannot break the page
    const heroBg = document.getElementById('heroCustomBg');
    if (heroBg) heroBg.style.backgroundImage = `url(${JSON.stringify(siteCopy('heroBgImage'))})`;

    initHeroMesh(document.getElementById('heroMesh'));
    initHeroRing(document.getElementById('heroRing'));
    initHeroFan(document.getElementById('heroFan'));
    initFocusReveal(mainContainer);
    initReel(document.getElementById('homeReel'), document.getElementById('homeReelBar'));
    bindProductCardActions();
  }

  // Hero mesh (after Scrolltide's Mesh Flow): a faint dot grid that bends like a rubber sheet toward a
  // point, glowing amber where it pulls. Desktop: the point is the mouse. Phones: it drifts around the
  // story card on its own and follows a finger. Canvas 2D, one Gaussian; redraws only while moving.
  function initHeroMesh(canvas) {
    if (!canvas) return;
    const hero = canvas.closest('.figma-hero-section');
    const ctx = canvas.getContext('2d');
    if (!hero || !ctx) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = window.matchMedia('(max-width: 760px)').matches;
    let W = 0, H = 0, dpr = 1, pts = [], cols = 0, rows = 0, gap = 36;
    let mx = 0, my = 0, tx = 0, ty = 0, str = 0, target = 0, raf = 0, inView = true, touchUntil = 0, t0 = performance.now();

    const layout = () => {
      const r = hero.getBoundingClientRect();
      W = Math.round(r.width); H = Math.round(r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      gap = phone ? 44 : 60;                       // same squares as the original background grid
      cols = Math.ceil(W / gap) + 1; rows = Math.ceil(H / gap) + 1;
      pts = new Float32Array(cols * rows * 3);   // x, y, glow
      if (!mx && !my) { mx = tx = W * (phone ? 0.5 : 0.72); my = ty = H * (phone ? 0.3 : 0.5); }
    };

    const draw = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      const base = light ? '140,110,50' : '255,255,255';
      const baseA = light ? 0.08 : 0.028;             // the original grid's strength
      const glow = light ? '196,22,29' : '237,28,36';
      const sigma = (phone ? 0.16 : 0.1) * Math.max(W, H * 1.6);
      const inv = 1 / (2 * sigma * sigma);
      for (let j = 0, k = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++, k += 3) {
          const x = i * gap, y = j * gap, dx = x - mx, dy = y - my;
          const g = Math.exp(-(dx * dx + dy * dy) * inv) * str;
          pts[k] = x - dx * g * 0.32;                  // gentle pull toward the point
          pts[k + 1] = y - dy * g * 0.32;
          pts[k + 2] = g;
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      const seg = (b, lo, hi) => {
        ctx.beginPath();
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 3;
          if (i + 1 < cols) { const k2 = k + 3, gm = (pts[k + 2] + pts[k2 + 2]) / 2; if (gm >= lo && gm < hi) { ctx.moveTo(pts[k], pts[k + 1]); ctx.lineTo(pts[k2], pts[k2 + 1]); } }
          if (j + 1 < rows) { const k2 = k + cols * 3, gm = (pts[k + 2] + pts[k2 + 2]) / 2; if (gm >= lo && gm < hi) { ctx.moveTo(pts[k], pts[k + 1]); ctx.lineTo(pts[k2], pts[k2 + 1]); } }
        }
        ctx.stroke();
      };
      // untouched grid: exactly the old faint lines
      ctx.strokeStyle = `rgba(${base},${baseA})`;
      seg(0, -1, 0.05);
      // where it bends: a soft amber tint, never bright
      const BUCKETS = 4;
      for (let b = 0; b < BUCKETS; b++) {
        const lo = 0.05 + b * 0.95 / BUCKETS, hi = b === BUCKETS - 1 ? 2 : 0.05 + (b + 1) * 0.95 / BUCKETS;
        ctx.strokeStyle = `rgba(${glow},${(baseA + (lo + hi) / 2 * (light ? 0.22 : 0.2)).toFixed(3)})`;
        seg(b, lo, hi);
      }
    };

    // Each redraw makes the browser re-layer the whole page, so the soft glow is drawn at most
    // 30 times a second on desktop and 20 on phones (it drifts slowly; it reads the same). The
    // easing is time-based, so the glow moves at the same speed whatever the frame rate.
    const FRAME_MS = phone ? 50 : 33;
    let lastDraw = 0;
    const tick = (now) => {
      raf = 0;
      if (lastDraw && now - lastDraw < FRAME_MS) { raf = requestAnimationFrame(tick); return; }
      const frames = lastDraw ? Math.min(4, (now - lastDraw) / 16.67) : 1;   // 60 fps frames since last draw
      lastDraw = now;
      if (phone && !still && now > touchUntil) {
        const t = (now - t0) / 1000;
        tx = W * (0.5 + 0.34 * Math.sin(t * 0.33));
        ty = H * (0.3 + 0.16 * Math.sin(t * 0.47 + 1));
        target = 0.75;
      }
      const follow = 1 - Math.pow(0.88, frames), fade = 1 - Math.pow(0.92, frames);
      mx += (tx - mx) * follow; my += (ty - my) * follow;
      str += (target - str) * fade;
      draw();
      const settling = Math.abs(target - str) > 0.004 || Math.abs(tx - mx) > 0.5 || Math.abs(ty - my) > 0.5;
      if (inView && !document.hidden && (settling || (phone && !still))) raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf && inView) raf = requestAnimationFrame(tick); };

    const toLocal = (e) => { const r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; };
    const onMove = (e) => {
      if (still) return;
      if (e.pointerType === 'mouse') { toLocal(e); target = 1; kick(); }
      else { toLocal(e); target = 0.9; touchUntil = performance.now() + 2500; kick(); }
    };
    const onLeave = (e) => { if (e.pointerType === 'mouse') { target = 0; kick(); } };
    hero.addEventListener('pointermove', onMove, { passive: true });
    hero.addEventListener('pointerdown', onMove, { passive: true });
    hero.addEventListener('pointerleave', onLeave);
    const onResize = () => { layout(); draw(); };
    window.addEventListener('resize', onResize);
    const onTheme = new MutationObserver(() => draw());
    onTheme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView) kick(); }) : null;
    if (io) io.observe(hero);

    layout();
    draw();
    canvas.classList.add('is-ready');
    if (phone && !still) kick();

    StoreState.heroMeshStop = () => {
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      onTheme.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }

  // Curated hero cards (small images in /images/hero-ring/): worn photos alternate with artwork
  const HERO_RING = [
    { slug: 'bharat-spirit-tee', img: 'bharat-worn-studio', photo: true, full: '/images/products/bharat-spirit/worn-studio.webp?v=2' },
    { slug: 'trinetra-tee', img: 'trinetra', full: '/images/products/trinetra/preview.webp' },
    { slug: 'indian-craft-atlas-tee', img: 'atlas-look', photo: true, full: '/images/lookbook/lb-look-02.webp' },
    { slug: 'ganesha-tee', img: 'ganesha', full: '/images/products/ganesha/preview.webp' },
    { slug: 'bharat-spirit-tee', img: 'bharat-look', photo: true, full: '/images/lookbook/lb-look-01.webp' },
    { slug: 'born-to-rise-tee', img: 'born-to-rise', photo: true, full: '/images/products/born-to-rise/black-model.webp' },
    { slug: 'bharat-spirit-tee', img: 'bharat-temple', photo: true, full: '/images/products/bharat-spirit/worn-temple.webp?v=3' },
    { slug: 'hara-hara-mahadeva-tee', img: 'hara-hara', photo: true, full: '/images/products/hara-hara-mahadeva/black-model.webp' },
    { slug: 'indian-craft-atlas-tee', img: 'atlas-closeup', photo: true, full: '/images/products/craft-atlas/closeup.webp' },
    { slug: 'indian-craft-atlas-tee', img: 'atlas-tee', full: '/images/products/craft-atlas/back-print.webp?v=2' }
  ];

  // Home hero ring: portrait cards on a cylinder that curls around the viewer, smallest in the
  // middle and leaning in at the edges (after Scrolltide's Media Gallery). Pure CSS 3D; JS only
  // advances one angle per frame. Drag / flick to spin, tap a card to open the tee.
  function initHeroRing(root) {
    if (!root) return;
    const cards = [...root.querySelectorAll('.ring-card')];
    if (cards.length < 4) { root.remove(); return; }
    const STEP = 360 / cards.length;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let offset = 8, vel = 0, R = 600, degPerPx = 0.2, last = 0;
    let dragging = false, lastX = 0, lastT = 0, moved = 0, hover = false;

    let P = 800, W = 1200, CX = 744;
    const layout = () => {
      const w = root.clientWidth, h = root.clientHeight;
      const p = Math.round(w * 0.66);
      P = p; W = w; CX = w * 0.62;
      const cardH = Math.round(Math.min(h * 0.96, 720));
      R = Math.round(p * 0.8);
      degPerPx = 57.3 / (p * R / (p + R));
      root.style.perspective = `${p}px`;
      root.style.setProperty('--ring-h', `${cardH}px`);
      root.style.setProperty('--ring-w', `${Math.round(cardH * 0.72)}px`);
      // Each card sits at a fixed angle on the ring; turning the ring turns the stage (see render)
      cards.forEach((c, i) => { c.style.transform = `rotateY(${(i * STEP).toFixed(2)}deg) translateZ(${-R}px)`; });
    };
    // Auto-spin is a browser animation that runs on the GPU, so the page does no work per frame.
    // (Turning the ring from JavaScript made Chrome rebuild the whole page's layer list 60 times a
    // second, which made the header banner stutter on slower machines.) JavaScript drives the angle
    // only while the ring is dragged or flicked, and checks the cards' fade and blur a few times a second.
    const stage = root.querySelector('.hero-ring-stage');
    const SPEED = 4.5;                                    // degrees per second, as before
    const TURN_MS = (360 / SPEED) * 1000;
    const spin = stage.animate([{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(360deg)' }],
      { duration: TURN_MS, iterations: Infinity });
    spin.pause();
    const setAngle = (deg) => { spin.currentTime = ((((deg % 360) + 360) % 360) / 360) * TURN_MS; };
    const angleNow = () => ((Number(spin.currentTime) || 0) / TURN_MS) * 360;

    // Cards fade out at the sides of the ring and blur while passing behind the headline.
    // Written only when a value changes; a short CSS opacity transition keeps the fades smooth.
    const updateCards = () => {
      const off = angleNow();
      for (let i = 0; i < cards.length; i++) {
        const a = (((i * STEP + off) % 360) + 540) % 360 - 180;
        const vis = Math.round(Math.max(0, Math.min(1, (82 - Math.abs(a)) / 14)) * 100) / 100;
        const c = cards[i];
        const rad = a * Math.PI / 180;
        const soft = Math.abs(a) < 90 && (CX - R * Math.sin(rad) * P / (P + R * Math.cos(rad))) < W * 0.47;
        if (soft !== c._soft) { c._soft = soft; c.classList.toggle('is-soft', soft); }
        if (vis !== c._vis) {
          c._vis = vis;
          c.style.opacity = String(vis);
          c.style.visibility = vis > 0 ? 'visible' : 'hidden';
        }
      }
    };

    // Auto-spin only when the ring is on screen, not hovered, not being moved, and motion is allowed
    let inView = true, flickRaf = 0, cardTimer = 0;
    const refresh = () => {
      const auto = inView && !hover && !still && !dragging && Math.abs(vel) <= 1;
      if (auto) {
        if (spin.playState !== 'running') spin.play();
        if (!cardTimer) cardTimer = setInterval(updateCards, 120);
      } else {
        spin.pause();
        clearInterval(cardTimer);
        cardTimer = 0;
      }
      root.dataset.playing = auto ? 'true' : 'false';
      updateCards();
    };

    // Drag / flick (horizontal only; vertical swipes still scroll the page)
    const flick = (now) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (!dragging && Math.abs(vel) > 1) { offset += vel * dt; vel *= Math.pow(0.03, dt); }
      setAngle(offset);
      updateCards();
      if (dragging || Math.abs(vel) > 1) flickRaf = requestAnimationFrame(flick);
      else { flickRaf = 0; refresh(); }
    };
    const startFlick = () => { if (!flickRaf) { last = 0; flickRaf = requestAnimationFrame(flick); } };

    const onDown = (e) => {
      if (e.button > 0) return;
      dragging = true; moved = 0; vel = 0; lastX = e.clientX; lastT = performance.now();
      offset = angleNow();
      refresh();
      startFlick();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - lastX;
      lastX = e.clientX; moved += Math.abs(dx);
      offset -= dx * degPerPx;
      vel = (-dx * degPerPx) / Math.max(8, now - lastT) * 1000;
      lastT = now;
    };
    const onUp = () => { if (!dragging) return; dragging = false; if (performance.now() - lastT > 90) vel = 0; startFlick(); };
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    root.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
    root.addEventListener('pointerover', (e) => { if (e.pointerType === 'mouse' && e.target.closest('.ring-card') && !hover) { hover = true; refresh(); } });
    root.addEventListener('pointerout', (e) => { if (e.pointerType === 'mouse' && !e.relatedTarget?.closest?.('.ring-card')) { hover = false; refresh(); } });

    const onResize = () => { layout(); updateCards(); };
    window.addEventListener('resize', onResize);
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(([en]) => { inView = en.isIntersecting; refresh(); })
      : null;
    if (io) io.observe(root);

    layout();
    setAngle(offset);
    refresh();
    root.classList.add('is-ready');

    StoreState.heroRingStop = () => {
      spin.cancel();
      clearInterval(cardTimer);
      cancelAnimationFrame(flickRaf);
      if (io) io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }

  // Phones: a hand of cards dealt in an arc, the focused one lifted clear of its neighbours
  // (after Scrolltide's Fan Carousel). Swipe to deal, tap a side card to bring it forward.
  function initHeroFan(root) {
    if (!root) return;
    const cards = [...root.querySelectorAll('.fan-card')];
    const N = cards.length;
    if (N < 3) { root.remove(); return; }
    const dots = [...root.querySelectorAll('.fan-bars button')];
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const STEP = 10;                                       // degrees of spread per card
    let k = 0, from = 0, to = 0, t0 = 0, dur = 0, raf = 0, shown = -1, inView = true;
    let dragging = false, startX = 0, startK = 0, lastX = 0, lastT = 0, vel = 0, moved = 0, resumeAt = 0;

    const wrap = (d) => ((((d % N) + N) % N) + N / 2) % N - N / 2;
    const smooth = (x) => x * x * (3 - 2 * x);
    const render = () => {
      const w = root.clientWidth;
      for (let i = 0; i < N; i++) {
        const d = wrap(i - k), ad = Math.abs(d), a = d * STEP * Math.PI / 180;
        const lift = smooth(Math.max(0, 1 - ad * 2));      // 1 on the focused card, 0 half a step away
        // one tee fills the frame; the previous / next peek in at the edges, tilted and set back
        const x = d * w * 0.8;
        const y = Math.min(ad, 1.5) * 18;
        const sc = 0.9 + 0.1 * lift;
        const o = Math.max(0, Math.min(1, 2.2 - ad));
        const c = cards[i];
        c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(d * 4).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
        c.style.zIndex = String(100 - Math.round(ad * 10));
        c.style.opacity = o.toFixed(3);
        c.style.visibility = o > 0 ? 'visible' : 'hidden';
        c.classList.toggle('is-focus', ad < 0.5);
      }
      const n = ((Math.round(k) % N) + N) % N;
      if (n !== shown) {
        shown = n;
        const c = cards[n];
        cards.forEach(x => x.classList.remove('is-glint', 'is-live'));
        void c.offsetWidth;
        c.classList.add('is-glint', 'is-live');              // glint + slow zoom + caption rise restart
        dots.forEach((d, j) => { d.classList.remove('is-on'); d.classList.toggle('is-done', j < n); });
        void root.offsetWidth;
        if (dots[n]) dots[n].classList.add('is-on');
      }
    };
    const loop = (now) => {
      if (!dragging && dur) {
        const p = Math.min(1, (now - t0) / dur);
        k = from + (to - from) * (1 - Math.pow(1 - p, 3));
        if (p >= 1) { dur = 0; k = to; }
      }
      render();
      raf = (dragging || dur) ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const goTo = (target, ms = 520) => { from = k; to = target; t0 = performance.now(); dur = still ? 1 : ms; kick(); };
    const bringForward = (i) => goTo(Math.round(k) + Math.round(wrap(i - Math.round(k))));

    const stepPx = () => root.clientWidth * 0.3;
    const onDown = (e) => { dragging = true; dur = 0; startX = lastX = e.clientX; startK = k; moved = 0; vel = 0; lastT = performance.now(); resumeAt = Date.now() + 6000; kick(); };
    const onMove = (e) => {
      if (!dragging) return;
      const now = performance.now(), dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      k = startK - dx / stepPx();
      vel = (-(e.clientX - lastX) / stepPx()) / Math.max(8, now - lastT) * 1000;
      lastX = e.clientX; lastT = now;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      // one swipe = one tee: a short flick or a drag past 15% of the card moves exactly one step
      const base = Math.round(startK), moved01 = k - startK;
      const flick = performance.now() - lastT < 120 ? vel : 0;
      const dir = Math.abs(moved01) > 0.15 || Math.abs(flick) > 0.8 ? Math.sign(moved01 || flick) : 0;
      goTo(base + dir, 420);
    };
    root.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    root.addEventListener('click', (e) => {
      const card = e.target.closest('.fan-card');
      if (moved > 8) { e.preventDefault(); return; }
      if (card && !card.classList.contains('is-focus')) { e.preventDefault(); resumeAt = Date.now() + 6000; bringForward(Number(card.dataset.i)); }
    }, true);
    dots.forEach((d, j) => d.addEventListener('click', () => { resumeAt = Date.now() + 6000; bringForward(j); }));

    const io = 'IntersectionObserver' in window ? new IntersectionObserver(([en]) => { inView = en.isIntersecting; }) : null;
    if (io) io.observe(root);
    const timer = still ? 0 : setInterval(() => {
      root.classList.toggle('is-held', dragging || Date.now() < resumeAt);
      if (!inView || dragging || document.hidden || Date.now() < resumeAt) return;
      goTo(Math.round(k) + 1);
    }, 3400);
    const onResize = () => render();
    window.addEventListener('resize', onResize);
    render();

    StoreState.heroFanStop = () => {
      clearInterval(timer);
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }

  // Focus reveal (after Scrolltide's Focus Reveal): words start soft-focus, a camera-style frame
  // travels word to word and brings each one sharp. Runs once when the quote scrolls into view;
  // on desktop, hovering a word moves the frame back to it.
  const FOCUS_REVEAL_TARGETS = [
    '[data-focus-reveal]', '.figma-hero-title', '.figma-section-title', '.archive-title',
    '.lb2-title', '.lb2-h2', '.about-hero-title', '.about-section-title', '.lab-intro h1',
    '.canon-main-title', '.heritage-hero-title', '.heritage-section-title', '.care-page-title',
    '.contact-page h1', '.done-page h1', '.bag-head h1', '.pdp-figma-title'
  ].join(', ');
  function initFocusReveal(scope) {
    if (!scope) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scope.querySelectorAll(FOCUS_REVEAL_TARGETS).forEach(el => {
      if (el.dataset.frReady) return;
      el.dataset.frReady = '1';
      el.setAttribute('aria-label', (el.innerText || el.textContent).replace(/\s+/g, ' ').trim());
      // Wrap every word in place, keeping line breaks and inner styling
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const texts = [];
      while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) texts.push(walker.currentNode);
      texts.forEach(t => {
        const frag = document.createDocumentFragment();
        t.nodeValue.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const sp = document.createElement('span');
          sp.className = 'fr-word';
          sp.setAttribute('aria-hidden', 'true');
          sp.textContent = part;
          frag.appendChild(sp);
        });
        t.parentNode.replaceChild(frag, t);
      });
      el.insertAdjacentHTML('beforeend', '<span class="fr-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></span>');
      el.classList.add('fr');

      if (window.matchMedia('(max-width: 760px)').matches) {
        // Phones: words rise from behind a line, then an amber marker sweeps under the key word
        el.classList.remove('fr');
        el.classList.add('mr');
        el.querySelector('.fr-frame').remove();
        const ws = [...el.querySelectorAll('.fr-word')];
        ws.forEach((w, i) => {
          const inner = document.createElement('span');
          inner.className = 'mr-in';
          while (w.firstChild) inner.appendChild(w.firstChild);
          w.appendChild(inner);
          w.style.setProperty('--i', i);
        });
        if (ws.length > 1) ws[ws.length - 1].classList.add('mr-key');
        const go = () => el.classList.add('is-in');
        if (still || !('IntersectionObserver' in window)) { go(); return; }
        const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { go(); io.disconnect(); } }, { threshold: 0.3 });
        io.observe(el);
        setTimeout(() => {
          if (el.classList.contains('is-in')) return;
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) { go(); io.disconnect(); }
        }, 1400);
        return;
      }
      const spans = [...el.querySelectorAll('.fr-word')];
      const frame = el.querySelector('.fr-frame');
      if (still) { spans.forEach(w => w.classList.add('is-sharp')); return; }

      const frameTo = (w) => {
        const pad = Math.max(6, w.offsetHeight * 0.14);
        frame.style.left = `${w.offsetLeft - pad}px`;
        frame.style.top = `${w.offsetTop - pad * 0.6}px`;
        frame.style.width = `${w.offsetWidth + pad * 2}px`;
        frame.style.height = `${w.offsetHeight + pad * 1.2}px`;
        frame.classList.add('is-on');
      };
      let played = false, timers = [];
      const play = () => {
        if (played) return;
        played = true;
        spans.forEach((w, i) => timers.push(setTimeout(() => { frameTo(w); w.classList.add('is-sharp'); }, 250 + i * 380)));
        timers.push(setTimeout(() => frame.classList.remove('is-on'), 250 + spans.length * 380 + 700));
      };
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.6 });
        io.observe(el);
        setTimeout(() => {
          if (played) return;
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) { play(); io.disconnect(); }
        }, 1400);
      } else play();

      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        el.addEventListener('mouseover', (e) => {
          const w = e.target.closest('.fr-word');
          if (!w) return;
          if (!played) { played = true; spans.forEach(s2 => s2.classList.add('is-sharp')); }
          frameTo(w);
        });
        el.addEventListener('mouseleave', () => frame.classList.remove('is-on'));
      }
    });
  }

  function initMobileMotion(scope) {
    if (!scope || !window.matchMedia('(max-width: 760px)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const cards = [...scope.querySelectorAll('.pcard:not(.pc-anim)')];
    if (!cards.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
    cards.forEach((c, i) => { c.style.setProperty('--i', i % 2); c.classList.add('pc-anim'); io.observe(c); });
  }

  // Home reel: Embla Carousel + Auto Scroll (github.com/davidjerleke/embla-carousel), loaded on demand.
  // If the CDN is unreachable the row still works as a native swipe row.
  let emblaLoad = null;
  function initReel(root, bar) {
    if (!root) return;
    const syncBar = (p) => { if (bar) bar.style.transform = `scaleX(${Math.max(0.08, Math.min(1, p))})`; };
    root.addEventListener('scroll', () => syncBar((root.scrollLeft + root.clientWidth) / root.scrollWidth), { passive: true });
    syncBar(root.clientWidth / root.scrollWidth);
    emblaLoad = emblaLoad || Promise.all([
      import('https://cdn.jsdelivr.net/npm/embla-carousel@8.6.0/+esm'),
      import('https://cdn.jsdelivr.net/npm/embla-carousel-auto-scroll@8.6.0/+esm')
    ]);
    emblaLoad.then(([E, A]) => {
      if (!document.body.contains(root)) return;
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const plugins = still ? [] : [A.default({ speed: 0.8, startDelay: 600, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })];
      root.classList.add('is-embla');
      const embla = E.default(root, { loop: true, dragFree: true, align: 'start', containScroll: false }, plugins);
      const update = () => syncBar(0.08 + embla.scrollProgress() * 0.92);
      embla.on('scroll', update).on('reInit', update);
      update();
      // Auto-scroll only while the reel is on screen (it otherwise redraws every frame out of sight)
      const auto = embla.plugins().autoScroll;
      if (auto && 'IntersectionObserver' in window) {
        let onScreen = true;
        const io = new IntersectionObserver(([en]) => { onScreen = en.isIntersecting; if (onScreen) auto.play(); else auto.stop(); });
        io.observe(root);
        // The plugin also restarts itself when the mouse leaves the reel; keep it stopped out of sight
        embla.on('autoScroll:play', () => { if (!onScreen) auto.stop(); });
        embla.on('destroy', () => io.disconnect());
      }
      StoreState.reel = embla;
    }).catch(() => { /* native scrolling fallback */ });
  }

  /* --------------------------------------------------------------------------
     1.5 THE TEN UNIVERSE WALL VIEW (MATCHING FIGMA AUTO-LAYOUT SPEC)
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     1.5 THE TEN ARCHIVE / COLLECTIONS OVERVIEW VIEW
     -------------------------------------------------------------------------- */
  // Collections page: featured carousel + filter chips + image-card grid (Google Labs-inspired)
  function renderUniverseWallView() {
    const chapters = (window.BravadianDB && typeof window.BravadianDB.getUniverseChapters === 'function')
      ? window.BravadianDB.getUniverseChapters()
      : (window.DEFAULT_UNIVERSE_CHAPTERS || []);
    const products = window.BravadianDB.getProducts();
    const cols = chapters.map(c => {
      const count = products.filter(p => p.collection === c.slug && !p.isComingSoon).length;
      return {
        ...c,
        image: c.image || COLLECTION_IMAGES[c.slug],
        count,
        live: count > 0,
        label: c.chapter || `COLLECTION ${c.num}`,
        title: titleCase(c.name)
      };
    });
    const featured = cols.filter(c => c.live).sort((a, b) => b.count - a.count);
    const designs = n => `${n} ${n === 1 ? 'design' : 'designs'}`;
    const arrow = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

    mainContainer.innerHTML = `
      <div class="lab-page">
        <header class="lab-intro">
          <span class="bag-kicker">COLLECTIONS</span>
          <h1>Five worlds.<br>One way to wear them.</h1>
          <p>Every collection starts from a story we grew up with. Pick one and see the designs.</p>
        </header>

        ${featured.length ? `
        <section class="lab-feature" aria-roledescription="carousel" aria-label="Featured collections">
          <div class="lab-track" id="labTrack">
            ${featured.map((c, n) => `
            <article class="lab-slide" aria-roledescription="slide" aria-label="${n + 1} of ${featured.length}">
              <a href="#/collections/${c.slug}" class="lab-slide-media" tabindex="-1" aria-hidden="true">
                <img src="${c.image}" alt="" ${n ? 'loading="lazy"' : ''}>
              </a>
              <div class="lab-slide-copy">
                <span class="lab-meta">${c.label} &middot; ${designs(c.count)}</span>
                <h2>${c.title}</h2>
                <p>${c.description || ''}</p>
                <a href="#/collections/${c.slug}" class="lab-pill is-solid">Shop ${c.title} ${arrow}</a>
              </div>
            </article>`).join('')}
          </div>
          ${featured.length > 1 ? `
          <div class="lab-controls">
            <div class="lab-dots">${featured.map((_, n) => `<button type="button" aria-label="Show slide ${n + 1}"></button>`).join('')}</div>
            <div class="lab-arrows">
              <button type="button" class="lab-arrow" data-dir="-1" aria-label="Previous"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 6 9 12 15 18"/></svg></button>
              <button type="button" class="lab-arrow" data-dir="1" aria-label="Next"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg></button>
            </div>
          </div>` : ''}
        </section>` : ''}

        <section class="lab-browse" aria-label="All collections">
          <div class="lab-chips" role="tablist" aria-label="Filter collections">
            <button type="button" class="lab-chip is-on" data-f="all" role="tab" aria-selected="true">All</button>
            <button type="button" class="lab-chip" data-f="live" role="tab" aria-selected="false">Available now</button>
            <button type="button" class="lab-chip" data-f="soon" role="tab" aria-selected="false">Coming soon</button>
          </div>
          <div class="lab-grid">
            ${cols.map(c => `
            <article class="lab-card ${c.live ? '' : 'is-soon'}" data-live="${c.live}">
              <a ${c.live ? `href="#/collections/${c.slug}"` : `href="javascript:void(0)" data-notify="${c.name}"`} class="lab-card-media" tabindex="-1" aria-hidden="true">
                <img src="${c.image}" alt="" loading="lazy">
                ${c.live ? '' : '<span class="lab-soon-tag">COMING SOON</span>'}
              </a>
              <div class="lab-card-copy">
                <span class="lab-meta">${c.label}${c.live ? ` &middot; ${designs(c.count)}` : ''}</span>
                <h3>${c.title}</h3>
                <p>${c.description || ''}</p>
                ${c.live
                  ? `<a href="#/collections/${c.slug}" class="lab-pill">See the designs ${arrow}</a>`
                  : `<button type="button" class="lab-pill" data-notify="${c.name}">Notify me on WhatsApp</button>`}
              </div>
            </article>`).join('')}
          </div>
        </section>

        <section class="universe-callout-section">
          <div class="universe-callout-container">
            <div class="universe-callout-badge">[ NEW DROPS ]</div>
            <h3 class="universe-callout-heading">Hear about new designs and restocks first, straight on WhatsApp.</h3>
            <div class="universe-callout-btn-wrap">
              <a href="${waURL(WA_MSG.dropAlerts)}" target="_blank" rel="noopener noreferrer" class="btn-universe-callout">
                ${whatsappSVG(16)}
                <span>GET DROP ALERTS ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    `;

    bindUniverseWallActions();
  }

  // Drop artwork at these paths to fill the collection cards; missing files fall back to plain cards.
  const COLLECTION_IMAGES = {
    anime: '/images/collections/anime.webp',
    mythology: '/images/collections/mythology.webp',
    heritage: '/images/collections/heritage.webp',
    'street-culture': '/images/collections/street-culture.webp',
    minimal: '/images/collections/minimal.webp'
  };

  function bindUniverseWallActions() {
    // Coming-soon collections: ask to be told on WhatsApp
    mainContainer.querySelectorAll('[data-notify]').forEach(el => el.addEventListener('click', (e) => {
      e.preventDefault();
      window.BravadianStore.requestVipEmbargo(el.dataset.notify);
    }));

    // Filter chips
    const chips = mainContainer.querySelectorAll('.lab-chip');
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-selected', String(c === chip)); });
      mainContainer.querySelectorAll('.lab-card').forEach(card => {
        const live = card.dataset.live === 'true';
        card.hidden = chip.dataset.f === 'live' ? !live : chip.dataset.f === 'soon' ? live : false;
      });
    }));

    // Featured carousel: native swipe, arrows, dots, gentle auto-advance
    const track = document.getElementById('labTrack');
    if (!track) return;
    const slides = [...track.children];
    const dots = [...mainContainer.querySelectorAll('.lab-dots button')];
    let active = 0;
    const setActive = (i) => { active = i; dots.forEach((d, n) => d.classList.toggle('is-on', n === i)); };
    const goTo = (i) => { const n = (i + slides.length) % slides.length; track.scrollTo({ left: slides[n].offsetLeft - track.offsetLeft, behavior: 'smooth' }); };
    track.addEventListener('scroll', () => setActive(Math.round(track.scrollLeft / track.clientWidth)), { passive: true });
    let resumeAt = 0;
    const pause = () => { resumeAt = Date.now() + 8000; };
    ['touchstart', 'pointerdown', 'wheel', 'mouseenter'].forEach(ev => track.addEventListener(ev, pause, { passive: true }));
    dots.forEach((d, n) => d.addEventListener('click', () => { pause(); goTo(n); }));
    mainContainer.querySelectorAll('.lab-arrow').forEach(b => b.addEventListener('click', () => { pause(); goTo(active + Number(b.dataset.dir)); }));
    setActive(0);
    if (slides.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    StoreState.spotTimers = StoreState.spotTimers || [];
    StoreState.spotTimers.push(setInterval(() => {
      if (Date.now() < resumeAt || document.hidden) return;
      const r = track.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      goTo(active + 1);
    }, 6000));
  }

  /* --------------------------------------------------------------------------
     1.6 HERITAGE CHAPTER VIEW (#/collections/heritage)
     Matches Figma Auto-Layout Spec for collection-heritage
     -------------------------------------------------------------------------- */
  function renderHeritageChapterView() {
    const settings = window.BravadianDB.getSettings();
    const allProducts = window.BravadianDB.getProducts();

    // Dynamically map heritage products from shop database (Supabase synced / local)
    const heritageProducts = allProducts.filter(p => 
      p.collection === 'heritage' || (p.tags && p.tags.includes('heritage'))
    );
    const displayProducts = heritageProducts.filter(p => !p.isComingSoon).slice(0, 3);
    const storyCard = (src, fallback, alt, name, code, caption) => `
              <article class="motif-card">
                <div class="motif-image-box">
                  <img src="${src}" onerror="this.onerror=null;this.src='${fallback}'" alt="${alt}" class="motif-img" loading="lazy" />
                </div>
                <div class="motif-specs">
                  <div class="motif-title-badge">
                    <h3 class="motif-name">${name}</h3>
                    <span class="motif-code">${code}</span>
                  </div>
                  <p class="motif-caption">${caption}</p>
                </div>
              </article>`;

    mainContainer.innerHTML = `
      <div class="heritage-chapter-page">
        <!-- FULL-WIDTH HERO SECTION (Edge-to-Edge with Zero Side Gaps) -->
        <section class="heritage-hero-section">
          <div class="heritage-hero-backdrop" role="img" aria-label="Carved temple stone relief"></div>
          <div class="heritage-hero-scrim" aria-hidden="true"></div>

          <div class="heritage-hero-inner">
            <div class="heritage-hero-foreground">
              <!-- Micro-Identity -->
              <div class="heritage-micro-identity">
                <span class="amber-dot-square" aria-hidden="true"></span>
                <span class="micro-identity-text">HERITAGE · INDIA LIVES IN ITS CRAFTS</span>
              </div>

              <!-- Titles & CTA Row -->
              <div class="heritage-titles-cta-row">
                <div class="heritage-headline-group">
                  <h1 class="heritage-hero-title">HERITAGE</h1>
                  <p class="heritage-hero-desc">
                    Folk art, textile crafts and the symbols of India, redrawn as original prints on everyday tees. One idea runs through all of them: wear your roots.
                  </p>
                </div>

                <div class="heritage-cta-wrapper">
                  <button type="button" class="btn-discover-protocols" onclick="document.getElementById('heritageGarmentsSection').scrollIntoView({ behavior: 'smooth' })">
                    SEE THE DESIGNS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- MAIN VIEWPORT CONTAINER (1280px Centered) -->
        <div class="heritage-viewport-container">
          <!-- SECTION 2: 01 / DECODED CIVILIZATIONAL MOTIFS -->
          <section class="heritage-section heritage-motifs-section" id="heritageMotifsSection">
            <div class="heritage-section-header">
              <div class="heritage-marker-row">
                <span class="heritage-line-indicator" aria-hidden="true"></span>
                <span class="heritage-marker-text">01 / WHERE THE DESIGNS COME FROM
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">THE STORIES WE PRINT</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    Indian Craft Atlas maps the country through its crafts. Bharat Spirit brings four national symbols into one composition. These are the worlds behind both.
                  </p>
                </div>
              </div>
            </div>

            <!-- Story Cards Row -->
            <div class="heritage-motifs-row">
              ${storyCard('/images/heritage/story-folk-art.webp', '/images/products/craft-atlas/back-print.webp', 'Madhubani and Warli folk painting', 'FOLK ART', 'CRAFT ATLAS', 'Madhubani, Warli, Gond and Pattachitra. The painted traditions behind the Craft Atlas elephant.')}
              ${storyCard('/images/heritage/story-textiles.webp', '/images/products/craft-atlas/back-print.webp', 'Kalamkari and Ikat textiles', 'TEXTILE CRAFTS', 'CRAFT ATLAS', 'Kalamkari, Ikat, Phad and Pichwai. Patterns carried from loom and cloth into print.')}
              ${storyCard('/images/heritage/story-symbols.webp', '/images/products/bharat-spirit/back-print.webp', 'Peacock, tiger, lotus and elephant', 'NATIONAL SYMBOLS', 'BHARAT SPIRIT', 'Peacock, tiger, lotus and elephant. The four symbols of India behind Bharat Spirit.')}
              ${storyCard('/images/heritage/story-atlas.webp', '/images/products/craft-atlas/back-print.webp', 'Indian Craft Atlas elephant artwork', 'THE ATLAS PRINT', 'CRAFT ATLAS', 'People, patterns, places, purpose. A dozen crafts from across India, drawn onto one elephant.')}
            </div>
          </section>

          <!-- SECTION 3: 02 / THE DESIGNS -->
          <section class="heritage-section heritage-garments-section" id="heritageGarmentsSection">
            <div class="heritage-section-header">
              <div class="heritage-marker-row">
                <span class="heritage-line-indicator" aria-hidden="true"></span>
                <span class="heritage-marker-text">02 / THE DESIGNS
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">THE HERITAGE TEES</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    Heavy, oversized cotton tees with large, full-colour back prints. Free delivery across India.
                  </p>
                </div>
              </div>
            </div>

            <!-- Products Row (Mapped Dynamically from Shop DB) -->
            <div class="pgrid">
              ${displayProducts.map((p, idx) => renderProductCardHTML(p, idx)).join('')}
            </div>
          </section>

          <!-- SECTION 4: 03 / COLOURS -->
          <section class="heritage-section heritage-swatches-section">
            <div class="heritage-section-header">
              <div class="heritage-marker-row">
                <span class="heritage-line-indicator" aria-hidden="true"></span>
                <span class="heritage-marker-text">03 / COLOURS
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">FOUR COLOURS, EVERY DESIGN</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    Both heritage designs come in black, red, royal blue and white. The print stays the same; the mood changes with the colour.
                  </p>
                </div>
              </div>
            </div>

            <!-- Swatch Strip (4 Official Colorways) -->
            <div class="heritage-swatches-row">
              <!-- Swatch 1: OBSIDIAN BLACK -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #111116;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">BLACK</span>
                  <span class="swatch-info">The boldest backdrop. Makes every colour in the print glow.</span>
                </div>
              </div>

              <!-- Swatch 3: SACRED RED -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #C81D25;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">RED</span>
                  <span class="swatch-info">Festive and loud. The colour of celebration.</span>
                </div>
              </div>

              <!-- Swatch 4: ROYAL SAPPHIRE BLUE -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #1852B8;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">ROYAL BLUE</span>
                  <span class="swatch-info">Rich and confident. Pairs well with the warm tones of the art.</span>
                </div>
              </div>

              <!-- Swatch 5: CHALK WHITE -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #F7F7FA;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">WHITE</span>
                  <span class="swatch-info">Clean and bright. The print reads like a painted canvas.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     2. SHOP & COLLECTION VIEW
     -------------------------------------------------------------------------- */
  function renderShopView(colSlug = 'all') {
    const collections = window.BravadianDB.getCollections();
    const activeCol = collections.find(c => c.slug === colSlug) || { 
      name: 'ALL TEES', 
      description: 'Every Bravadian tee, from all five collections. Original Indian artwork on heavy, oversized cotton.' 
    };
    
    // Get filtered products
    const products = window.BravadianDB.getProducts({
      collection: colSlug,
      color: StoreState.activeFilters.color,
      size: StoreState.activeFilters.size,
      sort: StoreState.activeFilters.sort,
      inStockOnly: StoreState.activeFilters.inStockOnly,
      search: StoreState.activeFilters.search
    });

    const pageSize = 6;
    const isShowingAll = StoreState.cataloguePage > 1 || colSlug !== 'all' || products.length <= pageSize;
    const displayedProducts = isShowingAll ? products : products.slice(0, pageSize);
    const totalCount = displayedProducts.length;
    const formattedCount = String(totalCount).padStart(2, '0');

    mainContainer.innerHTML = `
      <div class="canon-catalogue-container">
        <!-- Canon Catalogue Header Block -->
        <header class="canon-header-block">
          <div class="canon-eyebrow">
            <span class="eyebrow-dash">—</span>
            <span class="eyebrow-text">SHOP · ALL TEES</span>
          </div>
          <h1 class="canon-main-title">ALL TEES</h1>
          <p class="canon-sub-desc">
            Every Bravadian tee, from all five collections. Original Indian artwork on heavy, oversized cotton.
          </p>
        </header>

        <!-- Chapter Filter Pills & Controls Bar -->
        <nav class="canon-filter-toolbar" aria-label="Collection filters">
          <!-- Chapter Tabs Pills -->
          <div class="canon-tabs-group" role="tablist">
            ${collections.map(c => {
              const isActive = c.slug === colSlug;
              return `
                <a 
                  href="#/collections/${c.slug}" 
                  class="canon-tab-pill ${isActive ? 'active' : ''}" 
                  role="tab"
                  aria-selected="${isActive ? 'true' : 'false'}"
                  title="${c.name}"
                >
                  <span class="pill-text">${c.name}</span>
                </a>
              `;
            }).join('')}
          </div>

          <!-- Right Status & Filter Controls -->
          <div class="canon-toolbar-right">
            <span class="canon-index-status">
              SHOWING <strong class="canon-count-badge">${totalCount} OF ${products.length}</strong>
            </span>

            <div class="canon-filter-selectors">
              <!-- Filter by Size -->
              <select class="canon-select" id="sizeFilterSelect" aria-label="Filter by size">
                <option value="">ALL SIZES</option>
                <option value="S" ${StoreState.activeFilters.size === 'S' ? 'selected' : ''}>SIZE S</option>
                <option value="M" ${StoreState.activeFilters.size === 'M' ? 'selected' : ''}>SIZE M</option>
                <option value="L" ${StoreState.activeFilters.size === 'L' ? 'selected' : ''}>SIZE L</option>
                <option value="XL" ${StoreState.activeFilters.size === 'XL' ? 'selected' : ''}>SIZE XL</option>
                <option value="XXL" ${StoreState.activeFilters.size === 'XXL' ? 'selected' : ''}>SIZE XXL</option>
              </select>

              <!-- Sort -->
              <select class="canon-select" id="sortSelect" aria-label="Sort products">
                <option value="newest" ${StoreState.activeFilters.sort === 'newest' ? 'selected' : ''}>SORT: NEWEST</option>
                <option value="price-low" ${StoreState.activeFilters.sort === 'price-low' ? 'selected' : ''}>PRICE: LOW TO HIGH</option>
                <option value="price-high" ${StoreState.activeFilters.sort === 'price-high' ? 'selected' : ''}>PRICE: HIGH TO LOW</option>
              </select>
            </div>
          </div>
        </nav>

        <!-- Product Grid or Empty State -->
        ${totalCount > 0 ? `
          <div class="pgrid">
            ${displayedProducts.map((p, idx) => renderProductCardHTML(p, idx)).join('')}
          </div>

          ${!isShowingAll ? `
          <div class="canon-load-more-wrap">
            <button type="button" class="btn-canon-load-more" id="canonLoadMoreBtn">
              <span>SHOW ALL ${products.length} TEES &darr;</span>
            </button>
          </div>` : ''}
        ` : `
          <div class="canon-empty-state">
            <div class="empty-state-icon">✦</div>
            <h3 class="empty-state-title">NO TEES MATCH THESE FILTERS</h3>
            <p class="empty-state-sub">Try another size, or look through a different collection.</p>
            <a href="#/collections/all" class="btn-canon-load-more" style="display: inline-block;">CLEAR FILTERS</a>
          </div>
        `}
      </div>
    `;

    // Filter Listeners
    const sizeSelect = document.getElementById('sizeFilterSelect');
    if (sizeSelect) {
      sizeSelect.addEventListener('change', (e) => {
        StoreState.activeFilters.size = e.target.value;
        renderShopView(colSlug);
      });
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        StoreState.activeFilters.sort = e.target.value;
        renderShopView(colSlug);
      });
    }

    const loadMoreBtn = document.getElementById('canonLoadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        StoreState.cataloguePage = 2;
        renderShopView(colSlug);
      });
    }

    bindProductCardActions();
  }

  /* --------------------------------------------------------------------------
     3. PRODUCT CARD COMPONENT (FIGMA CANON CARD)
     -------------------------------------------------------------------------- */
  // Product card: mobile-first, photo-led (H&M / Souled Store pattern). Used on every grid.
  function titleCase(t) {
    return (t || '').toLowerCase().replace(/\b([a-z])/g, m => m.toUpperCase());
  }

  function renderProductCardHTML(product, idx = 0) {
    const cur = window.BravadianDB.getSettings().currency;
    const soon = product.isComingSoon === true;
    const now = window.BravadianDB.effectivePrice(product);
    const mrp = product.comparePrice && product.comparePrice > now ? product.comparePrice : 0;
    const off = mrp ? Math.round(((mrp - now) / mrp) * 100) : 0;
    const tag = soon ? 'COMING SOON' : (window.BravadianDB.isLaunchActive(product) ? 'LAUNCH PRICE' : (product.newDrop ? 'NEW' : ''));
    const open = soon
      ? `href="javascript:void(0)" onclick="window.BravadianStore.requestVipEmbargo('${product.name.replace(/'/g, "\\'")}')"`
      : `href="#/product/${product.slug}"`;
    const name = titleCase(product.name);
    return `
      <article class="pcard ${soon ? 'is-soon' : ''}" data-slug="${product.slug}">
        <a class="pcard-media" ${open} aria-label="${soon ? 'Get notified about' : 'View'} ${name}">
          <img src="${product.images.front}" alt="${name}" loading="lazy">
          ${tag ? `<span class="pcard-tag">${tag}</span>` : ''}
        </a>
        ${soon ? '' : `
        <button type="button" class="pcard-add" aria-label="Quick add ${name}" onclick="window.BravadianStore.openQuickAdd('${product.slug}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/><path d="M12 11v5M9.5 13.5h5"/></svg>
        </button>`}
        <div class="pcard-info">
          <a class="pcard-name" ${open}>${name}</a>
          <span class="pcard-sub">Oversized T-shirt</span>
          <div class="pcard-price">
            ${soon ? `<span class="pcard-soon">Tap to get notified</span>` : `
            <b>${cur}${now.toLocaleString('en-IN')}</b>
            ${mrp ? `<s>${cur}${mrp.toLocaleString('en-IN')}</s><em>${off}% off</em>` : ''}`}
          </div>
          ${!soon && product.colors && product.colors.length > 1 ? `
          <div class="pcard-dots" aria-label="${product.colors.length} colours">
            ${product.colors.map(c => `<i style="--dot:${colourHex(c)}" title="${c}"></i>`).join('')}
          </div>` : ''}
        </div>
      </article>`;
  }

  // Quick add: a bottom sheet on phones (centred panel on desktop) to pick colour + size
  function openQuickAdd(slug) {
    const product = window.BravadianDB.getProductBySlug(slug);
    if (!product) return;
    let sheet = document.getElementById('quickAddSheet');
    if (!sheet) {
      document.body.insertAdjacentHTML('beforeend', `
        <div class="qa-backdrop" id="quickAddBackdrop"></div>
        <div class="qa-sheet" id="quickAddSheet" role="dialog" aria-modal="true" aria-label="Choose size"></div>`);
      sheet = document.getElementById('quickAddSheet');
      document.getElementById('quickAddBackdrop').addEventListener('click', closeQuickAdd);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuickAdd(); });
    }
    const cur = window.BravadianDB.getSettings().currency;
    let color = product.colors[0];
    let size = null;
    const draw = () => {
      const avail = getAvailableSizesForColor(product, color);
      sheet.innerHTML = `
        <div class="qa-grab" aria-hidden="true"></div>
        <div class="qa-head">
          <div class="qa-thumb"><img src="${product.images.front}" alt=""></div>
          <div class="qa-title">
            <b>${titleCase(product.name)}</b>
            <span>${priceHTML(product)}</span>
          </div>
          <button type="button" class="qa-close" aria-label="Close">&times;</button>
        </div>
        <span class="qa-label">Colour: <b>${color}</b></span>
        <div class="qa-colours">
          ${product.colors.map(c => `<button type="button" class="qa-colour ${c === color ? 'is-on' : ''}" data-c="${c}" style="--dot:${colourHex(c)}" aria-label="${c}" aria-pressed="${c === color}"></button>`).join('')}
        </div>
        <span class="qa-label">Size ${size ? `: <b>${size}</b>` : ''}<a href="javascript:void(0)" class="qa-guide">Size guide</a></span>
        <div class="qa-sizes">
          ${product.sizes.map(z => `<button type="button" class="qa-size ${z === size ? 'is-on' : ''}" data-z="${z}" ${avail.includes(z) ? '' : 'disabled'}>${z}</button>`).join('')}
        </div>
        <button type="button" class="gr-btn qa-add" ${size ? '' : 'disabled'}>${glowDisc(BAG_SVG)}<span class="gr-label">${size ? `ADD TO BAG — ${cur}${window.BravadianDB.effectivePrice(product).toLocaleString('en-IN')}` : 'SELECT A SIZE'}</span></button>`;
      sheet.querySelector('.qa-close').onclick = closeQuickAdd;
      sheet.querySelector('.qa-guide').onclick = () => { closeQuickAdd(); window.BravadianStore.openSizeGuideModal(); };
      sheet.querySelectorAll('.qa-colour').forEach(b => b.onclick = () => { color = b.dataset.c; if (!getAvailableSizesForColor(product, color).includes(size)) size = null; draw(); });
      sheet.querySelectorAll('.qa-size:not([disabled])').forEach(b => b.onclick = () => { size = b.dataset.z; draw(); });
      sheet.querySelector('.qa-add').onclick = () => { if (!size) return; if (addToCart(product, color, size, 1)) closeQuickAdd(); };
    };
    draw();
    requestAnimationFrame(() => document.body.classList.add('qa-open'));
  }

  function closeQuickAdd() {
    document.body.classList.remove('qa-open');
  }

  function bindProductCardActions() {
    // Custom magnetic hover physics or image tilt if desired
  }

  /* --------------------------------------------------------------------------
     4. PRODUCT DETAIL PAGE (PDP) & VARIANT MATRIX
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     4. PRODUCT DETAIL PAGE (PDP) — FIGMA PRECISION ARCHITECTURE
     -------------------------------------------------------------------------- */
  // Shown for a product link that does not exist or is not on sale (drafts). If the live catalog is
  // still loading and has it, the page redraws itself with the product once it arrives.
  function renderProductNotFound() {
    StoreState.currentProduct = null;
    const picks = window.BravadianDB.getProducts().filter(p => !p.isComingSoon).slice(0, 3);
    mainContainer.innerHTML = `
      <section class="done-page">
        <span class="bag-kicker">PAGE NOT FOUND</span>
        <h1>THIS TEE ISN'T HERE</h1>
        <p class="done-lede">The link may be old, or this design is no longer available. Here's what's in the drop right now.</p>
        ${picks.length ? `<ol class="done-steps">${picks.map(p => `
          <li><a href="#/product/${encodeURIComponent(p.slug)}"><b>${titleCase(p.name)}</b></a><span>${priceHTML(p)}</span></li>`).join('')}
        </ol>` : ''}
        <div class="done-actions">
          <a href="#/shop" class="bag-cta"><span>SHOP ALL TEES</span></a>
          <a href="#/" class="done-ghost">Back to home</a>
        </div>
      </section>
    `;
  }

  function renderPDPView(slug) {
    let product = window.BravadianDB.getProductBySlug(decodeURIComponent(slug));
    if (!product) {
      renderProductNotFound();
      return;
    }

    StoreState.currentProduct = product;
    StoreState.selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    StoreState.selectedSize = 'M';
    StoreState.selectedQty = 1;

    const availableSizes = getAvailableSizesForColor(product, StoreState.selectedColor);
    if (availableSizes.includes('M')) {
      StoreState.selectedSize = 'M';
    } else if (availableSizes.length > 0) {
      StoreState.selectedSize = availableSizes[0];
    } else {
      StoreState.selectedSize = 'M';
    }

    const settings = window.BravadianDB.getSettings();

    // Diagrams and Supabase image mapping
    const pImages = product.images || {};
    const getDiagram = (view) => {
      if (window.BravadianDefaults && window.BravadianDefaults.createTeeSVG) {
        return window.BravadianDefaults.createTeeSVG(product.name, product.collection || 'Heritage', '#111116', '#ED1C24', view);
      }
      return '';
    };

    const thumb1 = pImages.front || getDiagram('front');
    // Placeholder diagrams only when the product has no real photos yet
    const thumb2 = pImages.back || (pImages.front ? '' : getDiagram('back'));
    const thumb3 = pImages.closeup || (pImages.front ? '' : getDiagram('closeup'));
    const mainHero = thumb1;
    // Photos for a colour: that colour's own set when it has one, otherwise the shared photos
    const galleryFor = (colour) => {
      const cs = pImages.colors && pImages.colors[colour];
      const list = cs
        ? [[cs.front, 'contain'], [cs.model, 'cover'], [cs.model2, 'cover'], [cs.closeup, 'cover'], [cs.back, 'contain']]
        : [[thumb1, 'contain'], [thumb2, 'contain'], [thumb3, 'contain'], [pImages.lifestyle, 'cover'], [pImages.lifestyle2, 'cover']];
      const all = list.filter(([src], i, arr) => src && arr.findIndex(([x]) => x === src) === i).map(([src, fit]) => ({ src, fit }));
      // Generated drawings only fill in when the tee has no real photo at all
      const photos = all.filter(({ src }) => !String(src).startsWith('data:'));
      return photos.length ? photos : all;
    };
    const galleryImages = galleryFor(StoreState.selectedColor);

    const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const accordions = [
      { title: 'THE STORY', content: product.story || product.description },
      product.motif ? { title: 'THE SYMBOLS', content: product.motif } : null,
      { title: 'FABRIC & PRINT', content: '240 GSM French Terry cotton: thick and soft, and it holds its shape. Bio + silicone washed, so it feels soft from the first wear. DTF printed for sharp, full-colour artwork that stays bright with the right care. Oversized fit with dropped shoulders.' },
      { title: 'CARE', content: 'Wash inside out in cold water, up to 30°C. Dry flat in the shade. Iron on low heat, inside out, never directly on the print. No bleach and no tumble dryer.' },
      { title: 'DELIVERY & RETURNS', content: 'Free delivery anywhere in India. We confirm your order with you on WhatsApp, then dispatch it within 24–48 hours. See our Shipping and Returns policies for the details.' }
    ].filter(Boolean).map((a, n) => ({ num: String(n + 1).padStart(2, '0'), ...a }));

    // Other designs to browse: same collection first, then the rest
    const relatedRelics = window.BravadianDB.getProducts()
      .filter(p => p.slug !== product.slug && !p.isComingSoon)
      .sort((a, b) => Number(b.collection === product.collection) - Number(a.collection === product.collection))
      .slice(0, 3)
      .map((p, n) => ({ product: p, slug: p.slug, name: p.name, badge: p.relicTag || `DESIGN 0${n + 1}`, image: p.images.front }));

    const defaultChapters = [
      { num: '01', title: 'ANIME', chapter: 'MANGA & ANIME', collection: 'anime' },
      { num: '02', title: 'MYTHOLOGY', chapter: 'MYTHS & LEGENDS', collection: 'mythology' },
      { num: '03', title: 'HERITAGE', chapter: 'CRAFTS & SYMBOLS', collection: 'heritage' },
      { num: '04', title: 'STREET CULTURE', chapter: 'CITY STREETS', collection: 'street-culture' },
      { num: '05', title: 'MINIMAL', chapter: 'EVERYDAY BASICS', collection: 'minimal' }
    ];
    const gateways = defaultChapters
      .filter(gw => gw.collection !== (product.collection || 'heritage').toLowerCase())
      .slice(0, 3).map(gw => {
      const colProd = window.BravadianDB.getProducts({ collection: gw.collection })[0];
      const gImg = (colProd && colProd.images && colProd.images.front)
        ? colProd.images.front
        : (window.BravadianDefaults ? window.BravadianDefaults.createTeeSVG(gw.title, gw.collection, '#121216', '#ED1C24', 'front') : '');
      return {
        ...gw,
        image: gImg,
        cover: COLLECTION_IMAGES[gw.collection] || ''
      };
    });

    mainContainer.innerHTML = `
      <div class="pdp-figma-layout">
        <!-- SECTION - PRODUCT MAIN BRIEF -->
        <section class="pdp-brief-section">
          <!-- Column-Media -->
          <div class="pdp-media-col">
            <div class="pdp-main-frame ${product.isComingSoon ? 'is-vault-media' : ''}">
              <img src="${galleryImages[0] ? galleryImages[0].src : mainHero}" alt="${product.name}" id="pdpFigmaMainImg" class="pdp-main-photo ${product.isComingSoon ? 'is-vault-blurred' : ''}">
              ${product.isComingSoon ? `
                <div class="subtle-frosted-overlay" aria-hidden="true">
                  <span class="frosted-crosshair-center"></span>
                </div>
              ` : ''}
            </div>

            <div class="pdp-thumbs-row" style="--thumbs:${galleryImages.length}">
              ${galleryImages.map(({ src, fit }, n) => `
              <div class="pdp-thumb-card ${n === 0 ? 'active' : ''}" data-img="${src}" data-fit="${fit}" role="button" tabindex="0" title="${product.name}, photo ${n + 1} of ${galleryImages.length}">
                <img src="${src}" alt="${product.name}, photo ${n + 1} of ${galleryImages.length}" class="pdp-thumb-img fit-${fit}" loading="lazy">
              </div>`).join('')}
            </div>
          </div>

          <!-- Column-Specifications -->
          <div class="pdp-specs-col">
            <!-- Header Eyebrow -->
            <div class="pdp-eyebrow-row">
              <span class="pdp-amber-dot"></span>
              <span class="pdp-eyebrow-text">${(product.collection || 'HERITAGE').replace(/-/g, ' ').toUpperCase()} COLLECTION · ADHYAYA 01</span>
            </div>

            <!-- Title -->
            <h1 class="pdp-figma-title">${product.name}</h1>

            <!-- Price -->
            <div class="pdp-figma-price">${priceHTML(product, { detail: true })}</div>

            <!-- Description -->
            <p class="pdp-figma-desc">${product.description}</p>

            <!-- Colour Selection -->
            ${(product.colors || []).length ? `
            <div class="pdp-color-section">
              <span class="pdp-size-label">COLOUR: <strong id="pdpColorName">${StoreState.selectedColor}</strong></span>
              <div class="pdp-color-row" id="pdpColorRow" role="radiogroup" aria-label="Colour">
                ${product.colors.map(c => `
                  <button type="button" class="pdp-color-dot ${c === StoreState.selectedColor ? 'active' : ''}" data-color="${c}" style="--dot:${colourHex(c)}" role="radio" aria-checked="${c === StoreState.selectedColor}" aria-label="${c}" title="${c}"></button>
                `).join('')}
              </div>
            </div>` : ''}

            <!-- Size Selection -->
            <div class="pdp-size-section">
              <div class="pdp-size-header">
                <span class="pdp-size-label">SELECT SIZE</span>
                <button type="button" class="pdp-size-guide-btn pdp-fit-btn" id="pdpSizeGuideTrigger">${fitButtonLabel()}</button>
              </div>
              <div class="pdp-size-matrix" id="pdpSizeMatrix">
                ${allSizes.map(sz => `
                  <button type="button" class="pdp-size-box ${sz === StoreState.selectedSize ? 'active' : ''}" data-size="${sz}" ${product.isComingSoon || getVariantStock(product, StoreState.selectedColor, sz) > 0 ? '' : 'disabled'}>
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Add to Bag CTA -->
            <div class="pdp-cta-wrap">
              <button type="button" class="pdp-cta-btn ${product.isComingSoon ? 'is-coming-soon' : 'gr-btn'}" id="pdpCtaBtn">
                ${product.isComingSoon ? `COMING SOON` : `${glowDisc(BAG_SVG)}<span class="gr-label">ADD TO BAG — ${settings.currency}${window.BravadianDB.effectivePrice(product).toLocaleString('en-IN')}</span>`}
              </button>
              <div class="pdp-cta-subtext">
                ✦ FREE DELIVERY ACROSS INDIA · CONFIRMED ON WHATSAPP · PAY BY UPI
              </div>
            </div>

            <!-- Line Divider -->
            <div class="pdp-figma-divider"></div>

            <!-- 5 Specification Accordions -->
            <div class="pdp-accordion-group">
              ${accordions.map((acc, i) => `
                <div class="pdp-accordion-item ${i === 0 ? 'is-open' : ''}" data-index="${i}">
                  <button type="button" class="pdp-accordion-header" aria-expanded="${i === 0 ? 'true' : 'false'}">
                    <span class="pdp-accordion-title">${acc.title}</span>
                    <span class="pdp-accordion-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#ED1C24" stroke-width="2">
                        <line x1="8" y1="2" x2="8" y2="14" class="pdp-icon-v"></line>
                        <line x1="2" y1="8" x2="14" y2="8"></line>
                      </svg>
                    </span>
                  </button>
                  <div class="pdp-accordion-body" style="${i === 0 ? 'max-height: 180px; opacity: 1;' : 'max-height: 0px; opacity: 0;'}">
                    <p class="pdp-accordion-text">${acc.content}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- SECTION - MORE FROM THE UNIVERSE -->
        <section class="pdp-more-universe-section">
          <div class="pdp-section-header">
            <div class="pdp-section-title-group">
              <div class="pdp-section-eyebrow">
                <span class="pdp-line-indicator"></span>
                <span class="pdp-section-eyebrow-text">YOU MAY ALSO LIKE</span>
              </div>
              <h2 class="pdp-section-heading">MORE DESIGNS TO EXPLORE</h2>
            </div>
            <div class="pdp-section-header-tag">ADHYAYA 01</div>
          </div>

          <div class="pgrid is-rail">
            ${relatedRelics.map((item, n) => renderProductCardHTML(item.product, n)).join('')}
          </div>
        </section>

        <!-- SECTION - NEIGHBOURING UNIVERSES -->
        <section class="pdp-gateways-section">
          <div class="pdp-section-header">
            <div class="pdp-section-title-group">
              <div class="pdp-section-eyebrow">
                <span class="pdp-line-indicator"></span>
                <span class="pdp-section-eyebrow-text">KEEP EXPLORING</span>
              </div>
              <h2 class="pdp-section-heading">EXPLORE THE COLLECTIONS</h2>
            </div>
            <div class="pdp-section-header-tag">FIVE COLLECTIONS</div>
          </div>

          <div class="pdp-gateways-grid">
            ${gateways.map(gw => `
              <div class="pdp-gateway-card" data-collection="${gw.collection}">
                <div class="pdp-gateway-bg" style="background-image: url('${gw.cover || gw.image}');"></div>
                <div class="pdp-gateway-overlay"></div>
                <div class="pdp-gateway-top">
                  <span class="pdp-gateway-num">${gw.num}</span>
                  <span class="pdp-gateway-star">✦</span>
                </div>
                <div class="pdp-gateway-bottom">
                  <h3 class="pdp-gateway-title">${gw.title}</h3>
                  <span class="pdp-gateway-sub">${gw.chapter}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;

    // Event Bindings
    // 1. Thumbnail Clicking & Switching
    const mainImg = document.getElementById('pdpFigmaMainImg');
    let thumbCards = document.querySelectorAll('.pdp-thumb-card');
    const thumbsRow = document.querySelector('.pdp-thumbs-row');
    const showThumb = (tc) => {
      {
        thumbsRow.querySelectorAll('.pdp-thumb-card').forEach(c => c.classList.remove('active'));
        tc.classList.add('active');
        const targetSrc = tc.getAttribute('data-img');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.objectFit = tc.dataset.fit || 'contain';
            mainImg.style.objectPosition = tc.dataset.fit === 'cover' ? 'center 12%' : 'center';
            mainImg.style.opacity = '1';
          }, 150);
        }
      }
    };
    if (thumbsRow) thumbsRow.addEventListener('click', (e) => {
      const tc = e.target.closest('.pdp-thumb-card');
      if (!tc) return;
      if (e.isTrusted) clearInterval(StoreState.galleryTimer);
      showThumb(tc);
    });
    const renderGallery = (colour) => {
      if (!thumbsRow) return;
      const list = galleryFor(colour);
      if (!list.length) return;
      thumbsRow.style.setProperty('--thumbs', list.length);
      thumbsRow.innerHTML = list.map(({ src, fit }, n) => `
              <div class="pdp-thumb-card ${n === 0 ? 'active' : ''}" data-img="${src}" data-fit="${fit}" role="button" tabindex="0" title="${product.name}, photo ${n + 1} of ${list.length}">
                <img src="${src}" alt="${product.name}, ${colour}, photo ${n + 1} of ${list.length}" class="pdp-thumb-img fit-${fit}" loading="lazy">
              </div>`).join('');
      thumbCards = thumbsRow.querySelectorAll('.pdp-thumb-card');
      showThumb(thumbCards[0]);
    };

    // Gallery autoplay: pauses on hover/touch, stops once the shopper picks a photo
    clearInterval(StoreState.galleryTimer);
    const galleryFrame = document.querySelector('.pdp-media-col');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (galleryFrame && thumbCards.length > 1 && !reduceMotion) {
      let paused = false;
      const pause = () => { paused = true; };
      const resume = () => { paused = false; };
      galleryFrame.addEventListener('mouseenter', pause);
      galleryFrame.addEventListener('mouseleave', resume);
      galleryFrame.addEventListener('touchstart', pause, { passive: true });
      galleryFrame.addEventListener('touchend', () => setTimeout(resume, 4000), { passive: true });
      StoreState.galleryTimer = setInterval(() => {
        if (paused || document.hidden || !document.body.contains(galleryFrame)) return;
        const cards = Array.from(thumbsRow.querySelectorAll('.pdp-thumb-card'));
        if (cards.length < 2) return;
        const next = (cards.findIndex(c => c.classList.contains('active')) + 1) % cards.length;
        showThumb(cards[next]);
      }, 4000);
    }

    // 2. Size Matrix Selection
    const sizeBoxes = document.querySelectorAll('.pdp-size-box');
    const colorDots = document.querySelectorAll('.pdp-color-dot');
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        StoreState.selectedColor = dot.dataset.color;
        colorDots.forEach(d => {
          const on = d === dot;
          d.classList.toggle('active', on);
          d.setAttribute('aria-checked', on ? 'true' : 'false');
        });
        const nameEl = document.getElementById('pdpColorName');
        if (nameEl) nameEl.textContent = StoreState.selectedColor;
        if (pImages.colors && pImages.colors[StoreState.selectedColor]) renderGallery(StoreState.selectedColor);
        let firstOpen = null;
        sizeBoxes.forEach(b => {
          const open = product.isComingSoon || getVariantStock(product, StoreState.selectedColor, b.dataset.size) > 0;
          b.disabled = !open;
          if (open && !firstOpen) firstOpen = b;
        });
        const current = document.querySelector('.pdp-size-box.active');
        if ((!current || current.disabled) && firstOpen) firstOpen.click();
        syncPdpCta();
      });
    });

    // The add button (and its phone twin) reads SOLD OUT when the chosen colour and size has no stock
    const priceLabel = `ADD TO BAG — ${settings.currency}${window.BravadianDB.effectivePrice(product).toLocaleString('en-IN')}`;
    function syncPdpCta() {
      if (product.isComingSoon) return;
      const soldOut = getVariantStock(product, StoreState.selectedColor, StoreState.selectedSize) <= 0;
      [document.getElementById('pdpCtaBtn'), document.getElementById('pdpStickyBtn')].forEach((btn, i) => {
        if (!btn) return;
        btn.disabled = soldOut;
        btn.classList.toggle('is-sold-out', soldOut);
        const label = btn.querySelector('.gr-label');
        if (label) label.textContent = soldOut ? 'SOLD OUT' : (i === 0 ? priceLabel : 'ADD TO BAG');
      });
    }

    sizeBoxes.forEach(sb => {
      sb.addEventListener('click', () => {
        sizeBoxes.forEach(b => b.classList.remove('active'));
        sb.classList.add('active');
        StoreState.selectedSize = sb.getAttribute('data-size');
        syncPdpCta();
      });
    });

    // 3. Size Guide Trigger
    const sizeGuideTrigger = document.getElementById('pdpSizeGuideTrigger');
    if (sizeGuideTrigger) {
      sizeGuideTrigger.addEventListener('click', openSizeGuideModal);
    }

    // 4. Accordions Expand / Collapse
    const accordionItems = document.querySelectorAll('.pdp-accordion-item');
    accordionItems.forEach(item => {
      const header = item.querySelector('.pdp-accordion-header');
      const body = item.querySelector('.pdp-accordion-body');
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        if (isOpen) {
          item.classList.remove('is-open');
          header.setAttribute('aria-expanded', 'false');
          body.style.maxHeight = '0px';
          body.style.opacity = '0';
        } else {
          item.classList.add('is-open');
          header.setAttribute('aria-expanded', 'true');
          body.style.maxHeight = (body.scrollHeight + 50) + 'px';
          body.style.opacity = '1';
        }
      });
    });

    // 5. Add to Archive Bag CTA
    const ctaBtn = document.getElementById('pdpCtaBtn');
    if (ctaBtn) {
      ctaBtn.addEventListener('click', () => {
        if (product.isComingSoon) {
          window.BravadianStore.requestVipEmbargo(product.name);
          return;
        }
        if (!StoreState.selectedSize) {
          StoreState.selectedSize = 'M';
        }
        if (addToCart(product, StoreState.selectedColor, StoreState.selectedSize, 1)) openCartDrawer();
      });

      // Phones: once the main button scrolls away, keep Add to bag one tap away
      if (StoreState.pdpScroll) window.removeEventListener('scroll', StoreState.pdpScroll);
      if (!product.isComingSoon) {
        mainContainer.insertAdjacentHTML('beforeend', `
          <div class="pdp-sticky" id="pdpSticky">
            <div class="pdp-sticky-info"><b>${product.name}</b><span>${priceHTML(product)}</span></div>
            <button type="button" class="gr-btn" id="pdpStickyBtn">${glowDisc(BAG_SVG)}<span class="gr-label">ADD TO BAG</span></button>
          </div>`);
        const sticky = document.getElementById('pdpSticky');
        document.getElementById('pdpStickyBtn').addEventListener('click', () => ctaBtn.click());
        StoreState.pdpScroll = () => {
          if (!document.body.contains(ctaBtn)) return window.removeEventListener('scroll', StoreState.pdpScroll);
          const on = ctaBtn.getBoundingClientRect().bottom < 0;
          if (on !== sticky.classList.contains('is-on')) sticky.classList.toggle('is-on', on);
        };
        window.addEventListener('scroll', StoreState.pdpScroll, { passive: true });
      }
      syncPdpCta();
    }

    // 6. Relic Cards in "More from Universe"
    const relicCards = document.querySelectorAll('.pdp-relic-card');
    relicCards.forEach(rc => {
      rc.addEventListener('click', () => {
        const targetSlug = rc.getAttribute('data-slug');
        if (targetSlug) {
          window.location.hash = `#/product/${targetSlug}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });

    // 7. Neighbouring Universe Gateways
    const gatewayCards = document.querySelectorAll('.pdp-gateway-card');
    gatewayCards.forEach(gc => {
      gc.addEventListener('click', () => {
        const col = gc.getAttribute('data-collection');
        if (col) {
          window.location.hash = `#/collections/${col}`;
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Variant Matrix Helpers
  function getVariantStock(product, color, size) {
    if (!product || !product.variants) return 0;
    const v = product.variants.find(item => 
      item.color.toLowerCase() === color.toLowerCase() && item.size === size
    );
    return v ? v.stock : 0;
  }

  function priceHTML(p, opts = {}) {
    const db = window.BravadianDB;
    const settings = db.getSettings();
    const cur = settings.currency || '₹';
    const f = (n) => `${cur}${Number(n).toLocaleString('en-IN')}`;
    const now = db.effectivePrice(p);
    const launch = db.isLaunchActive(p);
    const mrp = p.comparePrice && Number(p.comparePrice) > now ? Number(p.comparePrice) : null;
    const off = mrp ? Math.round((1 - now / mrp) * 100) : 0;
    const tag = launch ? 'LAUNCH PRICE' : (off ? `${off}% OFF` : '');
    const endDate = launch ? new Date(settings.launchEndsAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '';
    return `<span class="price-block"><span class="price-now">${f(now)}</span>${mrp ? `<s class="price-mrp"><span class="sr-only">MRP </span>${f(mrp)}</s>` : ''}${tag ? `<span class="price-tag">${tag}</span>` : ''}</span>${opts.detail && mrp ? `<span class="price-note">${launch ? `Launch price till ${endDate}, then ${f(p.price)}. ` : ''}MRP ${f(mrp)}, inclusive of all taxes. Free delivery across India.</span>` : ''}`;
  }

  function colourHex(name) {
    return { 'black': '#111111', 'white': '#FFFFFF', 'ivory': '#EDE6D6', 'red': '#C62828', 'royal blue': '#1F4FD1' }[(name || '').toLowerCase()] || '#777777';
  }

  function getAvailableSizesForColor(product, color) {
    if (!product || !product.variants) return [];
    return product.variants
      .filter(v => v.color.toLowerCase() === color.toLowerCase() && v.stock > 0)
      .map(v => v.size);
  }

  /* --------------------------------------------------------------------------
     5. CART MANAGEMENT & DRAWER
     -------------------------------------------------------------------------- */
  let toastTimeout = null;

  function showCartToast(product, color, size, qty) {
    const toast = document.getElementById('cartToast');
    if (!toast) return;

    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    const settings = window.BravadianDB.getSettings();
    const imgSrc = (product.images && product.images.front) ? product.images.front : (product.image || '/images/logo.png');

    toast.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="cart-toast-thumb">
      <div class="cart-toast-body">
        <span class="cart-toast-tag">ADDED TO BAG</span>
        <div class="cart-toast-title">${product.name}</div>
        <div class="cart-toast-meta">${size} · ${color} · ${settings.currency || '₹'}${window.BravadianDB.effectivePrice(product).toLocaleString('en-IN')} (x${qty})</div>
      </div>
      <div class="cart-toast-actions">
        <button type="button" class="cart-toast-btn" onclick="window.BravadianStore.openCartDrawer();">VIEW</button>
        <button type="button" class="cart-toast-close" onclick="this.closest('.cart-toast').classList.remove('is-visible');" aria-label="Close notification">&times;</button>
      </div>
    `;

    toast.classList.add('is-visible');

    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 4000);
  }

  function triggerCartBadgePulse() {
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.classList.remove('badge-bump');
      void b.offsetWidth; // Force DOM reflow
      b.classList.add('badge-bump');
    });
  }

  // Plain-text message in the bag toast (for "only 2 left" and similar)
  function showBagNotice(text) {
    const toast = document.getElementById('cartToast');
    if (!toast) return;
    if (toastTimeout) clearTimeout(toastTimeout);
    toast.innerHTML = `
      <div class="cart-toast-body">
        <span class="cart-toast-tag">YOUR BAG</span>
        <div class="cart-toast-title"></div>
      </div>
      <div class="cart-toast-actions">
        <button type="button" class="cart-toast-close" onclick="this.closest('.cart-toast').classList.remove('is-visible');" aria-label="Close notification">&times;</button>
      </div>`;
    toast.querySelector('.cart-toast-title').textContent = text;
    toast.classList.add('is-visible');
    toastTimeout = setTimeout(() => toast.classList.remove('is-visible'), 5000);
  }

  // The most of one colour and size a bag can hold: what is in stock, and never more than
  // the 10 per line that the order database accepts.
  const MAX_PER_LINE = 10;
  function lineLimit(product, color, size) {
    return Math.min(MAX_PER_LINE, Math.max(0, getVariantStock(product, color, size)));
  }

  // Returns true when something was added
  function addToCart(product, color, size, qty = 1) {
    const existingIdx = StoreState.cart.findIndex(
      item => item.productId === product.id && item.color === color && item.size === size
    );
    const inBag = existingIdx >= 0 ? StoreState.cart[existingIdx].quantity : 0;
    const limit = lineLimit(product, color, size);

    if (limit === 0) {
      showBagNotice(`${titleCase(product.name)} in ${color} / ${size} is sold out.`);
      return false;
    }
    if (inBag >= limit) {
      showBagNotice(limit < MAX_PER_LINE
        ? `Only ${limit} left in ${color} / ${size}, and they're all in your bag.`
        : `You can order up to ${MAX_PER_LINE} of one size at a time.`);
      return false;
    }
    qty = Math.min(qty, limit - inBag);

    if (existingIdx >= 0) {
      StoreState.cart[existingIdx].quantity += qty;
    } else {
      StoreState.cart.push({
        id: bagLineId(product.id, color, size),
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: window.BravadianDB.effectivePrice(product),
        collection: product.collection,
        color: color,
        size: size,
        quantity: qty,
        image: (product.images.colors && product.images.colors[color] && product.images.colors[color].front) || product.images.front
      });
    }

    saveCart();
    triggerCartBadgePulse();
    showCartToast(product, color, size, qty);
    return true;
  }

  // Brings the bag in line with the catalog: current prices, and quantities within stock.
  // dropMissing only once the live catalog has loaded, so the built-in list never removes anything.
  function refreshCartFromCatalog(dropMissing) {
    if (!StoreState.cart.length) return;
    const notes = [];
    const kept = [];
    StoreState.cart.forEach(item => {
      const product = window.BravadianDB.getProductBySlug(item.productId) || window.BravadianDB.getProductBySlug(item.slug);
      if (!product) {
        if (dropMissing) notes.push(`${titleCase(item.name)} is no longer available`);
        else kept.push(item);
        return;
      }
      item.price = window.BravadianDB.effectivePrice(product);
      const limit = product.isComingSoon ? 0 : lineLimit(product, item.color, item.size);
      if (dropMissing && limit === 0) {
        notes.push(`${titleCase(item.name)} (${item.color} / ${item.size}) is sold out`);
        return;
      }
      if (dropMissing && item.quantity > limit) {
        item.quantity = limit;
        notes.push(`only ${limit} of ${titleCase(item.name)} (${item.color} / ${item.size}) left`);
      }
      kept.push(item);
    });
    StoreState.cart = kept;
    saveCart();
    if (notes.length) showBagNotice(`Bag updated: ${notes.join('; ')}.`);
  }

  function removeFromCart(cartItemId) {
    StoreState.cart = StoreState.cart.filter(item => item.id !== cartItemId);
    saveCart();
    if (StoreState.currentRoute === '#/cart') {
      renderCartPageView();
    }
  }

  function updateCartItemQty(cartItemId, newQty) {
    const item = StoreState.cart.find(i => i.id === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      removeFromCart(cartItemId);
    } else {
      if (newQty > item.quantity) {
        const product = window.BravadianDB.getProductBySlug(item.productId) || window.BravadianDB.getProductBySlug(item.slug);
        const limit = product ? lineLimit(product, item.color, item.size) : item.quantity;
        if (newQty > limit) {
          showBagNotice(limit < MAX_PER_LINE
            ? `Only ${limit} left in ${item.color} / ${item.size}.`
            : `You can order up to ${MAX_PER_LINE} of one size at a time.`);
          return;
        }
      }
      item.quantity = newQty;
      saveCart();
    }

    if (StoreState.currentRoute === '#/cart') {
      renderCartPageView();
    }
  }

  function calculateCartTotals() {
    const settings = window.BravadianDB.getSettings();
    const subtotal = StoreState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal === 0 ? 0 : (subtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee);
    const total = subtotal + shipping;

    return { subtotal, shipping, total, settings };
  }

  // Bag line + summary, shared by the bag drawer and the bag page
  function cartCount() {
    return StoreState.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function cartSavings() {
    return StoreState.cart.reduce((sum, item) => {
      const p = window.BravadianDB.getProductBySlug(item.slug);
      const mrp = p && p.comparePrice ? p.comparePrice : item.price;
      return sum + Math.max(0, mrp - item.price) * item.quantity;
    }, 0);
  }

  function cartLineHTML(item, settings) {
    const cur = settings.currency;
    const go = `href="#/product/${encodeURIComponent(item.slug || '')}" onclick="window.BravadianStore.closeCartDrawer()"`;
    const name = escapeHTML(item.name), color = escapeHTML(item.color), size = escapeHTML(item.size);
    return `
      <article class="bag-line">
        <a ${go} class="bag-line-media" aria-label="View ${name}"><img src="${escapeHTML(item.image)}" alt="" loading="lazy"></a>
        <div class="bag-line-body">
          <div class="bag-line-top">
            <a ${go} class="bag-line-name">${name}</a>
            <span class="bag-line-total">${cur}${(item.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
          <span class="bag-line-meta"><i style="--dot:${colourHex(item.color)}" aria-hidden="true"></i>${color} · Size ${size} ·${cur}${item.price.toLocaleString('en-IN')} each</span>
          <div class="bag-line-actions">
            <div class="bag-qty" role="group" aria-label="Quantity for ${name}">
              <button type="button" aria-label="One less" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity - 1})">&minus;</button>
              <span>${item.quantity}</span>
              <button type="button" aria-label="One more" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button type="button" class="bag-remove" onclick="window.BravadianStore.removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      </article>`;
  }

  function cartSummaryHTML(settings) {
    const cur = settings.currency;
    const { subtotal, shipping, total } = calculateCartTotals();
    const saved = cartSavings();
    const count = cartCount();
    const alwaysFree = !settings.shippingFee;
    const left = settings.freeShippingThreshold - subtotal;
    const pct = alwaysFree ? 100 : Math.min(100, Math.round((subtotal / settings.freeShippingThreshold) * 100));
    return `
      <div class="bag-free ${alwaysFree || left <= 0 ? 'is-done' : ''}">
        <p>${alwaysFree ? '<b>Free delivery</b> on every order, anywhere in India' : left > 0 ? `Add <b>${cur}${left.toLocaleString('en-IN')}</b> more for free delivery` : '<b>Free delivery unlocked</b>'}</p>
        ${alwaysFree ? '' : `<div class="bag-free-bar" aria-hidden="true"><span style="width:${pct}%"></span></div>`}
      </div>
      <dl class="bag-tally">
        <div><dt>Subtotal (${count} ${count === 1 ? 'item' : 'items'})</dt><dd>${cur}${subtotal.toLocaleString('en-IN')}</dd></div>
        ${saved > 0 ? `<div class="is-save"><dt>You save on MRP</dt><dd>&minus;${cur}${saved.toLocaleString('en-IN')}</dd></div>` : ''}
        <div><dt>Delivery</dt><dd>${shipping === 0 ? 'FREE' : `${cur}${shipping}`}</dd></div>
        <div class="is-total"><dt>Total</dt><dd>${cur}${total.toLocaleString('en-IN')}</dd></div>
      </dl>
      <button type="button" class="bag-cta gr-btn" onclick="window.BravadianStore.openCheckoutModal();">
        ${glowDisc(whatsappSVG(17))}<span class="gr-label">PLACE ORDER ON WHATSAPP</span>
      </button>
      <ul class="bag-trust">
        <li>Order confirmed with you on WhatsApp</li>
        <li>Pay by UPI, on WhatsApp once we confirm</li>
        <li>Free delivery across India, dispatched in 24&ndash;48 hours</li>
      </ul>`;
  }

  function bagEmptyHTML(inDrawer) {
    return `
      <div class="bag-empty">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
        <h2>Your bag is empty</h2>
        <p>Find a design you love. Every order ships free across India.</p>
        <a href="#/shop" class="bag-cta" ${inDrawer ? 'onclick="window.BravadianStore.closeCartDrawer();"' : ''}><span>SHOP ALL TEES</span></a>
      </div>`;
  }

  function updateCartUI() {
    // Badges in Header
    const totalCount = StoreState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = totalCount;
      b.dataset.zero = String(totalCount === 0);
      if (b.closest('.header-bag-btn')) {
        b.style.display = 'inline';
      } else {
        b.style.display = totalCount > 0 ? 'flex' : 'none';
      }
    });

    // Populate Drawer
    const drawerList = document.getElementById('cartDrawerItems');
    const drawerFoot = document.querySelector('.cart-drawer-foot');
    const drawerTitle = document.querySelector('.cart-drawer-title');
    const settings = window.BravadianDB.getSettings();
    if (drawerTitle) drawerTitle.textContent = totalCount ? `YOUR BAG (${totalCount})` : 'YOUR BAG';
    if (drawerList) {
      drawerList.innerHTML = StoreState.cart.length
        ? StoreState.cart.map(item => cartLineHTML(item, settings)).join('')
        : bagEmptyHTML(true);
    }
    if (drawerFoot) {
      drawerFoot.hidden = StoreState.cart.length === 0;
      if (StoreState.cart.length) drawerFoot.innerHTML = cartSummaryHTML(settings);
    }
  }

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('is-open');
      cartOverlay.classList.add('is-open');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('is-open');
      cartOverlay.classList.remove('is-open');
    }
  }

  /* --------------------------------------------------------------------------
     6. CART DEDICATED VIEW (#/cart)
     -------------------------------------------------------------------------- */
  function renderCartPageView() {
    const settings = window.BravadianDB.getSettings();
    if (StoreState.cart.length === 0) {
      mainContainer.innerHTML = `<div class="bag-page is-empty">${bagEmptyHTML(false)}</div>`;
      return;
    }
    const { total } = calculateCartTotals();
    const count = cartCount();
    mainContainer.innerHTML = `
      <div class="bag-page">
        <header class="bag-head">
          <div>
            <span class="bag-kicker">YOUR BAG</span>
            <h1>${count} ${count === 1 ? 'ITEM' : 'ITEMS'} IN YOUR BAG</h1>
          </div>
          <a href="#/shop" class="bag-back">&larr; Continue shopping</a>
        </header>
        <div class="bag-grid">
          <section class="bag-lines" aria-label="Items in your bag">
            ${StoreState.cart.map(item => cartLineHTML(item, settings)).join('')}
          </section>
          <aside class="bag-summary" aria-label="Order summary">
            <h2>ORDER SUMMARY</h2>
            ${cartSummaryHTML(settings)}
          </aside>
        </div>
        <div class="bag-sticky">
          <div><span>Total</span><b>${settings.currency}${total.toLocaleString('en-IN')}</b></div>
          <button type="button" class="bag-cta gr-btn" onclick="window.BravadianStore.openCheckoutModal();">${glowDisc(whatsappSVG(16))}<span class="gr-label">PLACE ORDER</span></button>
        </div>
      </div>`;
  }

  /* --------------------------------------------------------------------------
     7. CHECKOUT & WHATSAPP ORDER GENERATOR
     -------------------------------------------------------------------------- */
  function openCheckoutModal() {
    if (StoreState.cart.length === 0) {
      alert('Your bag is empty. Add a tee first.');
      return;
    }
    if (checkoutModal) {
      const strip = document.getElementById('checkoutSummaryStrip');
      if (strip) {
        const { total, settings } = calculateCartTotals();
        const count = cartCount();
        strip.innerHTML = `<span>${count} ${count === 1 ? 'item' : 'items'} in your bag</span><b>Total ${settings.currency}${total.toLocaleString('en-IN')}</b>`;
      }
      checkoutModal.classList.add('is-open');
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('is-open');
    }
  }

  // Handle WhatsApp Checkout Form Submit
  window.handleCheckoutSubmit = async function (e) {
    e.preventDefault();

    const name = document.getElementById('chkName').value.trim();
    const phone = document.getElementById('chkPhone').value.trim();
    const email = document.getElementById('chkEmail').value.trim();
    const address1 = document.getElementById('chkAddress1').value.trim();
    const address2 = document.getElementById('chkAddress2').value.trim();
    const city = document.getElementById('chkCity').value.trim();
    const state = document.getElementById('chkState').value.trim();
    const pincode = document.getElementById('chkPincode').value.trim();
    const landmark = document.getElementById('chkLandmark').value.trim();
    const agreement = document.getElementById('chkAgree').checked;

    let hasErrors = false;

    // Validate Name
    if (!name) { setFieldError('chkName', 'Full name is required.'); hasErrors = true; }
    else clearFieldError('chkName');

    // Validate Phone (10 digit Indian mobile)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (!phoneRegex.test(cleanPhone)) {
      setFieldError('chkPhone', 'Enter a valid 10-digit Indian mobile number.');
      hasErrors = true;
    } else clearFieldError('chkPhone');

    // Validate Email if entered
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError('chkEmail', 'Enter a valid email address.');
        hasErrors = true;
      } else clearFieldError('chkEmail');
    } else clearFieldError('chkEmail');

    // Validate Address
    if (!address1) { setFieldError('chkAddress1', 'Delivery address is required.'); hasErrors = true; }
    else clearFieldError('chkAddress1');

    // Validate City & State
    if (!city) { setFieldError('chkCity', 'City is required.'); hasErrors = true; }
    else clearFieldError('chkCity');

    if (!state) { setFieldError('chkState', 'State is required.'); hasErrors = true; }
    else clearFieldError('chkState');

    // Validate Pincode (6-digit Indian PIN)
    const pinRegex = /^\d{6}$/;
    if (!pinRegex.test(pincode)) {
      setFieldError('chkPincode', 'Enter a valid 6-digit Indian PIN code.');
      hasErrors = true;
    } else clearFieldError('chkPincode');

    // Validate Agreement
    if (!agreement) {
      alert('Please tick the box to agree to our Terms & Conditions and Privacy Policy.');
      return;
    }

    if (hasErrors) return;

    const submitBtn = e.target.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    // Open the tab now: browsers block window.open once we've awaited the network.
    const waWindow = window.open('', '_blank');

    const result = await window.BravadianDB.placeOrder(
      {
        name, phone: cleanPhone, email, pincode, city, state, landmark,
        address: `${address1}${address2 ? ', ' + address2 : ''}`
      },
      StoreState.cart.map(item => ({
        productId: item.productId, color: item.color, size: item.size, quantity: item.quantity
      }))
    );

    if (result.rejected) {
      if (waWindow) waWindow.close();
      if (submitBtn) submitBtn.disabled = false;
      alert(`${result.message}

Please update your bag and try again.`);
      return;
    }

    // Generate Order Message (database totals win when the order was saved)
    const totals = calculateCartTotals();
    const settings = totals.settings;
    const order = result.order;
    const subtotal = order ? Number(order.subtotal) : totals.subtotal;
    const shipping = order ? Number(order.shipping) : totals.shipping;
    const total = order ? Number(order.total) : totals.total;

    const itemsText = StoreState.cart.map((item, idx) => `
${idx + 1}. Product: ${item.name}
Collection: ${item.collection.toUpperCase()}
Color: ${item.color}
Size: ${item.size}
Quantity: ${item.quantity}
Price: ${settings.currency}${(item.price * item.quantity).toLocaleString('en-IN')}
`.trim()).join('\n\n');

    const message = `
Hello Bravadian,

I would like to place an order.
${order ? `
Order No: ${order.order_number}
` : ''}
ORDER DETAILS
--------------------

${itemsText}

--------------------
Subtotal: ${settings.currency}${subtotal.toLocaleString('en-IN')}
Delivery: ${shipping === 0 ? 'FREE' : `${settings.currency}${shipping}`}
TOTAL: ${settings.currency}${total.toLocaleString('en-IN')}

DELIVERY DETAILS
--------------------

Name: ${name}
Phone: ${cleanPhone}
Email: ${email || 'N/A'}

Address: ${address1}${address2 ? ', ' + address2 : ''}
City: ${city}
State: ${state}
Pincode: ${pincode}
Landmark: ${landmark || 'N/A'}

--------------------

I agree to the Bravadian Terms & Conditions and Privacy Policy.

Thank you.
`.trim();

    // Security Rule: NEVER save customer delivery information to localStorage
    // Clear cart
    StoreState.cart = [];
    saveCart();
    closeCheckoutModal();

    // Open WhatsApp URL
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encoded}`;
    
    if (submitBtn) submitBtn.disabled = false;
    if (!waWindow) {
      window.location.href = waUrl;
      return;
    }
    waWindow.location.href = waUrl;

    // Transition to Order Success View
    window.location.hash = '#/order-success';
  };

  function setFieldError(fieldId, msg) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const parent = field.closest('.checkout-field');
    if (parent) {
      parent.classList.add('has-error');
      const errEl = parent.querySelector('.field-error-msg');
      if (errEl) errEl.textContent = msg;
    }
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    const parent = field.closest('.checkout-field');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }

  /* --------------------------------------------------------------------------
     8. ORDER SUCCESS VIEW
     -------------------------------------------------------------------------- */
  function renderOrderSuccessView() {
    mainContainer.innerHTML = `
      <section class="done-page">
        <div class="done-badge" aria-hidden="true">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <span class="bag-kicker">ORDER READY ON WHATSAPP</span>
        <h1>ALMOST DONE</h1>
        <p class="done-lede">WhatsApp has opened with your order already typed in. Press <b>send</b> so it reaches us.</p>
        <ol class="done-steps">
          <li><b>Send the message</b><span>Your items, sizes and address are in the chat. Just press send.</span></li>
          <li><b>We confirm</b><span>We reply to confirm your size and total, and send our UPI details to pay.</span></li>
          <li><b>We dispatch</b><span>Your order ships within 24&ndash;48 hours, anywhere in India.</span></li>
        </ol>
        <div class="done-actions">
          <a href="#/shop" class="bag-cta"><span>CONTINUE SHOPPING</span></a>
          <a href="${waURL(WA_MSG.orderHelp)}" target="_blank" rel="noopener noreferrer" class="done-ghost">WhatsApp did not open? Message us</a>
        </div>
      </section>
    `;
  }

  /* --------------------------------------------------------------------------
     9. SEARCH BAR LOGIC
     -------------------------------------------------------------------------- */
  function initSearchEvents() {
    const searchInput = document.getElementById('searchQueryInput');
    const resultsBox = document.getElementById('searchResultsContainer');

    if (!searchInput || !resultsBox) return;

    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (q.length === 0) {
        resultsBox.innerHTML = '';
        return;
      }

      const products = window.BravadianDB.getProducts({ search: q });
      const settings = window.BravadianDB.getSettings();

      if (products.length === 0) {
        // What the shopper typed is shown as text, never as HTML
        resultsBox.innerHTML = `<div style="padding: 1.5rem; color: #888; font-family: var(--font-mono); font-size: 0.85rem;">No tees match "${escapeHTML(q)}". Try a name, a collection or a symbol like Shiva or elephant.</div>`;
      } else {
        resultsBox.innerHTML = products.map(p => `
          <a href="#/product/${encodeURIComponent(p.slug)}" class="search-result-row" onclick="window.BravadianStore.closeSearchModal();">
            <img src="${escapeHTML(p.images.front)}" alt="${escapeHTML(p.name)}" class="search-result-thumb">
            <div class="search-result-info">
              <h4 class="search-result-title">${escapeHTML(p.name)}</h4>
              <span class="search-result-price">${priceHTML(p)}</span>
            </div>
            <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-ember);">VIEW →</span>
          </a>
        `).join('');
      }
    });
  }

  function openSearchModal() {
    if (searchModal) {
      searchModal.classList.add('is-open');
      const input = document.getElementById('searchQueryInput');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    }
  }

  function closeSearchModal() {
    if (searchModal) searchModal.classList.remove('is-open');
  }

  /* --------------------------------------------------------------------------
     10. SIZE GUIDE MODAL
     -------------------------------------------------------------------------- */
  function openSizeGuideModal() {
    if (sizeGuideModal) {
      const tableBody = document.getElementById('sizeGuideTableBody');
      const guideData = window.BravadianDB.getSizeGuide();

      if (tableBody) {
        const fmt = (v) => (v === null || v === undefined || v === '') ? '<span class="size-spec-na">—</span>' : `${v}" <small>(${Math.round(v * 2.54)} cm)</small>`;
        tableBody.innerHTML = guideData.map(row => `
          <tr data-size="${row.size}">
            <td class="cell-size">${row.size}</td>
            <td>${fmt(row.chest)}</td>
            <td>${fmt(row.length)}</td>
            <td>${fmt(row.shoulder)}</td>
            <td>${fmt(row.sleeve)}</td>
          </tr>
        `).join('');
        const empty = (k) => guideData.every(r => r[k] === null || r[k] === undefined || r[k] === '');
        const table = tableBody.closest('table');
        if (table) { table.classList.toggle('hide-c4', empty('shoulder')); table.classList.toggle('hide-c5', empty('sleeve')); }
      }

      sizeGuideModal.classList.add('is-open');
      initFitFinder();
      const card = sizeGuideModal.querySelector('.size-spec-card');
      if (card) card.scrollTop = 0;
    }
  }

  // ── Fit Finder ─────────────────────────────────────────────────────────
  const FIT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
  const FIT_KEY = 'bravadian_fit_profile';
  const FIT_DEFAULT = { height: 175, weight: 70, build: 'regular', fit: 'true' };

  function loadFitProfile() {
    try { return JSON.parse(localStorage.getItem(FIT_KEY)); } catch (e) { return null; }
  }

  // Weight drives chest/width, height drives body length; build and taste shift by part of a size.
  function recommendSize(p) {
    const build = { slim: -0.4, regular: 0, athletic: 0.3, broad: 0.6 }[p.build] || 0;
    const taste = { neat: -0.6, true: 0, extra: 0.8 }[p.fit] || 0;
    const v = 0.65 * ((p.weight - 55) / 10) + 0.35 * ((p.height - 165) / 6) + build + taste;
    const idx = Math.min(4, Math.max(0, Math.round(v)));
    const frac = v - Math.round(v);
    let alt = null;
    if (Math.abs(frac) >= 0.3) {
      const j = idx + (frac > 0 ? 1 : -1);
      if (j >= 0 && j <= 4) alt = FIT_SIZES[j];
    }
    return { size: FIT_SIZES[idx], alt, edge: v < -0.5 ? 'small' : (v > 4.5 ? 'large' : null) };
  }

  function fitButtonLabel() {
    const p = loadFitProfile();
    return p ? `YOUR SIZE: ${recommendSize(p).size} &rarr;` : 'FIND MY SIZE &rarr;';
  }

  let fitFinderBound = false;
  function initFitFinder() {
    const h = document.getElementById('ffHeight');
    const w = document.getElementById('ffWeight');
    if (!h || !w) return;
    const state = Object.assign({}, FIT_DEFAULT, loadFitProfile() || {});
    h.value = state.height;
    w.value = state.weight;

    const syncChips = (groupId, key) => {
      document.querySelectorAll(`#${groupId} button`).forEach(b => {
        const on = b.dataset.v === state[key];
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    };

    const update = (save) => {
      state.height = Number(h.value);
      state.weight = Number(w.value);
      const totalIn = Math.round(state.height / 2.54);
      document.getElementById('ffHeightOut').textContent = `${state.height} cm · ${Math.floor(totalIn / 12)}'${totalIn % 12}"`;
      document.getElementById('ffWeightOut').textContent = `${state.weight} kg`;
      syncChips('ffBuild', 'build');
      syncChips('ffFit', 'fit');

      const rec = recommendSize(state);
      document.getElementById('ffSize').textContent = rec.size;

      let note;
      if (rec.edge === 'small') note = 'You are at the small end of our range. S will still sit loose and relaxed.';
      else if (rec.edge === 'large') note = 'You are at the top of our range. XXL may fit closer than intended. Message us on WhatsApp for a custom size.';
      else if (rec.alt) {
        const bigger = FIT_SIZES.indexOf(rec.alt) > FIT_SIZES.indexOf(rec.size) ? rec.alt : rec.size;
        const smaller = bigger === rec.alt ? rec.size : rec.alt;
        note = `You are between ${smaller} and ${bigger}. Pick ${bigger} for more drape, ${smaller} for a neater fit.`;
      } else note = `${rec.size} gives you the dropped-shoulder drape this tee is cut for.`;
      document.getElementById('ffNote').textContent = note;

      const row = window.BravadianDB.getSizeGuide().find(r => r.size === rec.size);
      document.getElementById('ffSpecs').innerHTML = row ? `
        <div><dt>Chest</dt><dd>${row.chest}"</dd></div>
        <div><dt>Length</dt><dd>${row.length}"</dd></div>
        ${row.shoulder ? `<div><dt>Shoulder</dt><dd>${row.shoulder}"</dd></div>` : ''}` : '';

      document.querySelectorAll('#sizeGuideTableBody tr').forEach(tr => {
        tr.classList.toggle('is-recommended', tr.dataset.size === rec.size);
      });

      const apply = document.getElementById('ffApply');
      const pdpBox = document.querySelector(`.pdp-size-box[data-size="${rec.size}"]`);
      apply.hidden = !document.getElementById('pdpSizeMatrix');
      apply.disabled = !pdpBox || pdpBox.disabled || pdpBox.classList.contains('disabled');
      apply.innerHTML = apply.disabled ? `SIZE ${rec.size} IS SOLD OUT IN THIS DESIGN` : `SELECT SIZE ${rec.size} &rarr;`;
      apply.dataset.size = rec.size;

      if (save) {
        try { localStorage.setItem(FIT_KEY, JSON.stringify(state)); } catch (e) {}
        const trigger = document.getElementById('pdpSizeGuideTrigger');
        if (trigger) trigger.innerHTML = fitButtonLabel();
      }
    };

    if (!fitFinderBound) {
      fitFinderBound = true;
      h.addEventListener('input', () => update(true));
      w.addEventListener('input', () => update(true));
      [['ffBuild', 'build'], ['ffFit', 'fit']].forEach(([id, key]) => {
        document.getElementById(id).addEventListener('click', (e) => {
          const b = e.target.closest('button[data-v]');
          if (!b) return;
          state[key] = b.dataset.v;
          update(true);
        });
      });
      document.getElementById('ffApply').addEventListener('click', (e) => {
        const box = document.querySelector(`.pdp-size-box[data-size="${e.currentTarget.dataset.size}"]`);
        if (box) box.click();
        closeSizeGuideModal();
      });
    }
    update(false);
  }

  // ── Lookbook ───────────────────────────────────────────────────────────
  function renderLookbookView() {
    const settings = window.BravadianDB.getSettings();
    const shopLook = window.BravadianDB.getProducts().filter(p => !p.isComingSoon && p.collection === 'heritage').slice(0, 3);
    // New lookbook photos live in /images/lookbook/; until they exist, show product photos
    const lbImg = (name, fallback, alt, cls) =>
      `<img src="/images/lookbook/${name}.webp" onerror="this.onerror=null;this.src='${fallback}'" alt="${alt}" class="${cls}" loading="lazy">`;
    const ticker = ['240 GSM COTTON', 'OVERSIZED FIT', 'ORIGINAL INDIAN ARTWORK', 'MADE IN INDIA', 'FOUR COLOURS']
      .map(t => `<span>${t}</span><span class="lb2-star">&#10022;</span>`).join('');

    mainContainer.innerHTML = `
      <div class="lookbook lb2">
        <header class="lb2-hero">
          ${lbImg('lb-hero', '/images/products/bharat-spirit/worn-temple.webp?v=3', 'Bravadian heritage tees worn on the street', 'lb2-hero-img')}
          <div class="lb2-hero-shade" aria-hidden="true"></div>
          <div class="lb2-hero-copy">
            <span class="lb2-eyebrow"><i></i>LOOKBOOK · ADHYAYA 01</span>
            <h1 class="lb2-title">LOOKBOOK 01:<br>WEAR YOUR ROOTS</h1>
            <p class="lb2-lede">The Heritage collection, out on the street. Folk art and the symbols of India, printed on oversized cotton tees made for every day.</p>
          </div>
        </header>

        <div class="lb2-ticker" aria-hidden="true"><div class="lb2-ticker-track">${ticker}${ticker}${ticker}${ticker}</div></div>

        <section class="lb2-section">
          <div class="lb2-head">
            <div>
              <span class="lb2-kicker">THE LOOKS</span>
              <h2 class="lb2-h2">HOW IT&rsquo;S WORN</h2>
            </div>
            <p class="lb2-note">Two designs, styled the way you would wear them. Loose, easy and bold.</p>
          </div>
          <div class="lb2-pair">
            <figure class="lb2-fig">
              ${lbImg('lb-look-01', '/images/products/bharat-spirit/worn-studio.webp?v=2', 'Bharat Spirit tee, styled look', 'lb2-img')}
              <figcaption><b>LOOK 01 · BHARAT SPIRIT</b><span>BLACK · OVERSIZED</span></figcaption>
            </figure>
            <figure class="lb2-fig">
              ${lbImg('lb-look-02', '/images/products/craft-atlas/closeup.webp', 'Indian Craft Atlas tee, styled look', 'lb2-img')}
              <figcaption><b>LOOK 02 · INDIAN CRAFT ATLAS</b><span>BLACK · OVERSIZED</span></figcaption>
            </figure>
          </div>
        </section>

        <section class="lb2-section">
          <div class="lb2-head">
            <div>
              <span class="lb2-kicker">SHOP THE LOOK</span>
              <h2 class="lb2-h2">WORN IN THIS LOOKBOOK</h2>
            </div>
            <p class="lb2-note">Tap a tee to see its story. Free delivery across India.</p>
          </div>
          <div class="lb2-shop" style="--n:${Math.max(shopLook.length, 2)}">
            ${shopLook.map((p, n) => `
            <a href="#/product/${p.slug}" class="lb2-card">
              <span class="lb2-card-tag">${p.relicTag || `DESIGN 0${n + 1}`}</span>
              <div class="lb2-card-media"><img src="${p.images.front}" alt="${p.name}" loading="lazy"></div>
              <div class="lb2-card-info">
                <h3>${p.name}</h3>
                <span class="lb2-card-price">${priceHTML(p)}</span>
                <span class="lb2-card-sub">HEAVY COTTON · OVERSIZED</span>
              </div>
            </a>`).join('')}
          </div>
        </section>

        <section class="lb2-section">
          <figure class="lb2-fig lb2-wide">
            ${lbImg('lb-panorama', '/images/lookbook/lb-hero.webp', 'Wide view of a Bravadian look', 'lb2-img')}
            <figcaption><b>HERITAGE, WIDE</b><span>SHOT IN INDIA</span></figcaption>
          </figure>
        </section>

        <footer class="lb2-quote">
          <span class="lb2-kicker">INDIAN ROOTS. MODERN FORM.</span>
          <blockquote data-focus-reveal>&ldquo;You didn&rsquo;t just pick a T-shirt. You picked a story.&rdquo;</blockquote>
          <span class="lb2-sign">BRAVADIAN, EST. 2026</span>
          <div class="lb2-actions">
            <a href="#/shop" class="lb-btn lb-btn-red">SHOP ALL TEES &rarr;</a>
            <a href="${waURL(WA_MSG.custom)}" target="_blank" rel="noopener noreferrer" class="lb-btn lb-btn-ghost">CUSTOM ORDER ON WHATSAPP</a>
          </div>
        </footer>
      </div>`;
    initFocusReveal(mainContainer);
  }


  function closeSizeGuideModal() {
    if (sizeGuideModal) sizeGuideModal.classList.remove('is-open');
  }

  /* --------------------------------------------------------------------------
     11. LEGAL & POLICY VIEWS
     -------------------------------------------------------------------------- */
  function renderPolicyView(type) {
    let title = '';
    let content = '';

    if (type === 'privacy' || type === 'privacy-policy') {
      title = 'PRIVACY POLICY';
      content = `
        <p>BRAVADIAN (BRAVE INDIAN) collects only what we need to deliver your order. This page explains what that is, where it is kept and who sees it.</p>
        <h3>WHAT WE COLLECT</h3>
        <p>When you place an order: your name, phone number, delivery address, city, state, pincode, landmark and email (if you give one), and the items you ordered. Payment is by UPI, arranged with you on WhatsApp. We never ask for or store payment details on this website.</p>
        <h3>HOW WE USE IT</h3>
        <p>To confirm, pack, ship and deliver your order, and to contact you about it. We do not sell your details or use them for advertising.</p>
        <h3>WHERE IT IS KEPT</h3>
        <p>Order details are saved in our order database, hosted by Supabase, and are visible only to the BRAVADIAN team. When you tap to order, the same details are also put into a WhatsApp message to us, which is handled under WhatsApp's own privacy terms.</p>
        <h3>PREVENTING FAKE ORDERS</h3>
        <p>To stop fake orders from blocking stock, we keep a scrambled (one-way hashed) form of your network address with each order and limit how many orders can be placed in a short time. We do not keep the address itself.</p>
        <h3>"USE MY LOCATION" AT CHECKOUT</h3>
        <p>This is optional. If you use it, your device's location is sent to OpenStreetMap to look up your address, and the map preview is loaded from OpenStreetMap. Typing a pincode looks up your city and state with India Post's pincode service. We do not store your location.</p>
        <h3>ON YOUR DEVICE</h3>
        <p>Your bag, light or dark theme and fit-finder answers are saved in your own browser so they are there next time. You can clear them at any time by clearing this site's data in your browser.</p>
        <h3>YOUR CHOICES</h3>
        <p>To see, correct or delete the details we hold about you, email us at <a href="mailto:${window.BravadianDB.getSettings().supportEmail || 'bravadian.clothing@gmail.com'}">${window.BravadianDB.getSettings().supportEmail || 'bravadian.clothing@gmail.com'}</a>.</p>
      `;
    } else if (type === 'terms' || type === 'terms-conditions') {
      title = 'TERMS & CONDITIONS';
      content = `
        <p>By browsing BRAVADIAN and ordering through WhatsApp, you agree to these terms.</p>
        <h3>SMALL BATCHES</h3>
        <p>Each design is made in small batches. Sending your order on WhatsApp does not reserve a tee until we reply and confirm it with you.</p>
        <h3>PAYMENT</h3>
        <p>We take payment by UPI only. Once we confirm your order on WhatsApp, we send our UPI details there.</p>
        <h3>CUSTOM ORDERS</h3>
        <p>Custom and personalised tees are made to order. Once placed, they cannot be exchanged or returned.</p>
      `;
    } else if (type === 'shipping' || type === 'shipping-policy') {
      title = 'SHIPPING & DELIVERY';
      content = `
        <p>Delivery is free on every order, anywhere in India.</p>
        <h3>DISPATCH</h3>
        <p>Every tee is checked and packed, then dispatched within 24 to 48 hours of us confirming your order on WhatsApp.</p>
        <h3>DELIVERY TIMES</h3>
        <p>Metro cities: usually 2 to 4 working days. Other areas: usually 4 to 6 working days.</p>
      `;
    } else if (type === 'returns' || type === 'return-refund-policy') {
      title = 'RETURNS & EXCHANGES';
      content = `
        <p>Wrong size? We exchange sizes within 7 days of delivery, as long as the tee is unworn and the tags are still on.</p>
        <h3>DAMAGED OR FAULTY</h3>
        <p>If your tee arrives with a stitching or fabric fault, message us on WhatsApp with your order number and a photo, and we will replace it.</p>
        <h3>CUSTOM &amp; PERSONALISED ORDERS</h3>
        <p>Custom and personalised tees are made just for you, so once the order is placed they cannot be exchanged or returned.</p>
      `;
    }

    mainContainer.innerHTML = `
      <div class="policy-page-container">
        <h1 class="policy-headline">${title}</h1>
        <div class="policy-body">${content}</div>
        <div style="margin-top: 3rem;">
          <a href="#/shop" class="btn-secondary">← BACK TO SHOP</a>
        </div>
      </div>
    `;
  }

  function renderAboutView() {
    mainContainer.innerHTML = `
      <div class="about-page-wrap">
        <!-- 1. HERO BRAND INTRO -->
        <section class="about-hero-section">
          <div class="about-hero-bg" aria-hidden="true">
            <img src="/images/lookbook/lb-panorama.webp" alt="" decoding="async" onerror="this.parentNode.remove()">
          </div>
          <div class="container about-hero-container">
            <div class="about-badge-wrap">
              <span class="figma-tag">[ 🇮🇳 CONTEMPORARY INDIAN STREETWEAR ]</span>
              <span class="about-radar-dot" aria-hidden="true"></span>
            </div>
            
            <h1 class="about-hero-title">
              <span class="about-title-lead">INDIAN ROOTS. MODERN FORM.</span>
              <span class="about-title-sub">A STORY WORTH WEARING.</span>
            </h1>

            <p class="about-manifesto-sub">
              Bravadian is built on one idea: Indian identity belongs in everyday streetwear. We take the myths, temples, scripts and craft we grew up around and turn them into original graphics on oversized, heavyweight tees. Made to be worn, not displayed.
            </p>

            <div class="about-geo-coordinates">
              <span class="geo-bar"></span>
              <span class="geo-text">— ADHYAYA 01: ROOTED FORM · EST. 2026 —</span>
              <span class="geo-bar"></span>
            </div>
          </div>
        </section>

        <!-- 2. EDITORIAL PULL-QUOTE BOX -->
        <section class="about-quote-section container">
          <div class="about-quote-card">
            <span class="quote-tag">[ WHAT WE MAKE ]</span>
            <blockquote class="about-quote-body">
              “CONTEMPORARY INDIAN STREETWEAR FOR PEOPLE WHO WANT THEIR CLOTHING TO CARRY IDENTITY, STORY AND ATTITUDE.”
            </blockquote>
            <div class="quote-author-line">
              <span class="quote-line-dash"></span>
              <span class="quote-author-text">BRAVADIAN · bravadian.in</span>
              <span class="quote-line-dash"></span>
            </div>
          </div>
        </section>

        <!-- 3. FOUR CORE ARCHITECTURAL PILLARS -->
        <section class="about-pillars-section container">
          <div class="about-section-header">
            <span class="figma-tag">— WHAT WE STAND FOR</span>
            <h2 class="about-section-title">BUILT WITH INTENTION</h2>
            <p class="about-section-narrative">
              Four values decide what we make, and what we don't.
            </p>
          </div>

          <div class="about-pillars-grid">
            <!-- PILLAR 1: 240 GSM -->
            <div class="about-pillar-card">
              <div class="pillar-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span class="pillar-num">[ 01 ]</span>
              <h3 class="pillar-heading">IDENTITY</h3>
              <p class="pillar-desc">
                Indian roots, worn the way you actually dress. No costume, no stereotypes. Culture treated as source material, used with respect.
              </p>
              <div class="pillar-metric">INDIAN ROOTS · MODERN FORM</div>
            </div>

            <!-- PILLAR 2: NO-BACON RIB COLLAR -->
            <div class="about-pillar-card">
              <div class="pillar-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="12" r="5" stroke-dasharray="3 3"/>
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3"/>
                </svg>
              </div>
              <span class="pillar-num">[ 02 ]</span>
              <h3 class="pillar-heading">ORIGINALITY</h3>
              <p class="pillar-desc">
                Inspiration sets the direction. The final artwork is always ours. Every design gets a name, a concept and one sentence that says why it exists.
              </p>
              <div class="pillar-metric">ORIGINAL ARTWORK · EVERY DESIGN</div>
            </div>

            <!-- PILLAR 3: HOYSALA ICONOGRAPHY -->
            <div class="about-pillar-card">
              <div class="pillar-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span class="pillar-num">[ 03 ]</span>
              <h3 class="pillar-heading">QUALITY</h3>
              <p class="pillar-desc">
                Fabric, fit, print and finish have to justify the price. Every design is sampled and wash-tested before we make a full batch.
              </p>
              <div class="pillar-metric">WASH-TESTED · BEFORE WE MAKE IT</div>
            </div>

            <!-- PILLAR 4: VAULT SERIALIZATION -->
            <div class="about-pillar-card">
              <div class="pillar-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  <circle cx="12" cy="16" r="1.5"/>
                </svg>
              </div>
              <span class="pillar-num">[ 04 ]</span>
              <h3 class="pillar-heading">ACCESSIBILITY</h3>
              <p class="pillar-desc">
                A premium feel without a premium barrier. We keep prices within reach so the story is something you wear every day.
              </p>
              <div class="pillar-metric">PREMIUM · AT A FAIR PRICE</div>
            </div>
          </div>
        </section>

        <!-- 4. SPECIFICATION TAXONOMY STRIP -->
        <section class="about-specs-section container">
          <div class="about-spec-strip">
            <div class="about-spec-item">
              <span class="spec-label">FABRIC</span>
              <span class="spec-val">240 GSM</span>
              <span class="spec-sub">Thick, soft French Terry cotton</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">FIT</span>
              <span class="spec-val">OVERSIZED</span>
              <span class="spec-sub">Relaxed, with dropped shoulders</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">FEEL</span>
              <span class="spec-val">WASHED SOFT</span>
              <span class="spec-sub">Bio + silicone wash, soft from day one</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">PRINT</span>
              <span class="spec-val">FULL COLOUR</span>
              <span class="spec-sub">DTF print, sharp and bright</span>
            </div>
          </div>
        </section>

        <!-- 5. CALL TO ACTION WITH THEMED VAULT BUTTON -->
        <section class="about-cta-section container">
          <div class="about-cta-card">
            <span class="figma-tag">[ ADHYAYA 01 IS HERE ]</span>
            <h2 class="about-cta-title">WEAR THE STORY</h2>
            <p class="about-cta-sub">
              You didn't just pick a T-shirt. You picked a story.
            </p>
            <div class="about-cta-actions">
              <a href="#/shop" class="btn-figma-primary">
                <span>SHOP ALL TEES</span>
                <svg class="btn-vault-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a href="${waURL(WA_MSG.question)}" target="_blank" rel="noopener noreferrer" class="btn-figma-whatsapp">
                ${whatsappSVG(18)}
                <span>TALK TO US ON WHATSAPP</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderContactView() {
    const settings = window.BravadianDB.getSettings();
    const card = (href, label, value, note, primary, ext) => `
      <a href="${href}" class="contact-card ${primary ? 'is-primary' : ''}" ${ext ? 'target="_blank" rel="noopener noreferrer"' : ''}>
        <span class="contact-label">${label}</span>
        <span class="contact-value">${value}</span>
        <span class="contact-note">${note}</span>
      </a>`;
    mainContainer.innerHTML = `
      <section class="contact-page">
        <span class="bag-kicker">CONTACT</span>
        <h1>TALK TO US</h1>
        <p class="contact-lede">Questions about sizes, an order or a custom print? WhatsApp is the fastest way to reach us.</p>
        <div class="contact-grid">
          ${card(waURL(WA_MSG.question), 'WHATSAPP', '+91 79753 62526', 'Sizes, products, payments. Tap to chat.', true, true)}
          ${card(waURL(WA_MSG.orderHelp), 'ORDER HELP', 'Track or change an order', 'Keep your order number handy.', false, true)}
          ${card(waURL(WA_MSG.custom), 'CUSTOM ORDERS', 'Your design, your name', 'Team tees, gifts and one-off prints.', false, true)}
          ${card(settings.instagramUrl, 'INSTAGRAM', '@bravadian.in', 'New drops and behind the scenes.', false, true)}
          ${card(`mailto:${settings.supportEmail}`, 'EMAIL', settings.supportEmail, 'For longer questions and invoices.', false, false)}
          ${card(`tel:+${settings.whatsappNumber}`, 'CALL', '079753 62526', 'Prefer to talk? Give us a ring.', false, false)}
        </div>
      </section>
    `;
  }

  /* --------------------------------------------------------------------------
     GARMENT CARE BOOK VIEW (#/care)
     -------------------------------------------------------------------------- */
  function renderGarmentCareView() {
    mainContainer.innerHTML = `
      <div class="care-page-container">
        <!-- 1. HERO HEADER -->
        <div class="care-page-hero">
          <div class="about-badge-wrap" style="margin-bottom: 0.75rem;">
            <span class="figma-tag">[ CARE GUIDE ]</span>
            <span class="about-radar-dot" aria-hidden="true"></span>
          </div>
          <h1 class="care-page-title">LOOK AFTER YOUR TEE</h1>
          <p class="care-page-intro">
            Our tees are heavy 240 GSM cotton with large printed designs. A little care keeps the colours bright, the collar firm and the print looking new for years.
          </p>
        </div>

        <!-- 2. SECTION 04: THE FOUR MAINTENANCE PROTOCOLS -->
        <section class="size-spec-section" style="margin-bottom: 3.5rem;">
          <div class="size-spec-section-head">
            <span class="size-spec-section-num">— CARE GUIDE</span>
            <h2 class="size-spec-section-title">EVERY WASH</h2>
            <p class="size-spec-section-sub">
              Four simple steps, every time you wash.
            </p>
          </div>

          <div class="care-grid">
            <div class="care-item">
              <span class="care-sym"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7l2.4 12.5h14.2L21.5 7"/><path d="M2.5 7c1.6 1.4 3.2 1.4 4.8 0s3.2-1.4 4.7 0 3.2 1.4 4.8 0 3.1-1.4 4.7 0"/><text x="12" y="16.6" font-size="6.2" font-weight="700" text-anchor="middle" fill="currentColor" stroke="none" font-family="Arial, sans-serif">30</text></svg></span>
              <div class="care-txt"><h4>Wash cold</h4><p>Inside out, gentle cycle. Keeps the print and the colour bright.</p></div>
              <span class="care-chip">30°C</span>
            </div>
            <div class="care-item">
              <span class="care-sym"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="12" x2="17" y2="12"/><path d="M3 9L9 3M3 6l3-3"/></svg></span>
              <div class="care-txt"><h4>Dry in the shade</h4><p>Lay it flat, away from direct sun. No tumble dryer.</p></div>
              <span class="care-chip">Flat dry</span>
            </div>
            <div class="care-item">
              <span class="care-sym"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5L21.5 20h-19z"/><path d="M5 5l14 14M19 5L5 19"/></svg></span>
              <div class="care-txt"><h4>No bleach</h4><p>Mild detergent only. Dab small stains by hand.</p></div>
              <span class="care-chip">Mild detergent</span>
            </div>
            <div class="care-item">
              <span class="care-sym"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 18h18l-1.8-6.4A3 3 0 0 0 16.3 9.5H9"/><path d="M3 18c0-4.2 2.8-7 7-7h10"/><circle cx="12" cy="14.6" r="0.9" fill="currentColor" stroke="none"/></svg></span>
              <div class="care-txt"><h4>Iron low, inside out</h4><p>Lowest heat, never directly on the print.</p></div>
              <span class="care-chip">Low heat</span>
            </div>
          </div>
          <p class="care-tip"><b>Tip:</b> turn your tee inside out before every wash. It is the single best way to protect the print.</p>
        </section>

        <!-- 4. TECHNICAL FIBER & STRUCTURAL SPECIFICATIONS -->
        <section class="size-spec-section" style="margin-top: 3.5rem;">
          <div class="size-spec-section-head">
            <span class="size-spec-section-num">— WHAT IT'S MADE OF</span>
            <h2 class="size-spec-section-title">FABRIC DETAILS</h2>
          </div>

          <div style="overflow-x: auto;">
            <table class="care-fabric-matrix-table">
              <thead>
                <tr>
                  <th>COMPONENT</th>
                  <th>WHAT IT IS</th>
                  <th>HOW TO CARE</th>
                  <th>WHY IT MATTERS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: var(--theme-accent); font-weight: 700;">240 GSM Body Fabric</td>
                  <td>French Terry cotton, bio + silicone washed</td>
                  <td>Cold, gentle wash</td>
                  <td>Soft, thick and holds its shape</td>
                </tr>
                <tr>
                  <td style="color: var(--theme-accent); font-weight: 700;">1.25" Collar Rib</td>
                  <td>Thick ribbed collar</td>
                  <td>Dry flat</td>
                  <td>Stays neat around the neck</td>
                </tr>
                <tr>
                  <td style="color: var(--theme-accent); font-weight: 700;">Printed Artwork</td>
                  <td>Large DTF print</td>
                  <td>Iron inside out only</td>
                  <td>Keeps colours bright</td>
                </tr>
                <tr>
                  <td style="color: var(--theme-accent); font-weight: 700;">Shoulder Drop Seams</td>
                  <td>Dropped shoulders, strong stitching</td>
                  <td>Fold, or use a wide hanger</td>
                  <td>The relaxed oversized fit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- 5. QUICK ACTIONS STRIP -->
        <div class="care-page-cta-strip">
          <div>
            <span class="figma-tag">[ NOT SURE OF YOUR SIZE? ]</span>
            <h3 style="font-family: var(--font-display); font-size: 1.8rem; color: #fff; margin: 0.35rem 0 0 0; letter-spacing: 1.5px; text-transform: uppercase;">FIND YOUR FIT</h3>
          </div>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <button type="button" onclick="window.BravadianStore.openSizeGuideModal();" class="btn-figma-primary" style="cursor: pointer;">
              <span>[ OPEN SIZE GUIDE ]</span>
            </button>
            <a href="#/shop" class="btn-figma-whatsapp" style="text-decoration: none;">
              <span>SHOP ALL DESIGNS →</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Checkout: one-tap delivery address (Swiggy-style), plus pincode -> city/state lookup.
  // Location goes only to OpenStreetMap's geocoder and India Post's pincode API; nothing is stored.
  function initLocationAssist() {
    const btn = document.getElementById('locBtn');
    if (!btn) return;
    const $ = id => document.getElementById(id);
    const hint = $('locHint'), card = $('locCard');
    const put = (id, v, force) => { const el = $(id); if (el && v && (force || !el.value.trim())) { el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.closest('.checkout-field')?.classList.remove('has-error'); } };
    const setBusy = (on, text) => { btn.classList.toggle('is-busy', on); btn.disabled = on; hint.textContent = text; };

    // Small map preview from OpenStreetMap tiles (3x3 around the point, zoom 16)
    const mapHTML = (lat, lon) => {
      const z = 16, n = 2 ** z;
      const fx = (lon + 180) / 360 * n;
      const fy = (1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n;
      const tx = Math.floor(fx), ty = Math.floor(fy);
      const px = Math.round((fx - tx) * 256) + 256, py = Math.round((fy - ty) * 256) + 256;
      let tiles = '';
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        tiles += `<img src="https://tile.openstreetmap.org/${z}/${tx + dx}/${ty + dy}.png" alt="" style="left:${(dx + 1) * 256}px;top:${(dy + 1) * 256}px" loading="lazy">`;
      }
      return `<div class="loc-map" aria-hidden="true"><div class="loc-tiles" style="left:calc(50% - ${px}px);top:calc(50% - ${py}px)">${tiles}</div><span class="loc-pin"></span><small class="loc-credit">&copy; OpenStreetMap</small></div>`;
    };

    const showCard = (lat, lon, a) => {
      const area = [a.road, a.neighbourhood || a.suburb].filter(Boolean).join(', ');
      const city = a.city || a.town || a.village || a.county || '';
      // Address text comes from OpenStreetMap, which anyone can edit: set it as text, never as HTML.
      card.innerHTML = `
        ${mapHTML(Number(lat), Number(lon))}
        <div class="loc-card-body">
          <span class="loc-card-kicker">DELIVERING TO</span>
          <b data-f="area"></b>
          <span data-f="place"></span>
          <button type="button" class="loc-change" id="locChange">Change</button>
        </div>`;
      card.querySelector('[data-f="area"]').textContent = area || city;
      card.querySelector('[data-f="place"]').textContent =
        [city, a.state].filter(Boolean).join(', ') + (a.postcode ? ` – ${a.postcode}` : '');
      card.hidden = false;
      const or = document.querySelector('.loc-or');
      if (or) or.hidden = true;
      $('locChange').onclick = () => { card.hidden = true; btn.hidden = false; if (or) or.hidden = false; $('chkAddress2').focus(); };
      btn.hidden = true;
    };

    btn.addEventListener('click', () => {
      if (!('geolocation' in navigator)) { hint.textContent = 'Location is not available on this device. Please type your address.'; return; }
      setBusy(true, 'Finding you…');
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        try {
          setBusy(true, 'Getting your address…');
          // OpenStreetMap's free lookup asks for few requests: reuse a result for the same spot (~10 m)
          const key = `bravadian_geo_${lat.toFixed(4)},${lon.toFixed(4)}`;
          let d = null;
          try { d = JSON.parse(sessionStorage.getItem(key)); } catch (e) { /* storage blocked */ }
          if (!d) {
            const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=en`,
              { signal: AbortSignal.timeout(10000) });
            if (r.status === 429) { setBusy(false, 'The address lookup is busy right now. Please type your address.'); return; }
            if (!r.ok) throw new Error(`lookup failed (${r.status})`);
            d = await r.json();
            try { sessionStorage.setItem(key, JSON.stringify(d)); } catch (e) { /* storage full or blocked */ }
          }
          const a = d.address || {};
          if (a.country_code && a.country_code !== 'in') { setBusy(false, 'We deliver within India only. Please type an Indian address.'); return; }
          put('chkAddress2', [a.road, a.neighbourhood || a.suburb].filter(Boolean).join(', '), true);
          put('chkCity', a.city || a.town || a.village || a.county, true);
          put('chkState', a.state, true);
          put('chkPincode', (a.postcode || '').replace(/\D/g, '').slice(0, 6), true);
          if (a.amenity || a.shop || a.building) put('chkLandmark', `Near ${a.amenity || a.shop || a.building}`);
          setBusy(false, 'Fills in your area, city, state and pincode');
          showCard(lat, lon, a);
          const flat = $('chkAddress1');
          flat.placeholder = 'Add your house / flat no. so the courier finds you';
          flat.focus();
        } catch (e) {
          setBusy(false, 'Could not fetch your address. Please type it below.');
        }
      }, (err) => {
        setBusy(false, err.code === 1 ? 'Location permission is off. Allow it in your browser, or type your address.' : 'Could not find your location. Please type your address.');
      }, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    });

    // Typing a 6-digit pincode fills city and state (India Post)
    const pin = $('chkPincode');
    let lastPin = '';
    pin.addEventListener('input', async () => {
      const v = pin.value.replace(/\D/g, '').slice(0, 6);
      if (pin.value !== v) pin.value = v;
      if (v.length !== 6 || v === lastPin) return;
      lastPin = v;
      try {
        const r = await fetch(`https://api.postalpincode.in/pincode/${v}`, { signal: AbortSignal.timeout(8000) });
        if (!r.ok) return;
        const [d] = await r.json();
        const po = d && d.Status === 'Success' && d.PostOffice && d.PostOffice[0];
        if (po && pin.value === v) { put('chkCity', po.District); put('chkState', po.State); }
      } catch (e) { /* offline or API down: the shopper types it */ }
    });
  }
  initLocationAssist();

  // Button focus: the amber camera frame from the headings glides to whichever button is pointed at
  // (hover on desktop, a short flash on tap for phones); the icon sharpens as it lands.
  function initIconFocus() {
    const SEL = '.btn-figma-primary, .btn-figma-whatsapp, .gr-btn, .bag-cta, .lab-pill, .lb-btn, .btn-universe-callout, .btn-canon-load-more, .btn-checkout-whatsapp, .loc-btn, .reel-all, [data-focus-icon]';
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const frame = document.createElement('span');
    frame.className = 'icon-frame';
    frame.setAttribute('aria-hidden', 'true');
    frame.innerHTML = '<i></i><i></i><i></i><i></i>';
    document.body.appendChild(frame);
    let current = null, flash = 0;
    const show = (el) => {
      const r = el.getBoundingClientRect(), pad = 6;
      const fresh = !frame.classList.contains('is-on');
      if (fresh || still) frame.classList.add('no-move');
      frame.style.left = `${r.left - pad}px`;
      frame.style.top = `${r.top - pad}px`;
      frame.style.width = `${r.width + pad * 2}px`;
      frame.style.height = `${r.height + pad * 2}px`;
      if (fresh || still) { void frame.offsetWidth; frame.classList.remove('no-move'); }
      frame.classList.add('is-on');
      if (current && current !== el) current.classList.remove('is-framed');
      current = el;
      el.classList.remove('is-framed'); void el.offsetWidth; el.classList.add('is-framed');
    };
    const hide = () => { frame.classList.remove('is-on'); if (current) current.classList.remove('is-framed'); current = null; };
    document.addEventListener('pointerover', (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target.closest(SEL);
      if (el) show(el);
    });
    document.addEventListener('pointerout', (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = e.target.closest(SEL);
      if (el && !(e.relatedTarget && el.contains(e.relatedTarget))) hide();
    });
    document.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return;
      const el = e.target.closest(SEL);
      if (!el) return;
      show(el);
      clearTimeout(flash);
      flash = setTimeout(hide, 550);
    }, { passive: true });
    window.addEventListener('scroll', () => { if (current) hide(); }, { passive: true });
  }
  initIconFocus();

  // Static WhatsApp links in index.html carry data-wa="<template>"
  document.querySelectorAll('a[data-wa]').forEach(a => {
    if (WA_MSG[a.dataset.wa] && typeof WA_MSG[a.dataset.wa] === 'string') a.href = waURL(WA_MSG[a.dataset.wa]);
  });

  // Global Store API export
  window.BravadianStore = {
    quickAdd(slug) {
      const product = window.BravadianDB.getProductBySlug(slug);
      if (!product) return;
      const color = product.colors[0];
      const availableSizes = getAvailableSizesForColor(product, color);
      if (availableSizes.length > 0) {
        if (addToCart(product, color, availableSizes[0], 1)) openCartDrawer();
      } else {
        window.location.hash = `#/product/${slug}`;
      }
    },
    requestVipEmbargo(productName) {
      const settings = window.BravadianDB.getSettings();
      window.open(waURL(WA_MSG.notify(productName)), '_blank');
    },
    updateCartItemQty,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    openQuickAdd,
    openSearchModal,
    closeSearchModal,
    openCheckoutModal,
    closeCheckoutModal,
    openSizeGuideModal,
    closeSizeGuideModal,
    showCartToast
  };

})();
