/**
 * @module @dice/core/src/validators
 * @description
 * Validation utilities for verifying dice-related types and entities.
 *
 * These functions help ensure type safety across the core module,
 * confirming that values passed to functions like `roll`, `rollMod`,
 * and entity constructors (e.g. `RollModifier`) are valid.
 *
 * @private
 *
 * @example
 * import { isDieType, isRollType } from "@dice/core/src/validators";
 * if (!isDieType("D8")) throw new TypeError("Invalid die type");
 */
const { isDieType } = require("./isDieType.js");
const { isRollModifier } = require("./isRollModifier.js");
const { isRollType } = require("./isRollType.js");
const { isTestType } = require("./isTestType.js");
const { isTestCondition } = require("./testConditions/validators.js");

module.exports = {
  isDieType,
  isRollModifier,
  isRollType,
  isTestType,
  isTestCondition,
};
