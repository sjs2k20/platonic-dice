# Release workflow

This repository publishes packages only after a merge to `main`, not on tag creation. The release workflow is built around GitFlow-style development and label-driven version bumps.

## CI toolchain

- Node.js: `24`
- pnpm: `11.12.0`

## Current release flow

1. Develop features and fixes on a branch based off `develop`.
2. Open a pull request to `develop`.
3. Let the `CI` workflow run and ensure the PR passes.
4. If the PR includes package changes that should publish a new version, add one of:
   - `semver/patch`
   - `semver/minor`
   - `semver/major`
5. The `release.yml` workflow evaluates semver labels from the merged PR when `main` is updated.
6. After the version bump commit is pushed, `CI` reruns on the updated PR.
7. Merge the PR to `develop` once it is reviewed and green.
8. When ready for a release, merge `develop` into `main` with a pull request.
9. `release.yml` runs on the merge commit and publishes only changed packages.

No manual package.json edits are required; the semver label controls the version bump.

## What is published?

The `release.yml` workflow determines which publishable packages changed and publishes only those packages.

Publishable packages in this repository are currently:

- `packages/core`
- `packages/types-core`
- `packages/dice`

Only packages with a changed `package.json` version on `main` are published.

## Manual reruns and failure handling

The publish workflow is not required for merge approval. That means:

- A merge to `main` can complete even if publishing later fails.
- Publishing failures are surfaced by a `publish-failure` GitHub issue.
- After fixing the failure (for example by rotating `NPM_TOKEN`), rerun the `Release` workflow from the Actions tab.

## Version bump labels

Use labels to control semantic version bumps from the PR UI:

- `semver/patch` — bump patch versions
- `semver/minor` — bump minor versions
- `semver/major` — bump major versions

If no label is added, package versions are not bumped automatically.

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
