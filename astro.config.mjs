import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

export default defineConfig({
  // Update to the real domain once the Cloudflare Pages project exists.
  site: 'https://draft30.pages.dev',
  integrations: [pagefind()],
});
