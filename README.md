# Toolora

Free calculators and everyday online tools, built with Next.js (App Router), TypeScript and Tailwind CSS.
Every tool runs in the browser; user input is never sent to a server.

## Quick start

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL at minimum for production
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run typecheck` | Generates route types, then runs `tsc --noEmit` |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript rules) |
| `npm run validate` | Registry integrity: widgets, content, related links, unique SEO titles and descriptions |
| `npm run check` | typecheck + lint + build |

## Architecture

```
src/
  app/                    Routes (Server Components by default)
    calculators/[slug]/   One statically generated page per calculator (+ OG image)
    tools/[slug]/         One statically generated page per utility tool (+ OG image)
    guides/[slug]/        Guide articles (+ OG image)
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx icon.svg
  config/
    tools.ts              ← single source of truth for every tool
    guides.ts             Guide index (titles, descriptions, relations)
    site.ts               Brand, URL, contact configuration
  components/
    calculators/          Interactive calculator widgets ("use client")
    utilities/            Interactive utility widgets ("use client")
    tools/                Page building blocks: ToolPage, CalculatorShell, results, FAQ, related links, widget registry
    layout/               Header, Footer, navigation, search, theme toggle, breadcrumbs
    seo/                  JSON-LD renderer
    ui/                   Buttons, fields, segmented control, alerts, states, icons
    ads/ analytics/       Opt-in integration points (inactive until configured)
  data/
    content/              Page copy per tool (intro, how-to, formulas, examples, FAQ)
    guides/               Guide article bodies
  lib/
    calculators/ converters/ text/ json/ generators/ image/   Pure business logic (no React)
    seo/                  Metadata, schema.org builders, OG image renderer
    utils/                Number parsing/formatting, calendar-date maths, class names
    search.ts             Client-side search index and ranking
```

`config/tools.ts` drives navigation, category pages, search, related links, metadata, structured data and the
sitemap, so tool data is never duplicated.

### Adding a tool

1. Add an entry to `src/config/tools.ts` (id = slug, category, group, icon, keywords, related tools/guides, SEO title and description).
2. Create the widget at `src/components/calculators/<id>.tsx` or `src/components/utilities/<id>.tsx` (default export, `"use client"`, rendered inside `CalculatorShell`), with logic in `src/lib/...`.
3. Register it in `src/components/tools/widgets.tsx`.
4. Write its page content in `src/data/content/<id>.ts` and add it to `src/data/content/index.ts`.
5. Run `npm run validate`. The page, sitemap entry, search result, OG image and internal links then appear automatically.

Guides work the same way: add an entry to `src/config/guides.ts`, write `src/data/guides/<slug>.ts` and register it in `src/data/guides/index.ts`.

## SEO

- Unique title (`Primary keyword – Benefit | Toolora`), description, self-referencing canonical, Open Graph and Twitter card on every indexable page, built through `lib/seo/metadata.ts`.
- JSON-LD graph per page: `WebSite` + `Organization` (home), `WebPage`/`CollectionPage`, `BreadcrumbList`, `WebApplication` (tools), `Article` (guides), `FAQPage` and `ItemList` (categories). No ratings, reviews or prices.
- `sitemap.xml` is generated from the registries, and `robots.txt` references it. `/search` is `noindex, follow` and excluded from the sitemap.
- Set `NEXT_PUBLIC_ALLOW_INDEXING=false` on preview deployments to block crawling.

## Environment variables

See `.env.example`. Only `NEXT_PUBLIC_SITE_URL` is required in production. Analytics and ads stay off until their IDs are set.
