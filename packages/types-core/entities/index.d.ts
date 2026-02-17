/**
 * @module @platonic-dice/core/entities
 * @description
 * Core entity definitions and type exports.
 */

// DieType
export { DieType, isValidDieType } from "./DieType";
export type { DieTypeKey, DieTypeValue } from "./DieType";

// Outcome
export { Outcome, isValidOutcome } from "./Outcome";
export type { OutcomeKey, OutcomeValue } from "./Outcome";

// RollType
export { RollType, isValidRollType } from "./RollType";
export type { RollTypeKey, RollTypeValue } from "./RollType";

// TestType
export { TestType, isValidTestType } from "./TestType";
export type { TestTypeKey, TestTypeValue } from "./TestType";

// RollModifier
export {
  RollModifier,
  isValidRollModifier,
  normaliseRollModifier,
} from "./RollModifier";
export type {
  RollModifierFunction,
  RollModifierInstance,
  RollModifierLike,
  DiceModifier,
} from "./RollModifier";

// TestConditions
export {
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
} from "./TestConditions";
export type {
  TestConditionsInstance,
  TestConditionsLike,
  Conditions,
  TargetConditions,
  SkillConditions,
  WithinConditions,
  SpecificListConditions,
} from "./TestConditions";

// TestConditionsArray
export { TestConditionsArray } from "./TestConditionsArray";
export type { TestConditionsArrayInstance } from "./TestConditionsArray";

// DiceTestConditions
export { DiceTestConditions } from "./DiceTestConditions";
export type { DiceTestConditionsInstance } from "./DiceTestConditions";

// ModifiedTestConditions
export {
  ModifiedTestConditions,
  areValidModifiedTestConditions,
  computeModifiedRange,
} from "./ModifiedTestConditions";
export type { ModifiedTestConditionsInstance } from "./ModifiedTestConditions";

// Shared types
export type {
  Rule,
  DiceTestResult,
  ConditionsInput,
  RollDiceTestOptions,
} from "./types";
