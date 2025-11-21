// Convenience type re-exports for consumers. This file points at the generated
// declaration files in `dist/entities` so TypeScript users can import type
// aliases directly from the package root via the `types` field.

export type {
  RollModifierFunction,
  RollModifierInstance,
} from "./dist/entities/RollModifier";
export type { OutcomeValue } from "./dist/entities/Outcome";
export type { TestConditionsInstance } from "./dist/entities/TestConditions";
export type { RollTypeValue } from "./dist/entities/RollType";
export type { TestTypeValue } from "./dist/entities/TestType";
export type { DieTypeValue } from "./dist/entities/DieType";

// Re-export other commonly used entity types
export * from "./dist/entities/index";

// Re-export top-level runtime APIs (roll helpers) so consumers can import
// functions like `roll`, `rollMod`, and `rollTest` from the package root.
export * from "./dist/roll";
export * from "./dist/rollMod";
export * from "./dist/rollDice";
export * from "./dist/rollDiceMod";
export * from "./dist/rollTest";
export * from "./dist/rollModTest";
export * from "./dist/analyseTest";
export * from "./dist/analyseModTest";

// The `rollMod`/`rollTest`/`rollModTest` d.ts files are emitted using a CommonJS `export =`
// shape which doesn't always expose named exports for consumers under some
// moduleResolution strategies. Provide explicit ESM-style type declarations
// here so TypeScript imports like `import { rollMod } from '@platonic-dice/core'`
// resolve correctly.
export function rollMod(
  dieType: import("./dist/entities/DieType").DieTypeValue,
  modifier:
    | import("./dist/entities/RollModifier").RollModifierFunction
    | import("./dist/entities/RollModifier").RollModifierInstance,
  rollType?: import("./dist/entities/RollType").RollTypeValue
): { base: number; modified: number };

export function rollTest(
  dieType: import("./dist/entities/DieType").DieTypeValue,
  testConditions:
    | import("./dist/entities/TestConditions").TestConditionsInstance
    | {
        testType: import("./dist/entities/TestType").TestTypeValue;
        [k: string]: any;
      },
  rollType?: import("./dist/entities/RollType").RollTypeValue
): { base: number; outcome: import("./dist/entities/Outcome").OutcomeValue };

export function rollModTest(
  dieType: import("./dist/entities/DieType").DieTypeValue,
  modifier:
    | import("./dist/entities/RollModifier").RollModifierFunction
    | import("./dist/entities/RollModifier").RollModifierInstance,
  testConditions:
    | import("./dist/entities/TestConditions").TestConditionsInstance
    | {
        testType: import("./dist/entities/TestType").TestTypeValue;
        [k: string]: any;
      },
  rollType?: import("./dist/entities/RollType").RollTypeValue,
  options?: { useNaturalCrits?: boolean }
): {
  base: number;
  modified: number;
  outcome: import("./dist/entities/Outcome").OutcomeValue;
};
