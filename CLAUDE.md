# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start Tailwind CSS compiler (watch mode)
npm run build

# Lint HTML/JS files
npx eslint .

# Format all files
npx prettier --write .
```

Pre-commit hooks (Husky + lint-staged) auto-run ESLint and Prettier on staged files.

## Architecture

Static HTML website. Single page at `pages/index.html`. Design source: Figma (Princeton Demo1).

**CSS pipeline:**
- Entry: `assets/css/app.css` (Tailwind imports)
- Output: `dist/style.css` (compiled — never edit directly)
- File roles:
  - `base.css` — html/body/a/p/h1-h6/containers/`general-padding`
  - `component.css` — buttons, inputs, textareas, selects
  - `layout.css` — header and footer
  - `utilities.css` — section-specific and helper classes

**JS stack:** GSAP + ScrollTrigger (animation), Swiper (carousels), Lenis (smooth scroll), jQuery — all loaded as local minified files from `assets/js/`.

## CSS Rules (non-negotiable)

- All styles via `@apply` only — no raw CSS properties anywhere
- No `@layer` blocks
- No `:root` or CSS variable declarations outside `style.css`
- No square brackets `[]` for arbitrary values — use defined tokens
- No fixed `w-*`, `min-w-*`, `h-*`, or `min-h-*` on sections (use `w-full` / `h-full` only)
- Breakpoints live in `style.css` under `@theme {}` — use `max-1024:`, `max-768:` etc., never `@media` queries
- All responsive classes go in the **same `@apply` line** as base styles
- Variables (colors, fonts, spacing) always fetched from Figma via MCP and defined once in `style.css`

**Breakpoints defined:**
`1920, 1600, 1512, 1440, 1366, 1199, 1024, 992, 768, 640, 576, 425, 375`
(`--spacing: 1px`)

## HTML Rules (non-negotiable)

- No classes on `body`, `html`, `<header>`, `<footer>` — style them via CSS selectors
- No inline `style=""` attributes
- All `<section>` elements inside `<main>`, with exactly two classes: `{section-name} general-padding`
- Allowed Tailwind classes directly in HTML: `flex`, `grid`, `grid-cols-*`, `flex-col`, `flex-row`, `gap-*`, `p-*`, `m-*`, `max-w-*` only — everything else goes in CSS files
- `<a>` requires `href`, `role="link"`, `target`, `aria-label` — each on its own line
- `<button>` requires `type="button"` (or `"submit"`) and `aria-label`
- `<img>` requires `width`, `height`, `alt` (alt must never be blank)
- `<h1>`–`<h6>` always wrapped: `<div class="title title-{color}"><h1>…</h1></div>`
- `<p>` always wrapped: `<div class="content content-{color}"><p>…</p></div>`
- Phone hrefs: `tel:{number}`, email hrefs: `mailto:{address}`

## Local Skills

Two project-specific skills in `.claude/skills/`:

- `/html-css-rules` — full HTML and CSS convention reference (read this before writing any markup or styles)
- `/qa` — QA review workflow: fetches design values from Figma MCP, computes browser values via Chrome MCP, diffs them, outputs severity-graded report

Always invoke `/html-css-rules` before writing HTML or CSS for this project.
