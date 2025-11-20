/**
 * @module core
 * @description
 * Primary entry point for the core dice logic.
 * Re-exports all main rolling functions and modifiers.
 *
 * @example
 * import { roll, rollMod, rollDice, rollDiceMod, rollTest } from "@platonic-dice/core";
 */

// --- Core modules ---
const rollDice = require("./rollDice.js");
const roll = require("./roll.js");
const rollMod = require("./rollMod.js");
const rollDiceMod = require("./rollDiceMod.js");
const rollTest = require("./rollTest.js");

// --- Entities (public API) ---
const entities = require("./entities");

/**
 * Combined exports for Node and TypeScript users.
 * @type {typeof import("./roll") &
 *        typeof import("./rollDice") &
 *        typeof import("./rollMod") &
 *        typeof import("./rollDiceMod") &
 *        typeof import("./rollTest") &
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
  default: undefined, // placeholder; will be overwritten
};

// assign default at runtime
module.exports.default = module.exports;
