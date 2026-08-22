<!-- Added: 2026-07-01 -->
## Theme System

The site has a user-selectable accent color theme system powered by Svelte 5 runes (`$state`) and CSS custom properties.

**Architecture:**
- `src/lib/stores/theme.svelte.ts` — Reactive module-level store with 2 preset themes (blue, green). Persisted to `localStorage('theme')`.
- `src/lib/ThemePicker.svelte` — 10px colored dot in the header nav showing current accent color. Click opens a dropdown with two sections: **Accent** (color dots) and **Mode** (System/Light/Dark).
- `src/app.html` — Blocking inline `<script>` reads localStorage before first paint to prevent FOUC/color flash.
- `src/routes/+layout.svelte` — `$effect` syncs selected theme CSS vars (`--theme-secondary`, `--banner-light`, `--banner-dark`) to `document.documentElement` on mount and change.

**Mode (System/Light/Dark):** Stored in `localStorage('mode')`. A `data-mode` attribute on `<html>` (`light` or `dark`) forces mode; its absence means system (OS preference). CSS `color-scheme` on `body` is overridden via `html[data-mode]` selectors. Dark-mode-only rules (banner image, Shiki) use `html[data-mode='dark']` selectors alongside `@media (prefers-color-scheme: dark)`.

**Shared stylesheet:** Design tokens and default element styles live in `static/styles/design-system.css` (served verbatim at `/styles/design-system.css`, linked in `src/app.html` — not compiled by Vite). Site-specific rules (banner, layout, Shiki, skip-link) stay in `src/routes/style.css`. When editing tokens or default element styles, update `design-system.css`, not `style.css`.

**CSS variables (defined in `static/styles/design-system.css` body variables layer):**
- `--theme-secondary` — user's chosen accent color (JS sets this). Defaults to `--blue`.
- `--secondary` — computed: `light-dark(var(--theme-secondary), var(--light-grey))`. In dark mode, always light-grey regardless of theme selection.
- `--banner-light` — light mode banner URL (JS sets per theme).
- `--banner-dark` — dark mode banner URL (static `/images/dark.jpg`, not theme-dependent).
- `--banner-image` — active banner URL. Defaults to `--banner-light`, switched to `--banner-dark` inside `@media (prefers-color-scheme: dark)` via a CSS rule in elements layer.

**Banner images:** Stored at `/static/images/{name}-light.jpg` and `{name}-dark.jpg` (800×540). Placeholder solid-color JPEGs exist for all themes; replace with real images when ready.

**Color presets:** Blue (`#0412e3`), Green (`#2e7d32`).
