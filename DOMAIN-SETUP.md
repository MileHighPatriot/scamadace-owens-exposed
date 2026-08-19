# Connect a custom domain (Vercel + Origin)

**Repo (Cursor Origin):**  
https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed

GitHub Pages is not part of this setup. After you connect Origin to Vercel, attach the domain on the Vercel project.

Until that is live, the old github.io URL can stay up so the site does not go dark. Flip DNS only after the Vercel deployment responds on the custom hostname.

## Buy the domain

Purchase **scamadaceowensexposed.com** (Cloudflare, Porkbun, Namecheap, etc.).

## Attach the domain in Vercel

1. Open the Vercel project connected to this Origin repo.
2. **Settings → Domains** → add `scamadaceowensexposed.com` and `www.scamadaceowensexposed.com`.
3. Vercel will show the exact DNS records (usually an A record and a CNAME). Copy those — do not use GitHub Pages IPs.

## Point DNS at Vercel

Use the records Vercel displays for the project. Typical pattern:

| Type | Name | Value |
|------|------|-------|
| A | @ | (Vercel apex IP shown in the dashboard) |
| CNAME | www | `cname.vercel-dns.com` |

Wait for DNS (minutes to 48h). Vercel issues HTTPS automatically.

## Canonical URL

Set `SITE_ORIGIN` (no trailing slash) as a Vercel environment variable and in `js/app.js`, then regenerate pages:

```bash
node scripts/generate-pages.js
```
