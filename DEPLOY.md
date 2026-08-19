# Origin only — Vercel is just the public website

**GitHub is not used.** Code, pull requests, Monday updates, and the Vercel connection all go through **Cursor Origin**.

| Job | Where |
|-----|--------|
| Store the code | Origin — `origin.cursor.com/git/milehigh-patriot/scamadace-owens-exposed` |
| Browse / review / merge | [cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed) |
| Public site people visit | Vercel (`*.vercel.app`), **imported from this Origin repo** |
| Monday new-claims draft | Cursor Automation on **this Origin repo**, branch `main` |

There is no Origin “pages” URL. Origin holds the repo. Vercel holds the live site. Vercel watches **Origin**, not GitHub.

Origin repos are private, so Vercel’s “Continue with Origin” import only works on a **Vercel Pro** team (~$20/month). Hobby will show an empty project list.

---

## One-time: create the Vercel project from Origin

Linking the Vercel *app* is not enough. You have to import this repo and click **Deploy**.

1. Open [vercel.com/new](https://vercel.com/new).
2. Top-left team switcher: a **Pro** team (not Hobby).
3. **Continue with Origin** — never “Continue with GitHub.”
4. Pick `scamadace-owens-exposed`.
5. Settings are already in `vercel.json`. Confirm:

   | Field | Value |
   |-------|--------|
   | Framework | Other |
   | Build Command | `node scripts/generate-pages.js` |
   | Output Directory | `.` |
   | Install Command | empty |

6. **Deploy.** Copy the `*.vercel.app` URL. That is the public link.

If Origin repos do not appear: Vercel team **Settings → Git → Origin** → reconnect, then [vercel.com/new](https://vercel.com/new) again.

After this:

- Origin PRs get a Vercel preview.
- Merge to `main` on Origin → production updates.
- Do not add a GitHub remote. Do not use `gh`. Do not turn GitHub Pages back on.

Paste the `*.vercel.app` URL back to the agent so `SITE_ORIGIN` in `js/app.js` can be switched off github.io.

---

## Monday (manual is fine)

You do **not** have to run a Vercel command. After the project is connected:

1. New claims land in an Origin draft PR (you or the Automation).
2. You review and **merge on Origin**.
3. Vercel republishes.

Optional Automation fields and the prompt to paste: [scripts/WEEKLY-AGENT-PROMPT.md](scripts/WEEKLY-AGENT-PROMPT.md).

---

## After you edit claims yourself

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit, open an **Origin** PR, merge. Vercel rebuilds.

## Local preview

```bash
python3 -m http.server 8080
```
