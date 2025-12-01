/**
 * Lightweight registry for test types.
 *
 * Allows future registration of new test types with associated
 * `validateShape` and `buildEvaluator` functions. For now, only
 * `validateShape` is populated using `testValidators`.
 */

const validators = require("./testValidators");

/**
 * @typedef {import("./testValidators").Conditions} Conditions
 * @typedef {Record<string, unknown>} PlainObject
 * @typedef {Conditions|PlainObject} ConditionsLike
 *
 * Evaluator: function that maps a rolled base value (1..sides) to an OutcomeValue.
 * @typedef {(base: number) => import("../entities/Outcome").OutcomeValue} Evaluator
 *
 * BuildEvaluator: factory that builds an Evaluator for a specific die/conditions.
 * @typedef {(dieType: import("../entities/DieType").DieTypeValue, testConditions: ConditionsLike, modifier?: import("../entities/RollModifier").RollModifierInstance|null, useNaturalCrits?: boolean|null) => Evaluator} BuildEvaluator
 *
 * RegistryEntry: describes the shape validator, optional evaluator builder, and
 * optional default for `useNaturalCrits` for that test type.
 * @typedef {{ validateShape: (c: ConditionsLike) => boolean, buildEvaluator?: BuildEvaluator, defaultUseNaturalCrits?: boolean }} RegistryEntry
 */

/** Internal registry map: testType -> { validateShape, buildEvaluator? } */
const registry = new Map();

// Populate with built-in test types using validators
const builtIns = ["at_least", "at_most", "exact", "within", "in_list", "skill"];

for (const t of builtIns) {
  registry.set(t, {
    /** @param {ConditionsLike} c */
    validateShape: (c) => validators.areValidTestConditions(c, t),
    // buildEvaluator: returns an evaluator function (base:number)=>outcome
    /**
     * @param {import("../entities/DieType").DieTypeValue} dieType
     * @param {ConditionsLike} testConditions
     * @param {import("../entities/RollModifier").RollModifierInstance|null} [modifier]
     * @param {boolean|null} [useNaturalCrits]
     * @returns {(base: number) => import("../entities/Outcome").OutcomeValue}
     */
    /** @type {import("./testRegistry").BuildEvaluator} */
    buildEvaluator: (
      dieType,
      testConditions,
      modifier = null,
      useNaturalCrits = null
    ) => {
      // require lazily to avoid circular requires at module init
      const { createOutcomeMap } = require("./outcomeMapper");
      // t is a string matching TestType values; TS/JSDoc will accept via runtime checks
      const outcomeMap = createOutcomeMap(
        dieType,
        /** @type {any} */ (t),
        /** @type {any} */ (testConditions),
        modifier,
        useNaturalCrits
      );
      return /** @param {number} base */ (base) => outcomeMap[base];
    },
  });
}

/**
 * Register a new test type.
 * @param {string} name
 * @param {{ validateShape: (c: ConditionsLike) => boolean, buildEvaluator?: Function }} opts
 */
function registerTestType(name, { validateShape, buildEvaluator = undefined }) {
  if (!name || typeof name !== "string") {
    throw new TypeError("test type name must be a non-empty string");
  }
  registry.set(name, { validateShape, buildEvaluator });
}

/**
 * @param {string} name
 * @returns {RegistryEntry|undefined}
 */
function getRegistration(name) {
  return registry.get(name) || undefined;
}

module.exports = {
  registerTestType,
  getRegistration,
  registry, // exported for introspection in tests/tools
};
