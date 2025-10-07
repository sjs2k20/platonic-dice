/**
 * @module @dice/core/entities/normalisation/normaliseRollModifier
 * @description
 * Normalises any roll modifier input into a {@link RollModifier} instance.
 *
 * This function ensures all modifiers conform to the correct structure:
 *  - A {@link RollModifier} instance → returned as-is.
 *  - A function `(n: number) => number` → wrapped in a new {@link RollModifier}.
 *  - `null` or `undefined` → treated as an identity modifier.
 *
 * @example
 * const rm1 = normaliseRollModifier(); // → identity modifier
 * const rm2 = normaliseRollModifier(x => x + 1); // → RollModifier wrapping function
 * const rm3 = normaliseRollModifier(new RollModifier(x => x * 2)); // → same instance
 */

import { RollModifier } from "#entities";
import { isRollModifier } from "#validators";

/**
 * @typedef {import("#entities").RollModifier} RollModifier
 */

/**
 * @param {RollModifier | ((n: number) => number) | null | undefined} m
 *   The input modifier to normalise.
 * @returns {RollModifier}
 *   A valid {@link RollModifier} instance.
 * @throws {TypeError}
 *   If the input is invalid (not a RollModifier, function, or null/undefined).
 */
export function normaliseRollModifier(m) {
  if (!m) return new RollModifier((n) => n); // identity modifier
  if (m instanceof RollModifier) return m;
  if (typeof m === "function" && isRollModifier(m)) return new RollModifier(m);
  throw new TypeError("Invalid RollModifier");
}
