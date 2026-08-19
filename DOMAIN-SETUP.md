# Custom domain (Vercel + Origin only)

**Repo:** [cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed](https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed)

Do not attach a domain in GitHub Pages. After Vercel is imported from this Origin repo, add the domain on the Vercel project.

## Attach in Vercel

1. Vercel project (the one connected to Origin) → **Settings → Domains**.
2. Add `scamadaceowensexposed.com` and `www.scamadaceowensexposed.com`.
3. Use the DNS records Vercel shows. Do not use GitHub Pages IPs.

## Canonical URL

Set `SITE_ORIGIN` (no trailing slash) as a Vercel env var and in `js/app.js`, then regenerate:

```bash
node scripts/generate-pages.js
```

Commit and merge on Origin. Vercel republishes.
