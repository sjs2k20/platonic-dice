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

module.exports = { TestConditions };
