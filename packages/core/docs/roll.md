# roll

The canonical entry point for the expression-first runtime is `roll(expression)`. It accepts DSL strings such as `2D6+5`, `1D20ADV GET >= 15`, and `3D6 GET atLeast 2x 5+ AND total >= 15`, and returns a structured result object.

## Overview

Use `roll` when you want to execute a dice expression. If you want a deterministic probability analysis instead, use `analyse(expression)`.

```javascript
const { roll } = require("@platonic-dice/core");

const simple = roll("2D6+5");
const check = roll("1D20ADV GET >= 15");

console.log(simple);
console.log(check);
```

## API

### Function Signature

```typescript
roll(expression: string): unknown
```

### Parameters

- **expression**: A DSL expression string. Supported forms include:
  - arithmetic rolls such as `2D6+5` and `3D6x2`
  - advantage/disadvantage such as `1D20ADV` and `1D20DIS`
  - explicit tests such as `1D20ADV GET >= 15`
  - aggregate clauses such as `3D6 GET atLeast 2x 5+ AND total >= 15`

### Returns

A structured result object describing the executed expression. The common shape is:

- `expression`: the original DSL string
- `count`: the number of dice rolled
- `dieType`: the die type being used
- `rolls`: the raw die values
- `base`: the sum of the base rolls
- `modifier`: the applied modifier or multiplier
- `modifierType`: whether the modifier was additive or multiplicative
- `modified`: the final adjusted total
- `rollMode`: present for advantage/disadvantage expressions
- `test`: present when the expression includes a `GET` clause

## Examples

### Simple roll

```javascript
const { roll } = require("@platonic-dice/core");

const result = roll("1D20");
console.log(result);
```

### Test expression

```javascript
const { roll } = require("@platonic-dice/core");

const result = roll("1D20ADV GET >= 15");
console.log(result);
```

## Notes

- `roll(expression)` is the preferred API for new code.
- The legacy helper surface (`rollAdv`, `rollDis`, `rollD4`, and friends) remains available as compatibility helpers, but the DSL entry point is the primary contract.
- For probability analysis, use [`analyse`](./analyse.md).

## See Also

- [`analyse`](./analyse.md) - Probability analysis for the same DSL expressions
- [package README](../README.md) - Broader package overview and installation notes
