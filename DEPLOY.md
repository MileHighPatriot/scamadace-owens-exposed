# Two lockers, one public link

This site is a **native Origin repo**, not a GitHub mirror. That is why it behaves differently from the other MileHigh Patriot sites.

| | |
|--|--|
| Work repo (use this) | Origin [scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed) |
| Public GitHub | [MileHighPatriot/scamadace-owens-exposed](https://github.com/MileHighPatriot/scamadace-owens-exposed) |
| Live site | [milehighpatriot.github.io/scamadace-owens-exposed](https://milehighpatriot.github.io/scamadace-owens-exposed/) |

Do **not** work in Origin `milehighpatriot-scamadace-owens-exposed`. That is an inbound GitHub copy (GitHub → Origin). Pushes there do not replace this working repo.

## Why GitHub Pages lagged

Cursor Cloud clones Origin only. It has no GitHub login. `git push origin` from a Cursor cloud agent updates Origin and **does not** update github.io.

Other sites “just work” because they are GitHub-synced Origin mirrors: a push on the synced repo is forwarded to GitHub. This working repo was created on Origin first, so that pass-through never applies here.

## How to publish

Always merge to **`main`**. Then push both lockers:

```bash
git checkout main
git pull origin main
git push origin main
```

On this machine, `origin` fetches Origin and **pushes to Origin + GitHub** in one command. That rebuilds GitHub Pages.

If you are in Cursor Cloud (no GitHub login): merge to Origin `main`, then say **update** in Grok Build. Do not ask for a `GITHUB_TOKEN`.

Pages settings (already on): GitHub → Settings → Pages → deploy from `main` → folder `/`.

## After you edit the catalog

```bash
node scripts/generate-pages.js
node scripts/generate-pages.js --check
```

Commit, merge to `main`, push both lockers.

## Default branch

Origin must use **`main`**. If Cursor opens `cursor/owens-aug14-debate-claims-92a6`, switch to `main`. That old default was a Cursor agent branch; it is no longer the live line.
