# Deploy on Vercel from Cursor Origin (no GitHub)

This repo lives on **Cursor Origin**. Vercel can deploy Origin repos directly. GitHub is not part of the loop.

## The loop

1. You connect this Origin repo to Vercel once.
2. A **Cursor Automation** runs every Monday, scans for new Owens / Kirk claims, and opens an Origin PR if anything new is sourced.
3. You merge the PR on Origin. Vercel ships production.

| Step | Who | Notes |
|------|-----|--------|
| Host the code | Origin | `origin.cursor.com/git/milehigh-patriot/scamadace-owens-exposed` |
| Preview / production | Vercel | PR → preview. Merge to `main` → production. |
| Monday scan + draft pages | Cursor Automation | Scheduled cron. Must be attached to **this** Origin repo. |
| Publish | You | Merge the draft PR. Do not let a cron auto-merge verdicts. |

Origin repos are private. Vercel’s Origin integration is in public beta and **does not work on a Vercel Hobby team** — you need a Vercel Pro (or Enterprise) team.

---

## 1. Connect Origin → Vercel (you click this)

**From Origin (easiest):**

1. Open the repo: [cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed)
2. Open the **Apps** tab.
3. Connect **Vercel** and authorize the Cursor Origin team.

**From Vercel:**

1. [vercel.com/new](https://vercel.com/new) → **Continue with Origin**.
2. Pick the Origin team, then `scamadace-owens-exposed`.
3. Framework: **Other**. Build: `node scripts/generate-pages.js`. Output: `.` (root).
4. Deploy.

After that, every Origin PR gets a preview URL. Merge to `main` updates production.

Optional: Vercel → Project → **Domains** for a custom domain. Set `SITE_ORIGIN` (no trailing slash) as a Vercel env var and in `js/app.js`.

---

## 2. Monday automation (you save this once)

I cannot create Cursor Automations from this agent (that API is read-only here). You create it once:

1. Open [cursor.com/automations](https://cursor.com/automations) → **New**.
2. Trigger: **Scheduled** → cron `0 14 * * 1` (Monday 14:00 UTC).
3. Repository: **this Origin repo**, branch `main`. Cron defaults to “no repository” — change that or the agent cannot edit code.
4. Tools: leave **Pull request creation** on.
5. Paste the prompt in [scripts/WEEKLY-AGENT-PROMPT.md](scripts/WEEKLY-AGENT-PROMPT.md).
6. Save and turn it **on**.

Manual test anytime: run the same prompt as a Cloud Agent on this repo.

Local scan only (no publish):

```bash
node scripts/weekly-scan.js
```

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
