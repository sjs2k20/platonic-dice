/**
 * Creates an outcome map for all possible base rolls given the configuration.
 * Uses memoization cache for performance.
 *
 * @param {import("../entities/DieType").DieTypeValue} dieType - The type of die
 * @param {import("../entities/TestType").TestTypeValue} testType - The type of test being performed
 * @param {import("../entities/TestConditions").TestConditionsInstance} testConditions - The test conditions
 * @param {import("../entities/RollModifier").RollModifierInstance|undefined} modifier - Optional modifier to apply
 * @param {boolean|undefined} useNaturalCrits - Whether to use natural crits (undefined = auto-determine)
 * @returns {Object.<number, import("../entities/Outcome").OutcomeValue>} Map of baseRoll -> outcome
 */
export function createOutcomeMap(
  dieType: import("../entities/DieType").DieTypeValue,
  testType: import("../entities/TestType").TestTypeValue,
  testConditions: import("../entities/TestConditions").TestConditionsInstance,
  modifier?:
    | import("../entities/RollModifier").RollModifierInstance
    | undefined,
  useNaturalCrits?: boolean | undefined,
): {
  [x: number]: import("../entities/Outcome").OutcomeValue;
};
/**
 * Clears the outcome map cache.
 * Useful for testing or memory management.
 *
 * @function clearOutcomeMapCache
 */
export function clearOutcomeMapCache(): void;
/**
 * Gets the current size of the outcome map cache.
 *
 * @function getOutcomeMapCacheSize
 * @returns {number}
 */
export function getOutcomeMapCacheSize(): number;
