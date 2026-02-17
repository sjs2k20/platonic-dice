/**
 * @module @platonic-dice/core/src/utils
 * @description
 * Internal utility functions for core dice logic.
 *
 * These functions provide shared, low-level logic such as
 * generating random die results, computing number of sides,
 * and evaluating roll outcomes.
 *
 * They are used internally by the `@platonic-dice/core/src` roll functions
 * and entity validation routines.
 *
 * @private
 *
 * @example
 * // Internal usage only — not part of the public API
 * import { generateDieResult, determineOutcome } from "../utils";
 */
// Lazy-loaded per-export getters to avoid circular require during
// module initialization. Each exported name is resolved on first
// access and cached locally. Properties are `configurable: true`
// so test frameworks (e.g., Jest) can spy/mock them.

/** @type {typeof import("./determineOutcome").determineOutcome | undefined} */
let _determineOutcome;
Object.defineProperty(exports, "determineOutcome", {
  enumerable: true,
  configurable: true,
  get() {
    if (_determineOutcome !== undefined) return _determineOutcome;
    _determineOutcome = require("./determineOutcome.js").determineOutcome;
    return _determineOutcome;
  },
});

/** @type {typeof import("./generateResult").generateResult | undefined} */
let _generateResult;
Object.defineProperty(exports, "generateResult", {
  enumerable: true,
  configurable: true,
  get() {
    if (_generateResult !== undefined) return _generateResult;
    _generateResult = require("./generateResult.js").generateResult;
    return _generateResult;
  },
});

/** @type {typeof import("./generateResult").numSides | undefined} */
let _numSides;
Object.defineProperty(exports, "numSides", {
  enumerable: true,
  configurable: true,
  get() {
    if (_numSides !== undefined) return _numSides;
    _numSides = require("./generateResult.js").numSides;
    return _numSides;
  },
});

/** @type {typeof import("./outcomeMapper").createOutcomeMap | undefined} */
let _createOutcomeMap;
Object.defineProperty(exports, "createOutcomeMap", {
  enumerable: true,
  configurable: true,
  get() {
    if (_createOutcomeMap !== undefined) return _createOutcomeMap;
    _createOutcomeMap = require("./outcomeMapper.js").createOutcomeMap;
    return _createOutcomeMap;
  },
});

/** @type {typeof import("./outcomeMapper").clearOutcomeMapCache | undefined} */
let _clearOutcomeMapCache;
Object.defineProperty(exports, "clearOutcomeMapCache", {
  enumerable: true,
  configurable: true,
  get() {
    if (_clearOutcomeMapCache !== undefined) return _clearOutcomeMapCache;
    _clearOutcomeMapCache = require("./outcomeMapper.js").clearOutcomeMapCache;
    return _clearOutcomeMapCache;
  },
});

/** @type {typeof import("./outcomeMapper").getOutcomeMapCacheSize | undefined} */
let _getOutcomeMapCacheSize;
Object.defineProperty(exports, "getOutcomeMapCacheSize", {
  enumerable: true,
  configurable: true,
  get() {
    if (_getOutcomeMapCacheSize !== undefined) return _getOutcomeMapCacheSize;
    _getOutcomeMapCacheSize =
      require("./outcomeMapper.js").getOutcomeMapCacheSize;
    return _getOutcomeMapCacheSize;
  },
});

/** @type {typeof import("./getEvaluator").getEvaluator | undefined} */
let _getEvaluator;
Object.defineProperty(exports, "getEvaluator", {
  enumerable: true,
  configurable: true,
  get() {
    if (_getEvaluator !== undefined) return _getEvaluator;
    _getEvaluator = require("./getEvaluator.js").getEvaluator;
    return _getEvaluator;
  },
});

// testRegistry exports
/** @type {typeof import("./testRegistry").registerTestType | undefined} */
let _registerTestType;
Object.defineProperty(exports, "registerTestType", {
  enumerable: true,
  configurable: true,
  get() {
    if (_registerTestType !== undefined) return _registerTestType;
    _registerTestType = require("./testRegistry.js").registerTestType;
    return _registerTestType;
  },
});

/** @type {typeof import("./testRegistry").getRegistration | undefined} */
let _getRegistration;
Object.defineProperty(exports, "getRegistration", {
  enumerable: true,
  configurable: true,
  get() {
    if (_getRegistration !== undefined) return _getRegistration;
    _getRegistration = require("./testRegistry.js").getRegistration;
    return _getRegistration;
  },
});

/** @type {typeof import("./testRegistry").registry | undefined} */
let _registry;
Object.defineProperty(exports, "registry", {
  enumerable: true,
  configurable: true,
  get() {
    if (_registry !== undefined) return _registry;
    _registry = require("./testRegistry.js").registry;
    return _registry;
  },
});

// testValidators exports
/** @type {typeof import("./testValidators").isValidFaceValue | undefined} */
let _isValidFaceValue;
Object.defineProperty(exports, "isValidFaceValue", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidFaceValue !== undefined) return _isValidFaceValue;
    _isValidFaceValue = require("./testValidators.js").isValidFaceValue;
    return _isValidFaceValue;
  },
});

/** @type {typeof import("./testValidators").areValidFaceValues | undefined} */
let _areValidFaceValues;
Object.defineProperty(exports, "areValidFaceValues", {
  enumerable: true,
  configurable: true,
  get() {
    if (_areValidFaceValues !== undefined) return _areValidFaceValues;
    _areValidFaceValues = require("./testValidators.js").areValidFaceValues;
    return _areValidFaceValues;
  },
});

/** @type {typeof import("./testValidators").isValidThresholdOrder | undefined} */
let _isValidThresholdOrder;
Object.defineProperty(exports, "isValidThresholdOrder", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidThresholdOrder !== undefined) return _isValidThresholdOrder;
    _isValidThresholdOrder =
      require("./testValidators.js").isValidThresholdOrder;
    return _isValidThresholdOrder;
  },
});

/** @type {typeof import("./testValidators").isValidTargetConditions | undefined} */
let _isValidTargetConditions;
Object.defineProperty(exports, "isValidTargetConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidTargetConditions !== undefined) return _isValidTargetConditions;
    _isValidTargetConditions =
      require("./testValidators.js").isValidTargetConditions;
    return _isValidTargetConditions;
  },
});

/** @type {typeof import("./testValidators").isValidSkillTestCondition | undefined} */
let _isValidSkillTestCondition;
Object.defineProperty(exports, "isValidSkillTestCondition", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidSkillTestCondition !== undefined)
      return _isValidSkillTestCondition;
    _isValidSkillTestCondition =
      require("./testValidators.js").isValidSkillTestCondition;
    return _isValidSkillTestCondition;
  },
});

/** @type {typeof import("./testValidators").isValidWithinConditions | undefined} */
let _isValidWithinConditions;
Object.defineProperty(exports, "isValidWithinConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidWithinConditions !== undefined) return _isValidWithinConditions;
    _isValidWithinConditions =
      require("./testValidators.js").isValidWithinConditions;
    return _isValidWithinConditions;
  },
});

/** @type {typeof import("./testValidators").isValidSpecificListConditions | undefined} */
let _isValidSpecificListConditions;
Object.defineProperty(exports, "isValidSpecificListConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_isValidSpecificListConditions !== undefined)
      return _isValidSpecificListConditions;
    _isValidSpecificListConditions =
      require("./testValidators.js").isValidSpecificListConditions;
    return _isValidSpecificListConditions;
  },
});

/** @type {typeof import("./testValidators").areValidValuesInRange | undefined} */
let _areValidValuesInRange;
Object.defineProperty(exports, "areValidValuesInRange", {
  enumerable: true,
  configurable: true,
  get() {
    if (_areValidValuesInRange !== undefined) return _areValidValuesInRange;
    _areValidValuesInRange =
      require("./testValidators.js").areValidValuesInRange;
    return _areValidValuesInRange;
  },
});

/** @type {typeof import("./testValidators").areValidTestConditions | undefined} */
let _areValidTestConditions;
Object.defineProperty(exports, "areValidTestConditions", {
  enumerable: true,
  configurable: true,
  get() {
    if (_areValidTestConditions !== undefined) return _areValidTestConditions;
    _areValidTestConditions =
      require("./testValidators.js").areValidTestConditions;
    return _areValidTestConditions;
  },
});
