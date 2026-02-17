import { DieTypeValue } from "./entities";

/**
 * Result of rolling one or more dice.
 */
export interface RollDiceResult {
  /** Array of individual dice results */
  array: number[];
  /** Total sum of all rolled dice */
  sum: number;
}

/**
 * Rolls one or more dice of a given type.
 *
 * @param dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param options - Optional configuration.
 * @param options.count - Number of dice to roll. Defaults to 1. Must be a positive integer.
 * @returns Object containing `array` of individual rolls and `sum` of all rolls.
 * @throws TypeError if `dieType` is invalid or `count` is not a positive integer.
 */
export declare function rollDice(
  dieType: DieTypeValue,
  options?: { count?: number }
): RollDiceResult;

/**
 * Convenience type for die-count-specific aliases.
 * Each function returns the same result as `rollDice`, with preconfigured `count`.
 */
export type RollDiceAlias = (dieType: DieTypeValue) => RollDiceResult;

/**
 * Dynamically generated convenience aliases for rolling N dice at once.
 *
 * Examples:
 * - roll2x(D6) → rolls 2 dice
 * - roll3x(D20) → rolls 3 dice
 * - roll100x(D6) → rolls 100 dice
 */
export declare const rollDiceAliases: Record<string, RollDiceAlias>;

/**
 * Full module exports including `rollDice` and all generated aliases.
 */
export interface RollDiceExports {
  rollDice: typeof rollDice;
  [alias: string]: RollDiceAlias | typeof rollDice;
}
