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
 * Compatibility helper for the legacy imperative die-based API.
 *
 * Prefer expression-first usage via `roll(expression)` / `analyse(expression)`
 * when working with DSL expressions. This helper still evaluates a die roll
 * against the supplied test conditions and returns the raw roll plus outcome.
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
  testConditions:
    | TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  rollType?: RollTypeValue,
  options?: RollTestOptions,
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
    rollType?: RollTypeValue,
  ) => {
    base: number;
    outcome: OutcomeValue;
  }
>;
