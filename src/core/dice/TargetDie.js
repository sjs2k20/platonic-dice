const { Die, rollTargetDie, Outcome } = require("../");

/**
 * Represents a Target Die that determines success/failure based on matching numbers.
 */
class TargetDie extends Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {number[]} targetValues - The target conditions (array of successful values).
     */
    constructor(type, targetValues) {
        if (!Array.isArray(targetValues)) {
            throw new Error("targetValues must be an array of integers.");
        }
        if (targetValues.length === 0) {
            throw new Error("targetValues cannot be empty.");
        }
        if (!targetValues.every((v) => Number.isInteger(v))) {
            throw new Error("targetValues must only contain integers.");
        }

        super(type);

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
        this._outcomeHistory = [];
    }

    /**
     * Rolls the die and determines success or failure based on target conditions.
     * @returns {number} The final roll result.
     */
    roll() {
        const { roll, outcome } = rollTargetDie(this._type, this._targetValues);

        // Store the modified roll and outcome
        this._result = roll;
        this._history.push(roll);
        this._outcomeHistory.push(outcome);
        return roll;
    }

    /**
     * Returns the full roll history including outcomes.
     * @returns {Array<{roll: number, outcome: Outcome}>}
     */
    getHistory() {
        return this._history.map((roll, index) => ({
            roll,
            outcome: this._outcomeHistory[index],
        }));
    }

    /**
     * Returns the last outcome of the roll.
     * @returns {Outcome | null}
     */
    getLastOutcome() {
        return this._outcomeHistory.at(-1) || null;
    }

    /**
     * Generates a report on the latest roll.
     * @param {boolean} [verbose=false] - Whether to include full roll history.
     * @returns {string} A string representation of the die state.
     */
    report(verbose = false) {
        const reportData = {
            type: this._type,
            last_result: this._result,
            last_outcome: this.getLastOutcome(),
        };

        if (verbose) {
            reportData.history = this.getHistory();
        }

        return reportData;
    }
}

module.exports = { TargetDie };
