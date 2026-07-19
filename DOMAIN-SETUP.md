# Connect ScamdaceOwensExposed.com

The site is already live on GitHub Pages. To use **scamadaceowensexposed.com**:

## 1. Buy the domain
Buy `scamadaceowensexposed.com` at any registrar (Cloudflare, Porkbun, Namecheap, Google Domains/Squarespace, etc.).

## 2. Add DNS records (apex domain)
At your registrar DNS settings, add these **A records** for `@` (root):

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Optional **www**:
| Type | Name | Value |
|------|------|-------|
| CNAME | www | MileHighPatriot.github.io |

## 3. GitHub custom domain
Repo → Settings → Pages → Custom domain → `scamadaceowensexposed.com` → Save  
Check **Enforce HTTPS** after DNS propagates (can take a few minutes to 48 hours).

The repo already includes a `CNAME` file for this domain.
