const { DieType, RollRecordManager, RollType, rollDie } = require("../");

/**
 * Represents a standard die with roll tracking and history management.
 */
class Die {
    /**
     * Create a new die.
     * @param {DieType} type - The die type (e.g. D6, D20).
     * @throws {Error} If an invalid die type is provided.
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
     * The most recent roll result.
     * @returns {number|null}
     */
    get result() {
        return this._result;
    }

    /**
     * The die type.
     * @returns {DieType}
     */
    get type() {
        return this._type;
    }

    /**
     * Roll history without timestamps.
     * @returns {RollRecord[]}
     */
    get history() {
        return this._rolls.all;
    }

    /**
     * Full roll history including timestamps.
     * @returns {RollRecord[]}
     */
    get history_full() {
        return this._rolls.full;
    }

    /**
     * Number of faces for this die.
     * @returns {number}
     */
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
     * Reset the die state.
     * @param {boolean} [complete=false] - If true, clears history as well.
     */
    _reset(complete = false) {
        this._result = null;
        if (complete) {
            this._rolls.clear();
        }
    }

    /**
     * Roll the die.
     * @param {RollType|null} [rollType=null] - Optional roll modifier (advantage/disadvantage).
     * @returns {number} The result of the roll.
     * @throws {Error} If an invalid roll type is provided.
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
     * Retrieve roll history with options.
     * @param {Object} [options]
     * @param {number} [options.limit] - Maximum number of records.
     * @param {boolean} [options.verbose=false] - Include timestamps.
     * @returns {RollRecord[]}
     */
    historyDetailed(options = {}) {
        return this._rolls.report(options);
    }

    /**
     * Generate a structured report of this die.
     * Always includes:
     * - die type
     * - latest roll
     * - total rolls
     *
     * Optionally includes history if requested.
     *
     * @param {Object} [options]
     * @param {number} [options.limit] - Max number of history records.
     * @param {boolean} [options.verbose=false] - Include timestamps in history.
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

    /**
     * Human-readable string summary of the die.
     * @returns {string}
     */
    toString() {
        if (this._rolls.length === 0) {
            return `Die(${this._type}): not rolled yet`;
        }
        const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];
        return `Die(${this._type}): latest=${JSON.stringify(
            latest
        )}, total rolls=${this._rolls.length}`;
    }

    /**
     * JSON representation of the die (always includes history).
     * @returns {Object}
     */
    toJSON() {
        return this.report({ verbose: true, includeHistory: true });
    }
}

module.exports = { Die };
