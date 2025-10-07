/**
 * @module @dice/core/src/entities
 * @description
 * Core entity definitions for the `@dice/core` package.
 *
 * Exports all primary enumerations, classes, and data types used throughout
 * the dice logic system.
 *
 * @example
 * import { DieType, RollType, RollModifier } from "@dice/core/src/entities";
 *
 * const mod = new RollModifier((n) => n + 2);
 * const result = roll(DieType.D20, RollType.Advantage);
 */

export { DieType } from "./DieType.js";
export { Outcome } from "./Outcome.js";
export { RollModifier } from "./RollModifier.js";
export { RollType } from "./RollType.js";
export { TestConditions } from "./TestConditions.js";
export { TestType } from "./TestType.js";

/**
 * Internal submodule for entity input normalisation.
 * @private
 */
export * as normalisation from "./normalisation/index.js";
