/**
 * @module @platonic-dice/core/src/analyseModTest
 */

import type { DieTypeValue } from "./entities/DieType";
import type { TestTypeValue } from "./entities/TestType";
import type { OutcomeValue } from "./entities/Outcome";
import type { TestConditionsInstance } from "./entities/TestConditions";
import type {
  RollModifierFunction,
  RollModifierInstance,
} from "./entities/RollModifier";

/**
 * Analysis result for a modified test configuration.
 */
export interface ModifiedTestAnalysis {
  /** Total number of possible die rolls */
  totalPossibilities: number;
  /** Count of each outcome type */
  outcomeCounts: Record<string, number>;
  /** Probability (0-1) of each outcome */
  outcomeProbabilities: Record<string, number>;
  /** Map of base roll to outcome */
  outcomesByRoll: Record<number, OutcomeValue>;
  /** Map of base roll to modified value */
  modifiedValuesByRoll: Record<number, number>;
  /** Array of all possible base roll values */
  rolls: number[];
  /** Base rolls grouped by their outcome */
  rollsByOutcome: Record<OutcomeValue, number[]>;
  /** Range of modified values achievable */
  modifiedRange: { min: number; max: number };
}

/**
 * Options for modified test analysis.
 */
export interface analyseModTestOptions {
  /**
   * If true, natural max/min rolls trigger critical outcomes.
   * Defaults to true for Skill tests, false otherwise.
   */
  useNaturalCrits?: boolean;
}

/**
 * analyses modified test conditions without performing an actual roll.
 * Provides probability information considering the modifier.
 *
 * @param dieType - The type of die
 * @param modifier - The modifier to apply
 * @param testConditions - Test conditions (instance or plain object)
 * @param options - Optional analysis configuration
 * @returns Detailed analysis of the modified test outcomes
 *
 * @example
 * ```ts
 * import { analyseModTest, DieType, TestType } from "@platonic-dice/core";
 *
 * const analysis = analyseModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   { testType: TestType.AtLeast, target: 20 }
 * );
 *
 * console.log(`Modified range: ${analysis.modifiedRange.min}-${analysis.modifiedRange.max}`);
 * console.log(`Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`);
 * console.log(`Need to roll (base): ${analysis.rollsByOutcome.success}`);
 * ```
 */
export function analyseModTest(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  testConditions:
    | TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  options?: analyseModTestOptions,
): ModifiedTestAnalysis;
