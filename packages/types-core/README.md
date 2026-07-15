# @platonic-dice/types-core

Type definitions for @platonic-dice/core.

This package provides the TypeScript surface for the pure JS core package.

Install this alongside the runtime package:

```bash
pnpm add @platonic-dice/core @platonic-dice/types-core
```

## Release process

This package follows the same release workflow as the other publishable packages. Add a semver label to the pull request that changes it, and the repository workflow will bump the version automatically before the release is published from `main`.

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
