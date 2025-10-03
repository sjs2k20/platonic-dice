const { Die, RollType, rollModDie } = require("../");

/**
 * Represents a Die that supports result modification.
 * Uses the inherited RollRecordManager to store ModifiedDieRollRecord objects:
 *   { roll: <base>, modified: <modified>, timestamp: Date }
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
    }

    /**
     * Type getter override for descriptive name
     */
    get type() {
        return `Modified_${this._type}`;
    }

    /**
     * Returns the modified result (what the user cares about).
     * @returns {number|null}
     */
    get result() {
        return this._modifiedResult;
    }

    /**
     * Replace modifier function and clear history (reset state).
     * @param {(roll:number)=>number} newModifier
     */
    set modifier(newModifier) {
        if (typeof newModifier !== "function") {
            throw new TypeError("Modifier must be a function.");
        }
        this._modifier = newModifier;

        // Clear previous results/history to avoid confusion with new modifier
        this._modifiedResult = null;
        this._reset(true); // reset and clear history via inherited method
    }

    /**
     * Rolls the die (uses rollModDie under the hood) and records a ModifiedDieRollRecord.
     * @param {RollType|null} [rollType=null]
     * @returns {number} The modified roll result.
     */
    roll(rollType = null) {
        if (rollType !== null && !Object.values(RollType).includes(rollType)) {
            throw new Error(`Invalid roll type: ${rollType}`);
        }

        // Keep behaviour consistent with Die: reset only result (not history)
        this._reset();

        // Use shared utility that returns both base and modified
        const { base, modified } = rollModDie(
            this._type,
            this._modifier,
            rollType
        );

        // Keep _result as base (compatible with previous implementation),
        // but ModifiedDie exposes the modified value via overridden getter.
        this._result = base;
        this._modifiedResult = modified;

        // Push a ModifiedDieRollRecord into the inherited RollRecordManager
        this._rolls.add({
            roll: base, // base roll
            modified: modified,
            timestamp: new Date(),
        });

        return this._modifiedResult;
    }

    /**
     * Generate a report for this ModifiedDie.
     * @param {Object} [options]
     * @param {number} [options.limit]
     * @param {boolean} [options.verbose=false] - include timestamps
     * @param {boolean} [options.includeHistory=false]
     * @returns {Object}
     */
    report({ limit, verbose = false, includeHistory = false } = {}) {
        // latest record from the manager (may be null)
        const latestRecord =
            this._rolls.report({ limit: 1, verbose })[0] || null;

        const baseReport = {
            type: this.type,
            modifier: this._modifier.toString(),
            last_result: this._modifiedResult,
            times_rolled: this._rolls.length,
            latest_record: latestRecord, // helpful detail (contains base & modified)
        };

        if (includeHistory) {
            baseReport.history = this._rolls.report({ limit, verbose });
        }

        return baseReport;
    }

    toString() {
        if (this._rolls.length === 0) {
            return `${
                this.type
            }: not rolled yet (modifier=${this._modifier.toString()})`;
        }

        const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];

        return `${this.type}: latest={ roll: ${latest.roll}, modified: ${
            latest.modified
        } }, total rolls=${
            this._rolls.length
        }, modifier=${this._modifier.toString()}`;
    }
}

module.exports = { ModifiedDie };
