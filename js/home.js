/* Homepage stats + latest wave + curated core claims */
(function () {
  var stats = document.getElementById("home-stats");
  var featured = document.getElementById("featured-claims");
  var wave = document.getElementById("latest-wave");
  if (!window.CLAIMS_DATA) return;

  var data = window.CLAIMS_DATA;
  var falseN = data.filter(function (c) {
    return c.verdict === "FALSE" || c.verdict === "CONTRADICTED";
  }).length;
  var evidenceN = data.reduce(function (n, c) {
    return n + (c.evidence || []).length;
  }, 0);

  var quoteN =
    window.ARCHIVE_DATA && window.ARCHIVE_DATA.quotes
      ? window.ARCHIVE_DATA.quotes.length
      : 0;
  var mediaN =
    window.ARCHIVE_DATA && window.ARCHIVE_DATA.media
      ? window.ARCHIVE_DATA.media.length
      : 0;

  function statCard(kicker, num, label) {
    return (
      '<div class="card stat-card">' +
      '<div class="kicker">' +
      kicker +
      "</div>" +
      '<div class="num">' +
      num +
      '</div><div class="label">' +
      label +
      "</div></div>"
    );
  }

  if (stats) {
    stats.innerHTML =
      statCard("Catalog", data.length, "Claims documented") +
      statCard("Verdicts", falseN, "False or contradicted") +
      statCard("Evidence", evidenceN, "Items stacked across claims") +
      (quoteN ? statCard("Quotes", quoteN, "Timestamped primary lines") : "") +
      (mediaN ? statCard("Vault", mediaN, "Primary source rows") : "") +
      statCard("Archive", "25+", "Tools, trackers, and indexes");
  }

  var latestIds = [
    "uncompressed-4k-not-robinson",
    "tpusa-trans-journalist",
    "more-evidence-patsy",
  ];

  if (wave) {
    var latest = latestIds
      .map(function (id) {
        return data.find(function (c) {
          return c.id === id;
        });
      })
      .filter(Boolean);
    wave.innerHTML = latest
      .map(function (c) {
        return (
          '<a class="wave-card" href="claim.html?id=' +
          encodeURIComponent(c.id) +
          '">' +
          '<div class="claim-card-top">' +
          SOE.verdictHtml(c.verdict) +
          '<span class="tag tag-hot">This week</span>' +
          "</div>" +
          "<h3>" +
          escapeHtml(c.shortTitle) +
          "</h3>" +
          "<p>" +
          escapeHtml(c.summary) +
          '</p><span class="claim-row-cta">Open full disproof →</span></a>'
        );
      })
      .join("");
  }

  if (featured) {
    var coreOrder = [
      "exploding-microphone",
      "robinson-framed",
      "no-rooftop-shot",
      "maroon-shirts",
      "israel-mossad",
      "tpusa-inside-job",
      "erika-theories",
      "dna-indefensible",
    ];
    var picks = coreOrder
      .map(function (id) {
        return data.find(function (c) {
          return c.id === id;
        });
      })
      .filter(Boolean);
    if (!picks.length) {
      featured.innerHTML =
        '<div class="empty-state">Featured claims will appear here once marked in the catalog.</div>';
      return;
    }
    featured.innerHTML = picks
      .map(function (c) {
        return (
          '<a class="claim-row" href="claim.html?id=' +
          encodeURIComponent(c.id) +
          '">' +
          '<div class="claim-row-body" style="padding-left:0">' +
          '<div class="claim-card-top">' +
          SOE.verdictHtml(c.verdict) +
          '<span class="tag tag-hot">Core</span>' +
          "</div>" +
          "<h2>" +
          escapeHtml(c.shortTitle) +
          '</h2><p class="summary">' +
          escapeHtml(c.summary) +
          '</p><span class="claim-row-cta">Open full disproof →</span></div></a>'
        );
      })
      .join("");
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
