import {
  DieTypeValue,
  RollModifierInstance,
  RollModifierFunction,
  DiceModifier,
} from "./entities";
import { RollDiceResult } from "./rollDice";

/**
 * A modifier for `rollDiceMod`.
 * Can be:
 * - a single RollModifierFunction `(n: number) => number`
 * - a RollModifier instance
 * - an object with optional `each` and `net` modifiers
 */
export type RollDiceModModifier =
  | RollModifierInstance
  | RollModifierFunction
  | DiceModifier;

/**
 * Result structure for `rollDiceMod`.
 */
export interface RollDiceModResult {
  /** Raw roll results */
  base: RollDiceResult;
  /** Modified results after applying `each` and `net` modifiers */
  modified: {
    each: RollDiceResult;
    net: { value: number };
  };
}

/**
 * Rolls multiple dice with optional per-die (`each`) and total (`net`) modifiers.
 *
 * @param dieType - Type of die to roll.
 * @param modifier - Optional modifier(s) to apply.
 * @param options - Optional options object.
 * @param options.count - Number of dice to roll. Defaults to 1.
 * @returns Structured object containing raw and modified roll results.
 * @throws TypeError if count or modifiers are invalid.
 */
export declare function rollDiceMod(
  dieType: DieTypeValue,
  modifier?: RollDiceModModifier,
  options?: { count?: number }
): RollDiceModResult;

/**
 * Convenience alias returning only the per-die modified array (`modified.each.array`).
 *
 * @param dieType - Type of die to roll.
 * @param modifier - Optional modifier(s) to apply.
 * @param options - Optional options object.
 * @returns Array of per-die modified results.
 */
export declare function rollDiceModArr(
  dieType: DieTypeValue,
  modifier?: RollDiceModModifier,
  options?: { count?: number }
): number[];

/**
 * Convenience alias returning only the total net value (`modified.net.value`).
 *
 * @param dieType - Type of die to roll.
 * @param modifier - Optional modifier(s) to apply.
 * @param options - Optional options object.
 * @returns The total net modified value.
 */
export declare function rollDiceModNet(
  dieType: DieTypeValue,
  modifier?: RollDiceModModifier,
  options?: { count?: number }
): number[];
