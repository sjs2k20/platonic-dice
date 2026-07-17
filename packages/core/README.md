# @platonic-dice/core

Core JavaScript/TypeScript library providing dice-roll logic, modifiers, and test evaluation for tabletop RPGs.

This package is published independently to npm as `@platonic-dice/core`. Its npm tarball contains this package's distributable files and metadata, not the whole monorepo. It exports rolling helpers including `roll`, `rollMod`, `rollTest`, and `rollModTest` (combining modifiers with test evaluation), entities (die types, roll types, outcomes), and utility functions.

## Installation

Install from npm:

```bash
npm install @platonic-dice/core @platonic-dice/types-core
```

## Quick usage

CommonJS:

```js
const {
  roll,
  rollDice,
  rollModTest,
  DieType,
  RollType,
} = require("@platonic-dice/core");

console.log(roll(DieType.D20));
console.log(rollDice(DieType.D6, { count: 3 }));

// rollModTest combines modifiers with test evaluation
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: "skill",
  target: 15,
});
console.log(
  `Roll: ${result.base}, Modified: ${result.modified}, Outcome: ${result.outcome}`,
);
```

ESM / TypeScript:

```ts
import { roll, rollModTest, DieType } from "@platonic-dice/core";
console.log(roll(DieType.D20));

// Combine modifiers with test evaluation
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: "at_least",
  target: 15,
});
```

## Build & Test

This package's sources live under `src/`. To run tests or build from the monorepo root:

```bash
# from repo root
pnpm build
pnpm test
```

Or run package-local scripts:

```bash
# run unit tests
pnpm --filter @platonic-dice/core test
```

### Type Testing

Type definitions are provided by the separate `@platonic-dice/types-core` package. To test the type surface:

```bash
cd packages/types-core
pnpm run test:types
```

## Examples

The `examples/` directory contains comprehensive examples for all the major functions. Run them to see the library in action:

```bash
# Run all core examples (roll, rollDice, rollMod, rollDiceMod, rollTest, rollModTest)
pnpm --filter @platonic-dice/core examples

# Run all examples including advanced features and analysis functions
pnpm --filter @platonic-dice/core examples:all

# Run individual example files
pnpm --filter @platonic-dice/core examples:roll
pnpm --filter @platonic-dice/core examples:rollDice
pnpm --filter @platonic-dice/core examples:rollMod
pnpm --filter @platonic-dice/core examples:rollDiceMod
pnpm --filter @platonic-dice/core examples:rollTest
pnpm --filter @platonic-dice/core examples:rollModTest
pnpm --filter @platonic-dice/core examples:rollModTest:advanced
pnpm --filter @platonic-dice/core examples:analyseTest
pnpm --filter @platonic-dice/core examples:analyseModTest
pnpm --filter @platonic-dice/core examples:entities
```

Each example demonstrates practical usage patterns and outputs results to help you understand the API.

## Release process

This package is published independently from the other packages in the monorepo. The publish workflow releases only this package when its own version changes.

Versions are bumped after a pull request is merged to `main`. A `develop` to `main` release pull request requires one semver label (`semver/patch`, `semver/minor`, or `semver/major`); hotfix and maintenance pull requests default to a patch release. You do not need to edit the package version manually.

## Contributing

See the repository root `README.md` for contribution guidelines. Keep changes backwards-compatible where possible and include tests.

## License

MIT — see the repository `LICENSE` file.
