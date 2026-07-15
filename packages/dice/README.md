# @platonic-dice/dice

Persistent dice objects with roll history and TypeScript support. This package builds on top of `@platonic-dice/core` and provides classes such as `Die` which maintain roll history, validators, and utilities for consuming applications.

Version 2.1.0 adds new `rollModTest()` method - combining modifiers with test evaluation in a single method call.

## Installation

```bash
npm install @platonic-dice/dice
```

## Usage

CommonJS:

```js
const { Die } = require("@platonic-dice/dice");
const { DieType } = require("@platonic-dice/core");

const d20 = new Die(DieType.D20);
console.log(d20.roll());
console.log(d20.history("normal"));

// New in 2.1.0: rollModTest combines modifier and test evaluation
const result = d20.rollModTest((n) => n + 5, { testType: "skill", target: 15 });
console.log(`Modified result: ${result}`);
console.log(d20.history("modifiedTest"));
```

TypeScript:

```ts
import { Die } from "@platonic-dice/dice";
import { DieType } from "@platonic-dice/core";

const d20 = new Die(DieType.D20);
console.log(d20.roll());

// Apply modifier and evaluate against test conditions
const result = d20.rollModTest((n) => n + 5, {
  testType: "at_least",
  target: 15,
});
```

## Build

This package is written in TypeScript and compiles to `dist/`.

```bash
cd packages/dice
npm run build
```

## Release process

This package is published through the repository release workflow. Version bumps are handled automatically when a pull request carries a semver label (`semver/patch`, `semver/minor`, or `semver/major`).

You do not need to edit the package version manually; the workflow updates it for you before the package is published from `main`.

## License

MIT — see the repository `LICENSE` file.
