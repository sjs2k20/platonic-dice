export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type RollModifierFunction = import("./entities/RollModifier").RollModifierFunction;
export type RollModifierInstance = import("./entities/RollModifier").RollModifierInstance;
export type DiceModifier = import("./entities/RollModifier").DiceModifier;
export type RollModifierLike = import("./entities/RollModifier").RollModifierLike;
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./entities/RollModifier").RollModifierInstance} RollModifierInstance
 * @typedef {import("./entities/RollModifier").DiceModifier} DiceModifier
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
 */
/**
 * Rolls multiple dice with optional per-die (`each`) and net (`net`) modifiers.
 *
 * @function rollDiceMod
 * @param {DieTypeValue} dieType - The die type (e.g., `DieType.D6`).
 * @param {RollModifierLike} [modifier={}] - The modifier(s) to apply.
 * @param {{ count?: number }} [options={}] - Optional roll count (default: 1).
 * @returns {{
 *   base: { array: number[], sum: number },
 *   modified: { each: { array: number[], sum: number }, net: { value: number } }
 * }}
 * @throws {TypeError} If `count` is invalid.
 * @throws {TypeError} If any modifier is invalid.
 */
export function rollDiceMod(dieType: DieTypeValue, modifier?: RollModifierLike, { count }?: {
    count?: number;
}): {
    base: {
        array: number[];
        sum: number;
    };
    modified: {
        each: {
            array: number[];
            sum: number;
        };
        net: {
            value: number;
        };
    };
};
export const rollDiceModArr: (dieType: DieTypeValue, modifier?: RollModifierLike, options?: {
    count?: number;
}) => number[];
export const rollDiceModNet: (dieType: DieTypeValue, modifier?: RollModifierLike, options?: {
    count?: number;
}) => number;
