#!/usr/bin/env python3
"""Generate one static share page per post, under p/<id>/index.html.

Social networks (LinkedIn, WhatsApp, X…) build their link previews from
Open Graph tags and never run JavaScript, so a hash route such as
#/post/whimsical-fashion would always preview as the generic front page.
Each generated page carries the post's own title, description and cover
image, then sends real visitors on to the article in the app.

Run after adding or editing posts:  python3 build_share_pages.py
"""

import html
import json
import os
import shutil

SITE_URL = "https://facanhaluisaaa-create.github.io/Journal-Lu-sa/"

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(ROOT, "p")

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title} — {site}</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{url}" />

  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="{site}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:url" content="{url}" />
  {og_image}
  <meta property="article:author" content="{author}" />
  <meta property="article:published_time" content="{date}" />
  <meta property="article:section" content="{category}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{description}" />
  {twitter_image}

  <meta http-equiv="refresh" content="0; url={target}" />
  <script>location.replace({target_js});</script>
  <style>
    body {{ margin: 0; background: #f7f2e7; color: #1c1712; font-family: Georgia, serif; text-align: center; padding: 15vh 24px; }}
    a {{ color: #8a1e1e; }}
  </style>
</head>
<body>
  <p><em>{title}</em></p>
  <p><a href="{target}">Continue to the article &rarr;</a></p>
</body>
</html>
"""


def og_meta(prop, url):
    return '<meta property="%s" content="%s" />' % (prop, html.escape(url, quote=True)) if url else ""


def main():
    with open(os.path.join(ROOT, "data", "posts.json"), encoding="utf-8") as f:
        data = json.load(f)

    site = data.get("site", {}).get("name", "")
    posts = [p for p in data.get("posts", []) if p.get("id") and p.get("title")]

    if os.path.isdir(OUT_DIR):
        shutil.rmtree(OUT_DIR)

    for post in posts:
        pid = post["id"]
        page_dir = os.path.join(OUT_DIR, pid)
        os.makedirs(page_dir, exist_ok=True)

        description = post.get("subtitle") or post.get("excerpt") or ""
        if len(description) > 200:
            description = description[:197].rstrip() + "…"
        image = post.get("image", "")
        image_url = SITE_URL + image if image and not image.startswith("http") else image

        page = PAGE.format(
            site=html.escape(site, quote=True),
            title=html.escape(post["title"], quote=True),
            description=html.escape(description, quote=True),
            url=SITE_URL + "p/" + pid + "/",
            target="../../#/post/" + pid,
            target_js=json.dumps("../../#/post/" + pid),
            og_image=og_meta("og:image", image_url),
            twitter_image=og_meta("twitter:image", image_url).replace("property=", "name="),
            author=html.escape(post.get("author", ""), quote=True),
            date=html.escape(post.get("date", ""), quote=True),
            category=html.escape(post.get("category", ""), quote=True),
        )
        with open(os.path.join(page_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(page)
        print("share page:", SITE_URL + "p/" + pid + "/")


if __name__ == "__main__":
    main()
