#!/usr/bin/env node
/**
 * Weekly candidate scan — finds new Owens / Kirk items after SITE_UPDATED.
 * Does not write claim pages. Outputs research/weekly-scan.{json,md}
 * and a Cloud Agent prompt you can paste into Cursor.
 *
 *   node scripts/weekly-scan.js
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");
var https = require("https");
var http = require("http");

var ROOT = path.join(__dirname, "..");
var OUT_DIR = path.join(ROOT, "research");
var PODCAST_ITUNES_ID = process.env.CANDACE_ITUNES_ID || "1750591415";
var MEGAPHONE_FALLBACK = "https://feeds.megaphone.fm/BVDWV5810187551";
var YT_CHANNEL = process.env.YOUTUBE_CHANNEL_ID || "";

var KEYWORDS = [
  "kirk",
  "robinson",
  "tpusa",
  "turning point",
  "losee",
  "microphone",
  "erika",
  "israel",
  "mossad",
  "patsy",
  "assassination",
  "uvu",
  "utah valley",
  "netanyahu",
  "harpole",
  "twiggs",
];

function loadCatalog() {
  var sandbox = { window: {}, console: console };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/claims-data.js"), "utf8"), sandbox);
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, "js/archive-data.js"), "utf8"), sandbox);
  var appJs = fs.readFileSync(path.join(ROOT, "js/app.js"), "utf8");
  var updated = (appJs.match(/var SITE_UPDATED = "([^"]+)"/) || [])[1] || "2026-08-01";
  return {
    updated: updated,
    claims: sandbox.window.CLAIMS_DATA || [],
    episodes: (sandbox.window.ARCHIVE_DATA && sandbox.window.ARCHIVE_DATA.episodes) || [],
    quotes: (sandbox.window.ARCHIVE_DATA && sandbox.window.ARCHIVE_DATA.quotes) || [],
  };
}

function fetchText(url, redirects) {
  redirects = redirects || 0;
  return new Promise(function (resolve, reject) {
    if (redirects > 5) return reject(new Error("too many redirects: " + url));
    var lib = url.indexOf("https:") === 0 ? https : http;
    var req = lib.get(
      url,
      {
        headers: {
          "User-Agent": "ScamdaceOwensExposedWeeklyScan/1.0 (research bot; +https://milehighpatriot.github.io/scamadace-owens-exposed/)",
          Accept: "application/rss+xml, application/xml, application/json, text/xml, */*",
        },
      },
      function (res) {
        var loc = res.headers.location;
        if (res.statusCode >= 300 && res.statusCode < 400 && loc) {
          res.resume();
          var next = loc;
          if (next.indexOf("http") !== 0) {
            var u = new URL(url);
            next = u.origin + loc;
          }
          return fetchText(next, redirects + 1).then(resolve, reject);
        }
        var chunks = [];
        res.on("data", function (c) {
          chunks.push(c);
        });
        res.on("end", function () {
          var body = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode >= 400) {
            return reject(new Error(url + " → " + res.statusCode));
          }
          resolve(body);
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(20000, function () {
      req.destroy(new Error("timeout " + url));
    });
  });
}

function decodeXml(s) {
  return String(s || "")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tag(block, name) {
  var re = new RegExp("<" + name + "[^>]*>([\\s\\S]*?)</" + name + ">", "i");
  var m = block.match(re);
  return m ? decodeXml(m[1]) : "";
}

function parseRss(xml, source) {
  var items = [];
  var chunks = xml.split(/<item[\s>]/i).slice(1);
  if (!chunks.length) chunks = xml.split(/<entry[\s>]/i).slice(1);
  chunks.forEach(function (raw) {
    var title = tag(raw, "title");
    var link = tag(raw, "link") || "";
    if (!link) {
      var href = raw.match(/<link[^>]+href="([^"]+)"/i);
      if (href) link = href[1];
    }
    var date =
      tag(raw, "pubDate") ||
      tag(raw, "published") ||
      tag(raw, "updated") ||
      tag(raw, "dc:date");
    var summary = tag(raw, "description") || tag(raw, "summary") || tag(raw, "content");
    if (!title && !link) return;
    items.push({
      source: source,
      title: title,
      url: link,
      date: date,
      summary: summary.slice(0, 400),
    });
  });
  return items;
}

function parseDate(s) {
  if (!s) return null;
  var d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
}

function isoDay(d) {
  return d.toISOString().slice(0, 10);
}

function hay(item) {
  return ((item.title || "") + " " + (item.summary || "")).toLowerCase();
}

function isKirkish(item) {
  var h = hay(item);
  return KEYWORDS.some(function (k) {
    return h.indexOf(k) !== -1;
  });
}

function alreadyCatalogued(item, catalog) {
  var h = hay(item);
  var url = (item.url || "").toLowerCase();
  var hit = catalog.claims.some(function (c) {
    var blob = ((c.title || "") + " " + (c.shortTitle || "") + " " + (c.summary || "")).toLowerCase();
    if (item.title && blob.indexOf(item.title.toLowerCase().slice(0, 40)) !== -1) return true;
    return (c.primarySources || []).some(function (s) {
      return s.url && url && s.url.toLowerCase() === url;
    });
  });
  if (hit) return true;
  return catalog.episodes.some(function (e) {
    if (e.url && url && e.url.toLowerCase() === url) return true;
    return e.title && h.indexOf(String(e.title).toLowerCase().slice(0, 40)) !== -1;
  });
}

async function itunesFeed() {
  var body = await fetchText("https://itunes.apple.com/lookup?id=" + PODCAST_ITUNES_ID + "&entity=podcast");
  var json = JSON.parse(body);
  var feed = json.results && json.results[0] && json.results[0].feedUrl;
  return feed || MEGAPHONE_FALLBACK;
}

async function gather() {
  var feeds = [
    {
      name: "google-news-kirk",
      url:
        "https://news.google.com/rss/search?q=%22Candace+Owens%22+%22Charlie+Kirk%22+when:7d&hl=en-US&gl=US&ceid=US:en",
    },
    {
      name: "google-news-robinson",
      url:
        "https://news.google.com/rss/search?q=%22Candace+Owens%22+%22Tyler+Robinson%22+when:7d&hl=en-US&gl=US&ceid=US:en",
    },
  ];
  try {
    var pod = await itunesFeed();
    feeds.push({ name: "candace-podcast", url: pod });
  } catch (e) {
    feeds.push({ name: "candace-podcast-fallback", url: MEGAPHONE_FALLBACK });
  }
  if (YT_CHANNEL) {
    feeds.push({
      name: "youtube",
      url: "https://www.youtube.com/feeds/videos.xml?channel_id=" + encodeURIComponent(YT_CHANNEL),
    });
  }

  var errors = [];
  var items = [];
  for (var i = 0; i < feeds.length; i++) {
    var f = feeds[i];
    try {
      var xml = await fetchText(f.url);
      items = items.concat(parseRss(xml, f.name));
    } catch (err) {
      errors.push({ feed: f.name, error: String(err.message || err) });
    }
  }
  return { items: items, errors: errors, feeds: feeds.map(function (f) { return f.name; }) };
}

function agentPrompt(catalog, newish, restated) {
  return (
    "Update Scamdace Owens Exposed with anything new since catalog baseline " +
    catalog.updated +
    ".\n\n" +
    "Rules:\n" +
    "- Only add claims Candace Owens herself stated (X post, show, or debate), with date, URL, timestamp, and a short quote.\n" +
    "- Skip items already in js/claims-data.js. Existing claim IDs: " +
    catalog.claims
      .map(function (c) {
        return c.id;
      })
      .join(", ") +
    ".\n" +
    "- If she only restated an old claim, extend that claim’s dateRange / primarySources instead of inventing a new id.\n" +
    "- Write evidence stacks in the existing voice. Run `node scripts/generate-pages.js` and `--check`.\n" +
    "- Do not auto-publish verdicts you cannot source.\n\n" +
    "New-looking headlines from this week’s scan:\n" +
    (newish.length
      ? newish
          .slice(0, 20)
          .map(function (it, n) {
            return n + 1 + ". " + it.title + " — " + it.url;
          })
          .join("\n")
      : "(none — still check her latest show and @RealCandaceO)") +
    "\n\nPossible restatements:\n" +
    (restated.length
      ? restated
          .slice(0, 10)
          .map(function (it) {
            return "- " + it.title;
          })
          .join("\n")
      : "(none flagged)")
  );
}

async function main() {
  var catalog = loadCatalog();
  var cutoff = new Date(catalog.updated + "T00:00:00Z");
  if (isNaN(cutoff.getTime())) cutoff = new Date("2026-08-01T00:00:00Z");
  var weekAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
  var since = cutoff < weekAgo ? cutoff : weekAgo;

  var gathered = await gather();
  function titleKey(t) {
    return String(t || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .slice(0, 8)
      .join(" ");
  }

  var seen = {};
  var fresh = [];
  gathered.items.forEach(function (it) {
    var key = titleKey(it.title) || (it.url || "").toLowerCase();
    if (!key || seen[key]) return;
    seen[key] = true;
    var d = parseDate(it.date);
    if (d && d < since) return;
    if (!isKirkish(it) && it.source.indexOf("google-news") === -1) return;
    fresh.push(it);
  });

  var newish = [];
  var restated = [];
  fresh.forEach(function (it) {
    if (alreadyCatalogued(it, catalog)) restated.push(it);
    else newish.push(it);
  });

  var report = {
    generatedAt: new Date().toISOString(),
    catalogUpdated: catalog.updated,
    claimCount: catalog.claims.length,
    feeds: gathered.feeds,
    errors: gathered.errors,
    newCandidates: newish,
    possibleRestatements: restated,
    agentPrompt: agentPrompt(catalog, newish, restated),
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, "weekly-scan.json"), JSON.stringify(report, null, 2));

  var md = [];
  md.push("# Weekly claim scan");
  md.push("");
  md.push("Generated: " + report.generatedAt);
  md.push("Catalog baseline: **" + catalog.updated + "** · " + catalog.claims.length + " claims");
  md.push("");
  md.push("This scan finds *candidates*. It does not write verdicts or publish pages.");
  md.push("Next step: paste `research/weekly-scan.json` → `agentPrompt` into a Cursor Cloud Agent, or edit `js/claims-data.js` yourself.");
  md.push("");
  var shown = newish.slice(0, 25);
  md.push("## New-looking items (" + newish.length + (newish.length > shown.length ? ", showing 25" : "") + ")");
  md.push("");
  if (!newish.length) md.push("_None this window. Still check her latest episode and @RealCandaceO._");
  shown.forEach(function (it) {
    md.push("- **" + it.title + "**  ");
    md.push("  " + (it.date || "no date") + " · " + it.source + " · " + it.url);
  });
  md.push("");
  md.push("## Possible restatements of catalogued claims (" + restated.length + ")");
  md.push("");
  restated.slice(0, 15).forEach(function (it) {
    md.push("- " + it.title + " — " + it.url);
  });
  if (gathered.errors.length) {
    md.push("");
    md.push("## Feed errors");
    gathered.errors.forEach(function (e) {
      md.push("- " + e.feed + ": " + e.error);
    });
  }
  md.push("");
  md.push("## Cloud Agent prompt");
  md.push("");
  md.push("```");
  md.push(report.agentPrompt);
  md.push("```");
  md.push("");
  fs.writeFileSync(path.join(OUT_DIR, "weekly-scan.md"), md.join("\n"));

  console.log("Wrote research/weekly-scan.md (" + newish.length + " new-looking, " + restated.length + " restatements)");
  if (gathered.errors.length) {
    console.log("Feed errors: " + gathered.errors.length);
    gathered.errors.forEach(function (e) {
      console.log("  - " + e.feed + ": " + e.error);
    });
  }
}

main().catch(function (err) {
  console.error(err);
  process.exit(1);
});
