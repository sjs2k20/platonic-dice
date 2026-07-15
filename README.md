# Platonic Dice

A monorepo containing dice-rolling packages and an interactive showcase:

- `@platonic-dice/core` — pure JavaScript dice-roll logic, entities and utilities.
- `@platonic-dice/types-core` — TypeScript declarations for `@platonic-dice/core`.
- `@platonic-dice/dice` — higher-level persistent dice objects (history, validators, TypeScript types) built on `@platonic-dice/core`.
- `@platonic-dice/ui` — React showcase application ([live demo](https://sjs2k20.github.io/platonic-dice/)) deployed to GitHub Pages.

This repository is structured as an npm workspace. Each package lives under `packages/<name>` and has its own `package.json`, README and build/test scripts.

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
pnpm run build

# run tests across workspaces
pnpm -r test
```

## Packages

### @platonic-dice/core

- Exposes functions for rolling dice (`roll`, `rollDice`, `rollMod`, `rollTest`, `rollModTest`), enums (`DieType`, `RollType`, `TestType`, `Outcome`), and utilities.
- **Version 2.1.0** adds `rollModTest()` for combining modifiers with test evaluation, and `analyseModTest()` for probability analysis.
- Sources: `packages/core/src`
- Entry: `packages/core/src/index.js`

### @platonic-dice/dice

- Provides the `Die` class and history tooling which consumes `@platonic-dice/core`.
- **Version 2.1.0** adds `Die.rollModTest()` method with separate history tracking for modified test rolls.
- Written in TypeScript; built output is `packages/dice/dist`.
- Entry: `packages/dice/dist/index.js` (after build)

### @platonic-dice/ui

- React showcase application demonstrating the dice packages.
- **Version 0.0.1 (PREVIEW)** — not a finished product, for demo purposes.
- Live demo: https://sjs2k20.github.io/platonic-dice/
- Automatically deploys to GitHub Pages on pushes to `main`
- See `.github/workflows/GITHUB_PAGES.md` for deployment details

## Quick examples

CommonJS (Node):

```js
const { roll, rollModTest } = require("@platonic-dice/core");
const { Die } = require("@platonic-dice/dice");

console.log(roll("d20"));

// New in 2.1.0: combine modifier with test evaluation
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
```

TypeScript / ESM:

```ts
import { roll, rollModTest, DieType } from "@platonic-dice/core";
import { Die } from "@platonic-dice/dice";

console.log(roll(DieType.D20));

// Apply modifier and evaluate test in one call
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: "skill",
  target: 15,
});
```

## Publishing

### Release process

Releases are driven by pull request labels and merges to `main`.

1. Work on a branch from `develop`.
2. Open a pull request to `develop`.
3. Add one of the semver labels before merging:
   - `semver/patch`
   - `semver/minor`
   - `semver/major`
4. The GitHub Actions workflow bumps the affected package versions in the PR branch for you.
5. Merge the PR to `develop` once CI is green.
6. When you are ready to release, merge `develop` into `main`.
7. The publish workflow runs on `main` and publishes only the packages whose versions changed.

No manual edits to the package version numbers are required. The semver label triggers the version bump automatically.

**Requirements:**

- Repository secret `NPM_TOKEN` with publish permissions for the `@platonic-dice` scope
- Keep branch protections on `develop` and `main` in place
- Let CI pass before merging

### GitHub Pages (ui)

The UI package automatically deploys to https://sjs2k20.github.io/platonic-dice/ when changes are pushed to `main`. See `.github/workflows/GITHUB_PAGES.md` for configuration details.

### Publishing to GitHub Packages

- GitHub Packages requires scoped package names (e.g. `@platonic-dice/*`). If you publish to GitHub Packages, you must point `npm publish` to `https://npm.pkg.github.com/` and use a token with the `write:packages` scope (a PAT).

## Contributing

- Fork -> branch -> PR. Follow existing code style and add tests for new behavior.
- Run `npm run build` and `npm test` before opening a PR.

## License

MIT — see the `LICENSE` file at the repository root.

## Other notes

- The root `package.json` is intentionally `private: true` to avoid publishing the monorepo root.
- Each package contains its own `README.md` shown on its npm page after publishing.

---

Happy rolling! 🎲
