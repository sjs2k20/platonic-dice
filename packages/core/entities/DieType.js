/**
 * @module @dice/core/entities/DieType
 * @description
 * Enum for die types used in rolling functions.
 *
 * @readonly
 * @enum {string}
 *
 * @example
 * import { DieType } from "@dice/core/entities";
 * const result = roll(DieType.D20);
 */
export const DieType = Object.freeze({
  D4: "d4",
  D6: "d6",
  D8: "d8",
  D10: "d10",
  D12: "d12",
  D20: "d20",
});

/**
 * @typedef {keyof typeof DieType} DieTypeKey
 * @typedef {typeof DieType[keyof typeof DieType]} DieTypeValue
 */
