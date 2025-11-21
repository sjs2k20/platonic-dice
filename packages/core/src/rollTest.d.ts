import {
  DieTypeValue,
  OutcomeValue,
  RollTypeValue,
  TestConditionsInstance,
} from "./entities";

/**
 * Options for rollTest function
 */
export interface RollTestOptions {
  /**
   * If true, rolling the die's maximum value triggers CriticalSuccess (for Skill tests)
   * or Success (for other test types), and rolling 1 triggers CriticalFailure (for Skill tests)
   * or Failure (for other test types).
   *
   * If undefined, defaults to true for TestType.Skill and false for all other test types.
   */
  useNaturalCrits?: boolean;
}

/**
 * Rolls a die and evaluates it against specified test conditions.
 *
 * @param dieType - The type of die to roll.
 * @param testConditions - Conditions to evaluate against. Either:
 *   - A `TestConditions` instance.
 *   - A plain object `{ testType, ...conditions }`.
 * @param rollType - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`). Defaults to `undefined`.
 * @param options - Optional configuration for natural crits and other behaviors.
 * @returns An object containing the raw roll and its outcome.
 * @throws TypeError if `dieType` or `testConditions` are invalid.
 */
export declare function rollTest(
  dieType: DieTypeValue,
  testConditions: TestConditionsInstance | Record<string, any>,
  rollType?: RollTypeValue,
  options?: RollTestOptions
): {
  base: number;
  outcome: OutcomeValue;
};

/**
 * Dynamically generated aliases for `rollTest`.
 *
 * Example: `rollD20AtLeast(target: number, rollType?: RollTypeValue)`
 * Returns: `{ base: number, outcome: OutcomeValue }`.
 *
 * The names are generated as `roll<DieKey><TestKey>` for all combinations of
 * DieType × TestType.
 */
export declare const aliases: Record<
  string,
  (
    target: number,
    rollType?: RollTypeValue
  ) => {
    base: number;
    outcome: OutcomeValue;
  }
>;
