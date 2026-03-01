export type DieTypeValue = import("../entities/DieType").DieTypeValue;
export type TestTypeValue = import("../entities/TestType").TestTypeValue;
export type OutcomeValue = import("../entities/Outcome").OutcomeValue;
export type TestConditionsInstance = import("../entities/TestConditions").TestConditionsInstance;
export type Evaluator = (base: number) => OutcomeValue;
/**
 * Get an evaluator function mapping base roll -> OutcomeValue.
 */
export type TestConditionsLike = import("../entities/TestConditions").TestConditionsLike;
/**
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/Outcome").OutcomeValue} OutcomeValue
 * @typedef {import("../entities/TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {(base: number) => OutcomeValue} Evaluator
 */
/**
 * Get an evaluator function mapping base roll -> OutcomeValue.
 *
 * @typedef {import("../entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @param {DieTypeValue} dieType
 * @param {TestConditionsLike} testConditions
 * @param {import("../entities/RollModifier").RollModifierInstance} [modifier]
 * @param {boolean} [useNaturalCrits]
 * @returns {Evaluator}
 */
export function getEvaluator(dieType: DieTypeValue, testConditions: TestConditionsLike, modifier?: import("../entities/RollModifier").RollModifierInstance, useNaturalCrits?: boolean): Evaluator;
