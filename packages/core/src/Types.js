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
 * A result that a die face can produce.
 * Can be:
 *  - A number
 *  - A string
 *  - A function that accepts a number (the rolled face) and returns a number
 *
 * @typedef {(number | string | function(number): number)} DieFaceResult
 */

/**
 * A mapping between a die face value and its result.
 *
 * @typedef {Object} DieFaceMapping
 * @property {number} face - The face value (e.g., 1–20 for a d20).
 * @property {DieFaceResult} result - The outcome for this face.
 */

/**
 * A collection of face-to-result mappings for a custom die.
 *
 * @typedef {DieFaceMapping[]} DieFaceResultMap
 */

module.exports = { DieType, RollType, Outcome };
