# rollDiceModTest

Rolls multiple dice with modifiers, then evaluates aggregate test rules over the dice pool.

## Overview

`rollDiceModTest` combines [`rollDiceMod`](./rollDiceMod.md) with [`rollDiceTest`](./rollDiceTest.md):

1. roll a dice pool,
2. apply modifiers,
3. evaluate aggregate pass/fail rules.

This is useful when you need both modified totals _and_ pool-level success logic (for example: "at least 3 dice are 5+ after per-die modifiers").

**Important behavior:** test evaluation uses the per-die (`each`) modifier path. Net (`net`) modifiers affect only the returned total and do not change condition/rule evaluation.

## Usage

```javascript
const { rollDiceModTest, DieType, TestType } = require("@platonic-dice/core");

const result = rollDiceModTest(
  DieType.D6,
  {
    each: (n) => n + 1,
    net: (sum) => sum + 2,
  },
  [
    { testType: TestType.AtLeast, target: 5 },
    { testType: TestType.Exact, target: 6 },
  ],
  {
    count: 5,
    rules: [
      { type: "condition_count", conditionIndex: 0, atLeast: 3 },
      { type: "value_count", value: 6, atLeast: 1 },
    ],
  },
);

console.log(result.base.array);
console.log(result.modified.net.value);
console.log(result.result.passed);
```

## API

### Function Signature

```typescript
rollDiceModTest(
  dieType: DieTypeValue,
  modifier: RollModifierLike,
  conditions:
    | DiceTestConditions
    | TestConditionsArray
    | TestConditionsLike[],
  options?: {
    count?: number;
    rules?: Rule[];
    useNaturalCrits?: boolean;
  },
): {
  base: { array: number[]; sum: number };
  modified: {
    each: { array: number[]; sum: number };
    net: { value: number };
  };
  result: {
    matrix: string[][];
    condCount: Record<number, number>;
    valueCounts: Record<number, number>;
    ruleResults: Array<{ id: number; rule: Rule; count?: number; passed: boolean }>;
    passed: boolean;
  };
}
```

## Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`).
- **modifier**: Modifier input accepted by `rollDiceMod`.
  - Function `(sum) => number` (net modifier),
  - `RollModifier` instance,
  - Object `{ each?, net? }` for separate per-die and total modifiers.
- **conditions**: Condition input accepted by `rollDiceTest`.
  - `DiceTestConditions` instance,
  - `TestConditionsArray` instance,
  - or an array of `TestConditions`-like objects.
- **options** _(optional)_:
  - `count` (default `1`): number of dice to roll,
  - `rules`: aggregate rule checks,
  - `useNaturalCrits`: forwarded to per-condition evaluators.

## Returns

- `base`: raw rolled dice (`array`, `sum`).
- `modified`:
  - `each`: per-die modified array and sum,
  - `net.value`: final modified total.
- `result`: aggregate evaluation output from `DiceTestConditions`.
  - `matrix`, `condCount`, `valueCounts`, `ruleResults`, `passed`.

## Notes

- `result` evaluation is based on base rolls with the per-die modifier behavior.
- If you pass a single function or `RollModifier`, it is treated as a net modifier, so condition evaluation effectively uses unmodified die faces.
- If `conditions` is a `DiceTestConditions` instance, `options.count` must match `conditions.count`.

## See Also

- [`rollDiceMod`](./rollDiceMod.md)
- [`rollDiceTest`](./rollDiceTest.md)
- [`rollModTest`](./rollModTest.md)
- [`entities/DiceTestConditions`](./entities/DiceTestConditions.md)
