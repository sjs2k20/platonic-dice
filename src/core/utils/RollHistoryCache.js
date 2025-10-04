const {
    RollRecordManager,
    DEFAULT_MAX_RECORDS,
} = require("./RollRecordManager");

/**
 * A wrapper for RollRecordManager that maintains multiple, independently capped histories.
 *
 * Useful for scenarios where a single RollRecordManager needs to support "history parking",
 * such as storing separate roll histories per modifier or context.
 *
 * @template R
 */
class RollHistoryCache {
    /**
     * @param {Object} [options]
     * @param {number} [options.maxRecordsPerKey=DEFAULT_MAX_RECORDS/10] - Maximum records per history key.
     * @param {number} [options.maxKeys=10] - Maximum number of keys to store in cache.
     */
    constructor({
        maxRecordsPerKey = Math.floor(DEFAULT_MAX_RECORDS / 10),
        maxKeys = 10,
    } = {}) {
        /** @private @type {Map<string, RollRecordManager>} */
        this._cache = new Map();
        /** @private */
        this._maxRecordsPerKey = maxRecordsPerKey;
        /** @private */
        this._maxKeys = maxKeys;
        /** @private @type {string|null} */
        this._activeKey = null;
    }

    /**
     * Sets the currently active history key.
     * If the key has a cached history, it becomes the active RollRecordManager.
     * If the key is new, a fresh RollRecordManager is created for it.
     *
     * @param {string} key - The history key to activate.
     */
    setActiveKey(key) {
        if (typeof key !== "string")
            throw new TypeError("History key must be a string.");

        if (!this._cache.has(key)) {
            if (this._cache.size >= this._maxKeys) {
                // Evict the oldest key (Map preserves insertion order)
                const oldestKey = this._cache.keys().next().value;
                this._cache.delete(oldestKey);
            }
            this._cache.set(key, new RollRecordManager(this._maxRecordsPerKey));
        }

        this._activeKey = key;
    }

    /**
     * Returns the currently active RollRecordManager.
     * @returns {RollRecordManager|null} The active manager or null if none set.
     */
    get activeManager() {
        if (!this._activeKey) return null;
        return this._cache.get(this._activeKey);
    }

    /**
     * Adds a roll record to the active history.
     * Throws if no active key is set.
     *
     * @param {any} record - Roll record to add.
     */
    add(record) {
        const manager = this.activeManager;
        if (!manager)
            throw new Error(
                "No active history key set. Call setActiveKey() first."
            );
        manager.add(record);
    }

    /**
     * Returns a copy of the roll records for the active key.
     * @param {boolean} [verbose=false] - Include timestamps if true.
     * @returns {R[]} Copy of records.
     */
    getAll(verbose = false) {
        const manager = this.activeManager;
        if (!manager) return [];
        return verbose ? manager.full : manager.all;
    }

    /**
     * Clears all roll records for the active key.
     */
    clearActive() {
        const manager = this.activeManager;
        if (manager) manager.clear();
    }

    /**
     * Clears all cached histories.
     */
    clearAll() {
        this._cache.clear();
        this._activeKey = null;
    }

    /**
     * Returns a roll history report for all cached keys.
     *
     * Each key maps to an array of RollRecords, with optional verbosity
     * and record limit. Mirrors RollRecordManager.report API.
     *
     * @param {Object} [options]
     * @param {number} [options.limit] - Maximum number of records per key to include.
     * @param {boolean} [options.verbose=false] - Include timestamps if true.
     * @returns {Object<string, R[]>} Mapping of keys to roll record arrays.
     */
    report({ limit, verbose = false } = {}) {
        const reports = {};
        for (const [key, manager] of this._cache.entries()) {
            reports[key] = manager.report({ limit, verbose });
        }
        return reports;
    }

    /**
     * Returns a string summary of the cache.
     * @returns {string}
     */
    toString() {
        return `RollHistoryCache: ${this._cache.size} keys (active: ${this._activeKey})`;
    }

    /**
     * Returns a JSON-friendly object mapping keys to arrays of RollRecords.
     * Uses each RollRecordManager's `toJSON` method.
     *
     * @returns {Object<string, R[]>} Key to array of RollRecords.
     */
    toJSON() {
        const json = {};
        for (const [key, manager] of this._cache.entries()) {
            json[key] = manager.toJSON();
        }
        return json;
    }
}

module.exports = { RollHistoryCache };
