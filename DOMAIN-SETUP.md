# Custom domain later

**Public site now:**  
https://milehighpatriot.github.io/scamadace-owens-exposed/

**Code:**  
https://cursor.com/codebase/milehigh-patriot/scamadace-owens-exposed

When you buy a domain, point it at GitHub Pages until Origin has its own hosting:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | MileHighPatriot.github.io |

Then GitHub → **Settings → Pages → Custom domain**. Keep `SITE_ORIGIN` in `js/app.js` in sync and regenerate pages on Origin.
