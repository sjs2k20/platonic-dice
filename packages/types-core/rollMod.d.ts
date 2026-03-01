declare namespace _exports {
    export { DieTypeValue, RollTypeValue, RollModifierLike, DieModifierAlias };
}
declare namespace _exports {
    export { rollMod };
}
export = _exports;
type DieTypeValue = import("./entities/DieType").DieTypeValue;
type RollTypeValue = import("./entities/RollType").RollTypeValue;
type RollModifierLike = import("./entities/RollModifier").RollModifierLike;
type DieModifierAlias = (rollType?: RollTypeValue | undefined) => number;
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollType").RollTypeValue} RollTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
 */
/**
 * Rolls a single modified die by applying a modifier function or RollModifier.
 *
 * This function first rolls a base value using {@link roll}, then applies
 * the provided modifier — either a function `(n) => number` or a
 * {@link RollModifier} instance — to produce the final result.
 *
 * @function rollMod
 * @param {DieTypeValue} dieType - The type of die to roll (e.g., `DieType.D20`).
 * @param {RollModifierLike} modifier - The modifier to apply.
 *   Can be either:
 *   - A RollModifierFunction `(n: number) => number`
 *   - A {@link RollModifier} instance
 * @param {RollTypeValue | undefined} [rollType=undefined] - Optional roll mode (`RollType.Advantage` or `RollType.Disadvantage`).
 * @returns {{ base: number, modified: number }} - The unmodified roll (`base`) and the modified result (`modified`).
 * @throws {TypeError} If the modifier is invalid (not a function or RollModifier).
 * @throws {TypeError} If the `dieType` or `rollType` are invalid (delegated to {@link roll}).
 *
 * @example
 * const result = rollMod(DieType.D20, (n) => n + 2);
 * console.log(result); // { base: 14, modified: 16 }
 *
 * @example
 * const bonus = new RollModifier((n) => Math.min(n + 3, 20));
 * const result = rollMod(DieType.D20, bonus);
 *
 * @example
 * const result = rollMod(DieType.D10, (n) => Math.floor(n / 2), RollType.Advantage);
 */
declare function rollMod(dieType: DieTypeValue, modifier: RollModifierLike, rollType?: RollTypeValue | undefined): {
    base: number;
    modified: number;
};
