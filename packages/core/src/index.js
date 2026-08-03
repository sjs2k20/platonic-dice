/**
 * @module core
 * @description
 * Primary entry point for the core dice logic.
 * Re-exports all main rolling functions and modifiers.
 *
 * @example
 * import { roll, rollMod, rollDice, rollDiceMod, rollTest, rollModTest } from "@platonic-dice/core";
 */

// --- Core modules ---
/** @type {typeof import("./rollDice.js")} */
const rollDice = require("./rollDice.js");
/** @type {typeof import("./roll.js")} */
const roll = require("./roll.js");
/** @type {typeof import("./rollMod.js")} */
const rollMod = require("./rollMod.js");
/** @type {typeof import("./rollDiceMod.js")} */
const rollDiceMod = require("./rollDiceMod.js");
const rollDiceTest = require("./rollDiceTest.js");
/** @type {typeof import("./rollDiceModTest.js")} */
const rollDiceModTest = require("./rollDiceModTest.js");
const rollTest = require("./rollTest.js");
/** @type {typeof import("./rollModTest.js")} */
const rollModTest = require("./rollModTest.js");
/** @type {typeof import("./analyseTest.js")} */
const analyseTest = require("./analyseTest.js");
/** @type {typeof import("./analyseModTest.js")} */
const analyseModTest = require("./analyseModTest.js");

// --- Entities (public API) ---
const entities = require("./entities");

/**
 * Attach named exports onto `exports` so consumers can access
 * all helpers from the package root.
 */
Object.assign(exports, roll);
Object.assign(exports, rollDice);
Object.assign(exports, rollMod);
Object.assign(exports, rollDiceMod);
Object.assign(exports, rollDiceTest);
Object.assign(exports, rollDiceModTest);
Object.assign(exports, entities);
Object.assign(exports, rollTest);
Object.assign(exports, rollModTest);
Object.assign(exports, analyseTest);
Object.assign(exports, analyseModTest);

// provide a `default` export for compatibility
exports.default = exports;

// Re-export all named exports explicitly for compatibility
exports.DieType = entities.DieType;
exports.isValidDieType = entities.isValidDieType;
exports.Outcome = entities.Outcome;
exports.isValidOutcome = entities.isValidOutcome;
exports.RollType = entities.RollType;
exports.isValidRollType = entities.isValidRollType;
exports.TestType = entities.TestType;
exports.isValidTestType = entities.isValidTestType;
exports.RollModifier = entities.RollModifier;
exports.isValidRollModifier = entities.isValidRollModifier;
exports.normaliseRollModifier = entities.normaliseRollModifier;
exports.TestConditions = entities.TestConditions;
exports.areValidTestConditions = entities.areValidTestConditions;
exports.normaliseTestConditions = entities.normaliseTestConditions;
exports.TestConditionsArray = entities.TestConditionsArray;
exports.DiceTestConditions = entities.DiceTestConditions;
exports.ModifiedTestConditions = entities.ModifiedTestConditions;
exports.areValidModifiedTestConditions =
  entities.areValidModifiedTestConditions;
exports.computeModifiedRange = entities.computeModifiedRange;
exports.rollTest = rollTest.rollTest;
exports.rollModTest = rollModTest.rollModTest;
exports.rollDiceTest = rollDiceTest.rollDiceTest;
exports.rollDiceModTest = rollDiceModTest.rollDiceModTest;
exports.analyseTest = analyseTest.analyseTest;
exports.analyseModTest = analyseModTest.analyseModTest;
exports.roll = roll.roll;
exports.analyse = roll.analyse;
