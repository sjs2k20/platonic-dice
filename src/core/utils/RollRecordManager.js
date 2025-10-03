const { RollRecord, Outcome } = require("../Types");

/**
 * Utility class for managing roll history of Die and child/composite classes.
 */
class RollRecordManager {
    constructor() {
        /** @type {RollRecord[]} */
        this._records = [];
    }

    /** Returns a copy of all roll records. */
    get full() {
        return [...this._records];
    }

    /**
     * Returns a copy of all roll records with timestamps stripped.
     * @returns {RollRecord[]}
     */
    get all() {
        return this._records.map(RollRecordManager.#stripTimestamp);
    }

    /** Returns the number of roll records stored. */
    get length() {
        return this._records.length;
    }

    /**
     * Adds a roll record to the history.
     * Automatically infers the type of RollRecord.
     * @param {RollRecord} record
     */
    add(record) {
        if (!record || typeof record !== "object") {
            throw new TypeError("Record must be an object");
        }

        // Validate which type of record this is
        if (
            !RollRecordManager.#isDieRollRecord(record) &&
            !RollRecordManager.#isModifiedDieRollRecord(record) &&
            !RollRecordManager.#isTargetDieRollRecord(record)
        ) {
            throw new TypeError(
                "Record must be a valid DieRollRecord, ModifiedDieRollRecord, or TargetDieRollRecord"
            );
        }

        this._records.push(record);
    }

    /** Clears the roll history. */
    clear() {
        this._records = [];
    }

    /** * Returns the last roll record or last `n` records.
     * @param {number} [n=1] - Number of records to retrieve.
     * @param {boolean} [verbose=false] - Include timestamps if true.
     * @returns {RollRecord|RollRecord[]|null}
     */
    last(n = 1, verbose = false) {
        if (typeof n !== "number" || n < 1) {
            throw new TypeError("Parameter n must be a positive number.");
        }
        const len = this._records.length;
        if (len === 0) return null;
        let result;
        if (n >= len) {
            result = n === 1 ? this._records[len - 1] : [...this._records];
        } else {
            result = this._records.slice(len - n);
            if (n === 1) result = result[0];
        }
        if (!verbose) {
            if (Array.isArray(result)) {
                return result.map(RollRecordManager.#stripTimestamp);
            } else {
                return RollRecordManager.#stripTimestamp(result);
            }
        }
        return result;
    }

    /**
     * Returns a roll history report with optional verbosity and record limit.
     *
     * This method produces a JSON-friendly array of RollRecords. Timestamps
     * are included only if `verbose` is true. A `limit` can be provided to
     * return only the last N records. If `limit` is 1, the returned value
     * is still wrapped in an array for consistency.
     *
     * @param {Object} [options]
     * @param {number} [options.limit] - Maximum number of records to return.
     * @param {boolean} [options.verbose=false] - Include timestamps if true.
     * @returns {RollRecord[]} Array of RollRecords according to options.
     */
    report({ limit, verbose = false } = {}) {
        let n;

        if (typeof limit === "number") {
            n = limit > 0 ? limit : this._records.length;
        } else {
            n = this._records.length;
        }

        const records = this.last(n, verbose);

        // Ensure consistent return type (always an array)
        if (!Array.isArray(records)) {
            return records ? [records] : [];
        }
        return records;
    }

    toString() {
        if (this._records.length === 0) return "RollRecordManager: empty";
        const last = this._records[this._records.length - 1];
        return `RollRecordManager: ${this._records.length} rolls (last: ${
            last.roll
        } @ ${last.timestamp.toISOString()})`;
    }

    /**
     * Returns the full history as an array of records.
     */
    toJSON() {
        return this.full;
    }

    /** --- PRIVATE HELPER METHODS --- */

    /** Type guards for RollRecord variants */
    static #isDieRollRecord(record) {
        return (
            record &&
            typeof record.roll === "number" &&
            record.timestamp instanceof Date &&
            !("modified" in record) &&
            !("outcome" in record)
        );
    }

    static #isModifiedDieRollRecord(record) {
        return (
            record &&
            typeof record.roll === "number" &&
            typeof record.modified === "number" &&
            record.timestamp instanceof Date &&
            !("outcome" in record)
        );
    }

    static #isTargetDieRollRecord(record) {
        return (
            record &&
            typeof record.roll === "number" &&
            "outcome" in record &&
            Object.values(Outcome).includes(record.outcome) &&
            record.timestamp instanceof Date
        );
    }

    /** --- Remove timestamp from a record --- */
    static #stripTimestamp(record) {
        const { timestamp, ...rest } = record;
        return rest;
    }
}

module.exports = { RollRecordManager };
