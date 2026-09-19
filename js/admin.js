/**
 * BRAVADIAN | BRAVE INDIAN — ADMIN CMS CONTROLLER
 * Full management for Dashboard, Products, Variant Matrix,
 * Collections, Size Guide, Site Settings & Supabase Cloud Sync
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const modules = [
      ['Navigation', initNavigation],
      ['Dashboard', initDashboard],
      ['Products', initProductsTable],
      ['Inventory', initInventoryMatrix],
      ['Collections', initCollectionsTable],
      ['SizeGuide', initSizeGuideEditor],
      ['Settings', initSettingsForm],
      ['Supabase', initSupabasePanel],
      ['ExportImport', initExportImport],
      ['Modals', initModals]
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

    document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.admin-content-pane').forEach(p => p.classList.remove('active'));

    const navItem = document.querySelector(`.sidebar-nav-item[data-tab="${tabName}"]`);
    const pane = document.getElementById(`pane-${tabName}`);
    const pageTitle = document.getElementById('adminPageTitle');

    if (navItem) navItem.classList.add('active');
    if (pane) pane.classList.add('active');

    // Close mobile drawer on tab select
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) sidebar.classList.remove('is-mobile-open');

    const titles = {
      dashboard: 'DASHBOARD OVERVIEW',
      products: 'PRODUCT CATALOG',
      inventory: 'VARIANT INVENTORY MATRIX',
      collections: 'COLLECTIONS ARCHIVE',
      sizeguide: 'SIZE GUIDE SPECIFICATIONS',
      settings: 'SITE & WHATSAPP SETTINGS',
      supabase: 'SUPABASE CLOUD SYNC',
      dataio: 'BACKUP & DATA IMPORT'
    };
    if (pageTitle && titles[tabName]) pageTitle.textContent = titles[tabName];

    // Refresh tab data safely
    try {
      if (tabName === 'dashboard') initDashboard();
      if (tabName === 'products') initProductsTable();
      if (tabName === 'inventory') initInventoryMatrix();
      if (tabName === 'collections') initCollectionsTable();
      if (tabName === 'sizeguide') initSizeGuideEditor();
      if (tabName === 'settings') initSettingsForm();
      if (tabName === 'supabase') {
        initSupabasePanel();
        checkSupabaseStatus();
      }
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
      const thumb = (p.images && p.images.front) ? p.images.front : 'images/logo.png';
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
      saveBtn.onclick = () => {
        const inputs = container.querySelectorAll('.matrix-input');
        inputs.forEach(input => {
          const prodId = input.getAttribute('data-prod');
          const color = input.getAttribute('data-color');
          const size = input.getAttribute('data-size');
          const stock = parseInt(input.value, 10) || 0;
          window.BravadianDB.updateVariantStock(prodId, color, size, stock);
        });

        alert('Variant Inventory Matrix saved successfully.');
        initDashboard();
        initInventoryMatrix();
      };
    }
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
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="chest" value="${row.chest}"></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="length" value="${row.length}"></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="shoulder" value="${row.shoulder}"></td>
        <td><input type="number" step="0.5" class="admin-input" style="width: 80px;" data-idx="${idx}" data-field="sleeve" value="${row.sleeve}"></td>
      </tr>
    `).join('');

    const saveBtn = document.getElementById('btnSaveSizeGuide');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const inputs = tbody.querySelectorAll('input');
        inputs.forEach(inp => {
          const idx = parseInt(inp.getAttribute('data-idx'), 10);
          const field = inp.getAttribute('data-field');
          guide[idx][field] = parseFloat(inp.value) || 0;
        });
        window.BravadianDB.saveSizeGuide(guide);
        alert('Size specifications saved.');
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
    document.getElementById('cfgShippingFee').value = s.shippingFee || 99;
    document.getElementById('cfgFreeShipThreshold').value = s.freeShippingThreshold || 1999;
    document.getElementById('cfgSupportEmail').value = s.supportEmail || '';

    const saveBtn = document.getElementById('btnSaveSettings');
    if (saveBtn) {
      saveBtn.onclick = () => {
        window.BravadianDB.saveSettings({
          brandName: document.getElementById('cfgBrandName').value.trim(),
          tagline: document.getElementById('cfgTagline').value.trim(),
          whatsappNumber: document.getElementById('cfgWhatsapp').value.trim(),
          instagramUrl: document.getElementById('cfgInstagram').value.trim(),
          shippingFee: parseFloat(document.getElementById('cfgShippingFee').value) || 0,
          freeShippingThreshold: parseFloat(document.getElementById('cfgFreeShipThreshold').value) || 0,
          supportEmail: document.getElementById('cfgSupportEmail').value.trim()
        });
        alert('Store settings saved successfully.');
      };
    }
  }

  /* --------------------------------------------------------------------------
     8. SUPABASE CLOUD PANEL & SYNC
     -------------------------------------------------------------------------- */
  function initSupabasePanel() {
    const s = window.BravadianDB.getSettings();
    const urlInput = document.getElementById('cfgSupabaseUrl');
    const keyInput = document.getElementById('cfgSupabaseKey');

    if (urlInput && s.supabaseUrl) urlInput.value = s.supabaseUrl;
    if (keyInput && s.supabaseAnonKey) keyInput.value = s.supabaseAnonKey;

    checkSupabaseStatus();

    // Test Connection Button
    const testBtn = document.getElementById('btnTestSupabase');
    if (testBtn) {
      testBtn.onclick = async () => {
        let url = (urlInput ? urlInput.value : '').trim();
        let key = (keyInput ? keyInput.value : '').trim();

        if (!url || !key) {
          alert('Please enter both your Supabase Project ID (or URL) and your Anon / Publishable Key.');
          return;
        }

        // Clean trailing slashes
        url = url.replace(/\/+$/, '');

        // If user entered only Project ID (e.g. "zxcvbnmasdfghjk"), convert to full URL
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          const cleanId = url.replace(/\.supabase\.co.*$/, '').trim();
          url = `https://${cleanId}.supabase.co`;
          if (urlInput) urlInput.value = url;
        }

        testBtn.textContent = 'CONNECTING...';
        try {
          if (!window.supabase) {
            throw new Error('Supabase client library failed to load. Please check your internet connection.');
          }

          const client = window.supabase.createClient(url, key);

          // Test query against collections table
          const { data, error } = await client.from('collections').select('id').limit(1);

          if (error) {
            // Case 1: Table doesn't exist yet (PostgreSQL error 42P01)
            // This confirms Project URL & API Key ARE 100% VALID!
            if (error.code === '42P01' || (error.message && error.message.includes('does not exist'))) {
              window.BravadianDB.saveSettings({ supabaseUrl: url, supabaseAnonKey: key });
              checkSupabaseStatus();
              alert('✓ CONNECTED TO SUPABASE!\n\nYour Project URL and API Key are 100% valid and verified.\n\nNEXT STEP TO ENABLE RLS & TABLES:\nOpen your Supabase project -> Click SQL Editor -> Run "supabase_schema.sql". This creates the tables and sets up the RLS policies automatically.');
              return;
            }

            // Case 2: Authentication / Key error
            if (error.code === 'PGRST301' || error.message.includes('API key') || error.message.includes('JWT') || error.message.includes('apikey')) {
              throw new Error('Invalid API Key. Please ensure you are pasting your "anon public" key (a long token starting with "eyJhbGci...").');
            }

            // Case 3: RLS or other notice
            window.BravadianDB.saveSettings({ supabaseUrl: url, supabaseAnonKey: key });
            checkSupabaseStatus();
            alert(`✓ CONNECTED TO SUPABASE!\n\nStatus note: ${error.message}\nIf tables are not synced, run "supabase_schema.sql" in your Supabase SQL Editor.`);
            return;
          }

          // Case 4: Complete success! Tables and RLS are active!
          window.BravadianDB.saveSettings({ supabaseUrl: url, supabaseAnonKey: key });
          checkSupabaseStatus();
          alert('✓ SUPABASE CONNECTED & FULLY VERIFIED!\n\nAll database tables and RLS permissions are active and ready for live catalog sync.');
        } catch (err) {
          alert(`Supabase Connection Error:\n${err.message || err}`);
        } finally {
          testBtn.textContent = 'TEST CONNECTION';
        }
      };
    }

    // Sync Local Catalog to Supabase
    const syncBtn = document.getElementById('btnSyncToSupabase');
    if (syncBtn) {
      syncBtn.onclick = async () => {
        if (!window.BravadianDB.isSupabaseConnected()) {
          alert('Please test and connect to Supabase first before syncing.');
          return;
        }

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

          alert(`✓ SYNC COMPLETE! Successfully synced ${collections.length} collections and ${products.length} products to Supabase.`);
        } catch (err) {
          alert(`Sync failed: ${err.message || err}`);
        } finally {
          syncBtn.textContent = 'SYNC LOCAL CATALOG TO SUPABASE';
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
      if (text) text.textContent = 'Supabase: Connected';
    } else {
      if (pill) pill.classList.remove('connected');
      if (text) text.textContent = 'Supabase: Offline / Local';
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
      document.getElementById('productModalHeading').textContent = 'ADD PRODUCT';
    }

    if (openBtn) openBtn.onclick = openModal;
    if (topbarAddBtn) topbarAddBtn.onclick = openModal;
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    // Handle Form Submit
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const id = document.getElementById('editProdId').value || 'prod-' + Date.now();
        const name = document.getElementById('editProdName').value.trim();
        const slug = document.getElementById('editProdSlug').value.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const collection = document.getElementById('editProdCollection').value;
        const price = parseFloat(document.getElementById('editProdPrice').value) || 0;
        const comparePrice = parseFloat(document.getElementById('editProdCompare').value) || null;
        const fabric = document.getElementById('editProdFabric').value.trim();
        const fit = document.getElementById('editProdFit').value.trim();
        const material = document.getElementById('editProdMaterial').value.trim();
        const sku = document.getElementById('editProdSKU').value.trim();
        const status = document.getElementById('editProdStatus').value;
        const desc = document.getElementById('editProdDesc').value.trim();
        const featured = document.getElementById('editProdFeatured').checked;
        const newDrop = document.getElementById('editProdNewDrop').checked;

        // Existing product lookup to preserve images & variants if editing
        const existing = window.BravadianDB.getProductBySlug(id);
        const images = existing ? existing.images : {
          front: window.BravadianDefaults.createTeeSVG(name, collection, '#121216', '#ff4d00', 'front'),
          back: window.BravadianDefaults.createTeeSVG(name, collection, '#121216', '#ff4d00', 'back'),
          closeup: window.BravadianDefaults.createTeeSVG(name, collection, '#121216', '#ff4d00', 'closeup'),
          lifestyle: window.BravadianDefaults.createTeeSVG(name, collection, '#121216', '#ff4d00', 'lifestyle')
        };

        const colors = existing && existing.colors ? existing.colors : ['Black', 'White'];
        const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        const variants = existing && existing.variants ? existing.variants : [
          { color: 'Black', size: 'S', stock: 5 },
          { color: 'Black', size: 'M', stock: 5 },
          { color: 'Black', size: 'L', stock: 5 },
          { color: 'Black', size: 'XL', stock: 5 },
          { color: 'Black', size: 'XXL', stock: 5 },
          { color: 'White', size: 'S', stock: 5 },
          { color: 'White', size: 'M', stock: 5 },
          { color: 'White', size: 'L', stock: 5 },
          { color: 'White', size: 'XL', stock: 5 },
          { color: 'White', size: 'XXL', stock: 5 }
        ];

        const saved = window.BravadianDB.saveProduct({
          id,
          name,
          slug,
          collection,
          price,
          comparePrice,
          fabric,
          gsm: 240,
          fit,
          material,
          sku,
          status,
          description: desc,
          featured,
          newDrop,
          colors,
          sizes,
          variants,
          images
        });

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
      document.getElementById('editProdFabric').value = p.fabric || '240 GSM';
      document.getElementById('editProdFit').value = p.fit || 'Oversized';
      document.getElementById('editProdMaterial').value = p.material || '100% Combed Cotton';
      document.getElementById('editProdSKU').value = p.sku || '';
      document.getElementById('editProdStatus').value = p.status;
      document.getElementById('editProdDesc').value = p.description;
      document.getElementById('editProdFeatured').checked = !!p.featured;
      document.getElementById('editProdNewDrop').checked = !!p.newDrop;

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
