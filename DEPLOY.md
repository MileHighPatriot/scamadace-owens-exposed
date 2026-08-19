# Deploy on Vercel from Cursor Origin (no GitHub)

This repo lives on **Cursor Origin**. Vercel can deploy Origin repos directly. GitHub is not part of the loop.

## The loop

1. You create a **Vercel project** from this Origin repo (linking the app is not enough).
2. A **Cursor Automation** runs every Monday, scans for new Owens / Kirk claims, and opens an Origin PR if anything new is sourced.
3. You merge the PR on Origin. Vercel ships production.

| Step | Who | Notes |
|------|-----|--------|
| Host the code | Origin | `origin.cursor.com/git/milehigh-patriot/scamadace-owens-exposed` |
| Preview / production | Vercel | PR → preview. Merge to `main` → production. |
| Monday scan + draft pages | Cursor Automation | Scheduled cron. Must be attached to **this** Origin repo. |
| Publish | You | Merge the draft PR. Do not let a cron auto-merge verdicts. |

**Do you have to pay?** Only if you want Vercel to watch Origin and auto-deploy every PR/merge. That git hook is Pro-only (~$20/month) because every Origin repo is private. Hobby cannot import Origin.

You do **not** need Pro to:
- keep the site on the existing github.io URL
- run the Monday Cursor Automation (that is Cursor usage you already have)
- upload a build to free Vercel Hobby with the CLI (`npx vercel`), with no Origin git connection

The rest of this file is the paid auto-deploy path. Skip it if you do not want a Vercel bill.

---

## 1. Why Vercel looks empty after “linking”

**Connect / Apps / Continue with Origin** only authorizes the Origin team. It does **not** create a project or a deployment. The dashboard stays empty until you import this repo and click **Deploy**.

### Create the project (the step that was missing)

1. Open [vercel.com/new](https://vercel.com/new).
2. Top-left: make sure you are on a **Pro** team, not Hobby / your personal Hobby account.
3. Click **Continue with Origin** (if you already linked Origin, you will see Origin repos instead of GitHub repos).
4. If it asks which Origin team: pick the one that owns `scamadace-owens-exposed`.
5. Click the repo **`scamadace-owens-exposed`**.
6. Fill the form exactly:

   | Field | Value |
   |-------|--------|
   | Framework Preset | **Other** |
   | Root Directory | `./` (leave default) |
   | Build Command | `node scripts/generate-pages.js` |
   | Output Directory | `.` (repo root — not `dist` or `public`) |
   | Install Command | leave empty |

7. Click **Deploy**. Wait until it finishes. You should get a `*.vercel.app` URL.

If **Continue with Origin** is missing, or the repo list is empty: Vercel → team **Settings → Git → Origin**. Reconnect, then go back to [vercel.com/new](https://vercel.com/new).

If Deploy fails with a private-repo / Hobby error: upgrade that Vercel team to **Pro**, then retry.

After this, Origin PR #1 should get a preview. Merge to `main` updates production.

---

## 2. Monday Automation — click every field

Open [cursor.com/automations](https://cursor.com/automations) → **New**.

If you already made one, open it and match this list. Scheduled automations default to **no repository**, which means the agent cannot edit the site or open a PR.

### Fields to set

| Field | What to choose |
|-------|----------------|
| **Name** | `Monday Owens claim scan` |
| **Trigger** | **Scheduled** (not Slack, not GitHub) |
| **Schedule** | Custom cron: `0 14 * * 1` |
| **What that means** | Every Monday at 14:00 UTC (8:00 AM Denver in standard time, 7:00 AM MDT) |
| **Repository** | **Single repository** — `milehigh-patriot/scamadace-owens-exposed` |
| **Branch** | `main` |
| **Tools** | Leave **Pull request creation** on. Leave the rest default. |
| **Instructions / Prompt** | Paste the block in [scripts/WEEKLY-AGENT-PROMPT.md](scripts/WEEKLY-AGENT-PROMPT.md) (also copied below). |
| **Enabled** | Turn it **on**, then **Save**. |

Do **not** pick “No repository.” That is why a cron job can look “set up” and still do nothing useful.

### Prompt to paste (copy the whole box)

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

### How you know it worked

- The Automations list shows **Monday Owens claim scan** as **on**.
- Opening it shows this Origin repo + `main`, not “no repository.”
- Nothing runs until the next Monday 14:00 UTC. That is normal.

### Test it now (do not wait until Monday)

1. Open [cursor.com/agents](https://cursor.com/agents) → **New agent**.
2. Repository: this Origin repo, branch `main`.
3. Paste the same prompt box above.
4. Send it. If it finds nothing new, it should say the catalog is current. If it finds something, it should open a **draft** Origin PR — you still decide whether to merge.

---

## After you edit claims yourself

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit, open an Origin PR, merge. Vercel rebuilds.

## Local preview

```bash
python3 -m http.server 8080
```
