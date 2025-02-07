const { DieType, RollType, Outcome } = require("./Types");

/**
 * Rolls a single die, applying advantage/disadvantage if provided.
 * @param {DieType} dieType - The type of die.
 * @param {RollType} [rollType] - Advantage/Disadvantage rolling.
 * @returns {number} - The roll result.
 */
function rollDie(dieType, rollType = null) {
    const roll1 = generateDieResult(dieType);
    if (!rollType) return roll1;

    const roll2 = generateDieResult(dieType);
    return rollType === RollType.Advantage
        ? Math.max(roll1, roll2)
        : Math.min(roll1, roll2);
}

/**
 * Rolls a die based on the given type and optional parameters.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Object} [options] - Optional parameters.
 * @param {RollType} [options.rollType] - Advantage/Disadvantage rolling.
 * @param {number} [options.count=1] - Number of dice to roll.
 * @returns {number | number[]} - A single roll result or an array of results.
 */
function rollDice(dieType, { rollType = null, count = 1 } = {}) {
    if (count < 1) {
        throw new Error("Count must be at least 1.");
    }
    return count === 1
        ? rollDie(dieType, rollType)
        : Array.from({ length: count }, () => rollDie(dieType, rollType));
}

/**
 * Rolls a single modified die by applying a modifier function.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Function} modifier - Function to modify the roll.
 * @param {RollType} [rollType] - Advantage/Disadvantage rolling.
 * @returns {{ base: number, modified: number }} - The base and modified results.
 */
function rollModDie(dieType, modifier, rollType = null) {
    if (typeof modifier !== "function")
        throw new Error("Modifier must be a function.");

    const base = rollDie(dieType, rollType);
    return { base, modified: modifier(base) };
}

/**
 * Rolls multiple modified dice by applying a modifier function.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Function} modifier - Function to modify the roll.
 * @param {Object} [options] - Optional parameters.
 * @param {RollType} [options.rollType] - Advantage/Disadvantage rolling.
 * @param {number} [options.count=1] - Number of dice to roll.
 * @returns {{ base: number[], modified: number[] } | { base: number, modified: number }}
 *          - A single result if `count === 1`, or an array of results if `count > 1`.
 */
function rollModDice(dieType, modifier, { rollType = null, count = 1 } = {}) {
    if (count < 1) {
        throw new Error("Count must be at least 1.");
    }
    if (count === 1) {
        return rollModDie(dieType, modifier, rollType);
    } else {
        const baseRolls = Array.from({ length: count }, () =>
            rollDie(dieType, rollType)
        );
        const modifiedRolls = baseRolls.map((base) => modifier(base));
        return { base: baseRolls, modified: modifiedRolls };
    }
}

/**
 * Rolls a die and determines success or failure based on a target number list.
 * @param {DieType} dieType - The type of die to roll.
 * @param {number[]} targets - List of successful roll values.
 * @param {Object} [options] - Optional parameters.
 * @param {Function} [options.successOutcome=() => Outcome.Success] - Function for success.
 * @param {Function} [options.failureOutcome=() => Outcome.Failure] - Function for failure.
 * @returns {{ roll: number, outcome: string }} - The roll result and its outcome.
 */
function rollTargetDie(
    dieType,
    targets,
    {
        successOutcome = () => Outcome.Success,
        failureOutcome = () => Outcome.Failure,
    } = {}
) {
    const roll = generateDieResult(dieType);
    return {
        roll,
        outcome: targets.includes(roll)
            ? successOutcome(roll)
            : failureOutcome(roll),
    };
}

/**
 * Rolls a die and determines the outcome based on test conditions.
 * @param {DieType} dieType - The type of die to roll.
 * @param {number} target - Minimum roll required for success.
 * @param {Object} [options] - Optional parameters.
 * @param {number} [options.critical_success] - Threshold for critical success.
 * @param {number} [options.critical_failure] - Threshold for critical failure.
 * @param {Function} [options.modifier] - Function to modify the roll.
 * @returns {{ base: number, modified: number, outcome: string }} - The roll result and its outcome.
 */
function rollTestDie(
    dieType,
    target,
    { critical_success, critical_failure, modifier = null } = {}
) {
    let base, modified;
    if (modifier) {
        ({ base: base, modified: modified } = rollModDie(dieType, modifier));
    } else {
        base = generateDieResult(dieType);
        modified = base;
    }

    let outcome;
    if (critical_success !== undefined && modified >= critical_success) {
        outcome = Outcome.Critical_Success;
    } else if (critical_failure !== undefined && modified <= critical_failure) {
        outcome = Outcome.Critical_Failure;
    } else {
        outcome = modified >= target ? Outcome.Success : Outcome.Failure;
    }

    return { base, modified, outcome };
}

/**
 * Generates a single roll result for a given die type.
 * @param {DieType} dieType
 * @returns {number}
 * @throws {Error} If the die type is invalid.
 */
function generateDieResult(dieType) {
    const sides = parseInt(dieType.slice(1));
    if (isNaN(sides)) {
        throw new Error(`Invalid die type: ${dieType}`);
    }
    return Math.floor(Math.random() * sides) + 1;
}

module.exports = {
    rollDie,
    rollDice,
    rollModDie,
    rollModDice,
    rollTargetDie,
    rollTestDie,
};
