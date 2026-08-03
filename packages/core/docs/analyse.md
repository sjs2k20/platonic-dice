# analyse

Use `analyse(expression)` when you want a deterministic probability overview for a DSL expression instead of executing a random roll.

## Overview

`analyse(expression)` is the expression-first analysis entry point. It evaluates the same DSL grammar as `roll(expression)`, but returns analysis data rather than a single execution result.

```javascript
const { analyse } = require("@platonic-dice/core");

const analysis = analyse("1D20 GET atLeast 15");
console.log(analysis);
```

## API

### Function Signature

```typescript
analyse(expression: string): unknown
```

### Parameters

- **expression**: A DSL expression string, including any test clauses you want to evaluate.

### Returns

A structured analysis object describing the executed expression and its test outcome. The common shape is:

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

### Basic analysis

```javascript
const { analyse } = require("@platonic-dice/core");

const analysis = analyse("1D20 GET atLeast 15");
console.log(analysis);
```

### Aggregate clause analysis

```javascript
const { analyse } = require("@platonic-dice/core");

const analysis = analyse("3D6 GET atLeast 2x 5+ AND total >= 15");
console.log(analysis);
```

## Notes

- `analyse(expression)` is the preferred analysis API for new code.
- It must include a `GET` clause; plain arithmetic expressions are not valid analysis inputs.
- The older `analyseTest` helper remains available as a compatibility entry point for imperative-style usage.
- Use `roll(expression)` when you want a concrete execution result, and `analyse(expression)` when you want structured analysis information.

## See Also

- [`roll`](./roll.md) - Execute the same DSL expression
- [package README](../README.md) - Broader package overview and installation notes
