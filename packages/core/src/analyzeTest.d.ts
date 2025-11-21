/**
 * @module @platonic-dice/core/src/analyzeTest
 */

import type { DieTypeValue } from "./entities/DieType";
import type { TestTypeValue } from "./entities/TestType";
import type { OutcomeValue } from "./entities/Outcome";
import type { TestConditionsInstance } from "./entities/TestConditions";

/**
 * Analysis result for a test configuration.
 */
export interface TestAnalysis {
  /** Total number of possible die rolls */
  totalPossibilities: number;
  /** Count of each outcome type */
  outcomeCounts: Record<string, number>;
  /** Probability (0-1) of each outcome */
  outcomeProbabilities: Record<string, number>;
  /** Map of roll value to outcome */
  outcomesByRoll: Record<number, OutcomeValue>;
  /** Array of all possible roll values */
  rolls: number[];
  /** Rolls grouped by their outcome */
  rollsByOutcome: Record<OutcomeValue, number[]>;
}

/**
 * Options for test analysis.
 */
export interface AnalyzeTestOptions {
  /**
   * If true, natural max/min rolls trigger critical outcomes.
   * Defaults to true for Skill tests, false otherwise.
   */
  useNaturalCrits?: boolean;
}

/**
 * Analyzes test conditions without performing an actual roll.
 * Provides probability information and possible outcomes.
 *
 * @param dieType - The type of die
 * @param testConditions - Test conditions (instance or plain object)
 * @param options - Optional analysis configuration
 * @returns Detailed analysis of the test outcomes
 *
 * @example
 * ```ts
 * import { analyzeTest, DieType, TestType } from "@platonic-dice/core";
 *
 * const analysis = analyzeTest(DieType.D20, {
 *   testType: TestType.AtLeast,
 *   target: 15
 * });
 *
 * console.log(`Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`);
 * console.log(`You need to roll: ${analysis.rollsByOutcome.success}`);
 * ```
 */
export function analyzeTest(
  dieType: DieTypeValue,
  testConditions:
    | TestConditionsInstance
    | { testType: TestTypeValue; [key: string]: any },
  options?: AnalyzeTestOptions
): TestAnalysis;
