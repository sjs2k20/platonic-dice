export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type OutcomeValue = import("./entities/Outcome").OutcomeValue;
export type RollTypeValue = import("./entities/RollType").RollTypeValue;
export type RollModifierLike = import("./entities/RollModifier").RollModifierLike;
export type TestTypeValue = import("./entities/TestType").TestTypeValue;
export type TestConditionsInstance = import("./entities/TestConditions").TestConditionsInstance;
/**
 * Rolls a die with a modifier and evaluates the modified result against test conditions.
 */
export type TestConditionsLike = import("./entities/TestConditions").TestConditionsLike;
/**
 * Rolls a die with a modifier and evaluates the modified result against test conditions.
 *
 * @function rollModTest
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollModifierLike} modifier - The modifier to apply to the roll.
 *   Can be either:
 *   - A function `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @param {TestConditionsLike} testConditions
 *   Can be:
 *   - A `TestConditions` instance
 *   - A plain object `{ testType, ...conditions }`
 * @param {RollTypeValue} [rollType=undefined] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @param {Object} [options={}] - Optional configuration.
 * @param {boolean} [options.useNaturalCrits] - If true, natural max/min rolls on the die trigger
 *   critical success/failure (for Skill tests) or success/failure (for other test types).
 *   If undefined, defaults to true for Skill test type and false for all others.
 * @returns {{ base: number, modified: number, outcome: OutcomeValue }}
 *   - `base`: The raw die roll
 *   - `modified`: The roll after applying the modifier
 *   - `outcome`: The success/failure result based on test conditions
 * @throws {TypeError} If `dieType`, `modifier`, or `testConditions` are invalid.
 *
 * @example
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 2,
 *   { testType: TestType.AtLeast, target: 15 }
 * );
 * console.log(result); // { base: 14, modified: 16, outcome: "success" }
 *
 * @example
 * // With natural crits enabled (TTRPG style)
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 5,
 *   { testType: TestType.Skill, target: 15, critical_success: 25, critical_failure: 2 },
 *   undefined,
 *   { useNaturalCrits: true }
 * );
 * // If base roll is 20, outcome is always "critical_success"
 * // If base roll is 1, outcome is always "critical_failure"
 *
 * @example
 * // With advantage - compares outcomes, not just base rolls
 * const result = rollModTest(
 *   DieType.D20,
 *   (n) => n + 3,
 *   { testType: TestType.Skill, target: 12, critical_success: 20, critical_failure: 1 },
 *   RollType.Advantage
 * );
 * // Rolls twice, returns the result with the better outcome
 */
export function rollModTest(dieType: DieTypeValue, modifier: RollModifierLike, testConditions: TestConditionsLike, rollType?: RollTypeValue, options?: {
    useNaturalCrits?: boolean | undefined;
}): {
    base: number;
    modified: number;
    outcome: OutcomeValue;
};
