/**
 * @module core
 * @description
 * Primary entry point for the core dice logic.
 * Re-exports all main rolling functions and modifiers.
 *
 * @example
 * import { roll, rollMod, rollDice } from "@dice/core";
 */

const rollDice = require("./rollDice.js");
const roll = require("./roll.js");
const rollMod = require("./rollMod.js");
const rollModDice = require("./rollModDice.js");

module.exports = {
  ...roll,
  ...rollDice,
  ...rollMod,
  ...rollModDice,
};

// --- For TypeScript users ---
module.exports.default = module.exports;
