# init-repo.ps1 - run locally to initialize git and create first commit
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host "Git not found in PATH. Install Git and re-run this script." -ForegroundColor Yellow
  exit 1
}

git init
git add .
git commit -m "Initial commit — scaffold"
Write-Host "Repository initialized. Add a remote with: git remote add origin <url>" -ForegroundColor Green
