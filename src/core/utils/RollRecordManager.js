const { Outcome } = require("../Types");

/**
 * @typedef {import("../core/Types").RollRecord} RollRecord
 */

/**
 * Default maximum number of roll records stored.
 * @type {number}
 */
const DEFAULT_MAX_RECORDS = 1000;

/**
 * Utility class for managing roll history of Die and child/composite classes.
 * @template R
 */
class RollRecordManager {
    /**
     * @param {number} [maxRecords=1000] - Maximum number of roll records to retain.
     */
    constructor(maxRecords = DEFAULT_MAX_RECORDS) {
        /** @private */
        this._records = [];
        /** @private */
        this._maxRecords = maxRecords;
    }

    /**
     * The maximum number of roll records retained.
     * @returns {number}
     */
    get maxRecords() {
        return this._maxRecords;
    }

    /** Returns a copy of all roll records. */
    get full() {
        return [...this._records];
    }

    /**
     * Returns a copy of all roll records with timestamps stripped.
     * @returns {R[]}
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
        if (this._records.length > this._maxRecords) {
            this._records.shift(); // remove oldest
        }
    }

    /** Clears the roll history. */
    clear() {
        this._records = [];
    }

    /** * Returns the last roll record or last `n` records.
     * @param {number} [n=1] - Number of records to retrieve.
     * @param {boolean} [verbose=false] - Include timestamps if true.
     * @returns {R|R[]|null}
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
     * @returns {R[]} Array of RollRecords according to options.
     */
    report({ limit, verbose = false } = {}) {
        if (this._records.length === 0) return []; // empty history - return gracefully
        let n;

        if (typeof limit === "number") {
            if (limit <= 0) return [];
            n = Math.min(limit, this._records.length);
        } else {
            n = this._records.length;
        }
        const records = this.last(n, verbose);

        // Ensure consistent return type (always an array)
        return Array.isArray(records) ? records : records ? [records] : [];
    }

    toString() {
        if (this._records.length === 0) {
            return `RollRecordManager: empty (maxRecords=${this._maxRecords})`;
        }

        const last = this._records[this._records.length - 1];
        return `RollRecordManager: ${this._records.length}/${
            this._maxRecords
        } rolls (last: ${last.roll} @ ${last.timestamp.toISOString()})`;
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

module.exports = { DEFAULT_MAX_RECORDS, RollRecordManager };
