/* Individual claim: claim first, then full evidence stack */
(function () {
  const root = document.getElementById("claim-root");
  if (!root || !window.CLAIMS_DATA) return;

  const id = new URLSearchParams(location.search).get("id");
  const claim = SOE.getClaim(id);

  if (!claim) {
    root.innerHTML =
      '<div class="empty-state"><h1>Claim not found</h1><p><a class="btn btn-primary" href="claims.html">Back to all claims</a></p></div>';
    return;
  }

  document.title = claim.shortTitle + " — Scamdace Owens Exposed";

  const meta = (window.VERDICT_META || {})[claim.verdict] || {};
  const tags = SOE.categoryLabels(claim.categories)
    .map(function (t) {
      return '<span class="tag">' + t + "</span>";
    })
    .join(" ");

  const primaryHtml = (claim.primarySources || [])
    .map(function (s) {
      return (
        "<li><a href=\"" +
        escapeAttr(s.url) +
        "\" target=\"_blank\" rel=\"noopener\">" +
        escapeHtml(s.label) +
        "</a>" +
        (s.note
          ? ' <span class="src-note">— ' + escapeHtml(s.note) + "</span>"
          : "") +
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
        // Single newlines inside a block become spaces for clean paragraph flow
        const clean = block.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
        return "<p>" + escapeHtml(clean) + "</p>";
      })
      .join("");
  }

  const evidenceHtml = (claim.evidence || [])
    .map(function (e, i) {
      const sources = (e.sources || [])
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
        SOE.tierLabel(e.tier) +
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

  const relatedHtml = (claim.related || [])
    .map(function (rid) {
      const r = SOE.getClaim(rid);
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

  const n = (claim.evidence || []).length;

  root.innerHTML =
    '<div class="breadcrumb"><a href="index.html">Home</a> · <a href="claims.html">All claims</a> · ' +
    escapeHtml(claim.shortTitle) +
    "</div>" +
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
    "</p>" +
    '<div class="btn-row">' +
    '<a class="btn btn-secondary btn-sm" href="claims.html">← All claims</a>' +
    '<a class="btn btn-primary btn-sm" href="#disproof">Jump to evidence (' +
    n +
    ")</a>" +
    '<button type="button" class="btn btn-secondary btn-sm" id="print-btn">Print / save PDF</button>' +
    "</div>" +
    "</header>" +
    '<section class="claim-section" id="her-claim">' +
    '<h2><span class="step">1</span> Her claim — what she said</h2>' +
    '<div class="claim-block prose-block">' +
    paragraphsHtml(claim.claimDetail) +
    "</div>" +
    "</section>" +
    '<section class="claim-section" id="primary">' +
    '<h2><span class="step">2</span> Where she said it (primary / near-primary)</h2>' +
    '<div class="callout">We prioritize Owens’s own X posts and show episodes. Some entries also use contemporaneous reports that quote her words when a single stable clip URL is fragmented.</div>' +
    '<ul class="source-list primary-list">' +
    primaryHtml +
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
    "<p class=\"stance\">Each evidence item below is meant to dismantle <em>this</em> claim specifically — not to restate the whole case from scratch. No personal insults; no soft-pedaling falsehoods.</p></div></div>" +
    evidenceHtml +
    "</section>" +
    (relatedHtml
      ? '<section class="claim-section"><h2>Related claims</h2><div class="claim-list">' +
        relatedHtml +
        "</div></section>"
      : "") +
    '<section class="claim-section">' +
    '<div class="callout">See something missing or wrong? Contact <a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a> with primary links. <a href="submit.html">Submit a claim</a> · <a href="corrections.html">Corrections</a></div>' +
    '<div class="btn-row"><a class="btn btn-primary" href="claims.html">← Back to all claims</a></div>' +
    "</section>";

  document.getElementById("print-btn")?.addEventListener("click", function () {
    window.print();
  });

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
