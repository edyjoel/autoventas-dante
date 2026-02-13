// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Optional absolute site URL used for canonical + OG URLs.
 * Set in production: SITE_URL="https://autoventasdante.com"
 *
 * Avoid referencing Node `process` types directly to keep `astro check` happy
 * without requiring `@types/node`.
 */
const SITE_URL = /** @type {any} */ (globalThis)?.process?.env?.SITE_URL;

// https://astro.build/config
export default defineConfig({
	site: SITE_URL,
});
