# @platonic-dice/dice

Persistent dice objects with roll history and TypeScript support. This package is published independently to npm as `@platonic-dice/dice`. Its npm tarball contains this package's distributable files and metadata, not the whole monorepo. It builds on top of `@platonic-dice/core` and provides classes such as `Die` that preserve history while delegating execution to the core expression-first runtime, including `rollModTest()` for combined modifier/test evaluation.

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

// rollModTest combines modifier and test evaluation
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

### @platonic-dice/core

The core package is a pure JavaScript module that exposes the expression-first roll runtime and compatibility helpers. It is published separately at `@platonic-dice/core` and is pulled in as a direct dependency of this package.

### Type Definitions

Type definitions are maintained in the separate
`@platonic-dice/types-core` package. It is pulled in as a dev dependency
of this package.

## Build

This package is written in TypeScript and compiles to `dist/`, which contains its JavaScript runtime, generated declarations, and declaration maps. The npm tarball contains that `dist/` directory, plus package metadata, the README, and the license.

```bash
pnpm --filter @platonic-dice/dice build
```

## Release process

This package is published independently from the other packages in the monorepo. The publish workflow releases only this package when its own version changes.

Versions are bumped after a pull request is merged to `main`. A `develop` to `main` release pull request requires one semver label (`semver/patch`, `semver/minor`, or `semver/major`); hotfix and maintenance pull requests default to a patch release. You do not need to edit the package version manually.

During publishing, pnpm converts this package's `workspace:^` dependency on `@platonic-dice/core` into an ordinary caret semver range in the published package metadata. `@platonic-dice/types-core` is used only for local compilation and is not a runtime dependency of this package.

## License

MIT — see the repository `LICENSE` file.
