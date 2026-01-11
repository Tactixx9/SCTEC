param(
  [string]$RepoUrl = ""
)

if ($RepoUrl -eq "") {
  Write-Host "Usage: .\create_pr_branch.ps1 -RepoUrl <git@github.com:owner/repo.git>"
  exit 1
}

Write-Host "Creating branch 'ci/cloudflare-pages' and committing changes..."
git checkout -b ci/cloudflare-pages
git add .
git commit -m "chore(deploy): switch CI to Cloudflare Pages and add deploy workflow" || Write-Host "No changes to commit or commit failed."

# Ensure remote exists, add if needed
try {
  git remote get-url origin > $null 2>&1
} catch {
  git remote add origin $RepoUrl
}

Write-Host "Pushing branch to origin..."
git push -u origin ci/cloudflare-pages

# Create PR using gh if available
if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh pr create --title "ci: deploy site via Cloudflare Pages" --body-file PR-SWITCH-CI-TO-CLOUDFLARE.md --base main --head ci/cloudflare-pages
} else {
  Write-Host "gh CLI not found; create a PR manually on GitHub using the branch 'ci/cloudflare-pages'."
}

Write-Host "Done."
