import type { TestConditionsLike } from "./TestConditions";
import type { TestConditionsArrayInstance } from "./TestConditionsArray";

export class DiceTestConditions {
  constructor(opts: {
    count: number;
    conditions: TestConditionsLike[] | TestConditionsArrayInstance;
    rules?: any[];
  });
  count: number;
  tcArray: TestConditionsArrayInstance;
  rules: any[];
  toEvaluator(
    modifier?: any,
    useNaturalCrits?: boolean | null,
  ): (rolls: number[]) => any;
  evaluateRolls(
    rolls: number[],
    modifier?: any,
    useNaturalCrits?: boolean | null,
  ): any;
}

export type DiceTestConditionsInstance = InstanceType<
  typeof DiceTestConditions
>;
