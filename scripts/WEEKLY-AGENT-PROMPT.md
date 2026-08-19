# Monday automation prompt (Cursor Origin — no GitHub)

Use this as the instructions for the scheduled Cloud Automation.
Attach it to the Origin repo `milehigh-patriot/scamadace-owens-exposed`, branch `main`.
Cron: `0 14 * * 1` (every Monday 14:00 UTC).

```
You are updating Scamdace Owens Exposed on Cursor Origin (not GitHub).

Catalog new Candace Owens claims about the Charlie Kirk assassination since SITE_UPDATED in js/app.js.

1. Run `node scripts/weekly-scan.js` and read research/weekly-scan.md.
2. Check her latest show and @RealCandaceO for Kirk, Robinson, TPUSA, Losee, mic, Israel, Erika.
3. Add only claims she herself stated, with date, URL, timestamp, and a short quote.
4. If she restated an old claim, extend that entry — do not create a duplicate id.
5. Write evidence stacks in the existing site voice. No insults. No unsourced verdicts.
6. Run `node scripts/generate-pages.js` and `node scripts/generate-pages.js --check`.
7. If nothing new is sourced, do not open a PR. Leave a short note that the catalog is current.
8. If you added or extended claims, commit, push an Origin branch, and open a draft PR against main.
9. Do not merge. Do not use GitHub Actions or gh.
```
