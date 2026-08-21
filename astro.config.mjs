// @ts-check
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  server: {
      host: true, // true if you are at home and want to test mobile
      port: 4321,
  },

  markdown: {
  rehypePlugins: [
    [
      rehypeExternalLinks,
      {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
      },
    ],
  ],
},
});