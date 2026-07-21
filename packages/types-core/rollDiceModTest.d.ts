import type { DieTypeValue } from "./entities/DieType";
import type { RollModifierLike } from "./entities/RollModifier";
import type { TestConditionsLike } from "./entities/TestConditions";
export type RollDiceRule = {
  type: "value_count" | "condition_count";
  value?: number;
  conditionIndex?: number;
  exact?: number;
  atLeast?: number;
  atMost?: number;
};
type RollDiceModTestConditionsInput =
  | import("./entities/DiceTestConditions").DiceTestConditions
  | import("./entities/TestConditionsArray").TestConditionsArray
  | Array<TestConditionsLike>;
export type RollDiceModTestOptions = {
  count?: number;
  rules?: RollDiceRule[];
  useNaturalCrits?: boolean;
};
export type RollDiceModTestResult = {
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
  result: Object;
};
/**
 * Roll multiple dice with modifiers and evaluate them against conditions.
 *
 * @param {DieTypeValue} dieType
 * @param {RollModifierLike} modifier
 * @param {RollDiceModTestConditionsInput} conditions
 * @param {RollDiceModTestOptions} [options={}]
 *
 * @returns {RollDiceModTestResult}
 */
export function rollDiceModTest(
  dieType: DieTypeValue,
  modifier: RollModifierLike,
  conditions: RollDiceModTestConditionsInput,
  { count, rules, useNaturalCrits }?: RollDiceModTestOptions,
): RollDiceModTestResult;
