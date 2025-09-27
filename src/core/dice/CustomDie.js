const { Die, rollDie } = require("../");

/**
 * @typedef {import("./Types").DieFaceResultMap} DieFaceResultMap
 * @typedef {import("./Types").DieFaceResult} DieFaceResult
 */

/**
 * Represents a fully customizable die where each face has a different effect.
 */
class CustomDie extends Die {
    /**
     * @param {DieType} type - The die type.
     * @param {DieFaceResultMap} faceMappings - Mappings of die faces to outcomes.
     * @param {DieFaceResult} [defaultOutcome=(n) => n] - Default outcome if a roll isn't mapped.
     */
    constructor(type, faceMappings, defaultOutcome = (n) => n) {
        super(type);

        // Get number of faces from type
        const faceCount = CustomDie._getFaceCount(type);

        // Runtime validation for faceMappings
        if (!Array.isArray(faceMappings)) {
            throw new Error("faceMappings must be an array of DieFaceMapping objects.");
        }
        faceMappings.forEach((mapping, i) => {
            if (typeof mapping !== "object" || mapping === null) {
                throw new Error(`faceMappings[${i}] must be an object with {face, result}.`);
            }
            if (!Number.isInteger(mapping.face) || mapping.face < 1 || mapping.face > faceCount) {
                throw new Error(
                    `Invalid face value in faceMappings[${i}]: ${mapping.face}. Must be between 1 and ${faceCount}.`
                );
            }
            if (!CustomDie._isValidResult(mapping.result)) {
                throw new Error(
                    `Invalid result for face ${mapping.face}. Must be number, string, or function(number): number.`
                );
            }
        });
        if (defaultOutcome !== null && !CustomDie._isValidResult(defaultOutcome)) {
            throw new Error("defaultOutcome must be null, a number, a string, or a function(number): number.");
        }
        
        // Check for duplicate face entries.
        const seenFaces = new Set();
        for (const mapping of faceMappings) {
            if (seenFaces.has(mapping.face)) {
                throw new Error(`Duplicate mapping found for face ${mapping.face}.`);
            }
            seenFaces.add(mapping.face);
        }

        // Build a complete mapping for all faces
        const mappingMap = new Map();
        for (let i = 1; i <= faceCount; i++) {
            const provided = faceMappings.find((m) => m.face === i);
            mappingMap.set(i, provided ? provided.result : defaultOutcome);
        }

        this._faceMappings = mappingMap;
        this._outcome = null;
        this._outcomeHistory = [];
    }

    /**
     * Rolls the die and applies the corresponding face mapping.
     * @returns {number|string} - The final outcome.
     */
    roll() {
        const roll = rollDie(this._type);
        this._result = roll;
        this._history.push(this._result);

        let outcome = this._faceMappings.get(roll);
        if (typeof outcome === "function") {
            outcome = outcome(roll);
        }

        this._outcome = outcome;
        this._outcomeHistory.push(this._outcome);
        return this._outcome;
    }

    /**
     * Returns a detailed report of the last roll and its mapped outcome.
     * @param {boolean} [verbose=false] - Whether to include full history.
     * @returns {Object} - JSON-compatible representation of the roll state.
     */
    report(verbose = false) {
        const reportData = {
            type: this.type,
            last_result: this._result,
            last_outcome: this._outcome ?? "No effect",
        };

        if (verbose) {
            reportData.roll_history = this._history;
            reportData.outcome_history = this._outcomeHistory;
        }

        return reportData;
    }

    /** @returns {DieFaceResultMap} */
    get faceMappings() {
        return Array.from(this._faceMappings.entries()).map(([face, result]) => ({ face, result }));
    }

    /** @returns {number|string|null} */
    getOutcome() {
        return this._outcome;
    }

    /** @returns {(number|string|null)[]} */
    getOutcomeHistory() {
        return this._outcomeHistory;
    }

    /** @returns {string} */
    get type() {
        return `Custom_${this._type}`;
    }

    // Helper to check result type
    static _isValidResult(result) {
        return (
            typeof result === "number" ||
            typeof result === "string" ||
            (typeof result === "function" && result.length === 1) // must accept 1 arg
        );
    }

    static _getFaceCount(type) {
        const lookup = {
            [DieType.D4]: 4,
            [DieType.D6]: 6,
            [DieType.D8]: 8,
            [DieType.D10]: 10,
            [DieType.D12]: 12,
            [DieType.D20]: 20,
        };
        if (!(type in lookup)) {
            throw new Error(`Unknown die type: ${type}`);
        }
        return lookup[type];
    }
}

module.exports = { CustomDie };
