/* Earnings page renderer */
(function () {
  if (!window.EARNINGS_DATA || !window.EARNINGS_CALC) return;
  var d = window.EARNINGS_DATA;
  var calc = window.EARNINGS_CALC.compute();
  var money = window.EARNINGS_CALC.formatMoney;
  var views = window.EARNINGS_CALC.formatViews;

  var headline = document.getElementById("earnings-headline");
  if (headline) {
    headline.innerHTML =
      '<div class="earn-range">' +
      '<div class="earn-range-item low"><span class="earn-range-label">Conservative</span><strong>' +
      money(calc.headline.low) +
      "</strong></div>" +
      '<div class="earn-range-item mid"><span class="earn-range-label">Central estimate</span><strong>' +
      money(calc.headline.mid) +
      "</strong></div>" +
      '<div class="earn-range-item high"><span class="earn-range-label">Aggressive</span><strong>' +
      money(calc.headline.high) +
      "</strong></div>" +
      "</div>" +
      '<p class="earn-range-sub">Estimated creator-side revenue from Charlie Kirk assassination content · ' +
      escapeHtml(d.window.label) +
      " · Not audited books</p>";
  }

  var scenarios = document.getElementById("earnings-scenarios");
  if (scenarios) {
    scenarios.innerHTML = ["low", "mid", "high"]
      .map(function (key) {
        var r = calc[key];
        return (
          '<article class="card earn-scenario earn-scenario-' +
          key +
          '">' +
          "<h3>" +
          escapeHtml(r.label) +
          "</h3>" +
          '<p class="earn-total">' +
          money(r.total) +
          "</p>" +
          '<ul class="earn-breakdown">' +
          "<li><span>YouTube AdSense (est.)</span><strong>" +
          money(r.youtube.revenue) +
          "</strong><small>" +
          views(r.youtube.views) +
          " attributed views</small></li>" +
          "<li><span>Podcast / host-read sponsors (est.)</span><strong>" +
          money(r.sponsorships) +
          "</strong></li>" +
          "<li><span>Club Candace memberships (Kirk-attributed est.)</span><strong>" +
          money(r.memberships) +
          "</strong></li>" +
          "<li><span>X / tips / merch uplift (soft est.)</span><strong>" +
          money(r.other) +
          "</strong></li>" +
          "</ul></article>"
        );
      })
      .join("");
  }

  var epTable = document.getElementById("episode-views-body");
  if (epTable) {
    epTable.innerHTML = d.sampleEpisodes
      .map(function (e) {
        return (
          "<tr>" +
          "<td><strong>" +
          escapeHtml(e.ep) +
          "</strong><br><span class=\"muted\">" +
          escapeHtml(e.when) +
          "</span></td>" +
          "<td>" +
          escapeHtml(e.title) +
          "</td>" +
          "<td class=\"num\">" +
          escapeHtml(e.viewsLabel) +
          "</td>" +
          '<td><a href="' +
          escapeAttr(e.url) +
          '" target="_blank" rel="noopener">YouTube</a></td>' +
          "</tr>"
        );
      })
      .join("");
    var foot = document.getElementById("episode-views-foot");
    if (foot) {
      foot.textContent =
        "Documented sample alone: " +
        views(calc.sampleViews) +
        "+ public YouTube views on just five flagship Kirk episodes (views continue to climb).";
    }
  }

  var streams = document.getElementById("revenue-streams");
  if (streams) {
    var yt = d.platformSnapshot.youtube;
    var pod = d.platformSnapshot.podcast;
    var mem = d.platformSnapshot.membership;
    var biz = d.platformSnapshot.businessContext;
    streams.innerHTML =
      streamCard(
        "YouTube (@RealCandaceO)",
        [
          yt.subscribers + " subscribers",
          yt.totalChannelViews + " lifetime channel views",
          yt.viewsLast30Days,
          "Social Blade monthly AdSense range (whole channel): " + yt.estMonthlyAdSense,
          yt.note,
        ],
        yt.sources
      ) +
      streamCard(
        "Podcast distribution",
        [
          pod.show,
          pod.appleEpisodes,
          pod.appleRating,
          pod.note,
        ],
        pod.sources
      ) +
      streamCard(
        "Club Candace memberships",
        [
          "Public price: $" +
            mem.monthlyPrice +
            "/mo or $" +
            mem.annualPrice +
            "/yr (~$" +
            mem.annualEffectiveMonthly +
            "/mo annual)",
          mem.note,
        ],
        mem.sources
      ) +
      streamCard(
        "Business context (not Kirk-only)",
        [
          biz.companyRevenue,
          biz.netWorthReports,
          biz.deniedClaim,
          biz.viralInflatedClaim,
        ],
        biz.sources
      );
  }

  var method = document.getElementById("methodology-body");
  if (method) {
    var v = d.volumeAssumptions;
    var rpm = d.youtubeRpm;
    var s = d.sponsorshipModel;
    var m = d.membershipModel;
    method.innerHTML =
      "<ol class=\"method-list\">" +
      "<li><strong>Count inventory.</strong> From early Kirk emergency episodes (~Ep 235, Sept 2025) through mid/late July 2026 episodes (~Ep 365+), the independent show produced on the order of 100+ long-form slots. We model <em>" +
      v.kirkFocusedLongformEpisodesLow +
      " / " +
      v.kirkFocusedLongformEpisodesMid +
      " / " +
      v.kirkFocusedLongformEpisodesHigh +
      "</em> as primarily Kirk-assassination content (Low / Mid / High).</li>" +
      "<li><strong>Average views.</strong> Flagships clear multi-millions; many later episodes still clear high six or seven figures. We use <em>" +
      views(v.avgViewsPerEpLow) +
      " / " +
      views(v.avgViewsPerEpMid) +
      " / " +
      views(v.avgViewsPerEpHigh) +
      "</em> average public YouTube views per Kirk-focused long-form. High case adds clip/Shorts uplift.</li>" +
      "<li><strong>YouTube creator RPM.</strong> Estimated net to creator after platform cut: <em>$" +
      rpm.low +
      " / $" +
      rpm.mid +
      " / $" +
      rpm.high +
      "</em> per 1,000 views. This is not advertiser CPM and not Social Blade’s full monthly channel range applied 1:1.</li>" +
      "<li><strong>Host-read sponsors.</strong> Separate from AdSense. Model <em>" +
      s.episodesWithHostReadsLow +
      "–" +
      s.episodesWithHostReadsHigh +
      "</em> Kirk-heavy shows with estimated net ad revenue per episode <em>" +
      money(s.netPerEpisodeFromAdsLow) +
      "–" +
      money(s.netPerEpisodeFromAdsHigh) +
      "</em>. Rate cards are private; political podcasts with this reach often clear five figures per episode when inventory sells.</li>" +
      "<li><strong>Club Candace.</strong> Price is public ($" +
      m.avgMonthlyNetMid.toFixed(0) +
      "-range monthly). Member count is not. We estimate <em>" +
      (m.payingMembersLow / 1000) +
      "K–" +
      (m.payingMembersHigh / 1000) +
      "K</em> paying members and attribute <em>" +
      Math.round(m.kirkAttributionShareLow * 100) +
      "–" +
      Math.round(m.kirkAttributionShareHigh * 100) +
      "%</em> of window membership revenue to Kirk-content intensity (acquisition + retention), not 100% of her career memberships.</li>" +
      "<li><strong>Other.</strong> Soft band for X monetization, Super Thanks/Chat, and merch uplift. Wide on purpose.</li>" +
      "<li><strong>What we reject.</strong> $800K/week YouTube claims (denied by Owens; inconsistent with Social Blade channel-scale bands). Viral ~$59M / six-month TikTok-style math (assumes unrealistic daily sponsor cash as fact).</li>" +
      "</ol>";
  }

  function streamCard(title, bullets, sources) {
    return (
      '<article class="card">' +
      "<h3>" +
      escapeHtml(title) +
      "</h3><ul>" +
      bullets
        .map(function (b) {
          return "<li>" + escapeHtml(b) + "</li>";
        })
        .join("") +
      "</ul>" +
      (sources && sources.length
        ? '<p class="sources-label">Sources</p><ul class="source-list">' +
          sources
            .map(function (s) {
              return (
                '<li><a href="' +
                escapeAttr(s.url) +
                '" target="_blank" rel="noopener">' +
                escapeHtml(s.name) +
                "</a></li>"
              );
            })
            .join("") +
          "</ul>"
        : "") +
      "</article>"
    );
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
