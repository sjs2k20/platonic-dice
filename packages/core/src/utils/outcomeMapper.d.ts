/**
 * @module @platonic-dice/core/src/utils/outcomeMapper
 */

import type { DieTypeValue } from "../entities/DieType";
import type { TestTypeValue } from "../entities/TestType";
import type { OutcomeValue } from "../entities/Outcome";
import type { TestConditionsInstance } from "../entities/TestConditions";
import type { RollModifierInstance } from "../entities/RollModifier";

/**
 * Creates an outcome map for all possible base rolls given the configuration.
 * Uses memoization cache for performance.
 *
 * @param dieType - The type of die
 * @param testType - The type of test being performed
 * @param testConditions - The test conditions
 * @param modifier - Optional modifier to apply
 * @param useNaturalCrits - Whether to use natural crits (null = auto-determine)
 * @returns Map of baseRoll -> outcome
 *
 * @example
 * ```ts
 * import { createOutcomeMap } from "@platonic-dice/core/src/utils/outcomeMapper";
 * import { DieType, TestType, TestConditions } from "@platonic-dice/core";
 *
 * const conditions = new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20);
 * const outcomeMap = createOutcomeMap(DieType.D20, TestType.AtLeast, conditions);
 *
 * // outcomeMap[20] -> "success"
 * // outcomeMap[1] -> "failure"
 * ```
 */
export function createOutcomeMap(
  dieType: DieTypeValue,
  testType: TestTypeValue,
  testConditions:
    | TestConditionsInstance
    | { testType: TestTypeValue; [key: string]: any },
  modifier?: RollModifierInstance | null,
  useNaturalCrits?: boolean | null
): Record<number, OutcomeValue>;

/**
 * Clears the outcome map cache.
 * Useful for testing or memory management.
 *
 * @example
 * ```ts
 * import { clearOutcomeMapCache } from "@platonic-dice/core/src/utils/outcomeMapper";
 *
 * // Clear cache before benchmark
 * clearOutcomeMapCache();
 * ```
 */
export function clearOutcomeMapCache(): void;

/**
 * Gets the current size of the outcome map cache.
 *
 * @returns The number of cached outcome maps
 *
 * @example
 * ```ts
 * import { getOutcomeMapCacheSize } from "@platonic-dice/core/src/utils/outcomeMapper";
 *
 * console.log(`Cache contains ${getOutcomeMapCacheSize()} outcome maps`);
 * ```
 */
export function getOutcomeMapCacheSize(): number;
