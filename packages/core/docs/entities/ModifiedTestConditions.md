# ModifiedTestConditions

Validates test conditions against the achievable range of a modified roll.

## Overview

`ModifiedTestConditions` is similar to [`TestConditions`](./TestConditions.md), but it validates conditions against the range produced by `dieType + modifier`.

Example: with `d6` and `+10`, the achievable range is `11..16`, so `target: 15` is valid.

## Usage

```javascript
const {
  ModifiedTestConditions,
  TestType,
  DieType,
  rollModTest,
} = require("@platonic-dice/core");

const conditions = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D6,
  (n) => n + 10,
);

const result = rollModTest(DieType.D6, (n) => n + 10, conditions);
console.log(result);
```

## API

### Constructor

```typescript
new ModifiedTestConditions(
  testType: TestTypeValue,
  conditions: Conditions,
  dieType: DieTypeValue,
  modifier: RollModifierLike
)
```

### Properties

```typescript
class ModifiedTestConditions {
  testType: TestTypeValue;
  conditions: Conditions;
  dieType: DieTypeValue;
  modifier: RollModifierInstance;
  modifiedRange: { min: number; max: number };
}
```

## Notes

- Use this when your target/range may exceed the base die faces.
- Plain objects with `rollModTest` are often enough; this class is useful when you want explicit pre-validation.
- Natural crit behavior still evaluates natural min/max on the base die.

## See Also

- [`TestConditions`](./TestConditions.md)
- [`rollModTest`](../rollModTest.md)
- [`analyseModTest`](../analyseModTest.md)
