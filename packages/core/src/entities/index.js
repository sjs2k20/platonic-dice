/**
 * @module @platonic-dice/core/src/entities
 * @description
 * Core entity definitions for the `@platonic-dice/core` package.
 *
 * Exports all primary enumerations, classes, and data types used throughout
 * the dice logic system.
 *
 * @example
 * import { DieType, RollType, RollModifier } from "@platonic-dice/core/src/entities";
 *
 * const mod = new RollModifier((n) => n + 2);
 * const result = roll(DieType.D20, RollType.Advantage);
 */

const { DieType, isValidDieType } = require("./DieType.js");
const { Outcome, isValidOutcome } = require("./Outcome.js");
const {
  RollModifier,
  isValidRollModifier,
  normaliseRollModifier,
} = require("./RollModifier.js");
const { RollType, isValidRollType } = require("./RollType.js");
const {
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
} = require("./TestConditions.js");
const {
  ModifiedTestConditions,
  areValidModifiedTestConditions,
  computeModifiedRange,
} = require("./ModifiedTestConditions.js");
const { TestType, isValidTestType } = require("./TestType.js");

module.exports = {
  DieType,
  isValidDieType,
  Outcome,
  isValidOutcome,
  RollModifier,
  isValidRollModifier,
  normaliseRollModifier,
  RollType,
  isValidRollType,
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
  ModifiedTestConditions,
  areValidModifiedTestConditions,
  computeModifiedRange,
  TestType,
  isValidTestType,
};
