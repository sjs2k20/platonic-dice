# RollModifier

Wraps a numeric modifier function used by roll APIs.

## Overview

`RollModifier` encapsulates a function `(n) => number` and provides a consistent object shape across APIs (`rollMod`, `rollDiceMod`, `rollModTest`).

You can pass either a `RollModifier` instance or a plain function in most places.

## Usage

```javascript
const { RollModifier, rollMod, DieType } = require("@platonic-dice/core");

const bonus = new RollModifier((n) => n + 3);
const result = rollMod(DieType.D20, bonus);

console.log(result.base, result.modified);
```

## API

### Constructor

```typescript
new RollModifier(fn: (n: number) => number)
```

### Properties and Methods

```typescript
class RollModifier {
  fn: (n: number) => number;
  apply(baseValue: number): number;
  validate(): void;
}
```

## Validation Rules

A valid modifier function:

- is a function,
- declares exactly one parameter,
- returns an integer-like number for numeric input.

## See Also

- [`rollMod`](../rollMod.md)
- [`rollDiceMod`](../rollDiceMod.md)
- [`rollModTest`](../rollModTest.md)
