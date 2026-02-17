declare module "@platonic-dice/core" {
  export * from "@platonic-dice/types-core/core";
  import * as Core from "@platonic-dice/types-core/core";
  const core: typeof Core;
  export default core;
}

declare module "@platonic-dice/core/entities" {
  export * from "@platonic-dice/types-core/entities";
}
