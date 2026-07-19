# Deploy Scamdace Owens Exposed on GitHub Pages (free)

## Option A — New repo (recommended)

1. Create a new GitHub repository, e.g. `scamdace-owens-exposed`.
2. Upload **everything inside** this folder (`index.html`, `css/`, `js/`, etc.) to the repo root.
3. On GitHub: **Settings → Pages → Build and deployment**.
4. Source: **Deploy from a branch**.
5. Branch: `main` (or `master`), folder: `/ (root)`.
6. Save. After a minute, your site will be at:

   `https://<your-username>.github.io/scamdace-owens-exposed/`

7. Optional custom domain later: something like `scamdaceowensexposed.com` via Pages → Custom domain + DNS.

## Option B — User/organization site

If you want `https://<username>.github.io` as the root:

1. Create a repo named exactly `<username>.github.io`.
2. Put these files at the root of that repo.
3. Enable Pages from `main` / root.

## Local preview

```bash
cd scamdace-owens-exposed
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## After deploy checklist

- Replace the placeholder in the Combat Toolkit master reply with your real GitHub Pages URL.
- Share `claims.html` and a flagship claim (e.g. `claim.html?id=exploding-microphone`) on X.
- Pin an @America1st5280 post linking the homepage.

## Updating claims

Edit `js/claims-data.js`, commit, push. Pages rebuilds automatically.
