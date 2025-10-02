const { DieType, RollRecordManager, RollType, rollDie } = require("../");

/**
 * Represents a standard Die object.
 */
class Die {
    /**
     * @param {DieType} type - The type of die.
     */
    constructor(type) {
        if (!Object.values(DieType).includes(type)) {
            throw new Error(`Invalid die type: ${type}`);
        }
        this._type = type;
        this._result = null;
        this._rolls = new RollRecordManager();
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

    /** Roll history (abridged, without timestamps). */
    get history() {
        return this._rolls.all;
    }

    /** Full roll history (with timestamps). */
    get history_full() {
        return this._rolls.full;
    }

    /** Returns the number of faces for this die. */
    get faceCount() {
        const lookup = {
            [DieType.D4]: 4,
            [DieType.D6]: 6,
            [DieType.D8]: 8,
            [DieType.D10]: 10,
            [DieType.D12]: 12,
            [DieType.D20]: 20,
        };
        return lookup[this._type];
    }

    /**
     * Resets the die's state.
     * @param {boolean} [complete=false] - If true, also clears history.
     */
    _reset(complete = false) {
        this._result = null;
        if (complete) {
            this._rolls.clear();
        }
    }

    /**
     * Rolls the die with optional parameters.
     * @param {RollType} [rollType] - Advantage/Disadvantage rolling.
     * @returns {number} - The roll result.
     */
    roll(rollType = null) {
        if (rollType !== null && !Object.values(RollType).includes(rollType)) {
            throw new Error(`Invalid roll type: ${rollType}`);
        }
        this._reset();
        this._result = rollDie(this._type, rollType);
        this._rolls.add({ roll: this._result, timestamp: new Date() });
        return this._result;
    }

    /**
     * Retrieves roll history with fine-grained control.
     * @param {Object} [options]
     * @param {number} [options.limit] - Number of records to retrieve.
     * @param {boolean} [options.verbose=false] - Include timestamps.
     * @returns {RollRecord[]}
     */
    historyDetailed(options = {}) {
        return this._rolls.report(options);
    }

    /**
     * Generates a report of the die's state.
     *
     * At minimum, always includes:
     * - type
     * - latest_roll (from RollRecordManager.report with limit=1)
     * - times_rolled
     *
     * If options are passed, they are forwarded to RollRecordManager.report
     * to control inclusion of history, verbosity, and record limits.
     *
     * @param {Object} [options]
     * @param {number} [options.limit] - Max number of records for history.
     * @param {boolean} [options.verbose=false] - Include timestamps if true.
     * @param {boolean} [options.includeHistory=false] - Whether to include history.
     * @returns {Object}
     */
    report({ limit, verbose = false, includeHistory = false } = {}) {
        const latest = this._rolls.report({ verbose, limit: 1 })[0] || null;

        const baseReport = {
            type: this._type,
            latest_roll: latest,
            times_rolled: this._rolls.length,
        };

        if (includeHistory) {
            baseReport.history = this._rolls.report({ verbose, limit });
        }

        return baseReport;
    }

    toString() {
        if (this._rolls.length === 0) {
            return `Die(${this._type}): not rolled yet`;
        }
        const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];
        return `Die(${this._type}): latest=${JSON.stringify(
            latest
        )}, total rolls=${this._rolls.length}`;
    }

    toJSON() {
        return this.report({ verbose: true, includeHistory: true });
    }
}

module.exports = { Die };
