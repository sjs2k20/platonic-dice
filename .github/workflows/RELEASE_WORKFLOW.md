# :package: Release Workflow — Step-by-Step Publishing Guide

This repository uses GitHub Actions to publish workspace packages when you push package-specific version tags.

## Overview

**The workflow:**

- Triggers on package-specific tags: `core-v*.*.*`, `types-core-v*.*.*`, or `dice-v*.*.*`
- Runs TypeScript checks across all packages
- Builds and publishes only the package(s) matching the tag version
- Creates a GitHub Release for each tag

**Why package-specific tags?**

- Safe for monorepos with private packages (won't accidentally publish the root)
- Supports independent versioning (core and dice can have different versions)
- Clear git history showing exactly what was released

---

## Prerequisites (One-Time Setup)

**Required:**

- Node.js 24+ and npm installed
- Push access to the repository
- npm publish permissions for `@platonic-dice` scope

**GitHub Secrets:**

1. **`NPM_TOKEN`** — npm automation token with publish permissions  
   Create at: https://www.npmjs.com/settings/[your-account]/tokens  
   Add at: Repository Settings → Secrets → Actions

---

## Release Process

### Step 1: Prepare Your Changes

1. Work in a feature branch (e.g., `feat/add-feature`)
2. Open a PR to `main` and get reviews
3. Merge to `main`

### Step 2: Update Package Versions

Update the version in each package's `package.json` **without creating git tags**.

**For independent versioning (most common):**

```bash
# Update individual packages to different versions
npm version 2.1.2 --prefix packages/core --no-git-tag-version
npm version 2.1.1 --prefix packages/dice --no-git-tag-version

# Update dice's dependency on core if needed
# Edit packages/dice/package.json: "@platonic-dice/core": "^2.1.2"

git add packages/*/package.json
git commit -m "chore(release): bump core to 2.1.2, dice to 2.1.1"
git push origin main
```

**For synchronised versioning (rare):**

```bash
# Update both packages to the same version
npm version 2.2.0 --prefix packages/core --no-git-tag-version
npm version 2.2.0 --prefix packages/dice --no-git-tag-version

git add packages/*/package.json
git commit -m "chore(release): bump all packages to 2.2.0"
git push origin main
```

**Important:** Always use `--no-git-tag-version` so you control tag creation manually.

### Step 3: Build and Verify Locally

Before creating tags, verify the packages build correctly and contain expected files.

```bash
# Install and build
pnpm -w install --frozen-lockfile
pnpm --filter @platonic-dice/core run build
pnpm --filter @platonic-dice/dice run build

# Verify core package contents
cd packages/core
npm pack --dry-run
# Look for: dist/, dist-types.d.ts
cd ../..

# Verify dice package contents
cd packages/dice
npm pack --dry-run
# Look for: dist/
cd ../..
```

### Step 4: Run Local Checks

Run the same checks the CI will run:

```bash
# TypeScript checks
for dir in packages/*; do
  if [ -f "$dir/tsconfig.json" ]; then
    npx tsc -p "$dir/tsconfig.json" --noEmit
  fi
done

# Tests
pnpm -r test --if-present
```

All checks must pass before proceeding.

### Step 5: Create and Push Tags

Create package-specific annotated tags and push them:

```bash
# Tag for core package
git tag -a core-v2.1.2 -m "release: core v2.1.2 - fix rollModTest types"

# Tag for dice package
git tag -a dice-v2.1.1 -m "release: dice v2.1.1 - fix rollModTest usage"

# Push both tags (triggers two separate workflow runs)
git push origin core-v2.1.2 dice-v2.1.1
```

**Or push individually:**

```bash
git push origin core-v2.1.2   # Publishes core only
git push origin dice-v2.1.1   # Publishes dice only
```

**Tag format rules:**

- ✅ Use: `core-v2.1.2`, `dice-v2.1.1` (package-specific)
- ❌ Don't use: `v2.1.2` (no package prefix — unsafe for monorepos)

### Step 6: Monitor the Workflow

1. Go to GitHub Actions → "Publish Packages & Release" workflow
2. Watch the `typecheck` and `publish` jobs
3. Each tag triggers a separate workflow run

**What happens:**

- TypeScript checks run on all packages
- Tag-targeted publishing runs:
  - `core-vX.Y.Z` → publishes `@platonic-dice/core` only
  - `types-core-vX.Y.Z` → publishes `@platonic-dice/types-core` only
  - `dice-vX.Y.Z` → publishes `@platonic-dice/dice` only
- GitHub Releases are created for each tag

### Step 7: Verify Publication

After the workflow completes, test the published packages:

```bash
# Test in a temporary directory
mkdir /tmp/test-platonic && cd /tmp/test-platonic
npm init -y

# Test core
npm i @platonic-dice/core@2.1.2
node -e "console.log(require('@platonic-dice/core'))"

# Test dice
npm i @platonic-dice/dice@2.1.1
node -e "const { Die, DieType } = require('@platonic-dice/dice'); console.log(new Die(DieType.D20))"
```

---

## Troubleshooting

**Authentication Error (401)**

- Verify `NPM_TOKEN` is set in repository secrets
- Token must have publish permissions for `@platonic-dice` scope
- Re-generate token if needed

**Version Already Exists**

- Workflow will skip and log "Version already exists"
- Bump the version number and create a new tag

**Missing Files in Published Package**

- Run `npm pack --dry-run` locally to see what's included
- Add missing files to `"files"` array in package.json
- Ensure build step creates all necessary files

**TypeScript Errors in CI**

- Run `npx tsc -p packages/[package]/tsconfig.json --noEmit` locally
- Fix errors before pushing tags

---

### Label-driven releases (optional)

You can control semantic version bumps from the PR UI by adding one of the labels `semver/patch`, `semver/minor`, or `semver/major`. When such a label is applied by a repo maintainer the repository will:

- Bump the appropriate package `version` _inside the PR branch_ (the workflow commits the bump into the PR),
- Re-run CI so the bumped PR is validated, and
- After you merge the PR the existing `tag-on-version-change` workflow will create package tags (e.g. `core-vX.Y.Z`) and `publish.yml` will publish only the packages whose versions changed.

Important safety rules:

- No label → no automatic bump. You remain in full control.
- Labels are honoured only for PRs that change files in publishable packages and where `package.json` has not already been edited in the PR.
- Bump commits are pushed to the PR branch (not directly to `main`) — this prevents infinite loops and ensures the change is reviewed.

See `.github/CI_CD.md` for full operational details and examples.

## Adding New Packages

**For publishable packages (like a future API client):**

1. Add package directory to `PUBLISHABLE_PACKAGES` array in `.github/workflows/publish.yml`
2. Add tag trigger pattern: `"newpkg-v*.*.*"` in workflow
3. Ensure `"private": true` is NOT set in package.json
4. Follow normal release process with `newpkg-v1.0.0` tags

**For private packages (like UI components):**

1. Set `"private": true` in package.json
2. Do NOT add tag patterns to workflow
3. Do NOT add to `PUBLISHABLE_PACKAGES` array
4. Package will be automatically skipped if accidentally included

---

## Quick Reference

```bash
# 1. Update versions
npm version 2.1.2 --prefix packages/core --no-git-tag-version
npm version 2.1.1 --prefix packages/dice --no-git-tag-version
git add packages/*/package.json
git commit -m "chore(release): core 2.1.2, dice 2.1.1"
git push origin main

# 2. Build and verify
npm ci
npm run -w @platonic-dice/core build
npm run -w @platonic-dice/dice build
cd packages/core && npm pack --dry-run && cd -
cd packages/dice && npm pack --dry-run && cd -

# 3. Run checks
for dir in packages/*; do [ -f "$dir/tsconfig.json" ] && npx tsc -p "$dir/tsconfig.json" --noEmit; done
pnpm -r test --if-present

# 4. Create and push tags
git tag -a core-v2.1.2 -m "release: core v2.1.2"
git tag -a dice-v2.1.1 -m "release: dice v2.1.1"
git push origin core-v2.1.2 dice-v2.1.1

# 5. Monitor workflow and verify publication
```
