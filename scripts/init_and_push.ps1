param(
  [Parameter(Mandatory=$true)][string]$RemoteUrl,
  [string]$CommitMessage = "Initial commit",
  [string]$Branch = "main"
)

function ExitWithMessage($msg, $code=1){ Write-Host $msg -ForegroundColor Red; exit $code }

# Check for git
try {
  $null = & git --version 2>$null
} catch {
  ExitWithMessage "Git not found in PATH. Install Git (https://git-scm.com/) and re-run this script."
}

Push-Location (Resolve-Path .)

# Initialize if needed
if (-not (Test-Path .git)) {
  Write-Host "Initializing new git repository..."
  & git init || ExitWithMessage "git init failed"
} else {
  Write-Host "Existing git repository detected."
}

# Stage changes if any
$porcelain = & git status --porcelain
if ($porcelain) {
  Write-Host "Staging changes..."
  & git add -A || ExitWithMessage "git add failed"
  Write-Host "Committing..."
  & git commit -m $CommitMessage --author="SCTEC <noreply@local>" || Write-Host "Commit may have failed (no changes or commit error)." -ForegroundColor Yellow
} else {
  Write-Host "No changes to commit."
}

# Ensure branch
Write-Host "Setting branch to '$Branch'..."
& git branch -M $Branch || Write-Host "Could not rename branch (maybe no commits yet)." -ForegroundColor Yellow

# Configure remote
try {
  $existing = & git remote get-url origin 2>$null
  if ($?) {
    Write-Host "Replacing existing remote 'origin' with: $RemoteUrl"
    & git remote remove origin
  }
} catch {
  # ignore
}

Write-Host "Adding remote origin: $RemoteUrl"
& git remote add origin $RemoteUrl || ExitWithMessage "git remote add failed"

Write-Host "Pushing to origin/$Branch (this may prompt for credentials)..."
try {
  & git push -u origin $Branch
  if ($LASTEXITCODE -ne 0) { ExitWithMessage "git push failed. Please check credentials and remote URL." }
} catch {
  ExitWithMessage "git push failed. Please check credentials and remote URL." 
}

Write-Host "Push complete. Repository is on origin/$Branch." -ForegroundColor Green
Pop-Location
