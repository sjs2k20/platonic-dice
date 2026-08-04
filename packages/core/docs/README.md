# @platonic-dice/core Documentation Index

This package's documentation is intentionally focused on the two primary entry points: `roll(expression)` for execution and `analyse(expression)` for exact, deterministic probability analysis.

> Note: `analyse(expression)` evaluates the complete outcome space for the expression, so it can be expensive for larger dice pools. On low-resource machines, it may take noticeable time and memory to compute.

## Primary entry points

- [roll](./roll.md) — execute a DSL expression and return a structured result
- [analyse](./analyse.md) — analyse the probabilities of a DSL expression

## Quick start

```javascript
const { roll, analyse } = require("@platonic-dice/core");

const executed = roll("2D6+5");
const analysis = analyse("1D20 GET atLeast 15");

console.log(executed);
console.log(analysis);
```

## Notes

These pages are intentionally concise. They cover the canonical expression-first API and leave the broader compatibility details to the package README.
