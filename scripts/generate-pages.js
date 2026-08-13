#!/usr/bin/env node
/**
 * Generate static claim permalinks (c/<id>.html) and refresh sitemap.xml.
 * Run from repo root: node scripts/generate-pages.js
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");
var ORIGIN = "https://milehighpatriot.github.io/scamadace-owens-exposed";
var UPDATED = "2026-08-12";

function loadClaims() {
  var code = fs.readFileSync(path.join(ROOT, "js/claims-data.js"), "utf8");
  var sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return {
    claims: sandbox.window.CLAIMS_DATA || [],
    verdicts: sandbox.window.VERDICT_META || {},
  };
}

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function ratingFor(verdict) {
  var map = {
    FALSE: { value: "1", name: "False" },
    CONTRADICTED: { value: "2", name: "Contradicted" },
    UNSUPPORTED: { value: "2", name: "Unsupported" },
    MISLEADING: { value: "3", name: "Misleading" },
    CONTEXT: { value: "3", name: "Context" },
  };
  return map[verdict] || { value: "2", name: verdict || "Unsupported" };
}

function claimPage(claim, verdicts) {
  var title = claim.shortTitle + " — Scamdace Owens Exposed";
  var desc = String(claim.summary || "").replace(/\s+/g, " ").trim().slice(0, 200);
  var url = ORIGIN + "/c/" + claim.id + ".html";
  var meta = verdicts[claim.verdict] || {};
  var verdictLabel = meta.label || claim.verdict;
  var rating = ratingFor(claim.verdict);
  var ld = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: url,
    datePublished: UPDATED,
    dateModified: UPDATED,
    claimReviewed: claim.title,
    author: {
      "@type": "Person",
      name: "MileHigh Patriot",
      url: "https://x.com/America1st5280",
    },
    itemReviewed: {
      "@type": "Claim",
      author: { "@type": "Person", name: "Candace Owens" },
      appearance: (claim.primarySources || [])
        .slice(0, 3)
        .filter(function (s) {
          return s && s.url;
        })
        .map(function (s) {
          return { "@type": "CreativeWork", url: s.url, name: s.label || s.url };
        }),
    },
    reviewRating: {
      "@type": "Rating",
      alternateName: rating.name,
      bestRating: "5",
      worstRating: "1",
      ratingValue: rating.value,
    },
  };

  var primaries = (claim.primarySources || [])
    .slice(0, 4)
    .map(function (s) {
      return (
        "<li><a href=\"" +
        esc(s.url) +
        "\">" +
        esc(s.label || s.url) +
        "</a>" +
        (s.quote ? " — “" + esc(s.quote) + "”" : "") +
        "</li>"
      );
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}" />
  <meta name="author" content="MileHigh Patriot (@America1st5280)" />
  <meta name="theme-color" content="#08090c" />
  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />
  <link rel="canonical" href="${esc(url)}" />
  <meta property="og:site_name" content="Scamdace Owens Exposed" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(desc)}" />
  <meta property="og:url" content="${esc(url)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta property="og:image" content="${ORIGIN}/assets/og-image.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:image" content="${ORIGIN}/assets/og-image.png" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(desc)}" />
  <link rel="stylesheet" href="../css/styles.css" />
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>
<body data-claim-id="${esc(claim.id)}">
  <a class="skip-link" href="#main">Skip to content</a>
  <div id="site-header-mount"></div>
  <main id="main">
    <noscript>
      <article class="claim-hero">
        <p class="hero-kicker">${esc(verdictLabel)}</p>
        <h1>${esc(claim.title)}</h1>
        <p class="claim-summary">${esc(claim.summary || "")}</p>
        ${primaries ? "<h2>Where she said it</h2><ul class=\"source-list\">" + primaries + "</ul>" : ""}
        <p>This page needs JavaScript to load the full evidence stack. <a href="../claims.html">Browse all claims</a> · <a href="../facts.html">Public record</a></p>
      </article>
    </noscript>
    <div id="claim-root">
      <div class="empty-state" role="status">Loading claim…</div>
    </div>
  </main>
  <div id="site-footer-mount"></div>
  <script src="../js/claims-data.js"></script>
  <script src="../js/app.js"></script>
  <script src="../js/claim-detail.js"></script>
</body>
</html>
`;
}

function writeSitemap(claims) {
  var staticPages = [
    { loc: "/", priority: "1.0" },
    { loc: "/claims.html", priority: "0.95" },
    { loc: "/archive.html", priority: "0.9" },
    { loc: "/facts.html", priority: "0.85" },
    { loc: "/earnings.html", priority: "0.7" },
    { loc: "/about.html", priority: "0.7" },
    { loc: "/submit.html", priority: "0.6" },
    { loc: "/corrections.html", priority: "0.5" },
    { loc: "/timeline.html", priority: "0.7" },
    { loc: "/episodes.html", priority: "0.6" },
    { loc: "/people.html", priority: "0.7" },
    { loc: "/methods.html", priority: "0.6" },
    { loc: "/pivots.html", priority: "0.5" },
    { loc: "/contradictions.html", priority: "0.6" },
    { loc: "/quotes.html", priority: "0.6" },
    { loc: "/vault.html", priority: "0.6" },
    { loc: "/compare.html", priority: "0.6" },
    { loc: "/hearing.html", priority: "0.6" },
    { loc: "/legal.html", priority: "0.6" },
    { loc: "/exhibits.html", priority: "0.5" },
    { loc: "/media.html", priority: "0.5" },
    { loc: "/glossary.html", priority: "0.4" },
    { loc: "/faq.html", priority: "0.5" },
    { loc: "/journalists.html", priority: "0.6" },
    { loc: "/family.html", priority: "0.5" },
    { loc: "/graph.html", priority: "0.5" },
    { loc: "/map.html", priority: "0.4" },
    { loc: "/search.html", priority: "0.7" },
    { loc: "/report.html", priority: "0.5" },
    { loc: "/press-kit.html", priority: "0.4" },
    { loc: "/research.html", priority: "0.4" },
    { loc: "/grief-economy.html", priority: "0.4" },
    { loc: "/burdens.html", priority: "0.4" },
    { loc: "/falsify.html", priority: "0.4" },
  ];

  function urlEntry(loc, priority) {
    return (
      "  <url>\n" +
      "    <loc>" +
      ORIGIN +
      loc +
      "</loc>\n" +
      "    <lastmod>" +
      UPDATED +
      "</lastmod>\n" +
      "    <changefreq>weekly</changefreq>\n" +
      "    <priority>" +
      priority +
      "</priority>\n" +
      "  </url>"
    );
  }

  var parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];
  staticPages.forEach(function (p) {
    parts.push(urlEntry(p.loc, p.priority));
  });
  claims.forEach(function (c) {
    parts.push(urlEntry("/c/" + c.id + ".html", c.featured ? "0.8" : "0.65"));
  });
  parts.push("</urlset>\n");
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), parts.join("\n"));
}

function main() {
  var loaded = loadClaims();
  var claims = loaded.claims;
  if (!claims.length) {
    console.error("No claims loaded from js/claims-data.js");
    process.exit(1);
  }

  var dir = path.join(ROOT, "c");
  fs.mkdirSync(dir, { recursive: true });
  fs.readdirSync(dir).forEach(function (name) {
    if (name.endsWith(".html")) fs.unlinkSync(path.join(dir, name));
  });

  claims.forEach(function (claim) {
    fs.writeFileSync(path.join(dir, claim.id + ".html"), claimPage(claim, loaded.verdicts));
  });

  fs.writeFileSync(
    path.join(dir, "index.html"),
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=../claims.html" />
  <title>Claim catalog — Scamdace Owens Exposed</title>
  <link rel="canonical" href="${ORIGIN}/claims.html" />
</head>
<body>
  <p><a href="../claims.html">Open the claim catalog</a></p>
</body>
</html>
`
  );

  writeSitemap(claims);
  console.log("Wrote " + claims.length + " claim pages to c/ and refreshed sitemap.xml");
}

main();
