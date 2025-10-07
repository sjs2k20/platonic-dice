/**
 * @module @dice/core/validators
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
 * import { isDieType, isRollType } from "#validators";
 * if (!isDieType("D8")) throw new TypeError("Invalid die type");
 */
export { isDieType } from "./isDieType.js";
export { isRollModifier } from "./isRollModifier.js";
export { isRollType } from "./isRollType.js";
export { isTestType } from "./isTestType.js";
export * as testConditions from "./testConditions/index.js";
