# @platonic-dice/core

Core JavaScript library for dice expressions, modifiers, and test evaluation in tabletop RPGs. Type declarations are supplied separately by `@platonic-dice/types-core`.

The canonical public API is the expression-first runtime exposed through `roll(expression)` and `analyse(expression)`. Compatibility helpers such as `rollMod`, `rollTest`, `rollModTest`, and `rollDiceModTest` remain available for existing imperative call sites.

## Installation

```bash
npm install @platonic-dice/core @platonic-dice/types-core
```

## Quick usage

```js
const { roll, analyse } = require("@platonic-dice/core");

console.log(roll("2D6+5"));
console.log(roll("1D20ADV GET >= 15"));
console.log(analyse("3D6 GET atLeast 2x 5+ AND total >= 15"));
```

Supported expression forms include:

- arithmetic rolls such as `2D6+5` and `3D6x2`
- advantage/disadvantage such as `1D20ADV` and `1D20DIS`
- explicit tests such as `1D20ADV GET >= 15`
- aggregate clauses such as `3D6 GET atLeast 2x 5+ AND total >= 15`

For analysis, `analyse(expression)` requires a `GET` clause so the input is a test-style expression rather than a plain arithmetic roll.

## Build & Test

```bash
# from repo root
pnpm build
pnpm test
```

Or run package-local tests:

```bash
pnpm --filter @platonic-dice/core test
```

## Documentation scope

The package documentation is intentionally focused on the two canonical entry points:

- [docs/roll.md](docs/roll.md) for executing expressions
- [docs/analyse.md](docs/analyse.md) for analysing their probabilities

The older helper-oriented APIs remain available for compatibility, but they are not described separately here so the public docs stay concise.

## Release process

This package is published independently from the other packages in the monorepo. The publish workflow releases only this package when its own version changes.

## License

MIT — see the repository `LICENSE` file.
