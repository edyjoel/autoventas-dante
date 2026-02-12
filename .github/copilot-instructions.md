# Copilot / Codex Instructions (Autoventas Dante)

## Goal

Build a modern, fast, accessible car dealership website using Astro.

## Stack

- Astro (TypeScript strict)
- Package manager: `pnpm`

## Commands

- `pnpm dev` (local dev server)
- `pnpm build` (production build)
- `pnpm preview` (preview build)
- `pnpm astro check` (type-check)

## Architecture

- Routing: `src/pages/*.astro`
  - `src/pages/index.astro` -> `/`
- Layout: `src/layouts/Layout.astro`
  - Imports `src/styles/global.css`
  - Loads local fonts from `src/fonts/`
  - Renders `Header.astro` + `Footer.astro`
- Components: `src/components/*.astro`

## Styling conventions

- Prefer component-scoped CSS in each `.astro`.
- Keep global CSS minimal and reusable (tokens + utilities).
- Tokens live in `src/styles/global.css`:
  - Spacing: `--space-*` (rem-based)
  - Radius: `--radius-*` (rem-based)
  - Colors/shadows: `--color-*`, `--shadow-*`
- Units:
  - Prefer `rem` for spacing/typography.
  - Use `px` mainly for 1px borders / fine details.
- Avoid element selectors in component styles (e.g. `nav a`, `.foo h2`); prefer explicit classes to prevent leakage.

## Accessibility

- Keep focus-visible styles.
- Ensure interactive elements are buttons/links correctly.
- Images: include `alt`, use `loading="lazy"` where appropriate.

## Assets

- Public static assets (served as-is):
  - `public/images/hero/*`
  - `public/icons/*`
- Fonts are self-hosted in `src/fonts/`.
  - Never import Google Fonts or other external font CDNs.

## Current UI notes

- Header has anchor navigation: `/#hero`, `/#modelos`, `/#contacto`.
- Models grid and filters live on `src/pages/index.astro`.
- WhatsApp FAB uses `public/icons/whatsapp.svg`.
- TikTok icon uses `public/icons/tiktok.svg`.
