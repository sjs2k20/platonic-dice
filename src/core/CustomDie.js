const { Die } = require("./Die");
const { rollDie } = require("./DiceUtils");

/**
 * Represents a fully customizable die where each face has a different effect.
 */
class CustomDie extends Die {
    /**
     * @param {DieType} type - The die type.
     * @param {Object.<number, function(): (number|string)>} faceMappings - Mapping of faces to outcomes.
     * @param {function(): (number|string)} [defaultOutcome] - Default outcome if a roll isn't mapped.
     */
    constructor(type, faceMappings, defaultOutcome = null) {
        super(type);
        this._faceMappings = faceMappings;
        this._defaultOutcome = defaultOutcome;
        this._outcome = null;
        this._outcomeHistory = [];
    }

    /**
     * Rolls the die and applies the corresponding face mapping.
     * @returns {number|string|null} - The final outcome.
     */
    roll() {
        const roll = rollDie(this._type);
        this._result = roll;
        this._history.push(this._result);
        const outcomeFn = this._faceMappings[roll] || this._defaultOutcome;

        this._outcome = outcomeFn ? outcomeFn() : null;
        this._outcomeHistory.push(this._outcome);
        return this._outcome;
    }

    /**
     * Returns a detailed report of the last roll and its mapped outcome.
     * @param {boolean} [verbose=false] - Whether to include full history.
     * @returns {string} - JSON string representation of the roll state.
     */
    report(verbose = false) {
        const reportData = {
            type: this.type,
            last_result: this._result,
            last_outcome: this._outcome ?? "No effect",
        };

        if (verbose) {
            reportData.roll_history = this._history;
            reportData.outcome_history = this._outcomeHistory;
        }

        return reportData;
    }

    /**
     * Returns the last outcome value.
     * @returns {number|string|null}
     */
    getOutcome() {
        return this._outcome;
    }

    /**
     * Returns the full outcome history.
     * @returns {Array<number|string|null>}
     */
    getOutcomeHistory() {
        return this._outcomeHistory;
    }

    /**
     * Overrides the type getter to prefix "Custom_".
     * @returns {string}
     */
    get type() {
        return `Custom_${this._type}`;
    }
}

module.exports = { CustomDie };
