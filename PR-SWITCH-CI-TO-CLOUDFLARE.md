Branch: ci/cloudflare-pages

Suggested commit:

  chore(deploy): switch CI to Cloudflare Pages and add deploy workflow

PR title:

  ci: deploy site via Cloudflare Pages

PR description:

  This PR replaces the existing Vercel GitHub Action with a Cloudflare Pages
  deployment workflow, and documents required repository secrets in
  DEPLOY.md. It enables automatic builds and deploys on push to `main`.

  Changes:
  - .github/workflows/deploy.yml: replaced Vercel action with Cloudflare Pages action
  - DEPLOY.md: added Cloudflare Pages setup steps and secret names

  Required GitHub repo secrets (add in Settings → Secrets → Actions):
  - CLOUDFLARE_API_TOKEN
  - CLOUDFLARE_ACCOUNT_ID
  - CLOUDFLARE_PAGES_PROJECT

Testing checklist for reviewer:
  - [ ] Confirm workflow file is present in `.github/workflows/deploy.yml`.
  - [ ] Ensure DEPLOY.md documents the required secrets and steps.
  - [ ] After merge, add the three secrets, push to `main`, and confirm Actions run.
  - [ ] Confirm Cloudflare Pages shows a successful deploy and site is served.

Notes:
  - If you prefer Cloudflare Pages UI-based setup (connect repo directly), the
    workflow can be removed and Pages will still deploy via its integration.
