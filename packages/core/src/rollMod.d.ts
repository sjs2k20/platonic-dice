import {
  DieTypeValue,
  RollModifierFunction,
  RollModifierInstance,
  RollTypeValue,
} from "./entities";

/**
 * Result of a modified roll, containing both the base and modified values.
 */
export interface RollModResult {
  /** The base, unmodified roll */
  base: number;
  /** The modified result after applying a modifier */
  modified: number;
}

/**
 * Rolls a single die and applies a modifier function or RollModifier instance.
 *
 * @param dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param modifier - Either a function `(n: number) => number` or a RollModifier instance.
 * @param rollType - Optional roll mode (Advantage / Disadvantage). Defaults to `null`.
 * @returns An object containing the `base` roll and the `modified` result.
 */
export declare function rollMod(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  rollType?: RollTypeValue | null
): RollModResult;

/**
 * Convenience type for die-specific modifier aliases.
 * Each function returns the modified roll for the given die.
 */
export type DieModifierAlias = (rollType?: RollTypeValue | null) => number;

/**
 * Dynamically generated convenience aliases for all die types and common modifiers.
 *
 * Examples:
 * - Flat modifiers: rollD6P2 (D6 +2), rollD20M3 (D20 -3)
 * - Multiplicative: rollD10T2 (D10 ×2), rollD12T10 (D12 ×10)
 */
export declare const rollModAliases: Record<string, DieModifierAlias>;

/**
 * All exports, including rollMod and dynamically generated aliases.
 */
export interface RollModExports {
  rollMod: typeof rollMod;
  [alias: string]: RollModAliasFunction | typeof rollMod;
}

export type RollModAliasFunction = DieModifierAlias;
