declare namespace _exports {
    export { DieTypeValue, RollDiceAlias };
}
declare namespace _exports {
    export { rollDice };
}
export = _exports;
type DieTypeValue = import("./entities/DieType").DieTypeValue;
type RollDiceAlias = (dieType: import("./entities/DieType").DieTypeValue) => {
    array: number[];
    sum: number;
};
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 */
/**
 * Rolls one or more dice of the specified type.
 *
 * @function rollDice
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D6`, `DieType.D20`).
 * @param {Object} [options] - Optional configuration.
 * @param {number} [options.count=1] - Number of dice to roll. Must be a positive integer.
 * @returns {{ array: number[], sum: number }} An object containing:
 *   - `array`: an array of individual die rolls.
 *   - `sum`: the total sum of all rolls.
 * @throws {TypeError} If `dieType` is invalid.
 * @throws {TypeError} If `count` is not a positive integer.
 *
 * @example
 * const result = rollDice(DieType.D6, { count: 5 });
 * console.log(result.sum);   // e.g., 18
 * console.log(result.array); // e.g., [2, 5, 3, 1, 7]
 *
 * @example
 * // Roll a single d20
 * const result = rollDice(DieType.D20);
 *
 * @example
 * // Roll 3d6
 * const result = rollDice(DieType.D6, { count: 3 });
 */
declare function rollDice(dieType: DieTypeValue, { count }?: {
    count?: number | undefined;
}): {
    array: number[];
    sum: number;
};
