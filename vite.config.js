import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const ROOT = import.meta.dirname;

// Production (Vercel) serves the site at "/". The GitHub Pages test copy lives at
// "/bravadian-v1/" and is built with PAGES_BASE=/bravadian-v1/ (see .github/workflows/pages.yml).
const base = process.env.PAGES_BASE || '/';

// Pages copy only: image paths written in the JavaScript ("/images/...") get the address prefix,
// and the pages are kept out of search results so the copy never competes with bravadian.in.
const pagesCopy = () => ({
  name: 'bravadian-pages-copy',
  apply: 'build',
  transform(code, id) {
    if (base === '/' || !/[\\/]js[\\/][^\\/]+\.js$/.test(id)) return null;
    return { code: code.replace(/(['"`])\/images\//g, `$1${base}images/`), map: null };
  },
  transformIndexHtml(html) {
    if (base === '/') return html;
    return html.replace('<head>', '<head>\n  <meta name="robots" content="noindex, nofollow">');
  },
});

/* ------------------------------------------------------------------------------------------------
   THE BRAVADIAN WALL (/wall)
   A real page of its own (its own title, share preview and canonical address for the QR code on the
   thank-you card), built from the site shell in index.html plus pages/wall.main.html. The result,
   wall/index.html, is generated on every dev start and build: edit index.html or pages/, never it.
   ------------------------------------------------------------------------------------------------ */
const WALL_OUT = resolve(ROOT, 'wall/index.html');
const WALL_SEO = {
  title: 'The Bravadian Wall | Real People. Real Stories. | Bravadian',
  description: 'Discover real people wearing Bravadian. Explore the Bravadian Wall and see how India wears Brave Indian streetwear.',
  url: 'https://bravadian.in/wall',
};

function buildWallPage() {
  let html = fs.readFileSync(resolve(ROOT, 'index.html'), 'utf8');
  const main = fs.readFileSync(resolve(ROOT, 'pages/wall.main.html'), 'utf8');
  const swap = (pattern, replacement, label) => {
    if (!pattern.test(html)) throw new Error(`[wall page] index.html no longer has ${label}; update buildWallPage() in vite.config.js`);
    html = html.replace(pattern, replacement);
  };
  const { title, description, url } = WALL_SEO;
  const ld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'The Bravadian Wall', url, description,
    isPartOf: { '@type': 'WebSite', '@id': 'https://bravadian.in/#website', url: 'https://bravadian.in/' },
    publisher: { '@type': 'Organization', '@id': 'https://bravadian.in/#organization', name: 'BRAVADIAN' },
  }, null, 2);

  swap(/<title>[^<]*<\/title>/, `<title>${title}</title>`, 'a <title>');
  swap(/<meta name="title" content="[^"]*">/, `<meta name="title" content="${title}">`, 'meta title');
  swap(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`, 'meta description');
  swap(/<meta name="keywords" content="[^"]*">/, '<meta name="keywords" content="bravadian wall, bravadian customers, how india wears bravadian, bravadian oversized t shirt, indian streetwear community">', 'meta keywords');
  swap(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`, 'the canonical link');
  swap(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`, 'og:url');
  swap(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`, 'og:title');
  swap(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${description}">`, 'og:description');
  swap(/<meta name="twitter:url" content="[^"]*">/, `<meta name="twitter:url" content="${url}">`, 'twitter:url');
  swap(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${title}">`, 'twitter:title');
  swap(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${description}">`, 'twitter:description');
  swap(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${ld}\n  </script>`, 'the JSON-LD block');
  // This page sits one folder down: make its own files and the store's links absolute (Vite adds the base)
  swap(/(href|src)="(css|js)\//g, '$1="/$2/', 'stylesheet and script paths');
  swap(/href="#\//g, 'href="%BASE_URL%#/', 'store links');
  swap(/<body>/, '<body data-page="wall">', '<body>');
  swap(/<main id="storeMainApp"><\/main>/, `<main id="storeMainApp" class="is-wall-page">\n${main}\n</main>`, 'the empty <main id="storeMainApp">');
  swap(/<link rel="stylesheet" href="\/css\/store\.css">/, '$&\n  <link rel="stylesheet" href="/css/wall.css">', 'the store stylesheet');
  swap(/<script type="module" src="\/js\/store\.js"><\/script>/, '$&\n  <script type="module" src="/js/wall.js"></script>', 'the store script');
  // Mark the Wall links in the header and menus as the current page
  html = html.replace(/(<a href="%BASE_URL%wall")( class="[^"]*")?/g, '$1$2 aria-current="page"');
  html = html.replace(/^<!DOCTYPE html>/i, '<!DOCTYPE html>\n<!-- GENERATED by vite.config.js from index.html + pages/wall.main.html. Edit those files, not this one. -->');

  fs.mkdirSync(resolve(ROOT, 'wall'), { recursive: true });
  const old = fs.existsSync(WALL_OUT) ? fs.readFileSync(WALL_OUT, 'utf8') : '';
  if (old !== html) fs.writeFileSync(WALL_OUT, html);
}

const wallPage = () => ({
  name: 'bravadian-wall-page',
  config() { buildWallPage(); },
  configureServer(server) {
    const sources = [resolve(ROOT, 'index.html'), resolve(ROOT, 'pages/wall.main.html')];
    server.watcher.add(sources);
    server.watcher.on('change', (file) => {
      if (sources.includes(resolve(file))) {
        try { buildWallPage(); } catch (err) { server.config.logger.error(err.message); }
      }
    });
    server.middlewares.use(wallAddress);
  },
  configurePreviewServer(server) { server.middlewares.use(wallAddress); },
});

// "/wall" (no slash, as printed on the QR code) serves the Wall in dev and preview, as Vercel does
function wallAddress(req, res, next) {
  const [path, query] = (req.url || '').split('?');
  if (path === `${base}wall` || path === `${base}wall/`) req.url = `${base}wall/index.html${query ? `?${query}` : ''}`;
  next();
}

export default defineConfig({
  base,
  plugins: [pagesCopy(), wallPage()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(ROOT, 'index.html'),
        admin: resolve(ROOT, 'admin.html'),
        wall: WALL_OUT,
      },
    },
  },
  server: {
    port: 3000,
    open: false,
    // Allow preview links shared through VS Code port forwarding (dev tunnels)
    allowedHosts: ['.devtunnels.ms'],
  },
});
