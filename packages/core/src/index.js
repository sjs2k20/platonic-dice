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
const rollDice = require("./rollDice.js");
const roll = require("./roll.js");
const rollMod = require("./rollMod.js");
const rollDiceMod = require("./rollDiceMod.js");
const rollTest = require("./rollTest.js");
const rollModTest = require("./rollModTest.js");
const analyzeTest = require("./analyzeTest.js");
const analyzeModTest = require("./analyzeModTest.js");

// --- Entities (public API) ---
const entities = require("./entities");

/**
 * Combined exports for Node and TypeScript users.
 * @type {typeof import("./roll") &
 *        typeof import("./rollDice") &
 *        typeof import("./rollMod") &
 *        typeof import("./rollDiceMod") &
 *        typeof import("./rollTest") &
 *        typeof import("./rollModTest") &
 *        typeof import("./analyzeTest") &
 *        typeof import("./analyzeModTest") &
 *        typeof import("./entities") &
 *        { default: any }}
 */
module.exports = {
  ...roll,
  ...rollDice,
  ...rollMod,
  ...rollDiceMod,
  ...entities,
  ...rollTest,
  ...rollModTest,
  ...analyzeTest,
  ...analyzeModTest,
  default: undefined, // placeholder; will be overwritten
};

// assign default at runtime
module.exports.default = module.exports;
