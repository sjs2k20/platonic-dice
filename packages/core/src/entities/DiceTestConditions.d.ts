import type { TestConditionsLike } from "./TestConditions";
import type { TestConditionsArrayInstance } from "./TestConditionsArray";
import type { RollModifierInstance } from "./RollModifier";
import type { Rule, DiceTestResult } from "./types";

export class DiceTestConditions {
  constructor(opts: {
    count: number;
    conditions: TestConditionsLike[] | TestConditionsArrayInstance;
    rules?: Rule[];
    dieType?: import("./DieType").DieTypeValue;
  });
  count: number;
  tcArray: TestConditionsArrayInstance;
  rules: Rule[];
  toEvaluator(
    modifier?: RollModifierInstance,
    useNaturalCrits?: boolean,
  ): (rolls: number[]) => DiceTestResult;
  evaluateRolls(
    rolls: number[],
    modifier?: RollModifierInstance,
    useNaturalCrits?: boolean,
  ): DiceTestResult;
}

export type DiceTestConditionsInstance = InstanceType<
  typeof DiceTestConditions
>;
