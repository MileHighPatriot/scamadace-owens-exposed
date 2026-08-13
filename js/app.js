/* Scamdace Owens Exposed — shared UI */
(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  // Canonical public origin (GitHub Pages until custom domain is enforced)
  var SITE_ORIGIN = "https://milehighpatriot.github.io/scamadace-owens-exposed";
  var SITE_UPDATED = "2026-08-12";

  // —— Mobile nav (a11y) ——
  // Delegated so it still works after mountChrome replaces the header on /c/ pages.
  function setNavOpen(open) {
    var toggle = qs(".nav-toggle");
    var links = qs(".nav-links");
    if (!links) return;
    links.classList.toggle("open", open);
    if (toggle) {
      if (!links.id) links.id = "site-nav";
      toggle.setAttribute("aria-controls", links.id);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
  }

  document.addEventListener("click", function (e) {
    var toggle = qs(".nav-toggle");
    var links = qs(".nav-links");
    if (!toggle || !links) return;
    if (toggle.contains(e.target)) {
      e.stopPropagation();
      setNavOpen(!links.classList.contains("open"));
      return;
    }
    var navLink = e.target && e.target.closest ? e.target.closest("a") : null;
    if (links.classList.contains("open") && links.contains(e.target) && navLink) {
      setNavOpen(false);
      return;
    }
    if (links.classList.contains("open") && !links.contains(e.target)) {
      setNavOpen(false);
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var toggle = qs(".nav-toggle");
    var links = qs(".nav-links");
    if (links && links.classList.contains("open")) {
      setNavOpen(false);
      if (toggle) toggle.focus();
    }
  });
  setNavOpen(false);

  // —— Active nav (claim detail counts as catalog) ——
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (
    path === "claim.html" ||
    document.body.getAttribute("data-claim-id") ||
    /\/c\//.test(location.pathname || "")
  ) {
    path = "claims.html";
  }
  qsa(".nav-links a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    }
  });

  // —— Reading progress (long pages) ——
  var progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("role", "progressbar");
  progress.setAttribute("aria-hidden", "true");
  progress.setAttribute("aria-valuemin", "0");
  progress.setAttribute("aria-valuemax", "100");
  progress.setAttribute("aria-valuenow", "0");
  document.body.appendChild(progress);

  function updateProgress() {
    var doc = document.documentElement;
    var scrollTop = window.scrollY || doc.scrollTop;
    var height = doc.scrollHeight - doc.clientHeight;
    var pct = height > 0 ? Math.min(100, Math.round((scrollTop / height) * 100)) : 0;
    progress.style.width = pct + "%";
    progress.setAttribute("aria-valuenow", String(pct));
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  function updateHeaderState() {
    var header = qs(".site-header");
    if (!header) return;
    header.classList.toggle("is-scrolled", (window.scrollY || 0) > 10);
  }
  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();

  // —— Back to top ——
  var topBtn = document.createElement("button");
  topBtn.type = "button";
  topBtn.className = "back-to-top";
  topBtn.setAttribute("aria-label", "Back to top");
  topBtn.innerHTML = "↑";
  topBtn.hidden = true;
  document.body.appendChild(topBtn);
  topBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  window.addEventListener(
    "scroll",
    function () {
      topBtn.hidden = (window.scrollY || 0) < 480;
    },
    { passive: true }
  );

  // —— Shared helpers ——
  window.SOE = {
    SITE_ORIGIN: SITE_ORIGIN,
    SITE_UPDATED: SITE_UPDATED,
    OG_IMAGE: SITE_ORIGIN.replace(/\/$/, "") + "/assets/og-image.png",
    rootPrefix: /\/c\/[^/]+\.html$/i.test(location.pathname || "") ? "../" : "",

    claimPath: function (id) {
      return "c/" + encodeURIComponent(id) + ".html";
    },

    claimHref: function (id) {
      return (this.rootPrefix || "") + this.claimPath(id);
    },

    currentClaimId: function () {
      var q = new URLSearchParams(location.search).get("id");
      if (q) return q;
      var attr = document.body.getAttribute("data-claim-id");
      if (attr) return attr;
      var m = (location.pathname || "").match(/\/c\/([^/]+)\.html$/i);
      if (m) return decodeURIComponent(m[1]);
      return null;
    },

    getClaim: function (id) {
      return (window.CLAIMS_DATA || []).find(function (c) {
        return c.id === id;
      });
    },

    verdictHtml: function (verdict) {
      var meta = (window.VERDICT_META || {})[verdict] || {
        label: verdict,
        className: "verdict-unsupported",
      };
      return (
        '<span class="verdict ' +
        meta.className +
        '" title="' +
        escapeAttr(meta.blurb || meta.label || verdict) +
        '">' +
        escapeHtml(meta.label) +
        "</span>"
      );
    },

    categoryLabels: function (cats) {
      var map = {};
      (window.CATEGORIES || []).forEach(function (c) {
        map[c.id] = c.label;
      });
      return (cats || []).map(function (id) {
        return map[id] || id;
      });
    },

    copyText: function (text, btn) {
      function done() {
        if (!btn) return;
        var old = btn.textContent;
        btn.textContent = "Copied";
        btn.setAttribute("aria-live", "polite");
        setTimeout(function () {
          btn.textContent = old;
        }, 1500);
      }
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else {
        fallback();
      }
    },

    tierLabel: function (tier) {
      var labels = {
        1: "Tier 1 — Court / charging / official case facts",
        2: "Tier 2 — Named officials & law-enforcement briefings",
        3: "Tier 3 — Primary video / audio of the event",
        4: "Tier 4 — Multi-outlet reporting citing documents",
        5: "Tier 5 — Analysis / logic (clearly labeled)",
      };
      return labels[tier] || "Evidence";
    },

    /** Absolute URL for a site-root path (e.g. c/foo.html) or the current page. */
    absoluteUrl: function (pathOrUrl) {
      if (pathOrUrl && /^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
      var origin = SITE_ORIGIN.replace(/\/$/, "");
      if (!pathOrUrl) {
        var file = (location.pathname.split("/").pop() || "index.html");
        if (/\/c\/[^/]+\.html$/i.test(location.pathname || "")) {
          return origin + "/c/" + file;
        }
        if (!file || file === "index.html") return origin + "/";
        return origin + "/" + file;
      }
      return origin + "/" + String(pathOrUrl).replace(/^\//, "");
    },

    /** Ensure / update a <meta> or <link> head tag. */
    setHeadMeta: function (attr, key, content) {
      if (!content) return;
      var sel =
        attr === "property"
          ? 'meta[property="' + key + '"]'
          : attr === "name"
            ? 'meta[name="' + key + '"]'
            : 'link[rel="' + key + '"]';
      var el = document.head.querySelector(sel);
      if (attr === "rel") {
        if (!el) {
          el = document.createElement("link");
          el.setAttribute("rel", key);
          document.head.appendChild(el);
        }
        el.setAttribute("href", content);
        return;
      }
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    },

    /** Apply Open Graph + Twitter + description for a page. */
    applySocialMeta: function (opts) {
      opts = opts || {};
      var title = opts.title || document.title;
      var desc = opts.description || "";
      var url = opts.url || SOE.absoluteUrl();
      var type = opts.type || "website";
      var image = opts.image || SOE.OG_IMAGE;
      if (desc) SOE.setHeadMeta("name", "description", desc);
      SOE.setHeadMeta("property", "og:title", title);
      SOE.setHeadMeta("property", "og:description", desc);
      SOE.setHeadMeta("property", "og:url", url);
      SOE.setHeadMeta("property", "og:type", type);
      SOE.setHeadMeta("property", "og:site_name", "Scamdace Owens Exposed");
      SOE.setHeadMeta("property", "og:image", image);
      SOE.setHeadMeta("property", "og:image:type", "image/png");
      SOE.setHeadMeta("property", "og:image:width", "1200");
      SOE.setHeadMeta("property", "og:image:height", "630");
      SOE.setHeadMeta("name", "twitter:card", "summary_large_image");
      SOE.setHeadMeta("name", "twitter:title", title);
      SOE.setHeadMeta("name", "twitter:description", desc);
      SOE.setHeadMeta("name", "twitter:image", image);
      SOE.setHeadMeta("rel", "canonical", url);
    },

    formatUpdated: function (iso) {
      iso = iso || SITE_UPDATED;
      try {
        var d = new Date(iso + "T12:00:00");
        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      } catch (e) {
        return iso;
      }
    },

    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,

    archiveUrl: function (url) {
      if (!url || !/^https?:\/\//i.test(url)) return null;
      return "https://archive.today/?run=1&url=" + encodeURIComponent(url);
    },

    /** Inject shared header/footer when #site-header-mount / #site-footer-mount exist. */
    mountChrome: function () {
      var headerMount = qs("#site-header-mount");
      var footerMount = qs("#site-footer-mount");
      var prefix = SOE.rootPrefix || "";
      var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
      if (
        path === "claim.html" ||
        document.body.getAttribute("data-claim-id") ||
        /\/c\//.test(location.pathname || "")
      ) {
        path = "claims.html";
      }

      var archivePages =
        "timeline episodes people methods pivots contradictions quotes vault compare hearing legal exhibits media glossary faq journalists family graph map report press-kit research grief-economy burdens falsify archive";
      var isArchiveTool =
        archivePages.split(" ").indexOf(path.replace(".html", "")) !== -1;

      function navLink(href, label) {
        var file = href.split("/").pop().toLowerCase();
        var active =
          file === path ||
          (path === "" && file === "index.html");
        if (isArchiveTool && file === "archive.html") active = true;
        if (path === "facts.html" && file === "facts.html") active = true;
        return (
          '<a href="' +
          prefix +
          href +
          '"' +
          (active ? ' class="active"' : "") +
          (active ? ' aria-current="page"' : "") +
          ">" +
          label +
          "</a>"
        );
      }

      if (headerMount) {
        var sub = isArchiveTool
          ? '<div class="nav-sub" aria-label="Archive sections">' +
            '<a href="' + prefix + 'episodes.html">Episodes</a>' +
            '<a href="' + prefix + 'methods.html">Methods</a>' +
            '<a href="' + prefix + 'contradictions.html">Contradictions</a>' +
            '<a href="' + prefix + 'quotes.html">Quotes</a>' +
            '<a href="' + prefix + 'vault.html">Vault</a>' +
            '<a href="' + prefix + 'hearing.html">Hearing</a>' +
            '<a href="' + prefix + 'legal.html">Legal</a>' +
            '<a href="' + prefix + 'graph.html">Graph</a>' +
            '<a href="' + prefix + 'report.html">Report</a>' +
            '<a href="' + prefix + 'journalists.html">Journalists</a>' +
            '<a href="' + prefix + 'family.html">Families</a>' +
            '<a href="' + prefix + 'feed.xml">RSS</a>' +
            "</div>"
          : "";
        if (window.SOE_RENDER && SOE_RENDER.renderHeader) {
          headerMount.innerHTML = SOE_RENDER.renderHeader(prefix, path) + sub;
        } else {
          headerMount.innerHTML =
            '<header class="site-header">' +
            '<div class="nav-inner">' +
            '<a class="brand" href="' +
            prefix +
            'index.html"><strong>Scamdace Owens Exposed</strong><span>Kirk assassination claim archive</span></a>' +
            '<button class="nav-toggle" type="button" aria-label="Open menu">Menu</button>' +
            '<nav class="nav-links" id="site-nav" aria-label="Primary">' +
            navLink("index.html", "Home") +
            navLink("claims.html", "Claims") +
            navLink("archive.html", "Archive") +
            navLink("facts.html", "Record") +
            navLink("search.html", "Search") +
            navLink("about.html", "About") +
            "</nav></div>" +
            sub +
            "</header>";
        }
        setNavOpen(false);
        updateHeaderState();
      }

      if (footerMount) {
        footerMount.innerHTML =
          window.SOE_RENDER && SOE_RENDER.renderFooter
            ? SOE_RENDER.renderFooter(prefix)
            : '<footer class="site-footer"><div class="footer-inner">' +
              "<div><strong>Scamdace Owens Exposed</strong><br/>By MileHigh Patriot · " +
              '<a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a></div>' +
              '<nav class="footer-links" aria-label="Footer">' +
              '<a href="' + prefix + 'claims.html">Claims</a>' +
              '<a href="' + prefix + 'archive.html">Archive hub</a>' +
              '<a href="' + prefix + 'facts.html">Public record</a>' +
              '<a href="' + prefix + 'timeline.html">Timeline</a>' +
              '<a href="' + prefix + 'people.html">People</a>' +
              '<a href="' + prefix + 'search.html">Search</a>' +
              '<a href="' + prefix + 'earnings.html">Earnings</a>' +
              '<a href="' + prefix + 'submit.html">Submit</a>' +
              '<a href="' + prefix + 'corrections.html">Corrections</a>' +
              '<a href="' + prefix + 'about.html">About</a>' +
              '<a href="' + prefix + 'feed.xml">RSS</a>' +
              "</nav>" +
              '<p class="footer-meta">Catalog baseline: August 12, 2026 · Static archive · No tracking required</p>' +
              "</div></footer>";
      }
    },
  };

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  // Mount chrome for archive pages (and any page using mounts)
  if (qs("#site-header-mount") || qs("#site-footer-mount")) {
    SOE.mountChrome();
  }
})();
