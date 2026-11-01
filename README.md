<p align="center">
  <img src="public/logo.svg" alt="Mateus Neiva" width="72" height="72" />
</p>

<h1 align="center">Mateus Neiva</h1>

<p align="center">
  Personal portfolio and blog — projects, writing, and contact.<br />
  Built with Next.js · bilingual (PT / EN)
</p>

<p align="center">
  <a href="https://mateusneiva.com"><strong>mateusneiva.com</strong></a>
  ·
  <a href="https://github.com/mateusneiva">GitHub</a>
</p>

<p align="center">
  <a href="https://mateusneiva.com"><img src="https://img.shields.io/badge/live-mateusneiva.com-1a2e05?style=flat-square" alt="Live site" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square" alt="MIT License" /></a>
</p>

---

## Overview

A locale-first App Router site for showcasing work and publishing posts. Content lives in the repo (TypeScript data + Markdown). Optional integrations cover a contact inbox (Resend) and live Spotify activity on the About page.

| | |
| --- | --- |
| **Locales** | `/pt` · `/en` (`next-intl`) |
| **Pages** | Home · About · Posts · Project case studies · Contact |
| **Theme** | Light / dark / system |
| **Deploy** | Vercel |

## Features

- **Bilingual routing** — Portuguese and English with shared layouts and message catalogs
- **Projects** — Case studies from local data, covers in `public/projects/`, sitemap-ready
- **Blog** — Markdown posts per locale (`content/posts/{pt,en}`) with drafts and reading time
- **About** — Skills matrix, principles, optional Spotify Now Playing
- **Contact** — Form validated with Zod and delivered through Resend
- **Motion** — Lenis smooth scroll + Framer Motion, with reduced-motion respect
- **Quality** — Vitest + Testing Library for units; Playwright for end-to-end

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) · React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS · `tailwind-variants` |
| i18n | next-intl |
| Motion | Framer Motion · Lenis |
| Content | gray-matter · react-markdown · remark-gfm |
| Forms | React Hook Form · Zod · Resend |
| Tests | Vitest · Testing Library · Playwright |

## Quick start

**Requirements:** Node.js 24+ · pnpm 10+

```sh
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). `/` redirects to the preferred locale (Portuguese by default).

### Production build

```sh
pnpm build
pnpm start
```

`pnpm build` compiles the app into `.next`. `pnpm start` serves that build on [http://localhost:3000](http://localhost:3000) — the same flow Vercel runs after deploy.

Dev and production use separate output folders (`.next-dev` vs `.next`), so a production build does not wipe an active `pnpm dev` session.

| Script | What it does |
| --- | --- |
| `pnpm dev` | Dev server (`.next-dev`) |
| `pnpm build` | Production build (`.next`) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm exec tsc --noEmit` | Typecheck |
| `pnpm test` | Unit / component tests |
| `pnpm test:e2e` | Build + Playwright |
| `pnpm test:all` | Vitest then Playwright |
| `pnpm spotify:auth` | One-time Spotify OAuth for About |

## Repository layout

```text
src/app/[locale]/          # Routes, layouts, metadata
src/components/            # UI — home, about, projects, posts, layout
src/data/                  # Projects, skills, social links
src/i18n/                  # Routing + PT/EN message catalogs
src/lib/                   # Posts, contact, Spotify, helpers
content/posts/{pt,en}/     # Markdown articles
public/                    # Static assets (logo, project covers)
```

## Content

### Projects

1. Add an entry in `src/data/projects.ts`
2. Add copy under `Projects` / `ProjectDetails` in `src/i18n/messages/{pt,en}.json`
3. Optionally drop a cover in `public/projects/` and set the `image` field

### Posts

Create matching files per locale:

```text
content/posts/pt/my-post.md
content/posts/en/my-post.md
```

```md
---
title: 'Article title'
description: 'Summary for listings and SEO.'
date: '2026-10-04'
tags: ['react', 'typescript']
draft: false
---

## Heading

Body supports GitHub-flavored Markdown.
```

Drafts and future-dated posts stay unpublished. Reading time is computed automatically.

## Environment

Copy `.env.example` → `.env.local`. Variables are **server-only**.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | for contact | Resend API key |
| `CONTACT_EMAIL_FROM` | for contact | Verified sender address |
| `CONTACT_EMAIL_TO` | for contact | Inbox that receives messages |
| `SPOTIFY_CLIENT_ID` / `SECRET` / `REFRESH_TOKEN` | optional | Now Playing on About |
| `MEDIUM_USERNAME` or `MEDIUM_FEED_PT` / `_EN` | optional | Medium feed import |

**Spotify:** create an app in the [Developer Dashboard](https://developer.spotify.com/dashboard), register `http://127.0.0.1:4381/callback`, set client id/secret, then run `pnpm spotify:auth`.

On Vercel, mirror the same variables for Production (and Preview if needed), then redeploy.

## License

[MIT](./LICENSE) © Mateus Neiva
