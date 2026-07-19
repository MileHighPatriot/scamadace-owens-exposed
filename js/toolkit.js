/* Combat toolkit page */
(function () {
  const root = document.getElementById("toolkit-list");
  if (!root || !window.CLAIMS_DATA) return;

  root.innerHTML = window.CLAIMS_DATA.map(function (c) {
    const tp = c.talkingPoints || {};
    return (
      '<article class="card" style="margin-bottom:1rem" id="' +
      c.id +
      '">' +
      '<div class="claim-card-top">' +
      SOE.verdictHtml(c.verdict) +
      "</div>" +
      "<h3 style=\"margin:0.5rem 0\"><a href=\"claim.html?id=" +
      encodeURIComponent(c.id) +
      '">' +
      escapeHtml(c.shortTitle) +
      "</a></h3>" +
      '<div class="talk-box"><button type="button" class="btn btn-sm btn-secondary copy-btn">Copy</button><h4>Ready reply</h4><p class="copy-text">' +
      escapeHtml(tp.medium || tp.short || "") +
      "</p></div>" +
      '<a class="btn btn-sm btn-secondary" href="claim.html?id=' +
      encodeURIComponent(c.id) +
      '#combat">Full short / medium / long + sources →</a>' +
      "</article>"
    );
  }).join("");

  root.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const box = btn.closest(".talk-box");
      const text = box ? box.querySelector(".copy-text").textContent : "";
      SOE.copyText(text, btn);
    });
  });

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
})();
