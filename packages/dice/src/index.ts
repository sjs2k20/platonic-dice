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
} from "./types/roll-record.types.js";
