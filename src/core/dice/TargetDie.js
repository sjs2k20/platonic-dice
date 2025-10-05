const { Die, rollTargetDie, Outcome, RollType } = require("../");

/**
 * Represents a Target Die that determines success/failure based on matching numbers.
 * @extends {Die<number, TargetDieRollRecord, TargetDieReport>}
 */
class TargetDie extends Die {
    /**
     * @param {DieType} type - The type of die (e.g. D6)
     * @param {number[]} targetValues - The values that count as "success".
     */
    constructor(type, targetValues) {
        super(type);

        if (!Array.isArray(targetValues)) {
            throw new Error("targetValues must be an array of integers.");
        }
        if (targetValues.length === 0) {
            throw new Error("targetValues cannot be empty.");
        }
        if (!targetValues.every((v) => Number.isInteger(v))) {
            throw new Error("targetValues must only contain integers.");
        }

        // Validate target values against face count
        for (const v of targetValues) {
            if (v < 1 || v > this.faceCount) {
                throw new Error(
                    `Invalid target value: ${v}. Must be between 1 and ${this.faceCount}.`
                );
            }
        }

        const unique = new Set(targetValues);
        if (unique.size !== targetValues.length) {
            throw new Error("targetValues must not contain duplicates.");
        }

        this._targetValues = [...unique];
    }

    /**
     * Returns the most recent outcome.
     * @returns {Outcome|null}
     */
    get lastOutcome() {
        const last = this._rolls.report({ limit: 1, verbose: false })[0];
        return last ? last.outcome : null;
    }

    /**
     * Rolls the die, determines outcome (success/failure),
     * and records it in history.
     *
     * @param {RollType|null} [rollType=null] - Optional roll type (advantage, etc.)
     * @returns {number} The rolled value.
     */
    roll(rollType = null) {
        if (rollType !== null && !Object.values(RollType).includes(rollType)) {
            throw new Error(`Invalid roll type: ${rollType}`);
        }

        // Reset result but preserve history
        this._reset();

        const { roll, outcome } = rollTargetDie(this._type, this._targetValues);
        this._result = roll;

        // Store full record through RollRecordManager
        this._rolls.add({
            roll,
            outcome,
            timestamp: new Date(),
        });

        return outcome;
    }

    /**
     * Returns the entire history (roll + outcome) of this die.
     * @param {Object} [options]
     * @param {boolean} [options.verbose=false]
     * @param {number} [options.limit]
     * @returns {Array<{roll: number, outcome: Outcome, timestamp?: Date}>}
     */
    historyDetailed({ verbose = false, limit } = {}) {
        const all = this._rolls.report({ verbose });
        return limit ? all.slice(-limit) : all;
    }

    /**
     * Generates a structured report.
     * Mirrors Die.report() but adds target + outcome info.
     *
     * @param {Object} [options]
     * @param {boolean} [options.verbose=false]
     * @param {boolean} [options.includeHistory=false]
     * @param {number} [options.limit]
     * @returns {TargetDieReport}
     */
    report({ verbose = false, includeHistory = false, limit } = {}) {
        const base = super.report({ verbose, includeHistory, limit });
        return {
            ...base,
            targets: [...this._targetValues],
            latest_outcome: this.lastOutcome,
        };
    }

    /**
     * String summary.
     * @returns {string}
     */
    toString() {
        if (this._rolls.length === 0) {
            return `TargetDie(${
                this._type
            }): not rolled yet (targets=${this._targetValues.join(", ")})`;
        }
        const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];
        return `TargetDie(${this._type}): latest={ roll: ${latest.roll}, outcome: ${latest.outcome} }, total rolls=${this._rolls.length}`;
    }
}

module.exports = { TargetDie };
