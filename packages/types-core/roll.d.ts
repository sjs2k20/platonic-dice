import { DieTypeValue, RollTypeValue } from "./entities";
import type {
  RollExpressionAnalysisResult,
  RollExpressionResult,
} from "./rollExpression";

/**
 * Rolls using the expression-first core runtime.
 *
 * The preferred entry point is `roll(expression)` / `analyse(expression)`, which
 * returns a structured result for DSL expressions such as `2D6+5` or
 * `1D20ADV GET atLeast 15`. Compatibility overloads for die-type and roll-type
 * pairs remain available for existing callers.
 *
 * @example
 * ```ts
 * import { roll, analyse, DieType, RollType } from "@platonic-dice/core";
 *
 * const expression = roll("2D6+5");
 * const analysis = analyse("1D20ADV GET atLeast 15");
 * const normal = roll(DieType.D20);
 * const adv = roll(DieType.D20, RollType.Advantage);
 * ```
 */
export function roll(dieType: DieTypeValue): number;
export function roll(dieType: DieTypeValue, rollType: RollTypeValue): number;
export function roll(expression: string): RollExpressionResult;

/**
 * Rolls a die with advantage.
 *
 * @param dieType - The die type (e.g., `DieType.D10`).
 * @returns The higher of two rolled values.
 *
 * @example
 * ```ts
 * const high = rollAdv(DieType.D10);
 * ```
 */
export function rollAdv(dieType: DieTypeValue): number;

/**
 * Rolls a die with disadvantage.
 *
 * @param dieType - The die type (e.g., `DieType.D10`).
 * @returns The lower of two rolled values.
 *
 * @example
 * ```ts
 * const low = rollDis(DieType.D10);
 * ```
 */
export function rollDis(dieType: DieTypeValue): number;

/**
 * Rolls a D4 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD4(rollType?: RollTypeValue): number;

/**
 * Rolls a D6 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD6(rollType?: RollTypeValue): number;

/**
 * Rolls a D8 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD8(rollType?: RollTypeValue): number;

/**
 * Rolls a D10 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD10(rollType?: RollTypeValue): number;

/**
 * Rolls a D12 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD12(rollType?: RollTypeValue): number;

/**
 * Rolls a D20 die.
 * @param rollType - Optional roll mode (`advantage` or `disadvantage`).
 */
export function rollD20(rollType?: RollTypeValue): number;

export function analyse(expression: string): RollExpressionAnalysisResult;
