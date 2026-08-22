/* Individual claim: claim first, then full evidence stack */
(function () {
  var root = document.getElementById("claim-root");
  if (!root || !window.CLAIMS_DATA) return;

  var prefix = SOE.rootPrefix || "";
  var id = SOE.currentClaimId ? SOE.currentClaimId() : new URLSearchParams(location.search).get("id");
  var claim = SOE.getClaim(id);
  var render = window.SOE_RENDER;

  function pageHref(file) {
    return prefix + file;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  if (!claim) {
    document.title = "Claim not found — Scamdace Owens Exposed";
    SOE.applySocialMeta({
      title: document.title,
      description: "That claim ID was not found in the Scamdace Owens Exposed catalog.",
      url: SOE.absoluteUrl(id ? SOE.claimPath(id) : "claims.html"),
    });
    root.innerHTML =
      '<div class="empty-state empty-state-rich">' +
      "<h1>Claim not found</h1>" +
      "<p>No claim matches" +
      (id
        ? ' <code class="inline-code">' + escapeHtml(id) + "</code>"
        : ' — missing <code class="inline-code">?id=</code> parameter') +
      ".</p>" +
      '<div class="btn-row" style="justify-content:center">' +
      '<a class="btn btn-primary" href="' +
      pageHref("claims.html") +
      '">Browse all claims</a>' +
      '<a class="btn btn-secondary" href="' +
      pageHref("index.html") +
      '">Home</a>' +
      "</div></div>";
    return;
  }

  var pageTitle = claim.shortTitle + " — Scamdace Owens Exposed";
  var pageDesc = (
    claim.summary ||
    "Deep evidence disproof of a Candace Owens claim about the Charlie Kirk assassination."
  ).slice(0, 200);
  var shareUrl = SOE.absoluteUrl(SOE.claimPath(claim.id));

  document.title = pageTitle;
  SOE.applySocialMeta({
    title: pageTitle,
    description: pageDesc,
    url: shareUrl,
    type: "article",
  });

  var alreadyStatic = root.getAttribute("data-static-claim") === claim.id && root.querySelector(".claim-hero");
  if (!alreadyStatic) {
    if (!render || !render.renderClaimInner) {
      root.innerHTML =
        '<div class="empty-state">Claim renderer failed to load. <a href="' +
        pageHref("claims.html") +
        '">Browse all claims</a>.</div>';
      return;
    }
    root.setAttribute("data-static-claim", claim.id);
    root.innerHTML = render.renderClaimInner(claim, {
      prefix: prefix,
      origin: SOE.SITE_ORIGIN,
      siteUpdated: SOE.SITE_UPDATED,
      verdicts: window.VERDICT_META || {},
      categories: window.CATEGORIES || [],
      claims: window.CLAIMS_DATA || [],
      getClaim: function (rid) {
        return SOE.getClaim(rid);
      },
    });
  }

  var printBtn = document.getElementById("print-btn");
  if (printBtn) {
    printBtn.addEventListener("click", function () {
      window.print();
    });
  }

  var copyBtn = document.getElementById("copy-link-btn");
  if (copyBtn) {
    var copyUrl = copyBtn.getAttribute("data-share-url") || shareUrl;
    copyBtn.addEventListener("click", function () {
      SOE.copyText(copyUrl, copyBtn);
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
})();
