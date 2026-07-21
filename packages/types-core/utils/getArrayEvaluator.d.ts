export type TestConditionsInstance =
  import("../entities/TestConditions").TestConditionsInstance;
export type TestConditionsLike =
  import("../entities/TestConditions").TestConditionsLike;
export type TestConditionsArrayInstance =
  import("../entities/TestConditionsArray").TestConditionsArray;
export type OutcomeValue = import("../entities/Outcome").OutcomeValue;
/**
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("../entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @typedef {import("../entities/TestConditionsArray").TestConditionsArray} TestConditionsArrayInstance
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 */
/**
 * Create an evaluator for a TestConditionsArray instance.
 *
 * @param {TestConditionsArrayInstance} tcArray - The TestConditionsArray instance
 * @param {import("../entities/RollModifier").RollModifierInstance} [modifier]
 * @param {boolean} [useNaturalCrits]
 * @returns {(value: number) => OutcomeValue[]} Function mapping numeric value -> array of Outcome values
 */
export function getArrayEvaluator(
  tcArray: TestConditionsArrayInstance,
  modifier?: import("../entities/RollModifier").RollModifierInstance,
  useNaturalCrits?: boolean,
): (value: number) => OutcomeValue[];
