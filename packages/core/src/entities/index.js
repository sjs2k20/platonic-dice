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

const { DieType } = require("./DieType.js");
const { Outcome } = require("./Outcome.js");
const { RollModifier } = require("./RollModifier.js");
const { RollType } = require("./RollType.js");
const { TestConditions } = require("./TestConditions.js");
const { TestType } = require("./TestType.js");

/**
 * Internal submodule for entity input normalisation.
 * @private
 */
const normalisation = require("./normalisation/index.js");

module.exports = {
  DieType,
  normalisation,
  Outcome,
  RollModifier,
  RollType,
  TestConditions,
  TestType,
};
