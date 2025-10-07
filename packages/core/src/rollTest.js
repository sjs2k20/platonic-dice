/**
 * @module @dice/core/src/rollTest
 * @description
 * Rolls a die and evaluates it against a set of test conditions.
 * Supports either a `TestConditions` instance or a plain object
 * with `{ testType, ...conditions }`.
 *
 * @example
 * import { rollTest, TestType, DieType, RollType } from "@dice/core";
 *
 * // Basic "at least" test
 * const result = rollTest(DieType.D20, { testType: TestType.AtLeast, target: 15 });
 * console.log(result.base);     // e.g., 12
 * console.log(result.outcome);  // e.g., "failure"
 *
 * @example
 * // Roll with advantage
 * const resultAdv = rollTest(
 *   DieType.D20,
 *   { testType: TestType.AtMost, target: 5 },
 *   RollType.Advantage
 * );
 */
import {
  DieType,
  normaliseTestConditions,
  RollType,
  TestConditions,
} from "#entities";
import { determineOutcome } from "#utils";
import { roll } from "./roll.js";

/**
 * @typedef {import("#entities").DieType} DieType
 * @typedef {import("#entities").RollType} RollType
 * @typedef {import("#entities").TestConditions} TestConditions
 * @typedef {import("#entities").Outcome} Outcome
 */

/**
 * Rolls a die and evaluates it against specified test conditions.
 *
 * @function rollTest
 * @param {DieType} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {TestConditions|Object} testConditions - Conditions to evaluate the roll against.
 *   Can be:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param {RollType} [rollType=null] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, outcome: string }} The raw roll and its evaluated outcome.
 * @throws {TypeError} If `dieType` or `testConditions` are invalid.
 */
export function rollTest(dieType, testConditions, rollType = null) {
  if (!dieType) throw new TypeError("dieType is required.");

  // Normalise testConditions
  const conditionSet = normaliseTestConditions(testConditions, dieType);

  // Perform the roll
  const base = roll(dieType, rollType);

  // Determine the outcome using centralized logic
  const outcome = determineOutcome(base, testConditions);

  return { base, outcome };
}
