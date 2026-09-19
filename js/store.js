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

    // Close any open drawers/modals on navigation
    closeCartDrawer();
    closeSearchModal();
    closeCheckoutModal();
    closeSizeGuideModal();

    if (hash === '#/' || hash === '#/home' || hash === '') {
      renderHomeView();
    } else if (hash.startsWith('#/collections') || hash === '#/shop') {
      const parts = hash.split('/');
      const colSlug = parts[2] || 'all';
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
      if (href === StoreState.currentRoute) {
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

    if (megaList) {
      megaList.innerHTML = collections.map(c => `
        <li class="mega-item">
          <a href="#/collections/${c.slug}">
            <span>${c.name}</span>
            <span class="item-dot"></span>
          </a>
        </li>
      `).join('');
    }

    if (mobileList) {
      mobileList.innerHTML = collections.map(c => `
        <li><a href="#/collections/${c.slug}" class="mobile-sub-link">${c.name}</a></li>
      `).join('');
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

    // Mobile Hamburger
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    const mobileClose = document.getElementById('closeMobileNavBtn');

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', () => mobileDrawer.classList.add('is-open'));
      if (mobileClose) mobileClose.addEventListener('click', () => mobileDrawer.classList.remove('is-open'));
      
      mobileDrawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => mobileDrawer.classList.remove('is-open'));
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
     1. HOME VIEW
     -------------------------------------------------------------------------- */
  function renderHomeView() {
    const products = window.BravadianDB.getProducts();
    const newDrops = products.filter(p => p.newDrop || p.featured).slice(0, 3);
    const collections = window.BravadianDB.getCollections().filter(c => c.slug !== 'all');

    mainContainer.innerHTML = `
      <!-- CINEMATIC HERO -->
      <section class="hero-section">
        <div class="hero-bg-accent" aria-hidden="true">
          <span class="hero-watermark">BRAVADIAN</span>
        </div>

        <div class="container hero-content">
          <div class="hero-pill-badge fade-in is-visible">
            <span class="pill-dot"></span>
            <span class="pill-text">DROP 01 // THE ARCHIVE IS LIVE</span>
            <span class="pill-code">[ 240 GSM ]</span>
          </div>

          <div class="hero-brand-block fade-in is-visible">
            <div class="hero-logo-wrap">
              <img src="images/logo.png" alt="BRAVADIAN — BRAVE INDIA" class="hero-brand-logo">
            </div>
            <h1 class="visually-hidden">BRAVADIAN — BRAVE INDIA</h1>
          </div>

          <div class="hero-statement-block fade-in is-visible">
            <h2 class="hero-statement-title">
              NOT JUST A T-SHIRT.<br>
              <span class="gradient-text">A STATEMENT.</span>
            </h2>
            <p class="hero-statement-desc">
              240 GSM oversized silhouettes. Built for those who don't follow the crowd.
            </p>
          </div>

          <div class="hero-cta-group fade-in is-visible">
            <a href="#/shop" class="btn-primary magnetic">
              <span class="btn-bg"></span>
              <span class="btn-text">SHOP THE DROP</span>
              <svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3.33 8H12.67M12.67 8L8.67 4M12.67 8L8.67 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a href="#/collections" class="btn-secondary magnetic">
              <span class="btn-text">EXPLORE COLLECTIONS</span>
            </a>
          </div>

          <div class="hero-spec-strip fade-in is-visible">
            <div class="strip-item"><span class="strip-code">01</span><span class="strip-text">240 GSM HEAVYWEIGHT</span></div>
            <div class="strip-divider">//</div>
            <div class="strip-item"><span class="strip-code">02</span><span class="strip-text">EXTREME DROP-SHOULDER CUT</span></div>
            <div class="strip-divider">//</div>
            <div class="strip-item"><span class="strip-code">03</span><span class="strip-text">1.25" ANTI-SAG COLLAR</span></div>
            <div class="strip-divider">//</div>
            <div class="strip-item"><span class="strip-code">04</span><span class="strip-text">INSTANT WHATSAPP CHECKOUT</span></div>
          </div>
        </div>
      </section>

      <!-- FEATURED NEW DROPS -->
      <section class="home-featured-section container" style="padding: 6rem 2rem;">
        <div class="section-header" style="text-align: center; margin-bottom: 3.5rem;">
          <span class="section-tag">[ ACTIVE ARCHIVE ]</span>
          <h2 class="section-title">FEATURED SILHOUETTES</h2>
          <p class="section-desc">Limited batches engineered with high-density interlock cotton. Each piece commands presence.</p>
        </div>

        <div class="product-grid">
          ${newDrops.map(p => renderProductCardHTML(p)).join('')}
        </div>

        <div style="text-align: center; margin-top: 2rem;">
          <a href="#/shop" class="btn-primary magnetic">
            <span class="btn-text">VIEW ALL PIECES</span>
          </a>
        </div>
      </section>

      <!-- COLLECTIONS RAIL -->
      <section class="home-collections-overview" style="background: #09090d; border-top: 1px solid rgba(255,255,255,0.05); padding: 6rem 2rem;">
        <div class="container">
          <div class="section-header" style="text-align: center; margin-bottom: 3rem;">
            <span class="section-tag">[ EXPLORE THE UNIVERSE ]</span>
            <h2 class="section-title">THE COLLECTIONS</h2>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
            ${collections.map(col => `
              <a href="#/collections/${col.slug}" class="pillar-card" style="cursor: pointer; text-decoration: none;">
                <div class="pillar-accent"></div>
                <span class="pillar-num">COLLECTION</span>
                <h3 class="pillar-title">${col.name}</h3>
                <p class="pillar-sub">${col.description}</p>
                <span style="display: inline-block; margin-top: 1rem; font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-ember); font-weight: 700; letter-spacing: 1.5px;">EXPLORE →</span>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- THE 240 GSM MANIFESTO -->
      <section class="brand-story-section">
        <div class="container story-container">
          <div class="story-heritage-stamp">
            <span class="stamp-text">BHARAT STREETWEAR MANIFESTO</span>
          </div>
          <div class="story-quote-card">
            <blockquote class="story-text">
              “BRAVADIAN is built around one idea —<br>
              <strong class="story-highlight">BE BRAVE. BE INDIAN. BE YOURSELF.</strong>”
            </blockquote>
            <div class="story-author-block">
              <span class="story-brand">BRAVADIAN</span>
              <span class="story-divider">—</span>
              <span class="story-meaning">240 GSM OF PRESENCE</span>
            </div>
          </div>
        </div>
      </section>
    `;

    bindProductCardActions();
  }

  /* --------------------------------------------------------------------------
     2. SHOP & COLLECTION VIEW
     -------------------------------------------------------------------------- */
  function renderShopView(colSlug = 'all') {
    const collections = window.BravadianDB.getCollections();
    const activeCol = collections.find(c => c.slug === colSlug) || { name: 'ALL PIECES', description: 'Complete 240 GSM architectural oversized archive.' };
    
    // Get filtered products
    const products = window.BravadianDB.getProducts({
      collection: colSlug,
      color: StoreState.activeFilters.color,
      size: StoreState.activeFilters.size,
      sort: StoreState.activeFilters.sort,
      inStockOnly: StoreState.activeFilters.inStockOnly,
      search: StoreState.activeFilters.search
    });

    mainContainer.innerHTML = `
      <div class="container" style="padding-top: 7rem;">
        <!-- Header Strip -->
        <div class="shop-header-strip">
          <div class="shop-headline-block">
            <span class="shop-pill-tag">[ ARCHIVE COLLECTION ]</span>
            <h1 class="shop-main-title">${activeCol.name}</h1>
            <p class="shop-sub-desc">${activeCol.description}</p>
          </div>

          <!-- Collection Tabs -->
          <div class="collection-tabs-scroll">
            ${collections.map(c => `
              <a href="#/collections/${c.slug}" class="collection-tab-pill ${c.slug === colSlug ? 'active' : ''}">
                ${c.name}
              </a>
            `).join('')}
          </div>
        </div>

        <!-- Filter & Sort Toolbar -->
        <div class="filter-sort-bar">
          <div class="filter-left-counts">
            SHOWING <strong>${products.length}</strong> ${products.length === 1 ? 'PIECE' : 'PIECES'}
          </div>

          <div class="filter-controls-group">
            <!-- Filter by Size -->
            <select class="custom-select" id="sizeFilterSelect" aria-label="Filter by size">
              <option value="">ALL SIZES</option>
              <option value="S" ${StoreState.activeFilters.size === 'S' ? 'selected' : ''}>SIZE S</option>
              <option value="M" ${StoreState.activeFilters.size === 'M' ? 'selected' : ''}>SIZE M</option>
              <option value="L" ${StoreState.activeFilters.size === 'L' ? 'selected' : ''}>SIZE L</option>
              <option value="XL" ${StoreState.activeFilters.size === 'XL' ? 'selected' : ''}>SIZE XL</option>
              <option value="XXL" ${StoreState.activeFilters.size === 'XXL' ? 'selected' : ''}>SIZE XXL</option>
            </select>

            <!-- Sort -->
            <select class="custom-select" id="sortSelect" aria-label="Sort products">
              <option value="newest" ${StoreState.activeFilters.sort === 'newest' ? 'selected' : ''}>SORT: NEWEST</option>
              <option value="price-low" ${StoreState.activeFilters.sort === 'price-low' ? 'selected' : ''}>PRICE: LOW TO HIGH</option>
              <option value="price-high" ${StoreState.activeFilters.sort === 'price-high' ? 'selected' : ''}>PRICE: HIGH TO LOW</option>
            </select>
          </div>
        </div>

        <!-- Product Grid or Empty State -->
        ${products.length > 0 ? `
          <div class="product-grid">
            ${products.map(p => renderProductCardHTML(p)).join('')}
          </div>
        ` : `
          <div class="empty-state-box">
            <div class="empty-state-icon">⚡</div>
            <h3 class="empty-state-title">NO PIECES FOUND</h3>
            <p class="empty-state-sub">Try clearing filters or explore another collection.</p>
            <a href="#/collections/all" class="btn-secondary" style="display: inline-block;">VIEW ALL COLLECTIONS</a>
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

    bindProductCardActions();
  }

  /* --------------------------------------------------------------------------
     3. PRODUCT CARD COMPONENT
     -------------------------------------------------------------------------- */
  function renderProductCardHTML(product) {
    const isOutOfStock = !product.variants || product.variants.every(v => v.stock === 0);
    const settings = window.BravadianDB.getSettings();

    return `
      <article class="product-card" data-slug="${product.slug}">
        <div class="product-media-wrap" onclick="window.location.hash='#/product/${product.slug}'">
          <img 
            src="${product.images.front}" 
            alt="${product.name} 240 GSM Oversized T-Shirt" 
            class="product-card-img" 
            loading="lazy"
          >
          <div class="card-badges-top">
            <span class="badge-pill spec-gsm">240 GSM</span>
            ${product.newDrop ? '<span class="badge-pill badge-new">NEW DROP</span>' : ''}
            ${isOutOfStock ? '<span class="badge-pill badge-soldout">SOLD OUT</span>' : ''}
          </div>

          <div class="card-quick-actions">
            <button class="btn-card-quick" onclick="event.stopPropagation(); window.location.hash='#/product/${product.slug}';">
              VIEW PRODUCT
            </button>
            ${!isOutOfStock ? `
              <button class="btn-card-quick" style="background: var(--color-ember); color: #fff;" onclick="event.stopPropagation(); window.BravadianStore.quickAdd('${product.slug}');">
                QUICK ADD
              </button>
            ` : ''}
          </div>
        </div>

        <div class="product-card-details">
          <span class="product-coll-label">${product.collection}</span>
          <h3 class="product-card-name" onclick="window.location.hash='#/product/${product.slug}'" style="cursor: pointer;">
            ${product.name}
          </h3>
          <p class="product-card-desc">${product.description}</p>
          
          <div class="product-card-price-row">
            <div>
              <span class="price-current">${settings.currency}${product.price.toLocaleString('en-IN')}</span>
              ${product.comparePrice ? `<span class="price-compare">${settings.currency}${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
            </div>
            <span class="card-status-indicator ${isOutOfStock ? 'sold-out' : 'available'}">
              ${isOutOfStock ? 'SOLD OUT' : 'AVAILABLE'}
            </span>
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
  function renderPDPView(slug) {
    const product = window.BravadianDB.getProductBySlug(slug);
    if (!product) {
      renderShopView('all');
      return;
    }

    StoreState.currentProduct = product;
    // Default color to first available
    StoreState.selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
    // Find first available size for this color
    StoreState.selectedSize = '';
    StoreState.selectedQty = 1;

    // Check available sizes for selected color
    const availableSizes = getAvailableSizesForColor(product, StoreState.selectedColor);
    if (availableSizes.length > 0) {
      StoreState.selectedSize = availableSizes[0];
    }

    const settings = window.BravadianDB.getSettings();

    mainContainer.innerHTML = `
      <div class="container">
        <div class="product-detail-layout">
          <!-- GALLERY -->
          <div class="product-gallery-side">
            <div class="gallery-thumbnails">
              <img src="${product.images.front}" alt="Front view" class="gallery-thumb active" data-img="${product.images.front}">
              <img src="${product.images.back}" alt="Back view" class="gallery-thumb" data-img="${product.images.back}">
              <img src="${product.images.closeup}" alt="Fabric closeup" class="gallery-thumb" data-img="${product.images.closeup}">
              <img src="${product.images.lifestyle}" alt="Lifestyle silhouette" class="gallery-thumb" data-img="${product.images.lifestyle}">
            </div>
            <div class="gallery-main-view">
              <img src="${product.images.front}" alt="${product.name}" id="pdpMainImage" class="gallery-main-img">
            </div>
          </div>

          <!-- INFO & VARIANT MATRIX -->
          <div class="product-info-side">
            <span class="pdp-collection-tag">${product.collection} // DROP ARCHIVE</span>
            <h1 class="pdp-title">${product.name}</h1>

            <div class="pdp-price-wrap">
              <span class="pdp-price">${settings.currency}${product.price.toLocaleString('en-IN')}</span>
              ${product.comparePrice ? `<span class="pdp-compare">${settings.currency}${product.comparePrice.toLocaleString('en-IN')}</span>` : ''}
              <span class="card-status-indicator available" id="pdpStockBadge">IN STOCK</span>
            </div>

            <!-- Prominent First Product Specification Banner -->
            <div class="pdp-spec-banner">
              <div class="pdp-spec-item">
                <span class="pdp-spec-title">FABRIC WEIGHT</span>
                <span class="pdp-spec-val">${product.fabric || '240 GSM'}</span>
              </div>
              <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
              <div class="pdp-spec-item">
                <span class="pdp-spec-title">CUT & FIT</span>
                <span class="pdp-spec-val">${product.fit || 'Oversized'}</span>
              </div>
              <div style="width: 1px; background: rgba(255,255,255,0.08);"></div>
              <div class="pdp-spec-item">
                <span class="pdp-spec-title">MATERIAL</span>
                <span class="pdp-spec-val">${product.material || '100% Combed Cotton'}</span>
              </div>
            </div>

            <p class="pdp-desc">${product.description}</p>

            <!-- Color Selection -->
            <div class="variant-block">
              <div class="variant-label-row">
                <span class="variant-label-name">COLOR:</span>
                <span class="variant-selected-val" id="selectedColorDisplay">${StoreState.selectedColor}</span>
              </div>
              <div class="color-pills-list" id="pdpColorList">
                ${product.colors.map(col => `
                  <button type="button" class="color-pill-btn ${col === StoreState.selectedColor ? 'active' : ''}" data-color="${col}">
                    ${col}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Size Selection (Variant Level Dynamic Matrix) -->
            <div class="variant-block">
              <div class="variant-label-row">
                <span class="variant-label-name">SIZE:</span>
                <span class="size-guide-link" id="pdpSizeGuideTrigger">Not sure about your size?</span>
              </div>
              <div class="size-pills-list" id="pdpSizeList">
                <!-- Dynamically populated based on color stock -->
              </div>
            </div>

            <!-- Quantity & Add to Cart -->
            <div class="pdp-action-row">
              <div class="qty-control">
                <button type="button" class="qty-btn" id="qtyMinusBtn">-</button>
                <span class="qty-display" id="qtyVal">1</span>
                <button type="button" class="qty-btn" id="qtyPlusBtn">+</button>
              </div>

              <button type="button" class="btn-add-cart" id="addToCartBtn">
                <span>ADD TO CART</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </button>
            </div>

            <!-- Accordion Details -->
            <div class="pdp-spec-accordion">
              <div class="accordion-item">
                <button class="accordion-trigger" type="button">
                  <span>SPECIFICATIONS & CRAFT</span>
                  <span>+</span>
                </button>
                <div class="accordion-content">
                  Heavy 240 GSM interlock fabric with bio-washed velvet finish. High-tension 1.25" rib neckline designed to resist sagging wear after wear. Twin-needle reinforced seams along the shoulder drop.
                </div>
              </div>

              <div class="accordion-item">
                <button class="accordion-trigger" type="button">
                  <span>DISPATCH & WHATSAPP ORDERS</span>
                  <span>+</span>
                </button>
                <div class="accordion-content">
                  Orders placed are confirmed through our concierge on WhatsApp. Dispatches ship within 24-48 hours across India via express air delivery. Free shipping on orders above ${settings.currency}${settings.freeShippingThreshold}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind Gallery events
    const mainImg = document.getElementById('pdpMainImage');
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach(t => {
      t.addEventListener('click', () => {
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        t.classList.add('active');
        mainImg.src = t.getAttribute('data-img');
      });
    });

    // Bind Size Guide Modal Trigger
    const sizeGuideTrigger = document.getElementById('pdpSizeGuideTrigger');
    if (sizeGuideTrigger) {
      sizeGuideTrigger.addEventListener('click', openSizeGuideModal);
    }

    // Bind Quantity Buttons
    const qtyVal = document.getElementById('qtyVal');
    document.getElementById('qtyMinusBtn').addEventListener('click', () => {
      if (StoreState.selectedQty > 1) {
        StoreState.selectedQty--;
        qtyVal.textContent = StoreState.selectedQty;
      }
    });
    document.getElementById('qtyPlusBtn').addEventListener('click', () => {
      const maxStock = getVariantStock(product, StoreState.selectedColor, StoreState.selectedSize);
      if (StoreState.selectedQty < maxStock) {
        StoreState.selectedQty++;
        qtyVal.textContent = StoreState.selectedQty;
      }
    });

    // Bind Color Buttons
    const colorBtns = document.querySelectorAll('.color-pill-btn');
    colorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        StoreState.selectedColor = btn.getAttribute('data-color');
        document.getElementById('selectedColorDisplay').textContent = StoreState.selectedColor;
        renderSizePills();
      });
    });

    // Initial render of size pills for the selected color
    renderSizePills();

    // Bind Add to Cart
    document.getElementById('addToCartBtn').addEventListener('click', () => {
      if (!StoreState.selectedSize) {
        alert('Please select an available size.');
        return;
      }

      addToCart(product, StoreState.selectedColor, StoreState.selectedSize, StoreState.selectedQty);
      openCartDrawer();
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
      b.style.display = totalCount > 0 ? 'flex' : 'none';
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
            <div class="empty-state-icon">🛒</div>
            <h4 class="empty-state-title" style="font-size: 1.2rem;">YOUR CART IS EMPTY</h4>
            <p class="empty-state-sub" style="font-size: 0.85rem;">240 GSM silhouettes are waiting in the drop.</p>
            <a href="#/shop" class="btn-primary" style="padding: 0.75rem 1.5rem;" onclick="window.BravadianStore.closeCartDrawer();">EXPLORE THE DROP</a>
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
            <div class="empty-state-icon">🛒</div>
            <h2 class="empty-state-title">YOUR CART IS EMPTY</h2>
            <p class="empty-state-sub">Discover unreleased 240 GSM silhouettes in the collection archive.</p>
            <a href="#/shop" class="btn-primary" style="display: inline-block;">EXPLORE THE DROP</a>
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
                  <h3 class="cart-item-name" style="font-size: 1.2rem;">${item.name}</h3>
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
              <h3 style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 900; letter-spacing: 1.5px; margin-bottom: 1.5rem;">ORDER SUMMARY</h3>
              <div class="cart-tally-line"><span>Subtotal:</span><span>${settings.currency}${subtotal.toLocaleString('en-IN')}</span></div>
              <div class="cart-tally-line"><span>Shipping:</span><span>${shipping === 0 ? 'FREE' : `${settings.currency}${shipping}`}</span></div>
              <div class="cart-tally-line total"><span>Total:</span><span>${settings.currency}${total.toLocaleString('en-IN')}</span></div>
              
              <button type="button" class="btn-checkout-whatsapp" onclick="window.BravadianStore.openCheckoutModal();">
                <span>PLACE ORDER ON WHATSAPP</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.275-.1-.475-.15-.675.15-.2.3-.775.98-.95 1.18-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.49-1.147-1.023-1.921-2.288-2.146-2.673-.225-.385-.024-.593.126-.743.136-.135.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.244-.585-.492-.506-.675-.515-.175-.008-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.115 3.23 5.125 4.53 3.01 1.3 3.01.867 3.56.817.55-.05 1.78-.725 2.03-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                </svg>
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
      <div class="policy-page-container">
        <span class="shop-pill-tag">[ BRAND ARCHIVE ]</span>
        <h1 class="policy-headline">BRAVE INDIAN</h1>
        <div class="policy-body">
          <p>BRAVADIAN is an independent Indian streetwear label engineered in 240 GSM heavy interlock cotton. Designed for the relentless.</p>
          <h3>THE 240 GSM PHILOSOPHY</h3>
          <p>We reject flimsy, fast-fashion garments. Every silhouette is built with structural architectural presence, thick ribbing, and substantial drape that refuses to warp.</p>
          <h3>ROOTED IN BHARAT</h3>
          <p>From underground anime influences to ancient warrior folklore, each collection reflects modern Indian identity on the world stage.</p>
        </div>
        <div style="margin-top: 3rem;">
          <a href="#/shop" class="btn-primary">EXPLORE THE DROP</a>
        </div>
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
