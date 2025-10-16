import {
  DieTypeValue,
  OutcomeValue,
  RollTypeValue,
  TestConditionsInstance,
} from "./entities";

/**
 * Rolls a die and evaluates it against specified test conditions.
 *
 * @param dieType - The type of die to roll.
 * @param testConditions - Conditions to evaluate against. Either:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param rollType - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns An object containing the raw roll and its outcome.
 * @throws TypeError if `dieType` or `testConditions` are invalid.
 */
export declare function rollTest(
  dieType: DieTypeValue,
  testConditions: TestConditionsInstance | Record<string, any>,
  rollType?: RollTypeValue | null
): {
  base: number;
  outcome: OutcomeValue;
};

/**
 * Dynamically generated aliases for `rollTest`.
 *
 * Example: `rollD20AtLeast(target: number, rollType?: RollTypeValue | null)`
 * Returns: `{ base: number, outcome: OutcomeValue }`.
 *
 * The names are generated as `roll<DieKey><TestKey>` for all combinations of
 * DieType × TestType.
 */
export declare const aliases: Record<
  string,
  (
    target: number,
    rollType?: RollTypeValue | null
  ) => {
    base: number;
    outcome: OutcomeValue;
  }
>;
