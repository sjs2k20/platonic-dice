/**
 * Enum for die types.
 * @readonly
 * @enum {string}
 */
const DieType = {
    D4: "d4",
    D6: "d6",
    D8: "d8",
    D10: "d10",
    D12: "d12",
    D20: "d20",
};

/**
 * Enum for roll types (advantage/disadvantage).
 * @readonly
 * @enum {string}
 */
const RollType = {
    Advantage: "advantage",
    Disadvantage: "disadvantage",
};

/**
 * Enum for possible roll outcomes.
 * @readonly
 * @enum {string}
 */
const Outcome = {
    Success: "success",
    Failure: "failure",
    Critical_Success: "critical_success",
    Critical_Failure: "critical_failure",
};

/**
 * Represents conditions for a test-based roll.
 * @typedef {Object} TestConditions
 * @property {number} target - The minimum value required for success.
 * @property {number} [critical_success] - Rolls equal to or above this count as a critical success.
 * @property {number} [critical_failure] - Rolls equal to or below this count as a critical failure.
 */

/**
 * Represents conditions for a target-based roll.
 * @typedef {Object} TargetConditions
 * @property {number[]} target_values - An array of values that count as a success.
 */

/**
 * Represents face-to-outcome mappings for a CustomDie.
 * @typedef {Object} FaceOutcomeMapping
 * @property {function(number): (number | string)} [default] - Default outcome function (if face not explicitly mapped).
 * @property {Object<number, function(number): (number | string)>} mappings - Explicit mappings of face values to outcome functions.
 */

module.exports = { DieType, RollType, Outcome };
