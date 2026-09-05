/* ============================================================
   Façanha’s Journal — app.js
   Loads data/posts.json, renders the home page (featured story
   + latest grid), category filter, keyword search, single
   article view (hash routing) and the newsletter form.

   While posts.json has no posts, built-in sample content is
   shown so the layout can be previewed. Add real posts to
   data/posts.json and the samples disappear automatically.
   ============================================================ */

(function () {
  "use strict";

  // ---------- Sample content (layout preview only) ----------

  function placeholderImage(label, tone) {
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800">' +
      '<rect width="1200" height="800" fill="' + tone + '"/>' +
      '<line x1="0" y1="0" x2="1200" y2="800" stroke="#c9bda2" stroke-width="2"/>' +
      '<line x1="1200" y1="0" x2="0" y2="800" stroke="#c9bda2" stroke-width="2"/>' +
      '<rect x="8" y="8" width="1184" height="784" fill="none" stroke="#b5a888" stroke-width="3"/>' +
      '<text x="600" y="420" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="#8a7d61">' +
      label +
      "</text></svg>";
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  var SAMPLE_DATA = {
    categories: ["Essays", "Culture", "Travel", "Notes"],
    posts: [
      {
        id: "sample-on-keeping-a-journal",
        title: "On Keeping a Journal in a Distracted Age",
        subtitle:
          "Why the slow, private act of writing things down still matters — perhaps now more than ever.",
        category: "Essays",
        author: "Façanha",
        date: "2026-09-01",
        image: placeholderImage("Featured image placeholder", "#e9dfc8"),
        imageCaption: "Replace this placeholder by setting the “image” field of your post.",
        excerpt:
          "Somewhere between the notification and the scroll, we stopped narrating our own days. A journal is a quiet act of resistance: a page that asks nothing of you except honesty.",
        content: [
          "Somewhere between the notification and the scroll, we stopped narrating our own days. A journal is a quiet act of resistance: a page that asks nothing of you except honesty.",
          "This is sample text, included only so you can see how an article page looks. Open data/posts.json, copy the post template, and write your first real entry — this sample will step aside the moment you do.",
          "Each post supports a title, a subtitle, a category, an author, a date, an optional image with caption, a short excerpt for the home page, and as many paragraphs of content as you like."
        ],
        featured: true
      },
      {
        id: "sample-cafe-tables",
        title: "The Secret Life of Café Tables",
        subtitle: "",
        category: "Culture",
        author: "Façanha",
        date: "2026-08-28",
        image: placeholderImage("Image placeholder", "#e6dcc4"),
        imageCaption: "",
        excerpt:
          "Every café table is a small stage. Observations collected over three months of eavesdropping, in the most affectionate sense of the word.",
        content: [
          "Every café table is a small stage. Observations collected over three months of eavesdropping, in the most affectionate sense of the word.",
          "This is sample content. Replace it with your own writing in data/posts.json."
        ],
        featured: false
      },
      {
        id: "sample-night-train",
        title: "Notes from a Night Train",
        subtitle: "",
        category: "Travel",
        author: "Façanha",
        date: "2026-08-21",
        image: placeholderImage("Image placeholder", "#ece2cb"),
        imageCaption: "",
        excerpt:
          "Twelve hours, one window, and the particular kind of thinking that only happens between stations.",
        content: [
          "Twelve hours, one window, and the particular kind of thinking that only happens between stations.",
          "This is sample content. Replace it with your own writing in data/posts.json."
        ],
        featured: false
      },
      {
        id: "sample-rereading",
        title: "In Defense of Rereading",
        subtitle: "",
        category: "Essays",
        author: "Façanha",
        date: "2026-08-14",
        image: "",
        imageCaption: "",
        excerpt:
          "The book does not change; the reader does. On returning to old pages and finding new rooms in them.",
        content: [
          "The book does not change; the reader does. On returning to old pages and finding new rooms in them.",
          "This is sample content. Replace it with your own writing in data/posts.json."
        ],
        featured: false
      },
      {
        id: "sample-small-things",
        title: "A Short Inventory of Small Things",
        subtitle: "",
        category: "Notes",
        author: "Façanha",
        date: "2026-08-07",
        image: "",
        imageCaption: "",
        excerpt:
          "The smell of rain on hot pavement, the first sip of morning coffee, a letter answered by hand. A list, kept for safekeeping.",
        content: [
          "The smell of rain on hot pavement, the first sip of morning coffee, a letter answered by hand. A list, kept for safekeeping.",
          "This is sample content. Replace it with your own writing in data/posts.json."
        ],
        featured: false
      },
      {
        id: "sample-market-sunday",
        title: "Sunday at the Old Market",
        subtitle: "",
        category: "Travel",
        author: "Façanha",
        date: "2026-07-30",
        image: placeholderImage("Image placeholder", "#e9dfc8"),
        imageCaption: "",
        excerpt:
          "Between the fruit stalls and the secondhand books, a whole city rehearses its week ahead.",
        content: [
          "Between the fruit stalls and the secondhand books, a whole city rehearses its week ahead.",
          "This is sample content. Replace it with your own writing in data/posts.json."
        ],
        featured: false
      }
    ]
  };

  // ---------- State ----------

  var state = {
    site: {
      name: "Façanha’s Journal",
      tagline: "Notes, essays & observations",
      footerText: "Published independently. All rights reserved."
    },
    posts: [],
    categories: [],
    activeCategory: "all",
    query: "",
    usingSamples: false
  };

  // ---------- Helpers ----------

  function $(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length !== 3) return esc(iso);
    var d = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
    if (isNaN(d.getTime())) return esc(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC"
    });
  }

  function sortByDateDesc(posts) {
    return posts.slice().sort(function (a, b) {
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
  }

  function bylineHtml(post) {
    var author = post.author ? "By <strong>" + esc(post.author) + "</strong>" : "";
    var date = post.date ? formatDate(post.date) : "";
    var sep = author && date ? " · " : "";
    return '<p class="byline">' + author + sep + date + "</p>";
  }

  // ---------- Data loading ----------

  function normalizeData(data) {
    var posts = Array.isArray(data.posts) ? data.posts.filter(isRealPost) : [];
    var categories = Array.isArray(data.categories) ? data.categories.filter(Boolean) : [];

    if (posts.length === 0) {
      state.usingSamples = true;
      posts = SAMPLE_DATA.posts;
      categories = SAMPLE_DATA.categories;
    }

    // Categories present on posts but missing from the list still get a nav entry.
    posts.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) {
        categories.push(p.category);
      }
    });

    if (data.site && typeof data.site === "object") {
      state.site.name = data.site.name || state.site.name;
      state.site.tagline = data.site.tagline || state.site.tagline;
      state.site.footerText = data.site.footerText || state.site.footerText;
    }

    state.posts = sortByDateDesc(posts);
    state.categories = categories;
  }

  function isRealPost(post) {
    return post && typeof post === "object" && (post.title || post.id);
  }

  function loadData() {
    return fetch("data/posts.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function () {
        // Opened via file:// or fetch failed — fall back to samples.
        return { posts: [], categories: [] };
      })
      .then(normalizeData);
  }

  // ---------- Rendering: chrome ----------

  function renderChrome() {
    $("site-name").textContent = state.site.name;
    $("site-tagline").textContent = state.site.tagline;
    $("footer-name").textContent = state.site.name;
    $("footer-text").textContent = state.site.footerText;
    $("footer-year").textContent = String(new Date().getFullYear());
    document.title = state.site.name;

    $("current-date").textContent = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    $("sample-notice").hidden = !state.usingSamples;
  }

  function renderNav() {
    var items = ['<li><button type="button" class="nav__link" data-category="all">All</button></li>'];
    state.categories.forEach(function (cat) {
      items.push(
        '<li><button type="button" class="nav__link" data-category="' +
          esc(cat) +
          '">' +
          esc(cat) +
          "</button></li>"
      );
    });
    $("category-nav").innerHTML = items.join("");
    updateNavActive();
  }

  function updateNavActive() {
    var links = document.querySelectorAll(".nav__link");
    links.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("data-category") === state.activeCategory);
    });
  }

  // ---------- Rendering: home ----------

  function visiblePosts() {
    var q = state.query.trim().toLowerCase();
    return state.posts.filter(function (post) {
      if (state.activeCategory !== "all" && post.category !== state.activeCategory) return false;
      if (!q) return true;
      var haystack = [
        post.title,
        post.subtitle,
        post.excerpt,
        post.author,
        post.category,
        Array.isArray(post.content) ? post.content.join(" ") : post.content
      ]
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function renderHome() {
    $("view-post").hidden = true;
    $("view-post").innerHTML = "";
    $("view-home").hidden = false;

    var posts = visiblePosts();
    var filtering = state.query.trim() !== "" || state.activeCategory !== "all";

    var featured = null;
    if (!filtering) {
      featured = posts.filter(function (p) { return p.featured; })[0] || posts[0] || null;
    }
    var gridPosts = featured
      ? posts.filter(function (p) { return p.id !== featured.id; })
      : posts;

    $("featured-slot").innerHTML = featured ? featuredHtml(featured, gridPosts) : "";

    var heading = "Latest Publications";
    if (state.query.trim() !== "") {
      heading = 'Search results for “' + esc(state.query.trim()) + "”";
    } else if (state.activeCategory !== "all") {
      heading = esc(state.activeCategory);
    }
    $("grid-heading").innerHTML = heading;

    $("post-grid").innerHTML = gridPosts.map(cardHtml).join("");

    var empty = $("empty-state");
    if (posts.length === 0) {
      empty.hidden = false;
      empty.textContent = filtering
        ? "Nothing found. Try another word or category."
        : "No posts yet — add your first post in data/posts.json.";
    } else if (featured && gridPosts.length === 0) {
      empty.hidden = false;
      empty.textContent = "More publications coming soon.";
    } else {
      empty.hidden = true;
    }
  }

  function featuredHtml(post, others) {
    var asideItems = others.slice(0, 4).map(function (p) {
      return (
        "<li>" +
        (p.category ? '<p class="kicker">' + esc(p.category) + "</p>" : "") +
        '<a href="#/post/' + encodeURIComponent(p.id) + '">' + esc(p.title) + "</a>" +
        "</li>"
      );
    });

    var aside =
      '<aside class="featured__aside">' +
      '<h2 class="aside-title">The Latest</h2>' +
      '<ul class="aside-list">' +
      (asideItems.length
        ? asideItems.join("")
        : '<li><p class="kicker">Coming soon</p></li>') +
      "</ul></aside>";

    var figure = post.image
      ? '<figure class="featured__figure"><a href="#/post/' + encodeURIComponent(post.id) + '">' +
        '<img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" /></a>' +
        (post.imageCaption ? '<figcaption class="featured__caption">' + esc(post.imageCaption) + "</figcaption>" : "") +
        "</figure>"
      : "";

    return (
      '<article class="featured">' +
      '<div class="featured__main">' +
      (post.category ? '<p class="kicker">' + esc(post.category) + "</p>" : "") +
      '<h2 class="featured__title"><a href="#/post/' + encodeURIComponent(post.id) + '">' + esc(post.title) + "</a></h2>" +
      (post.subtitle ? '<p class="featured__subtitle">' + esc(post.subtitle) + "</p>" : "") +
      bylineHtml(post) +
      figure +
      (post.excerpt ? '<p class="featured__excerpt">' + esc(post.excerpt) + "</p>" : "") +
      "</div>" +
      aside +
      "</article>"
    );
  }

  function cardHtml(post) {
    var img = post.image
      ? '<a href="#/post/' + encodeURIComponent(post.id) + '">' +
        '<img class="card__img" src="' + esc(post.image) + '" alt="' + esc(post.title) + '" /></a>'
      : "";
    return (
      '<article class="card">' +
      img +
      (post.category ? '<p class="kicker">' + esc(post.category) + "</p>" : "") +
      '<h3 class="card__title"><a href="#/post/' + encodeURIComponent(post.id) + '">' + esc(post.title) + "</a></h3>" +
      (post.excerpt ? '<p class="card__excerpt">' + esc(post.excerpt) + "</p>" : "") +
      bylineHtml(post) +
      "</article>"
    );
  }

  // ---------- Rendering: single article ----------

  function renderPost(id) {
    var post = state.posts.filter(function (p) { return p.id === id; })[0];
    if (!post) {
      location.hash = "#/";
      return;
    }

    var paragraphs = Array.isArray(post.content) ? post.content : [post.content].filter(Boolean);
    var figure = post.image
      ? '<figure class="article__figure"><img src="' + esc(post.image) + '" alt="' + esc(post.title) + '" />' +
        (post.imageCaption ? "<figcaption>" + esc(post.imageCaption) + "</figcaption>" : "") +
        "</figure>"
      : "";

    $("view-home").hidden = true;
    var view = $("view-post");
    view.hidden = false;
    view.innerHTML =
      '<article class="article">' +
      '<a class="article__back" href="#/">&larr; Back to the front page</a>' +
      '<header class="article__header">' +
      (post.category ? '<p class="kicker">' + esc(post.category) + "</p>" : "") +
      '<h1 class="article__title">' + esc(post.title) + "</h1>" +
      (post.subtitle ? '<p class="article__subtitle">' + esc(post.subtitle) + "</p>" : "") +
      bylineHtml(post) +
      '<hr class="article__rule" />' +
      "</header>" +
      figure +
      '<div class="article__body">' +
      paragraphs.map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") +
      "</div>" +
      "</article>";

    window.scrollTo(0, 0);
  }

  // ---------- Routing ----------

  function route() {
    var hash = location.hash || "#/";
    var match = hash.match(/^#\/post\/(.+)$/);
    if (match) {
      renderPost(decodeURIComponent(match[1]));
    } else {
      renderHome();
    }
  }

  // ---------- Events ----------

  function bindEvents() {
    $("category-nav").addEventListener("click", function (event) {
      var btn = event.target.closest(".nav__link");
      if (!btn) return;
      state.activeCategory = btn.getAttribute("data-category");
      updateNavActive();
      location.hash = "#/";
      renderHome();
    });

    $("search-form").addEventListener("submit", function (event) {
      event.preventDefault();
      state.query = $("search-input").value;
      location.hash = "#/";
      renderHome();
    });

    $("search-input").addEventListener("input", function (event) {
      state.query = event.target.value;
      if (!$("view-home").hidden) renderHome();
    });

    $("newsletter-form").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = $("newsletter-email");
      var feedback = $("newsletter-feedback");
      var email = input.value.trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        feedback.textContent = "Please enter a valid email address.";
        feedback.className = "newsletter__feedback is-error";
        return;
      }

      // Front-end only for now: subscribers are kept in this browser's
      // localStorage. Point the form at a real service (Buttondown,
      // Mailchimp, Formspree…) when you're ready to collect real signups.
      try {
        var list = JSON.parse(localStorage.getItem("lusa-newsletter") || "[]");
        if (list.indexOf(email) === -1) list.push(email);
        localStorage.setItem("lusa-newsletter", JSON.stringify(list));
      } catch (e) {
        /* storage unavailable — the confirmation still shows */
      }

      input.value = "";
      feedback.textContent = "Thank you — you're on the list.";
      feedback.className = "newsletter__feedback is-ok";
    });

    window.addEventListener("hashchange", route);
  }

  // ---------- Init ----------

  loadData().then(function () {
    renderChrome();
    renderNav();
    bindEvents();
    route();
  });
})();
