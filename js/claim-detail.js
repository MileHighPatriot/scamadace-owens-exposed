/* Individual claim: claim first, then full evidence stack */
(function () {
  var root = document.getElementById("claim-root");
  if (!root || !window.CLAIMS_DATA) return;

  var id = new URLSearchParams(location.search).get("id");
  var claim = SOE.getClaim(id);

  if (!claim) {
    document.title = "Claim not found — Scamdace Owens Exposed";
    SOE.applySocialMeta({
      title: document.title,
      description:
        "That claim ID was not found in the Scamdace Owens Exposed catalog.",
      url: SOE.absoluteUrl("claim.html" + (id ? "?id=" + encodeURIComponent(id) : "")),
    });
    root.innerHTML =
      '<div class="empty-state empty-state-rich">' +
      "<h1>Claim not found</h1>" +
      "<p>No claim matches" +
      (id
        ? ' <code class="inline-code">' + escapeHtml(id) + "</code>"
        : " — missing <code class=\"inline-code\">?id=</code> parameter") +
      ".</p>" +
      '<div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-primary" href="claims.html">Browse all claims</a>' +
      '<a class="btn btn-secondary" href="index.html">Home</a>' +
      "</div></div>";
    return;
  }

  var pageTitle = claim.shortTitle + " — Scamdace Owens Exposed";
  var pageDesc = (
    claim.summary ||
    "Deep evidence disproof of a Candace Owens claim about the Charlie Kirk assassination."
  ).slice(0, 200);
  document.title = pageTitle;
  SOE.applySocialMeta({
    title: pageTitle,
    description: pageDesc,
    url: SOE.absoluteUrl("claim.html?id=" + encodeURIComponent(claim.id)),
    type: "article",
  });

  var meta = (window.VERDICT_META || {})[claim.verdict] || {};
  var tags = SOE.categoryLabels(claim.categories)
    .map(function (t) {
      return '<span class="tag">' + escapeHtml(t) + "</span>";
    })
    .join(" ");

  var primaryHtml = (claim.primarySources || [])
    .map(function (s) {
      var metaBits = [];
      if (s.date) metaBits.push('<span class="src-date">' + escapeHtml(s.date) + "</span>");
      if (s.timestamp)
        metaBits.push(
          '<span class="src-timestamp">⏱ ' + escapeHtml(s.timestamp) + "</span>"
        );
      var metaRow = metaBits.length
        ? '<div class="src-meta">' + metaBits.join(" · ") + "</div>"
        : "";
      var quoteRow = s.quote
        ? '<blockquote class="src-quote">“' +
          escapeHtml(s.quote) +
          '”</blockquote>'
        : "";
      var arch =
        s.archiveUrl ||
        (SOE.archiveUrl ? SOE.archiveUrl(s.url) : null);
      return (
        '<li class="primary-source-item">' +
        metaRow +
        '<a href="' +
        escapeAttr(s.url) +
        '" target="_blank" rel="noopener">' +
        escapeHtml(s.label) +
        "</a>" +
        (arch
          ? ' · <a class="archive-link" href="' +
            escapeAttr(arch) +
            '" target="_blank" rel="noopener">Archive</a>'
          : "") +
        (s.note
          ? ' <span class="src-note">— ' + escapeHtml(s.note) + "</span>"
          : "") +
        quoteRow +
        "</li>"
      );
    })
    .join("");

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

  var evidence = claim.evidence || [];
  var evidenceHtml = evidence
    .map(function (e, i) {
      var sources = (e.sources || [])
        .map(function (s) {
          return (
            "<li><a href=\"" +
            escapeAttr(s.url) +
            "\" target=\"_blank\" rel=\"noopener\">" +
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
        escapeHtml(SOE.tierLabel(e.tier)) +
        "</div>" +
        "<h3>" +
        escapeHtml(e.title) +
        "</h3>" +
        '<div class="evidence-body">' +
        paragraphsHtml(e.body) +
        "</div>" +
        (sources
          ? '<p class="sources-label">Sources</p><ul class="source-list">' +
            sources +
            "</ul>"
          : "") +
        "</article>"
      );
    })
    .join("");

  var relatedHtml = (claim.related || [])
    .map(function (rid) {
      var r = SOE.getClaim(rid);
      if (!r) return "";
      return (
        '<a class="claim-card" href="claim.html?id=' +
        encodeURIComponent(r.id) +
        '"><div class="claim-card-top">' +
        SOE.verdictHtml(r.verdict) +
        "</div><h2>" +
        escapeHtml(r.shortTitle) +
        '</h2><p class="summary">' +
        escapeHtml(r.summary) +
        "</p></a>"
      );
    })
    .join("");

  // Sticky mini-TOC for long stacks
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

  var shareUrl = SOE.absoluteUrl(
    "claim.html?id=" + encodeURIComponent(claim.id)
  );
  var tweetText =
    claim.shortTitle +
    " — " +
    (meta.label || claim.verdict) +
    ". Evidence archive:";
  var xShare =
    "https://x.com/intent/tweet?text=" +
    encodeURIComponent(tweetText + " " + shareUrl);

  var n = evidence.length;
  var updatedLabel = SOE.formatUpdated(SOE.SITE_UPDATED);

  root.innerHTML =
    '<nav class="breadcrumb" aria-label="Breadcrumb">' +
    '<a href="index.html">Home</a>' +
    ' <span class="bc-sep" aria-hidden="true">/</span> ' +
    '<a href="claims.html">All claims</a>' +
    ' <span class="bc-sep" aria-hidden="true">/</span> ' +
    "<span aria-current=\"page\">" +
    escapeHtml(claim.shortTitle) +
    "</span></nav>" +
    '<div class="claim-layout">' +
    '<div class="claim-main">' +
    '<header class="claim-hero">' +
    '<div class="claim-card-top">' +
    SOE.verdictHtml(claim.verdict) +
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
    escapeAttr(SOE.SITE_UPDATED) +
    '">Catalog baseline: ' +
    escapeHtml(updatedLabel) +
    "</time></p>" +
    '<div class="btn-row">' +
    '<a class="btn btn-secondary btn-sm" href="claims.html">← All claims</a>' +
    '<a class="btn btn-primary btn-sm" href="#disproof">Jump to evidence (' +
    n +
    ")</a>" +
    '<button type="button" class="btn btn-secondary btn-sm" id="print-btn">Print / save PDF</button>' +
    "</div>" +
    '<div class="share-bar" role="group" aria-label="Share this claim">' +
    '<span class="share-label">Share</span>' +
    '<button type="button" class="btn btn-secondary btn-sm" id="copy-link-btn">Copy link</button>' +
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
    (primaryHtml || "<li class=\"src-note\">No primary links listed yet.</li>") +
    "</ul>" +
    "</section>" +
    '<section class="claim-section" id="disproof">' +
    '<h2><span class="step">3</span> The disproof — full evidence stack</h2>' +
    '<p class="section-lead">Everything below is ordered by reliability tier. Read the whole stack for this claim.</p>' +
    '<div class="verdict-banner">' +
    SOE.verdictHtml(claim.verdict) +
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
    '<div class="callout">See something missing or wrong? Contact <a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a> with primary links. <a href="submit.html">Submit a claim</a> · <a href="corrections.html">Corrections</a> · <a href="vault.html">Source vault</a> · <a href="quotes.html">Quote bank</a> · <a href="archive.html">Archive hub</a></div>' +
    '<div class="btn-row"><a class="btn btn-primary" href="claims.html">← Back to all claims</a><a class="btn btn-secondary" href="contradictions.html">Contradiction engine</a><a class="btn btn-secondary" href="timeline.html">Timeline</a></div>' +
    "</section>" +
    "</div>" + // claim-main
    '<aside class="claim-toc" aria-label="On this page">' +
    '<div class="claim-toc-inner">' +
    "<h2>On this page</h2>" +
    "<ol>" +
    tocItems +
    "</ol>" +
    "</div></aside>" +
    "</div>"; // claim-layout

  document.getElementById("print-btn")?.addEventListener("click", function () {
    window.print();
  });

  var copyBtn = document.getElementById("copy-link-btn");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      SOE.copyText(shareUrl, copyBtn);
    });
  }

  var nativeBtn = document.getElementById("native-share-btn");
  if (nativeBtn && navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", function () {
      navigator
        .share({
          title: claim.shortTitle,
          text: pageDesc,
          url: shareUrl,
        })
        .catch(function () {});
    });
  }

  function truncate(s, n) {
    s = String(s || "");
    if (s.length <= n) return s;
    return s.slice(0, n - 1).trim() + "…";
  }
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
