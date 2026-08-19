# Weekly Cloud Agent prompt

Paste this into a new Cursor Cloud Agent every Monday (or after the GitHub Action opens the scan issue).

```
Update Scamdace Owens Exposed with new Candace Owens claims about the Charlie Kirk assassination since the catalog SITE_UPDATED date in js/app.js.

1. Run `node scripts/weekly-scan.js` and read research/weekly-scan.md.
2. Check her latest show / X posts (@RealCandaceO) for Kirk, Robinson, TPUSA, Losee, mic, Israel, Erika.
3. Add only claims she herself stated, with date, URL, timestamp, and a short quote.
4. If she restated an old claim, extend that entry — do not duplicate it.
5. Write evidence stacks in the existing site voice. No insults; no unsourced verdicts.
6. Run `node scripts/generate-pages.js` and `node scripts/generate-pages.js --check`.
7. Commit, push, and open or update a PR.
```
