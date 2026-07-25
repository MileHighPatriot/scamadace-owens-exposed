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
  var SITE_UPDATED = "2026-07-25";

  // —— Mobile nav (a11y) ——
  var toggle = qs(".nav-toggle");
  var links = qs(".nav-links");
  if (toggle && links) {
    if (!links.id) links.id = "site-nav";
    toggle.setAttribute("aria-controls", links.id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");

    function setOpen(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      setOpen(!links.classList.contains("open"));
    });

    // Close on outside click / Escape / link navigation
    document.addEventListener("click", function (e) {
      if (!links.classList.contains("open")) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    links.addEventListener("click", function (e) {
      if (e.target && e.target.tagName === "A") setOpen(false);
    });
  }

  // —— Active nav (claim detail counts as catalog) ——
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (path === "claim.html") path = "claims.html";
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

    /** Absolute URL for the current page (or path relative to site root). */
    absoluteUrl: function (pathOrUrl) {
      if (pathOrUrl && /^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
      try {
        if (location.protocol === "http:" || location.protocol === "https:") {
          return pathOrUrl
            ? new URL(pathOrUrl, location.href).href
            : location.href.split("#")[0];
        }
      } catch (e) {}
      var base = SITE_ORIGIN.replace(/\/$/, "");
      if (!pathOrUrl) return base + "/";
      return base + "/" + String(pathOrUrl).replace(/^\//, "");
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
      var image =
        opts.image ||
        SITE_ORIGIN.replace(/\/$/, "") + "/assets/og-image.svg";
      if (desc) SOE.setHeadMeta("name", "description", desc);
      SOE.setHeadMeta("property", "og:title", title);
      SOE.setHeadMeta("property", "og:description", desc);
      SOE.setHeadMeta("property", "og:url", url);
      SOE.setHeadMeta("property", "og:type", type);
      SOE.setHeadMeta("property", "og:site_name", "Scamdace Owens Exposed");
      SOE.setHeadMeta("property", "og:image", image);
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
})();
