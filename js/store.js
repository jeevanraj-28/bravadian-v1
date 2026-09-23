/**
 * BRAVADIAN | BRAVE INDIAN — STOREFRONT CONTROLLER
 * Handles Routing, Catalog Rendering, PDP Variant Matrix,
 * Cart Management, Checkout Validation & WhatsApp Order Generation
 */

(function () {
  'use strict';

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
    } catch (e) {
      StoreState.cart = [];
    }
    updateCartUI();
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
    initHeaderEvents();
    initRouter();
    initSearchEvents();
  });

  /* --------------------------------------------------------------------------
     ROUTER
     -------------------------------------------------------------------------- */
  function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function handleRoute() {
    const hash = window.location.hash || '#/';
    StoreState.currentRoute = hash;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide top announcement marquee bar on Heritage collection chapter page (matches Figma full-bleed hero)
    const isHeritage = (hash === '#/collections/heritage' || hash === '#/heritage');
    document.body.classList.toggle('hide-announcement-bar', isHeritage);

    // Close any open drawers/modals on navigation
    closeCartDrawer();
    closeSearchModal();
    closeCheckoutModal();
    closeSizeGuideModal();

    if (hash === '#/' || hash === '#/home' || hash === '') {
      renderHomeView();
    } else if (hash === '#/collections' || hash === '#/collections/' || hash === '#/universe-wall') {
      renderUniverseWallView();
    } else if (hash === '#/collections/heritage' || hash === '#/heritage') {
      renderHeritageChapterView();
    } else if (hash.startsWith('#/collections/') || hash === '#/shop') {
      const parts = hash.split('/');
      let colSlug = parts[2] || 'all';
      // Temporarily active categories: ALL, HERITAGE, and GARUDA
      const ACTIVE_COLLECTIONS = ['all', 'heritage', 'garuda'];
      if (!ACTIVE_COLLECTIONS.includes(colSlug.toLowerCase())) {
        colSlug = 'all';
        if (hash.startsWith('#/collections/')) {
          window.location.hash = '#/collections';
          return;
        }
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
    } else if (hash === '#/about') {
      renderAboutView();
    } else if (hash === '#/contact') {
      renderContactView();
    } else if (hash.startsWith('#/policy/')) {
      const type = hash.replace('#/policy/', '');
      renderPolicyView(type);
    } else {
      renderShopView('all');
    }

    updateActiveNavLinks();
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

    // User requirement: Remove Universe Wall & ALL; only keep HERITAGE active and slash all others
    const filteredCollections = collections.filter(c => c.slug !== 'all');

    if (megaList) {
      megaList.innerHTML = filteredCollections.map(c => {
        const isLive = c.slug === 'heritage'; // Only keep heritage active!
        return `
          <li class="mega-item ${!isLive ? 'is-disabled' : ''}">
            ${isLive ? `
              <a href="#/collections/${c.slug}">
                <span>${c.name}</span>
                <span class="item-dot"></span>
              </a>
            ` : `
              <div class="mega-item-disabled" title="${c.name} — Unreleased Drop // Locked" aria-disabled="true">
                <span class="mega-item-name-slashed">
                  ${c.name}
                  <span class="mega-word-strike"></span>
                </span>
                <span class="mega-item-status">[SOON]</span>
              </div>
            `}
          </li>
        `;
      }).join('');
    }

    if (mobileList) {
      const collectionsData = [
        { name: 'HERITAGE', slug: 'heritage', isLive: true },
        { name: 'GARUDA', slug: 'garuda', isLive: false },
        { name: 'ASURA', slug: 'asura', isLive: false },
        { name: 'BERUNDA', slug: 'berunda', isLive: false },
        { name: 'CHOLA', slug: 'chola', isLive: false }
      ];

      mobileList.innerHTML = collectionsData.map(c => {
        if (c.isLive) {
          return `
            <li class="mobile-sub-item is-live">
              <a href="#/collections/${c.slug}" class="mobile-sub-anchor is-live">
                <span class="mobile-sub-dot"></span>
                <span class="mobile-sub-text">${c.name}</span>
              </a>
            </li>
          `;
        } else {
          return `
            <li class="mobile-sub-item is-slashed">
              <div class="mobile-sub-disabled" title="${c.name} — Unreleased Drop // Locked" aria-disabled="true">
                <span class="mobile-sub-slashed-name">${c.name}</span>
              </div>
            </li>
          `;
        }
      }).join('');
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
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) themeBtn.addEventListener('click', toggleThemeMode);

    const drawerThemeBtn = document.getElementById('mobileDrawerThemeBtn');
    if (drawerThemeBtn) drawerThemeBtn.addEventListener('click', toggleThemeMode);

    // Mobile Hamburger & Fullscreen Drawer
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileClose = document.getElementById('closeMobileNavBtn');

    function openMobileDrawer() {
      if (!mobileDrawer) return;
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
      
      mobileDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', closeMobileDrawer);
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
        const text = encodeURIComponent('Hi Bravadian, I have a question about your products.');
        window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
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
  function renderHomeView() {
    const products = window.BravadianDB.getProducts();
    // Get top 4 products for ROOTED IN STONE collection
    const featuredPieces = products.slice(0, 4);

    mainContainer.innerHTML = `
      <!-- HERO SECTION (Full-Width Hero Ready for Future Background Image) -->
      <section class="figma-hero-section">
        <!-- Ambient Grid & Atmosphere (Active when no image is loaded) -->
        <div class="hero-brutalist-bg" aria-hidden="true"></div>
        <div class="hero-ambient-amber" aria-hidden="true"></div>
        <div class="hero-watermark-bg" aria-hidden="true"><span>BRAVADIAN</span></div>

        <!-- Full-Width Background Media Layer (Ready for future custom image) -->
        <div class="hero-bg-media" id="heroBgMedia" role="img" aria-label="Bravadian Heavyweight Streetwear"></div>
        <div class="hero-overlay-gradient" aria-hidden="true"></div>

        <div class="container hero-container-inner">
          <div class="hero-content-row">
            <div class="hero-narrative-col">
              <div class="figma-hero-tag">
                <span class="hero-amber-dot"></span>
                <span>[ PRE-RELEASE DROP / PROTOCOL 01: HERITAGE ]</span>
              </div>

              <h1 class="figma-hero-title">
                WEAR YOUR<br>
                ROOTS LOUD
              </h1>

              <p class="figma-hero-desc">
                Engineered heavyweight silhouettes which forward Bharat culture into raw street context. Each piece woven and cut from 240 GSM organic cotton.
              </p>

              <div class="figma-hero-cta-wrap">
                <a href="#/shop" class="btn-figma-primary">
                  <span>[ VISIT THE VAULT ]</span>
                  <svg class="btn-vault-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
                <a href="https://wa.me/917975362526?text=Hi%20Bravadian,%20I%20want%20VIP%20Order%20access%20for%20Protocol%2001%20Heritage" target="_blank" rel="noopener noreferrer" class="btn-figma-whatsapp">
                  <svg class="btn-wa-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>WHATSAPP VIP ORDER</span>
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
            <span>CRAFTED IN INDIA</span> <span class="marquee-star">✦</span>
            <span>HEAVYWEIGHT 280 GSM FRENCH TERRY</span> <span class="marquee-star">✦</span>
            <span>300 NUMBERED EDITIONS ONLY</span> <span class="marquee-star">✦</span>
            <span>PRE-RELEASE VAULT ENGAGED</span> <span class="marquee-star">✦</span>
            <span>COD ON ACTIVATION</span> <span class="marquee-star">✦</span>
            <span>FAST WHATSAPP CHECKOUT</span> <span class="marquee-star">✦</span>
          </div>
          <div class="sub-marquee-content">
            <span>CRAFTED IN INDIA</span> <span class="marquee-star">✦</span>
            <span>HEAVYWEIGHT 280 GSM FRENCH TERRY</span> <span class="marquee-star">✦</span>
            <span>300 NUMBERED EDITIONS ONLY</span> <span class="marquee-star">✦</span>
            <span>PRE-RELEASE VAULT ENGAGED</span> <span class="marquee-star">✦</span>
            <span>COD ON ACTIVATION</span> <span class="marquee-star">✦</span>
            <span>FAST WHATSAPP CHECKOUT</span> <span class="marquee-star">✦</span>
          </div>
        </div>
      </div>

      <!-- ROOTED IN STONE COLLECTION SECTION -->
      <section class="rooted-stone-section">
        <div class="container">
          <div class="figma-section-header">
            <div class="section-header-left">
              <span class="figma-tag">— 01 / TOTAL RELICS COLLECTION</span>
              <h2 class="figma-section-title">ROOTED IN STONE</h2>
            </div>
            <div class="section-header-right">
              <p class="figma-section-narrative">
                Sacred architectural motifs derived from Halebidu and Belur friezes, translated onto engineered drop-shoulder silhouettes.
              </p>
            </div>
          </div>

          <div class="figma-product-grid">
            ${featuredPieces.map((p, idx) => {
              const badges = ['PRE-ORDER', 'NEW DROP', 'ARCHIVE', 'PRE-ORDER'];
              const badge = badges[idx] || 'ARCHIVE';
              const subtitles = [
                '240 GSM COMBED TEXTURED COTTON',
                '400 GSM FRENCH TERRY // OIL WASHED',
                '380 GSM HEAVYWEIGHT TERRY',
                'HEAVY CANVAS CHORE COAT'
              ];
              const subText = subtitles[idx] || (p.fabric ? `${p.fabric} // ${p.fit}` : '240 GSM // OVERSIZED');
              return `
                <div class="figma-product-card" data-slug="${p.slug}">
                  <div class="card-media-wrap" onclick="window.location.hash='#/product/${p.slug}'" role="button" aria-label="View ${p.name}">
                    <span class="card-relic-tag">[ RELIC 0${idx + 1} ]</span>
                    <span class="card-badge">[ ${badge} ]</span>
                    <img src="${p.images.front}" alt="${p.name}" class="card-relic-img" loading="lazy">
                  </div>
                  <div class="card-info-wrap">
                    <div class="card-title-col">
                      <h3 class="card-product-name" onclick="window.location.hash='#/product/${p.slug}'">${p.name}</h3>
                      <span class="card-product-sub">${subText}</span>
                    </div>
                    <div class="card-action-col">
                      <span class="card-product-price">₹${p.price.toLocaleString('en-IN')}</span>
                      <button type="button" class="btn-card-vault" onclick="event.stopPropagation(); window.BravadianStore.quickAdd('${p.slug}');">
                        <span>[ PRE-ORDER VAULT ]</span>
                        <svg class="btn-vault-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>

      <!-- THE BRAVADIAN MANIFESTO QUOTE SECTION (With Authentic Panoramic Architectural Heritage Relief) -->
      <section class="figma-manifesto-section" id="manifestoSection">
        <!-- Authentic Panoramic Heritage Architectural Backdrop (Light & Dark Theme Specific) -->
        <div class="manifesto-panoramic-wrap" aria-hidden="true">
          <img src="images/9c2cb80f-f7e1-49d7-9376-7675e99ade5b.png" alt="" class="manifesto-panoramic-img manifesto-bg-light manifesto-img-desktop" loading="eager">
          <img src="images/04e65c1f-818d-45d1-9bcd-dab3a04bcea5.png" alt="" class="manifesto-panoramic-img manifesto-bg-dark manifesto-img-desktop" loading="eager">
          <!-- Mobile Flanking Architecture (Temple Left, Celestial Maiden Right) -->
          <div class="manifesto-mobile-flank manifesto-mobile-flank-left" aria-hidden="true">
            <img src="images/9c2cb80f-f7e1-49d7-9376-7675e99ade5b.png" alt="" class="manifesto-bg-light" loading="eager">
            <img src="images/04e65c1f-818d-45d1-9bcd-dab3a04bcea5.png" alt="" class="manifesto-bg-dark" loading="eager">
          </div>
          <div class="manifesto-mobile-flank manifesto-mobile-flank-right" aria-hidden="true">
            <img src="images/9c2cb80f-f7e1-49d7-9376-7675e99ade5b.png" alt="" class="manifesto-bg-light" loading="eager">
            <img src="images/04e65c1f-818d-45d1-9bcd-dab3a04bcea5.png" alt="" class="manifesto-bg-dark" loading="eager">
          </div>
          <div class="manifesto-scrim-overlay"></div>
        </div>

        <!-- Left Side Editorial Ribbon -->
        <div class="manifesto-margin-left" aria-hidden="true">
          <div class="margin-star-wrap">
            <span class="margin-hairline-top"></span>
            <svg class="margin-star-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"/>
            </svg>
            <span class="margin-hairline-bottom"></span>
          </div>
          <span class="margin-vertical-text">ROOTED &nbsp;•&nbsp; REIMAGINED &nbsp;•&nbsp; BRAVADIAN &nbsp;•</span>
        </div>

        <!-- Right Side Editorial Ribbon -->
        <div class="manifesto-margin-right" aria-hidden="true">
          <div class="margin-star-wrap">
            <span class="margin-hairline-top"></span>
            <svg class="margin-star-icon" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z"/>
            </svg>
            <span class="margin-hairline-bottom"></span>
          </div>
          <span class="margin-vertical-text">BRAVADIAN &nbsp;•</span>
        </div>

        <!-- Center Editorial Content -->
        <div class="container manifesto-inner">
          <span class="manifesto-tag">[ THE BRAVADIAN MANIFESTO ]</span>
          <blockquote class="manifesto-quote">
            “WE CARVE THE FACE ON THE SHIRT MARK THAT SACRED ICONOGRAPHY RECONTEXTUALIZED AS MODERN INDIAN STREET ARMOR.”
          </blockquote>
          <div class="manifesto-divider">
            <span class="divider-line"></span>
            <span class="coordinates-label">— FOUNDATIONAL TRANSMISSION // 28°36'N 77°12'E —</span>
            <span class="divider-line"></span>
          </div>
        </div>

        <!-- Bottom Editorial Corners -->
        <div class="manifesto-bottom-row" aria-hidden="true">
          <div class="manifesto-corner-left">
            <span class="corner-brand-text">CULTURE &nbsp;&nbsp; WEARS &nbsp;&nbsp; FORWARD</span>
            <span class="corner-hairline"></span>
          </div>
          <div class="manifesto-corner-right">
            <span class="corner-subline">MORE THAN CLOTHING</span>
            <span class="corner-subline">A CONTINUUM</span>
          </div>
        </div>
      </section>

      <!-- THE TEN ARCHIVE SECTION -->
      <section class="figma-ten-archive-section">
        <div class="container">
          <div class="archive-section-header">
            <div class="archive-header-left">
              <span class="figma-tag">[ SYSTEM TAXONOMY // CHRONICLING SUB-CONTINENT ]</span>
              <h2 class="archive-title">THE TEN ARCHIVE</h2>
            </div>
            <div class="archive-header-right">
              <span class="archive-cadence">CHRONOLOGICAL CADENCE // NUMBERED EDITIONS</span>
            </div>
          </div>

          <div class="archive-cards-grid">
            ${(window.BravadianDB ? window.BravadianDB.getArchiveEditions() : []).map(card => {
              if (card.status === 'active') {
                return `
                  <a href="#/collections/${card.slug || 'all'}" class="archive-card status-active" data-edition="${card.num}">
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
                  <div class="archive-card status-next" data-edition="${card.num}" aria-disabled="true" role="region" aria-label="${card.title} - Upcoming Release">
                    <div class="archive-card-top">
                      <span class="archive-num">${card.num}</span>
                      <span class="archive-badge badge-next">NEXT</span>
                    </div>
                    <div class="archive-card-bottom">
                      <h3 class="archive-card-title">${card.title}</h3>
                      <span class="archive-card-desc">${card.desc}</span>
                    </div>
                  </div>
                `;
              } else {
                return `
                  <div class="archive-card status-vault" data-edition="${card.num}" aria-disabled="true" role="region" aria-label="${card.title} - Vault Unreleased">
                    <div class="archive-card-top">
                      <span class="archive-num">${card.num}</span>
                      <span class="archive-badge badge-vault">VAULT</span>
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

    bindProductCardActions();
  }

  /* --------------------------------------------------------------------------
     1.5 THE TEN UNIVERSE WALL VIEW (MATCHING FIGMA AUTO-LAYOUT SPEC)
     -------------------------------------------------------------------------- */
  /* --------------------------------------------------------------------------
     1.5 THE TEN ARCHIVE / COLLECTIONS OVERVIEW VIEW
     -------------------------------------------------------------------------- */
  function renderUniverseWallView() {
    const chapters = (window.BravadianDB && typeof window.BravadianDB.getUniverseChapters === 'function')
      ? window.BravadianDB.getUniverseChapters()
      : (window.DEFAULT_UNIVERSE_CHAPTERS || []);

    mainContainer.innerHTML = `
      <div class="collections-overview-page">
        <!-- THE TEN ARCHIVE SECTION (MATCHING SCREENSHOT AESTHETIC) -->
        <section class="figma-ten-archive-section collections-page-archive">
          <div class="container">
            <div class="archive-section-header">
              <div class="archive-header-left">
                <span class="figma-tag">[ SYSTEM TAXONOMY // CHRONICLING SUB-CONTINENT ]</span>
                <h1 class="archive-title">THE TEN ARCHIVE</h1>
              </div>
              <div class="archive-header-right">
                <span class="archive-cadence">CHRONOLOGICAL CADENCE // NUMBERED EDITIONS</span>
              </div>
            </div>

            <!-- 10 ARCHIVE CARDS GRID (NO DIAGRAMS, READY FOR SUPABASE IMAGES) -->
            <div class="archive-cards-grid">
              ${chapters.map(c => renderUniverseArchiveCard(c)).join('')}
            </div>
          </div>
        </section>

        <!-- PRIORITY VIP CONCIERGE CALLOUT SECTION -->
        <section class="universe-callout-section">
          <div class="universe-callout-container">
            <div class="universe-callout-badge">[ ARCHIVE DROP DISPATCH // PRIORITY CONCIERGE ]</div>
            <h3 class="universe-callout-heading">Authenticate your credentials to register for imminent vault drops and archived restocks.</h3>
            <div class="universe-callout-btn-wrap">
              <a href="https://wa.me/917975362526?text=Hi%20Bravadian%20Concierge,%20I%20would%20like%20to%20register%20for%20priority%20access%20to%20upcoming%20Universe%20chapter%20drops" target="_blank" rel="noopener noreferrer" class="btn-universe-callout">
                <svg class="btn-wa-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>REQUEST DIGITAL CERTIFICATION // VIP ACCESS</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    `;

    bindUniverseWallActions();
  }

  function renderUniverseArchiveCard(c) {
    const isLive = c.slug === 'heritage' || c.slug === 'garuda';
    const hasImage = !!c.image;

    if (isLive) {
      return `
        <a 
          href="#/collections/${c.slug}" 
          class="archive-card status-active universe-collection-card ${hasImage ? 'has-custom-img' : ''}" 
          data-slug="${c.slug}" 
          data-name="${c.name}"
          data-edition="${c.num}"
          title="${c.name} — ${c.chapter || c.desc} (Click to explore relics)"
        >
          ${hasImage ? `
            <div class="archive-card-bg-img" style="background-image: url('${c.image}');"></div>
            <div class="archive-card-bg-overlay"></div>
          ` : ''}
          <div class="archive-card-top">
            <span class="archive-num">${c.num}</span>
            <span class="archive-plus">+</span>
          </div>
          <div class="archive-card-bottom">
            <h3 class="archive-card-title">${c.name}</h3>
            <span class="archive-card-desc">${c.chapter || c.desc}</span>
          </div>
          <span class="archive-card-corner-pip" aria-hidden="true"></span>
        </a>
      `;
    } else {
      return `
        <div 
          class="archive-card status-vault universe-collection-card ${hasImage ? 'has-custom-img is-vault-blurred' : ''}" 
          data-slug="${c.slug}" 
          data-name="${c.name}" 
          data-edition="${c.num}"
          role="button"
          tabindex="0"
          title="${c.name} — ${c.chapter || c.desc} (Unreleased Drop // Click for VIP Access)"
          aria-label="${c.name} - Vault Unreleased"
        >
          ${hasImage ? `
            <div class="archive-card-bg-img is-vault-blurred" style="background-image: url('${c.image}');"></div>
            <div class="archive-card-bg-overlay"></div>
            <div class="frosted-crosshair-center" aria-hidden="true"></div>
          ` : ''}
          <div class="archive-card-top">
            <span class="archive-num">${c.num}</span>
            <span class="archive-badge badge-vault">VAULT</span>
          </div>
          <div class="archive-card-bottom">
            <h3 class="archive-card-title">${c.name}</h3>
            <span class="archive-card-desc">${c.chapter || c.desc}</span>
          </div>
        </div>
      `;
    }
  }

  function bindUniverseWallActions() {
    const vaultCards = document.querySelectorAll('.collections-page-archive .archive-card.status-vault');
    vaultCards.forEach(card => {
      const name = card.getAttribute('data-name');
      const handleAction = () => {
        if (window.BravadianStore && typeof window.BravadianStore.requestVipEmbargo === 'function') {
          window.BravadianStore.requestVipEmbargo(name);
        }
      };
      card.addEventListener('click', handleAction);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleAction();
        }
      });
    });
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
    // Fill up to 3 products if fewer than 3 heritage products in catalogue
    const displayProducts = heritageProducts.length >= 3 
      ? heritageProducts.slice(0, 3) 
      : [...heritageProducts, ...allProducts.filter(p => !heritageProducts.some(hp => hp.id === p.id))].slice(0, 3);

    mainContainer.innerHTML = `
      <div class="heritage-chapter-page">
        <!-- FULL-WIDTH HERO SECTION (Edge-to-Edge with Zero Side Gaps) -->
        <section class="heritage-hero-section">
          <div class="heritage-hero-backdrop" role="img" aria-label="Belur and Halebidu Temple Stone Relief"></div>
          <div class="heritage-hero-scrim" aria-hidden="true"></div>

          <div class="heritage-hero-inner">
            <div class="heritage-hero-foreground">
              <!-- Micro-Identity -->
              <div class="heritage-micro-identity">
                <span class="amber-dot-square" aria-hidden="true"></span>
                <span class="micro-identity-text">CH-01 // HOYSALA ARCHITECTURAL ARCHIVE</span>
              </div>

              <!-- Titles & CTA Row -->
              <div class="heritage-titles-cta-row">
                <div class="heritage-headline-group">
                  <h1 class="heritage-hero-title">HERITAGE</h1>
                  <p class="heritage-hero-desc">
                    Severe stone carvings translated into heavyweight street armor. An architectural manifest derived from ancient Belur and Halebidu temples.
                  </p>
                </div>

                <div class="heritage-cta-wrapper">
                  <button type="button" class="btn-discover-protocols" onclick="document.getElementById('heritageGarmentsSection').scrollIntoView({ behavior: 'smooth' })">
                    DISCOVER PROTOCOLS
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
                <span class="heritage-marker-text">01 / DECODED CIVILIZATIONAL MOTIFS</span>
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">CIVILIZATIONAL MOTIFS</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    Four codified temple artifacts meticulously vector-traced and screen-printed onto heavy cotton fibers. Every thread preserves a fragment of civilizational history.
                  </p>
                </div>
              </div>
            </div>

            <!-- Motifs Cards Row (4 Motifs) -->
            <div class="heritage-motifs-row">
              <!-- M-01 -->
              <article class="motif-card">
                <div class="motif-image-box">
                  <img src="images/heritage/motif-belur-salabhanjika.jpg" alt="Belur Salabhanjika stone carving bracket figure" class="motif-img" loading="lazy" />
                </div>
                <div class="motif-specs">
                  <div class="motif-title-badge">
                    <h3 class="motif-name">BELUR SALABHANJIKA</h3>
                    <span class="motif-code">M-01</span>
                  </div>
                  <p class="motif-caption">Angled bracket-figure detailing showcasing sacred symmetry.</p>
                </div>
              </article>

              <!-- M-02 -->
              <article class="motif-card">
                <div class="motif-image-box">
                  <img src="images/heritage/motif-halebidu-frieze.jpg" alt="Halebidu Frieze disciplined cavalry lines" class="motif-img" loading="lazy" />
                </div>
                <div class="motif-specs">
                  <div class="motif-title-badge">
                    <h3 class="motif-name">HALEBIDU FRIEZE</h3>
                    <span class="motif-code">M-02</span>
                  </div>
                  <p class="motif-caption">The relentless cavalry lines symbolizing eternal disciplined charge.</p>
                </div>
              </article>

              <!-- M-03 -->
              <article class="motif-card">
                <div class="motif-image-box">
                  <img src="images/heritage/motif-hoysala-crest.jpg" alt="Hoysala Crest warrior Sala slaying lion" class="motif-img" loading="lazy" />
                </div>
                <div class="motif-specs">
                  <div class="motif-title-badge">
                    <h3 class="motif-name">HOYSALA CREST</h3>
                    <span class="motif-code">M-03</span>
                  </div>
                  <p class="motif-caption">The legendary warrior Sala striking down the mythological beast.</p>
                </div>
              </article>

              <!-- M-04 -->
              <article class="motif-card">
                <div class="motif-image-box">
                  <img src="images/heritage/motif-kirtidhwaja-column.jpg" alt="Kirtidhwaja Column victory pillar relief" class="motif-img" loading="lazy" />
                </div>
                <div class="motif-specs">
                  <div class="motif-title-badge">
                    <h3 class="motif-name">KIRTIDHWAJA COLUMN</h3>
                    <span class="motif-code">M-04</span>
                  </div>
                  <p class="motif-caption">Pillars of architectural victory and mathematical precision.</p>
                </div>
              </article>
            </div>
          </section>

          <!-- SECTION 3: 02 / ENGINEERED PATTERNS // GARMENT ARTIFACTS -->
          <section class="heritage-section heritage-garments-section" id="heritageGarmentsSection">
            <div class="heritage-section-header">
              <div class="heritage-marker-row">
                <span class="heritage-line-indicator" aria-hidden="true"></span>
                <span class="heritage-marker-text">02 / ENGINEERED PATTERNS</span>
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">GARMENT ARTIFACTS</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    Severe street silhouettes forged in modern Indian cities, engineered with heavyweight 280 GSM to 420 GSM fibers for structural discipline.
                  </p>
                </div>
              </div>
            </div>

            <!-- Products Row (Mapped Dynamically from Shop DB) -->
            <div class="heritage-products-row">
              ${displayProducts.map((p, idx) => renderHeritageGarmentCard(p, idx, settings)).join('')}
            </div>
          </section>

          <!-- SECTION 4: 03 / CHROMATIC CODES // ARCHITECTURAL INK & DYE -->
          <section class="heritage-section heritage-swatches-section">
            <div class="heritage-section-header">
              <div class="heritage-marker-row">
                <span class="heritage-line-indicator" aria-hidden="true"></span>
                <span class="heritage-marker-text">03 / CHROMATIC CODES</span>
              </div>

              <div class="heritage-header-flex">
                <h2 class="heritage-section-title">ARCHITECTURAL INK & DYE</h2>
                <div class="heritage-desc-wrapper">
                  <p class="heritage-section-narrative">
                    The dark monochrome spectrum of ancient temple ruins. Ground earth pigments, processed charcoal, and minerals applied through high-density screen printing.
                  </p>
                </div>
              </div>
            </div>

            <!-- Swatch Strip (5 Swatches) -->
            <div class="heritage-swatches-row">
              <!-- Swatch 1: ASH TEMPLE BLACK -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #0E0E0E;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">ASH TEMPLE BLACK</span>
                  <span class="swatch-hex">#0E0E0E</span>
                  <span class="swatch-info">Charcoal base replicating weathered stone shadows.</span>
                </div>
              </div>

              <!-- Swatch 2: BELUR STONE GREY -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #6B6A69;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">BELUR STONE GREY</span>
                  <span class="swatch-hex">#6B6A69</span>
                  <span class="swatch-info">Muted mid-tone mimicking ancient architectural pillars.</span>
                </div>
              </div>

              <!-- Swatch 3: SALA MADDER RED -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #801212;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">SALA MADDER RED</span>
                  <span class="swatch-hex">#801212</span>
                  <span class="swatch-info">A rare, deep volcanic red taken from mythic standard flags.</span>
                </div>
              </div>

              <!-- Swatch 4: VAULT AMBER DUST -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #FFA000;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">VAULT AMBER DUST</span>
                  <span class="swatch-hex">#FFA000</span>
                  <span class="swatch-info">The bright highlight of oil lamps reflecting on stone.</span>
                </div>
              </div>

              <!-- Swatch 5: HALEBIDU SILT CREAM -->
              <div class="swatch-card">
                <div class="swatch-color-block" style="background-color: #E5E2E1;"></div>
                <div class="swatch-details">
                  <span class="swatch-title">HALEBIDU SILT CREAM</span>
                  <span class="swatch-hex">#E5E2E1</span>
                  <span class="swatch-info">The warm mineral deposit dust settling over centuries.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderHeritageGarmentCard(p, idx, settings) {
    const relicTag = p.relicTag || `RELIC 0${idx + 1}`;
    const badgeText = p.isComingSoon ? 'COMING SOON' : (p.relicBadge || 'PRE-ORDER ACTIVE');
    const fabricText = p.fabric || '280 GSM COMBED COTTON // ARCHIVAL EMBROIDERY';
    const priceFormatted = `${settings.currency || '₹'}${p.price.toLocaleString('en-IN')}`;

    return `
      <article 
        class="heritage-product-card" 
        onclick="window.location.hash='#/product/${p.slug}'" 
        role="button" 
        tabindex="0"
        aria-label="View ${p.name}"
      >
        <div class="heritage-card-image-box">
          <img src="${p.images.front}" alt="${p.name} — Bravadian Streetwear" class="heritage-card-product-img" loading="lazy" />
          <div class="heritage-badge-pill">${relicTag}</div>
        </div>
        <div class="heritage-card-specs">
          <div class="heritage-card-title-row">
            <h3 class="heritage-card-product-name">${p.name}</h3>
            <span class="heritage-card-price">${priceFormatted}</span>
          </div>
          <div class="heritage-card-sub-row">
            <span class="heritage-card-fabric" title="${fabricText}">${fabricText}</span>
            <span class="heritage-indicator-tag">${badgeText}</span>
          </div>
        </div>
      </article>
    `;
  }

  /* --------------------------------------------------------------------------
     2. SHOP & COLLECTION VIEW
     -------------------------------------------------------------------------- */
  function renderShopView(colSlug = 'all') {
    const collections = window.BravadianDB.getCollections();
    const activeCol = collections.find(c => c.slug === colSlug) || { 
      name: 'THE CANON CATALOGUE', 
      description: 'Browse and secure your relics from our structural multi-chapter manifest. Every garment is heavily engineered and strictly numbered.' 
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
            <span class="eyebrow-text">STREET ARMOR DIVISION // FULL SPECS</span>
          </div>
          <h1 class="canon-main-title">THE CANON CATALOGUE</h1>
          <p class="canon-sub-desc">
            Browse and secure your relics from our structural multi-chapter manifest. Every garment is heavily engineered and strictly numbered.
          </p>
        </header>

        <!-- Chapter Filter Pills & Controls Bar -->
        <nav class="canon-filter-toolbar" aria-label="Archive Collection Filters">
          <!-- Chapter Tabs Pills -->
          <div class="canon-tabs-group" role="tablist">
            ${collections.map(c => {
              // Active categories: ALL, HERITAGE, GARUDA
              const isAvailable = c.slug === 'all' || c.slug === 'heritage' || c.slug === 'garuda';
              const isSlashed = !isAvailable;
              const isActive = c.slug === colSlug;

              if (isSlashed) {
                return `
                  <span 
                    class="canon-tab-pill is-slashed is-disabled" 
                    role="tab"
                    aria-disabled="true"
                    title="${c.name} — Unreleased Drop // Locked"
                    tabindex="-1"
                  >
                    <span class="pill-text">
                      ${c.name}
                      <span class="pill-word-strike" aria-hidden="true"></span>
                    </span>
                  </span>
                `;
              }

              return `
                <a 
                  href="#/collections/${c.slug}" 
                  class="canon-tab-pill ${isActive ? 'active' : ''}" 
                  role="tab"
                  aria-selected="${isActive ? 'true' : 'false'}"
                  title="${c.name}"
                >
                  <span class="pill-text">
                    ${c.name}
                  </span>
                </a>
              `;
            }).join('')}
          </div>

          <!-- Right Status & Filter Controls -->
          <div class="canon-toolbar-right">
            <span class="canon-index-status">
              ACTIVE INDEXED ARTIFACTS: <strong class="canon-count-badge">[${formattedCount} // 100]</strong>
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
          <div class="canon-product-grid">
            ${displayedProducts.map((p, idx) => renderProductCardHTML(p, idx)).join('')}
          </div>

          <!-- Bottom Pagination / Load More (Locked for now) -->
          <div class="canon-load-more-wrap">
            <button 
              type="button" 
              class="btn-canon-load-more is-vault-locked" 
              id="canonLoadMoreBtn"
              disabled
              title="Page 2 Archive is currently locked in vault"
              aria-disabled="true"
            >
              <span class="lock-icon" style="margin-right: 8px;">🔒</span>
              <span>SYSTEM ARCHIVE ARCHETECH [PAGE 2] // LOCKED</span>
            </button>
          </div>
        ` : `
          <div class="canon-empty-state">
            <div class="empty-state-icon">⚡</div>
            <h3 class="empty-state-title">NO ARTIFACTS FOUND</h3>
            <p class="empty-state-sub">Try clearing size filters or explore another canon chapter.</p>
            <a href="#/collections/all" class="btn-canon-load-more" style="display: inline-block;">RESET ALL FILTERS</a>
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

    // Load More Page 2 Listener (Locked for now)
    const loadMoreBtn = document.getElementById('canonLoadMoreBtn');
    if (loadMoreBtn && !loadMoreBtn.classList.contains('is-vault-locked')) {
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
  function renderProductCardHTML(product, idx = 0) {
    const isOutOfStock = !product.variants || product.variants.every(v => v.stock === 0);
    const settings = window.BravadianDB.getSettings();
    const relicTag = product.relicTag || `RELIC 0${(idx % 6) + 1}`;
    const isLocked = product.isComingSoon === true;
    const relicBadge = isLocked ? 'COMING SOON' : (product.relicBadge || (product.newDrop ? 'PRE-ORDER ACTIVATED' : 'ARCHIVAL RUN'));
    const fabricSpec = product.fabric || '240 GSM INTERLOCK // 100% COMBED COTTON';

    if (isLocked) {
      return `
        <article class="canon-product-card is-vault-locked" data-slug="${product.slug}">
          <!-- Media Container with Subtle Frosted Blur (No Text Overlay) -->
          <div 
            class="canon-card-media is-vault-media" 
            onclick="window.BravadianStore.requestVipEmbargo('${product.name}')" 
            role="button" 
            tabindex="0"
            aria-label="${product.name} — Coming Soon"
          >
            <span class="canon-card-tag">[ ${relicTag} // COMING SOON ]</span>
            <img 
              src="${product.images.front}" 
              alt="${product.name} — Bravadian Streetwear" 
              class="canon-card-img is-vault-blurred" 
              loading="lazy"
            >
            <!-- Minimal Subtle Frosted Glass Overlay with Delicate Crosshair (No Text) -->
            <div class="subtle-frosted-overlay" aria-hidden="true">
              <span class="frosted-crosshair-center"></span>
            </div>
          </div>

          <!-- Product Card Meta & Details -->
          <div class="canon-card-info">
            <div class="canon-card-header">
              <h3 
                class="canon-card-title is-locked-title" 
                onclick="window.BravadianStore.requestVipEmbargo('${product.name}')"
              >
                ${product.name}
              </h3>
              <div class="canon-card-price canon-card-price-locked">
                ${settings.currency}${product.price.toLocaleString('en-IN')}
              </div>
            </div>

            <!-- Specs Row -->
            <div class="canon-specs-row">
              <span class="canon-fabric-text">${fabricSpec}</span>
              <span class="canon-badge-pill canon-badge-locked">[ COMING SOON ]</span>
            </div>

            <!-- Action Button -->
            <div class="canon-card-action">
              <button 
                type="button" 
                class="btn-canon-archive btn-canon-locked" 
                onclick="event.stopPropagation(); window.BravadianStore.requestVipEmbargo('${product.name}');"
                aria-label="Coming Soon — ${product.name}"
              >
                <span>[ COMING SOON ]</span>
              </button>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="canon-product-card" data-slug="${product.slug}">
        <!-- Media Container -->
        <div 
          class="canon-card-media" 
          onclick="window.location.hash='#/product/${product.slug}'" 
          role="button" 
          tabindex="0"
          aria-label="View ${product.name}"
        >
          <span class="canon-card-tag">[ ${relicTag} ]</span>
          <img 
            src="${product.images.front}" 
            alt="${product.name} — Bravadian Streetwear" 
            class="canon-card-img" 
            loading="lazy"
          >
        </div>

        <!-- Product Card Meta & Details -->
        <div class="canon-card-info">
          <div class="canon-card-header">
            <h3 
              class="canon-card-title" 
              onclick="window.location.hash='#/product/${product.slug}'"
            >
              ${product.name}
            </h3>
            <div class="canon-card-price">
              ${settings.currency}${product.price.toLocaleString('en-IN')}
            </div>
          </div>

          <!-- Specs Row -->
          <div class="canon-specs-row">
            <span class="canon-fabric-text">${fabricSpec}</span>
            <span class="canon-badge-pill">[ ${relicBadge} ]</span>
          </div>

          <!-- Action Button -->
          <div class="canon-card-action">
            <button 
              type="button" 
              class="btn-canon-archive" 
              onclick="event.stopPropagation(); window.BravadianStore.quickAdd('${product.slug}');"
              aria-label="Add ${product.name} to archive bag"
            >
              <span>ADD TO ARCHIVE // +</span>
            </button>
          </div>
        </div>
      </article>
    `;
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
  function renderPDPView(slug) {
    let product = window.BravadianDB.getProductBySlug(slug);
    if (!product) {
      product = window.BravadianDB.getProductBySlug('hoysala-oversized-relic-tee') || window.BravadianDB.getProducts()[0];
      if (!product) {
        renderShopView('all');
        return;
      }
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
        return window.BravadianDefaults.createTeeSVG(product.name, product.collection || 'Heritage', '#111116', '#FFA000', view);
      }
      return '';
    };

    const thumb1 = pImages.front || getDiagram('front');
    const thumb2 = pImages.back || getDiagram('back');
    const thumb3 = pImages.closeup || getDiagram('closeup');
    const mainHero = thumb1;

    const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    const accordions = [
      {
        num: '01',
        title: 'THE STORY',
        content: 'A homage to the 12th-century Hoysala dynasty. The print layout mirrors the friezes of Halebidu temple complex, engineered to scale with the shoulder drapery.'
      },
      {
        num: '02',
        title: 'MOTIF DECODE',
        content: 'Features the sacred double-headed Berunda and charging temple elephants. Every motif is redrawn from hand-inked archives and silkscreened on textured cotton.'
      },
      {
        num: '03',
        title: 'FABRIC & PRINT',
        content: `${product.fabric || '280 GSM premium long-staple Indian cotton'}. Loop-back French Terry structure. Low-impact organic active dyes.`
      },
      {
        num: '04',
        title: 'ARCHIVAL CUSTODY',
        content: 'Washing should be conducted inside out at cold temperatures. Line dry only in natural shade. Avoid mechanical heat exposure to protect the high-density puff print.'
      },
      {
        num: '05',
        title: 'VAULT DISPATCH & RETURNS',
        content: 'Dispatched globally from our Bengaluru node. Covered by our 7-day tactical archive verification window. Returns accepted only if security tags are intact.'
      }
    ];

    const relatedRelics = [
      {
        badge: 'RELIC 02',
        name: 'HOYSALA LINGESHWARA RELIC TEE',
        price: 3200,
        slug: 'hoysala-lingeshwara-relic-tee'
      },
      {
        badge: 'RELIC 03',
        name: 'SRI YOGA SARASVATHESHWARA TEE',
        price: 3600,
        slug: 'sri-yoga-sarasvatheshwara-tee'
      },
      {
        badge: 'RELIC 04',
        name: 'NRITYA PRIMACY DESCENSION JACKET',
        price: 6500,
        slug: 'nritya-primacy-descension-jacket'
      }
    ].map(item => {
      const relProd = window.BravadianDB.getProductBySlug(item.slug);
      const img = (relProd && relProd.images && relProd.images.front)
        ? relProd.images.front
        : (window.BravadianDefaults ? window.BravadianDefaults.createTeeSVG(item.name, 'Heritage', '#111116', '#FFA000', 'front') : '');
      return {
        ...item,
        name: relProd ? relProd.name : item.name,
        price: relProd ? relProd.price : item.price,
        badge: relProd ? (relProd.relicTag || item.badge) : item.badge,
        image: img
      };
    });

    const gateways = [
      {
        num: '02',
        title: 'GARUDA',
        chapter: 'CHAPTER 02: SOVEREIGN SKY',
        collection: 'garuda'
      },
      {
        num: '03',
        title: 'ASURA',
        chapter: 'CHAPTER 03: SOLAR SHADOWS',
        collection: 'asura'
      },
      {
        num: '04',
        title: 'BERUNDA',
        chapter: 'CHAPTER 04: DOUBLE VISION',
        collection: 'berunda'
      }
    ].map(gw => {
      const colProd = window.BravadianDB.getProducts({ collection: gw.collection })[0];
      const gImg = (colProd && colProd.images && colProd.images.front)
        ? colProd.images.front
        : (window.BravadianDefaults ? window.BravadianDefaults.createTeeSVG(gw.title, gw.collection, '#121216', '#FFA000', 'front') : '');
      return {
        ...gw,
        image: gImg
      };
    });

    mainContainer.innerHTML = `
      <div class="pdp-figma-layout">
        <!-- SECTION - PRODUCT MAIN BRIEF -->
        <section class="pdp-brief-section">
          <!-- Column-Media -->
          <div class="pdp-media-col">
            <div class="pdp-main-frame ${product.isComingSoon ? 'is-vault-media' : ''}">
              <img src="${mainHero}" alt="${product.name}" id="pdpFigmaMainImg" class="pdp-main-photo ${product.isComingSoon ? 'is-vault-blurred' : ''}">
              ${product.isComingSoon ? `
                <div class="subtle-frosted-overlay" aria-hidden="true">
                  <span class="frosted-crosshair-center"></span>
                </div>
              ` : ''}
            </div>

            <div class="pdp-thumbs-row">
              <div class="pdp-thumb-card active" data-img="${thumb1}" role="button" tabindex="0" title="Front Architectural View">
                <img src="${thumb1}" alt="Front Architectural View" class="pdp-thumb-img">
              </div>
              <div class="pdp-thumb-card" data-img="${thumb2}" role="button" tabindex="0" title="Technical Rear View">
                <img src="${thumb2}" alt="Technical Rear Typography" class="pdp-thumb-img">
              </div>
              <div class="pdp-thumb-card" data-img="${thumb3}" role="button" tabindex="0" title="Fabric Specimen View">
                <img src="${thumb3}" alt="Macro Fabric loops" class="pdp-thumb-img">
              </div>
            </div>
          </div>

          <!-- Column-Specifications -->
          <div class="pdp-specs-col">
            <!-- Header Eyebrow -->
            <div class="pdp-eyebrow-row">
              <span class="pdp-amber-dot"></span>
              <span class="pdp-eyebrow-text">${(product.collection || 'HERITAGE').toUpperCase()} COLLECTION // CHAPTER 01</span>
            </div>

            <!-- Title -->
            <h1 class="pdp-figma-title">${product.name}</h1>

            <!-- Price -->
            <div class="pdp-figma-price">${settings.currency}${product.price.toLocaleString('en-IN')}</div>

            <!-- Description -->
            <p class="pdp-figma-desc">${product.description}</p>

            <!-- Size Selection -->
            <div class="pdp-size-section">
              <div class="pdp-size-header">
                <span class="pdp-size-label">SELECT SPECIFICATION (SIZE)</span>
                <button type="button" class="pdp-size-guide-btn" id="pdpSizeGuideTrigger">SIZE GUIDE</button>
              </div>
              <div class="pdp-size-matrix" id="pdpSizeMatrix">
                ${allSizes.map(sz => `
                  <button type="button" class="pdp-size-box ${sz === StoreState.selectedSize ? 'active' : ''}" data-size="${sz}">
                    ${sz}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Add to Bag CTA -->
            <div class="pdp-cta-wrap">
              <button type="button" class="pdp-cta-btn ${product.isComingSoon ? 'is-coming-soon' : ''}" id="pdpCtaBtn">
                ${product.isComingSoon ? `[ COMING SOON ]` : `ADD TO ARCHIVE BAG — ${settings.currency}${product.price.toLocaleString('en-IN')}`}
              </button>
              <div class="pdp-cta-subtext">
                ✦ SECURE ENCRYPTED PROTOCOL // DISPATCHED IN 48 HOURS // NUMBERED AUTHENTICITY CHIP INCLUDED
              </div>
            </div>

            <!-- Line Divider -->
            <div class="pdp-figma-divider"></div>

            <!-- 5 Specification Accordions -->
            <div class="pdp-accordion-group">
              ${accordions.map((acc, i) => `
                <div class="pdp-accordion-item ${i === 0 ? 'is-open' : ''}" data-index="${i}">
                  <button type="button" class="pdp-accordion-header" aria-expanded="${i === 0 ? 'true' : 'false'}">
                    <span class="pdp-accordion-title">${acc.num} // ${acc.title}</span>
                    <span class="pdp-accordion-icon">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#FFA000" stroke-width="2">
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
                <span class="pdp-section-eyebrow-text">02 / ARCHIVE RE-ROUTING</span>
              </div>
              <h2 class="pdp-section-heading">MORE FROM THE ${(product.collection || 'HERITAGE').toUpperCase()} UNIVERSE</h2>
            </div>
            <div class="pdp-section-header-tag">CHAPTER 01 MANIFESTED SHAPES</div>
          </div>

          <div class="pdp-relics-grid">
            ${relatedRelics.map(item => `
              <article class="pdp-relic-card" data-slug="${item.slug}">
                <div class="pdp-relic-badge">${item.badge}</div>
                <div class="pdp-relic-img-wrap">
                  <img src="${item.image}" alt="${item.name}" class="pdp-relic-img">
                </div>
                <div class="pdp-relic-specs">
                  <div class="pdp-relic-row-top">
                    <h3 class="pdp-relic-name">${item.name}</h3>
                    <span class="pdp-relic-price">${settings.currency}${item.price.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="pdp-relic-row-bottom">
                    <span class="pdp-relic-material">280 GSM COMBED TEXTURED COTTON</span>
                    <span class="pdp-relic-status">PRE-ORDER ACTIVE</span>
                  </div>
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- SECTION - NEIGHBOURING UNIVERSES -->
        <section class="pdp-gateways-section">
          <div class="pdp-section-header">
            <div class="pdp-section-title-group">
              <div class="pdp-section-eyebrow">
                <span class="pdp-line-indicator"></span>
                <span class="pdp-section-eyebrow-text">03 / DIMENSIONAL GATEWAYS</span>
              </div>
              <h2 class="pdp-section-heading">DISCOVER NEIGHBOURING UNIVERSES</h2>
            </div>
            <div class="pdp-section-header-tag">MULTI-CHAPTER MANIFEST</div>
          </div>

          <div class="pdp-gateways-grid">
            ${gateways.map(gw => `
              <div class="pdp-gateway-card" data-collection="${gw.collection}">
                <div class="pdp-gateway-bg" style="background-image: url('${gw.image}');"></div>
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
    const thumbCards = document.querySelectorAll('.pdp-thumb-card');
    thumbCards.forEach(tc => {
      tc.addEventListener('click', () => {
        thumbCards.forEach(c => c.classList.remove('active'));
        tc.classList.add('active');
        const targetSrc = tc.getAttribute('data-img');
        if (mainImg && targetSrc) {
          mainImg.style.opacity = '0.4';
          setTimeout(() => {
            mainImg.src = targetSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }
      });
    });

    // 2. Size Matrix Selection
    const sizeBoxes = document.querySelectorAll('.pdp-size-box');
    sizeBoxes.forEach(sb => {
      sb.addEventListener('click', () => {
        sizeBoxes.forEach(b => b.classList.remove('active'));
        sb.classList.add('active');
        StoreState.selectedSize = sb.getAttribute('data-size');
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
        addToCart(product, StoreState.selectedColor, StoreState.selectedSize, 1);
        openCartDrawer();
      });
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

  function getAvailableSizesForColor(product, color) {
    if (!product || !product.variants) return [];
    return product.variants
      .filter(v => v.color.toLowerCase() === color.toLowerCase() && v.stock > 0)
      .map(v => v.size);
  }

  function renderSizePills() {
    const product = StoreState.currentProduct;
    const sizeList = document.getElementById('pdpSizeList');
    const addBtn = document.getElementById('addToCartBtn');
    const badge = document.getElementById('pdpStockBadge');
    if (!product || !sizeList) return;

    const allSizes = ['S', 'M', 'L', 'XL', 'XXL'];

    sizeList.innerHTML = allSizes.map(size => {
      const stock = getVariantStock(product, StoreState.selectedColor, size);
      const isAvailable = stock > 0;
      const isSelected = size === StoreState.selectedSize && isAvailable;

      return `
        <button 
          type="button" 
          class="size-pill-btn ${!isAvailable ? 'disabled' : ''} ${isSelected ? 'active' : ''}" 
          data-size="${size}"
          ${!isAvailable ? 'disabled title="Sold Out"' : ''}
        >
          ${size}
        </button>
      `;
    }).join('');

    // Re-bind size clicks
    const sizeBtns = sizeList.querySelectorAll('.size-pill-btn:not(.disabled)');
    sizeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sizeList.querySelectorAll('.size-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        StoreState.selectedSize = btn.getAttribute('data-size');
        updatePDPButtonState();
      });
    });

    updatePDPButtonState();
  }

  function updatePDPButtonState() {
    const product = StoreState.currentProduct;
    const addBtn = document.getElementById('addToCartBtn');
    const badge = document.getElementById('pdpStockBadge');
    const stock = getVariantStock(product, StoreState.selectedColor, StoreState.selectedSize);

    if (stock > 0) {
      if (addBtn) {
        addBtn.disabled = false;
        addBtn.querySelector('span').textContent = 'ADD TO CART';
      }
      if (badge) {
        badge.className = 'card-status-indicator available';
        badge.textContent = stock <= 3 ? `ONLY ${stock} LEFT` : 'IN STOCK';
      }
    } else {
      if (addBtn) {
        addBtn.disabled = true;
        addBtn.querySelector('span').textContent = 'VARIANT SOLD OUT';
      }
      if (badge) {
        badge.className = 'card-status-indicator sold-out';
        badge.textContent = 'SOLD OUT';
      }
    }
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
    const imgSrc = (product.images && product.images.front) ? product.images.front : (product.image || 'images/logo.png');

    toast.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" class="cart-toast-thumb">
      <div class="cart-toast-body">
        <span class="cart-toast-tag">ADDED TO CART</span>
        <div class="cart-toast-title">${product.name}</div>
        <div class="cart-toast-meta">${size} // ${color} • ${settings.currency || '₹'}${product.price.toLocaleString('en-IN')} (x${qty})</div>
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

  function addToCart(product, color, size, qty = 1) {
    const existingIdx = StoreState.cart.findIndex(
      item => item.productId === product.id && item.color === color && item.size === size
    );

    if (existingIdx >= 0) {
      StoreState.cart[existingIdx].quantity += qty;
    } else {
      StoreState.cart.push({
        id: `${product.id}-${color}-${size}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        collection: product.collection,
        color: color,
        size: size,
        quantity: qty,
        image: product.images.front
      });
    }

    saveCart();
    triggerCartBadgePulse();
    showCartToast(product, color, size, qty);
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

  function updateCartUI() {
    // Badges in Header
    const totalCount = StoreState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('.cart-badge-count');
    badges.forEach(b => {
      b.textContent = totalCount;
      if (b.closest('.header-bag-btn')) {
        b.style.display = 'inline';
      } else {
        b.style.display = totalCount > 0 ? 'flex' : 'none';
      }
    });

    // Populate Drawer
    const drawerList = document.getElementById('cartDrawerItems');
    const drawerSubtotal = document.getElementById('drawerSubtotal');
    const drawerShipping = document.getElementById('drawerShipping');
    const drawerTotal = document.getElementById('drawerTotal');
    const checkoutBtn = document.getElementById('drawerCheckoutBtn');

    const { subtotal, shipping, total, settings } = calculateCartTotals();

    if (drawerSubtotal) drawerSubtotal.textContent = `${settings.currency}${subtotal.toLocaleString('en-IN')}`;
    if (drawerShipping) drawerShipping.textContent = shipping === 0 ? 'FREE' : `${settings.currency}${shipping}`;
    if (drawerTotal) drawerTotal.textContent = `${settings.currency}${total.toLocaleString('en-IN')}`;

    if (drawerList) {
      if (StoreState.cart.length === 0) {
        drawerList.innerHTML = `
          <div class="empty-state-box" style="padding: 4rem 1rem;">
            <div class="empty-state-icon empty-vault-icon" aria-hidden="true">
              <svg class="vault-icon-svg" width="60" height="60" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M24 4L42 12V24C42 34 34 41 24 44C14 41 6 34 6 24V12L24 4Z" stroke="#FFA000" stroke-width="1.8" fill="rgba(255, 160, 0, 0.08)"/>
                <path d="M17 32V23C17 19.13 20.13 16 24 16C27.87 16 31 19.13 31 23V32" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="24" cy="24" r="3" fill="#FFA000"/>
                <path d="M24 27V30" stroke="#FFA000" stroke-width="2"/>
              </svg>
            </div>
            <h4 class="empty-state-title">YOUR VAULT IS EMPTY</h4>
            <p class="empty-state-sub">240 GSM architectural silhouettes are waiting in the drop.</p>
            <a href="#/shop" class="btn-figma-primary btn-vault-action" onclick="window.BravadianStore.closeCartDrawer();">
              <span>[ EXPLORE THE DROP ]</span>
              <svg class="btn-vault-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        `;
        if (checkoutBtn) checkoutBtn.style.display = 'none';
      } else {
        if (checkoutBtn) checkoutBtn.style.display = 'inline-flex';
        drawerList.innerHTML = StoreState.cart.map(item => `
          <div class="cart-item-row">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb">
            <div class="cart-item-body">
              <h4 class="cart-item-name">${item.name}</h4>
              <div class="cart-item-meta">${item.color} / SIZE ${item.size}</div>
              <div class="cart-item-actions">
                <div class="qty-control" style="transform: scale(0.85); transform-origin: left center;">
                  <button type="button" class="qty-btn" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity - 1})">-</button>
                  <span class="qty-display">${item.quantity}</span>
                  <button type="button" class="qty-btn" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity + 1})">+</button>
                </div>
                <span class="cart-item-price">${settings.currency}${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                <button type="button" class="cart-remove-btn" onclick="window.BravadianStore.removeFromCart('${item.id}')">REMOVE</button>
              </div>
            </div>
          </div>
        `).join('');
      }
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
    const { subtotal, shipping, total, settings } = calculateCartTotals();

    if (StoreState.cart.length === 0) {
      mainContainer.innerHTML = `
        <div class="container" style="padding: 8rem 2rem;">
          <div class="empty-state-box">
            <div class="empty-state-icon empty-vault-icon" aria-hidden="true">
              <svg class="vault-icon-svg" width="72" height="72" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M24 4L42 12V24C42 34 34 41 24 44C14 41 6 34 6 24V12L24 4Z" stroke="#FFA000" stroke-width="1.8" fill="rgba(255, 160, 0, 0.08)"/>
                <path d="M17 32V23C17 19.13 20.13 16 24 16C27.87 16 31 19.13 31 23V32" stroke="currentColor" stroke-width="1.6"/>
                <circle cx="24" cy="24" r="3" fill="#FFA000"/>
                <path d="M24 27V30" stroke="#FFA000" stroke-width="2"/>
              </svg>
            </div>
            <h2 class="empty-state-title">YOUR VAULT IS EMPTY</h2>
            <p class="empty-state-sub">Discover unreleased 240 GSM architectural silhouettes in the collection archive.</p>
            <a href="#/shop" class="btn-figma-primary btn-vault-action">
              <span>[ EXPLORE THE DROP ]</span>
              <svg class="btn-vault-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      `;
      return;
    }

    mainContainer.innerHTML = `
      <div class="container" style="padding: 7rem 2rem;">
        <div class="shop-headline-block" style="text-align: left; margin-bottom: 2.5rem;">
          <span class="shop-pill-tag">[ YOUR ORDER ARCHIVE ]</span>
          <h1 class="shop-main-title" style="font-size: 2.5rem;">SHOPPING CART</h1>
        </div>

        <div style="display: grid; grid-template-columns: 1.8fr 1fr; gap: 3rem;">
          <!-- Item List -->
          <div>
            ${StoreState.cart.map(item => `
              <div class="cart-item-row" style="padding: 1.5rem 0;">
                <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 125px; object-fit: contain; background: #08080c; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px;">
                <div class="cart-item-body" style="padding-left: 1rem;">
                  <h3 class="cart-item-name" style="font-size: 1.4rem;">${item.name}</h3>
                  <div class="cart-item-meta" style="font-size: 0.85rem; margin: 0.4rem 0 1rem;">
                    COLOR: ${item.color} &nbsp;•&nbsp; SIZE: ${item.size}
                  </div>
                  <div class="cart-item-actions">
                    <div class="qty-control">
                      <button type="button" class="qty-btn" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity - 1})">-</button>
                      <span class="qty-display">${item.quantity}</span>
                      <button type="button" class="qty-btn" onclick="window.BravadianStore.updateCartItemQty('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                    <span class="cart-item-price" style="font-size: 1.2rem;">${settings.currency}${(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    <button type="button" class="cart-remove-btn" onclick="window.BravadianStore.removeFromCart('${item.id}')">REMOVE ITEM</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Summary Deck -->
          <div>
            <div style="background: #101015; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 2rem;">
              <h3 style="font-family: 'Bebas Neue', var(--font-display), sans-serif; font-size: 1.6rem; font-weight: 400; letter-spacing: 2px; margin-bottom: 1.5rem;">ORDER SUMMARY</h3>
              <div class="cart-tally-line"><span>Subtotal:</span><span>${settings.currency}${subtotal.toLocaleString('en-IN')}</span></div>
              <div class="cart-tally-line"><span>Shipping:</span><span>${shipping === 0 ? 'FREE' : `${settings.currency}${shipping}`}</span></div>
              <div class="cart-tally-line total"><span>Total:</span><span>${settings.currency}${total.toLocaleString('en-IN')}</span></div>
              
              <button type="button" class="btn-checkout-whatsapp" onclick="window.BravadianStore.openCheckoutModal();">
                <svg class="btn-wa-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>PLACE ORDER ON WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* --------------------------------------------------------------------------
     7. CHECKOUT & WHATSAPP ORDER GENERATOR
     -------------------------------------------------------------------------- */
  function openCheckoutModal() {
    if (StoreState.cart.length === 0) {
      alert('Your cart is empty. Add a product first.');
      return;
    }
    if (checkoutModal) {
      checkoutModal.classList.add('is-open');
    }
  }

  function closeCheckoutModal() {
    if (checkoutModal) {
      checkoutModal.classList.remove('is-open');
    }
  }

  // Handle WhatsApp Checkout Form Submit
  window.handleCheckoutSubmit = function (e) {
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
      alert('Please agree to the Bravadian Terms & Conditions and Privacy Policy to proceed.');
      return;
    }

    if (hasErrors) return;

    // Generate Order Message
    const { subtotal, shipping, total, settings } = calculateCartTotals();

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

ORDER DETAILS
--------------------

${itemsText}

--------------------
Subtotal: ${settings.currency}${subtotal.toLocaleString('en-IN')}
Shipping: ${shipping === 0 ? 'FREE' : `${settings.currency}${shipping}`}
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
    
    window.open(waUrl, '_blank');

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
      <section class="order-success-section container">
        <div class="success-icon-badge">✓</div>
        <h1 class="success-heading">YOUR ORDER REQUEST IS READY.</h1>
        <p class="success-subtext">
          We've prepared your order details in WhatsApp.<br>
          Send the generated message to complete your order with the Bravadian concierge.
        </p>
        <div class="success-btn-group">
          <a href="#/shop" class="btn-primary">
            <span>CONTINUE SHOPPING</span>
          </a>
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
        resultsBox.innerHTML = `<div style="padding: 1.5rem; color: #888; font-family: var(--font-mono); font-size: 0.85rem;">No pieces matching "${q}"</div>`;
      } else {
        resultsBox.innerHTML = products.map(p => `
          <a href="#/product/${p.slug}" class="search-result-row" onclick="window.BravadianStore.closeSearchModal();">
            <img src="${p.images.front}" alt="${p.name}" class="search-result-thumb">
            <div class="search-result-info">
              <h4 class="search-result-title">${p.name}</h4>
              <span class="search-result-price">${settings.currency}${p.price.toLocaleString('en-IN')}</span>
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
        tableBody.innerHTML = guideData.map(row => `
          <tr>
            <td><strong>${row.size}</strong></td>
            <td>${row.chest}"</td>
            <td>${row.length}"</td>
            <td>${row.shoulder}"</td>
            <td>${row.sleeve}"</td>
          </tr>
        `).join('');
      }

      sizeGuideModal.classList.add('is-open');
    }
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
        <p>At BRAVADIAN (BRAVE INDIAN), your privacy is respected. We collect only the necessary delivery details (name, phone, address) strictly to fulfill order requests communicated via WhatsApp.</p>
        <h3>DATA USAGE & RETENTION</h3>
        <p>Customer delivery information entered during checkout is formatted directly into your secure WhatsApp message. We do not permanently store personal delivery or payment credentials in your browser's local storage.</p>
        <h3>THIRD-PARTY SERVICES</h3>
        <p>Order conversations are conducted on WhatsApp under Meta's privacy and encryption standards.</p>
      `;
    } else if (type === 'terms' || type === 'terms-conditions') {
      title = 'TERMS & CONDITIONS';
      content = `
        <p>By browsing BRAVADIAN and ordering through our WhatsApp channel, you acknowledge and agree to our terms of service.</p>
        <h3>LIMITED EDITIONS</h3>
        <p>Each 240 GSM oversized silhouette is produced in strictly limited batch sizes. Placement of order details on WhatsApp does not guarantee allocation until confirmed by the concierge.</p>
      `;
    } else if (type === 'shipping' || type === 'shipping-policy') {
      title = 'SHIPPING & DISPATCH';
      content = `
        <p>All pieces are inspected, boxed, and dispatched within 24 to 48 hours of order confirmation.</p>
        <h3>TRANSIT TIMES</h3>
        <p>Metro destinations receive priority air transit within 2-4 business days. Regional zones are delivered within 4-6 business days.</p>
      `;
    } else if (type === 'returns' || type === 'return-refund-policy') {
      title = 'RETURN & EXCHANGE POLICY';
      content = `
        <p>We accept size exchanges within 7 days of delivery for unworn garments with original tags intact.</p>
        <h3>QUALITY DEFECTS</h3>
        <p>In the unlikely event of stitching or textile defects, reach out via our WhatsApp concierge with your delivery invoice for immediate replacement.</p>
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
          <div class="container about-hero-container">
            <div class="about-badge-wrap">
              <span class="figma-tag">[ ARCHIVAL GENESIS // PROTOCOL 00 ]</span>
              <span class="about-radar-dot" aria-hidden="true"></span>
            </div>
            
            <h1 class="about-hero-title">
              <span class="about-title-lead">BRAVE INDIAN</span>
              <span class="about-title-sub">MONOLITHIC CULTURAL STREETWEAR</span>
            </h1>

            <p class="about-manifesto-sub">
              Engineered in 240 GSM heavy interlock cotton. Sacred architectural iconography directly translated from Belur & Halebidu stone reliefs onto modern drop-shoulder armor.
            </p>

            <div class="about-geo-coordinates">
              <span class="geo-bar"></span>
              <span class="geo-text">— FOUNDATIONAL TRANSMISSION // 28°36'N 77°12'E // EST. 2026 —</span>
              <span class="geo-bar"></span>
            </div>
          </div>
        </section>

        <!-- 2. EDITORIAL PULL-QUOTE BOX -->
        <section class="about-quote-section container">
          <div class="about-quote-card">
            <span class="quote-tag">[ THE BRAVADIAN CREED ]</span>
            <blockquote class="about-quote-body">
              “WE CARVE SACRED ICONOGRAPHY AS HEAVYWEIGHT ARMOR. REJECTING DISPOSABLE FAST-FASHION IN FAVOR OF 240 GSM STRUCTURAL RELICS BUILT TO OUTLAST THE NOISE.”
            </blockquote>
            <div class="quote-author-line">
              <span class="quote-line-dash"></span>
              <span class="quote-author-text">BRAVADIAN ARCHIVE PROTOCOL // BHARAT</span>
              <span class="quote-line-dash"></span>
            </div>
          </div>
        </section>

        <!-- 3. FOUR CORE ARCHITECTURAL PILLARS -->
        <section class="about-pillars-section container">
          <div class="about-section-header">
            <span class="figma-tag">— 01 / ENGINEERING SPECIFICATIONS</span>
            <h2 class="about-section-title">THE ARCHITECTURAL PILLARS</h2>
            <p class="about-section-narrative">
              Every detail is calibrated to elevate Indian streetwear beyond fast-fashion compromises.
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
              <h3 class="pillar-heading">240 GSM HEAVY INTERLOCK</h3>
              <p class="pillar-desc">
                Custom double-knit combed cotton with zero synthetic blend. Provides a rigid, architectural boxy drape that hangs effortlessly with monolithic physical presence.
              </p>
              <div class="pillar-metric">DENSITY // 240 G/M² TEXTURED</div>
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
              <h3 class="pillar-heading">1.25" REINFORCED RIB COLLAR</h3>
              <p class="pillar-desc">
                Thick elastane-reinforced Lycra collar. Engineered to withstand intense daily wear and laundry cycles without ever stretching or curling into bacon-neck.
              </p>
              <div class="pillar-metric">COLLAR // 1.25 INCH REINFORCED</div>
            </div>

            <!-- PILLAR 3: HOYSALA ICONOGRAPHY -->
            <div class="about-pillar-card">
              <div class="pillar-icon-box">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span class="pillar-num">[ 03 ]</span>
              <h3 class="pillar-heading">AUTHENTIC STONE RELIEFS</h3>
              <p class="pillar-desc">
                Directly referenced from 12th-century Belur and Halebidu temple friezes. Sacred Salabhanjika maidens, celestial Garudas, and monolithic temple tiers re-imagined as wearable art.
              </p>
              <div class="pillar-metric">HERITAGE // HOYSALA ARCHITECTURE</div>
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
              <h3 class="pillar-heading">VAULT LIMIT // 200 PIECES</h3>
              <p class="pillar-desc">
                Extreme scarcity by protocol. Every piece is capped at 200 serialized units. When a numbered run sells out, it is vaulted permanently. Zero restocks.
              </p>
              <div class="pillar-metric">ALLOTMENT // 200 NUMBERED UNITS</div>
            </div>
          </div>
        </section>

        <!-- 4. SPECIFICATION TAXONOMY STRIP -->
        <section class="about-specs-section container">
          <div class="about-spec-strip">
            <div class="about-spec-item">
              <span class="spec-label">[ FABRIC DENSITY ]</span>
              <span class="spec-val">240 GSM</span>
              <span class="spec-sub">Heavy Double Interlock</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">[ COLLAR REINFORCE ]</span>
              <span class="spec-val">1.25 INCH</span>
              <span class="spec-sub">Lycra Rib Zero Warp</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">[ FIBER ORIGIN ]</span>
              <span class="spec-val">100% COMBED</span>
              <span class="spec-sub">Indian Long-Staple Cotton</span>
            </div>
            <div class="about-spec-item">
              <span class="spec-label">[ EMBARGO LIMIT ]</span>
              <span class="spec-val">200 PCS</span>
              <span class="spec-sub">Archival Serial Numbered</span>
            </div>
          </div>
        </section>

        <!-- 5. CALL TO ACTION WITH THEMED VAULT BUTTON -->
        <section class="about-cta-section container">
          <div class="about-cta-card">
            <span class="figma-tag">[ DIRECT PROTOCOL ACCESS ]</span>
            <h2 class="about-cta-title">CLAIM YOUR ARCHIVAL ARMOR</h2>
            <p class="about-cta-sub">
              Access the current active edition before the 200-piece vault embargo closes.
            </p>
            <div class="about-cta-actions">
              <a href="#/shop" class="btn-figma-primary">
                <span>[ VISIT THE VAULT ]</span>
                <svg class="btn-vault-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
              <a href="https://wa.me/917975362526?text=Hi%20Bravadian,%20I%20have%20an%20inquiry%20regarding%20the%20brand%20and%20upcoming%20drops" target="_blank" rel="noopener noreferrer" class="btn-figma-whatsapp">
                <svg class="btn-wa-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WHATSAPP CONCIERGE</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  function renderContactView() {
    const settings = window.BravadianDB.getSettings();
    mainContainer.innerHTML = `
      <div class="policy-page-container">
        <span class="shop-pill-tag">[ DIRECT TRANSMISSIONS ]</span>
        <h1 class="policy-headline">CONTACT CONCIERGE</h1>
        <div class="policy-body">
          <p>For custom inquiries, size consultations, or wholesale batch allotments:</p>
          <div style="margin: 2rem 0; padding: 1.5rem; background: #111116; border: 1px solid rgba(255,255,255,0.08); border-radius: 4px;">
            <p><strong>WHATSAPP:</strong> <a href="https://wa.me/${settings.whatsappNumber}" target="_blank" style="color: var(--color-ember);">+${settings.whatsappNumber}</a></p>
            <p><strong>INSTAGRAM:</strong> <a href="${settings.instagramUrl}" target="_blank" style="color: var(--color-ember);">${settings.instagramUrl}</a></p>
            <p><strong>EMAIL:</strong> <span style="color: #fff;">${settings.supportEmail}</span></p>
          </div>
        </div>
      </div>
    `;
  }

  // Global Store API export
  window.BravadianStore = {
    quickAdd(slug) {
      const product = window.BravadianDB.getProductBySlug(slug);
      if (!product) return;
      const color = product.colors[0];
      const availableSizes = getAvailableSizesForColor(product, color);
      if (availableSizes.length > 0) {
        addToCart(product, color, availableSizes[0], 1);
        openCartDrawer();
      } else {
        window.location.hash = `#/product/${slug}`;
      }
    },
    requestVipEmbargo(productName) {
      const settings = window.BravadianDB.getSettings();
      const text = encodeURIComponent(`Hi Bravadian Concierge, I would like priority notification for the upcoming drop: "${productName}". Please register me for early VIP access!`);
      const url = `https://wa.me/${settings.whatsappNumber}?text=${text}`;
      window.open(url, '_blank');
    },
    updateCartItemQty,
    removeFromCart,
    openCartDrawer,
    closeCartDrawer,
    openSearchModal,
    closeSearchModal,
    openCheckoutModal,
    closeCheckoutModal,
    openSizeGuideModal,
    closeSizeGuideModal,
    showCartToast
  };

})();
