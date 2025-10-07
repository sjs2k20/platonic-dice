/**
 * @module @dice/core/entities/normalisation
 * @description
 * Internal normalisation utilities for `@dice/core` entities.
 *
 * These functions standardise inputs before use within core logic,
 * ensuring consistent construction and validation.
 *
 * @private
 *
 * @example
 * import { normaliseRollModifier } from "#entities/normalisation";
 *
 * const mod = normaliseRollModifier((n) => n + 2);
 */

export { normaliseTestConditions } from "./normaliseTestConditions.js";
export { normaliseRollModifier } from "./normaliseRollModifier.js";
