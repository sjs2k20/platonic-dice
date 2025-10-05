const { Die, RollHistoryCache, RollType, rollModDie } = require("../");

/**
 * Represents a Die that supports result modification.
 * @extends {Die<number, ModifiedDieRollRecord, ModifiedDieReport>}
 *
 * Each unique modifier function maintains its own independent roll history,
 * managed internally by a {@link RollHistoryCache}.
 *
 * This allows modifier-specific histories to persist without manual clearing
 * when the modifier changes — supporting “history parking” behavior.
 *
 * Records take the form:
 * ```js
 * { roll: number, modified: number, timestamp: Date }
 * ```
 */
class ModifiedDie extends Die {
    /**
     * @param {DieType} type - Die type (e.g. "d6")
     * @param {(roll:number)=>number} modifier - Modifier to apply to base rolls
     */
    constructor(type, modifier) {
        super(type);

        if (typeof modifier !== "function") {
            throw new TypeError("Modifier must be a function.");
        }

        this._modifier = modifier;
        this._modifiedResult = null;

        /**
         * Override the inherited RollRecordManager with a RollHistoryCache.
         * This enables modifier-specific roll histories.
         *
         * @private
         * @type {RollHistoryCache<ModifiedDieRollRecord>}
         */
        this._rolls = new RollHistoryCache();

        // Initialize the active modifier key
        this._rolls.setActiveKey(this._cacheKey);
    }

    /**
     * Returns a stable string key representation of the current modifier function.
     * Used internally by RollHistoryCache to manage separate histories.
     *
     * @private
     * @returns {string}
     */
    get _cacheKey() {
        return this._modifier.toString();
    }

    /**
     * Type getter override for descriptive name
     */
    get type() {
        return `Modified_${this._type}`;
    }

    /**
     * Returns the modified result (what the user cares about).
     *
     * @returns {number|null}
     */
    get result() {
        return this._modifiedResult;
    }

    /**
     * Replace the modifier function and switch to its associated history.
     * If the modifier has not been used before, a new history is created.
     *
     * @param {(roll:number)=>number} newModifier
     * @throws {TypeError} If newModifier is not a function.
     */
    set modifier(newModifier) {
        if (typeof newModifier !== "function") {
            throw new TypeError("Modifier must be a function.");
        }

        this._modifier = newModifier;
        this._modifiedResult = null;

        // Switch to (or create) the new modifier’s history context
        this._rolls.setActiveKey(this._cacheKey);
    }

    /**
     * Rolls the die, applies the modifier, and records the result
     * in the history associated with the active modifier.
     *
     * @param {RollType|null} [rollType=null] - Optional roll context (e.g. advantage/disadvantage)
     * @returns {number} The modified roll result.
     * @throws {Error} If rollType is invalid.
     */
    roll(rollType = null) {
        if (rollType !== null && !Object.values(RollType).includes(rollType)) {
            throw new Error(`Invalid roll type: ${rollType}`);
        }

        // Reset result state but keep histories intact
        this._reset();

        const { base, modified } = rollModDie(
            this._type,
            this._modifier,
            rollType
        );

        this._result = base;
        this._modifiedResult = modified;

        // Record the result in the cache (active modifier)
        this._rolls.add({
            roll: base,
            modified: modified,
            timestamp: new Date(),
        });

        return this._modifiedResult;
    }

    /**
     * Returns the roll history for the active modifier.
     * Mirrors `Die.history` behaviour.
     *
     * @returns {ModifiedDieRollRecord[]}
     */
    get history() {
        return this._rolls.getAll(false);
    }

    /**
     * Returns the detailed history for the active modifier, optionally verbose.
     * Mirrors `Die.historyDetailed(options)`.
     *
     * @param {Object} [options]
     * @param {boolean} [options.verbose=false] - Include timestamps.
     * @param {number} [options.limit] - Limit number of returned records.
     * @returns {ModifiedDieRollRecord[]}
     */
    historyDetailed({ verbose = false, limit } = {}) {
        const all = this._rolls.getAll(verbose);
        return limit ? all.slice(-limit) : all;
    }

    /**
     * Generate a report for the active modifier.
     * Mirrors `Die.report()`.
     *
     * @param {Object} [options]
     * @param {number} [options.limit]
     * @param {boolean} [options.verbose=false]
     * @param {boolean} [options.includeHistory=false]
     * @returns {ModifiedDieReport}
     */
    report({ limit, verbose = false, includeHistory = false } = {}) {
        const records = this._rolls.getAll(verbose);
        const latest = records.length ? records[records.length - 1] : null;

        const report = {
            type: this.type,
            times_rolled: records.length,
            latest_record: latest,
            modifier: this._modifier.toString(),
        };

        if (includeHistory) {
            report.history = limit ? records.slice(-limit) : records;
        }

        return report;
    }

    /**
     * Returns a combined report across all modifiers in this die’s history.
     * Mirrors the underlying RollHistoryCache.report() API.
     *
     * @param {Object} [options]
     * @param {number} [options.limit]
     * @param {boolean} [options.verbose=false]
     * @returns {Record<string, ModifiedDieRollRecord[]>}
     */
    reportAll({ limit, verbose = false } = {}) {
        return this._rolls.report({ limit, verbose });
    }

    /**
     * Clear all histories (for all modifiers).
     */
    clearAllHistories() {
        this._rolls.clearAll();
    }

    /**
     * Returns a human-readable string summary.
     *
     * @returns {string}
     */
    toString() {
        const records = this._rolls.getAll(true);
        if (records.length === 0) {
            return `${
                this.type
            }: not rolled yet (modifier=${this._modifier.toString()})`;
        }

        const latest = records[records.length - 1];
        return `${this.type}: latest={ roll: ${latest.roll}, modified: ${
            latest.modified
        } }, total rolls=${
            records.length
        }, modifier=${this._modifier.toString()}`;
    }

    /**
     * Serializes the die, including all modifier histories.
     * Overrides `Die.toJSON()` to remain type-compatible with the base class.
     *
     * @returns {ModifiedDieReport}
     */
    toJSON() {
        const report = this.report({ includeHistory: true, verbose: true });
        return {
            ...report,
            rolls: this._rolls.toJSON(), // extra non-breaking property
        };
    }
}

module.exports = { ModifiedDie };
