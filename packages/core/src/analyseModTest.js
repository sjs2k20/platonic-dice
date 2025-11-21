/**
 * @module @platonic-dice/core/src/analyseModTest
 * @description
 * analyses modified test conditions without performing an actual roll.
 * Provides probability information and possible outcomes for a given test configuration
 * with modifiers applied.
 *
 * @example
 * import { analyseModTest, DieType, TestType } from "@platonic-dice/core";
 *
 * const analysis = analyseModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   { testType: TestType.AtLeast, target: 20 }
 * );
 *
 * console.log(analysis.successRate); // Probability with +5 modifier
 */

const { normaliseRollModifier } = require("./entities");
const { ModifiedTestConditions } = require("./entities/ModifiedTestConditions");
const { createOutcomeMap } = require("./utils/outcomeMapper");
const { numSides } = require("./utils");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./entities/RollModifier").RollModifierInstance} RollModifierInstance
 * @typedef {import("./entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 */

/**
 * @typedef {Object} ModifiedTestAnalysis
 * @property {number} totalPossibilities - Total number of possible die rolls
 * @property {Object.<string, number>} outcomeCounts - Count of each outcome type
 * @property {Object.<string, number>} outcomeProbabilities - Probability (0-1) of each outcome
 * @property {Object.<number, OutcomeValue>} outcomesByRoll - Map of base roll to outcome
 * @property {Object.<number, number>} modifiedValuesByRoll - Map of base roll to modified value
 * @property {number[]} rolls - Array of all possible base roll values
 * @property {Object.<OutcomeValue, number[]>} rollsByOutcome - Base rolls grouped by their outcome
 * @property {{ min: number, max: number }} modifiedRange - Range of modified values achievable
 */

/**
 * @typedef {Object} analyseModTestOptions
 * @property {boolean} [useNaturalCrits] - If true, natural max/min rolls trigger
 *   critical outcomes. Defaults to true for Skill tests, false otherwise.
 */

/**
 * analyses modified test conditions without performing an actual roll.
 *
 * @function analyseModTest
 * @param {DieTypeValue} dieType - The type of die (e.g., `DieType.D20`).
 * @param {RollModifierFunction|RollModifierInstance} modifier - The modifier to apply to the roll.
 * @param {TestConditionsInstance|{ testType: TestTypeValue, [key: string]: any }} testConditions
 *   Can be:
 *   - A `TestConditions` instance
 *   - A plain object `{ testType, ...conditions }`
 * @param {analyseModTestOptions} [options={}] - Optional configuration
 * @returns {ModifiedTestAnalysis} Detailed analysis of the modified test outcomes
 * @throws {TypeError} If `dieType`, `modifier`, or `testConditions` are invalid.
 *
 * @example
 * // analyse a D20+5 skill check with DC 20
 * const analysis = analyseModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   {
 *     testType: TestType.Skill,
 *     target: 20,
 *     critical_success: 25,
 *     critical_failure: 6
 *   }
 * );
 *
 * console.log(`Modified range: ${analysis.modifiedRange.min}-${analysis.modifiedRange.max}`);
 * console.log(`Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`);
 * console.log(`Need to roll: ${analysis.rollsByOutcome.success}`);
 *
 * @example
 * // See how modifier affects outcomes
 * const noMod = analyseTest(DieType.D20, { testType: TestType.AtLeast, target: 15 });
 * const withMod = analyseModTest(DieType.D20, n => n + 5, { testType: TestType.AtLeast, target: 15 });
 *
 * console.log(`Without modifier: ${(noMod.outcomeProbabilities.success * 100).toFixed(1)}%`);
 * console.log(`With +5 modifier: ${(withMod.outcomeProbabilities.success * 100).toFixed(1)}%`);
 */
function analyseModTest(dieType, modifier, testConditions, options = {}) {
  if (!dieType) throw new TypeError("dieType is required.");
  if (!modifier) throw new TypeError("modifier is required.");
  if (!testConditions) throw new TypeError("testConditions is required.");

  // Normalise the modifier (skip if already a RollModifier instance)
  const { RollModifier } = require("./entities");
  const mod =
    modifier instanceof RollModifier
      ? modifier
      : normaliseRollModifier(modifier);

  // Create ModifiedTestConditions if input is a plain object
  let conditionSet;
  if (testConditions instanceof ModifiedTestConditions) {
    conditionSet = testConditions;
  } else {
    // Plain object: { testType, ...rest }
    const { testType, ...rest } = testConditions;
    // @ts-ignore - rest is validated by ModifiedTestConditions constructor
    conditionSet = new ModifiedTestConditions(testType, rest, dieType, mod);
  }

  // Create outcome map for all possible rolls (with modifier applied)
  const outcomeMap = createOutcomeMap(
    dieType,
    conditionSet.testType,
    // @ts-ignore - ModifiedTestConditions is compatible with TestConditions for outcome mapping
    conditionSet,
    mod, // include modifier
    options.useNaturalCrits
  );

  const sides = numSides(dieType);
  const totalPossibilities = sides;

  // Calculate modified values for each roll
  /** @type {Object.<number, number>} */
  const modifiedValuesByRoll = {};
  for (let roll = 1; roll <= sides; roll++) {
    modifiedValuesByRoll[roll] = mod.apply(roll);
  }

  // Determine modified range
  const modifiedValues = Object.values(modifiedValuesByRoll);
  const modifiedRange = {
    min: Math.min(...modifiedValues),
    max: Math.max(...modifiedValues),
  };

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
    modifiedValuesByRoll,
    rolls: Array.from({ length: sides }, (_, i) => i + 1),
    rollsByOutcome,
    modifiedRange,
  };
}

module.exports = {
  analyseModTest,
};
