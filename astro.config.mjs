import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://xianchaoqian.com',
  publicDir: './static',
  devToolbar: {
    enabled: false
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  }
});
