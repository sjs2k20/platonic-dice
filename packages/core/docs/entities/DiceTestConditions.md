# DiceTestConditions

Aggregates multiple test conditions across a dice pool and evaluates rule-based thresholds.

## Overview

`DiceTestConditions` combines:

- a `count` (expected number of dice),
- a `TestConditionsArray` (conditions applied to each die), and
- aggregate `rules` (value/count thresholds).

It provides evaluator functions used directly or through `rollDiceTest`.

## Usage

```javascript
const {
  DiceTestConditions,
  TestConditionsArray,
  TestType,
  DieType,
} = require("@platonic-dice/core");

const conditions = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  DieType.D6,
);

const dtc = new DiceTestConditions({
  count: 4,
  conditions,
  rules: [
    { type: "condition_count", conditionIndex: 0, atLeast: 2 },
    { type: "value_count", value: 6, atLeast: 1 },
  ],
});

const result = dtc.evaluateRolls([6, 5, 2, 1]);
console.log(result.passed);
```

## API

### Constructor

```typescript
new DiceTestConditions(opts: {
  count: number;
  conditions: TestConditionsArray | TestConditionsLike[];
  rules?: Rule[];
  dieType?: DieTypeValue;
})
```

### Rule Type

```typescript
type Rule = {
  type: "value_count" | "condition_count";
  value?: number;
  conditionIndex?: number;
  exact?: number;
  atLeast?: number;
  atMost?: number;
};
```

### Methods

```typescript
toEvaluator(
  modifier?: RollModifierInstance,
  useNaturalCrits?: boolean
): (rolls: number[]) => {
  matrix: string[][];
  condCount: Record<number, number>;
  valueCounts: Record<number, number>;
  ruleResults: Array<{ id: number; rule: Rule; count?: number; passed: boolean }>;
  passed: boolean;
}

evaluateRolls(
  rolls: number[],
  modifier?: RollModifierInstance,
  useNaturalCrits?: boolean
): ReturnType<ReturnType<DiceTestConditions["toEvaluator"]>>
```

## Notes

- `count` must match the actual roll array length.
- `condition_count` rules reference condition index in `TestConditionsArray`.
- Rule pass criteria support `exact`, `atLeast`, `atMost` (or default `atLeast: 1`).

## See Also

- [`TestConditionsArray`](./TestConditionsArray.md)
- [`rollDiceTest`](../rollDiceTest.md)
