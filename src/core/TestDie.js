const { ModifiedDie } = require("./ModifiedDie");
const { rollTestDie } = require("./DiceUtils");
const { Outcome } = require("./Types");

/**
 * Represents a Test Die that determines success/failure against a target threshold.
 */
class TestDie extends ModifiedDie {
    /**
     * @param {DieType} type - The type of die.
     * @param {TestConditions} conditions - The test conditions (target, critical thresholds).
     * @param {function(number): number} [modifier] - Optional modifier function.
     */
    constructor(type, conditions, modifier = null) {
        super(type, modifier ?? ((n) => n));
        this._conditions = conditions;
        this._outcomeHistory = [];
    }

    /**
     * Rolls the die, applying the test conditions and modifier.
     * @returns {number} The final roll result.
     */
    roll() {
        this._reset();
        const { baseRoll, modifiedRoll, outcome } = rollTestDie(
            this._type,
            this._conditions.target,
            {
                criticalSuccess: this._conditions.critical_success,
                criticalFailure: this._conditions.critical_failure,
                modifier: this._modifier,
            }
        );

        // Store the baseRoll and outcome
        this._result = baseRoll;
        this._modifiedResult =
            modifiedRoll !== undefined ? modifiedRoll : baseRoll; // Handle case if no modifier
        this._outcomeHistory.push(outcome);
        this._history.push(baseRoll); // Always track base roll
        if (this._modifier) {
            this._modifiedHistory.push(modifiedRoll); // Track modified roll if a modifier exists
        }
        return this._modifiedResult; // Ensure the correct result is returned
    }

    /**
     * Returns the full roll history including outcomes.
     * @returns {Array<{roll: number, outcome: Outcome}>}
     */
    getHistory() {
        return this._history.map((_, index) => ({
            roll: this._modifier
                ? this._modifiedHistory[index]
                : this._history[index],
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
            last_result: this._modifiedResult ?? this._result,
            last_outcome: this.getLastOutcome(),
        };

        if (verbose) {
            reportData.history = this.getHistory();
        }

        return JSON.stringify(reportData, null, verbose ? 2 : 0);
    }
}

module.exports = { TestDie };
