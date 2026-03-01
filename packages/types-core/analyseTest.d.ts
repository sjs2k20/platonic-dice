export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type OutcomeValue = import("./entities/Outcome").OutcomeValue;
export type TestTypeValue = import("./entities/TestType").TestTypeValue;
export type TestConditionsInstance =
  import("./entities/TestConditions").TestConditionsInstance;
export type TestAnalysis = {
  /**
   * - Total number of possible die rolls
   */
  totalPossibilities: number;
  /**
   * - Count of each outcome type
   */
  outcomeCounts: {
    [x: string]: number;
  };
  /**
   * - Probability (0-1) of each outcome
   */
  outcomeProbabilities: {
    [x: string]: number;
  };
  /**
   * - Map of roll value to outcome
   */
  outcomesByRoll: {
    [x: number]: import("./entities/Outcome").OutcomeValue;
  };
  /**
   * - Array of all possible roll values
   */
  rolls: number[];
  /**
   * - Rolls grouped by their outcome
   */
  rollsByOutcome: Record<import("./entities/Outcome").OutcomeValue, number[]>;
};
export type analyseTestOptions = {
  /**
   * - If true, natural max/min rolls trigger
   * critical outcomes. Defaults to true for Skill tests, false otherwise.
   */
  useNaturalCrits?: boolean | undefined;
};
/**
 * analyses test conditions without performing an actual roll.
 */
export type TestConditionsLike =
  import("./entities/TestConditions").TestConditionsLike;
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */
/**
 * @typedef {Object} TestAnalysis
 * @property {number} totalPossibilities - Total number of possible die rolls
 * @property {Object.<string, number>} outcomeCounts - Count of each outcome type
 * @property {Object.<string, number>} outcomeProbabilities - Probability (0-1) of each outcome
 * @property {Object.<number, OutcomeValue>} outcomesByRoll - Map of roll value to outcome
 * @property {number[]} rolls - Array of all possible roll values
 * @property {Object.<OutcomeValue, number[]>} rollsByOutcome - Rolls grouped by their outcome
 */
/**
 * @typedef {Object} analyseTestOptions
 * @property {boolean} [useNaturalCrits] - If true, natural max/min rolls trigger
 *   critical outcomes. Defaults to true for Skill tests, false otherwise.
 */
/**
 * analyses test conditions without performing an actual roll.
 *
 * @function analyseTest
 * @param {DieTypeValue} dieType - The type of die (e.g., `DieType.D20`).
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @param {TestConditionsLike} testConditions
 *   Can be:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param {analyseTestOptions} [options={}] - Optional configuration for analysis
 * @returns {TestAnalysis} Detailed analysis of the test outcomes
 * @throws {TypeError} If `dieType` or `testConditions` are invalid.
 *
 * @example
 * // analyse a D20 skill check with DC 15
 * const analysis = analyseTest(DieType.D20, {
 *   testType: TestType.Skill,
 *   target: 15,
 *   critical_success: 20,
 *   critical_failure: 1
 * });
 *
 * console.log(`Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`);
 * console.log(`Critical success on: ${analysis.rollsByOutcome.critical_success}`);
 *
 * @example
 * // analyse without natural crits
 * const analysis = analyseTest(
 *   DieType.D20,
 *   { testType: TestType.AtLeast, target: 15 },
 *   { useNaturalCrits: false }
 * );
 */
export function analyseTest(
  dieType: DieTypeValue,
  testConditions: TestConditionsLike,
  options?: analyseTestOptions,
): TestAnalysis;
