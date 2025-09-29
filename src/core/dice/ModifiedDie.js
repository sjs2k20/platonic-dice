const { Die, rollModDie, RollRecord, RollType } = require("../");

/**
 * Represents a Die that supports result modification.
 */
class ModifiedDie extends Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {Function} modifier - The modifier function to apply.
     */
    constructor(type, modifier) {
        super(type);
        if (typeof modifier !== "function") {
            throw new Error("Modifier must be a function.");
        }

        this._modifier = modifier;
        this._modifiedResult = null;
        this._modifiedHistory = [];
    }

    /**
     * Sets a new modifier and resets modified history.
     * @param {Function} newModifier - The new modifier function.
     */
    set modifier(newModifier) {
        this._modifier = newModifier;
        this._history = []; // Reset base history
        this._modifiedHistory = []; // Reset modified history
    }

    /**
     * Retrieves the last roll result (modified).
     * @returns {number | null}
     */
    get result() {
        return this._modifiedResult;
    }

    /**
     * Retrieves structured roll history.
     * @returns {RollRecord[]}
     */
    get history() {
        return this._history.map((base, index) => ({
            base,
            modified: this._modifiedHistory[index],
        }));
    }

    /**
     * Convenience getter for just the modified roll history.
     * @returns {number[]}
     */
    get modifiedHistory() {
        return this._modifiedHistory.map((m) => m);
    }

    /**
     * Rolls the die, applying the modifier.
     * @param {RollType} [rollType] - Advantage/Disadvantage rolling.
     * @returns {number} - The modified roll result.
     */
    roll(rollType = null) {
        if (rollType !== null && !Object.values(RollType).includes(rollType)) {
            throw new Error(`Invalid roll type: ${rollType}`);
        }

        this._reset();
        const { base, modified } = rollModDie(
            this._type,
            this._modifier,
            rollType
        );

        this._result = base;
        this._modifiedResult = modified;
        this._history.push(base);
        this._modifiedHistory.push(modified);
        return modified;
    }

    /**
     * Overrides the type getter to prefix "Custom_".
     * @returns {string}
     */
    get type() {
        return `Modified_${this._type}`;
    }

    /**
     * Generates a report of the die's state.
     * @param {boolean} [verbose=false] - If true, includes history.
     * @returns {Object} - The die report.
     */
    report(verbose = false) {
        const baseReport = {
            type: this.type, // "Modified_d6"
            last_result: this._modifiedResult,
        };

        if (verbose) {
            baseReport.history = this.history;
        }

        return baseReport;
    }
}

module.exports = { ModifiedDie };
