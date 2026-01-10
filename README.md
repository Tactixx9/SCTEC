# SCTEC Starter

This is a minimal starter scaffold for the SCTEC website.

Run locally:

```powershell
cd 'C:\Users\Sylve\OneDrive\Desktop\sctec-website'
python -m http.server 8000
# open http://localhost:8000
```

Notes:
- The contact form is currently local-only (no server). Replace with a server endpoint (e.g. `/api/contact`) when ready.
- The "Book Consulting" CTA points to your Wave link.

Git & install (run locally):

```powershell
# initialize local git and commit
.\\\init-repo.ps1

# install dependencies for serverless email (nodemailer)
npm install

# To test serverless functions locally (optional):
# 1) Install Vercel CLI: `npm i -g vercel` or use `npx vercel`.
# 2) Run `npx vercel dev` and open http://localhost:3000
```
