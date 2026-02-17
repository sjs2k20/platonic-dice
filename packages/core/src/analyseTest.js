/**
 * @module @platonic-dice/core/src/analyseTest
 * @description
 * analyses test conditions without performing an actual roll.
 * Provides probability information and possible outcomes for a given test configuration.
 *
 * @example
 * import { analyseTest, DieType, TestType } from "@platonic-dice/core";
 *
 * const analysis = analyseTest(DieType.D20, {
 *   testType: TestType.AtLeast,
 *   target: 15
 * });
 *
 * console.log(analysis.totalPossibilities); // 20
 * console.log(analysis.successCount);       // 6
 * console.log(analysis.successRate);        // 0.3 (30%)
 * console.log(analysis.outcomesByRoll);     // { 1: "failure", 2: "failure", ... }
 */

const { DieType, TestType } = require("./entities");
const tc = require("./entities/TestConditions.js");
const { createOutcomeMap } = require("./utils/outcomeMapper");
const { numSides } = require("./utils");
const { getEvaluator } = require("./utils/getEvaluator");

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
function analyseTest(dieType, testConditions, options = {}) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Normalise testConditions (skip if already a TestConditions instance)
  let conditionSet;
  if (testConditions instanceof tc.TestConditions) {
    conditionSet = testConditions;
  } else {
    // Plain object: validate early for clearer errors, then normalise.
    // We still call `normaliseTestConditions` so tests and any instrumentation
    // that spy on it will observe the delegation (and the constructor remains
    // the final authority for detailed RangeErrors).
    const { testType, ...rest } = testConditions;
    const fullConditions = { ...rest, dieType };
    const validators = require("./utils/testValidators");
    const { isValidTestType } = require("./entities/TestType");

    if (!isValidTestType(testType)) {
      try {
        tc.normaliseTestConditions(testConditions, dieType);
      } catch (err) {
        // ignore deeper error
      }
      throw new TypeError(`Invalid test type: ${testType}`);
    }

    if (!validators.areValidTestConditions(fullConditions, testType)) {
      try {
        tc.normaliseTestConditions(testConditions, dieType);
      } catch (err) {
        // ignore deeper error
      }
      throw new TypeError("Invalid test conditions shape.");
    }

    conditionSet = tc.normaliseTestConditions(testConditions, dieType);
  }

  // Obtain evaluator (registry or fallback) and build outcome map
  const evaluator = getEvaluator(
    dieType,
    conditionSet,
    undefined,
    options.useNaturalCrits,
  );
  const sides = numSides(dieType);
  /** @type {Object.<number, OutcomeValue>} */
  const outcomeMap = {};
  for (let roll = 1; roll <= sides; roll++) outcomeMap[roll] = evaluator(roll);
  const totalPossibilities = sides;

  // Count outcomes
  /** @type {Object.<string, number>} */
  const outcomeCounts = {};
  /** @type {Object.<string, number[]>} */
  const rollsByOutcome = {};

  for (let roll = 1; roll <= sides; roll++) {
    const outcome = outcomeMap[roll];

    // Count outcomes
    outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;

    // Group rolls by outcome
    if (!rollsByOutcome[outcome]) {
      rollsByOutcome[outcome] = [];
    }
    rollsByOutcome[outcome].push(roll);
  }

  // Calculate probabilities
  /** @type {Object.<string, number>} */
  const outcomeProbabilities = {};
  for (const [outcome, count] of Object.entries(outcomeCounts)) {
    outcomeProbabilities[outcome] = count / totalPossibilities;
  }

  return {
    totalPossibilities,
    outcomeCounts,
    outcomeProbabilities,
    outcomesByRoll: outcomeMap,
    rolls: Array.from({ length: sides }, (_, i) => i + 1),
    rollsByOutcome,
  };
}

module.exports = {
  analyseTest,
};
