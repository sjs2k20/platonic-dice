# @platonic-dice/dice

Persistent dice objects with roll history and TypeScript support. This package builds on top of `@platonic-dice/core` and provides classes such as `Die` which maintain roll history, validators, and utilities for consuming applications.

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
console.log(d20.history.getAll());
```

TypeScript:

```ts
import { Die } from "@platonic-dice/dice";
import { DieType } from "@platonic-dice/core";

const d20 = new Die(DieType.D20);
console.log(d20.roll());
```

## Build

This package is written in TypeScript and compiles to `dist/`.

```bash
cd packages/dice
npm run build
```

## Notes on publishing

- This package depends on `@platonic-dice/core`. When publishing both packages in the same release, ensure both `package.json` versions are bumped to the same release tag (the repository's release workflow can publish matching versions automatically).
- The package is scoped (`@platonic-dice/dice`) — make sure the npm scope exists for your account or organization before publishing.

## License

MIT — see the repository `LICENSE` file.
