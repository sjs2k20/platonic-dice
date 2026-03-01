/**
 * @module @platonic-dice/core/src/utils/outcomeMapper
 * @description
 * Creates outcome maps for die rolls, handling natural crits and modifiers.
 * This provides a centralised way to determine all possible outcomes for a
 * given die configuration.
 *
 * Includes memoization cache for performance optimization.
 */

const { determineOutcome } = require("./determineOutcome");
const { numSides } = require("./generateResult");

/**
 * Lazy-loaded entities to avoid circular dependencies.
 * @private
 */
function getEntities() {
  return require("../entities");
}

/**
 * Memoization cache for outcome maps.
 * @private
 * @type {Map<string, Object.<number, import("../entities/Outcome").OutcomeValue>>}
 */
const outcomeMapCache = new Map();

/**
 * Applies natural crit logic based on test type.
 * Only applies to Skill, AtLeast, and AtMost test types.
 *
 * @private
 * @param {import("../entities/Outcome").OutcomeValue} currentOutcome - The outcome before natural crit override
 * @param {boolean} isNaturalMax - Whether this is the maximum die value
 * @param {boolean} isNaturalMin - Whether this is the minimum die value (1)
 * @param {import("../entities/TestType").TestTypeValue} testType - The type of test
 * @returns {import("../entities/Outcome").OutcomeValue} The potentially overridden outcome
 */
function applyNaturalCritOverride(
  currentOutcome,
  isNaturalMax,
  isNaturalMin,
  testType,
) {
  const { TestType, Outcome } = getEntities();

  // Skill tests: natural crits become Critical outcomes
  if (testType === TestType.Skill) {
    if (isNaturalMax) return Outcome.CriticalSuccess;
    if (isNaturalMin) return Outcome.CriticalFailure;
    return currentOutcome;
  }

  // At-Most tests: natural max is BAD (failure), natural min is GOOD (success)
  if (testType === TestType.AtMost) {
    if (isNaturalMax) return Outcome.Failure;
    if (isNaturalMin) return Outcome.Success;
    return currentOutcome;
  }

  // At-Least tests: natural max is GOOD (success), natural min is BAD (failure)
  if (testType === TestType.AtLeast) {
    if (isNaturalMax) return Outcome.Success;
    if (isNaturalMin) return Outcome.Failure;
    return currentOutcome;
  }

  // Other test types (Exact, Within, InList): natural crits don't apply
  return currentOutcome;
}

/**
 * Creates a cache key for outcome map memoization.
 *
 * @private
 * @param {import("../entities/DieType").DieTypeValue} dieType
 * @param {import("../entities/TestType").TestTypeValue} testType
 * @param {import("../entities/TestConditions").TestConditionsInstance} testConditions
 * @param {import("../entities/RollModifier").RollModifierInstance|undefined} modifier
 * @param {boolean|undefined} useNaturalCrits
 * @returns {string}
 */
function createCacheKey(
  dieType,
  testType,
  testConditions,
  modifier,
  useNaturalCrits,
) {
  // serialise the conditions object for hashing
  const conditionsKey = JSON.stringify({
    testType: testConditions.testType,
    conditions: testConditions.conditions,
  });

  // Create modifier key (use function toString for consistent hashing)
  // Create modifier key; prefer a short, stable fingerprint. We use the
  // modifier function's text but truncate to avoid extremely long cache keys.
  let modifierKey = "none";
  if (modifier) {
    try {
      const fn =
        modifier.fn && typeof modifier.fn === "function"
          ? modifier.fn
          : modifier;
      const s = String(fn);
      modifierKey = s.length > 200 ? s.slice(0, 200) + "..." : s;
    } catch (e) {
      modifierKey = "modifier";
    }
  }

  return `${dieType}|${testType}|${conditionsKey}|${modifierKey}|${useNaturalCrits}`;
}

/**
 * Creates an outcome map for all possible base rolls given the configuration.
 * Uses memoization cache for performance.
 *
 * @param {import("../entities/DieType").DieTypeValue} dieType - The type of die
 * @param {import("../entities/TestType").TestTypeValue} testType - The type of test being performed
 * @param {import("../entities/TestConditions").TestConditionsInstance} testConditions - The test conditions
 * @param {import("../entities/RollModifier").RollModifierInstance|undefined} modifier - Optional modifier to apply
 * @param {boolean|undefined} useNaturalCrits - Whether to use natural crits (undefined = auto-determine)
 * @returns {Object.<number, import("../entities/Outcome").OutcomeValue>} Map of baseRoll -> outcome
 */
function createOutcomeMap(
  dieType,
  testType,
  testConditions,
  modifier = undefined,
  useNaturalCrits = undefined,
) {
  const { TestType } = getEntities();

  // Resolve `useNaturalCrits` with the following precedence:
  // 1. Caller-provided `useNaturalCrits` (boolean)
  // 2. Registry-provided `defaultUseNaturalCrits` (optional boolean)
  // 3. Fallback default: true for Skill tests, false otherwise
  let shouldUseNaturalCrits = useNaturalCrits;
  // Try to get registry metadata (if registry is available) to consult any
  // declared `defaultUseNaturalCrits` for this testType. We swallow errors
  // to remain resilient if the registry cannot be loaded.
  let reg;
  try {
    const tr = require("./testRegistry");
    reg = tr.getRegistration(testType);
    if (
      shouldUseNaturalCrits == null &&
      reg &&
      typeof reg.defaultUseNaturalCrits === "boolean"
    ) {
      shouldUseNaturalCrits = reg.defaultUseNaturalCrits;
    }
  } catch (e) {
    // ignore registry errors and fall back to heuristic below
  }

  if (shouldUseNaturalCrits == null) {
    shouldUseNaturalCrits = testType === TestType.Skill;
  }

  // Check cache first
  const cacheKey = createCacheKey(
    dieType,
    testType,
    testConditions,
    modifier,
    shouldUseNaturalCrits,
  );
  const cached = outcomeMapCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Prefer registry builder when available to keep behavior consistent
  // with registered evaluators. Fall back to per-base determineOutcome loop.
  try {
    if (reg && typeof reg.buildEvaluator === "function") {
      // Normalize/construct the exact conditions instance to pass to the registry.
      const {
        TestConditions,
        normaliseTestConditions,
      } = require("../entities/TestConditions");
      const {
        ModifiedTestConditions,
      } = require("../entities/ModifiedTestConditions");

      let toPass = testConditions;
      if (!(testConditions instanceof TestConditions)) {
        if (testConditions instanceof ModifiedTestConditions) {
          toPass = testConditions;
        } else if (modifier == null) {
          toPass = normaliseTestConditions(testConditions, dieType);
        } else {
          // For modifier-aware evaluation build a ModifiedTestConditions here
          toPass = new ModifiedTestConditions(
            testType,
            testConditions,
            dieType,
            modifier,
          );
        }
      }

      const evaluator = reg.buildEvaluator(
        dieType,
        /** @type {import("./testValidators").Conditions} */ (
          /** @type {unknown} */ (toPass)
        ),
        modifier,
        shouldUseNaturalCrits,
      );
      const sides = numSides(dieType);
      /** @type {Object.<number, import("../entities/Outcome").OutcomeValue>} */
      const outcomeMap = {};
      for (let baseRoll = 1; baseRoll <= sides; baseRoll++) {
        outcomeMap[baseRoll] = evaluator(baseRoll);
      }
      outcomeMapCache.set(cacheKey, outcomeMap);
      return outcomeMap;
    }
  } catch (e) {
    // If registry cannot be loaded for any reason, gracefully fall back
    // to the existing per-base logic below.
  }

  const sides = numSides(dieType);
  /** @type {Object.<number, import("../entities/Outcome").OutcomeValue>} */
  const outcomeMap = {};

  for (let baseRoll = 1; baseRoll <= sides; baseRoll++) {
    // Apply modifier if present
    const value = modifier ? modifier.apply(baseRoll) : baseRoll;

    // Determine base outcome from test evaluation
    let outcome = determineOutcome(
      value,
      /** @type {import("../entities/TestConditions").TestConditionsInstance} */ (
        testConditions
      ),
    );

    // Apply natural crit overrides if enabled
    if (shouldUseNaturalCrits) {
      const isNaturalMax = baseRoll === sides;
      const isNaturalMin = baseRoll === 1;

      outcome = applyNaturalCritOverride(
        outcome,
        isNaturalMax,
        isNaturalMin,
        testType,
      );
    }

    outcomeMap[baseRoll] = outcome;
  }

  // Store in cache before returning
  outcomeMapCache.set(cacheKey, outcomeMap);

  return outcomeMap;
}

/**
 * Clears the outcome map cache.
 * Useful for testing or memory management.
 *
 * @function clearOutcomeMapCache
 */
function clearOutcomeMapCache() {
  outcomeMapCache.clear();
}

/**
 * Gets the current size of the outcome map cache.
 *
 * @function getOutcomeMapCacheSize
 * @returns {number}
 */
function getOutcomeMapCacheSize() {
  return outcomeMapCache.size;
}

module.exports = {
  createOutcomeMap,
  clearOutcomeMapCache,
  getOutcomeMapCacheSize,
};
