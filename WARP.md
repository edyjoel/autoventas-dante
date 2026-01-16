# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is an Astro-based web application named "autoventas-dante". Astro is a modern web framework that focuses on content-driven websites with optimal performance through partial hydration and Islands architecture.

## Commands

All commands use `pnpm` as the package manager and should be run from the project root.

### Development
- `pnpm dev` - Start development server at `localhost:4321` with hot reload
- `pnpm build` - Build production site to `./dist/` directory
- `pnpm preview` - Preview the production build locally before deploying
- `pnpm astro ...` - Run Astro CLI commands (e.g., `pnpm astro add`, `pnpm astro check`)

### Dependency Management
- `pnpm install` - Install all dependencies

## Architecture

### Project Structure

```
/
├── public/          # Static assets served as-is (favicon.svg)
├── src/
│   ├── assets/      # Build-time processed assets (images, SVGs)
│   ├── components/  # Reusable Astro components
│   ├── layouts/     # Page layout wrappers
│   └── pages/       # File-based routing (each .astro file = route)
└── dist/            # Build output (generated, not in git)
```

### Component Architecture

**Layouts (`src/layouts/`)**: Provide the HTML shell and global styles. The `Layout.astro` component defines the document structure, meta tags, and base styling that wraps all pages.

**Components (`src/components/`)**: Encapsulate reusable UI pieces. Components can import assets from `src/assets/` which are processed and optimized at build time.

**Pages (`src/pages/`)**: Define routes via file-based routing. Each `.astro` file automatically becomes a route. Pages compose layouts and components together.

### File-based Routing

Astro uses file-based routing where files in `src/pages/` map to URLs:
- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/blog/[slug].astro` → `/blog/:slug` (dynamic routes)

### Astro Component Structure

Astro components use a fence (`---`) to separate the component script (frontmatter) from the template:

```astro
---
// Component script (runs at build time)
import Layout from '../layouts/Layout.astro';
const data = await fetchData();
---

<!-- Template (HTML + component syntax) -->
<Layout>
  <h1>{data.title}</h1>
</Layout>
```

### Asset Handling

- **Static assets** in `public/` are served as-is at the root URL
- **Build-time assets** in `src/assets/` are imported in components and optimized during build
- Image imports from `src/assets/` provide `.src` property for the optimized path

### Styling

This project uses scoped `<style>` blocks within `.astro` components. Styles are automatically scoped to the component unless marked as `:global()`.

## Configuration

- `astro.config.mjs` - Main Astro configuration (integrations, build options)
- `tsconfig.json` - TypeScript configuration (extends Astro's strict preset)
- Package manager: `pnpm` (see `pnpm-lock.yaml`)

## TypeScript

The project uses TypeScript with Astro's strict configuration preset. Type checking is available via `pnpm astro check`.
