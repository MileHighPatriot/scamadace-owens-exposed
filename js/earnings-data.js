/**
 * Scamdace Owens Exposed — Kirk-content earnings research
 * Author: MileHigh Patriot (@America1st5280)
 * All dollar figures that are not public price lists are ESTIMATES.
 * Updated: August 12, 2026 (research window still keyed to late July)
 */
window.EARNINGS_DATA = {
  asOf: "2026-07-30",
  window: {
    label: "Sept 10, 2025 – August 12, 2026 (~11 months; model through late July)",
    start: "2025-09-10",
    end: "2026-07-30",
  },

  platformSnapshot: {
    youtube: {
      handle: "@RealCandaceO",
      subscribers: "6.05M",
      totalChannelViews: "1.49B+",
      videos: "~1,800+",
      viewsLast30Days: "~36M (Social Blade, mid-July 2026)",
      estMonthlyAdSense: "$9.1K – $145K (Social Blade range)",
      note: "Channel-wide AdSense estimates; not Kirk-only.",
      sources: [
        {
          name: "Social Blade — @realcandaceo",
          url: "https://socialblade.com/youtube/handle/realcandaceo",
        },
        {
          name: "vidIQ channel stats snapshot",
          url: "https://vidiq.com/youtube-stats/channel/@realcandaceo/",
        },
      ],
    },
    podcast: {
      show: "Candace (independent)",
      appleEpisodes: "~409 listed (Apple Podcasts, mid-2026)",
      appleRating: "4.0 / ~12K ratings",
      note: "Daily / near-daily show; large share of post–Sept 10 catalog is Kirk assassination content.",
      sources: [
        {
          name: "Apple Podcasts — Candace",
          url: "https://podcasts.apple.com/us/podcast/candace/id1750591415",
        },
        {
          name: "Spotify — Candace",
          url: "https://open.spotify.com/show/6QdzTqSvD4KoLdrOqkFkPE",
        },
      ],
    },
    membership: {
      product: "Club Candace (Locals / forum.candaceowens.com)",
      monthlyPrice: 11.99,
      annualPrice: 120,
      annualEffectiveMonthly: 10,
      currency: "USD",
      note: "Public price list. Member count is not publicly disclosed — membership revenue is estimated with wide ranges.",
      sources: [
        {
          name: "Club Candace members area (pricing)",
          url: "https://forum.candaceowens.com/category/14/members-only",
        },
      ],
    },
    businessContext: {
      companyRevenue: "Up to ~$10M/year company revenue cited in Fortune-linked analysis (Dec 2025)",
      netWorthReports: "Consumer press often cites ~$5M net worth (unverified; not the same as revenue)",
      deniedClaim: "Owens publicly mocked a pastor’s claim she makes $800K/week on YouTube as absurd",
      viralInflatedClaim:
        "Viral clips claiming ~$59M in 6 months from Kirk content use extreme sponsor math and are not treated as reliable here",
      sources: [
        {
          name: "Yahoo/Fortune economics of Owens media empire (Dec 2025 packaging)",
          url: "https://finance.yahoo.com/news/inside-economics-candace-owens-media-153158079.html",
        },
        {
          name: "PrimeTimer: Owens reacts to $800K/week YouTube claim",
          url: "https://www.primetimer.com/news/what-is-candace-owens-net-worth-in-2026-podcaster-reacts-to-claims-of-earning-800k-weekly-from-youtube-and-attacking-erika-kirk",
        },
      ],
    },
  },

  /** Documented YouTube view counts for Kirk-assassination episodes (public page stats; views keep rising). */
  sampleEpisodes: [
    {
      title: "They Are Lying About Charlie Kirk",
      ep: "Ep 235",
      views: 9200000,
      viewsLabel: "9.2M+",
      when: "Sept 2025 (emergency / early arc)",
      url: "https://www.youtube.com/watch?v=czVBmqZP6Ss",
    },
    {
      title: "Who Ordered The Hit On Charlie Kirk?",
      ep: "Ep 237",
      views: 4500000,
      viewsLabel: "4.5M+",
      when: "Sept 2025",
      url: "https://www.youtube.com/watch?v=2WEHTk0Xewg",
    },
    {
      title: "EMERGENCY UPDATE IN THE CHARLIE KIRK CASE",
      ep: "Ep 357",
      views: 2300000,
      viewsLabel: "2.3M+",
      when: "~June–July 2026",
      url: "https://www.youtube.com/watch?v=a2bZf4fic10",
    },
    {
      title: "More Exclusive Photos From Charlie's SUV",
      ep: "Ep 363",
      views: 1600000,
      viewsLabel: "1.6M+",
      when: "July 2026",
      url: "https://www.youtube.com/watch?v=OgRyiOAVtWU",
    },
    {
      title: "EXCLUSIVE: Ben Shapiro’s 9/10 “Lunch” Date / more texts",
      ep: "Ep 365",
      views: 1100000,
      viewsLabel: "1.1M+",
      when: "July 2026",
      url: "https://www.youtube.com/watch?v=amqTMimDr0A",
    },
  ],

  /**
   * Volume model for Kirk-tagged long-form video inventory.
   * Ep numbers ~235 (Sept 2025) → ~365+ (July 2026) ≈ 130 show slots;
   * not every slot is 100% Kirk, but a large majority of the catalog is.
   */
  volumeAssumptions: {
    kirkFocusedLongformEpisodesLow: 70,
    kirkFocusedLongformEpisodesMid: 100,
    kirkFocusedLongformEpisodesHigh: 130,
    avgViewsPerEpLow: 800000,
    avgViewsPerEpMid: 1200000,
    avgViewsPerEpHigh: 1600000,
    clipAndShortMultiplierNote:
      "Clips, Shorts, X reposts, and re-uploads add views not fully counted in main-episode math — treated as an uplift in the High case only.",
  },

  /**
   * Creator-side YouTube RPM (revenue per 1,000 views after platform cut), USD.
   * Politics / news long-form US audiences often land roughly in this band.
   * Not the same as advertiser CPM.
   */
  youtubeRpm: {
    low: 2.5,
    mid: 5,
    high: 9,
    unit: "USD per 1,000 views (creator net, estimate)",
  },

  /**
   * Podcast / host-read sponsorship model (separate from YouTube AdSense).
   * Large political podcasts with multi-million reach can clear high midrolls.
   */
  sponsorshipModel: {
    note: "Independent estimates. Exact rate cards are private. High case stays inside plausible company-scale revenue (Fortune-linked ~$10M/yr context), not above it for Kirk-only.",
    episodesWithHostReadsLow: 45,
    episodesWithHostReadsMid: 75,
    episodesWithHostReadsHigh: 100,
    netPerEpisodeFromAdsLow: 8000,
    netPerEpisodeFromAdsMid: 28000,
    netPerEpisodeFromAdsHigh: 55000,
  },

  /**
   * Club Candace: price is public; member count is not.
   * We estimate paying members and attribute a share of the window to Kirk-driven retention/acquisition.
   */
  membershipModel: {
    payingMembersLow: 12000,
    payingMembersMid: 30000,
    payingMembersHigh: 55000,
    avgMonthlyNetLow: 9,
    avgMonthlyNetMid: 10.5,
    avgMonthlyNetHigh: 11.5,
    monthsInWindow: 10.5,
    /** Share of membership revenue we attribute to Kirk-assassination content intensity */
    kirkAttributionShareLow: 0.3,
    kirkAttributionShareMid: 0.5,
    kirkAttributionShareHigh: 0.65,
  },

  /** X / Super Thanks / Super Chat / merch / speaking — intentionally soft */
  otherStreams: {
    xAndTipsLow: 20000,
    xAndTipsMid: 75000,
    xAndTipsHigh: 200000,
    merchUpliftLow: 10000,
    merchUpliftMid: 40000,
    merchUpliftHigh: 120000,
    note: "No public ledger. Included so readers see the stack is larger than AdSense alone — ranges are wide on purpose.",
  },

  disclaimer:
    "These are independent research estimates for public education. They are not tax returns, bank records, or YouTube Studio screenshots. Owens has not published a Kirk-content P&L. Social Blade and similar tools publish wide ranges; viral $59M claims are rejected as unreliable; $800K/week YouTube claims were denied by Owens and are not used.",
};

/** Pure calculation helpers used by earnings.js */
window.EARNINGS_CALC = {
  formatMoney: function (n) {
    if (n == null || isNaN(n)) return "—";
    var abs = Math.abs(n);
    var sign = n < 0 ? "-" : "";
    if (abs >= 1e6) return sign + "$" + (abs / 1e6).toFixed(2).replace(/\.00$/, "") + "M";
    if (abs >= 1e3) return sign + "$" + Math.round(abs / 1e3) + "K";
    return sign + "$" + Math.round(abs);
  },

  formatViews: function (n) {
    if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (n >= 1e3) return Math.round(n / 1e3) + "K";
    return String(n);
  },

  compute: function () {
    var d = window.EARNINGS_DATA;
    var v = d.volumeAssumptions;
    var rpm = d.youtubeRpm;
    var s = d.sponsorshipModel;
    var m = d.membershipModel;
    var o = d.otherStreams;

    function yt(eps, avgViews, rpmVal, clipUplift) {
      var views = eps * avgViews * (clipUplift || 1);
      return {
        views: views,
        revenue: (views / 1000) * rpmVal,
      };
    }

    function sponsor(eps, perEp) {
      return eps * perEp;
    }

    function membership(members, monthly, share) {
      return members * monthly * m.monthsInWindow * share;
    }

    var low = {
      label: "Conservative (Low)",
      youtube: yt(v.kirkFocusedLongformEpisodesLow, v.avgViewsPerEpLow, rpm.low, 1),
      sponsorships: sponsor(s.episodesWithHostReadsLow, s.netPerEpisodeFromAdsLow),
      memberships: membership(
        m.payingMembersLow,
        m.avgMonthlyNetLow,
        m.kirkAttributionShareLow
      ),
      other: o.xAndTipsLow + o.merchUpliftLow,
    };
    var mid = {
      label: "Central (Mid)",
      youtube: yt(v.kirkFocusedLongformEpisodesMid, v.avgViewsPerEpMid, rpm.mid, 1.1),
      sponsorships: sponsor(s.episodesWithHostReadsMid, s.netPerEpisodeFromAdsMid),
      memberships: membership(
        m.payingMembersMid,
        m.avgMonthlyNetMid,
        m.kirkAttributionShareMid
      ),
      other: o.xAndTipsMid + o.merchUpliftMid,
    };
    var high = {
      label: "Aggressive (High)",
      youtube: yt(v.kirkFocusedLongformEpisodesHigh, v.avgViewsPerEpHigh, rpm.high, 1.35),
      sponsorships: sponsor(s.episodesWithHostReadsHigh, s.netPerEpisodeFromAdsHigh),
      memberships: membership(
        m.payingMembersHigh,
        m.avgMonthlyNetHigh,
        m.kirkAttributionShareHigh
      ),
      other: o.xAndTipsHigh + o.merchUpliftHigh,
    };

    function total(row) {
      return (
        row.youtube.revenue +
        row.sponsorships +
        row.memberships +
        row.other
      );
    }

    low.total = total(low);
    mid.total = total(mid);
    high.total = total(high);

    var sampleViews = d.sampleEpisodes.reduce(function (n, e) {
      return n + e.views;
    }, 0);

    return {
      low: low,
      mid: mid,
      high: high,
      sampleViews: sampleViews,
      headline: {
        low: low.total,
        mid: mid.total,
        high: high.total,
      },
    };
  },
};
