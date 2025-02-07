const { Die } = require("./Die");
const { rollTargetDie } = require("../DiceUtils");
const { Outcome } = require("../Types");

/**
 * Represents a Target Die that determines success/failure based on matching numbers.
 */
class TargetDie extends Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {number[]} targetValues - The target conditions (array of successful values).
     */
    constructor(type, targetValues) {
        if (
            !Array.isArray(targetValues) ||
            !targetValues.every(Number.isInteger)
        ) {
            throw new Error("targetValues must be an array of integers.");
        }
        super(type);
        this._targetValues = targetValues;
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
