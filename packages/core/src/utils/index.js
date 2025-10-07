/**
 * @module @dice/core/src/utils
 * @description
 * Internal utility functions for core dice logic.
 *
 * These functions provide shared, low-level logic such as
 * generating random die results, computing number of sides,
 * and evaluating roll outcomes.
 *
 * They are used internally by the `@dice/core/src` roll functions
 * and entity validation routines.
 *
 * @private
 *
 * @example
 * // Internal usage only — not part of the public API
 * import { generateDieResult, determineOutcome } from "#utils";
 */
export { determineOutcome } from "./determineOutcome.js";
export { generateDieResult } from "./generateResult.js";
export { numSides } from "./numSides.js";
