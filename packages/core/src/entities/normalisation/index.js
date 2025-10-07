/**
 * @module @dice/core/src/entities/normalisation
 * @description
 * Internal normalisation utilities for `@dice/core` entities.
 *
 * These functions standardise inputs before use within core logic,
 * ensuring consistent construction and validation.
 *
 * @private
 *
 * @example
 * import { normaliseRollModifier } from "@dice/core/src/entities/normalisation";
 *
 * const mod = normaliseRollModifier((n) => n + 2);
 */

const { normaliseRollModifier } = require("./normaliseRollModifier.js");
const { normaliseTestConditions } = require("./normaliseTestConditions.js");

module.exports = {
  normaliseRollModifier,
  normaliseTestConditions,
};
