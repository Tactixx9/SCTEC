Deployment notes — SCTEC Enterprises

1) Hosting & HTTPS
- Choose a static host that supports serverless functions (if you plan to use `api/contact.js`): Vercel, Netlify, Render, or a VPS.
- Ensure you deploy over HTTPS (most providers enable TLS automatically).

2) Serverless contact endpoint
- `api/contact.js` expects Node.js (commonjs) using `nodemailer`.
- Environment variables to set on the host:
  - `CONTACT_TO_EMAIL` — recipient address for contact submissions.
  - `GMAIL_USER` — optional Gmail SMTP user (email address) if using Gmail.
  - `GMAIL_APP_PASSWORD` — optional app password for Gmail SMTP (if using Gmail).
- If you don't configure SMTP, the endpoint logs submissions and still returns success.

Vercel-specific setup
- Recommended environment variable names to set in the Vercel Project Settings → Environment Variables:
  - `CONTACT_TO_EMAIL` (recipient address for contact submissions)
  - `GMAIL_USER` (Gmail SMTP user, optional)
  - `GMAIL_APP_PASSWORD` (Gmail app password, optional)

- Local development with Vercel CLI:

```bash
npx vercel dev
# or run locally using the included server.js:
npm install
node server.js
```

- GitHub Actions (optional): to use the included `.github/workflows/deploy.yml` that deploys to Vercel, add these GitHub repository Secrets:
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

  The workflow will use these to trigger Vercel deployments on push to `main`.

3) GA
- GA4 Measurement ID is set in the HTML heads: `G-01F9W7GHV9`.
- Optionally, use Google Tag Manager for more flexible event wiring.

4) Wave checkout
- Test all Wave links and configure post-purchase redirects (if available) to a thank-you page so you can track conversions.

5) Environment & CI
- Add repository, enable CI (Vercel/Netlify auto-deploy from GitHub), add a `.env` or environment settings in the host dashboard for SMTP and other secrets.

6) Backups & monitoring
- Set up basic uptime monitoring (UptimeRobot) and error reporting (Sentry or similar) for serverless functions.

7) Privacy & legal
- Host `privacy.html` and `terms.html` (done). Review language with legal counsel if required.

8) Checklist before launch
- Replace example URLs in `sitemap.xml` and JSON-LD with your real domain.
- Test contact form end-to-end and check that you receive emails (or logs) on the server.
- Verify GA events are arriving in the GA4 dashboard (real-time events).
- Validate `robots.txt` and `sitemap.xml` are reachable.

If you want, I can prepare a Git commit and add a sample `package.json` with `nodemailer` listed so you can deploy serverless function easily.

Additional quick steps performed:

- Added `contact-thanks.html` and `purchase-thanks.html` — set Wave post-purchase redirect to `https://your-domain.com/purchase-thanks.html` to track purchases.
- Added a small cookie-consent banner (client-side, localStorage) in `script.js`.
- Added `package.json` and `.gitignore` for local development and dependency management.

Replace placeholders:
- GA4 Measurement ID has been inserted into the HTML heads (`G-01F9W7GHV9`).
- Update `sitemap.xml` and JSON-LD `url` and `logo` fields with your production domain before deploying.

If you'd like, I can also:
- Add a minimal `server.js` to run the `api` handler locally, or scaffold a Vercel/Netlify deploy config.
- Create a Git repo and commit these changes, then set up automatic deploys.

Image optimization (recommended):
- Create PNG and WebP fallbacks for `assets/og-image.svg` so social previews render consistently across platforms.
- Suggested commands (requires ImageMagick + svgo + cwebp/pngquant):

```bash
# optimize SVG
svgo assets/og-image.svg -o assets/og-image.optim.svg
# export PNG at social preview size
magick convert -background white -density 300 assets/og-image.optim.svg -resize 1200x630 -strip assets/og-image.png
# create a WebP for smaller size
cwebp -q 80 assets/og-image.png -o assets/og-image.webp
# optionally compress PNG
pngquant --force --ext .png --quality=65-80 assets/og-image.png
```

After creating `assets/og-image.png` and `assets/og-image.webp`, update the HTML heads to point `og:image` to the PNG (some crawlers prefer raster images). The repository currently references the SVG but includes meta tags for the SVG; adding raster fallbacks improves compatibility.

Scaffold added by assistant:
- `server.js` — simple Express dev server to run locally (use `node server.js`).
- `vercel.json` — config to deploy on Vercel (auto-detects `/api` functions).
- `netlify.toml` — redirects for Netlify Functions (you'll need to move `api` into `netlify/functions` for Netlify).
- `.github/workflows/deploy.yml` — GitHub Action that deploys to Vercel using `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets.

To run locally (quick):

```powershell
npm install
node server.js
# open http://localhost:3000
```

Vercel notes:
- Connect the repository to Vercel, set `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` in GitHub Secrets and push to `main` to auto-deploy.

Netlify notes:
- Netlify requires serverless functions under `netlify/functions`. To use the existing `api/contact.js`, either move it or adapt accordingly.

Cloudflare Pages (recommended for this static site)
-----------------------------------------------
- Why: Cloudflare Pages is optimized for static sites, provides a global CDN, and integrates with GitHub Actions for automatic deploys. Use Pages for static hosting and only add Workers/Wrangler when you need edge logic.

- Required GitHub repository Secrets (used by `.github/workflows/deploy.yml`):
  - `CLOUDFLARE_API_TOKEN` — API token with Pages Deploy permission (create in Cloudflare dashboard → My Profile → API Tokens).
  - `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID (Cloudflare dashboard → Overview).
  - `CLOUDFLARE_PAGES_PROJECT` — the Pages project name (the slug you create in Cloudflare Pages).

- Quick connect & deploy steps:
  1. In Cloudflare Pages, create a new project and connect your GitHub repository.
  2. In GitHub repository Settings → Secrets → Actions, add the three secrets above.
  3. Push your code to the `main` branch; the GitHub Action will build and deploy automatically.

Create a Cloudflare API token
-----------------------------
- In Cloudflare: open your profile (top-right) → API Tokens → Create Token.
- Recommended: use the prebuilt **Cloudflare Pages** template, or create a custom token with these permissions:
  - Account > Pages > Edit
  - Account > Pages > Read
  - (Optional, for DNS changes) Zone > DNS > Edit
- Name the token `sctec-pages-deploy` and create it. Copy the token value — you will not be able to view it again.
- In GitHub, add the token as the `CLOUDFLARE_API_TOKEN` secret.

Find your Account ID & Pages project name
-----------------------------------------
- Account ID: Cloudflare dashboard → Overview → Account ID.
- Pages project: Cloudflare Pages → your project → Settings → General → Project name (use this value for `CLOUDFLARE_PAGES_PROJECT`).

Suggested commit / PR message
-----------------------------
- Commit: `chore(deploy): switch CI to Cloudflare Pages and add deploy workflow`
- PR title: `ci: deploy site via Cloudflare Pages` — include a short description linking to DEPLOY.md for setup steps.

After completing these steps, push to `main` and monitor the Actions run and Pages deploy.

- Manual `wrangler` deploy (only when using Workers/asset deployments):

```bash
npm install
npx wrangler deploy --assets=./
```

DNS & custom domain
- In Cloudflare Pages → your project → Custom domains, add `sctecenterprises.com` and follow the DNS instructions. Cloudflare provisions TLS automatically.

Local push commands (run from your machine)
-----------------------------------------
Use these to initialize and push the repo to GitHub (replace `<repo-url>`):

```powershell
git init
git add .
git commit -m "Initial site commit"
git branch -M main
git remote add origin <repo-url>
git push -u origin main
```

After pushing, check GitHub Actions and Cloudflare Pages UI to confirm a successful deploy.
