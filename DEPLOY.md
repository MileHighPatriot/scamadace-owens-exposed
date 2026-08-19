# Origin only — Vercel Hobby (no Pro)

**GitHub is not used.** Code and pull requests stay on **Cursor Origin**. Vercel is only the public website.

Hobby cannot *watch* a private Origin repo. So we do **not** click “Continue with Origin.” We upload the built site with a token. Same Origin repo. Free Vercel. You (or an agent with `VERCEL_TOKEN`) republish after you merge.

| Job | Where |
|-----|--------|
| Store / review / merge code | Origin — [scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed) |
| Public site | Vercel Hobby (`*.vercel.app`) |
| How it updates | After an Origin merge, run `scripts/deploy-vercel.sh` |

Do not add a GitHub remote. Do not use `gh`. Do not import this repo on Vercel with GitHub or Origin.

---

## One-time (you)

1. Stay on the **free Hobby** team at [vercel.com/dashboard](https://vercel.com/dashboard).
2. Create a token: [vercel.com/account/tokens](https://vercel.com/account/tokens) → Create → copy it.
3. Paste it into this agent as `VERCEL_TOKEN` (or export it locally).
4. The agent runs `scripts/deploy-vercel.sh` and gives you the `*.vercel.app` URL.

Then set `SITE_ORIGIN` in `js/app.js` to that URL and merge on Origin.

---

## Every Monday (after you merge on Origin)

```bash
export VERCEL_TOKEN=…   # once per machine
./scripts/deploy-vercel.sh
```

That rebuilds the pages and uploads them to the same Hobby project. No GitHub. No Pro.

---

## After you edit claims yourself

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit, open an **Origin** PR, merge, then run the deploy script.

## Local preview

```bash
python3 -m http.server 8080
```
