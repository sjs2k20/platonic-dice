/**
 * @module @platonic-dice/core/src/rollDiceTest
 * @description
 * Rolls multiple dice and evaluates each die against a set of test conditions
 * using `DiceTestConditions`.
 */

const entities = require("./entities");
const { isValidDieType, DiceTestConditions, TestConditionsArray } = entities;
const { rollDice } = require("./rollDice.js");

/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities").ConditionsInput} ConditionsInput
 * @typedef {import("./entities").RollDiceTestOptions} RollDiceTestOptions
 * @typedef {import("./entities").DiceTestResult} DiceTestResult
 */

/**
 * Roll multiple dice and evaluate them against provided conditions.
 *
 * @param {DieTypeValue} dieType
 * @param {ConditionsInput} conditions
 * @param {RollDiceTestOptions} [options={}]
 *
 * @returns {{ base: { array: number[], sum: number }, result: DiceTestResult }}
 */
function rollDiceTest(
  dieType,
  conditions,
  { count = 1, rules = [], useNaturalCrits = undefined } = {},
) {
  if (!isValidDieType(dieType))
    throw new TypeError(`Invalid die type: ${dieType}`);
  if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
    throw new TypeError("count must be a positive integer");
  }

  // Construct or validate provided DiceTestConditions
  /** @type {import("./entities").DiceTestConditions} */
  let dtc;
  if (conditions instanceof DiceTestConditions) {
    dtc = conditions;
    if (dtc.count !== count)
      throw new TypeError(
        "Provided DiceTestConditions count does not match requested count",
      );
  } else if (
    conditions instanceof TestConditionsArray ||
    Array.isArray(conditions)
  ) {
    dtc = new DiceTestConditions({ count, conditions, rules, dieType });
  } else {
    throw new TypeError(
      "conditions must be a DiceTestConditions instance, TestConditionsArray, or an array of TestConditions-like objects",
    );
  }

  // Roll the dice
  const base = rollDice(dieType, { count });

  // Evaluate rolls using the DiceTestConditions evaluator
  const evaluator = dtc.toEvaluator(undefined, useNaturalCrits);
  const result = evaluator(base.array);

  return { base, result };
}

module.exports = {
  rollDiceTest,
};
