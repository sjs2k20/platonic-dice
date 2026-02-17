# rollModTest

Rolls a die with a modifier and evaluates the result against test conditions, returning base roll, modified value, and outcome.

## Overview

`rollModTest` combines [`rollMod`](./rollMod.md) (modifiers) with [`rollTest`](./rollTest.md) (test conditions) into a single function. While `rollMod` returns `{ base, modified }` and `rollTest` returns `{ base, outcome }`, `rollModTest` applies a modifier to a roll and then evaluates the modified result against test conditions.

This is the primary function for skill checks, saving throws, and ability tests where you need to:

1. Roll a die
2. Apply a bonus/penalty
3. Evaluate if the modified result succeeds

**Key Feature**: Unlike `rollTest` which validates against the base die range (1-6 for d6), `rollModTest` validates against the **achievable modified range**. This means you can use targets outside the base die range when modifiers extend it.

Examples:

- D6 (1-6) with +10 modifier has achievable range 11-16, so `target: 15` is valid
- D20 (1-20) with -5 modifier has achievable range -4 to 15, so `target: 0` is valid
- D6 (1-6) with ×2 modifier has achievable range 2-12, so `target: 8` is valid

## Usage

```javascript
const { rollModTest, DieType, TestType } = require("@platonic-dice/core");

// Skill check: d20 + 5 vs DC 15
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(result.base); // 12 (raw roll)
console.log(result.modified); // 17 (after +5)
console.log(result.outcome); // "success"
```

## API

### Function Signature

```typescript
rollModTest(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  testConditions: TestConditionsInstance | { testType: TestTypeValue, ...conditions },
  rollType?: RollTypeValue,
  options?: { useNaturalCrits?: boolean }
): { base: number, modified: number, outcome: OutcomeValue }
```

### Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`)
- **modifier**: Function `(n) => number` or `RollModifier` instance to apply to the roll
- **testConditions**: Either:
  - A `ModifiedTestConditions` instance
  - A plain object with `testType` and condition properties
- **rollType** _(optional)_: `RollType.Advantage` or `RollType.Disadvantage`
- **options** _(optional)_: Configuration object
  - **useNaturalCrits**: If `true`, natural max/min rolls trigger critical outcomes for Skill tests. If not specified, defaults to `true` for Skill tests and `false` for all others.

### Returns

Object with three properties:

- **base**: The raw die roll
- **modified**: The roll after applying the modifier
- **outcome**: One of `Outcome.Success`, `Outcome.Failure`, `Outcome.CriticalSuccess`, or `Outcome.CriticalFailure`

## Examples

### How rollModTest Builds on Other Functions

```javascript
// roll() returns a simple number
const oneD20 = roll(DieType.D20);
// 14

// rollMod() adds modifier, returns { base, modified }
const modRoll = rollMod(DieType.D20, (n) => n + 5);
// { base: 14, modified: 19 }

// rollTest() evaluates condition, returns { base, outcome }
const testRoll = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
// { base: 14, outcome: "failure" }

// rollModTest() combines both: modifier + evaluation
const modTestRoll = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});
// { base: 14, modified: 19, outcome: "success" }
// Rolled 14, added 5 = 19, checked if 19 >= 15 → success
```

### Basic Test Types

```javascript
// AtLeast: modified value ≥ target
const abilityCheck = rollModTest(DieType.D20, (n) => n + 3, {
  testType: TestType.AtLeast,
  target: 15,
});

// AtMost: modified value ≤ target
const percentileCheck = rollModTest(DieType.D20, (n) => n - 2, {
  testType: TestType.AtMost,
  target: 10,
});

// Exact: modified value = target
const exactRoll = rollModTest(DieType.D6, (n) => n + 2, {
  testType: TestType.Exact,
  target: 5,
});

// Within: min ≤ modified value ≤ max
const rangeCheck = rollModTest(DieType.D10, (n) => n + 5, {
  testType: TestType.Within,
  min: 10,
  max: 15,
});

// InList: modified value in array
const specificRoll = rollModTest(DieType.D8, (n) => n + 1, {
  testType: TestType.InList,
  values: [3, 6, 9],
});

// Skill: threshold with critical ranges
const skillCheck = rollModTest(DieType.D20, (n) => n + 4, {
  testType: TestType.Skill,
  target: 12, // Success threshold
  critical_success: 24, // Crit if ≥24 (max: 20+4=24)
  critical_failure: 5, // Crit fail if ≤5 (min: 1+4=5)
});
```

### Extended Range Examples

The achievable modified range allows targets outside the base die range:

```javascript
// D6 (1-6) + 10 = range 11-16
const boostedD6 = rollModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15, // Valid! 15 is within 11-16
});
console.log(`Rolled ${boostedD6.base}, modified to ${boostedD6.modified}`);
// Base: 5, Modified: 15 → success

// D20 (1-20) - 5 = range -4 to 15
const penalisedD20 = rollModTest(DieType.D20, (n) => n - 5, {
  testType: TestType.AtMost,
  target: 0, // Valid! 0 is within -4 to 15
});

// D6 (1-6) × 2 = range 2-12
const doubledD6 = rollModTest(DieType.D6, (n) => n * 2, {
  testType: TestType.Exact,
  target: 8, // Valid! 8 is within 2-12
});
```

### Using RollModifier Instance

```javascript
const { RollModifier } = require("@platonic-dice/core");

const bonus = new RollModifier((n) => n + 3);
const result = rollModTest(DieType.D20, bonus, {
  testType: TestType.AtLeast,
  target: 15,
});

// Capped modifier
const cappedBonus = new RollModifier((n) => Math.min(n + 7, 20));
const capped = rollModTest(DieType.D20, cappedBonus, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 20,
  critical_failure: 8,
});
```

### With Advantage and Disadvantage

```javascript
const { RollType } = require("@platonic-dice/core");

// Advantage: rolls twice, picks better outcome
const advantage = rollModTest(
  DieType.D20,
  (n) => n + 2,
  { testType: TestType.AtLeast, target: 15 },
  RollType.Advantage,
);

// Disadvantage: rolls twice, picks worse outcome
const disadvantage = rollModTest(
  DieType.D10,
  (n) => n - 3,
  { testType: TestType.AtMost, target: 5 },
  RollType.Disadvantage,
);
```

## Practical Use Cases

### Ability Checks

```javascript
// Strength check (d20 + STR modifier)
const strCheck = rollModTest(DieType.D20, (n) => n + 4, {
  testType: TestType.AtLeast,
  target: 15, // DC 15
});
console.log(`STR check: ${strCheck.outcome}`);

// Dexterity save with advantage
const dexSave = rollModTest(
  DieType.D20,
  (n) => n + 3,
  { testType: TestType.AtLeast, target: 12 },
  RollType.Advantage,
);
```

### Skill Tests with Criticals

```javascript
// Acrobatics check with proficiency
const acrobatics = rollModTest(DieType.D20, (n) => n + 7, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 27, // Max: 20+7=27
  critical_failure: 8, // Min: 1+7=8
});

if (acrobatics.outcome === "critical_success") {
  console.log("Spectacular success!");
} else if (acrobatics.outcome === "critical_failure") {
  console.log("Spectacular failure!");
}
```

### Complex Modifiers

```javascript
// Conditional modifier based on circumstances
const situationalMod = (n) => {
  const base = n + 5; // Proficiency + ability
  return base >= 10 ? base + 2 : base; // +2 if already high
};

const result = rollModTest(DieType.D20, situationalMod, {
  testType: TestType.AtLeast,
  target: 18,
});
```

## Notes

- **Builds on [`rollMod`](./rollMod.md) and [`rollTest`](./rollTest.md)**: Combines modifier application with outcome evaluation
- The **modifier is applied first**, then the modified value is evaluated against test conditions
- Test condition targets are validated against the **achievable modified range**, not just the base die faces
  - Achievable range = applying modifier to minimum (1) and maximum (die faces) values
  - Example: D6 (1-6) with +10 → range 11-16
  - Example: D20 (1-20) with -5 → range -4 to 15
- **Natural Crits**: Default behavior varies by test type
  - For `Skill` tests: Natural crits are **enabled by default** (`useNaturalCrits` defaults to `true`)
  - For other test types: Natural crits are **disabled by default** (`useNaturalCrits` defaults to `false`)
  - Can be explicitly controlled via the `useNaturalCrits` option
  - When enabled for Skill tests: natural max → `CriticalSuccess`, natural 1 → `CriticalFailure`
- **Advantage/Disadvantage**: Rolls twice and compares **final outcomes**, not just base rolls
  - Each roll is fully evaluated (modifier applied, outcome determined, natural crits checked)
  - Outcomes are ranked: CriticalFailure (0) < Failure (1) < Success (2) < CriticalSuccess (3)
  - Advantage picks the result with the better outcome
  - Disadvantage picks the result with the worse outcome
- For **single die with tests (no modifier)**, use [`rollTest`](./rollTest.md) instead
- For **single die with modifiers (no test)**, use [`rollMod`](./rollMod.md) instead
- For more details on advanced features, see [`rollModTest Advanced Features`](./rollModTest-advanced-features.md)

## See Also

- [`roll`](./roll.md) - Roll a single die
- [`rollMod`](./rollMod.md) - Roll with modifiers (no test evaluation)
- [`rollTest`](./rollTest.md) - Roll with test conditions (no modifiers)
- [`rollModTest Advanced Features`](./rollModTest-advanced-features.md) - Detailed guide on natural crits and outcome-based advantage
- [`RollModifier`](./entities/RollModifier.md) - Modifier class documentation
- [`ModifiedTestConditions`](./entities/ModifiedTestConditions.md) - Modified range validation
- [`TestConditions`](./entities/TestConditions.md) - Test conditions documentation
- [`TestType`](./entities/TestType.md) - Test type enumeration
- [`Outcome`](./entities/Outcome.md) - Outcome enumeration
