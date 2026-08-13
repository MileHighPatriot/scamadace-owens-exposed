/* Shared claim-page HTML. Used by the static generator and claim-detail.js. */
(function (root) {
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

  function truncate(s, n) {
    s = String(s || "");
    if (s.length <= n) return s;
    return s.slice(0, n - 1).trim() + "…";
  }

  function formatUpdated(iso) {
    iso = String(iso || "");
    var parts = iso.split("-");
    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (parts.length < 3) return iso;
    var month = months[Number(parts[1]) - 1];
    if (!month) return iso;
    return month + " " + Number(parts[2]) + ", " + parts[0];
  }

  var TIER_LABELS = {
    1: "Tier 1 — Court / charging / official case facts",
    2: "Tier 2 — Named officials & law-enforcement briefings",
    3: "Tier 3 — Primary video / audio of the event",
    4: "Tier 4 — Multi-outlet reporting citing documents",
    5: "Tier 5 — Analysis / logic (clearly labeled)",
  };

  function tierLabel(tier) {
    return TIER_LABELS[tier] || "Evidence";
  }

  function archiveUrl(url) {
    if (!url || !/^https?:\/\//i.test(url)) return null;
    return "https://archive.today/?run=1&url=" + encodeURIComponent(url);
  }

  function pageHref(prefix, file) {
    return (prefix || "") + file;
  }

  function hrefFor(prefix, url) {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url) || url.charAt(0) === "#" || url.charAt(0) === "/") {
      return url;
    }
    return (prefix || "") + url;
  }

  function claimHref(prefix, id) {
    return (prefix || "") + "c/" + encodeURIComponent(id) + ".html";
  }

  function verdictHtml(verdicts, verdict) {
    var meta = (verdicts || {})[verdict] || {
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
  }

  function categoryLabels(categories, cats) {
    var map = {};
    (categories || []).forEach(function (c) {
      map[c.id] = c.label;
    });
    return (cats || []).map(function (id) {
      return map[id] || id;
    });
  }

  function paragraphsHtml(text) {
    return String(text || "")
      .split(/\n\s*\n/)
      .map(function (block) {
        return block.trim();
      })
      .filter(Boolean)
      .map(function (block) {
        var clean = block.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
        return "<p>" + escapeHtml(clean) + "</p>";
      })
      .join("");
  }

  var NAV_ITEMS = [
    ["index.html", "Home"],
    ["claims.html", "Claims"],
    ["archive.html", "Archive"],
    ["facts.html", "Facts"],
    ["search.html", "Search"],
    ["about.html", "About"],
  ];

  function renderHeader(prefix, activeFile) {
    prefix = prefix || "";
    activeFile = (activeFile || "").toLowerCase();
    var links = NAV_ITEMS.map(function (item) {
      var file = item[0];
      var active = file === activeFile;
      return (
        '<a href="' +
        prefix +
        file +
        '"' +
        (active ? ' class="active" aria-current="page"' : "") +
        ">" +
        item[1] +
        "</a>"
      );
    }).join("");
    return (
      '<header class="site-header">' +
      '<div class="nav-inner">' +
      '<a class="brand" href="' +
      prefix +
      'index.html"><strong>Scamdace Owens Exposed</strong><span>Kirk assassination claim archive</span></a>' +
      '<button class="nav-toggle" type="button" aria-label="Open menu" aria-controls="site-nav" aria-expanded="false">Menu</button>' +
      '<nav class="nav-links" id="site-nav" aria-label="Primary">' +
      links +
      "</nav></div></header>"
    );
  }

  function renderFooter(prefix) {
    prefix = prefix || "";
    return (
      '<footer class="site-footer"><div class="footer-inner">' +
      "<div><strong>Scamdace Owens Exposed</strong><br/>By MileHigh Patriot · " +
      '<a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a></div>' +
      '<nav class="footer-links" aria-label="Footer">' +
      '<a href="' +
      prefix +
      'claims.html">Claims</a>' +
      '<a href="' +
      prefix +
      'archive.html">Archive hub</a>' +
      '<a href="' +
      prefix +
      'facts.html">Public record</a>' +
      '<a href="' +
      prefix +
      'timeline.html">Timeline</a>' +
      '<a href="' +
      prefix +
      'people.html">People</a>' +
      '<a href="' +
      prefix +
      'search.html">Search</a>' +
      '<a href="' +
      prefix +
      'earnings.html">Earnings</a>' +
      '<a href="' +
      prefix +
      'submit.html">Submit</a>' +
      '<a href="' +
      prefix +
      'corrections.html">Corrections</a>' +
      '<a href="' +
      prefix +
      'about.html">About</a>' +
      '<a href="' +
      prefix +
      'feed.xml">RSS</a>' +
      "</nav>" +
      '<p class="footer-meta">Catalog baseline: August 12, 2026 · Static archive · No tracking required</p>' +
      "</div></footer>"
    );
  }

  function renderClaimInner(claim, ctx) {
    ctx = ctx || {};
    var prefix = ctx.prefix || "";
    var verdicts = ctx.verdicts || {};
    var categories = ctx.categories || [];
    var siteUpdated = ctx.siteUpdated || "";
    var origin = String(ctx.origin || "").replace(/\/$/, "");
    var getClaim =
      ctx.getClaim ||
      function () {
        return null;
      };

    var meta = verdicts[claim.verdict] || {};
    var tags = categoryLabels(categories, claim.categories)
      .map(function (t) {
        return '<span class="tag">' + escapeHtml(t) + "</span>";
      })
      .join(" ");

    var primaryHtml = (claim.primarySources || [])
      .map(function (s) {
        var metaBits = [];
        if (s.date) metaBits.push('<span class="src-date">' + escapeHtml(s.date) + "</span>");
        if (s.timestamp) {
          metaBits.push('<span class="src-timestamp">⏱ ' + escapeHtml(s.timestamp) + "</span>");
        }
        var metaRow = metaBits.length
          ? '<div class="src-meta">' + metaBits.join(" · ") + "</div>"
          : "";
        var quoteRow = s.quote
          ? '<blockquote class="src-quote">“' + escapeHtml(s.quote) + '”</blockquote>'
          : "";
        var arch = s.archiveUrl || archiveUrl(s.url);
        return (
          '<li class="primary-source-item">' +
          metaRow +
          '<a href="' +
          escapeAttr(hrefFor(prefix, s.url)) +
          '" target="_blank" rel="noopener">' +
          escapeHtml(s.label) +
          "</a>" +
          (arch
            ? ' · <a class="archive-link" href="' +
              escapeAttr(arch) +
              '" target="_blank" rel="noopener">Archive</a>'
            : "") +
          (s.note ? ' <span class="src-note">— ' + escapeHtml(s.note) + "</span>" : "") +
          quoteRow +
          "</li>"
        );
      })
      .join("");

    var evidence = claim.evidence || [];
    var evidenceHtml = evidence
      .map(function (e, i) {
        var sources = (e.sources || [])
          .map(function (s) {
            return (
              '<li><a href="' +
              escapeAttr(hrefFor(prefix, s.url)) +
              '" target="_blank" rel="noopener">' +
              escapeHtml(s.name) +
              "</a></li>"
            );
          })
          .join("");
        return (
          '<article class="evidence-item" id="evidence-' +
          (i + 1) +
          '">' +
          '<div class="evidence-num">Evidence ' +
          (i + 1) +
          "</div>" +
          '<div class="tier-badge">' +
          escapeHtml(tierLabel(e.tier)) +
          "</div>" +
          "<h3>" +
          escapeHtml(e.title) +
          "</h3>" +
          '<div class="evidence-body">' +
          paragraphsHtml(e.body) +
          "</div>" +
          (sources
            ? '<p class="sources-label">Sources</p><ul class="source-list">' + sources + "</ul>"
            : "") +
          "</article>"
        );
      })
      .join("");

    var relatedHtml = (claim.related || [])
      .map(function (rid) {
        var r = getClaim(rid);
        if (!r) return "";
        return (
          '<a class="claim-card" href="' +
          claimHref(prefix, r.id) +
          '"><div class="claim-card-top">' +
          verdictHtml(verdicts, r.verdict) +
          "</div><h2>" +
          escapeHtml(r.shortTitle) +
          '</h2><p class="summary">' +
          escapeHtml(r.summary) +
          "</p></a>"
        );
      })
      .join("");

    var tocItems =
      '<li><a href="#her-claim">1. Her claim</a></li>' +
      '<li><a href="#primary">2. Where she said it</a></li>' +
      '<li><a href="#disproof">3. Evidence stack (' +
      evidence.length +
      ")</a></li>";
    evidence.forEach(function (e, i) {
      tocItems +=
        '<li class="toc-sub"><a href="#evidence-' +
        (i + 1) +
        '">E' +
        (i + 1) +
        " · " +
        escapeHtml(truncate(e.title, 42)) +
        "</a></li>";
    });
    if (relatedHtml) {
      tocItems += '<li><a href="#related">Related claims</a></li>';
    }

    var shareUrl = origin + "/c/" + encodeURIComponent(claim.id) + ".html";
    var tweetText =
      claim.shortTitle + " — " + (meta.label || claim.verdict) + ". Evidence archive:";
    var xShare =
      "https://x.com/intent/tweet?text=" + encodeURIComponent(tweetText + " " + shareUrl);
    var n = evidence.length;
    var updatedLabel = formatUpdated(siteUpdated);

    return (
      '<nav class="breadcrumb" aria-label="Breadcrumb">' +
      '<a href="' +
      pageHref(prefix, "index.html") +
      '">Home</a>' +
      ' <span class="bc-sep" aria-hidden="true">/</span> ' +
      '<a href="' +
      pageHref(prefix, "claims.html") +
      '">All claims</a>' +
      ' <span class="bc-sep" aria-hidden="true">/</span> ' +
      '<span aria-current="page">' +
      escapeHtml(claim.shortTitle) +
      "</span></nav>" +
      '<div class="claim-layout">' +
      '<div class="claim-main">' +
      '<header class="claim-hero">' +
      '<div class="claim-card-top">' +
      verdictHtml(verdicts, claim.verdict) +
      tags +
      "</div>" +
      "<h1>" +
      escapeHtml(claim.title) +
      "</h1>" +
      '<p class="claim-summary">' +
      escapeHtml(claim.summary) +
      "</p>" +
      '<p class="claim-meta"><strong>When she pushed it:</strong> ' +
      escapeHtml(claim.dateRange || "See sources") +
      " · <strong>Verdict:</strong> " +
      escapeHtml(meta.label || claim.verdict) +
      " — " +
      escapeHtml(meta.blurb || "") +
      (claim.confidence
        ? " · <strong>Centrality:</strong> " +
          escapeHtml(String(claim.confidence.centrality)) +
          "/3 · <strong>Checkability:</strong> " +
          escapeHtml(String(claim.confidence.checkability)) +
          "/3" +
          (claim.confidence.stillActive ? " · <strong>Still active</strong>" : "")
        : "") +
      "</p>" +
      '<p class="claim-updated"><time datetime="' +
      escapeAttr(siteUpdated) +
      '">Catalog baseline: ' +
      escapeHtml(updatedLabel) +
      "</time></p>" +
      '<div class="btn-row">' +
      '<a class="btn btn-secondary btn-sm" href="' +
      pageHref(prefix, "claims.html") +
      '">← All claims</a>' +
      '<a class="btn btn-primary btn-sm" href="#disproof">Jump to evidence (' +
      n +
      ")</a>" +
      '<button type="button" class="btn btn-secondary btn-sm" id="print-btn" onclick="window.print()">Print / save PDF</button>' +
      "</div>" +
      '<div class="share-bar" role="group" aria-label="Share this claim">' +
      '<span class="share-label">Share</span>' +
      '<button type="button" class="btn btn-secondary btn-sm" id="copy-link-btn" data-share-url="' +
      escapeAttr(shareUrl) +
      '">Copy link</button>' +
      '<a class="btn btn-secondary btn-sm" id="share-x-btn" href="' +
      escapeAttr(xShare) +
      '" target="_blank" rel="noopener">Post on X</a>' +
      '<button type="button" class="btn btn-secondary btn-sm" id="native-share-btn" hidden>Share…</button>' +
      "</div>" +
      "</header>" +
      '<section class="claim-section" id="her-claim">' +
      '<h2><span class="step">1</span> Her claim — what she said</h2>' +
      '<div class="claim-block prose-block">' +
      paragraphsHtml(claim.claimDetail) +
      "</div>" +
      "</section>" +
      '<section class="claim-section" id="primary">' +
      '<h2><span class="step">2</span> Where she said it — dates, links, timestamps</h2>' +
      '<div class="callout"><strong>Disputability standard:</strong> every entry aims for (1) a dated primary link to Owens herself (X post or show episode), (2) a clock/timestamp or promo time when available, and (3) a short on-record quote. Secondary reports appear only when they quote her words and a stable clip URL is fragmented. Pause the linked media at the listed timestamp to verify she said it.</div>' +
      '<ul class="source-list primary-list">' +
      (primaryHtml || '<li class="src-note">No primary links listed yet.</li>') +
      "</ul>" +
      "</section>" +
      '<section class="claim-section" id="disproof">' +
      '<h2><span class="step">3</span> The disproof — full evidence stack</h2>' +
      '<p class="section-lead">Everything below is ordered by reliability tier. Read the whole stack for this claim.</p>' +
      '<div class="verdict-banner">' +
      verdictHtml(verdicts, claim.verdict) +
      "<div><strong>" +
      escapeHtml(meta.label || claim.verdict) +
      "</strong><p>" +
      escapeHtml(meta.blurb || "") +
      "</p>" +
      '<p class="stance">Each evidence item below is meant to dismantle <em>this</em> claim specifically — not to restate the whole case from scratch. No personal insults; no soft-pedaling falsehoods.</p></div></div>' +
      (evidenceHtml ||
        '<div class="empty-state">Evidence stack is being assembled for this claim.</div>') +
      "</section>" +
      (relatedHtml
        ? '<section class="claim-section" id="related"><h2>Related claims</h2><div class="claim-list">' +
          relatedHtml +
          "</div></section>"
        : "") +
      '<section class="claim-section">' +
      '<div class="callout">See something missing or wrong? Contact <a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a> with primary links. <a href="' +
      pageHref(prefix, "submit.html") +
      '">Submit a claim</a> · <a href="' +
      pageHref(prefix, "corrections.html") +
      '">Corrections</a> · <a href="' +
      pageHref(prefix, "vault.html") +
      '">Source vault</a> · <a href="' +
      pageHref(prefix, "quotes.html") +
      '">Quote bank</a> · <a href="' +
      pageHref(prefix, "archive.html") +
      '">Archive hub</a></div>' +
      '<div class="btn-row"><a class="btn btn-primary" href="' +
      pageHref(prefix, "claims.html") +
      '">← Back to all claims</a><a class="btn btn-secondary" href="' +
      pageHref(prefix, "contradictions.html") +
      '">Contradiction engine</a><a class="btn btn-secondary" href="' +
      pageHref(prefix, "timeline.html") +
      '">Timeline</a></div>' +
      "</section>" +
      "</div>" +
      '<aside class="claim-toc" aria-label="On this page">' +
      '<div class="claim-toc-inner">' +
      "<h2>On this page</h2>" +
      "<ol>" +
      tocItems +
      "</ol>" +
      "</div></aside>" +
      "</div>"
    );
  }

  root.SOE_RENDER = {
    escapeHtml: escapeHtml,
    escapeAttr: escapeAttr,
    formatUpdated: formatUpdated,
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderClaimInner: renderClaimInner,
    claimHref: claimHref,
    pageHref: pageHref,
  };
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
