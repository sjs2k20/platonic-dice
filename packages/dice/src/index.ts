/**
 * @module @platonic-dice/dice
 * @description
 * Persistent dice objects with roll history and TypeScript support.
 */

// Main Die class
export { Die } from "./die.js";

// Re-export core types and values that consumers will need
// Note: Import from default due to CommonJS/ESM interop
import core from "@platonic-dice/core";
export const { DieType, RollType } = core;
// rollModTest is available on core but not typed in dist-types, export directly
export const rollModTest = (core as any).rollModTest;
export type {
  DieTypeValue,
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
  RollTypeValue,
  TestTypeValue,
} from "@platonic-dice/core";

// Re-export dice-specific types
export type {
  RollRecord,
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
  ModifiedTestDieRollRecord,
} from "./types/roll-record.types.js";
