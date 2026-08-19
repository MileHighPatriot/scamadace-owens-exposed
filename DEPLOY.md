# Two lockers, one public link

Work can live in **both** Cursor Origin and GitHub. The public website is GitHub Pages until Origin can host pages.

## Do both lockers get the same files?

Yes. Use Origin’s **Sync from GitHub** (official, built-in):

- GitHub holds the copy Pages publishes
- Origin is a live mirror
- Pull requests show on both
- A push to Origin is forwarded to GitHub, so the public link updates

That is the switch you want later: when Origin gets pages, turn Pages off and keep Origin.

Do **not** keep two unrelated copies and edit them by hand. That is how they drift.

### Turn sync on (once per site)

1. Open [cursor.com/codebase](https://cursor.com/codebase)
2. **Sync from GitHub**
3. Pick the GitHub repo for that site
4. Confirm

If a site is already Origin-only, put it on GitHub first (same name), turn Pages on, then Sync from GitHub.

### Pages (the public link)

GitHub → **Settings → Pages** → Deploy from a branch → `main` → folder `/`

Link will be:

`https://milehighpatriot.github.io/<repo-name>/`

---

## This site (Owens)

| | |
|--|--|
| Origin | [scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed) |
| GitHub | [MileHighPatriot/scamadace-owens-exposed](https://github.com/MileHighPatriot/scamadace-owens-exposed) |
| Public | [milehighpatriot.github.io/scamadace-owens-exposed](https://milehighpatriot.github.io/scamadace-owens-exposed/) |

GitHub `main` is still August 13. New claims are on Origin [PR #1](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed/pull/1) until that branch is pushed to GitHub.

## Other sites

Name them (Origin or GitHub repo names). Each one gets the same three things: GitHub repo, Pages on, Sync from GitHub.

## After you edit

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit and merge. With sync on, one push updates both lockers and then Pages.
