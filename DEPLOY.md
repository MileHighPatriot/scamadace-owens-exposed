# Deploy and weekly updates

The site is a static folder. **Vercel** (or GitHub Pages) publishes whatever is on `main`. Nothing on the live site changes until a commit lands.

## What can be automatic — and what cannot

| Step | Automatic? | How |
|------|------------|-----|
| Publish the site | Yes | Connect the GitHub repo to Vercel. Every push to `main` deploys. |
| Hunt new headlines / episodes | Yes | Monday GitHub Action runs `scripts/weekly-scan.js` and opens an issue. |
| Write a sourced claim page + verdict | **No — needs you or a Cursor agent** | A cron job should not invent “False” stacks. Use the weekly issue + Cloud Agent prompt. |
| Go live | Yes, after merge | Merge the PR → Vercel rebuilds in about a minute. |

That is the safe loop: **scan every week → draft PR → you glance at it → merge → Vercel updates.**

---

## Upload to Vercel (about 5 minutes)

1. Put the project on **GitHub** if it is not already (live repo: [MileHighPatriot/scamadace-owens-exposed](https://github.com/MileHighPatriot/scamadace-owens-exposed)).
2. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → Import that repo.
3. Leave the defaults:
   - Framework: Other
   - Build command: `node scripts/generate-pages.js` (from `package.json`)
   - Output directory: `.` (repo root)
4. Deploy. You get a URL like `https://scamadace-owens-exposed.vercel.app`.
5. Optional production URL: Vercel → Project → **Settings → Domains** → add `scamadaceowensexposed.com` (or whatever you bought). Point the domain’s DNS as Vercel shows (usually an A record or CNAME).
6. Optional: Project → **Settings → Environment Variables** → `SITE_ORIGIN` = `https://your-domain.com` (no trailing slash). Generated canonicals / sitemap will use it. Also change `SITE_ORIGIN` in `js/app.js` so share buttons match.

`vercel.json` is already in the repo. You do **not** need to drag-and-drop files in the Vercel dashboard after the first import.

### Local Vercel preview (optional)

```bash
npm i -g vercel
vercel
```

---

## GitHub Pages (still works)

Same as before: **Settings → Pages → Deploy from a branch → `main` / root.**

Live today: https://milehighpatriot.github.io/scamadace-owens-exposed/

You can run **both**. Use Vercel if you want a cleaner custom domain and instant deploys; keep Pages as the backup.

---

## Weekly automatic scan (GitHub)

The workflow [`.github/workflows/weekly-scan.yml`](.github/workflows/weekly-scan.yml) runs **every Monday at 14:00 UTC** (and whenever you click **Run workflow**).

It:

1. Fetches the Candace podcast RSS and Google News for Owens + Kirk / Robinson.
2. Drops anything already in the catalog.
3. Writes `research/weekly-scan.md`.
4. Opens or updates a GitHub issue labeled `weekly-scan`.

**First-time setup on GitHub**

1. Create the label `weekly-scan` (Issues → Labels).
2. Confirm Actions are enabled for the repo.
3. Actions → **Weekly claim scan** → **Run workflow** once to test.

Manual scan on your machine:

```bash
node scripts/weekly-scan.js
```

Then open `research/weekly-scan.md`.

---

## Weekly automatic *pages* (Cursor Cloud Agent)

Vercel will not write claim essays. A Cursor Cloud Agent will.

1. [cursor.com/agents](https://cursor.com/agents) → new cloud agent on this repo.
2. Paste [scripts/WEEKLY-AGENT-PROMPT.md](scripts/WEEKLY-AGENT-PROMPT.md).
3. To make that hands-off: Cursor → **Automations** → weekly schedule → same prompt.

The agent should open a **draft PR**. You merge when the primaries look right. Vercel publishes the merge.

---

## After you edit claims yourself

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit and push `main` (or merge the PR). Vercel and/or Pages rebuild.

---

## Local preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.
