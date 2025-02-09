const { DieType, RollType, rollDie } = require("../");

/**
 * Represents a standard Die object.
 */
class Die {
    /**
     * @param {DieType} type - The type of die.
     */
    constructor(type) {
        this._type = type;
        this._result = null;
        this._history = [];
    }

    /**
     * Resets the die's state.
     * @param {boolean} [complete=false] - If true, also clears history.
     */
    _reset(complete = false) {
        this._result = null;
        if (complete) {
            this._history = [];
        }
    }

    /**
     * Rolls the die with optional parameters.
     * @param {RollType} [rollType] - Advantage/Disadvantage rolling.
     * @returns {number} - The roll result.
     */
    roll(rollType = null) {
        this._reset();
        this._result = rollDie(this._type, rollType);
        this._history.push(this._result);
        return this._result;
    }

    /**
     * Retrieves the last roll result.
     * @returns {number | null}
     */
    get result() {
        return this._result;
    }

    /**
     * Retrieves the die type.
     * @returns {DieType}
     */
    get type() {
        return this._type;
    }

    /**
     * Retrieves roll history.
     * @returns {number[]}
     */
    get history() {
        return this._history;
    }

    /**
     * Generates a report of the die's state.
     * @param {boolean} [verbose=false] - If true, includes history.
     * @returns {Object} - The die report.
     */
    report(verbose = false) {
        const baseReport = {
            type: this._type,
            last_result: this._result,
        };

        if (verbose) {
            baseReport.history = this._history;
        }

        return baseReport;
    }

    /**
     * Converts the die's state to a JSON string.
     * Includes full history by default.
     *
     * @returns {string} - A JSON-formatted string representing the die's state.
     */
    toJSON(verbose = true) {
        return JSON.stringify(this.report(verbose), null, 2);
    }
}

module.exports = { Die };
