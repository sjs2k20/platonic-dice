# :package: Release workflow — detailed step-by-step publish guide

This repository uses GitHub Actions to publish the workspace packages when you push a version tag (e.g. `v2.0.0`). The workflow will:

- Run TypeScript checks across packages.
- Build the `@platonic-dice/core` package (declaration emit and curated type shim).
- Publish any workspace packages whose package.json `version` matches the pushed tag.
- Create a GitHub Release.

This document walks through a safe, repeatable release process you can follow in the terminal (VS Code) and on GitHub.

## Prerequisites (one-time)

- Node.js and npm installed (the workflow uses Node 20 in CI).
- You have push access to the repository and permission to publish the npm packages.

### Repo secrets you must add

1. `NPM_TOKEN` — an npm automation token with publish permissions. Create at https://www.npmjs.com/settings/<your-account>/tokens and add it as a repository secret (Settings → Secrets → Actions).
2. (Optional) `GHPKG_TOKEN` — a GitHub personal access token with `write:packages` (and `repo` if needed) if you want the workflow to publish to GitHub Packages using an alternate token. If unset the workflow falls back to `GITHUB_TOKEN`.

## 1) Prepare changes on a branch

- Work in a feature branch (example: `feat/whatever`) and open a PR to `main`.
- Get all reviews and merge the PR into `main` as usual.

## 2) Decide the release version

Pick a semantic version for this release, for example `2.0.0`.

Important: the GitHub Actions workflow triggers only when you push a tag that matches `v*.*.*` and it looks for packages whose `package.json` `version` exactly equals the tag version (without the leading `v`).

## 3) Update package versions (monorepo-safe)

You need both workspace packages to have their `version` updated to the release version (e.g. `2.0.0`). Two safe approaches:

Option A — explicit per-package update (recommended and precise):

```bash
# from repo root — update core and dice without creating a git tag
npm version 2.0.0 --prefix packages/core --no-git-tag-version
npm version 2.0.0 --prefix packages/dice --no-git-tag-version

git add packages/core/package.json packages/dice/package.json
git commit -m "chore(release): set package versions to 2.0.0"
```

Option B — root workspace version bump (if you prefer):

```bash
# This can bump workspace packages if your npm supports it and you have configured workspaces
npm version 2.0.0 --workspaces --no-git-tag-version
```

Notes:

- We use `--no-git-tag-version` so we control the tag creation (the CI triggers on pushed tags).
- The workflow will only publish packages if `package.json` `version` equals the tag number (without `v`).

## 4) Build locally and verify publish contents (strongly recommended)

Before pushing tags or depending on CI builds, do a local verification of the publish artifacts.

1. Install dependencies and build both packages:

```bash
npm ci
npm run -w @platonic-dice/core build
npm run -w @platonic-dice/dice build
```

2. Verify the `@platonic-dice/core` curated type shim is included in the pack list.

```bash
cd packages/core
npm pack --dry-run
# Look for dist/ and dist-types.d.ts in the Tarball Contents list
cd ../..
```

3. Verify `@platonic-dice/dice` pack contents:

```bash
cd packages/dice
npm pack --dry-run
cd ../..
```

If the `npm pack --dry-run` lists the expected files (dist, declaration files, and `dist-types.d.ts` for `core`) you're good.

## 5) Run the repo checks locally (sanity before tagging)

Run the same checks the workflow will run so you catch issues earlier:

```bash
# Per-package TypeScript checks
for dir in packages/*; do
	if [ -f "$dir/tsconfig.json" ]; then
		npx tsc -p "$dir/tsconfig.json" --noEmit
	fi
done

# Run tests
npm test --workspaces --if-present
```

All checks should pass locally. If they fail, fix issues locally and re-run before tagging.

## 6) Create the Git tag and push

Create an annotated tag matching `v<version>` and push it. The CI is triggered by tags.

```bash
# from repo root
git tag -a v2.0.0 -m "release: v2.0.0"
git push origin main --tags
```

Replace `main` with your default branch name if different. Pushing the tag will start the `Publish Packages & Release` workflow.

## 7) What the workflow does (what to expect)

- `typecheck` job: checks each package with `npx tsc -p <pkg>/tsconfig.json --noEmit`.
- `publish` job: builds `@platonic-dice/core` and then iterates packages in a deterministic order (`packages/core`, `packages/dice`). For each package whose `version` equals the tag version it will attempt:
  1.  `npm publish --registry https://registry.npmjs.org/ --access public` (publishes to npmjs.org). If the version already exists it logs and continues.
  2.  `npm publish --registry https://npm.pkg.github.com/ --access public` (attempt to publish to GitHub Packages). This is best-effort and will not fail the job if it fails.
- A GitHub Release is created for the tag via `softprops/action-gh-release`.

## 8) Monitor and troubleshoot

Where to look:

- GitHub Actions → the `Publish Packages & Release` workflow run logs. Inspect the `typecheck` and `publish` steps.
- The `publish` job prints which package it's publishing and npm output. Auth errors (401) indicate token problems.

Common issues and resolutions:

- Authentication (401): ensure `NPM_TOKEN` is set and valid in repository secrets. The token must have publish rights for the package scope.
- Version already exists on npm: the workflow will skip or log the failure and continue. Bump the version and retry.
- Missing files/types in published package: run `npm pack --dry-run` locally to inspect which files are packaged. If a file is missing, add it to the package `files` array or copy it into `dist/` in your build step.

## 9) Post-publish smoke tests

After the workflow completes and the publish step succeeds, test the published package with a temp project:

```bash
mkdir /tmp/pd-test && cd /tmp/pd-test
npm init -y
npm i @platonic-dice/core@2.0.0
node -e "console.log(require('@platonic-dice/core'))"

# For TypeScript consumers, create a small tsconfig and import types to ensure declarations are resolved.
```

## 10) Extra recommendations (optional)

- Add an ESLint job to CI for style and lint checks.
- Consider automating `dist-types.d.ts` placement in the `build` script so all published artifacts live under `dist/`.
- Create a pull request template that reminds maintainers to bump package versions before tagging.

## Quick checklist (copyable)

```bash
# 1. Ensure secrets are set: NPM_TOKEN (and optional GHPKG_TOKEN)
# 2. Build and verify locally
npm ci
npm run -w @platonic-dice/core build
npm run -w @platonic-dice/dice build
cd packages/core && npm pack --dry-run && cd -
cd packages/dice && npm pack --dry-run && cd -

# 3. Update package versions (example)
npm version 2.0.0 --prefix packages/core --no-git-tag-version
npm version 2.0.0 --prefix packages/dice --no-git-tag-version
git add packages/core/package.json packages/dice/package.json
git commit -m "chore(release): set package versions to 2.0.0"

# 4. Tag and push
git tag -a v2.0.0 -m "release: v2.0.0"
git push origin main --tags

# 5. Monitor CI and perform post-publish smoke tests
```

If you want, I can create a small release PR that contains the version bumps and a short release note, or I can apply the tag locally and create a test tag (you'll need to push it). If you'd like the doc adjusted (tone, shorter checklist, or extra troubleshooting), tell me which section to tune.
