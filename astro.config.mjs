// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
// export default defineConfig({});

export default defineConfig({
    server: {
        host: true, // true if you are at home and want to test mobile
        port: 4321,
    }
});