/**
 * @module @platonic-dice/core/src/utils
 * @description
 * Internal utility functions for core dice logic.
 *
 * These functions provide shared, low-level logic such as
 * generating random die results, computing number of sides,
 * and evaluating roll outcomes.
 *
 * They are used internally by the `@platonic-dice/core/src` roll functions
 * and entity validation routines.
 *
 * @private
 *
 * @example
 * // Internal usage only — not part of the public API
 * import { generateDieResult, determineOutcome } from "../utils";
 */
const { determineOutcome } = require("./determineOutcome.js");
const { generateResult, numSides } = require("./generateResult.js");
const {
  createOutcomeMap,
  clearOutcomeMapCache,
  getOutcomeMapCacheSize,
} = require("./outcomeMapper.js");
const testRegistry = require("./testRegistry.js");
const testValidators = require("./testValidators.js");
const { getEvaluator } = require("./getEvaluator.js");

module.exports = {
  determineOutcome,
  generateResult,
  numSides,
  createOutcomeMap,
  clearOutcomeMapCache,
  getOutcomeMapCacheSize,
  getEvaluator,
  // Runtime re-exports for registry and validators to match `index.d.ts`
  ...testRegistry,
  ...testValidators,
};
