# Scamdace Owens Exposed

Public static website cataloguing Candace Owens’s claims about the Charlie Kirk assassination (Sept 10, 2025 – August 19, 2026) and the public evidence that dismantles them — plus a full investigative **archive hub**.

**Author:** MileHigh Patriot ([@America1st5280](https://x.com/America1st5280))

**Live:** [milehighpatriot.github.io/scamadace-owens-exposed](https://milehighpatriot.github.io/scamadace-owens-exposed/)

## Core pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage: public record, this week’s claims, catalog CTA |
| `claims.html` | Searchable claim catalog (filters, random claim) |
| `c/<id>.html` | Deep-dive permalink: claim → dated primaries → evidence stack |
| `facts.html` | Public record baseline + evidence tiers |
| `earnings.html` | Estimated revenue from Kirk-assassination content |
| `submit.html` | Submit claims (date, URL, timestamp, quote required fields) |
| `about.html` | Mission / author |
| `corrections.html` | Corrections + changelog |
| `archive.html` | **Archive hub** (timeline, people, vault, and the rest) |
| `feed.xml` | RSS changelog |

Old links of the form `claim.html?id=exploding-microphone` still redirect to `c/exploding-microphone.html`.

## Archive expansion

| File | Purpose |
|------|---------|
| `timeline.html` | Master chronology |
| `episodes.html` | Episode / content index |
| `people.html` | Named-person dossiers |
| `methods.html` | Rhetorical playbook |
| `pivots.html` | Mechanism rotation log |
| `contradictions.html` | Mutually exclusive claim pairs |
| `quotes.html` | Quote bank with timestamps |
| `vault.html` | Primary sources + archive.today |
| `media.html` | Media / timestamp ledger |
| `compare.html` | Official case vs Owens portfolio |
| `hearing.html` | July 2026 hearing decoder |
| `legal.html` | Legal tracker |
| `exhibits.html` | Exhibit board |
| `burdens.html` | Burden-of-proof checklists |
| `falsify.html` | What would falsify what |
| `glossary.html` | Terms |
| `faq.html` | FAQ |
| `journalists.html` | Press one-pager |
| `family.html` | Guide for families/friends |
| `graph.html` | Claim relationship graph |
| `map.html` | UVU place orientation |
| `search.html` | Site-wide search |
| `report.html` | Print / PDF mega-report |
| `press-kit.html` | Boilerplate & assets |
| `research.html` | Volunteer intake guide |
| `grief-economy.html` | Incentive / product analysis |

## Data

- `js/claims-data.js` — 60+ claim objects (primary sources with date/timestamp/quote/archiveUrl + confidence)
- `js/archive-data.js` — timeline, people, methods, quotes, legal, hearing, glossary, etc.
- `js/archive.js` — page renderers for archive sections
- `js/app.js` — shared chrome, helpers, permalink builder
- `js/claim-render.js` — claim-page HTML used by both the generator and the browser

After editing the catalog, regenerate permalinks and the sitemap:

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

`--check` fails if `c/<id>.html`, the archive tool pages, or `sitemap.xml` do not match the data files. Generated claim and archive pages include their full content in the HTML, so they work without JavaScript.

## Deploy

See [DEPLOY.md](./DEPLOY.md) for free GitHub Pages setup.

## Local preview

```bash
python3 -m http.server 8080
```

Or open `index.html` / run `Open Scamdace Owens Exposed.command` from the parent project folder.
