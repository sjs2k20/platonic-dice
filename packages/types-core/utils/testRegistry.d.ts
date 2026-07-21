export type Conditions = import("./testValidators").Conditions;
export type PlainObject = Record<string, unknown>;
/**
 * Evaluator: function that maps a rolled base value (1..sides) to an OutcomeValue.
 */
export type ConditionsLike = Conditions | PlainObject;
/**
 * BuildEvaluator: factory that builds an Evaluator for a specific die/conditions.
 */
export type Evaluator = (
  base: number,
) => import("../entities/Outcome").OutcomeValue;
/**
 * RegistryEntry: describes the shape validator, optional evaluator builder, and
 * optional default for `useNaturalCrits` for that test type.
 */
export type BuildEvaluator = (
  dieType: import("../entities/DieType").DieTypeValue,
  testConditions: ConditionsLike,
  modifier?: import("../entities/RollModifier").RollModifierInstance,
  useNaturalCrits?: boolean,
) => Evaluator;
export type RegistryEntry = {
  validateShape: (c: ConditionsLike) => boolean;
  buildEvaluator?: BuildEvaluator;
  defaultUseNaturalCrits?: boolean;
};
/**
 * Register a new test type.
 * @param {string} name
 * @param {{ validateShape: (c: ConditionsLike) => boolean, buildEvaluator?: Function }} opts
 */
export function registerTestType(
  name: string,
  {
    validateShape,
    buildEvaluator,
  }: {
    validateShape: (c: ConditionsLike) => boolean;
    buildEvaluator?: Function;
  },
): void;
/**
 * @param {string} name
 * @returns {RegistryEntry|undefined}
 */
export function getRegistration(name: string): RegistryEntry | undefined;
/**
 * @typedef {import("./testValidators").Conditions} Conditions
 * @typedef {Record<string, unknown>} PlainObject
 * @typedef {Conditions|PlainObject} ConditionsLike
 *
 * Evaluator: function that maps a rolled base value (1..sides) to an OutcomeValue.
 * @typedef {(base: number) => import("../entities/Outcome").OutcomeValue} Evaluator
 *
 * BuildEvaluator: factory that builds an Evaluator for a specific die/conditions.
 * @typedef {(dieType: import("../entities/DieType").DieTypeValue, testConditions: ConditionsLike, modifier?: import("../entities/RollModifier").RollModifierInstance, useNaturalCrits?: boolean) => Evaluator} BuildEvaluator
 *
 * RegistryEntry: describes the shape validator, optional evaluator builder, and
 * optional default for `useNaturalCrits` for that test type.
 * @typedef {{ validateShape: (c: ConditionsLike) => boolean, buildEvaluator?: BuildEvaluator, defaultUseNaturalCrits?: boolean }} RegistryEntry
 */
/** Internal registry map: testType -> { validateShape, buildEvaluator? } */
export const registry: Map<string, RegistryEntry>;
