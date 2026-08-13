/**
 * Scamdace Owens Exposed — archive page renderers
 */
(function () {
  var root = document.getElementById("page-root");
  if (!root) return;
  var page = document.body.getAttribute("data-page") || "";
  var alreadyStatic = root.getAttribute("data-static-archive") === page;
  var A = window.ARCHIVE_DATA || {};
  var claims = window.CLAIMS_DATA || [];
  var byId = {};
  claims.forEach(function (c) {
    byId[c.id] = c;
  });

  function esc(s) {
    return SOE.escapeHtml ? SOE.escapeHtml(String(s == null ? "" : s)) : String(s == null ? "" : s);
  }
  function claimHref(id) {
    return window.SOE && SOE.claimHref
      ? SOE.claimHref(id)
      : "c/" + encodeURIComponent(id) + ".html";
  }
  function claimLink(id) {
    var c = byId[id];
    if (!c) return '<code>' + esc(id) + "</code>";
    return (
      '<a href="' +
      claimHref(id) +
      '">' +
      esc(c.shortTitle || id) +
      "</a>"
    );
  }
  function claimLinks(ids) {
    return (ids || [])
      .map(claimLink)
      .filter(Boolean)
      .join(" · ");
  }
  function verdict(c) {
    return c ? SOE.verdictHtml(c.verdict) : "";
  }

  function toolbar(html) {
    return '<div class="toolbar archive-toolbar">' + html + "</div>";
  }

  function empty(msg) {
    return '<div class="empty-state">' + esc(msg) + "</div>";
  }

  // —— Renderers ——
  var renderers = {
    archive: function () {
      var nav = A.navExtra || [];
      var groups = [
        {
          title: "Story & chronology",
          ids: ["timeline", "episodes", "pivots", "hearing", "map"],
        },
        {
          title: "Claims tools",
          ids: [
            "contradictions",
            "quotes",
            "graph",
            "search",
            "vault",
            "media",
            "exhibits",
            "burdens",
            "falsify",
          ],
        },
        {
          title: "People & rhetoric",
          ids: ["people", "methods", "compare"],
        },
        {
          title: "Record & law",
          ids: ["legal", "glossary", "faq"],
        },
        {
          title: "Public use",
          ids: [
            "journalists",
            "family",
            "press-kit",
            "research",
            "grief-economy",
            "report",
          ],
        },
      ];
      function card(href, label) {
        return (
          '<a class="archive-card" href="' +
          esc(href) +
          '"><strong>' +
          esc(label) +
          "</strong><span>Open →</span></a>"
        );
      }
      var html =
        '<div class="callout"><strong>Catalog size:</strong> ' +
        claims.length +
        " claims · " +
        (A.quotes || []).length +
        " quoted primaries · " +
        (A.media || []).length +
        " media ledger rows · updated " +
        esc(A.updated || "") +
        '. Also: <a href="claims.html">full claim catalog</a> · <a href="facts.html">public record</a> · <a href="earnings.html">earnings</a> · <a href="feed.xml">RSS</a>.</div>';
      groups.forEach(function (g) {
        html += "<h2>" + esc(g.title) + "</h2><div class=\"archive-grid\">";
        g.ids.forEach(function (id) {
          var item = nav.find(function (n) {
            return n.href === id + ".html";
          });
          if (item) html += card(item.href, item.label);
        });
        html += "</div>";
      });
      html +=
        '<h2>Core pages</h2><div class="archive-grid">' +
        card("claims.html", "Claim catalog") +
        card("facts.html", "Public record") +
        card("earnings.html", "Earnings estimates") +
        card("submit.html", "Submit a claim") +
        card("corrections.html", "Corrections / changelog") +
        card("about.html", "About") +
        "</div>";
      return html;
    },

    timeline: function () {
      var events = A.timeline || [];
      var html = '<div class="timeline">';
      events.forEach(function (e) {
        html +=
          '<article class="timeline-item type-' +
          esc(e.type || "meta") +
          '"><div class="timeline-date">' +
          esc(e.date) +
          '</div><div class="timeline-body"><h3>' +
          esc(e.title) +
          "</h3><p>" +
          esc(e.body) +
          "</p>";
        if (e.claimIds && e.claimIds.length) {
          html +=
            '<p class="timeline-links"><strong>Claims:</strong> ' +
            claimLinks(e.claimIds) +
            "</p>";
        }
        if (e.links && e.links.length) {
          html +=
            '<p class="timeline-links">' +
            e.links
              .map(function (l) {
                return (
                  '<a href="' +
                  esc(l.href || l.url) +
                  '">' +
                  esc(l.label) +
                  "</a>"
                );
              })
              .join(" · ") +
            "</p>";
        }
        html += "</div></article>";
      });
      html += "</div>";
      return html;
    },

    episodes: function () {
      var eps = A.episodes || [];
      var html =
        toolbar(
          '<input class="search-input" id="ep-search" type="search" placeholder="Filter episodes…" />'
        ) + '<div id="ep-list" class="stack-list">';
      eps
        .slice()
        .sort(function (a, b) {
          return (a.date || "").localeCompare(b.date || "");
        })
        .forEach(function (ep) {
          html +=
            '<article class="stack-card" data-text="' +
            esc(
              (ep.title + " " + ep.notes + " " + (ep.claimIds || []).join(" ")).toLowerCase()
            ) +
            '"><div class="stack-meta">' +
            esc(ep.date) +
            '</div><h3>' +
            esc(ep.title) +
            "</h3><p>" +
            esc(ep.notes || "") +
            '</p><p class="timeline-links"><strong>Claims:</strong> ' +
            claimLinks(ep.claimIds) +
            "</p>" +
            (ep.url
              ? '<p><a href="' +
                esc(ep.url) +
                '" target="_blank" rel="noopener">Primary / packaging link ↗</a></p>'
              : "") +
            "</article>";
        });
      html += "</div>";
      return html;
    },

    people: function () {
      var people = A.people || [];
      var hash = (location.hash || "").replace(/^#/, "");
      var html =
        toolbar(
          '<input class="search-input" id="ppl-search" type="search" placeholder="Filter people…" />'
        ) + '<div id="ppl-list" class="stack-list">';
      people.forEach(function (p) {
        var open = hash && hash === p.id ? " open" : "";
        html +=
          '<article class="stack-card" id="' +
          esc(p.id) +
          '" data-text="' +
          esc((p.name + " " + p.role + " " + p.summary + " " + p.owensAngle).toLowerCase()) +
          '"><div class="stack-meta">' +
          esc(p.kind) +
          " · " +
          esc(p.role) +
          "</div><h3>" +
          esc(p.name) +
          "</h3><p>" +
          esc(p.summary) +
          '</p><p><strong>Owens angle:</strong> ' +
          esc(p.owensAngle) +
          "</p>";
        if (p.claimIds && p.claimIds.length && p.claimIds.length < 80) {
          html +=
            '<p class="timeline-links"><strong>Related claims:</strong> ' +
            claimLinks(p.claimIds.slice(0, 24)) +
            (p.claimIds.length > 24 ? " …" : "") +
            "</p>";
        } else if (p.id === "candace-owens") {
          html +=
            '<p class="timeline-links"><a href="claims.html">All ' +
            claims.length +
            " claims →</a></p>";
        }
        html += "</article>";
      });
      html += "</div>";
      return html;
    },

    methods: function () {
      var html = '<div class="stack-list">';
      (A.methods || []).forEach(function (m) {
        html +=
          '<article class="stack-card" id="' +
          esc(m.id) +
          '"><h3>' +
          esc(m.name) +
          "</h3><p>" +
          esc(m.body) +
          '</p><p class="timeline-links"><strong>Examples:</strong> ' +
          claimLinks(m.claimIds) +
          "</p></article>";
      });
      html +=
        '</div><div class="callout">See also <a href="pivots.html">Pivots</a> and <a href="contradictions.html">Contradictions</a>.</div>';
      return html;
    },

    pivots: function () {
      var html = '<div class="stack-list">';
      (A.pivots || []).forEach(function (p) {
        html +=
          '<article class="stack-card"><div class="stack-meta">' +
          esc(p.when) +
          '</div><h3><span class="pivot-from">' +
          esc(p.from) +
          '</span> <span class="pivot-arrow">→</span> <span class="pivot-to">' +
          esc(p.to) +
          "</span></h3><p>" +
          esc(p.note) +
          '</p><p class="timeline-links">' +
          claimLinks(p.claimIds) +
          "</p></article>";
      });
      return html + "</div>";
    },

    contradictions: function () {
      var html = '<div class="stack-list">';
      (A.contradictions || []).forEach(function (c) {
        html +=
          '<article class="stack-card"><h3>' +
          esc(c.title) +
          '</h3><div class="compare-row"><div class="compare-col"><strong>Claim A</strong><br/>' +
          claimLink(c.a) +
          " " +
          verdict(byId[c.a]) +
          '</div><div class="compare-col"><strong>Claim B</strong><br/>' +
          claimLink(c.b) +
          " " +
          verdict(byId[c.b]) +
          "</div></div><p>" +
          esc(c.body) +
          "</p></article>";
      });
      return html + "</div>";
    },

    quotes: function () {
      var quotes = A.quotes || [];
      var html =
        toolbar(
          '<input class="search-input" id="q-search" type="search" placeholder="Search quotes…" />'
        ) +
        '<p class="section-sub">' +
        quotes.length +
        " quotes with primary links</p><div id=\"q-list\" class=\"stack-list\">";
      quotes.forEach(function (q) {
        html +=
          '<article class="stack-card" data-text="' +
          esc((q.quote + " " + q.claimTitle + " " + q.date).toLowerCase()) +
          '"><div class="stack-meta">' +
          esc(q.date) +
          (q.timestamp ? " · " + esc(q.timestamp) : "") +
          " · " +
          verdict(byId[q.claimId]) +
          '</div><blockquote class="src-quote">“' +
          esc(q.quote) +
          '”</blockquote><p>' +
          claimLink(q.claimId) +
          ' · <a href="' +
          esc(q.url) +
          '" target="_blank" rel="noopener">Primary ↗</a>' +
          (q.archiveUrl
            ? ' · <a href="' +
              esc(q.archiveUrl) +
              '" target="_blank" rel="noopener">Archive ↗</a>'
            : "") +
          "</p></article>";
      });
      html += "</div>";
      return html;
    },

    vault: function () {
      var media = A.media || [];
      var html =
        toolbar(
          '<input class="search-input" id="v-search" type="search" placeholder="Filter vault…" />' +
            '<select class="select-input" id="v-kind"><option value="all">All kinds</option><option value="x">X posts</option><option value="video-audio">Video/audio</option><option value="article">Articles</option></select>'
        ) +
        '<p class="section-sub">' +
        media.length +
        " primary rows · archive.today links generated for each URL</p><div id=\"v-list\" class=\"stack-list\">";
      media.forEach(function (m) {
        html +=
          '<article class="stack-card" data-kind="' +
          esc(m.kind) +
          '" data-text="' +
          esc((m.label + " " + m.claimTitle + " " + m.date + " " + (m.quote || "")).toLowerCase()) +
          '"><div class="stack-meta">' +
          esc(m.kind) +
          " · " +
          esc(m.date) +
          (m.timestamp ? " · " + esc(m.timestamp) : "") +
          "</div><h3>" +
          esc(m.label) +
          "</h3><p>" +
          claimLink(m.claimId) +
          "</p>" +
          (m.quote
            ? '<blockquote class="src-quote">“' + esc(m.quote) + '”</blockquote>'
            : "") +
          '<p><a href="' +
          esc(m.url) +
          '" target="_blank" rel="noopener">Open primary ↗</a> · <a href="' +
          esc(m.archiveUrl) +
          '" target="_blank" rel="noopener">Archive capture ↗</a></p></article>';
      });
      html += "</div>";
      return html;
    },

    compare: function () {
      return (
        '<div class="compare-grid">' +
        '<section class="compare-panel"><h2>Public record baseline</h2><ul class="clean-list">' +
        "<li>Sept 10, 2025 UVU outdoor assassination captured on multi-angle video</li>" +
        "<li>Tyler Robinson charged; prosecutors present rifle-class case</li>" +
        "<li>Prelim reporting: surveillance path, DNA on rifle, communications package</li>" +
        "<li>Body transport / memorial publicly documented</li>" +
        "<li>Adversarial process exists (defense motions, future trial)</li>" +
        '</ul><p><a class="btn btn-primary btn-sm" href="facts.html">Full public record page</a> <a class="btn btn-secondary btn-sm" href="exhibits.html">Exhibit board</a></p></section>' +
        '<section class="compare-panel compare-panel-alt"><h2>Owens portfolio (rotating)</h2><ul class="clean-list">' +
        "<li>Mechanism rotation: tunnels → foreign teams → mic bomb → no-recoil pro</li>" +
        "<li>Robinson as patsy / not present / gun not fired / lookalike</li>" +
        "<li>Villain rotation: Israel, France, Egypt, military, TPUSA, security</li>" +
        "<li>Method tools: dreams, association trees, show-trial framing</li>" +
        "<li>After hearing pressure: cremation/body secrecy + ME spin</li>" +
        '</ul><p><a class="btn btn-primary btn-sm" href="claims.html">All claims</a> <a class="btn btn-secondary btn-sm" href="pivots.html">Pivot log</a></p></section></div>' +
        '<div class="callout">Rule of engagement: the alternate story must <em>beat</em> the baseline exhibits — not merely mock them on a podcast.</div>'
      );
    },

    hearing: function () {
      var html = '<div class="stack-list">';
      (A.hearing || []).forEach(function (h) {
        html +=
          '<article class="stack-card"><h3>' +
          esc(h.exhibit) +
          '</h3><div class="compare-row"><div class="compare-col"><strong>Official / reporting</strong><p>' +
          esc(h.official) +
          '</p></div><div class="compare-col"><strong>Owens spin</strong><p>' +
          esc(h.owens) +
          "</p></div></div><p class=\"timeline-links\">" +
          claimLinks(h.claimIds) +
          "</p></article>";
      });
      return html + "</div>";
    },

    legal: function () {
      var html = '<div class="stack-list">';
      (A.legal || []).forEach(function (L) {
        html +=
          '<article class="stack-card"><div class="stack-meta">' +
          esc(L.date) +
          " · " +
          esc(L.status) +
          "</div><h3>" +
          esc(L.title) +
          "</h3><p>" +
          esc(L.body) +
          "</p>";
        if (L.links) {
          html +=
            "<p>" +
            L.links
              .map(function (l) {
                return (
                  '<a href="' +
                  esc(l.url) +
                  '" target="_blank" rel="noopener">' +
                  esc(l.label) +
                  " ↗</a>"
                );
              })
              .join(" · ") +
            "</p>";
        }
        if (L.claimIds) {
          html +=
            '<p class="timeline-links">' + claimLinks(L.claimIds) + "</p>";
        }
        html += "</article>";
      });
      return html + "</div>";
    },

    exhibits: function () {
      var html = '<div class="stack-list">';
      (A.exhibits || []).forEach(function (e) {
        html +=
          '<article class="stack-card"><div class="stack-meta">Tier ' +
          esc(e.tier) +
          "</div><h3>" +
          esc(e.title) +
          "</h3><p>" +
          esc(e.body) +
          '</p><p class="timeline-links"><strong>Beats claims:</strong> ' +
          claimLinks(e.beats) +
          "</p></article>";
      });
      return (
        html +
        '</div><div class="callout"><a href="burdens.html">Burden checklists</a> · <a href="falsify.html">What would falsify</a></div>'
      );
    },

    media: function () {
      return renderers.vault();
    },

    glossary: function () {
      var html =
        toolbar(
          '<input class="search-input" id="g-search" type="search" placeholder="Filter terms…" />'
        ) + '<dl id="g-list" class="glossary-list">';
      (A.glossary || []).forEach(function (g) {
        html +=
          '<div class="glossary-item" data-text="' +
          esc((g.term + " " + g.def).toLowerCase()) +
          '"><dt>' +
          esc(g.term) +
          "</dt><dd>" +
          esc(g.def) +
          "</dd></div>";
      });
      html += "</dl>";
      return html;
    },

    faq: function () {
      var html = '<div class="stack-list">';
      (A.faq || []).forEach(function (f) {
        html +=
          "<article class=\"stack-card\"><h3>" +
          esc(f.q) +
          "</h3><p>" +
          esc(f.a) +
          "</p></article>";
      });
      return html + "</div>";
    },

    journalists: function () {
      var top = A.journalistTop || [];
      var html =
        '<div class="callout"><strong>One-pager use:</strong> link this page + facts.html + 3–5 claim deep-dives. Always open primary X/show links yourself.</div><h2>Top claims to read first</h2><div class="stack-list">';
      top.forEach(function (id, i) {
        var c = byId[id];
        if (!c) return;
        html +=
          '<article class="stack-card"><div class="stack-meta">#' +
          (i + 1) +
          " · " +
          verdict(c) +
          '</div><h3><a href="' +
          claimHref(id) +
          '">' +
          esc(c.shortTitle) +
          "</a></h3><p>" +
          esc(c.summary) +
          "</p>";
        if (c.primarySources && c.primarySources[0]) {
          var s = c.primarySources[0];
          html +=
            '<p class="timeline-links"><a href="' +
            esc(s.url) +
            '" target="_blank" rel="noopener">' +
            esc(s.label) +
            "</a>" +
            (s.date ? " · " + esc(s.date) : "") +
            (s.timestamp ? " · " + esc(s.timestamp) : "") +
            "</p>";
        }
        html += "</article>";
      });
      html +=
        '</div><h2>How to cite</h2><pre class="code-block">MileHigh Patriot. "Scamdace Owens Exposed." Accessed [date]. ' +
        esc(SOE.SITE_ORIGIN) +
        "/</pre><h2>Standards</h2><ul class=\"clean-list\"><li>Primary Owens sources preferred</li><li>Verdict language is ours; quotes are hers</li><li>Not affiliated with TPUSA, campaigns, or government</li><li>Corrections: corrections.html</li></ul>";
      return html;
    },

    family: function () {
      var html =
        '<div class="callout">Goal: protect relationships and reality — not “win” a flame war.</div><div class="stack-list">';
      (A.familyGuide || []).forEach(function (f) {
        html +=
          "<article class=\"stack-card\"><h3>" +
          esc(f.title) +
          "</h3><p>" +
          esc(f.body) +
          "</p></article>";
      });
      html +=
        '</div><p class="btn-row"><a class="btn btn-primary" href="facts.html">Start from public record</a><a class="btn btn-secondary" href="methods.html">See the playbook</a><a class="btn btn-secondary" href="faq.html">FAQ</a></p>';
      return html;
    },

    graph: function () {
      // Build adjacency from related[]
      var edges = [];
      var deg = {};
      claims.forEach(function (c) {
        deg[c.id] = deg[c.id] || 0;
        (c.related || []).forEach(function (r) {
          if (!byId[r]) return;
          edges.push([c.id, r]);
          deg[c.id]++;
          deg[r] = (deg[r] || 0) + 1;
        });
      });
      var top = claims
        .slice()
        .sort(function (a, b) {
          return (deg[b.id] || 0) - (deg[a.id] || 0);
        })
        .slice(0, 40);
      var html =
        '<p class="section-sub">Top connected claims (by related[] links). Full graph is navigable via each claim’s “Related” section.</p><div class="stack-list">';
      top.forEach(function (c) {
        html +=
          '<article class="stack-card"><div class="stack-meta">' +
          (deg[c.id] || 0) +
          " links · " +
          verdict(c) +
          '</div><h3><a href="' +
          claimHref(c.id) +
          '">' +
          esc(c.shortTitle) +
          "</a></h3><p class=\"timeline-links\">" +
          claimLinks((c.related || []).slice(0, 12)) +
          "</p></article>";
      });
      // cluster chips
      html +=
        '</div><h2>Mechanism cluster</h2><p class="timeline-links">' +
        claimLinks([
          "exploding-microphone",
          "who-micd-charlie",
          "iphone-gun",
          "no-rooftop-shot",
          "rooftop-no-recoil",
          "gun-not-fired",
        ]) +
        '</p><h2>Foreign / deep-state cluster</h2><p class="timeline-links">' +
        claimLinks([
          "israel-mossad",
          "france-legionnaires",
          "egypt-planes",
          "military-inside-job",
          "foreign-agents-bigger",
        ]) +
        '</p><h2>TPUSA / people cluster</h2><p class="timeline-links">' +
        claimLinks([
          "tpusa-inside-job",
          "erika-theories",
          "mikey-mccoy-suspicion",
          "harpole-plot",
          "twiggs-fed-asset",
        ]) +
        "</p>";
      return html;
    },

    map: function () {
      var m = A.mapNotes || {};
      var html =
        '<div class="callout">' +
        esc(m.disclaimer || "") +
        '</div><div class="map-board">';
      (m.points || []).forEach(function (p) {
        html +=
          '<div class="map-point" id="map-' +
          esc(p.id) +
          '"><h3>' +
          esc(p.name) +
          "</h3><p>" +
          esc(p.note) +
          "</p></div>";
      });
      html +=
        '</div><h2>Claims that fight over this geography</h2><p class="timeline-links">' +
        claimLinks([
          "no-rooftop-shot",
          "rooftop-no-recoil",
          "losee-lone-witness",
          "trap-door-tunnels",
          "dogs-missed-rifle",
          "maroon-shirts",
          "exploding-microphone",
        ]) +
        "</p>";
      return html;
    },

    search: function () {
      var html =
        toolbar(
          '<input class="search-input" id="site-search" type="search" placeholder="Search claims, quotes, people, glossary…" autofocus />'
        ) +
        '<div id="site-search-results" class="stack-list"><p class="section-sub">Type at least 2 characters. Searches claim titles/summaries, quotes, people, glossary.</p></div>';
      return html;
    },

    report: function () {
      var html =
        '<div class="print-toolbar no-print"><button type="button" class="btn btn-primary" id="print-report">Print / Save PDF</button><a class="btn btn-secondary" href="journalists.html">Journalist pack</a></div>';
      html +=
        '<article class="print-doc"><header><h2>Scamdace Owens Exposed — Catalog Report</h2><p>Baseline: ' +
        esc(A.updated) +
        " · Claims: " +
        claims.length +
        " · Author: MileHigh Patriot (@America1st5280)</p><p>Mission: document Candace Owens’s Charlie Kirk assassination claims with primary links, then stack public evidence.</p></header>";
      html += "<h3>Verdict counts</h3><ul>";
      var vc = {};
      claims.forEach(function (c) {
        vc[c.verdict] = (vc[c.verdict] || 0) + 1;
      });
      Object.keys(vc).forEach(function (k) {
        html += "<li>" + esc(k) + ": " + vc[k] + "</li>";
      });
      html += "</ul><h3>Featured / core claims</h3>";
      claims
        .filter(function (c) {
          return c.featured || c.severity === "core";
        })
        .forEach(function (c) {
          html +=
            '<section class="print-claim"><h4>' +
            esc(c.shortTitle) +
            " — " +
            esc(c.verdict) +
            "</h4><p><em>" +
            esc(c.dateRange) +
            "</em></p><p>" +
            esc(c.summary) +
            "</p><p>URL: " +
            esc((SOE.SITE_ORIGIN || "") + "/" + (SOE.claimPath ? SOE.claimPath(c.id) : "c/" + c.id + ".html")) +
            "</p>";
          if (c.primarySources && c.primarySources[0]) {
            var s = c.primarySources[0];
            html +=
              "<p>Primary: " +
              esc(s.label) +
              " — " +
              esc(s.url) +
              (s.date ? " (" + esc(s.date) + ")" : "") +
              "</p>";
          }
          html += "</section>";
        });
      html +=
        "<h3>How to use</h3><ol><li>Read facts.html baseline</li><li>Open individual claim stacks</li><li>Verify primaries via vault.html archives</li></ol></article>";
      return html;
    },

    "press-kit": function () {
      return (
        '<div class="stack-list">' +
        '<article class="stack-card"><h3>Boilerplate</h3><p>Scamdace Owens Exposed is a static public archive by MileHigh Patriot (@America1st5280) documenting Candace Owens’s claims about the Charlie Kirk assassination (Sept 10, 2025–) with primary links, dates/timestamps, and tiered public-evidence disproofs. Not affiliated with TPUSA, Candace Owens, any campaign, or any government.</p></article>' +
        '<article class="stack-card"><h3>Canonical URL</h3><p><code>' +
        esc(SOE.SITE_ORIGIN) +
        '/</code></p></article>' +
        '<article class="stack-card"><h3>Key entry points</h3><p class="timeline-links"><a href="facts.html">Public record</a> · <a href="claims.html">Claim catalog</a> · <a href="journalists.html">Journalist pack</a> · <a href="archive.html">Archive hub</a> · <a href="feed.xml">RSS</a></p></article>' +
        '<article class="stack-card"><h3>Assets</h3><p><a href="assets/og-image.png">OG image (PNG)</a> · <a href="assets/og-image.svg">SVG source</a> · <a href="assets/favicon.svg">Favicon</a></p></article>' +
        '<article class="stack-card"><h3>Contact</h3><p><a href="https://x.com/America1st5280" target="_blank" rel="noopener">@America1st5280</a> · <a href="submit.html">Submit claims</a> · <a href="corrections.html">Corrections</a></p></article>' +
        "</div>"
      );
    },

    research: function () {
      var r = A.researchOps || {};
      var html = "<h2>Weekly ritual</h2><ol class=\"clean-list\">";
      (r.weeklyRitual || []).forEach(function (step) {
        html += "<li>" + esc(step) + "</li>";
      });
      html +=
        '</ol><h2>Intake fields (required)</h2><pre class="code-block">' +
        esc((r.intakeFields || []).join(" | ")) +
        '</pre><h2>Link rot</h2><p>' +
        esc(r.linkRot || "") +
        "</p><h2>Standards</h2><p>" +
        esc(r.standards || "") +
        '</p><p class="btn-row"><a class="btn btn-primary" href="submit.html">Open submit form</a><a class="btn btn-secondary" href="vault.html">Source vault</a></p>';
      return html;
    },

    "grief-economy": function () {
      var g = A.griefEconomy || {};
      var html =
        "<p class=\"lede\" style=\"max-width:720px\">" +
        esc(g.summary || "") +
        '</p><h2>What to measure</h2><ul class="clean-list">';
      (g.metricsIdeas || []).forEach(function (m) {
        html += "<li>" + esc(m) + "</li>";
      });
      html +=
        "</ul><p>" +
        esc(g.ethicalNote || "") +
        '</p><p class="btn-row"><a class="btn btn-primary" href="earnings.html">Earnings estimates</a><a class="btn btn-secondary" href="episodes.html">Episode index</a><a class="btn btn-secondary" href="methods.html">Methods</a></p>';
      return html;
    },

    burdens: function () {
      var html = '<div class="stack-list">';
      (A.burdens || []).forEach(function (b) {
        html +=
          "<article class=\"stack-card\"><h3>" +
          esc(b.type) +
          "</h3><p><strong>Must produce:</strong></p><ul class=\"clean-list\">";
        (b.need || []).forEach(function (n) {
          html += "<li>" + esc(n) + "</li>";
        });
        html +=
          '</ul><p class="timeline-links">' +
          claimLinks(b.claimIds) +
          "</p></article>";
      });
      return html + "</div>";
    },

    falsify: function () {
      var f = A.falsify || {};
      return (
        '<div class="compare-grid"><section class="compare-panel"><h2>What Owens’s portfolio must still beat</h2><ul class="clean-list">' +
        (f.owensNeedsToBeat || [])
          .map(function (x) {
            return "<li>" + esc(x) + "</li>";
          })
          .join("") +
        '</ul></section><section class="compare-panel compare-panel-alt"><h2>What would seriously hurt the public-case baseline</h2><ul class="clean-list">' +
        (f.officialCaseWouldHurtIf || [])
          .map(function (x) {
            return "<li>" + esc(x) + "</li>";
          })
          .join("") +
        '</ul></section></div><div class="callout">Until alternate stories meet the left column’s burden with exhibits — not vibes — they remain content products competing with a gunshot record.</div>'
      );
    },
  };

  function bindArchiveEnhancements() {
    function filterCards(inputId, listSel) {
      var input = document.getElementById(inputId);
      if (!input) return;
      input.addEventListener("input", function () {
        var q = input.value.toLowerCase().trim();
        document.querySelectorAll(listSel).forEach(function (el) {
          var t = el.getAttribute("data-text") || "";
          el.hidden = q && t.indexOf(q) === -1;
        });
      });
    }
    filterCards("ep-search", "#ep-list .stack-card");
    filterCards("ppl-search", "#ppl-list .stack-card");
    filterCards("q-search", "#q-list .stack-card");
    filterCards("g-search", "#g-list .glossary-item");

    var vSearch = document.getElementById("v-search");
    var vKind = document.getElementById("v-kind");
    if (vSearch && vKind) {
      function applyVault() {
        var q = (vSearch.value || "").toLowerCase();
        var k = vKind.value;
        document.querySelectorAll("#v-list .stack-card").forEach(function (el) {
          var t = el.getAttribute("data-text") || "";
          var kind = el.getAttribute("data-kind");
          el.hidden = !((k === "all" || kind === k) && (!q || t.indexOf(q) !== -1));
        });
      }
      vSearch.addEventListener("input", applyVault);
      vKind.addEventListener("change", applyVault);
    }

    var hash = (location.hash || "").replace(/^#/, "");
    if (hash) {
      var el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    var printBtn = document.getElementById("print-report");
    if (printBtn) {
      printBtn.addEventListener("click", function () {
        window.print();
      });
    }

    var siteSearch = document.getElementById("site-search");
    var siteOut = document.getElementById("site-search-results");
    if (siteSearch && siteOut) {
      function runSearch() {
        var q = (siteSearch.value || "").toLowerCase().trim();
        if (q.length < 2) {
          siteOut.innerHTML =
            '<p class="section-sub">Type at least 2 characters. Searches claim titles/summaries, quotes, people, glossary.</p>';
          return;
        }
        var hits = [];
        claims.forEach(function (c) {
          var blob = (
            c.title +
            " " +
            c.shortTitle +
            " " +
            c.summary +
            " " +
            c.claimDetail +
            " " +
            c.id
          ).toLowerCase();
          if (blob.indexOf(q) !== -1) {
            hits.push({
              type: "Claim",
              title: c.shortTitle,
              body: c.summary,
              href: claimHref(c.id),
              meta: c.verdict,
            });
          }
        });
        (A.quotes || []).forEach(function (qq) {
          if ((qq.quote + " " + qq.claimTitle).toLowerCase().indexOf(q) !== -1) {
            hits.push({
              type: "Quote",
              title: qq.claimTitle,
              body: qq.quote,
              href: claimHref(qq.claimId),
              meta: qq.date,
            });
          }
        });
        (A.people || []).forEach(function (p) {
          if ((p.name + " " + p.summary + " " + p.owensAngle).toLowerCase().indexOf(q) !== -1) {
            hits.push({
              type: "Person",
              title: p.name,
              body: p.summary,
              href: "people.html#" + encodeURIComponent(p.id),
              meta: p.role,
            });
          }
        });
        (A.glossary || []).forEach(function (g) {
          if ((g.term + " " + g.def).toLowerCase().indexOf(q) !== -1) {
            hits.push({
              type: "Glossary",
              title: g.term,
              body: g.def,
              href: "glossary.html",
              meta: "term",
            });
          }
        });
        if (!hits.length) {
          siteOut.innerHTML = empty("No hits for “" + q + "”");
          return;
        }
        siteOut.innerHTML = hits
          .slice(0, 80)
          .map(function (h) {
            return (
              '<article class="stack-card"><div class="stack-meta">' +
              esc(h.type) +
              (h.meta ? " · " + esc(h.meta) : "") +
              '</div><h3><a href="' +
              esc(h.href) +
              '">' +
              esc(h.title) +
              "</a></h3><p>" +
              esc(h.body).slice(0, 280) +
              "</p></article>"
            );
          })
          .join("");
      }
      siteSearch.addEventListener("input", runSearch);
      runSearch();
    }
  }

  if (alreadyStatic) {
    bindArchiveEnhancements();
    return;
  }

  var fn = renderers[page];
  if (!fn) {
    root.innerHTML = empty("Unknown archive page: " + page);
    return;
  }
  try {
    root.innerHTML = fn();
    bindArchiveEnhancements();
  } catch (e) {
    root.innerHTML =
      '<div class="empty-state">Render error on this page. Check console.</div>';
    console.error(e);
  }
})();
