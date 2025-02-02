const { DieType } = require("./Types");
const { rollDice } = require("./DiceUtils");

/**
 * Represents a Die object with optional modifier functionality.
 */
class Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {Function} [modifier=null] - Optional modifier function.
     */
    constructor(type, modifier = null) {
        this._type = type;
        this._modifier = modifier;
        this._result = null;
        this._modifiedResult = null;
        this._history = [];
        this._modifiedHistory = modifier ? [] : null;
    }

    /**
     * Resets the die's state.
     * @param {boolean} [complete=false] - If true, also clears history.
     */
    _reset(complete = false) {
        this._result = null;
        this._modifiedResult = null;
        if (complete) {
            this._history = [];
            if (this._modifiedHistory) this._modifiedHistory = [];
        }
    }

    /**
     * Rolls the die with optional parameters.
     * @param {Object} [options] - Optional roll settings.
     * @param {import("./Types").RollType} [options.rollType] - Advantage/Disadvantage rolling.
     * @returns {number} - The roll result.
     */
    roll(options = {}) {
        this._reset();
        const result = rollDice(this._type, {
            ...options,
            modifier: this._modifier,
        });

        if (this._modifier) {
            this._result = result.base;
            this._modifiedResult = result.modified;
            this._history.push(this._result);
            this._modifiedHistory.push(this._modifiedResult);
            return this._modifiedResult;
        } else {
            this._result = result;
            this._history.push(this._result);
            return this._result;
        }
    }

    /**
     * Sets a new modifier and resets modified history.
     * @param {Function | null} modifier - The new modifier function or null to disable modification.
     */
    set modifier(modifier) {
        this._modifier = modifier;
        this._modifiedHistory = modifier ? [] : null;
    }

    /**
     * Retrieves the last roll result (modified if applicable).
     * @returns {number | null}
     */
    get result() {
        return this._modifiedResult ?? this._result;
    }

    /**
     * Retrieves the die type.
     * @returns {DieType}
     */
    get type() {
        return this._modifier ? `Modified_${this._type}` : this._type;
    }

    /**
     * Retrieves roll history.
     * @returns {number[]}
     */
    get history() {
        return this._history;
    }

    /**
     * Retrieves modified roll history (if applicable).
     * @returns {number[] | null}
     */
    get modifiedHistory() {
        return this._modifiedHistory;
    }

    /**
     * Generates a report of the die's state.
     * @param {boolean} [verbose=false] - If true, includes history.
     * @returns {string} - The die report.
     */
    report(verbose = false) {
        const reportData = {
            type: this.type,
            last_result: this.result,
        };

        if (verbose) {
            reportData.history = this._history;
            if (this._modifiedHistory)
                reportData.modified_history = this._modifiedHistory;
        }

        return JSON.stringify(reportData, null, verbose ? 2 : 0);
    }
}

module.exports = { Die };
