/* Homepage stats + major claims list */
(function () {
  const stats = document.getElementById("home-stats");
  const featured = document.getElementById("featured-claims");
  if (!window.CLAIMS_DATA) return;

  const data = window.CLAIMS_DATA;
  const falseN = data.filter(function (c) {
    return c.verdict === "FALSE" || c.verdict === "CONTRADICTED";
  }).length;
  const evidenceN = data.reduce(function (n, c) {
    return n + (c.evidence || []).length;
  }, 0);

  if (stats) {
    stats.innerHTML =
      '<div class="card stat-card"><div class="num">' +
      data.length +
      '</div><div class="label">Claims catalogued</div></div>' +
      '<div class="card stat-card"><div class="num">' +
      falseN +
      '</div><div class="label">False or contradicted</div></div>' +
      '<div class="card stat-card"><div class="num">' +
      evidenceN +
      '</div><div class="label">Evidence items across claims</div></div>';
  }

  if (featured) {
    const picks = data.filter(function (c) {
      return c.featured;
    });
    featured.innerHTML = picks
      .map(function (c) {
        return (
          '<a class="claim-row" href="claim.html?id=' +
          encodeURIComponent(c.id) +
          '">' +
          '<div class="claim-row-body" style="padding-left:0">' +
          '<div class="claim-card-top">' +
          SOE.verdictHtml(c.verdict) +
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
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
