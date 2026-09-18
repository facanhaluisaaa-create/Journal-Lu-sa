# Façanha’s Journal

A classic-newspaper-style journal website — pure HTML/CSS/JS, no build step, no framework.

## Features

- **Front page** with a featured (pinned) story and a grid of the latest publications
- **Category filter** via the navigation bar (categories come from the data file)
- **Keyword search** across titles, subtitles, excerpts, content, authors and categories
- **Single article pages** (hash routing — works on any static host, GitHub Pages included)
- **Newsletter signup form** (front-end only for now; ready to be wired to a real service)
- **Responsive** layout for mobile and desktop
- Classic print-newspaper look: serif typography, column rules, sepia paper tones, one editorial red accent

## Project structure

```
index.html        — page layout (edit only to change structure)
css/styles.css    — all styling; colors live in the :root variables at the top
js/app.js         — data loading, rendering, filter, search, routing, newsletter
data/posts.json   — YOUR CONTENT lives here
```

## Adding posts

All content is managed in `data/posts.json` — you never need to touch the layout files.

1. Add your category names to the `categories` array, e.g. `["Essays", "Travel"]`.
2. Copy the `_postTemplate` object into the `posts` array and fill in the fields:

```json
{
  "id": "my-first-post",
  "title": "My First Post",
  "subtitle": "An optional deck line under the headline.",
  "category": "Essays",
  "author": "Façanha",
  "date": "2026-09-05",
  "image": "https://example.com/photo.jpg",
  "imageCaption": "Optional caption.",
  "excerpt": "The short summary shown on the front page.",
  "content": [
    "First paragraph.",
    "Second paragraph."
  ],
  "featured": false
}
```

Notes:

- `id` must be unique (it becomes the article's URL: `#/post/my-first-post`).
- Set `"featured": true` on **one** post to pin it as the main story; otherwise the newest post is featured.
- `image`, `imageCaption` and `subtitle` are optional — leave them as `""` to omit.
- Dates use `YYYY-MM-DD` and control ordering (newest first).
- While `posts` is empty, the site shows built-in **sample content** (with a notice) so the layout can be previewed. Your first real post replaces it automatically.

## Sharing a post (LinkedIn, WhatsApp, X…)

Share links look like `https://facanhaluisaaa-create.github.io/Journal-Lu-sa/p/<post-id>/`. These static pages carry each post's Open Graph title, description and cover image (social networks don't run JavaScript, so the `#/post/…` route alone would preview as the generic front page), then redirect readers to the article.

Regenerate them whenever posts are added or edited:

```bash
python3 build_share_pages.py
```

## Running locally

Because the site loads `data/posts.json` via `fetch`, serve it over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly from the file system also works — it just falls back to the sample content.)

## Publishing

Any static host works. For **GitHub Pages**: repository **Settings → Pages → Deploy from a branch**, pick the branch and `/ (root)`.

## Customizing

- **Colors**: edit the CSS variables at the top of `css/styles.css` (`--accent` is the editorial red).
- **Site name / tagline / footer**: edit the `site` object in `data/posts.json`.
- **Newsletter**: signups are sent to Kit (ConvertKit). The form endpoint lives in `data/posts.json` under `site.newsletterAction` (and as the `action` attribute of the form in `index.html` as a no-JS fallback). Kit uses double opt-in, so new subscribers show as unconfirmed until they click the confirmation email.
