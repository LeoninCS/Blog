# Astro Blog Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the current Hugo blog as an Astro static site matching the visible style of https://anjay.sh/ with Chinese UI copy.

**Architecture:** Astro will read migrated Markdown files from `src/content/blog`. Layout, navigation, timeline lists, archive pages, and article templates live in `src/layouts`, `src/components`, and `src/pages`. Article images are copied to `public/blog-assets` and referenced with target-hosted paths.

**Tech Stack:** Astro, TypeScript, Markdown content collections, plain CSS, local mirrored font assets.

---

### Task 1: Source Evidence And Project Setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Keep evidence: `.fork-skill/**`

- [ ] Capture source site evidence with `one-link-init.mjs`.
- [ ] Inspect frozen HTML/CSS for typography, layout, colors, spacing, and mobile breakpoints.
- [ ] Add Astro project configuration and package scripts.
- [ ] Add ignored generated directories for `node_modules`, `dist`, and local Astro cache.

### Task 2: Content Migration

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/**/*.md`
- Create: `public/blog-assets/**`
- Create: `scripts/migrate-content.mjs`

- [ ] Convert Hugo post directories into Astro Markdown entries.
- [ ] Preserve title, date, description, categories, tags, and author.
- [ ] Copy colocated article media into `public/blog-assets/<slug>/`.
- [ ] Rewrite relative Markdown image links to `/blog-assets/<slug>/<file>`.

### Task 3: Layout And Routes

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/layouts/PostLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/PostTimeline.astro`
- Create: `src/lib/posts.ts`
- Create: `src/pages/index.astro`
- Create: `src/pages/posts/index.astro`
- Create: `src/pages/posts/[slug].astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/rss.xml.ts`

- [ ] Build Chinese navigation labels and theme toggle.
- [ ] Build homepage hero, featured writing timeline, and showcase section.
- [ ] Build posts archive and dynamic post detail pages.
- [ ] Build about page from current Chinese page copy.
- [ ] Build RSS output from content collection data.

### Task 4: Visual Style Match

**Files:**
- Create: `src/styles/global.css`
- Copy: `public/fonts/**`
- Copy: `public/icon.png`
- Copy: `public/favicon-32x32.png`

- [ ] Copy mirrored font files into target-owned `public/fonts` paths.
- [ ] Implement source-matched color tokens, width, typography, timeline rail, article prose, footer, and responsive breakpoints.
- [ ] Implement light/dark theme behavior with persisted preference.
- [ ] Keep all production URLs target-owned or local.

### Task 5: Verification

**Files:**
- Read: `.fork-skill/reports/latest/report.md`

- [ ] Run `npm install`.
- [ ] Run `npm run build`.
- [ ] Run local dev server and inspect desktop/mobile screenshots.
- [ ] Run fork-skill capture and validation when available.
- [ ] Fix visible mismatches and build errors.
