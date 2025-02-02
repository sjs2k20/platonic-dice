const { Die } = require("./Die");
const { rollTestDie } = require("./DiceUtils");
const { Outcome } = require("./Types");

/**
 * Represents a Test Die that determines success/failure against a target threshold.
 */
class TestDie extends Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {TestConditions} conditions - The test conditions (target, critical thresholds).
     * @param {function(number): number} [modifier] - Optional modifier function.
     */
    constructor(type, conditions, modifier = null) {
        super(type, modifier);
        this._conditions = conditions;
        this._outcomeHistory = [];
    }

    /**
     * Rolls the die, applying the test conditions and modifier.
     * @returns {number} The final roll result.
     */
    roll() {
        const { roll, outcome } = rollTestDie(
            this._type,
            this._conditions.target,
            {
                criticalSuccess: this._conditions.critical_success,
                criticalFailure: this._conditions.critical_failure,
            }
        );

        // Store the modified roll and outcome
        this._result = roll;
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
        return this._outcomeHistory.length > 0
            ? this._outcomeHistory[this._outcomeHistory.length - 1]
            : null;
    }

    /**
     * Generates a report on the latest roll.
     * @param {boolean} [verbose=false] - Whether to include full roll history.
     * @returns {string} A string representation of the die state.
     */
    report(verbose = false) {
        const reportData = {
            type: this._modifier ? `Modified_${this._type}` : this._type,
            last_result: this._result,
            last_outcome: this.getLastOutcome(),
        };

        if (verbose) {
            reportData.history = this.getHistory();
        }

        return JSON.stringify(reportData, null, verbose ? 2 : 0);
    }
}

module.exports = { TestDie };
