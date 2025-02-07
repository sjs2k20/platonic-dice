const { DieType, RollType, Outcome } = require("./Types");

/**
 * Rolls a die based on the given type and optional parameters.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Object} [options] - Optional parameters.
 * @param {RollType} [options.rollType] - Advantage/Disadvantage rolling.
 * @param {number} [options.count=1] - Number of dice to roll.
 * @returns {number | number[]} - A single roll result or an array of results.
 */
function rollDice(dieType, { rollType, count = 1 } = {}) {
    if (count > 1) {
        return Array.from({ length: count }, () => generateDieResult(dieType));
    }

    const roll1 = generateDieResult(dieType);
    if (rollType) {
        const roll2 = generateDieResult(dieType);
        return rollType === RollType.Advantage
            ? Math.max(roll1, roll2)
            : Math.min(roll1, roll2);
    }

    return roll1;
}

/**
 * Rolls a modified die by applying a modifier function.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Function} modifier - Function to modify the roll.
 * @param {Object} [options] - Optional parameters.
 * @param {RollType} [options.rollType] - Advantage/Disadvantage rolling.
 *
 * @returns {{ base: number, modified: number }} - The base and modified results.
 */
function rollModDice(dieType, modifier, { rollType } = {}) {
    const base = rollDice(dieType, { rollType });
    return { base: base, modified: (modifier ?? ((n) => n))(base) };
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
        ({ base: base, modified: modified } = rollModDice(dieType, modifier));
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

module.exports = { rollDice, rollModDice, rollTargetDie, rollTestDie };
