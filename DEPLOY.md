# Origin for work, GitHub Pages for the public link (for now)

**Cursor Origin** is where we edit, review, and merge. **GitHub Pages** is only the free public website until Origin can host pages itself.

| Job | Where |
|-----|--------|
| Store / review / merge | Origin — [scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed) |
| Public site | [milehighpatriot.github.io/scamadace-owens-exposed](https://milehighpatriot.github.io/scamadace-owens-exposed/) |
| How it updates | Push / merge the same commits to GitHub `main`. Pages serves that branch. |

Do not use GitHub Actions. Do not make GitHub the place you review PRs. Origin stays the source of truth.

---

## One-time GitHub Pages check

On GitHub: **Settings → Pages**

- Source: **Deploy from a branch**
- Branch: `main` / `/` (root)
- The repo already has `.nojekyll` so GitHub will not break the static files

---

## Monday (or any update)

1. Work on **Origin** (this repo, draft PR, you merge).
2. Push the same `main` to GitHub (`github` remote).
3. Wait a minute. The github.io URL updates.

When Cursor adds public pages on Origin, drop the GitHub copy and keep Origin only.

---

## After you edit claims yourself

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit and merge on Origin, then update GitHub `main` so Pages republishes.

## Local preview

```bash
python3 -m http.server 8080
```
