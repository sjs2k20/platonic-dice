# Platonic Dice

A monorepo containing dice-rolling packages and an interactive showcase:

- `@platonic-dice/core` — pure JavaScript dice-roll logic, entities and utilities.
- `@platonic-dice/types-core` — TypeScript declarations for `@platonic-dice/core`.
- `@platonic-dice/dice` — higher-level persistent dice objects (history, validators, TypeScript types) built on `@platonic-dice/core`.
- `@platonic-dice/ui` — React showcase application ([live demo](https://sjs2k20.github.io/platonic-dice/)) deployed to GitHub Pages.

This repository is structured as a pnpm workspace. Each package lives under `packages/<name>` and has its own `package.json`, README and build/test scripts.

## Toolchain

- Node.js: `>=24`
- pnpm: `11.12.0`

If pnpm is not installed yet, use Corepack:

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@11.12.0 --activate
```

## Install

Install a package from npm (after publishing):

```bash
# core
npm install @platonic-dice/core

# core + types
npm install @platonic-dice/core @platonic-dice/types-core

# dice
npm install @platonic-dice/dice
```

Locally (development):

```bash
# install workspace dev dependencies and link packages
pnpm install

# build all packages
pnpm build

# run tests across workspaces
pnpm -r test
```

## Packages

### @platonic-dice/core

- Exposes functions for rolling dice (`roll`, `rollDice`, `rollMod`, `rollTest`, `rollModTest`), enums (`DieType`, `RollType`, `TestType`, `Outcome`), and utilities.
- Includes `rollModTest()` for combining modifiers with test evaluation, and `analyseModTest()` for probability analysis.
- Sources: `packages/core/src`
- Entry: `packages/core/src/index.js`

### @platonic-dice/types-core

- TypeScript declarations for `@platonic-dice/core`.
- Current version: `3.0.2`.
- Sources: `packages/types-core`
- Entry: `packages/types-core/index.d.ts`

### @platonic-dice/dice

- Provides the `Die` class and history tooling which consumes `@platonic-dice/core`.
- Includes `Die.rollModTest()` with separate history tracking for modified test rolls.
- Written in TypeScript; built output is `packages/dice/dist`.
- Entry: `packages/dice/dist/index.js` (after build)

### @platonic-dice/ui

- React showcase application demonstrating the dice packages.
- Current package version is 0.2.3 (PREVIEW), and the UI is intended as a demo application.
- Live demo: https://sjs2k20.github.io/platonic-dice/
- Automatically deploys to GitHub Pages on pushes to `main`
- See `.github/workflows/GITHUB_PAGES.md` for deployment details

## Quick examples

CommonJS (Node):

```js
const { roll, rollModTest, rollDiceModTest } = require("@platonic-dice/core");
const { Die } = require("@platonic-dice/dice");

console.log(roll("d20"));

// Combine modifier with test evaluation
const result = rollModTest("d20", (n) => n + 5, {
  testType: "skill",
  target: 15,
});
console.log(
  `Base: ${result.base}, Modified: ${result.modified}, Outcome: ${result.outcome}`,
);

const d = new Die("d12");
console.log(d.roll());

// Die class also supports rollModTest
const testResult = d.rollModTest((n) => n + 3, {
  testType: "at_least",
  target: 10,
});
console.log(`Result: ${testResult}`);

const poolResult = rollDiceModTest(
  "d6",
  { each: (n) => n + 1, net: (sum) => sum + 2 },
  [{ testType: "at_least", target: 5 }],
  {
    count: 4,
    rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
  },
);
console.log(
  `Pool passed: ${poolResult.result.passed}, total: ${poolResult.modified.net.value}`,
);
```

TypeScript / ESM:

```ts
import {
  roll,
  rollModTest,
  rollDiceModTest,
  DieType,
} from "@platonic-dice/core";
import { Die } from "@platonic-dice/dice";

console.log(roll(DieType.D20));

// Apply modifier and evaluate test in one call
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: "skill",
  target: 15,
});

const pool = rollDiceModTest(
  DieType.D6,
  { each: (n) => n + 1, net: (sum) => sum + 2 },
  [{ testType: "at_least", target: 5 }],
  {
    count: 4,
    rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 2 }],
  },
);
```

## Publishing

### Release process

Packages are versioned and published independently after a pull request is merged to `main`. The release workflow detects changed package directories, bumps their versions, and publishes changed public packages to npm with pnpm.

1. Develop features on branches from `develop` and merge them back to `develop` without a version bump.
2. Open a release pull request from `develop` to `main` and add exactly one semver label:

- `semver/patch`
- `semver/minor`
- `semver/major`

3. Merge the release pull request with squash merge once CI is green.
4. The release workflow bumps and publishes each changed public package independently.

Hotfix, maintenance, and Dependabot pull requests may merge directly to `main`. They default to a patch release when no semver label is present.

No manual edits to package versions are required. In particular, a package's npm tarball contains that package's own files, not the monorepo.

**Requirements:**

- Repository secret `NPM_TOKEN` with publish permissions for the `@platonic-dice` scope
- Repository secret `RELEASE_PAT` with permission to push the post-release version-bump commit to `main`
- Keep branch protections on `develop` and `main` in place
- Let CI pass before merging

### GitHub Pages (ui)

The UI package automatically deploys to https://sjs2k20.github.io/platonic-dice/ when changes are pushed to `main`. See `.github/workflows/GITHUB_PAGES.md` for configuration details.

### Publishing to GitHub Packages

- GitHub Packages requires scoped package names (e.g. `@platonic-dice/*`). If you publish to GitHub Packages, you must point `npm publish` to `https://npm.pkg.github.com/` and use a token with the `write:packages` scope (a PAT).

## Contributing

- Fork -> branch -> PR. Follow existing code style and add tests for new behavior.
- Run `pnpm build` and `pnpm test` before opening a PR.

## License

MIT — see the `LICENSE` file at the repository root.

## Other notes

- The root `package.json` is intentionally `private: true` to avoid publishing the monorepo root.
- Each package contains its own `README.md` shown on its npm page after publishing.

---

Happy rolling! 🎲
