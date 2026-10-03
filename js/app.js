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
    categories: ["Fashion", "Culture", "Business"],
    posts: [
      {
        id: "sample-quiet-return-of-tailoring",
        title: "The Quiet Return of Tailoring",
        subtitle:
          "Why a well-cut blazer says more this season than any logo ever could.",
        category: "Fashion",
        author: "Façanha",
        date: "2026-09-01",
        image: placeholderImage("Featured image placeholder", "#e9dfc8"),
        imageCaption: "Replace this placeholder by setting the “image” field of your post.",
        excerpt:
          "After years of loud prints and louder logos, the sharpest statement on the street is a shoulder that actually fits. Tailoring is back — and this time it is personal.",
        content: [
          "After years of loud prints and louder logos, the sharpest statement on the street is a shoulder that actually fits. Tailoring is back — and this time it is personal.",
          "This is sample text, included only so you can see how an article page looks. Send your first real article and this sample will step aside the moment it is published.",
          "Each post supports a title, a subtitle, a category, an author, a date, an optional image with caption, a short excerpt for the front page, and as many paragraphs as you like."
        ],
        featured: true
      },
      {
        id: "sample-ode-to-the-white-shirt",
        title: "An Ode to the White Shirt",
        subtitle: "",
        category: "Fashion",
        author: "Façanha",
        date: "2026-08-28",
        image: placeholderImage("Image placeholder", "#e6dcc4"),
        imageCaption: "",
        excerpt:
          "Trends arrive and leave by the season. The white shirt stays — on runways, in offices, at midnight. A love letter to the one piece that survives every cycle.",
        content: [
          "Trends arrive and leave by the season. The white shirt stays — on runways, in offices, at midnight. A love letter to the one piece that survives every cycle.",
          "This is sample content. It will be replaced by your own writing."
        ],
        featured: false
      },
      {
        id: "sample-packing-light-for-paris",
        title: "Packing Light for Paris",
        subtitle: "",
        category: "Culture",
        author: "Façanha",
        date: "2026-08-21",
        image: placeholderImage("Image placeholder", "#ece2cb"),
        imageCaption: "",
        excerpt:
          "One carry-on, twelve looks, seven days. On the discipline of choosing well — and what a suitcase reveals about its owner.",
        content: [
          "One carry-on, twelve looks, seven days. On the discipline of choosing well — and what a suitcase reveals about its owner.",
          "This is sample content. It will be replaced by your own writing."
        ],
        featured: false
      },
      {
        id: "sample-cinema-of-costume",
        title: "The Cinema of Costume",
        subtitle: "",
        category: "Culture",
        author: "Façanha",
        date: "2026-08-14",
        image: "",
        imageCaption: "",
        excerpt:
          "Before a character says a word, their wardrobe has already spoken. What film costume design teaches us about the stories clothes tell.",
        content: [
          "Before a character says a word, their wardrobe has already spoken. What film costume design teaches us about the stories clothes tell.",
          "This is sample content. It will be replaced by your own writing."
        ],
        featured: false
      },
      {
        id: "sample-semester-in-margin-notes",
        title: "A Semester in Margin Notes",
        subtitle: "",
        category: "Culture",
        author: "Façanha",
        date: "2026-08-07",
        image: "",
        imageCaption: "",
        excerpt:
          "What a highlighter, a library seat and a well-kept planner taught me about paying attention. Notes on studying — and on learning how to learn.",
        content: [
          "What a highlighter, a library seat and a well-kept planner taught me about paying attention. Notes on studying — and on learning how to learn.",
          "This is sample content. It will be replaced by your own writing."
        ],
        featured: false
      },
      {
        id: "sample-business-of-being-a-brand",
        title: "The Business of Being a Brand",
        subtitle: "",
        category: "Business",
        author: "Façanha",
        date: "2026-07-30",
        image: placeholderImage("Image placeholder", "#e9dfc8"),
        imageCaption: "",
        excerpt:
          "From atelier to algorithm: how small labels grow an audience — and a margin — without losing their soul along the way.",
        content: [
          "From atelier to algorithm: how small labels grow an audience — and a margin — without losing their soul along the way.",
          "This is sample content. It will be replaced by your own writing."
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
    usingSamples: false,
    lang: "en"
  };

  // ---------- Languages ----------

  // Interface strings. Article text lives in posts.json (post.translations);
  // site-wide strings such as the tagline live in site.translations.
  var I18N = {
    en: {
      locale: "en-US",
      skip: "Skip to content",
      searchPlaceholder: "Search articles…",
      search: "Search",
      langLabel: "Language",
      moreLanguages: "More languages (Google Translate)",
      all: "All",
      latest: "Latest Publications",
      theLatest: "The Latest",
      comingSoon: "Coming soon",
      moreSoon: "More publications coming soon.",
      nothingFound: "Nothing found. Try another word or category.",
      noPosts: "No posts yet — add your first post in data/posts.json.",
      searchResults: "Search results for “%s”",
      back: "← Back to the front page",
      by: "By",
      notTranslated: "This article hasn’t been translated yet — showing the English original.",
      nlKicker: "Newsletter",
      nlTitle: "The Journal, delivered.",
      nlText: "New essays and notes, straight to your inbox. No noise — just the writing.",
      nlPlaceholder: "your@email.com",
      nlButton: "Subscribe",
      nlInvalid: "Please enter a valid email address.",
      nlNotConnected: "Newsletter signup isn’t connected yet.",
      nlSubscribing: "Subscribing…",
      nlSuccess: "Almost there — check your inbox to confirm your subscription."
    },
    pt: {
      locale: "pt-BR",
      skip: "Pular para o conteúdo",
      searchPlaceholder: "Buscar artigos…",
      search: "Buscar",
      langLabel: "Idioma",
      moreLanguages: "Outros idiomas (Google Tradutor)",
      all: "Todos",
      latest: "Últimas Publicações",
      theLatest: "Mais Recentes",
      comingSoon: "Em breve",
      moreSoon: "Mais publicações em breve.",
      nothingFound: "Nada encontrado. Tente outra palavra ou categoria.",
      noPosts: "Ainda não há posts — adicione o primeiro em data/posts.json.",
      searchResults: "Resultados da busca por “%s”",
      back: "← Voltar para a capa",
      by: "Por",
      notTranslated: "Este artigo ainda não foi traduzido — exibindo o original em inglês.",
      nlKicker: "Newsletter",
      nlTitle: "O Journal, na sua caixa de entrada.",
      nlText: "Novos ensaios e notas, direto no seu e-mail. Sem ruído — só a escrita.",
      nlPlaceholder: "seu@email.com",
      nlButton: "Assinar",
      nlInvalid: "Digite um e-mail válido.",
      nlNotConnected: "A assinatura da newsletter ainda não está conectada.",
      nlSubscribing: "Assinando…",
      nlSuccess: "Quase lá — confira seu e-mail para confirmar a assinatura."
    }
  };

  // Languages offered through Google Translate when no native translation exists.
  var MACHINE_LANGS = [
    ["es", "Español"], ["fr", "Français"], ["it", "Italiano"], ["de", "Deutsch"],
    ["ja", "日本語"], ["zh-CN", "中文"], ["ko", "한국어"], ["ar", "العربية"],
    ["ru", "Русский"], ["hi", "हिन्दी"]
  ];

  function t(key) {
    var table = I18N[state.lang] || I18N.en;
    return table[key] != null ? table[key] : I18N.en[key] || key;
  }

  function fmt(key, value) {
    return t(key).replace("%s", value);
  }

  // A post field in the current language, falling back to the original.
  function tr(post, field) {
    var tx = post.translations && post.translations[state.lang];
    var value = tx ? tx[field] : null;
    if (Array.isArray(value)) return value.length ? value : post[field];
    return value || post[field];
  }

  function hasTranslation(post) {
    return state.lang === "en" || !!(post.translations && post.translations[state.lang]);
  }

  function siteText(field) {
    var tx = state.site.translations && state.site.translations[state.lang];
    return (tx && tx[field]) || state.site[field];
  }

  function catLabel(cat) {
    var tx = state.site.translations && state.site.translations[state.lang];
    return (tx && tx.categories && tx.categories[cat]) || cat;
  }

  function siteLangCodes() {
    return (state.site.languages || []).map(function (l) { return l.code; });
  }

  function detectLang() {
    var codes = siteLangCodes();
    var fromUrl = new URLSearchParams(location.search).get("lang");
    var stored = null;
    try { stored = localStorage.getItem("journal-lang"); } catch (e) { /* ignore */ }
    var browser = (navigator.language || "").slice(0, 2).toLowerCase();
    var pick = [fromUrl, stored, browser, "en"].filter(function (c) {
      return c && codes.indexOf(c) !== -1;
    })[0];
    return pick || "en";
  }

  function setLang(code) {
    state.lang = code;
    try { localStorage.setItem("journal-lang", code); } catch (e) { /* ignore */ }
    renderChrome();
    renderNav();
    route();
  }

  function machineTranslateUrl(code) {
    var here = location.href.split("#")[0];
    return (
      "https://translate.google.com/translate?sl=en&tl=" + encodeURIComponent(code) +
      "&u=" + encodeURIComponent(here)
    );
  }

  function renderLangSwitcher() {
    var langs = state.site.languages || [];
    if (langs.length < 2 && MACHINE_LANGS.length === 0) {
      $("lang-slot").innerHTML = "";
      return;
    }
    var options = langs.map(function (l) {
      return '<option value="' + esc(l.code) + '"' + (l.code === state.lang ? " selected" : "") + ">" + esc(l.label) + "</option>";
    });
    var machine = MACHINE_LANGS.filter(function (m) { return siteLangCodes().indexOf(m[0]) === -1; })
      .map(function (m) { return '<option value="gt:' + esc(m[0]) + '">' + esc(m[1]) + "</option>"; });
    $("lang-slot").innerHTML =
      '<label class="lang">' +
      '<span class="lang__label">' + esc(t("langLabel")) + "</span>" +
      '<select class="lang__select" id="lang-select" aria-label="' + esc(t("langLabel")) + '">' +
      options.join("") +
      (machine.length ? '<optgroup label="' + esc(t("moreLanguages")) + '">' + machine.join("") + "</optgroup>" : "") +
      "</select></label>";
  }

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
    return d.toLocaleDateString(t("locale"), {
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
    var author = post.author ? esc(t("by")) + " <strong>" + esc(post.author) + "</strong>" : "";
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
      // The real category list from posts.json still wins in sample mode.
      if (categories.length === 0) categories = SAMPLE_DATA.categories;
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
      state.site.newsletterAction = data.site.newsletterAction || "";
      state.site.languages = Array.isArray(data.site.languages) && data.site.languages.length
        ? data.site.languages
        : [{ code: "en", label: "English" }];
      state.site.translations = data.site.translations || {};
    }

    state.posts = sortByDateDesc(posts);
    state.categories = categories;
  }

  function isRealPost(post) {
    return post && typeof post === "object" && (post.title || post.id);
  }

  function loadData() {
    // A single-file build (e.g. the preview artifact) inlines the data instead.
    if (window.JOURNAL_DATA) return Promise.resolve(window.JOURNAL_DATA).then(normalizeData);
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
    document.documentElement.lang = state.lang;
    $("site-name").textContent = state.site.name;
    $("site-tagline").textContent = siteText("tagline");
    $("footer-name").textContent = state.site.name;
    $("footer-text").textContent = siteText("footerText");
    $("footer-year").textContent = String(new Date().getFullYear());
    document.title = state.site.name;

    $("skip-link").textContent = t("skip");
    $("search-input").placeholder = t("searchPlaceholder");
    $("search-input").setAttribute("aria-label", t("searchPlaceholder"));
    $("search-btn").textContent = t("search");
    $("nl-kicker").textContent = t("nlKicker");
    $("nl-title").textContent = t("nlTitle");
    $("nl-text").textContent = t("nlText");
    $("newsletter-email").placeholder = t("nlPlaceholder");
    $("nl-btn").textContent = t("nlButton");

    $("current-date").textContent = new Date().toLocaleDateString(t("locale"), {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    renderLangSwitcher();
    $("sample-notice").hidden = !state.usingSamples;
  }

  function renderNav() {
    var items = ['<li><button type="button" class="nav__link" data-category="all">' + esc(t("all")) + "</button></li>"];
    state.categories.forEach(function (cat) {
      items.push(
        '<li><button type="button" class="nav__link" data-category="' +
          esc(cat) +
          '">' +
          esc(catLabel(cat)) +
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
        catLabel(post.category),
        contentText(post.content),
        tr(post, "title"),
        tr(post, "subtitle"),
        tr(post, "excerpt"),
        contentText(tr(post, "content"))
      ]
        .join(" ")
        .toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function contentText(content) {
    if (!Array.isArray(content)) return String(content || "");
    return content
      .map(function (b) {
        if (typeof b === "string") return b;
        if (!b || typeof b !== "object") return "";
        return [b.heading, b.subtitle, b.quote, b.caption].filter(Boolean).join(" ");
      })
      .join(" ");
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

    var heading = esc(t("latest"));
    if (state.query.trim() !== "") {
      heading = esc(fmt("searchResults", state.query.trim()));
    } else if (state.activeCategory !== "all") {
      heading = esc(catLabel(state.activeCategory));
    }
    $("grid-heading").innerHTML = heading;

    $("post-grid").innerHTML = gridPosts.map(cardHtml).join("");

    var empty = $("empty-state");
    if (posts.length === 0) {
      empty.hidden = false;
      empty.textContent = filtering ? t("nothingFound") : t("noPosts");
    } else if (featured && gridPosts.length === 0) {
      empty.hidden = false;
      empty.textContent = t("moreSoon");
    } else {
      empty.hidden = true;
    }
  }

  function featuredHtml(post, others) {
    var asideItems = others.slice(0, 4).map(function (p) {
      return (
        "<li>" +
        (p.category ? '<p class="kicker">' + esc(catLabel(p.category)) + "</p>" : "") +
        '<a href="#/post/' + encodeURIComponent(p.id) + '">' + esc(tr(p, "title")) + "</a>" +
        "</li>"
      );
    });

    var aside =
      '<aside class="featured__aside">' +
      '<h2 class="aside-title">' + esc(t("theLatest")) + "</h2>" +
      '<ul class="aside-list">' +
      (asideItems.length
        ? asideItems.join("")
        : '<li><p class="kicker">' + esc(t("comingSoon")) + "</p></li>") +
      "</ul></aside>";

    var title = tr(post, "title");
    var subtitle = tr(post, "subtitle");
    var excerpt = tr(post, "excerpt");
    var caption = tr(post, "imageCaption");

    var figure = post.image
      ? '<figure class="featured__figure"><a href="#/post/' + encodeURIComponent(post.id) + '">' +
        '<img src="' + esc(post.image) + '" alt="' + esc(title) + '" /></a>' +
        (caption ? '<figcaption class="featured__caption">' + esc(caption) + "</figcaption>" : "") +
        "</figure>"
      : "";

    return (
      '<article class="featured">' +
      '<div class="featured__main">' +
      (post.category ? '<p class="kicker">' + esc(catLabel(post.category)) + "</p>" : "") +
      '<h2 class="featured__title"><a href="#/post/' + encodeURIComponent(post.id) + '">' + esc(title) + "</a></h2>" +
      (subtitle ? '<p class="featured__subtitle">' + esc(subtitle) + "</p>" : "") +
      bylineHtml(post) +
      figure +
      (excerpt ? '<p class="featured__excerpt">' + esc(excerpt) + "</p>" : "") +
      "</div>" +
      aside +
      "</article>"
    );
  }

  function cardHtml(post) {
    var title = tr(post, "title");
    var excerpt = tr(post, "excerpt");
    var img = post.image
      ? '<a href="#/post/' + encodeURIComponent(post.id) + '">' +
        '<img class="card__img" src="' + esc(post.image) + '" alt="' + esc(title) + '" /></a>'
      : "";
    return (
      '<article class="card">' +
      img +
      (post.category ? '<p class="kicker">' + esc(catLabel(post.category)) + "</p>" : "") +
      '<h3 class="card__title"><a href="#/post/' + encodeURIComponent(post.id) + '">' + esc(title) + "</a></h3>" +
      (excerpt ? '<p class="card__excerpt">' + esc(excerpt) + "</p>" : "") +
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

    var title = tr(post, "title");
    var subtitle = tr(post, "subtitle");
    var caption = tr(post, "imageCaption");
    var content = tr(post, "content");
    var blocks = Array.isArray(content) ? content : [content].filter(Boolean);
    var figure = post.image
      ? '<figure class="article__figure"><img src="' + esc(post.image) + '" alt="' + esc(title) + '" />' +
        (caption ? "<figcaption>" + esc(caption) + "</figcaption>" : "") +
        "</figure>"
      : "";

    $("view-home").hidden = true;
    var view = $("view-post");
    view.hidden = false;
    view.innerHTML =
      '<article class="article">' +
      '<a class="article__back" href="#/">' + esc(t("back")) + "</a>" +
      '<header class="article__header">' +
      (post.category ? '<p class="kicker">' + esc(catLabel(post.category)) + "</p>" : "") +
      '<h1 class="article__title">' + esc(title) + "</h1>" +
      (subtitle ? '<p class="article__subtitle">' + esc(subtitle) + "</p>" : "") +
      bylineHtml(post) +
      (hasTranslation(post) ? "" : '<p class="article__notice">' + esc(t("notTranslated")) + "</p>") +
      '<hr class="article__rule" />' +
      "</header>" +
      figure +
      '<div class="article__body">' +
      blocks.map(contentBlockHtml).join("") +
      "</div>" +
      "</article>";

    window.scrollTo(0, 0);
  }

  // A content item is a plain string (paragraph) or an object:
  //   { "heading": "...", "subtitle": "..." }  section title + optional deck
  //   { "image": "...", "caption": "..." }     full-width figure
  //   { "quote": "..." }                       pull quote
  function contentBlockHtml(block) {
    if (typeof block === "string") return "<p>" + esc(block) + "</p>";
    if (!block || typeof block !== "object") return "";
    if (block.heading) {
      return (
        '<h2 class="article__h2">' + esc(block.heading) + "</h2>" +
        (block.subtitle ? '<p class="article__deck">' + esc(block.subtitle) + "</p>" : "")
      );
    }
    if (block.image) {
      return (
        '<figure class="article__inline">' +
        '<img src="' + esc(block.image) + '" alt="' + esc(block.alt || block.caption || "") + '" loading="lazy" />' +
        (block.caption ? "<figcaption>" + esc(block.caption) + "</figcaption>" : "") +
        "</figure>"
      );
    }
    if (block.quote) return '<blockquote class="article__quote">' + esc(block.quote) + "</blockquote>";
    return "";
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
        feedback.textContent = t("nlInvalid");
        feedback.className = "newsletter__feedback is-error";
        return;
      }

      var form = event.target;
      var action = state.site.newsletterAction || form.getAttribute("action");
      var button = form.querySelector("button");

      if (!action) {
        feedback.textContent = t("nlNotConnected");
        feedback.className = "newsletter__feedback is-error";
        return;
      }

      button.disabled = true;
      feedback.textContent = t("nlSubscribing");
      feedback.className = "newsletter__feedback";

      var body = new FormData();
      body.append("email_address", email);

      // Kit (ConvertKit) answers JSON to an XHR post on the form endpoint.
      fetch(action, { method: "POST", body: body, headers: { Accept: "application/json" } })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (json) { return { ok: res.ok, json: json }; }); })
        .then(function (result) {
          var json = result.json || {};
          if (result.ok && json.status === "success") {
            input.value = "";
            feedback.textContent = t("nlSuccess");
            feedback.className = "newsletter__feedback is-ok";
            return;
          }
          // Kit's spam guard asks the reader to verify on its own page.
          if (json.status === "quarantined" && json.url) {
            window.location.href = json.url;
            return;
          }
          throw new Error((json.errors && json.errors[0]) || "Subscription failed");
        })
        .catch(function () {
          // Network or CORS trouble: fall back to a plain form post, which
          // lands on Kit's own confirmation page. (form.submit() does not
          // re-trigger this handler.)
          form.submit();
        })
        .then(function () { button.disabled = false; });
    });

    window.addEventListener("hashchange", route);

    // The switcher is re-rendered with the chrome, so listen on the document.
    document.addEventListener("change", function (event) {
      if (event.target.id !== "lang-select") return;
      var value = event.target.value;
      if (value.indexOf("gt:") === 0) {
        event.target.value = state.lang;
        window.location.href = machineTranslateUrl(value.slice(3));
        return;
      }
      setLang(value);
    });
  }

  // ---------- Init ----------

  loadData().then(function () {
    state.lang = detectLang();
    renderChrome();
    renderNav();
    bindEvents();
    route();
  });
})();
