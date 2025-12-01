/**
 * @module @platonic-dice/core/src/entities/ModifiedTestConditions
 * @description
 * Represents test conditions for modified rolls, where the achievable range
 * is determined by both the base die type and the applied modifier.
 *
 * Unlike {@link TestConditions}, this class validates targets against the
 * **modified range** rather than just the base die faces.
 *
 * @example
 * // D6 with +10 modifier can reach 11-16
 * const conditions = new ModifiedTestConditions(
 *   TestType.AtLeast,
 *   { target: 15 },
 *   DieType.D6,
 *   (n) => n + 10
 * );
 */

const { isValidDieType } = require("./DieType");
const { isValidTestType } = require("./TestType");
const { normaliseRollModifier } = require("./RollModifier");
const { numSides } = require("../utils");
const validators = require("../utils/testValidators");

/**
 * @typedef {import("./TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./RollModifier").RollModifierInstance} RollModifierInstance
 */

/**
 * Computes the achievable range for a die + modifier combination.
 *
 * @private
 * @param {DieTypeValue} dieType
 * @param {RollModifierInstance} modifier
 * @returns {{ min: number, max: number }}
 */
function computeModifiedRange(dieType, modifier) {
  const sides = numSides(dieType);
  const minRoll = 1;
  const maxRoll = sides;

  // Apply modifier to both extremes
  const minModified = modifier.apply(minRoll);
  const maxModified = modifier.apply(maxRoll);

  // Handle cases where modifier might reverse order (e.g., negative multipliers)
  return {
    min: Math.min(minModified, maxModified),
    max: Math.max(minModified, maxModified),
  };
}

/**
 * Represents a set of validated test conditions for modified rolls.
 *
 * This class is similar to {@link TestConditions} but validates numeric
 * targets against the achievable range after applying a modifier.
 */
class ModifiedTestConditions {
  /**
   * @param {TestTypeValue} testType - The test type.
   * @param {Conditions} conditions - The test conditions object.
   * @param {DieTypeValue} dieType - The base die type.
   * @param {RollModifierFunction | RollModifierInstance} modifier - The modifier to apply.
   * @throws {TypeError|RangeError} If the test type or conditions are invalid.
   */
  constructor(testType, conditions, dieType, modifier) {
    if (!isValidTestType(testType)) {
      throw new TypeError(`Invalid test type: ${testType}`);
    }

    if (!conditions || typeof conditions !== "object") {
      throw new TypeError("conditions must be an object.");
    }

    if (!dieType) {
      throw new TypeError("dieType is required.");
    }

    if (!modifier) {
      throw new TypeError("modifier is required.");
    }

    // Normalize the modifier
    const mod = normaliseRollModifier(modifier);

    // Compute the achievable range with this modifier
    const range = computeModifiedRange(dieType, mod);

    // Validate conditions against the modified range
    if (
      !areValidModifiedTestConditions(
        { ...conditions, modifiedRange: range },
        testType
      )
    ) {
      switch (testType) {
        case "at_least":
        case "at_most":
        case "exact":
          throw new RangeError(
            `Invalid ${testType} condition for ${dieType} with modifier: target must be achievable (range: ${range.min}–${range.max}).`
          );
        case "within":
          throw new RangeError(
            `Invalid 'within' condition for ${dieType} with modifier: range must be achievable (${range.min}–${range.max}).`
          );
        case "in_list":
          throw new RangeError(
            `Invalid 'in_list' condition for ${dieType} with modifier: values must be achievable (${range.min}–${range.max}).`
          );
        case "skill":
          throw new RangeError(
            `Invalid 'skill' condition for ${dieType} with modifier: thresholds must be achievable (${range.min}–${range.max}).`
          );
        default:
          throw new TypeError(`Unknown testType '${testType}'.`);
      }
    }

    /** @type {TestTypeValue} */
    this.testType = testType;
    /** @type {Conditions} */
    this.conditions = conditions;
    /** @type {DieTypeValue} */
    this.dieType = dieType;
    /** @type {RollModifierInstance} */
    this.modifier = mod;
    /** @type {{ min: number, max: number }} */
    this.modifiedRange = range;
  }

  /**
   * Validates that the test conditions still conform to spec.
   * @throws {TypeError} If the test conditions are invalid.
   */
  validate() {
    if (
      !areValidModifiedTestConditions(
        { ...this.conditions, modifiedRange: this.modifiedRange },
        this.testType
      )
    ) {
      throw new TypeError("Invalid modified test conditions.");
    }
  }
}

/**
 * Validates test conditions against a modified range.
 *
 * @private
 * @param {Conditions & Record<string, any>} c - Conditions with modifiedRange
 * @param {TestTypeValue} testType
 * @returns {boolean}
 */
function areValidModifiedTestConditions(c, testType) {
  if (!c.modifiedRange) return false;

  const { min, max } = c.modifiedRange;

  switch (testType) {
    case "exact":
    case "at_least":
    case "at_most":
      return (
        typeof c.target === "number" &&
        Number.isInteger(c.target) &&
        c.target >= min &&
        c.target <= max
      );

    case "within":
      return (
        typeof c.min === "number" &&
        typeof c.max === "number" &&
        Number.isInteger(c.min) &&
        Number.isInteger(c.max) &&
        c.min <= c.max &&
        c.min >= min &&
        c.max <= max
      );

    case "in_list":
      // Use shared validator helper for range checks (accepts arrays)
      return (
        Array.isArray(c.values) &&
        validators.areValidValuesInRange({ values: c.values }, min, max, [
          "values",
        ])
      );

    case "skill":
      // target is required
      if (
        typeof c.target !== "number" ||
        !Number.isInteger(c.target) ||
        c.target < min ||
        c.target > max
      ) {
        return false;
      }

      // Validate critical thresholds are within range if present using helper
      if (
        !validators.areValidValuesInRange(c, min, max, [
          "critical_success",
          "critical_failure",
        ])
      )
        return false;

      // Check logical ordering using shared helper
      return validators.isValidThresholdOrder(c);

    default:
      return false;
  }
}

/**
 * @typedef {Object} BaseTestCondition
 * @property {{ min: number, max: number }} modifiedRange
 */

/**
 * @typedef {BaseTestCondition & { target: number }} TargetConditions
 * @typedef {BaseTestCondition & { min: number, max: number }} WithinConditions
 * @typedef {BaseTestCondition & { values: number[] }} SpecificListConditions
 * @typedef {BaseTestCondition & { target: number, critical_success?: number, critical_failure?: number }} SkillConditions
 */

/**
 * @typedef {TargetConditions | SkillConditions | WithinConditions | SpecificListConditions} Conditions
 */

/**
 * @typedef {InstanceType<typeof ModifiedTestConditions>} ModifiedTestConditionsInstance
 */

module.exports = {
  ModifiedTestConditions,
  areValidModifiedTestConditions,
  computeModifiedRange,
};
