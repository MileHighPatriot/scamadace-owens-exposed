# Scamdace Owens Exposed

Public static website cataloguing Candace Owens’s claims about the Charlie Kirk assassination (Sept 10, 2025 – August 12, 2026) and the public evidence that dismantles them — plus a full investigative **archive hub**.

**Author:** MileHigh Patriot ([@America1st5280](https://x.com/America1st5280))

## Core pages

| File | Purpose |
|------|---------|
| `index.html` | Homepage + archive super-index |
| `claims.html` | Searchable claim catalog (filters, random claim) |
| `claim.html?id=…` | Deep-dive: claim → dated primaries → evidence stack |
| `facts.html` | Public record baseline |
| `earnings.html` | Estimated revenue from Kirk-assassination content |
| `submit.html` | Submit claims (date, URL, timestamp, quote required fields) |
| `about.html` | Mission / author |
| `corrections.html` | Corrections + changelog |
| `archive.html` | **Archive hub** (all tools) |
| `feed.xml` | RSS changelog |

## Archive expansion (super-extensive)

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
- `js/app.js` — shared chrome, helpers, archive URL builder

## Deploy

See [DEPLOY.md](./DEPLOY.md) for free GitHub Pages setup.

## Local preview

Open `index.html` or run `Open Scamdace Owens Exposed.command` from the parent project folder.
