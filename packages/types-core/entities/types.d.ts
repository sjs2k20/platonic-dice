/**
 * @module @platonic-dice/core/src/entities/types
 * @description
 * Shared type definitions used across the entities module.
 */

import type { TestConditionsLike } from "./TestConditions";
import type { TestConditionsArrayInstance } from "./TestConditionsArray";
import type { OutcomeValue } from "./Outcome";

/**
 * Rule for aggregating dice test results.
 * Used by DiceTestConditions to evaluate multiple dice against conditions.
 */
export interface Rule {
  /** Type of rule to apply */
  type: "value_count" | "condition_count";
  /** Specific die value to count (for value_count rules) */
  value?: number;
  /** Index of condition to check (for condition_count rules) */
  conditionIndex?: number;
  /** Exact count required */
  exact?: number;
  /** Minimum count required */
  atLeast?: number;
  /** Maximum count allowed */
  atMost?: number;
}

/**
 * Result of evaluating multiple dice against test conditions.
 */
export interface DiceTestResult {
  /** Matrix of outcomes: for each die, an array of outcomes per condition */
  matrix: OutcomeValue[][];
  /** Count of successes per condition index */
  condCount: Record<number, number>;
  /** Count of each literal value rolled */
  valueCounts: Record<number, number>;
  /** Results of each rule evaluation */
  ruleResults: Array<{
    id: number;
    rule: Rule;
    count?: number;
    passed: boolean;
  }>;
  /** Whether all rules passed */
  passed: boolean;
}

/**
 * Input type for conditions in rollDiceTest.
 * Can be a DiceTestConditions instance, TestConditionsArray, or plain array.
 */
export type ConditionsInput =
  | import("./DiceTestConditions").DiceTestConditionsInstance
  | TestConditionsArrayInstance
  | TestConditionsLike[];

/**
 * Options for rollDiceTest function.
 */
export interface RollDiceTestOptions {
  /** Number of dice to roll */
  count?: number;
  /** Aggregation rules to apply */
  rules?: Rule[];
  /** Whether to use natural critical hits/failures */
  useNaturalCrits?: boolean;
}
