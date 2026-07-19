/* Simple claim catalog: one row per claim → click for full evidence */
(function () {
  const listEl = document.getElementById("claim-list");
  const searchEl = document.getElementById("search");
  const verdictEl = document.getElementById("filter-verdict");
  const countEl = document.getElementById("result-count");
  const chipsEl = document.getElementById("category-chips");
  if (!listEl || !window.CLAIMS_DATA) return;

  let activeCategory = "all";

  // Sort: featured/core first, then alpha by short title
  function sortedBase() {
    return window.CLAIMS_DATA.slice().sort(function (a, b) {
      const ae = a.featured || a.severity === "core" ? 0 : 1;
      const be = b.featured || b.severity === "core" ? 0 : 1;
      if (ae !== be) return ae - be;
      return (a.shortTitle || "").localeCompare(b.shortTitle || "");
    });
  }

  function buildChips() {
    if (!chipsEl) return;
    const all = [{ id: "all", label: "All" }].concat(window.CATEGORIES || []);
    chipsEl.innerHTML = all
      .map(function (c) {
        return (
          '<button type="button" class="chip' +
          (c.id === activeCategory ? " active" : "") +
          '" data-cat="' +
          c.id +
          '">' +
          c.label +
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
    const q = (searchEl && searchEl.value ? searchEl.value : "")
      .trim()
      .toLowerCase();
    const v = verdictEl ? verdictEl.value : "all";
    return sortedBase().filter(function (c) {
      if (
        activeCategory !== "all" &&
        (c.categories || []).indexOf(activeCategory) === -1
      )
        return false;
      if (v !== "all" && c.verdict !== v) return false;
      if (!q) return true;
      const blob = [c.title, c.shortTitle, c.summary, c.claimDetail]
        .join(" ")
        .toLowerCase();
      return blob.indexOf(q) !== -1;
    });
  }

  function render() {
    const items = filtered();
    if (countEl) {
      countEl.textContent =
        items.length +
        " of " +
        window.CLAIMS_DATA.length +
        " claims · click any claim for the full evidence stack";
    }
    if (!items.length) {
      listEl.innerHTML =
        '<div class="empty-state">No claims match. Clear search or choose All.</div>';
      return;
    }
    listEl.innerHTML = items
      .map(function (c, idx) {
        const n = (c.evidence || []).length;
        return (
          '<a class="claim-row" href="claim.html?id=' +
          encodeURIComponent(c.id) +
          '">' +
          '<div class="claim-row-num">' +
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
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (searchEl) searchEl.addEventListener("input", render);
  if (verdictEl) verdictEl.addEventListener("change", render);
  buildChips();
  render();
})();
