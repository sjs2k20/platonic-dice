# TestConditionsArray

Represents an ordered collection of `TestConditions` entries that can be evaluated together.

## Overview

`TestConditionsArray` normalises each element into a `TestConditions` instance and stores them in order. It is primarily used by `DiceTestConditions` and `rollDiceTest` for multi-condition, multi-die evaluation.

## Usage

```javascript
const {
  TestConditionsArray,
  TestType,
  DieType,
} = require("@platonic-dice/core");

const tcArray = new TestConditionsArray(
  [
    { testType: TestType.AtLeast, target: 4 },
    { testType: TestType.Exact, target: 6 },
  ],
  DieType.D6,
);

console.log(tcArray.toArray().length); // 2
```

## API

### Constructor

```typescript
new TestConditionsArray(
  arr?: Array<TestConditionsInstance | TestConditionsLike>,
  defaultDieType?: DieTypeValue
)
```

### Methods

```typescript
evaluateEach(
  value: number,
  evaluator: (value: number, tc: TestConditionsInstance) => string
): string[]

toArray(): TestConditionsInstance[]
```

## Notes

- Each array element can be either:
  - a `TestConditions` instance, or
  - a plain object that will be normalised.
- Plain objects require a die type either:
  - on the object (`dieType`), or
  - via constructor `defaultDieType`.

## See Also

- [`TestConditions`](./TestConditions.md)
- [`DiceTestConditions`](./DiceTestConditions.md)
- [`rollDiceTest`](../rollDiceTest.md)
