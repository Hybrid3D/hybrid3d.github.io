# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Jekyll-based static blog at `https://blog.hybrid3d.dev/` covering Computer Graphics, Machine Learning, Quantum Computing, and Software Engineering. Posts are primarily written in Korean.

## Common Commands

```bash
# Local development server (with live reload)
jekyll serve

# Build with draft posts visible
jekyll serve --drafts
```

No Gemfile — use `jekyll` directly (Homebrew Ruby: `/opt/homebrew/opt/ruby/bin/jekyll`). Ensure PATH includes Homebrew Ruby via `source ~/.zshrc`.

Required gems (install once): `jekyll`, `bundler`, `jekyll-theme-slate`, `jekyll-redirect-from`, `jekyll-sitemap`, `jekyll-feed`

## Architecture

**Jekyll Collections:**
- `_posts/` — Blog posts organized by category subdirectory (`computer-graphics/`, `general/`, `hidden/`, `quantum-computer/`, `software-engineering/`)
- `_category/` — Category definition pages (outputs at `/:category-name/`)
- `_difficulty/` — Difficulty level definitions (`none`, `low`, `middle`, `high`)
- `_image/` — Image metadata (output: false)

**Layout Hierarchy:**
- `_layouts/default.html` — Base template; includes header, footer, analytics, Disqus
- `_layouts/post.html` → extends `default.html`; adds MathJax, category/difficulty tags, schema.org microdata
- `_layouts/category.html` / `_layouts/difficulty.html` — Archive pages for filtering posts

**Includes:**
- `head.html` — SEO meta tags, og:image, noindex/nofollow support
- `mathjax.html` — Math rendering (included conditionally in post layout)
- `comments.html` — Disqus integration (`blog-hybrid3d-dev.disqus.com`)

## Post Front Matter

```yaml
---
title: "Post Title"
date: YYYY-MM-DD HH:MM:SS +0900
categories: computer-graphics   # matches _category/ filenames
difficulty: middle               # none | low | middle | high
comments: true
published: true                  # omit or false to hide
---
```

To make a post unlisted (accessible by URL but not listed): set `sitemap: false` and add `robots: noindex, nofollow` in front matter.

## Key Config (`_config.yml`)

- Theme: `jekyll-theme-slate` with custom SCSS overrides in `_sass/` and `css/main.scss`
- Plugins: `jekyll-redirect-from`, `jekyll-sitemap`, `jekyll-feed`
- Timezone: `Asia/Seoul` (KST, UTC+9)
- Content width: 800px; mobile breakpoint: 600px

## Styling

`css/main.scss` imports from `_sass/`: `_base.scss`, `_layout.scss`, `_syntax-highlighting.scss`, `_normalize.scss`. The site uses the Slate theme as a base with custom overrides.
