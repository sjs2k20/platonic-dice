# Release workflow

This repository publishes packages only after a merge to `main`, not on tag creation. The release workflow is built around GitFlow-style development and post-merge, label-driven version bumps.

## CI toolchain

- Node.js: `24`
- pnpm: `11.12.0`

## Current release flow

1. Develop features and fixes on a branch based off `develop`.
2. Open a pull request to `develop` and let `CI` pass before merging it.
3. When ready to release, open a pull request from `develop` to `main`.
4. Add exactly one semver label to that release pull request:
   - `semver/patch`
   - `semver/minor`
   - `semver/major`
5. Squash-merge the release pull request to `main`.
6. `release.yml` runs on the merge commit, detects changed packages, bumps their versions, and publishes each changed public package independently.

Hotfix, maintenance, and Dependabot branches may merge directly to `main`; without a semver label they default to a patch release. No manual package.json edits are required.

## What is published?

The `release.yml` workflow determines which publishable packages changed and publishes only those packages.

Publishable packages in this repository are currently:

- `packages/core`
- `packages/types-core`
- `packages/dice`

Only packages whose directories changed in the merged pull request are versioned. Public packages among those changes are published individually with `pnpm publish`, which rewrites pnpm `workspace:` ranges to ordinary npm semver ranges in the published metadata.

## Manual reruns and failure handling

The publish workflow is not required for merge approval. That means:

- A merge to `main` can complete even if publishing later fails.
- Publishing failures are surfaced by a `release-failure` GitHub issue.
- After fixing the failure, create a fresh release-triggering merge or publish the already-bumped package version manually. Re-running an old workflow run can fail because `main` has moved forward.

## Version bump labels

Use labels to control semantic version bumps from the PR UI:

- `semver/patch` — bump patch versions
- `semver/minor` — bump minor versions
- `semver/major` — bump major versions

If no label is added to a `develop` to `main` release PR, the workflow fails without publishing. Hotfix, maintenance, and Dependabot branches default to `patch`.

## Local release verification

Before merging to `main`, verify locally:

```bash
pnpm -w install --frozen-lockfile
pnpm -r --if-present lint
pnpm -w --if-present build
for dir in packages/*; do
  if [ -f "$dir/tsconfig.json" ]; then
    npx -y tsc -p "$dir/tsconfig.json" --noEmit
  fi
done
pnpm -r --if-present test
```

## Best practices

- Keep feature work on `develop` until it is ready to release.
- Use pull requests with reviewers and CI passing before merging.
- Label PRs with semantic bump labels only when package version changes are desired.
- Keep `NPM_TOKEN` up to date in repository secrets and rotate it if it expires.
- Do not rely on publishing to gate the merge; fixing publish failures after merge is safer.
