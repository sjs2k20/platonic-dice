const { DieType, RollType, Outcome } = require("./Types");

/**
 * Rolls a die based on the given type and optional parameters.
 * @param {DieType} dieType - The type of die to roll.
 * @param {Object} [options] - Optional parameters.
 * @param {RollType} [options.rollType] - Advantage/Disadvantage rolling.
 * @param {number} [options.count=1] - Number of dice to roll.
 * @param {Function} [options.modifier=(n) => n] - Function to modify the roll.
 * @returns {number | number[]} - A single roll result or an array of results.
 */
function rollDice(dieType, { rollType, count = 1, modifier = (n) => n } = {}) {
    if (count > 1) {
        return Array.from({ length: count }, () =>
            modifier(generateDieResult(dieType))
        );
    }

    const roll1 = generateDieResult(dieType);
    if (rollType) {
        const roll2 = generateDieResult(dieType);
        return modifier(
            rollType === RollType.Advantage
                ? Math.max(roll1, roll2)
                : Math.min(roll1, roll2)
        );
    }

    return modifier(roll1);
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
 * @param {number} [options.criticalSuccess] - Threshold for critical success.
 * @param {number} [options.criticalFailure] - Threshold for critical failure.
 * @returns {{ roll: number, outcome: string }} - The roll result and its outcome.
 */
function rollTestDie(
    dieType,
    target,
    { criticalSuccess, criticalFailure } = {}
) {
    const roll = generateDieResult(dieType);

    if (criticalSuccess !== undefined && roll >= criticalSuccess)
        return { roll, outcome: Outcome.CriticalSuccess };
    if (criticalFailure !== undefined && roll <= criticalFailure)
        return { roll, outcome: Outcome.CriticalFailure };
    return {
        roll,
        outcome: roll >= target ? Outcome.Success : Outcome.Failure,
    };
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

module.exports = { rollDice, rollTargetDie, rollTestDie };
