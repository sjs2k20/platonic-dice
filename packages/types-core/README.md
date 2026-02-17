# @types/platonic-dice\_\_core

Type definitions for @platonic-dice/core.

This package provides the TypeScript surface for the pure JS core package.

Install alongside the runtime package:

```bash
pnpm add @platonic-dice/core @types/platonic-dice__core
```

## Type Testing

This package includes type tests using `tsd` to validate the public API surface:

```bash
cd packages/types-core
pnpm run test:types
```

The tests verify that:

- All exported functions have correct signatures
- Type inference works as expected
- Invalid usage is properly rejected by TypeScript
