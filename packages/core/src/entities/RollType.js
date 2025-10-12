/**
 * @module @dice/core/src/entities/RollType
 * @description
 * Enum for roll modes (normal, advantage, disadvantage).
 *
 * @readonly
 * @enum {string}
 */
const RollType = Object.freeze({
  Advantage: "advantage",
  Disadvantage: "disadvantage",
});

/**
 * @typedef {keyof typeof RollType} RollTypeKey
 * @typedef {typeof RollType[keyof typeof RollType]} RollTypeValue
 */

module.exports = {
  RollType,
};
