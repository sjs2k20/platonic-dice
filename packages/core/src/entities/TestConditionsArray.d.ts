import type { TestConditionsInstance } from "./TestConditions";
import type { DieTypeValue } from "./DieType";

export class TestConditionsArray {
  constructor(
    arr: Array<TestConditionsInstance | { [key: string]: any }>,
    dieType?: DieTypeValue,
  );
  defaultDieType?: DieTypeValue;
  conditions: TestConditionsInstance[];
  evaluateEach(
    value: number,
    evaluator?: (value: number, tc: TestConditionsInstance) => string,
  ): string[];
  toArray(): TestConditionsInstance[];
}

export type TestConditionsArrayInstance = InstanceType<
  typeof TestConditionsArray
>;
