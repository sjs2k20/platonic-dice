const {
    DieType,
    ModifiedDie,
    TargetDie,
    rollTestDie,
    Outcome,
} = require("../");

/**
 * Represents conditions for a test-based roll.
 */
class TestConditions {
    /**
     * @param {number} target - The minimum value required for success.
     * @param {number} [critical_success] - Rolls equal to or above this count as a critical success.
     * @param {number} [critical_failure] - Rolls equal to or below this count as a critical failure.
     */
    constructor(target, critical_success = null, critical_failure = null) {
        if (typeof target !== "number")
            throw new Error("Target must be a number.");
        if (critical_success && typeof critical_success !== "number")
            throw new Error("Target must be a number.");
        if (critical_failure && typeof critical_failure !== "number")
            throw new Error("Target must be a number.");
        this.target = target;
        this.critical_success = critical_success;
        this.critical_failure = critical_failure;
    }
}

/**
 * Represents a Test Die that determines success/failure against a target threshold.
 */
class TestDie extends Die {
    /**
     * @param {DieType} type - The type of die.
     * @param {TestConditions} conditions - The test conditions {target, [critical_success], [critical_failure]}.
     * @param {function(number): number} [modifier] - Optional modifier function.
     */
    constructor(type, conditions, modifier = (n) => n) {
        if (!(conditions instanceof TestConditions)) {
            throw new Error("conditions must be an instance of TestConditions");
        }
        // Validate modifier shape
        if (modifier !== null) {
            if (typeof modifier !== "function") {
                throw new Error("modifier must be a function or null.");
            }

            // Must declare exactly 1 expected parameter
            if (modifier.length !== 1) {
                throw new Error("modifier must accept exactly one parameter.");
            }

            // Quick runtime check: apply to a number and verify return is number
            const testValue = modifier(1);
            if (typeof testValue !== "number" || Number.isNaN(testValue)) {
                throw new Error(
                    "modifier must return a number when given a number."
                );
            }
        }

        this._modifiedDie = new ModifiedDie(type, modifier ?? ((n) => n));
        this._targetDie = new TargetDie(type, [conditions.target]);
        this._conditions = conditions;
    }

    get type() {
        return !TestDie.#isIdentity(this._modifier)
            ? `Modified_${this._type}`
            : this._type;
    }

    /**
     * Returns the full roll history including outcomes.
     * @returns {Array<{roll: number, outcome: Outcome}>}
     */
    get history() {
        return this._history.map((_, index) => ({
            roll: !TestDie.#isIdentity(this._modifier)
                ? this._modifiedHistory[index]
                : this._history[index],
            outcome: this._outcomeHistory[index],
        }));
    }

    /**
     * Returns the last outcome of the roll.
     * @returns {Outcome | null}
     */
    get outcome() {
        return this._outcomeHistory.length > 0
            ? this._outcomeHistory[this._outcomeHistory.length - 1]
            : null;
    }

    /**
     * Rolls the die, applying the test conditions and modifier.
     * @returns {number} The final roll result.
     */
    roll() {
        this._reset();
        // Roll using ModifiedDie, then determine outcome using TargetDie logic
        this._modifiedDie.roll();
        const base = this._modifiedDie.history.at(-1);
        const modified = this._modifiedDie.modifiedHistory.at(-1);

        // Determine outcome using test conditions
        let outcome;
        const { critical_success, critical_failure, target } = this._conditions;
        if (
            typeof critical_success === "number" &&
            modified >= critical_success
        ) {
            outcome = Outcome.Critical_Success;
        } else if (
            typeof critical_failure === "number" &&
            modified <= critical_failure
        ) {
            outcome = Outcome.Critical_Failure;
        } else if (modified >= target) {
            outcome = Outcome.Success;
        } else {
            outcome = Outcome.Failure;
        }
        // const { base, modified, outcome } = rollTestDie(
        //     this._type,
        //     this._conditions.target,
        //     {
        //         critical_success: this._conditions.critical_success,
        //         critical_failure: this._conditions.critical_failure,
        //         modifier: this._modifier,
        //     }
        // );

        // Store the base roll and outcome
        this._result = base;
        this._outcome = outcome;
        this._history.push(base);
        this._outcomeHistory.push(outcome);

        // Check if modifier is actually modifying
        if (!TestDie.#isIdentity(this._modifier)) {
            this._modifiedResult = modified;
            this._modifiedHistory.push(modified);
        } else {
            this._modifiedResult = null;
        }

        return this._modifiedResult ?? this._result; // Ensure the correct result is returned
    }

    /**
     * Generates a report on the latest roll.
     * @param {boolean} [verbose=false] - Whether to include full roll history.
     * @returns {string} A string representation of the die state.
     */
    report(verbose = false) {
        const reportData = {
            type: !TestDie.#isIdentity(this._modifier)
                ? `Modified_${this._type}`
                : this._type,
            last_result: this._modifiedResult ?? this._result,
            last_outcome: this._outcome,
        };

        if (verbose) {
            reportData.history = this.getHistory();
        }

        return reportData;
    }

    /**
     * Helper to check if a function is the identity function.
     * Accepts null as well.
     */
    static #isIdentity = (fn) =>
        fn === null || fn.toString() === ((n) => n).toString();
}

module.exports = { TestConditions, TestDie };
