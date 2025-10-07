/**
 * @packageDocumentation
 * @module @dice/core
 * @description
 * Public entry point for the `@dice/core` package.
 *
 * This module exposes the main dice-rolling functions and utilities:
 * - {@link roll} — roll a single die
 * - {@link rollDice} — roll multiple dice
 * - {@link rollMod} — roll with modifiers
 * - {@link rollModDice} — roll multiple dice with modifiers
 *
 * @example
 * // Example usage
 * import { roll, rollDice, rollMod } from "@dice/core";
 *
 * const result = roll(DieType.D20);
 * const dice = rollDice(DieType.D6, { count: 3 });
 * const modified = rollMod(DieType.D20, (n) => n + 2);
 */
export * from "./src/index.js";
