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

// Lazy-loaded per-export getters to avoid circular require during
// module initialization. Each exported name is resolved on first
// access and cached locally. Properties are `configurable: true`
// so test frameworks (e.g., Jest) can spy/mock them.

// DieType
/** @type {typeof import("./DieType").DieType | undefined} */
let _DieType;
Object.defineProperty(exports, "DieType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_DieType !== undefined) return _DieType;
    _DieType = require("./DieType.js").DieType;
    return _DieType;
  },
});

/** @type {typeof import("./DieType").isValidDieType | undefined} */
let _isValidDieType;
Object.defineProperty(exports, "isValidDieType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidDieType !== undefined) return _isValidDieType;
    _isValidDieType = require("./DieType.js").isValidDieType;
    return _isValidDieType;
  },
});

// Outcome
/** @type {typeof import("./Outcome").Outcome | undefined} */
let _Outcome;
Object.defineProperty(exports, "Outcome", {
  enumerable: true,
  configurable: true,
  get() {
    if (_Outcome !== undefined) return _Outcome;
    _Outcome = require("./Outcome.js").Outcome;
    return _Outcome;
  },
});

/** @type {typeof import("./Outcome").isValidOutcome | undefined} */
let _isValidOutcome;
Object.defineProperty(exports, "isValidOutcome", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidOutcome !== undefined) return _isValidOutcome;
    _isValidOutcome = require("./Outcome.js").isValidOutcome;
    return _isValidOutcome;
  },
});

// RollModifier
/** @type {typeof import("./RollModifier").RollModifier | undefined} */
let _RollModifier;
Object.defineProperty(exports, "RollModifier", {
  enumerable: true,
  configurable: true,
  get() {
    if (_RollModifier !== undefined) return _RollModifier;
    _RollModifier = require("./RollModifier.js").RollModifier;
    return _RollModifier;
  },
});

/** @type {typeof import("./RollModifier").isValidRollModifier | undefined} */
let _isValidRollModifier;
Object.defineProperty(exports, "isValidRollModifier", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidRollModifier !== undefined) return _isValidRollModifier;
    _isValidRollModifier = require("./RollModifier.js").isValidRollModifier;
    return _isValidRollModifier;
  },
});

/** @type {typeof import("./RollModifier").normaliseRollModifier | undefined} */
let _normaliseRollModifier;
Object.defineProperty(exports, "normaliseRollModifier", {
  enumerable: true,
  configurable: true,
  get() {
    if (_normaliseRollModifier !== undefined) return _normaliseRollModifier;
    _normaliseRollModifier = require("./RollModifier.js").normaliseRollModifier;
    return _normaliseRollModifier;
  },
});

// RollType
/** @type {typeof import("./RollType").RollType | undefined} */
let _RollType;
Object.defineProperty(exports, "RollType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_RollType !== undefined) return _RollType;
    _RollType = require("./RollType.js").RollType;
    return _RollType;
  },
});

/** @type {typeof import("./RollType").isValidRollType | undefined} */
let _isValidRollType;
Object.defineProperty(exports, "isValidRollType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidRollType !== undefined) return _isValidRollType;
    _isValidRollType = require("./RollType.js").isValidRollType;
    return _isValidRollType;
  },
});

// TestConditions
/** @type {typeof import("./TestConditions").TestConditions | undefined} */
let _TestConditions;
Object.defineProperty(exports, "TestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_TestConditions !== undefined) return _TestConditions;
    _TestConditions = require("./TestConditions.js").TestConditions;
    return _TestConditions;
  },
});

/** @type {typeof import("./TestConditions").areValidTestConditions | undefined} */
let _areValidTestConditions;
Object.defineProperty(exports, "areValidTestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_areValidTestConditions !== undefined) return _areValidTestConditions;
    _areValidTestConditions =
      require("./TestConditions.js").areValidTestConditions;
    return _areValidTestConditions;
  },
});

/** @type {typeof import("./TestConditions").normaliseTestConditions | undefined} */
let _normaliseTestConditions;
Object.defineProperty(exports, "normaliseTestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_normaliseTestConditions !== undefined) return _normaliseTestConditions;
    _normaliseTestConditions =
      require("./TestConditions.js").normaliseTestConditions;
    return _normaliseTestConditions;
  },
});

// ModifiedTestConditions
/** @type {typeof import("./ModifiedTestConditions").ModifiedTestConditions | undefined} */
let _ModifiedTestConditions;
Object.defineProperty(exports, "ModifiedTestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_ModifiedTestConditions !== undefined) return _ModifiedTestConditions;
    _ModifiedTestConditions =
      require("./ModifiedTestConditions.js").ModifiedTestConditions;
    return _ModifiedTestConditions;
  },
});

/** @type {typeof import("./ModifiedTestConditions").areValidModifiedTestConditions | undefined} */
let _areValidModifiedTestConditions;
Object.defineProperty(exports, "areValidModifiedTestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_areValidModifiedTestConditions !== undefined)
      return _areValidModifiedTestConditions;
    _areValidModifiedTestConditions =
      require("./ModifiedTestConditions.js").areValidModifiedTestConditions;
    return _areValidModifiedTestConditions;
  },
});

/** @type {typeof import("./ModifiedTestConditions").computeModifiedRange | undefined} */
let _computeModifiedRange;
Object.defineProperty(exports, "computeModifiedRange", {
  enumerable: true,
  configurable: true,
  get() {
    if (_computeModifiedRange !== undefined) return _computeModifiedRange;
    _computeModifiedRange =
      require("./ModifiedTestConditions.js").computeModifiedRange;
    return _computeModifiedRange;
  },
});

// TestType
/** @type {typeof import("./TestType").TestType | undefined} */
let _TestType;
Object.defineProperty(exports, "TestType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_TestType !== undefined) return _TestType;
    _TestType = require("./TestType.js").TestType;
    return _TestType;
  },
});

/** @type {typeof import("./TestType").isValidTestType | undefined} */
let _isValidTestType;
Object.defineProperty(exports, "isValidTestType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidTestType !== undefined) return _isValidTestType;
    _isValidTestType = require("./TestType.js").isValidTestType;
    return _isValidTestType;
  },
});
