# @platonic-dice/core Documentation Index

Complete documentation and examples for all exported modules.

## Core Functions

Rolling functions that return dice values and/or outcomes.

| Function      | Description                      | Documentation                           | Example                                                               |
| ------------- | -------------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| `roll`        | Roll a single die                | [docs/roll.md](./roll.md)               | [examples/roll-example.js](../examples/roll-example.js)               |
| `rollDice`    | Roll multiple dice               | [docs/rollDice.md](./rollDice.md)       | [examples/rollDice-example.js](../examples/rollDice-example.js)       |
| `rollMod`     | Roll single die with modifier    | [docs/rollMod.md](./rollMod.md)         | [examples/rollMod-example.js](../examples/rollMod-example.js)         |
| `rollDiceMod` | Roll multiple dice with modifier | [docs/rollDiceMod.md](./rollDiceMod.md) | [examples/rollDiceMod-example.js](../examples/rollDiceMod-example.js) |
| `rollTest`    | Roll with test conditions        | [docs/rollTest.md](./rollTest.md)       | [examples/rollTest-example.js](../examples/rollTest-example.js)       |
| `rollModTest` | Roll with modifier and test      | [docs/rollModTest.md](./rollModTest.md) | [examples/rollModTest-example.js](../examples/rollModTest-example.js) |

## Analysis Functions

"Dry run" functions that calculate probabilities without rolling.

| Function         | Description                         | Documentation                                 | Example                                                                     |
| ---------------- | ----------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `analyseTest`    | analyse test probabilities          | [docs/analyseTest.md](./analyseTest.md)       | [examples/analyseTest-example.js](../examples/analyseTest-example.js)       |
| `analyseModTest` | analyse modified test probabilities | [docs/analyseModTest.md](./analyseModTest.md) | [examples/analyseModTest-example.js](../examples/analyseModTest-example.js) |

## Entity Types

Core types and classes used throughout the package.

| Entity                   | Description            | Documentation                                                                   | Example                                                                                                       |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `DieType`                | Die types (D4-D20)     | [docs/entities/DieType.md](./entities/DieType.md)                               | [examples/entities/DieType-example.js](../examples/entities/DieType-example.js)                               |
| `Outcome`                | Test outcomes          | [docs/entities/Outcome.md](./entities/Outcome.md)                               | [examples/entities/Outcome-example.js](../examples/entities/Outcome-example.js)                               |
| `RollModifier`           | Modifier functions     | [docs/entities/RollModifier.md](./entities/RollModifier.md)                     | [examples/entities/RollModifier-example.js](../examples/entities/RollModifier-example.js)                     |
| `RollType`               | Advantage/disadvantage | [docs/entities/RollType.md](./entities/RollType.md)                             | [examples/entities/RollType-example.js](../examples/entities/RollType-example.js)                             |
| `TestType`               | Types of tests         | [docs/entities/TestType.md](./entities/TestType.md)                             | [examples/entities/TestType-example.js](../examples/entities/TestType-example.js)                             |
| `TestConditions`         | Test configuration     | [docs/entities/TestConditions.md](./entities/TestConditions.md)                 | [examples/entities/TestConditions-example.js](../examples/entities/TestConditions-example.js)                 |
| `ModifiedTestConditions` | Extended range tests   | [docs/entities/ModifiedTestConditions.md](./entities/ModifiedTestConditions.md) | [examples/entities/ModifiedTestConditions-example.js](../examples/entities/ModifiedTestConditions-example.js) |

## Quick Start

### Installation

```bash
npm install @platonic-dice/core
```

### Basic Usage

```javascript
const {
  roll,
  rollDice,
  rollTest,
  DieType,
  TestType,
} = require("@platonic-dice/core");

// Roll a single D20
const d20 = roll(DieType.D20);

// Roll 3d6
const stats = rollDice(DieType.D6, { count: 3 });

// Skill check (DC 15)
const check = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(`Roll: ${check.base}, Outcome: ${check.outcome}`);
```

## Documentation Structure

Each module has:

- **Overview**: What it does and why you'd use it
- **Usage**: Basic usage examples
- **API**: Function signatures and types
- **Examples**: Multiple scenarios demonstrating features
- **Use Cases**: Real-world applications
- **Notes**: Important behaviors and edge cases
- **See Also**: Related modules

## Running Examples

All example files can be run directly with Node.js from the package directory:

```bash
cd packages/core

# Use npm scripts (recommended)
npm run examples              # Run all core examples
npm run examples:all          # Run ALL examples including advanced
npm run examples:roll         # Run specific example
npm run examples:rollModTest:advanced

# Or run directly with node
node examples/roll-example.js
node examples/rollDice-example.js
node examples/rollMod-example.js
node examples/rollDiceMod-example.js
node examples/rollTest-example.js
node examples/rollModTest-example.js
node examples/rollModTest-advanced-features-example.js
node examples/analyseTest-example.js
node examples/analyseModTest-example.js

# Entity examples
node examples/entities/DieType-example.js
node examples/entities/Outcome-example.js
node examples/entities/RollModifier-example.js
node examples/entities/RollType-example.js
node examples/entities/TestType-example.js
node examples/entities/TestConditions-example.js
node examples/entities/ModifiedTestConditions-example.js
```

See the main [README.md](../README.md) for the complete list of npm example scripts.

## Common Patterns

### Attack Roll with Modifier

```javascript
const { rollModTest, DieType, TestType } = require("@platonic-dice/core");

const attack = rollModTest(
  DieType.D20,
  (n) => n + 7, // +3 STR, +4 Proficiency
  { testType: TestType.AtLeast, target: 16 }
);

if (attack.outcome === "critical_success") {
  console.log("Critical hit!");
}
```

### Advantage/Disadvantage

```javascript
const {
  roll,
  rollTest,
  DieType,
  RollType,
  TestType,
} = require("@platonic-dice/core");

// Roll with advantage
const adv = roll(DieType.D20, RollType.Advantage);

// Skill check with disadvantage
const disadv = rollTest(
  DieType.D20,
  { testType: TestType.Skill, target: 12 },
  { rollType: RollType.Disadvantage }
);
```

### Probability Analysis

```javascript
const {
  analyseTest,
  analyseModTest,
  DieType,
  TestType,
} = require("@platonic-dice/core");

// Without modifier
const basic = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(
  `Success rate: ${(basic.outcomeProbabilities.success * 100).toFixed(0)}%`
);

// With modifier
const modified = analyseModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(
  `With +5: ${(modified.outcomeProbabilities.success * 100).toFixed(0)}%`
);
```

## Advanced Topics

- **Natural Crits**: [rollModTest-advanced-features.md](./rollModTest-advanced-features.md)
- **Extended Range Validation**: [entities/ModifiedTestConditions.md](./entities/ModifiedTestConditions.md)
- **Modifier Stacking**: [entities/RollModifier.md](./entities/RollModifier.md)

## Package Constraints

- **Supported Dice**: D4, D6, D8, D10, D12, D20
- **D100 NOT supported**: This package explicitly excludes percentile dice
- **CommonJS**: Package uses CommonJS modules
- **Node.js**: Requires Node.js environment

## Testing

All functions are thoroughly tested with Jest:

```bash
npm test
```

Current test coverage: 289 passing tests

## TypeScript Support

Type definitions are available in `.d.ts` files throughout the package:

```typescript
import {
  roll,
  rollTest,
  DieType,
  TestType,
  Outcome,
  type RollResult,
  type TestResult,
} from "@platonic-dice/core";

const result: TestResult = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
```

## Contributing

See the main [README.md](../../README.md) for contribution guidelines.

## License

See [LICENSE](../../LICENSE) for details.
