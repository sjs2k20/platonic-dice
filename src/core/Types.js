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
 * Represents face-to-outcome mappings for a CustomDie.
 * @typedef {Object} FaceOutcomeMapping
 * @property {function(number): (number | string)} [default] - Default outcome function (if face not explicitly mapped).
 * @property {Object<number, function(number): (number | string)>} mappings - Explicit mappings of face values to outcome functions.
 */

module.exports = { DieType, RollType, Outcome };
