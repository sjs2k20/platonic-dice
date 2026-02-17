# rollDiceTest

Rolls multiple dice and evaluates each die against one or more test conditions, then applies aggregate rules.

## Overview

`rollDiceTest` is the multi-die counterpart to [`rollTest`](./rollTest.md). It rolls a pool of dice, evaluates each roll against a `TestConditionsArray`, and returns aggregate counts/rule checks through `DiceTestConditions`.

Use this when your rule is about a whole dice pool, for example:

- "At least 3 dice are 4+"
- "At least one die is exactly 6"
- "At least 2 dice pass condition #1"

## Usage

```javascript
const { rollDiceTest, DieType, TestType } = require("@platonic-dice/core");

const result = rollDiceTest(
  DieType.D6,
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  {
    count: 5,
    rules: [
      { type: "condition_count", conditionIndex: 0, atLeast: 3 },
      { type: "condition_count", conditionIndex: 1, atLeast: 1 },
    ],
  },
);

console.log(result.base.array);
console.log(result.result.condCount);
console.log(result.result.passed);
```

## API

### Function Signature

```typescript
rollDiceTest(
  dieType: DieTypeValue,
  conditions:
    | DiceTestConditions
    | TestConditionsArray
    | TestConditionsLike[],
  options?: {
    count?: number;
    rules?: Rule[];
    useNaturalCrits?: boolean;
  }
): {
  base: { array: number[]; sum: number };
  result: {
    matrix: string[][];
    condCount: Record<number, number>;
    valueCounts: Record<number, number>;
    ruleResults: Array<{ id: number; rule: Rule; count?: number; passed: boolean }>;
    passed: boolean;
  };
}
```

## Options

- `count` (default `1`): number of dice to roll.
- `rules`: aggregate checks evaluated after all dice are tested.
- `useNaturalCrits`: forwarded to per-condition evaluators.

## Rule Types

- `value_count`: checks how many dice equal a specific raw value.
- `condition_count`: checks how many dice passed a condition index.

Thresholds on each rule support:

- `exact`
- `atLeast`
- `atMost`

If no threshold is provided, default behavior is `atLeast: 1`.

## Returns

- `base.array`: rolled dice values.
- `base.sum`: sum of rolled dice.
- `result.matrix`: per-die outcomes across all conditions.
- `result.condCount`: pass counts per condition index.
- `result.valueCounts`: raw value frequency map.
- `result.ruleResults`: pass/fail for each aggregate rule.
- `result.passed`: overall boolean (`true` if all rules passed).

## See Also

- [`rollDice`](./rollDice.md)
- [`rollTest`](./rollTest.md)
- [`entities/TestConditionsArray`](./entities/TestConditionsArray.md)
- [`entities/DiceTestConditions`](./entities/DiceTestConditions.md)
