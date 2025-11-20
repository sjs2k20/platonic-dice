# @platonic-dice/core

Core JavaScript/TypeScript library providing dice-roll logic, modifiers, and test evaluation for tabletop RPGs.

This package contains the pure logic used by higher-level packages (for example `@platonic-dice/dice`). It exports rolling helpers, entities (die types, roll types, outcomes), and utility functions.

## Installation

Install from npm:

```bash
npm install @platonic-dice/core
```

## Quick usage

CommonJS:

```js
const { roll, rollDice, DieType, RollType } = require('@platonic-dice/core');

console.log( roll(DieType.D20) );
console.log( rollDice(DieType.D6, { count: 3 }) );
```

ESM / TypeScript:

```ts
import { roll, DieType } from '@platonic-dice/core';
console.log( roll(DieType.D20) );
```

## Build & Test

This package's sources live under `src/`. To run tests or build from the monorepo root:

```bash
# from repo root
npm run build
npm test
```

Or run package-local scripts:

```bash
cd packages/core
# run unit tests
npm test
```

## Contributing

See the repository root `README.md` for contribution guidelines. Keep changes backwards-compatible where possible and include tests.

## License

MIT — see the repository `LICENSE` file.
