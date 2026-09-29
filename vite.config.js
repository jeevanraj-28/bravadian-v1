import { defineConfig } from 'vite';
import { resolve } from 'path';

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

export default defineConfig({
  base,
  plugins: [pagesCopy()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        admin: resolve(import.meta.dirname, 'admin.html'),
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
