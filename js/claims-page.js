/* Simple claim catalog: one row per claim → click for full evidence */
(function () {
  var listEl = document.getElementById("claim-list");
  var searchEl = document.getElementById("search");
  var verdictEl = document.getElementById("filter-verdict");
  var countEl = document.getElementById("result-count");
  var chipsEl = document.getElementById("category-chips");
  if (!listEl || !window.CLAIMS_DATA) return;

  var activeCategory = "all";

  // Deep-link: ?q= / ?verdict= / ?cat=
  try {
    var params = new URLSearchParams(location.search);
    if (searchEl && params.get("q")) searchEl.value = params.get("q");
    if (verdictEl && params.get("verdict")) {
      var v = params.get("verdict").toUpperCase();
      if (Array.from(verdictEl.options).some(function (o) { return o.value === v; })) {
        verdictEl.value = v;
      }
    }
    if (params.get("cat")) activeCategory = params.get("cat");
  } catch (e) {}

  function severityRank(s) {
    return { core: 0, high: 1, medium: 2, low: 3 }[s] ?? 4;
  }

  function sortedBase() {
    return window.CLAIMS_DATA.slice().sort(function (a, b) {
      // Featured first, then core/high severity, then title
      var af = a.featured ? 0 : 1;
      var bf = b.featured ? 0 : 1;
      if (af !== bf) return af - bf;
      var as = severityRank(a.severity);
      var bs = severityRank(b.severity);
      if (as !== bs) return as - bs;
      return (a.shortTitle || "").localeCompare(b.shortTitle || "");
    });
  }

  function buildChips() {
    if (!chipsEl) return;
    var all = [{ id: "all", label: "All" }].concat(window.CATEGORIES || []);
    chipsEl.innerHTML = all
      .map(function (c) {
        var active = c.id === activeCategory;
        return (
          '<button type="button" class="chip' +
          (active ? " active" : "") +
          '" data-cat="' +
          escapeAttr(c.id) +
          '"' +
          (active ? ' aria-pressed="true"' : ' aria-pressed="false"') +
          ">" +
          escapeHtml(c.label) +
          "</button>"
        );
      })
      .join("");
    chipsEl.querySelectorAll(".chip").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCategory = btn.getAttribute("data-cat");
        buildChips();
        render();
      });
    });
  }

  function filtered() {
    var q = (searchEl && searchEl.value ? searchEl.value : "")
      .trim()
      .toLowerCase();
    var v = verdictEl ? verdictEl.value : "all";
    return sortedBase().filter(function (c) {
      if (
        activeCategory !== "all" &&
        (c.categories || []).indexOf(activeCategory) === -1
      )
        return false;
      if (v !== "all" && c.verdict !== v) return false;
      if (!q) return true;
      var blob = [
        c.title,
        c.shortTitle,
        c.summary,
        c.claimDetail,
        c.id,
        (c.categories || []).join(" "),
      ]
        .join(" ")
        .toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function clearFilters() {
    activeCategory = "all";
    if (searchEl) searchEl.value = "";
    if (verdictEl) verdictEl.value = "all";
    buildChips();
    render();
    if (searchEl) searchEl.focus();
  }

  function render() {
    var items = filtered();
    if (countEl) {
      countEl.textContent =
        items.length +
        " of " +
        window.CLAIMS_DATA.length +
        " claims · click any claim for the full evidence stack";
    }
    if (!items.length) {
      listEl.innerHTML =
        '<div class="empty-state empty-state-rich">' +
        "<p><strong>No claims match.</strong></p>" +
        "<p>Try a broader search, choose All categories, or clear filters.</p>" +
        '<button type="button" class="btn btn-secondary btn-sm" id="clear-filters">Clear filters</button>' +
        "</div>";
      var clearBtn = document.getElementById("clear-filters");
      if (clearBtn) clearBtn.addEventListener("click", clearFilters);
      return;
    }
    listEl.innerHTML = items
      .map(function (c, idx) {
        var n = (c.evidence || []).length;
        return (
          '<a class="claim-row" href="claim.html?id=' +
          encodeURIComponent(c.id) +
          '">' +
          '<div class="claim-row-num" aria-hidden="true">' +
          (idx + 1) +
          "</div>" +
          '<div class="claim-row-body">' +
          '<div class="claim-card-top">' +
          SOE.verdictHtml(c.verdict) +
          (c.featured
            ? '<span class="tag tag-hot">Major claim</span>'
            : "") +
          "</div>" +
          "<h2>" +
          escapeHtml(c.shortTitle || c.title) +
          "</h2>" +
          '<p class="summary">' +
          escapeHtml(c.summary) +
          "</p>" +
          '<span class="claim-row-cta">Open full disproof → ' +
          n +
          " evidence items</span>" +
          "</div>" +
          "</a>"
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
  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  if (searchEl) {
    searchEl.setAttribute("aria-label", "Search claims");
    searchEl.addEventListener("input", render);
  }
  if (verdictEl) verdictEl.addEventListener("change", render);
  buildChips();
  render();
})();
