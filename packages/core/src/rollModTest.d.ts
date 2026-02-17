/**
 * @module @platonic-dice/core/src/rollModTest
 */

import type { DieTypeValue } from "./entities/DieType";
import type { OutcomeValue } from "./entities/Outcome";
import type { RollTypeValue } from "./entities/RollType";
import type { TestTypeValue } from "./entities/TestType";
import type {
  RollModifierFunction,
  RollModifierInstance,
} from "./entities/RollModifier";
import type { TestConditionsInstance } from "./entities/TestConditions";

/**
 * Rolls a die with a modifier and evaluates the modified result against test conditions.
 *
 * @param dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param modifier - The modifier to apply to the roll.
 * @param testConditions - Test conditions (instance or plain object).
 * @param rollType - Optional roll mode (Advantage/Disadvantage).
 * @returns Object containing base roll, modified value, and outcome.
 * @throws {TypeError} If inputs are invalid.
 */
export function rollModTest(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  testConditions:
    | TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  rollType?: RollTypeValue,
): {
  base: number;
  modified: number;
  outcome: OutcomeValue;
};
