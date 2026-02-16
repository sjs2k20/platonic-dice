# CI / CD & release automation (overview)

This document explains the workflows, labels, and safe release process used by this repository. It describes the label-driven versioning you requested and the Dependabot flow.

## Quick summary

- CI jobs: `CI / typecheck` and `CI / tests` — required before merging.
- Dependabot opens dependency/security PRs. You review and approve them. After approval, the PR is set to auto‑merge (when CI passes).
- If you want a PR to bump package versions, add one of: `semver/patch`, `semver/minor`, `semver/major` (or `patch`/`minor`/`major`). The workflow will update `package.json` in‑PR.
- Merges that include package.json version changes cause tags to be created and packages to be published.

---

## Workflows (what they do)

- `CI` (`.github/workflows/ci.yml`) — runs typecheck and tests on PRs and pushes to `main`. Required for merges.
- `label-version-bump` — when a maintainer adds a semver label to a PR, this workflow:
  - validates the label and actor permissions,
  - determines which publishable packages are affected,
  - bumps versions (patch/minor/major) in the PR branch and pushes the commit,
  - comments the PR with the bumped versions.
  - (PR must be from a branch in this repo — forks are skipped with a comment.)
- `enable-automerge-on-approval` — when you approve a Dependabot PR that only changes dependencies, this enables GitHub auto‑merge for that PR. CI still gates the merge.
- `auto-patch-bump` — only runs when a dependency PR (Dependabot or labelled `dependencies`) is merged; it creates a follow-up patch bump PR if a package’s source changed but `package.json` was not bumped in the merged PR.
- `tag-on-version-change` — runs on push to `main`; if `package.json` versions changed it creates package tags (e.g. `core-v1.2.3`) which trigger publish.
- `publish` — publishes packages when package‑specific tags are pushed (existing behavior).
- `pnpm-updater` — scheduled job to open PRs updating `packageManager` fields to the latest pnpm.
- `dependabot.yml` — Dependabot configuration (weekly checks, labels). It remains enabled for security and patch updates.

---

## Labels & how to use them

- semver/patch — bump patch in‑PR
- semver/minor — bump minor in‑PR
- semver/major — bump major in‑PR
- dependencies — label for dependency PRs (used by auto‑patch-bump)

Usage example (developer PR):

1. After review, add `semver/patch` to the PR.
2. `label-version-bump` will push a version bump commit into the PR branch.
3. CI reruns; if green you merge the PR.
4. `tag-on-version-change` will create tags for packages whose versions changed and `publish` will run.

If you add no semver label, nothing is bumped automatically.

---

## Dependabot flow (manual-approve + auto-merge)

1. Dependabot opens a patch/security PR.
2. You review and approve the PR.
3. `enable-automerge-on-approval` enables GitHub auto‑merge for the PR (only if PR is dependency-only).
4. Auto‑merge waits for CI checks; when they pass the PR merges.
5. If source files changed without `package.json` being updated, `auto-patch-bump` opens a patch bump PR which auto‑merges after CI.

---

## Branch protection — required settings

- Require pull requests before merging.
- Require `CI / typecheck` and `CI / tests` as required status checks.
- Allow auto‑merge (so Dependabot + automation can merge when checks pass).
- (Optional) Require at least 1 reviewer for regular PRs; maintainers should approve Dependabot PRs before enabling auto‑merge.

---

## Why this design is safe

- Human approval controls semantic bumps (labels) and Dependabot merges.
- Version bumps happen in‑PR so they are reviewed and tested before merge (prevents accidental publishes).
- The auto‑patch mechanism runs only for dependency merges and skips packages that already had `package.json` changed, preventing loops.

---

## Troubleshooting & FAQs

Q: How do I prevent auto-publishing after a dependency merge?  
A: Ensure the merged PR does not include `package.json` version changes; `auto-patch-bump` will create a PR for the bump and you can review it before it auto‑merges.

Q: I labeled a PR but nothing happened.  
A: Check that the label name is exactly `patch/minor/major` or `semver/*`, that the PR branch is in this repo (not a fork), and that you have write/maintain/admin permission.

Q: Will Dependabot PRs be auto‑merged without review?  
A: No — a maintainer must approve the PR first (the `enable-automerge-on-approval` workflow then enables auto‑merge).

---

## Next steps / suggestions

- Add `semver/*` labels to your repository (I can create them for you).
- Optionally add a small `release` label for PRs you want to treat specially.
- Keep `Require signed commits` disabled if you want automation to perform merges (or sign commits via bot if required).

---

Documentation maintained in `.github/` — keep workflows and docs in sync.
