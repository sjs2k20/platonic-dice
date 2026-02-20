# @platonic-dice/core

Core JavaScript/TypeScript library providing dice-roll logic, modifiers, and test evaluation for tabletop RPGs.

This package contains the pure logic used by higher-level packages (for example `@platonic-dice/dice`). It exports rolling helpers including `roll`, `rollDice`, `rollMod`, `rollDiceMod`, `rollTest`, `rollModTest`, `rollDiceTest`, and `rollDiceModTest`, plus entities (die types, roll types, outcomes) and analysis utilities.

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
npm run build
npm test
```

Or run package-local scripts:

```bash
cd packages/core
# run unit tests
npm test
```

### Type Testing

Type definitions are provided by the separate `@platonic-dice/types-core` package. To test the type surface:

```bash
cd packages/types-core
pnpm run test:types
```

## Examples

The `examples/` directory contains comprehensive examples for all major functions. Run them to see the library in action:

```bash
# Run all core examples (roll, rollDice, rollMod, rollDiceMod, rollDiceModTest, rollTest, rollModTest, rollDiceTest)
npm run examples

# Run all examples including advanced features and analysis functions
npm run examples:all

# Run individual example files
npm run examples:roll
npm run examples:rollDice
npm run examples:rollMod
npm run examples:rollDiceMod
npm run examples:rollDiceModTest
npm run examples:rollTest
npm run examples:rollModTest
npm run examples:rollDiceTest
npm run examples:rollModTest:advanced
npm run examples:analyseTest
npm run examples:analyseModTest
npm run examples:entities
```

Each example demonstrates practical usage patterns and outputs results to help you understand the API.

## Contributing

See the repository root `README.md` for contribution guidelines. Keep changes backwards-compatible where possible and include tests.

## License

MIT — see the repository `LICENSE` file.
