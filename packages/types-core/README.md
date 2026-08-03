# @platonic-dice/types-core

Type definitions for `@platonic-dice/core`.

This package is published independently to npm as `@platonic-dice/types-core`. Its npm tarball contains this package's declaration files and metadata, not the whole monorepo. It provides the TypeScript surface for the pure JavaScript core package, including the expression-first `roll(expression)` / `analyse(expression)` result contract and the compatibility helper overloads.

The root-level `.d.ts` files and `entities/` declarations are committed source files. This package has no compilation step and no generated `dist/` directory.

Install this alongside the runtime package:

```bash
pnpm add @platonic-dice/core @platonic-dice/types-core
```

## Release process

This package is published independently from the other packages in the monorepo. The publish workflow releases only this package when its own version changes.

Versions are bumped after a pull request is merged to `main`. A `develop` to `main` release pull request requires one semver label (`semver/patch`, `semver/minor`, or `semver/major`); hotfix and maintenance pull requests default to a patch release. You do not need to edit the package version manually.

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
