#!/usr/bin/env node
/**
 * Generate static claim permalinks (c/<id>.html) and refresh sitemap.xml.
 * Run from repo root: node scripts/generate-pages.js
 * Check without writing: node scripts/generate-pages.js --check
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");
var CHECK = process.argv.indexOf("--check") !== -1;

function readSiteConfig() {
  var appJs = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");
  var origin = appJs.match(/var SITE_ORIGIN = "([^"]+)"/);
  var updated = appJs.match(/var SITE_UPDATED = "([^"]+)"/);
  if (!origin || !updated) {
    throw new Error("Could not read SITE_ORIGIN / SITE_UPDATED from js/app.js");
  }
  return { origin: origin[1].replace(/\/$/, ""), updated: updated[1] };
}

function loadWindow() {
  var sandbox = { window: {}, console: console };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/claims-data.js"), "utf8"), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/claim-render.js"), "utf8"), sandbox);
  if (!sandbox.window.SOE_RENDER) {
    throw new Error("js/claim-render.js did not attach window.SOE_RENDER");
  }
  return sandbox.window;
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

function claimPage(claim, loaded, site) {
  var render = loaded.SOE_RENDER;
  var title = claim.shortTitle + " — Scamdace Owens Exposed";
  var desc = String(claim.summary || "").replace(/\s+/g, " ").trim().slice(0, 200);
  var url = site.origin + "/c/" + claim.id + ".html";
  var rating = ratingFor(claim.verdict);
  var ld = {
    "@context": "https://schema.org",
    "@type": "ClaimReview",
    url: url,
    datePublished: site.updated,
    dateModified: site.updated,
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

  var claimsById = {};
  loaded.CLAIMS_DATA.forEach(function (c) {
    claimsById[c.id] = c;
  });

  var article = render.renderClaimInner(claim, {
    prefix: "../",
    origin: site.origin,
    siteUpdated: site.updated,
    verdicts: loaded.VERDICT_META || {},
    categories: loaded.CATEGORIES || [],
    getClaim: function (id) {
      return claimsById[id] || null;
    },
  });

  return (
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '  <meta charset="UTF-8" />\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1" />\n' +
    "  <title>" +
    esc(title) +
    "</title>\n" +
    '  <meta name="description" content="' +
    esc(desc) +
    '" />\n' +
    '  <meta name="author" content="MileHigh Patriot (@America1st5280)" />\n' +
    '  <meta name="theme-color" content="#08090c" />\n' +
    '  <link rel="icon" href="../assets/favicon.svg" type="image/svg+xml" />\n' +
    '  <link rel="canonical" href="' +
    esc(url) +
    '" />\n' +
    '  <meta property="og:site_name" content="Scamdace Owens Exposed" />\n' +
    '  <meta property="og:type" content="article" />\n' +
    '  <meta property="og:title" content="' +
    esc(title) +
    '" />\n' +
    '  <meta property="og:description" content="' +
    esc(desc) +
    '" />\n' +
    '  <meta property="og:url" content="' +
    esc(url) +
    '" />\n' +
    '  <meta name="twitter:card" content="summary_large_image" />\n' +
    '  <meta property="og:image" content="' +
    site.origin +
    '/assets/og-image.png" />\n' +
    '  <meta property="og:image:type" content="image/png" />\n' +
    '  <meta property="og:image:width" content="1200" />\n' +
    '  <meta property="og:image:height" content="630" />\n' +
    '  <meta property="og:image:alt" content="' +
    esc(title) +
    '" />\n' +
    '  <meta name="twitter:image" content="' +
    site.origin +
    '/assets/og-image.png" />\n' +
    '  <meta name="twitter:title" content="' +
    esc(title) +
    '" />\n' +
    '  <meta name="twitter:description" content="' +
    esc(desc) +
    '" />\n' +
    '  <link rel="stylesheet" href="../css/styles.css" />\n' +
    '  <script type="application/ld+json">' +
    JSON.stringify(ld) +
    "</script>\n" +
    "</head>\n" +
    '<body data-claim-id="' +
    esc(claim.id) +
    '">\n' +
    '  <a class="skip-link" href="#main">Skip to content</a>\n' +
    '  <div id="site-header-mount">\n' +
    "    " +
    render.renderHeader("../", "claims.html") +
    "\n" +
    "  </div>\n" +
    '  <main id="main">\n' +
    '    <div id="claim-root" data-static-claim="' +
    esc(claim.id) +
    '">\n' +
    article +
    "\n" +
    "    </div>\n" +
    "  </main>\n" +
    '  <div id="site-footer-mount">\n' +
    "    " +
    render.renderFooter("../") +
    "\n" +
    "  </div>\n" +
    '  <script src="../js/claims-data.js"></script>\n' +
    '  <script src="../js/claim-render.js"></script>\n' +
    '  <script src="../js/app.js"></script>\n' +
    '  <script src="../js/claim-detail.js"></script>\n' +
    "</body>\n" +
    "</html>\n"
  );
}

function catalogIndex(site) {
  return (
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '  <meta charset="UTF-8" />\n' +
    '  <meta http-equiv="refresh" content="0; url=../claims.html" />\n' +
    "  <title>Claim catalog — Scamdace Owens Exposed</title>\n" +
    '  <link rel="canonical" href="' +
    site.origin +
    '/claims.html" />\n' +
    "</head>\n" +
    "<body>\n" +
    '  <p><a href="../claims.html">Open the claim catalog</a></p>\n' +
    "</body>\n" +
    "</html>\n"
  );
}

function buildSitemap(claims, site) {
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
      site.origin +
      loc +
      "</loc>\n" +
      "    <lastmod>" +
      site.updated +
      "</lastmod>\n" +
      "    <changefreq>weekly</changefreq>\n" +
      "    <priority>" +
      priority +
      "</priority>\n" +
      "  </url>"
    );
  }

  var parts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  staticPages.forEach(function (p) {
    parts.push(urlEntry(p.loc, p.priority));
  });
  claims.forEach(function (c) {
    parts.push(urlEntry("/c/" + c.id + ".html", c.featured ? "0.8" : "0.65"));
  });
  parts.push("</urlset>\n");
  return parts.join("\n");
}

function expectedFiles(loaded, site) {
  var files = {};
  loaded.CLAIMS_DATA.forEach(function (claim) {
    files["c/" + claim.id + ".html"] = claimPage(claim, loaded, site);
  });
  files["c/index.html"] = catalogIndex(site);
  files["sitemap.xml"] = buildSitemap(loaded.CLAIMS_DATA, site);
  return files;
}

function main() {
  var site = readSiteConfig();
  var loaded = loadWindow();
  var claims = loaded.CLAIMS_DATA || [];
  if (!claims.length) {
    console.error("No claims loaded from js/claims-data.js");
    process.exit(1);
  }

  var expected = expectedFiles(loaded, site);
  var errors = [];

  if (CHECK) {
    Object.keys(expected).forEach(function (rel) {
      var full = path.join(ROOT, rel);
      if (!fs.existsSync(full)) {
        errors.push("missing " + rel);
        return;
      }
      var onDisk = fs.readFileSync(full, "utf8");
      if (onDisk !== expected[rel]) {
        errors.push("stale " + rel);
      }
    });

    var dir = path.join(ROOT, "c");
    fs.readdirSync(dir).forEach(function (name) {
      if (!name.endsWith(".html")) return;
      var rel = "c/" + name;
      if (!expected[rel]) errors.push("extra " + rel);
    });

    claims.forEach(function (c) {
      var html = expected["c/" + c.id + ".html"];
      if (html.indexOf('data-static-claim="' + c.id + '"') === -1) {
        errors.push(c.id + " missing static claim marker");
      }
      if (html.indexOf(esc(c.shortTitle)) === -1) errors.push(c.id + " missing short title");
      if (html.indexOf('id="disproof"') === -1) errors.push(c.id + " missing evidence stack");
      if (html.indexOf("Loading claim") !== -1) errors.push(c.id + " still a loading shell");
    });

    if (errors.length) {
      console.error("Claim pages are out of date (" + errors.length + "):\n- " + errors.slice(0, 20).join("\n- "));
      if (errors.length > 20) console.error("… and " + (errors.length - 20) + " more");
      console.error("\nRun: node scripts/generate-pages.js");
      process.exit(1);
    }
    console.log("OK — " + claims.length + " claim pages and sitemap match the catalog.");
    return;
  }

  var dir = path.join(ROOT, "c");
  fs.mkdirSync(dir, { recursive: true });
  fs.readdirSync(dir).forEach(function (name) {
    if (name.endsWith(".html") && !expected["c/" + name]) {
      fs.unlinkSync(path.join(dir, name));
    }
  });

  Object.keys(expected).forEach(function (rel) {
    fs.writeFileSync(path.join(ROOT, rel), expected[rel]);
  });

  console.log("Wrote " + claims.length + " claim pages to c/ and refreshed sitemap.xml");
}

main();
