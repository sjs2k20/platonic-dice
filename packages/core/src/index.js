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
const rollDiceTest = require("./rollDiceTest.js");
const rollTest = require("./rollTest.js");
const rollModTest = require("./rollModTest.js");
const analyseTest = require("./analyseTest.js");
const analyseModTest = require("./analyseModTest.js");

// --- Entities (public API) ---
const entities = require("./entities");

/**
 * Attach named exports onto `exports` so TypeScript declaration emit
 * produces named exports rather than an `export =` wrapper.
 */
Object.assign(exports, roll);
Object.assign(exports, rollDice);
Object.assign(exports, rollMod);
Object.assign(exports, rollDiceMod);
Object.assign(exports, rollDiceTest);
Object.assign(exports, entities);
Object.assign(exports, rollTest);
Object.assign(exports, rollModTest);
Object.assign(exports, analyseTest);
Object.assign(exports, analyseModTest);

// provide a `default` export for compatibility
exports.default = exports;
