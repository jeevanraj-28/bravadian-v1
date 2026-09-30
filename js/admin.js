/**
 * BRAVADIAN | BRAVE INDIAN — ADMIN CMS CONTROLLER
 * Full management for Dashboard, Products, Variant Matrix,
 * Collections, Size Guide, Site Settings & Supabase Cloud Sync
 */

(function () {
  'use strict';

  // Initialize all admin modules
  function initAllModules() {
    const modules = [
      ['Navigation', initNavigation],
      ['Dashboard', initDashboard],
      ['Orders', initOrders],
      ['Products', initProductsTable],
      ['Inventory', initInventoryMatrix],
      ['Collections', initCollectionsTable],
      ['SizeGuide', initSizeGuideEditor],
      ['Settings', initSettingsForm],
      ['Supabase', initSupabasePanel],
      ['ExportImport', initExportImport],
      ['Modals', initModals],
      ['Wall', () => window.BravadianWallAdmin && window.BravadianWallAdmin.init()]
    ];

    modules.forEach(([name, fn]) => {
      try {
        fn();
      } catch (err) {
        console.error(`[BRAVADIAN CMS] Error initializing ${name}:`, err);
      }
    });

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('adminMobileToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    const sidebarClose = document.getElementById('adminSidebarClose');

    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-mobile-open');
      });
    }
    if (sidebarClose && sidebar) {
      sidebarClose.addEventListener('click', () => {
        sidebar.classList.remove('is-mobile-open');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const loginOverlay = document.getElementById('adminLoginOverlay');
    const loginForm = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('adminEmailInput');
    const passwordInput = document.getElementById('adminPasswordInput');
    const loginError = document.getElementById('adminLoginError');
    const client = window.BravadianDB && window.BravadianDB.supabaseClient;

    function unlock() {
      if (loginOverlay) loginOverlay.classList.add('is-hidden');
      document.body.classList.remove('is-locked');
      initAllModules();
    }

    document.body.classList.add('is-locked');

    // Say plainly which database this admin page is changing
    const banner = document.getElementById('dbBanner');
    if (banner) {
      const live = window.BravadianDB && window.BravadianDB.dbLabel === 'LIVE';
      banner.innerHTML = live
        ? '<strong>LIVE DATABASE:</strong> changes you save here appear on the website straight away.'
        : '<strong>TEST DATABASE:</strong> safe to experiment. The live website is not affected. (Remove ?db=test from the address to edit the live store.)';
    }

    if (!client) {
      if (loginError) loginError.textContent = 'Supabase is not configured. Add SUPABASE_URL and SUPABASE_ANON_KEY in js/data.js.';
      return;
    }

    // Signing in only proves who someone is; the admin_users list (is_admin) decides who gets in
    async function unlockIfAdmin() {
      const { data: isAdmin, error } = await client.rpc('is_admin');
      if (!error && isAdmin === true) {
        unlock();
        return true;
      }
      await client.auth.signOut();
      if (loginOverlay) loginOverlay.classList.remove('is-hidden');
      if (loginError) {
        loginError.textContent = error
          ? `Could not check admin access: ${error.message}`
          : `This account is not on the admin list for the ${window.BravadianDB.dbLabel} database. Ask the owner to add your email to admin_users.`;
      }
      return false;
    }

    const signOut = document.getElementById('adminSignOut');
    if (signOut) signOut.addEventListener('click', async () => {
      await client.auth.signOut();
      window.location.reload();
    });

    // Supabase keeps the session, so a signed-in admin skips the login screen
    const { data: sessionData } = await client.auth.getSession();
    if (sessionData && sessionData.session && await unlockIfAdmin()) return;

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (loginError) loginError.textContent = '';
        const { error } = await client.auth.signInWithPassword({
          email: emailInput.value.trim(),
          password: passwordInput.value
        });
        if (error) {
          const db = window.BravadianDB.dbLabel;
          const reason = /not confirmed/i.test(error.message)
            ? 'This email is not confirmed yet. In Supabase → Authentication → Users, confirm the user.'
            : /invalid login/i.test(error.message)
              ? 'Wrong email or password.'
              : error.message;
          if (loginError) loginError.textContent = `${reason} (Signing in to the ${db} database.)`;
          passwordInput.value = '';
          passwordInput.focus();
          return;
        }
        if (!(await unlockIfAdmin())) passwordInput.value = '';
      });
    }

    if (emailInput) emailInput.focus();
  });


  /* --------------------------------------------------------------------------
     1. NAVIGATION & TABS
     -------------------------------------------------------------------------- */
  function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        if (tab) {
          window.location.hash = '#' + tab;
          switchTab(tab);
        }
      });
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) switchTab(hash);
    });

    // Initial load from URL hash
    const initialHash = window.location.hash.replace('#', '').trim();
    if (initialHash && document.getElementById(`pane-${initialHash}`)) {
      switchTab(initialHash);
    }
  }

  function switchTab(tabName) {
    if (!tabName) return;
    // Leaving the Wall editor with unsaved changes asks first
    const wall = window.BravadianWallAdmin;
    if (wall && !wall.canLeave(tabName)) {
      if (window.location.hash !== '#walleditor') history.replaceState(null, '', '#walleditor');
      return;
    }

    document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.admin-content-pane').forEach(p => p.classList.remove('active'));

    const navItem = document.querySelector(`.sidebar-nav-item[data-tab="${tabName}"]`);
    const pane = document.getElementById(`pane-${tabName}`);
    const pageTitle = document.getElementById('adminPageTitle');

    if (navItem) navItem.classList.add('active');
    if (pane) pane.classList.add('active');
    // The top bar shows the Wall's buttons on Wall screens and the product button elsewhere
    document.body.classList.toggle('is-wall-tab', tabName.startsWith('wall'));

    // Close mobile drawer on tab select
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) sidebar.classList.remove('is-mobile-open');

    const titles = {
      dashboard: 'DASHBOARD OVERVIEW',
      orders: 'ORDERS',
      products: 'PRODUCT CATALOG',
      inventory: 'VARIANT INVENTORY MATRIX',
      collections: 'COLLECTIONS ARCHIVE',
      sizeguide: 'SIZE GUIDE SPECIFICATIONS',
      settings: 'SITE & WHATSAPP SETTINGS',
      supabase: 'SUPABASE CLOUD SYNC',
      dataio: 'BACKUP & DATA IMPORT',
      wall: 'THE BRAVADIAN WALL',
      wallposts: 'WALL POSTS',
      walleditor: 'WALL · ADD / EDIT',
      wallfeatured: 'WALL · FEATURED ORDER',
      wallmedia: 'WALL · MEDIA'
    };
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    // Refresh tab data safely
    try {
      if (tabName === 'dashboard') initDashboard();
      if (tabName === 'orders') loadOrders();
      if (tabName === 'products') initProductsTable();
      if (tabName === 'inventory') initInventoryMatrix();
      if (tabName === 'collections') initCollectionsTable();
      if (tabName === 'sizeguide') initSizeGuideEditor();
      if (tabName === 'settings') initSettingsForm();
      if (tabName === 'supabase') {
        initSupabasePanel();
        checkSupabaseStatus();
      }
      if (tabName.startsWith('wall') && wall) wall.show(tabName);
    } catch (err) {
      console.warn(`[BRAVADIAN CMS] Tab refresh error (${tabName}):`, err);
    }
  }

  /* --------------------------------------------------------------------------
     2. DASHBOARD
     -------------------------------------------------------------------------- */
  function initDashboard() {
    const products = window.BravadianDB.getProducts();
    const collections = window.BravadianDB.getCollections();

    let totalProds = products.length;
    let availableCount = 0;
    let soldOutCount = 0;
    let lowStockCount = 0;

    products.forEach(p => {
      const totalStock = p.variants ? p.variants.reduce((sum, v) => sum + v.stock, 0) : 0;
      if (totalStock > 0 && p.status === 'PUBLISHED') {
        availableCount++;
      } else {
        soldOutCount++;
      }

      if (p.variants) {
        p.variants.forEach(v => {
          if (v.stock > 0 && v.stock <= 3) lowStockCount++;
        });
      }
    });

    document.getElementById('metricTotalProducts').textContent = totalProds;
    document.getElementById('metricAvailable').textContent = availableCount;
    document.getElementById('metricSoldOut').textContent = soldOutCount;
    document.getElementById('metricCollections').textContent = collections.length;
    document.getElementById('metricLowStock').textContent = lowStockCount;

    // Snapshot table
    const snapTable = document.getElementById('dashboardRecentTable');
    if (snapTable) {
      snapTable.innerHTML = `
        <table class="admin-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>COLLECTION</th>
              <th>PRICE</th>
              <th>TOTAL STOCK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            ${products.slice(0, 5).map(p => {
              const stock = p.variants ? p.variants.reduce((sum, v) => sum + (v.stock || 0), 0) : 0;
              const coll = (p.collection || 'General').toUpperCase();
              const price = typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0);
              return `
                <tr>
                  <td><strong>${p.name || 'Untitled'}</strong></td>
                  <td>${coll}</td>
                  <td>₹${price.toLocaleString('en-IN')}</td>
                  <td>${stock} Units</td>
                  <td><span class="table-pill ${p.status === 'PUBLISHED' ? 'pub' : 'draft'}">${p.status || 'DRAFT'}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
    }
  }

  /* --------------------------------------------------------------------------
     3. PRODUCTS MANAGEMENT
     -------------------------------------------------------------------------- */
  function initProductsTable() {
    const products = window.BravadianDB.getProducts();
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => {
      const thumb = (p.images && p.images.front) ? p.images.front : '/images/logo.png';
      const coll = (p.collection || 'General').toUpperCase();
      const price = typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0);

      return `
        <tr>
          <td>
            <img src="${thumb}" alt="${p.name || ''}" style="width: 44px; height: 55px; object-fit: contain; background: #08080c; border-radius: 3px; border: 1px solid rgba(255, 255, 255, 0.1);">
          </td>
          <td>
            <strong>${p.name || 'Untitled'}</strong>
            <div style="color: #666; font-size: 0.72rem;">${p.sku || 'NO SKU'}</div>
          </td>
          <td>${coll}</td>
          <td>₹${price.toLocaleString('en-IN')}</td>
          <td>
            <span class="table-pill ${p.status === 'PUBLISHED' ? 'pub' : (p.status === 'SOLD_OUT' ? 'sold' : 'draft')}">
              ${p.status || 'DRAFT'}
            </span>
            ${p.isComingSoon ? '<span class="table-pill" style="margin-left: 4px; background: rgba(237, 28, 36, 0.15); color: #ED1C24; border: 1px solid rgba(237, 28, 36, 0.3);">SOON</span>' : ''}
          </td>
          <td>${p.newDrop ? '⚡ YES' : '—'}</td>
          <td>
            <button type="button" class="btn-action-icon" onclick="window.BravadianAdmin.editProduct('${p.id}')">✎ Edit</button>
            <button type="button" class="btn-action-icon danger" onclick="window.BravadianAdmin.deleteProduct('${p.id}')">✕ Delete</button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     4. VARIANT INVENTORY MATRIX
     -------------------------------------------------------------------------- */
  function initInventoryMatrix() {
    const products = window.BravadianDB.getProducts();
    const container = document.getElementById('inventoryMatrixContainer');
    if (!container) return;

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

    container.innerHTML = products.map(p => {
      const colors = (p.colors && p.colors.length > 0) ? p.colors : ['Black'];
      const coll = (p.collection || 'General').toUpperCase();

      return `
        <div style="margin-bottom: 2.5rem; background: #0c0c11; border: 1px solid var(--admin-border); border-radius: 4px; padding: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div>
              <h3 style="font-family: var(--font-display); font-size: 1.1rem; color: #fff;">${p.name || 'Untitled'}</h3>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--admin-ember);">SKU: ${p.sku || 'N/A'} // ${coll}</span>
            </div>
          </div>

          <div class="matrix-container">
            <table class="matrix-table">
              <thead>
                <tr>
                  <th style="text-align: left;">COLOR</th>
                  ${sizes.map(s => `<th>SIZE ${s}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${colors.map(color => `
                  <tr>
                    <td class="row-header">${color}</td>
                    ${sizes.map(size => {
                      const v = p.variants ? p.variants.find(item => item.color.toLowerCase() === color.toLowerCase() && item.size === size) : null;
                      const stock = v ? v.stock : 0;
                      return `
                        <td>
                          <input 
                            type="number" 
                            min="0"
                            class="matrix-input ${stock === 0 ? 'zero-stock' : ''}" 
                            data-prod="${p.id}"
                            data-color="${color}"
                            data-size="${size}"
                            value="${stock}"
                          >
                        </td>
                      `;
                    }).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');

    // Save All Inventory Button
    const saveBtn = document.getElementById('btnSaveInventoryMatrix');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        // Send only the cells that were edited, so stock sold since this page loaded is left alone
        const changes = [...container.querySelectorAll('.matrix-input')]
          .filter(input => input.value !== input.defaultValue)
          .map(input => ({
            productId: input.getAttribute('data-prod'),
            color: input.getAttribute('data-color'),
            size: input.getAttribute('data-size'),
            stock: input.value
          }));
        if (!changes.length) {
          alert('No stock numbers were changed.');
          return;
        }

        const label = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = 'SAVING…';
        try {
          const n = await window.BravadianDB.setStock(changes);
          await refreshFromSupabase();
          alert(`Stock saved for ${n} size${n === 1 ? '' : 's'}.`);
        } catch (err) {
          alert(`Stock was NOT saved: ${err.message}`);
        } finally {
          saveBtn.disabled = false;
          saveBtn.textContent = label;
          initDashboard();
          initInventoryMatrix();
        }
      };
    }
  }

  /* --------------------------------------------------------------------------
     ORDERS
     -------------------------------------------------------------------------- */
  // Order details are typed by shoppers, so every value is escaped before it is shown
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rupees = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
  const ORDER_STATUSES = ['NEW', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  const ordersState = { list: [], status: '', query: '', open: null, loaded: false };

  function initOrders() {
    const refresh = document.getElementById('btnRefreshOrders');
    const filters = document.getElementById('ordersFilters');
    const search = document.getElementById('ordersSearch');
    const body = document.getElementById('ordersTableBody');
    if (!body || body.dataset.bound) return;
    body.dataset.bound = '1';

    if (refresh) refresh.onclick = () => loadOrders();
    if (filters) filters.addEventListener('click', (e) => {
      const chip = e.target.closest('.orders-chip');
      if (!chip) return;
      filters.querySelectorAll('.orders-chip').forEach(c => c.classList.toggle('is-on', c === chip));
      ordersState.status = chip.dataset.status;
      renderOrders();
    });
    if (search) search.addEventListener('input', () => { ordersState.query = search.value.trim().toLowerCase(); renderOrders(); });

    body.addEventListener('click', (e) => {
      if (e.target.closest('select, a, button')) return;
      const row = e.target.closest('tr[data-id]');
      if (!row) return;
      const id = Number(row.dataset.id);
      ordersState.open = ordersState.open === id ? null : id;
      renderOrders();
    });
    body.addEventListener('change', async (e) => {
      const sel = e.target.closest('select[data-order]');
      if (!sel) return;
      const id = Number(sel.dataset.order);
      const order = ordersState.list.find(o => o.id === id);
      const next = sel.value;
      if (!order || next === order.status) return;
      if (next === 'CANCELLED' && !confirm(`Cancel order ${order.order_number}? Its stock will be put back.`)) { sel.value = order.status; return; }
      if (order.status === 'CANCELLED' && !confirm(`Re-open order ${order.order_number}? Its stock will be taken off again.`)) { sel.value = order.status; return; }
      sel.disabled = true;
      try {
        const saved = await window.BravadianDB.updateOrderStatus(id, next);
        Object.assign(order, saved);
        await refreshFromSupabase(); // stock may have changed
        initInventoryMatrix();
      } catch (err) {
        alert(`Status was NOT changed: ${err.message}`);
      }
      renderOrders();
    });

    loadOrders();
  }

  async function loadOrders() {
    const note = document.getElementById('ordersNote');
    if (!window.BravadianDB.isSupabaseConnected()) {
      if (note) note.textContent = 'Orders are stored in Supabase. Connect it to see them.';
      return;
    }
    if (note) note.textContent = 'Loading orders…';
    try {
      ordersState.list = await window.BravadianDB.getOrders();
      ordersState.loaded = true;
      if (note) note.textContent = '';
    } catch (err) {
      if (note) note.textContent = `Could not load orders: ${err.message}`;
    }
    renderOrders();
  }

  function renderOrders() {
    const body = document.getElementById('ordersTableBody');
    const navCount = document.getElementById('ordersNavCount');
    const note = document.getElementById('ordersNote');
    if (!body) return;

    const newCount = ordersState.list.filter(o => o.status === 'NEW').length;
    if (navCount) { navCount.textContent = newCount; navCount.hidden = newCount === 0; }

    const q = ordersState.query;
    const rows = ordersState.list.filter(o =>
      (!ordersState.status || o.status === ordersState.status) &&
      (!q || [o.order_number, o.customer_name, o.phone, o.city].some(v => String(v || '').toLowerCase().includes(q))));

    if (ordersState.loaded && note && !note.textContent.startsWith('Could not')) {
      note.textContent = rows.length === ordersState.list.length
        ? `${rows.length} order${rows.length === 1 ? '' : 's'}${newCount ? ` · ${newCount} new` : ''}`
        : `${rows.length} of ${ordersState.list.length} orders`;
    }

    if (!rows.length) {
      body.innerHTML = `<tr><td colspan="6" class="orders-empty">${ordersState.loaded ? 'No orders match.' : ''}</td></tr>`;
      return;
    }

    body.innerHTML = rows.map(o => {
      const items = Array.isArray(o.items) ? o.items : [];
      const qty = items.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
      const placed = new Date(o.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
      const isOpen = ordersState.open === o.id;
      const row = `
        <tr data-id="${o.id}" class="order-row${isOpen ? ' is-open' : ''}">
          <td><strong>${esc(o.order_number)}</strong></td>
          <td>${esc(placed)}</td>
          <td>${esc(o.customer_name)}<br><small class="orders-muted">${esc(o.phone)} · ${esc(o.city)}</small></td>
          <td>${qty} item${qty === 1 ? '' : 's'}</td>
          <td>${rupees(o.total)}</td>
          <td>
            <select class="admin-select order-status s-${esc(String(o.status).toLowerCase())}" data-order="${o.id}" aria-label="Status of ${esc(o.order_number)}">
              ${ORDER_STATUSES.map(s => `<option value="${s}" ${s === o.status ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </td>
        </tr>`;
      if (!isOpen) return row;

      const address = [o.address, o.landmark && `Near ${o.landmark}`, `${o.city}, ${o.state} ${o.pincode}`].filter(Boolean).map(esc).join('<br>');
      const phone = String(o.phone || '').replace(/\D/g, '');
      return row + `
        <tr class="order-detail"><td colspan="6">
          <div class="order-detail-grid">
            <div>
              <h4>DELIVER TO</h4>
              <p>${esc(o.customer_name)}<br>${address}</p>
              <p>
                <a href="tel:+91${esc(phone)}">📞 +91 ${esc(phone)}</a><br>
                <a href="https://wa.me/91${esc(phone)}?text=${encodeURIComponent(`Hi ${o.customer_name}, this is BRAVADIAN about your order ${o.order_number}.`)}" target="_blank" rel="noopener">💬 WhatsApp the customer</a>
                ${o.email ? `<br><a href="mailto:${esc(o.email)}">✉ ${esc(o.email)}</a>` : ''}
              </p>
            </div>
            <div>
              <h4>ITEMS</h4>
              <table class="order-items">
                ${items.map(it => `
                  <tr>
                    <td>${esc(it.name)}<br><small class="orders-muted">${esc(it.color)} · ${esc(it.size)}</small></td>
                    <td>× ${esc(it.quantity)}</td>
                    <td>${rupees(Number(it.price) * Number(it.quantity))}</td>
                  </tr>`).join('')}
                <tr class="order-sum"><td colspan="2">Subtotal</td><td>${rupees(o.subtotal)}</td></tr>
                <tr class="order-sum"><td colspan="2">Delivery</td><td>${Number(o.shipping) ? rupees(o.shipping) : 'FREE'}</td></tr>
                <tr class="order-sum order-total"><td colspan="2">Total</td><td>${rupees(o.total)}</td></tr>
              </table>
            </div>
          </div>
        </td></tr>`;
    }).join('');
  }

  // Scrolling the page while a number box has focus would change it (599 → 569); let the page scroll instead
  document.addEventListener('wheel', (e) => {
    const el = document.activeElement;
    if (el && el.type === 'number' && el === e.target) el.blur();
  }, { passive: true });

  // Reloads the catalog from Supabase so the admin sees current stock (orders change it too)
  async function refreshFromSupabase() {
    if (window.BravadianDB.isSupabaseConnected()) await window.BravadianDB.fetchRemoteCatalog();
  }

  /* --------------------------------------------------------------------------
     5. COLLECTIONS TABLE
     -------------------------------------------------------------------------- */
  function initCollectionsTable() {
    const collections = window.BravadianDB.getCollections();
    const tbody = document.getElementById('collectionsTableBody');
    if (!tbody) return;

    tbody.innerHTML = collections.map(c => `
      <tr>
        <td><strong>${c.name}</strong></td>
        <td><code>${c.slug}</code></td>
        <td>${c.description}</td>
        <td><span class="table-pill pub">${c.isActive ? 'ACTIVE' : 'INACTIVE'}</span></td>
        <td>
          <button type="button" class="btn-action-icon" onclick="window.BravadianAdmin.editCollection('${c.id}')">✎ Edit</button>
        </td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     6. SIZE GUIDE EDITOR
     -------------------------------------------------------------------------- */
  function initSizeGuideEditor() {
    const guide = window.BravadianDB.getSizeGuide();
    const tbody = document.getElementById('sizeGuideEditorBody');
    if (!tbody) return;

    tbody.innerHTML = guide.map((row, idx) => `
      <tr>
        <td><strong>${row.size}</strong></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="chest" value="${row.chest ?? ''}" min="1" max="80" required></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="length" value="${row.length ?? ''}" min="1" max="80" required></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="shoulder" value="${row.shoulder ?? ''}" min="1" max="80" required></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="sleeve" value="${row.sleeve ?? ''}" min="1" max="80" required></td>
      </tr>
    `).join('');

    const saveBtn = document.getElementById('btnSaveSizeGuide');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        // Every cell needs a real measurement: a blank or 0 would show as 0" in the shop's chart
        // and throw off the fit finder, which picks sizes from these numbers.
        const next = guide.map(row => ({ ...row }));
        for (const inp of tbody.querySelectorAll('input')) {
          const v = parseFloat(inp.value);
          if (!(v > 0)) {
            inp.focus();
            alert('Fill in every measurement (in inches) before saving.');
            return;
          }
          next[parseInt(inp.getAttribute('data-idx'), 10)][inp.getAttribute('data-field')] = v;
        }
        saveBtn.disabled = true;
        try {
          localStorage.setItem('bravadian_size_guide', JSON.stringify(next));
          next.forEach((row, i) => Object.assign(guide[i], row));
          if (window.BravadianDB.isSupabaseConnected()) {
            await window.BravadianDB.syncSizeGuideToSupabase(next, { throwOnError: true });
            alert('Size chart saved. Shoppers see it on their next visit.');
          } else {
            alert('Saved in this browser only: Supabase is not connected, so the live shop still shows the old chart.');
          }
        } catch (err) {
          alert(`Saved in this browser, but the live shop was NOT updated:
${err.message || err}`);
        } finally {
          saveBtn.disabled = false;
        }
      };
    }
  }

  /* --------------------------------------------------------------------------
     7. SITE SETTINGS FORM
     -------------------------------------------------------------------------- */
  function initSettingsForm() {
    const s = window.BravadianDB.getSettings();
    document.getElementById('cfgBrandName').value = s.brandName || 'BRAVADIAN';
    document.getElementById('cfgTagline').value = s.tagline || 'BRAVE INDIAN';
    document.getElementById('cfgWhatsapp').value = s.whatsappNumber || '';
    document.getElementById('cfgInstagram').value = s.instagramUrl || '';
    document.getElementById('cfgShippingFee').value = s.shippingFee ?? 0;   // 0 = free delivery; || would turn it into 99
    if (s.launchEndsAt && document.getElementById('cfgLaunchEndsAt')) {
      const d = new Date(s.launchEndsAt);
      document.getElementById('cfgLaunchEndsAt').value = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    }
    document.getElementById('cfgFreeShipThreshold').value = s.freeShippingThreshold ?? 0;
    document.getElementById('cfgSupportEmail').value = s.supportEmail || '';

    // Announcement Marquee
    if (document.getElementById('cfgAnnouncementText')) {
      document.getElementById('cfgAnnouncementText').value = s.announcementText ?? '';
    }
    if (document.getElementById('cfgAnnouncementWaText')) {
      document.getElementById('cfgAnnouncementWaText').value = s.announcementWaText ?? '';
    }
    if (document.getElementById('cfgAnnouncementEnabled')) {
      document.getElementById('cfgAnnouncementEnabled').checked = s.announcementEnabled !== false;
    }

    // Hero Copy
    if (document.getElementById('cfgHeroTag')) {
      document.getElementById('cfgHeroTag').value = s.heroTag ?? '';
    }
    if (document.getElementById('cfgHeroTitle')) {
      document.getElementById('cfgHeroTitle').value = s.heroTitle ?? '';
    }
    if (document.getElementById('cfgHeroDesc')) {
      document.getElementById('cfgHeroDesc').value = s.heroDesc ?? '';
    }
    if (document.getElementById('cfgHeroBgImage')) {
      document.getElementById('cfgHeroBgImage').value = s.heroBgImage ?? '';
    }
    if (document.getElementById('cfgHeroTicker')) {
      document.getElementById('cfgHeroTicker').value = s.heroTicker ?? '';
    }

    // WhatsApp VIP Concierge Message Template
    if (document.getElementById('cfgVipTemplate')) {
      document.getElementById('cfgVipTemplate').value = s.vipMessageTemplate ?? '';
    }

    const saveBtn = document.getElementById('btnSaveSettings');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        const payload = {
          brandName: document.getElementById('cfgBrandName').value.trim(),
          tagline: document.getElementById('cfgTagline').value.trim(),
          whatsappNumber: document.getElementById('cfgWhatsapp').value.trim(),
          instagramUrl: document.getElementById('cfgInstagram').value.trim(),
          shippingFee: parseFloat(document.getElementById('cfgShippingFee').value) || 0,
          launchEndsAt: document.getElementById('cfgLaunchEndsAt').value ? new Date(document.getElementById('cfgLaunchEndsAt').value).toISOString() : '',
          freeShippingThreshold: parseFloat(document.getElementById('cfgFreeShipThreshold').value) || 0,
          supportEmail: document.getElementById('cfgSupportEmail').value.trim()
        };

        if (document.getElementById('cfgAnnouncementText')) {
          payload.announcementText = document.getElementById('cfgAnnouncementText').value.trim();
        }
        if (document.getElementById('cfgAnnouncementWaText')) {
          payload.announcementWaText = document.getElementById('cfgAnnouncementWaText').value.trim();
        }
        if (document.getElementById('cfgAnnouncementEnabled')) {
          payload.announcementEnabled = document.getElementById('cfgAnnouncementEnabled').checked;
        }
        if (document.getElementById('cfgHeroTag')) {
          payload.heroTag = document.getElementById('cfgHeroTag').value.trim();
        }
        if (document.getElementById('cfgHeroTitle')) {
          payload.heroTitle = document.getElementById('cfgHeroTitle').value.trim();
        }
        if (document.getElementById('cfgHeroDesc')) {
          payload.heroDesc = document.getElementById('cfgHeroDesc').value.trim();
        }
        if (document.getElementById('cfgHeroBgImage')) {
          payload.heroBgImage = document.getElementById('cfgHeroBgImage').value.trim();
        }
        if (document.getElementById('cfgHeroTicker')) {
          payload.heroTicker = document.getElementById('cfgHeroTicker').value.trim();
        }
        if (document.getElementById('cfgVipTemplate')) {
          payload.vipMessageTemplate = document.getElementById('cfgVipTemplate').value.trim();
        }

        saveBtn.disabled = true;
        try {
          await window.BravadianDB.saveSettings(payload);
          alert('Store & marketing settings saved.');
        } catch (err) {
          alert(`Settings were NOT saved to the database: ${err.message}

They are saved on this computer only. Fix the problem and save again.`);
        } finally {
          saveBtn.disabled = false;
        }
      };
    }
  }

  /* --------------------------------------------------------------------------
     8. SUPABASE CLOUD PANEL & SYNC
     -------------------------------------------------------------------------- */
  function initSupabasePanel() {
    // The database is fixed in js/data.js (live on the website, test on localhost); this tab shows
    // which one is in use and can refresh from it or push this browser's catalog to it.
    const status = document.getElementById('dbPaneStatus');
    if (status) {
      const db = window.BravadianDB;
      status.textContent = db.isSupabaseConnected()
        ? `Connected to the ${db.dbLabel} database (${db.dbUrl}).`
        : 'Not connected. The catalog below is the copy saved in this browser.';
    }
    checkSupabaseStatus();

    // Sync Local Catalog to Supabase
    const syncBtn = document.getElementById('btnSyncToSupabase');
    if (syncBtn) {
      syncBtn.onclick = async () => {
        if (!window.BravadianDB.isSupabaseConnected()) {
          alert('Not connected to the database, so there is nothing to sync to.');
          return;
        }
        if (!confirm(`Push every product, collection, size guide row and setting saved in this browser to the ${window.BravadianDB.dbLabel} database?\n\nThis overwrites what is there now (stock counts are kept). Use it only to restore from this browser's copy.`)) return;

        syncBtn.textContent = 'SYNCING COLLECTIONS...';
        try {
          // 1. Sync Collections first to prevent foreign key errors
          const collections = window.BravadianDB.getCollections();
          await window.BravadianDB.syncCollectionsToSupabase(collections);

          // 2. Sync Products
          syncBtn.textContent = 'SYNCING PRODUCTS...';
          const products = window.BravadianDB.getProducts();
          for (const p of products) {
            await window.BravadianDB.syncProductToSupabase(p);
          }

          // 3. Sync Size Guide
          syncBtn.textContent = 'SYNCING SIZE SPECIFICATIONS...';
          const guide = window.BravadianDB.getSizeGuide();
          await window.BravadianDB.syncSizeGuideToSupabase(guide);

          // 4. Sync Settings
          syncBtn.textContent = 'SYNCING CONFIGURATION...';
          const settings = window.BravadianDB.getSettings();
          await window.BravadianDB.syncSettingsToSupabase(settings);

          alert(`✓ SYNC COMPLETE!\n\nSuccessfully synced to Supabase:\n• ${collections.length} Collections\n• ${products.length} Products & Relics\n• ${guide.length} Size Matrix Rows\n• Core Site Configuration & Shipping Rules`);
        } catch (err) {
          alert(`Sync failed: ${err.message || err}`);
        } finally {
          syncBtn.textContent = 'PUSH THIS CATALOG TO THE DATABASE';
        }
      };
    }

    // Pull Remote Catalog from Supabase
    const pullBtn = document.getElementById('btnPullFromSupabase');
    if (pullBtn) {
      pullBtn.onclick = async () => {
        if (!window.BravadianDB.isSupabaseConnected()) {
          alert('Not connected to the database, so there is nothing to refresh from.');
          return;
        }

        pullBtn.textContent = 'PULLING FROM SUPABASE...';
        try {
          const res = await window.BravadianDB.fetchRemoteCatalog();
          if (res && res.success) {
            initDashboard();
            initProductsTable();
            initInventoryMatrix();
            initCollectionsTable();
            initSizeGuideEditor();
            initSettingsForm();
            alert(`✓ CATALOG REFRESHED FROM SUPABASE!\n\nLoaded:\n• ${res.summary.collections} Collections\n• ${res.summary.products} Products\n• ${res.summary.sizeGuide} Size Guide specifications\n• ${res.summary.settings} Configuration bundles`);
          } else {
            alert(`Catalog pull warning: ${res ? res.message || res.error : 'Unknown error'}`);
          }
        } catch (err) {
          alert(`Failed to pull from Supabase: ${err.message || err}`);
        } finally {
          pullBtn.textContent = 'REFRESH FROM THE DATABASE';
        }
      };
    }
  }

  function checkSupabaseStatus() {
    const pill = document.getElementById('supabasePillTopbar');
    const text = document.getElementById('supabaseStatusText');
    const isConn = window.BravadianDB.isSupabaseConnected();

    if (isConn) {
      if (pill) pill.classList.add('connected');
      if (text) text.textContent = `${window.BravadianDB.dbLabel} database: connected`;
    } else {
      if (pill) pill.classList.remove('connected');
      if (text) text.textContent = 'Database: not connected';
    }
  }

  /* --------------------------------------------------------------------------
     9. EXPORT & IMPORT
     -------------------------------------------------------------------------- */
  function initExportImport() {
    const exportBtn = document.getElementById('btnExportJSON');
    if (exportBtn) {
      exportBtn.onclick = () => {
        const data = window.BravadianDB.exportAllData();
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bravadian-catalog-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
      };
    }

    const resetBtn = document.getElementById('btnResetFactory');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm('Reset entire catalog to factory defaults? Any custom products will be replaced with original demo products.')) {
          window.BravadianDB.resetToFactoryDefaults();
          alert('Catalog reset to factory defaults.');
          location.reload();
        }
      };
    }

    const applyImportBtn = document.getElementById('btnApplyImport');
    if (applyImportBtn) {
      applyImportBtn.onclick = () => {
        const raw = document.getElementById('importJsonTextarea').value.trim();
        if (!raw) {
          alert('Please paste JSON data first.');
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          window.BravadianDB.importData(parsed);
          alert('Data imported successfully!');
          location.reload();
        } catch (e) {
          alert(`Import failed: ${e.message}`);
        }
      };
    }
  }

  /* --------------------------------------------------------------------------
     10. PRODUCT ADD / EDIT MODAL
     -------------------------------------------------------------------------- */
  function initModals() {
    const modal = document.getElementById('productFormModal');
    const openBtn = document.getElementById('btnOpenAddModal');
    const topbarAddBtn = document.getElementById('btnAddNewProduct');
    const closeBtn = document.getElementById('closeProductModalBtn');
    const cancelBtn = document.getElementById('cancelProductBtn');
    const form = document.getElementById('productEditForm');

    // Image preview helper
    function updateImgPreview(inputElem, boxElem, imgElem) {
      if (!inputElem || !boxElem || !imgElem) return;
      const url = inputElem.value.trim();
      if (url) {
        imgElem.src = url;
        imgElem.onload = () => boxElem.classList.add('has-img');
        imgElem.onerror = () => {
          boxElem.classList.remove('has-img');
        };
        boxElem.classList.add('has-img');
      } else {
        boxElem.classList.remove('has-img');
        imgElem.src = '';
      }
    }

    const frontIn = document.getElementById('editProdImgFront');
    const frontBox = document.getElementById('previewBoxFront');
    const frontImg = document.getElementById('previewImgFront');
    if (frontIn) frontIn.oninput = () => updateImgPreview(frontIn, frontBox, frontImg);

    const backIn = document.getElementById('editProdImgBack');
    const backBox = document.getElementById('previewBoxBack');
    const backImg = document.getElementById('previewImgBack');
    if (backIn) backIn.oninput = () => updateImgPreview(backIn, backBox, backImg);

    const closeIn = document.getElementById('editProdImgCloseup');
    const closeBox = document.getElementById('previewBoxCloseup');
    const closeImg = document.getElementById('previewImgCloseup');
    if (closeIn) closeIn.oninput = () => updateImgPreview(closeIn, closeBox, closeImg);

    const lifeIn = document.getElementById('editProdImgLifestyle');
    const lifeBox = document.getElementById('previewBoxLifestyle');
    const lifeImg = document.getElementById('previewImgLifestyle');
    if (lifeIn) lifeIn.oninput = () => updateImgPreview(lifeIn, lifeBox, lifeImg);

    const life2In = document.getElementById('editProdImgLifestyle2');
    const life2Box = document.getElementById('previewBoxLifestyle2');
    const life2Img = document.getElementById('previewImgLifestyle2');
    if (life2In) life2In.oninput = () => updateImgPreview(life2In, life2Box, life2Img);

    // ---- Colour photos: one row per colour (product photo + model photo) ----
    let colourPhotoState = {};
    const colourKey = (c) => c.trim().toLowerCase().replace(/\s+/g, '-');
    function readColourRows() {
      const out = {};
      document.querySelectorAll('#colourPhotoRows .colour-row').forEach(row => {
        const front = row.querySelector('[data-kind="front"]').value.trim();
        const model = row.querySelector('[data-kind="model"]').value.trim();
        const prev = colourPhotoState[row.dataset.colour] || {};
        if (front || model) out[row.dataset.colour] = { ...prev, front: front || undefined, model: model || undefined };
      });
      return out;
    }
    function renderColourRows() {
      const box = document.getElementById('colourPhotoRows');
      const input = document.getElementById('editProdColors');
      if (!box || !input) return;
      if (box.children.length) colourPhotoState = { ...colourPhotoState, ...readColourRows() };
      const colours = input.value.split(',').map(c => c.trim()).filter(Boolean);
      box.innerHTML = colours.map(c => {
        const cur = colourPhotoState[c] || {};
        const slot = (kind, label) => `
          <div class="colour-slot">
            <span class="colour-slot-label">${label}</span>
            <div class="colour-slot-thumb">${cur[kind] ? `<img src="${cur[kind]}" alt="">` : '<span>NO IMAGE</span>'}</div>
            <input type="text" class="admin-input" data-kind="${kind}" value="${cur[kind] || ''}" placeholder="Paste a link or upload">
            <label class="admin-upload-btn">UPLOAD<input type="file" accept="image/*" class="colour-upload" data-kind="${kind}" hidden></label>
          </div>`;
        return `<div class="colour-row" data-colour="${c}">
          <div class="colour-row-name"><i style="background:${({ black: '#111', white: '#fff', ivory: '#EDE6D6', red: '#C62828', 'royal blue': '#1F4FD1' })[c.toLowerCase()] || '#888'}"></i>${c}</div>
          ${slot('front', 'Product photo')}${slot('model', 'Model photo')}
        </div>`;
      }).join('') || '<p class="colour-photos-empty">Add colours above to upload photos for each one.</p>';
      box.querySelectorAll('input[data-kind]').forEach(inp => {
        if (inp.type === 'file') return;
        inp.oninput = () => {
          const t = inp.closest('.colour-slot').querySelector('.colour-slot-thumb');
          t.innerHTML = inp.value.trim() ? `<img src="${inp.value.trim()}" alt="">` : '<span>NO IMAGE</span>';
        };
      });
      box.querySelectorAll('.colour-upload').forEach(fileIn => {
        fileIn.onchange = async () => {
          const file = fileIn.files && fileIn.files[0];
          if (!file) return;
          const row = fileIn.closest('.colour-row');
          const target = fileIn.closest('.colour-slot').querySelector('input[type="text"]');
          const lbl = fileIn.closest('.admin-upload-btn');
          lbl.firstChild.textContent = 'UPLOADING…';
          try {
            const slug = (document.getElementById('editProdSlug').value || 'product').trim();
            target.value = await window.BravadianDB.uploadProductImage(file, `${slug}/${colourKey(row.dataset.colour)}-${fileIn.dataset.kind}`);
            target.dispatchEvent(new Event('input'));
            lbl.firstChild.textContent = 'UPLOADED ✓';
          } catch (err) {
            lbl.firstChild.textContent = 'UPLOAD';
            alert(`Upload failed: ${err.message}`);
          }
          fileIn.value = '';
        };
      });
    }
    const coloursInput = document.getElementById('editProdColors');
    if (coloursInput) coloursInput.addEventListener('input', renderColourRows);
    window.BravadianColourRows = {
      load(map) {
        colourPhotoState = map ? { ...map } : {};
        const box = document.getElementById('colourPhotoRows');
        if (box) box.innerHTML = '';
        renderColourRows();
      },
      read: readColourRows
    };

    document.querySelectorAll('.admin-img-upload').forEach(fileIn => {
      fileIn.onchange = async () => {
        const file = fileIn.files && fileIn.files[0];
        if (!file) return;
        const target = document.getElementById(fileIn.dataset.target);
        const status = document.querySelector(`.admin-upload-status[data-for="${fileIn.dataset.target}"]`);
        if (status) status.textContent = 'Uploading…';
        try {
          const slug = (document.getElementById('editProdSlug').value || 'product').trim();
          const slot = fileIn.dataset.target.replace('editProdImg', '').toLowerCase();
          target.value = await window.BravadianDB.uploadProductImage(file, `${slug}/${slot}`);
          target.dispatchEvent(new Event('input'));
          if (status) status.textContent = 'Uploaded. Save the product to publish it.';
        } catch (err) {
          if (status) status.textContent = `Upload failed: ${err.message}`;
        }
        fileIn.value = '';
      };
    });

    function openModal() {
      // Populate collection options
      const colSelect = document.getElementById('editProdCollection');
      const cols = window.BravadianDB.getCollections();
      colSelect.innerHTML = cols.filter(c => c.slug !== 'all').map(c => `
        <option value="${c.slug}">${c.name}</option>
      `).join('');

      modal.classList.add('is-open');
    }

    function closeModal() {
      modal.classList.remove('is-open');
      form.reset();
      document.getElementById('editProdId').value = '';
      if (document.getElementById('editProdRelicTag')) document.getElementById('editProdRelicTag').value = '';
      if (document.getElementById('editProdRelicBadge')) document.getElementById('editProdRelicBadge').value = '';
      if (document.getElementById('editProdGSM')) document.getElementById('editProdGSM').value = '240';
      if (document.getElementById('editProdComingSoon')) document.getElementById('editProdComingSoon').checked = false;
      if (document.getElementById('editProdColors')) document.getElementById('editProdColors').value = 'Black, White';
      if (window.BravadianColourRows) window.BravadianColourRows.load(null);

      [frontBox, backBox, closeBox, lifeBox].forEach(b => b && b.classList.remove('has-img'));
      [frontImg, backImg, closeImg, lifeImg].forEach(i => i && (i.src = ''));

      document.getElementById('productModalHeading').textContent = 'ADD PRODUCT';
    }

    if (openBtn) openBtn.onclick = openModal;
    if (topbarAddBtn) topbarAddBtn.onclick = openModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    // Handle Form Submit
    if (form) {
      form.onsubmit = async (e) => {
        e.preventDefault();
        const id = document.getElementById('editProdId').value || 'prod-' + Date.now();
        const name = document.getElementById('editProdName').value.trim();
        const slug = document.getElementById('editProdSlug').value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const collection = document.getElementById('editProdCollection').value;
        const price = parseFloat(document.getElementById('editProdPrice').value) || 0;
        const comparePrice = parseFloat(document.getElementById('editProdCompare').value) || null;
        const launchPrice = parseFloat(document.getElementById('editProdLaunch').value) || null;
        const fabric = document.getElementById('editProdFabric').value.trim();
        const gsm = parseInt(document.getElementById('editProdGSM')?.value, 10) || 240;
        const fit = document.getElementById('editProdFit').value.trim();
        const material = document.getElementById('editProdMaterial').value.trim();
        const relicTag = document.getElementById('editProdRelicTag')?.value.trim() || '';
        const relicBadge = document.getElementById('editProdRelicBadge')?.value.trim() || '';
        const sku = document.getElementById('editProdSKU').value.trim();
        const status = document.getElementById('editProdStatus').value;
        const desc = document.getElementById('editProdDesc').value.trim();
        const featured = document.getElementById('editProdFeatured').checked;
        const newDrop = document.getElementById('editProdNewDrop').checked;
        const isComingSoon = document.getElementById('editProdComingSoon') ? document.getElementById('editProdComingSoon').checked : false;

        // Existing product lookup
        const existing = window.BravadianDB.getProductBySlug(id);

        // Multi-Angle Images
        const imgFrontVal = frontIn ? frontIn.value.trim() : '';
        const imgBackVal = backIn ? backIn.value.trim() : '';
        const imgCloseupVal = closeIn ? closeIn.value.trim() : '';
        const imgLifestyleVal = lifeIn ? lifeIn.value.trim() : '';
        const imgLifestyle2Val = life2In ? life2In.value.trim() : '';

        const images = {
          front: imgFrontVal || (existing && existing.images && existing.images.front ? existing.images.front : window.BravadianDefaults.createTeeSVG(name, collection, '#121216', '#ED1C24', 'front')),
          back: imgBackVal || undefined,
          closeup: imgCloseupVal || undefined,
          lifestyle: imgLifestyleVal || undefined,
          lifestyle2: imgLifestyle2Val || undefined
        };
        const colourPhotos = window.BravadianColourRows ? window.BravadianColourRows.read() : {};
        if (Object.keys(colourPhotos).length) images.colors = colourPhotos;

        // Available Colors
        const colorsRaw = document.getElementById('editProdColors') ? document.getElementById('editProdColors').value.trim() : '';
        let colors = colorsRaw.split(',').map(c => c.trim()).filter(Boolean);
        if (colors.length === 0) colors = existing && existing.colors ? existing.colors : ['Black', 'White'];

        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

        // Build or preserve variants matrix
        let variants = existing && existing.variants ? [...existing.variants] : [];
        colors.forEach(col => {
          sizes.forEach(sz => {
            const hasVar = variants.some(v => v.color.toLowerCase() === col.toLowerCase() && v.size === sz);
            if (!hasVar) {
              // New colours start sold out; set real numbers on the stock screen
              variants.push({ color: col, size: sz, stock: 0 });
            }
          });
        });
        // Filter out variants of colors that were removed
        variants = variants.filter(v => colors.some(col => col.toLowerCase() === v.color.toLowerCase()));

        // The slug is the product's web address, so no two products may share one
        const clash = window.BravadianDB.getProducts().find(p => p.slug === slug && p.id !== id);
        if (clash) {
          alert(`The link "${slug}" is already used by "${clash.name}". Choose a different slug.`);
          return;
        }

        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;
        let saved;
        try {
          saved = await window.BravadianDB.saveProduct({
            id,
            name,
            slug,
            collection,
            price,
            comparePrice,
            launchPrice,
            fabric,
            gsm,
            fit,
            material,
            sku,
            status,
            description: desc,
            featured,
            newDrop,
            isComingSoon,
            relicTag: relicTag || (existing ? existing.relicTag : null),
            relicBadge: relicBadge || (existing ? existing.relicBadge : null),
            colors,
            sizes,
            variants,
            images
          });
          // The database keeps live stock for existing sizes, so reload to show the real numbers
          await refreshFromSupabase();
        } catch (err) {
          alert(`Product was NOT saved to the database: ${err.message || err}\n\nIt is saved on this computer only. Fix the problem and save again.`);
          return;
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }

        closeModal();
        initProductsTable();
        initDashboard();
        initInventoryMatrix();
        alert(`Product "${saved.name}" saved.`);
      };
    }
  }

  // Window export for action triggers
  window.BravadianAdmin = {
    switchTab,
    editProduct(id) {
      const p = window.BravadianDB.getProductBySlug(id);
      if (!p) return;

      document.getElementById('editProdId').value = p.id;
      document.getElementById('editProdName').value = p.name;
      document.getElementById('editProdSlug').value = p.slug;
      document.getElementById('editProdPrice').value = p.price;
      document.getElementById('editProdCompare').value = p.comparePrice || '';
      document.getElementById('editProdLaunch').value = p.launchPrice || '';
      const l2In = document.getElementById('editProdImgLifestyle2');
      if (l2In) { l2In.value = (p.images && p.images.lifestyle2) || ''; l2In.dispatchEvent(new Event('input')); }
      document.getElementById('editProdFabric').value = p.fabric || '240 GSM French Interlock Combed Cotton';
      if (document.getElementById('editProdGSM')) document.getElementById('editProdGSM').value = p.gsm || 240;
      document.getElementById('editProdFit').value = p.fit || 'Oversized Boxy Silhouette';
      document.getElementById('editProdMaterial').value = p.material || '100% Combed Cotton';
      if (document.getElementById('editProdRelicTag')) document.getElementById('editProdRelicTag').value = p.relicTag || '';
      if (document.getElementById('editProdRelicBadge')) document.getElementById('editProdRelicBadge').value = p.relicBadge || '';
      document.getElementById('editProdSKU').value = p.sku || '';
      document.getElementById('editProdStatus').value = p.status;
      document.getElementById('editProdDesc').value = p.description;
      document.getElementById('editProdFeatured').checked = !!p.featured;
      document.getElementById('editProdNewDrop').checked = !!p.newDrop;
      if (document.getElementById('editProdComingSoon')) document.getElementById('editProdComingSoon').checked = !!p.isComingSoon;

      // Populate Colors
      if (document.getElementById('editProdColors')) {
        document.getElementById('editProdColors').value = p.colors ? p.colors.join(', ') : 'Black, White';
        if (window.BravadianColourRows) window.BravadianColourRows.load(p.images && p.images.colors);
      }

      // Populate Multi-Angle Images
      const frontIn = document.getElementById('editProdImgFront');
      const backIn = document.getElementById('editProdImgBack');
      const closeIn = document.getElementById('editProdImgCloseup');
      const lifeIn = document.getElementById('editProdImgLifestyle');

      const frontBox = document.getElementById('previewBoxFront');
      const backBox = document.getElementById('previewBoxBack');
      const closeBox = document.getElementById('previewBoxCloseup');
      const lifeBox = document.getElementById('previewBoxLifestyle');

      const frontImg = document.getElementById('previewImgFront');
      const backImg = document.getElementById('previewImgBack');
      const closeImg = document.getElementById('previewImgCloseup');
      const lifeImg = document.getElementById('previewImgLifestyle');

      // Placeholder drawings (data: URIs) are previewed but not put in the field, so the field
      // shows only real photo addresses
      const setValAndPreview = (inp, box, img, val) => {
        if (inp) inp.value = val && !String(val).startsWith('data:') ? val : '';
        if (box && img) {
          if (val) {
            img.src = val;
            box.classList.add('has-img');
          } else {
            box.classList.remove('has-img');
            img.src = '';
          }
        }
      };

      setValAndPreview(frontIn, frontBox, frontImg, p.images?.front);
      setValAndPreview(backIn, backBox, backImg, p.images?.back);
      setValAndPreview(closeIn, closeBox, closeImg, p.images?.closeup);
      setValAndPreview(lifeIn, lifeBox, lifeImg, p.images?.lifestyle);

      const colSelect = document.getElementById('editProdCollection');
      const cols = window.BravadianDB.getCollections();
      colSelect.innerHTML = cols.filter(c => c.slug !== 'all').map(c => `
        <option value="${c.slug}" ${c.slug === p.collection ? 'selected' : ''}>${c.name}</option>
      `).join('');

      document.getElementById('productModalHeading').textContent = 'EDIT PRODUCT';
      document.getElementById('productFormModal').classList.add('is-open');
    },
    deleteProduct(id) {
      if (confirm('Delete this product from catalog?')) {
        window.BravadianDB.deleteProduct(id);
        initProductsTable();
        initDashboard();
        initInventoryMatrix();
      }
    },
    editCollection(id) {
      alert('Collection editing is active. Use Collections Manager to manage slugs.');
    }
  };

})();
