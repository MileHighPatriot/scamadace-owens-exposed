#!/usr/bin/env node
/**
 * Stamp firstStated on every claim from dateRange (first date in the string)
 * and rewrite js/claims-data.js in chronological order.
 */
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.join(__dirname, "..");
var FILE = path.join(ROOT, "js/claims-data.js");

var MONTHS = {
  january: 1,
  jan: 1,
  february: 2,
  feb: 2,
  march: 3,
  mar: 3,
  april: 4,
  apr: 4,
  may: 5,
  june: 6,
  jun: 6,
  july: 7,
  jul: 7,
  august: 8,
  aug: 8,
  september: 9,
  sept: 9,
  sep: 9,
  october: 10,
  oct: 10,
  november: 11,
  nov: 11,
  december: 12,
  dec: 12,
};
var SEASONS = { spring: 3, summer: 6, fall: 9, autumn: 9, winter: 12 };

function pad(n) {
  return String(n).padStart(2, "0");
}
function iso(y, m, d) {
  return y + "-" + pad(m) + "-" + pad(d);
}

function extractDates(text) {
  var s = String(text || "");
  var month =
    "(January|February|March|April|May|June|July|August|September|Sept|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec)";
  var hits = [];

  function add(index, end, value, precision, raw) {
    hits.push({ index: index, end: end, iso: value, precision: precision, raw: raw });
  }

  var reDay = new RegExp(
    month + "\\s+(\\d{1,2})(?:\\s*[–—-]\\s*(\\d{1,2}))?,?\\s+(\\d{4})",
    "gi"
  );
  var m;
  while ((m = reDay.exec(s))) {
    var day = Number(m[2]);
    if (m[3]) day = Math.min(day, Number(m[3]));
    add(m.index, m.index + m[0].length, iso(m[4], MONTHS[m[1].toLowerCase()], day), "day", m[0]);
  }

  var reMonthRange = new RegExp(month + "\\s*[–—-]\\s*" + month + "\\s+(\\d{4})", "gi");
  while ((m = reMonthRange.exec(s))) {
    add(
      m.index,
      m.index + m[0].length,
      iso(m[3], MONTHS[m[1].toLowerCase()], 1),
      "month",
      m[0]
    );
  }

  var reMonth = new RegExp(month + "\\s+(\\d{4})", "gi");
  while ((m = reMonth.exec(s))) {
    add(
      m.index,
      m.index + m[0].length,
      iso(m[2], MONTHS[m[1].toLowerCase()], 1),
      "month",
      m[0]
    );
  }

  var reSeason = /\b(Spring|Summer|Fall|Autumn|Winter)\s+(\d{4})/gi;
  while ((m = reSeason.exec(s))) {
    add(
      m.index,
      m.index + m[0].length,
      iso(m[2], SEASONS[m[1].toLowerCase()], 1),
      "month",
      m[0]
    );
  }

  var reYear = /\b(2025|2026)\b/g;
  while ((m = reYear.exec(s))) {
    var yearIso = m[1] === "2025" ? "2025-09-10" : "2026-01-01";
    add(m.index, m.index + m[0].length, yearIso, "year", m[0]);
  }

  hits.sort(function (a, b) {
    return a.index - b.index || a.end - b.end;
  });

  var kept = [];
  hits.forEach(function (h) {
    var covered = kept.some(function (k) {
      return h.index >= k.index && h.end <= k.end && h !== k;
    });
    if (!covered) kept.push(h);
  });
  return kept;
}

function firstStated(claim) {
  var hits = extractDates(claim.dateRange).filter(function (h) {
    return h.iso >= "2025-09-01";
  });
  if (!hits.length) {
    hits = extractDates(claim.dateRange);
  }
  var hit = hits[0];
  if (!hit) {
    return { firstStated: "2025-09-10", firstStatedPrecision: "year" };
  }
  return { firstStated: hit.iso, firstStatedPrecision: hit.precision };
}

function withField(claim, extra) {
  var out = {};
  Object.keys(claim).forEach(function (k) {
    out[k] = claim[k];
    if (k === "dateRange") {
      out.firstStated = extra.firstStated;
      out.firstStatedPrecision = extra.firstStatedPrecision;
    }
  });
  return out;
}

var src = fs.readFileSync(FILE, "utf8");
var sandbox = { window: {} };
vm.runInNewContext(src, sandbox);
var claims = (sandbox.window.CLAIMS_DATA || []).map(function (c) {
  return withField(c, firstStated(c));
});

function titleKey(s) {
  return String(s || "")
    .replace(/^[“”"'\s]+/, "")
    .toLowerCase();
}

claims.sort(function (a, b) {
  if (a.firstStated !== b.firstStated) return a.firstStated.localeCompare(b.firstStated);
  var pa = { year: 0, month: 1, day: 2 }[a.firstStatedPrecision] || 0;
  var pb = { year: 0, month: 1, day: 2 }[b.firstStatedPrecision] || 0;
  if (pa !== pb) return pa - pb;
  return titleKey(a.shortTitle).localeCompare(titleKey(b.shortTitle));
});

var catStart = src.indexOf("\nwindow.CATEGORIES");
if (catStart < 0) throw new Error("Could not find window.CATEGORIES");
var rest = src.slice(catStart + 1);

var header =
  "/**\n" +
  " * Scamdace Owens Exposed — claim catalog\n" +
  " * Author: MileHigh Patriot (@America1st5280)\n" +
  " * Updated: August 22, 2026 — ordered by first-stated date\n" +
  " */\n";

var out =
  header +
  "window.CLAIMS_DATA = " +
  JSON.stringify(claims, null, 2) +
  ";\n\n" +
  rest;

fs.writeFileSync(FILE, out);
claims.forEach(function (c, i) {
  console.log(
    String(i + 1).padStart(2, " ") +
      "  " +
      c.firstStated +
      "  " +
      (c.firstStatedPrecision || "").padEnd(5) +
      "  " +
      c.id
  );
});
console.log("Wrote", claims.length, "claims to", FILE);
