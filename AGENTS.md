# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Astro-based web application for "Autoventas Dante" - a car dealership website. Built with Astro 5.17+ using TypeScript strict mode and file-based routing.

## Commands

Package manager: `pnpm`

### Development Workflow
- `pnpm dev` - Development server at `localhost:4321`
- `pnpm build` - Production build to `./dist/`
- `pnpm preview` - Preview production build locally
- `pnpm astro check` - TypeScript type checking
- `pnpm astro ...` - Run Astro CLI commands

## Architecture

### Layout System

The project uses a single-layout architecture:
- **Layout.astro**: Main layout that wraps all pages. Imports global CSS, custom fonts, and includes Header/Footer components. All pages use this layout with customizable `title` and `description` props.

### Styling Strategy

**Global styles** (`src/styles/global.css`):
- CSS reset and base styles
- Typography system with responsive breakpoints
- `.container` utility class (max-width: 1200px)
- Body uses flexbox column layout to ensure footer stays at bottom

**Component-scoped styles**:
- Each `.astro` component can have its own `<style>` block
- Styles are automatically scoped unless using `:global()`
- Header and Footer have their own scoped styles

**Page-specific styles**:
- Pages like `index.astro` may include unique styles for their content (e.g., `.hero` section)

### Custom Fonts

Located in `src/fonts/` - **all fonts are loaded locally** to avoid external requests and render-blocking:

- `fonts.css` - Defines `@font-face` declarations and CSS variables
- `--font-heading`: 'Permanent Marker' (used for all h1-h6)
- `--font-body`: 'Playwrite NZ Basic' (used for body text)
- Font files in subdirectories: `Permanent_Marker/`, `Playwrite_NZ_Basic/`

**Important**: Never import fonts from Google Fonts or external CDNs. All fonts must be self-hosted.

### Component Structure

**Header.astro**: Navigation bar with logo and main menu (Inicio, Vehículos, Servicios, Contacto). Dark theme (#1a1a1a) with hover effects and responsive mobile layout.

**Footer.astro**: Three-column footer (company info, contact, social links) with copyright year dynamically generated. Matches header's dark theme.

### Asset Handling

- `public/` - Static assets served as-is (favicon.svg)
- `src/assets/` - Build-time optimized assets (images)
- `src/fonts/` - Self-hosted font files with local @font-face declarations

### Astro Component Patterns

Components use frontmatter fence (`---`) for build-time scripts:
```astro
---
// Runs at build time, server-side
import Component from './Component.astro';
const data = await fetchData();
---

<!-- Template with component syntax -->
<Component prop={data} />
```

### File-based Routing

Files in `src/pages/` automatically become routes:
- `index.astro` → `/`
- `vehiculos.astro` → `/vehiculos`
- `[slug].astro` → dynamic routes

## Configuration

- `astro.config.mjs` - Astro configuration (currently default with no integrations)
- `tsconfig.json` - Extends `astro/tsconfigs/strict`
- TypeScript is enabled but type checking must be run manually via `pnpm astro check`
