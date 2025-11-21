# Platonic Dice

A monorepo containing two publishable packages:

- `@platonic-dice/core` — pure JavaScript/TypeScript dice-roll logic, entities and utilities.
- `@platonic-dice/dice` — higher-level persistent dice objects (history, validators, TypeScript types) built on `@platonic-dice/core`.

This repository is structured as an npm workspace. Each package lives under `packages/<name>` and has its own `package.json`, README and build/test scripts.

## Install

Install a package from npm (after publishing):

```bash
# core
npm install @platonic-dice/core

# dice
npm install @platonic-dice/dice
```

Locally (development):

```bash
# install workspace dev dependencies and link packages
npm install

# build all packages
npm run build

# run tests across workspaces
npm test
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
  `Base: ${result.base}, Modified: ${result.modified}, Outcome: ${result.outcome}`
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

We publish packages by tagging the repository and letting GitHub Actions run the release workflow.

1.  Bump package versions in the packages you want to publish (e.g. `packages/core/package.json` and `packages/dice/package.json`) to the desired release (e.g. `1.0.0`).
2.  Commit the changes and create a git tag: `git tag v1.0.0`.
3.  Push the tag: `git push origin v1.0.0`.

The workflow at `.github/workflows/publish.yml` looks for the tag version and publishes any package in `packages/*` whose `package.json` version matches that tag. The workflow expects a repo secret named `NPM_TOKEN` containing an npm granular token with `read & write` permissions for the package scope.

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
