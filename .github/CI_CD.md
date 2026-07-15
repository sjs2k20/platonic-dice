# CI / CD overview

This repository uses GitHub Actions to enforce quality checks on pull requests and to publish packages only after a merge to `main`.

## Workflows

- `CI` (`.github/workflows/ci.yml`)
  - Runs on pull requests targeting `develop` and `main`.
  - Also runs on pushes to `main`.
  - Performs:
    - dependency install with `pnpm -w install --frozen-lockfile`
    - lint across workspace packages with `pnpm -r --if-present lint`
    - workspace build to ensure emitted declaration files are available
    - typecheck for every package with a `tsconfig.json`
    - tests across workspace packages with `pnpm -r --if-present test`

- `Bump package versions on PR label` (`.github/workflows/bump-on-label.yml`)
  - Runs when a maintainer adds `semver/patch`, `semver/minor`, or `semver/major` to a pull request.
  - Determines which publishable packages are affected by the PR.
  - Bumps only the changed package versions in the PR branch using `pnpm version --no-git-tag-version`.
  - Pushes the bump commit back to the PR branch and comments the PR with the new versions.
  - Skips packages whose `package.json` is already modified in the PR.
  - Skips forks because it cannot push automated commits to a forked head branch.

- `Publish changed packages on main` (`.github/workflows/publish-on-main.yml`)
  - Runs on pushes to `main` and can also be triggered manually.
  - Detects publishable package version changes in `package.json`.
  - Builds and publishes only the changed packages.
  - Creates or comments on a single failure issue when publishing fails.

## Recommended workflow

1. Work on a branch from `develop`.
2. Open a pull request to `develop`.
3. Let the `CI` workflow run and fix any lint, typecheck, or test failures.
4. If a package version should change as part of the PR, add one of the labels:
   - `semver/patch`
   - `semver/minor`
   - `semver/major`
5. Wait for the label workflow to bump package versions and rerun CI.
6. Merge the PR to `develop` after the branch is green and reviewed.
7. When you are ready to release, merge `develop` into `main` with a PR.
8. `publish-on-main` runs after the merge and publishes only the changed packages.

## Branch protection guidance

For a professional GitFlow workflow, protect `develop` and `main` with the following rules:

- Require pull requests before merging.
- Require the `CI` workflow to pass.
- Do not require the publish workflow on `main` as a merge-blocker.
  - The publish step should run after the release merge, and failures should be handled separately.
- Require review approvals as appropriate for your team.
- Optionally require signed commits if your workflow supports it.

## Secrets

- `NPM_TOKEN` — used by `publish-on-main.yml` to authenticate with npm.
- `GITHUB_TOKEN` — automatically provided to workflows for checkout, issue comments, and pushing version bumps.

## Manual local checks

Run the same commands locally before pushing or opening a PR:

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

## Failure and recovery

- If `CI` fails, fix the issue in the PR branch and push a new commit.
- If `publish-on-main` fails, fix the underlying issue and rerun the workflow manually.
- When `publish-on-main` fails, the workflow creates or updates a `publish-failure` issue so failures are easy to track.

## Notes

- Publishing is intentionally separate from branch protection so token rotation or temporary npm outages do not block merges.
- Version bumps are automated only when you choose a `semver/*` label.
- Keep workflow files and branch protection rules aligned with this document.
