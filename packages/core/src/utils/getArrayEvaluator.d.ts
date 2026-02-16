import type { TestConditionsArrayInstance } from "../entities/TestConditionsArray";
import type { RollModifierInstance } from "../entities/RollModifier";
import type { OutcomeValue } from "../entities/Outcome";

export function getArrayEvaluator(
  tcArray: TestConditionsArrayInstance,
  modifier?: RollModifierInstance | null,
  useNaturalCrits?: boolean | null,
): (value: number) => OutcomeValue[];

export type GetArrayEvaluator = typeof getArrayEvaluator;
