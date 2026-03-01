export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type OutcomeValue = import("./entities/Outcome").OutcomeValue;
export type RollModifierLike = import("./entities/RollModifier").RollModifierLike;
export type TestTypeValue = import("./entities/TestType").TestTypeValue;
export type TestConditionsInstance = import("./entities/TestConditions").TestConditionsInstance;
export type ModifiedTestAnalysis = {
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
     * - Map of base roll to outcome
     */
    outcomesByRoll: {
        [x: number]: import("./entities/Outcome").OutcomeValue;
    };
    /**
     * - Map of base roll to modified value
     */
    modifiedValuesByRoll: {
        [x: number]: number;
    };
    /**
     * - Array of all possible base roll values
     */
    rolls: number[];
    /**
     * - Base rolls grouped by their outcome
     */
    rollsByOutcome: any;
    /**
     * - Range of modified values achievable
     */
    modifiedRange: {
        min: number;
        max: number;
    };
};
export type analyseModTestOptions = {
    /**
     * - If true, natural max/min rolls trigger
     * critical outcomes. Defaults to true for Skill tests, false otherwise.
     */
    useNaturalCrits?: boolean | undefined;
};
/**
 * analyses modified test conditions without performing an actual roll.
 */
export type TestConditionsLike = import("./entities/TestConditions").TestConditionsLike;
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
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
 * @param {RollModifierLike} modifier - The modifier to apply to the roll.
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @param {TestConditionsLike} testConditions
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
export function analyseModTest(dieType: DieTypeValue, modifier: RollModifierLike, testConditions: TestConditionsLike, options?: analyseModTestOptions): ModifiedTestAnalysis;
