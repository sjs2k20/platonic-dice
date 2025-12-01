import { DieTypeValue } from "../entities/DieType";
import { OutcomeValue } from "../entities/Outcome";
import { TestConditionsInstance } from "../entities/TestConditions";
import { RollModifierInstance } from "../entities/RollModifier";

export type Evaluator = (base: number) => OutcomeValue;

/**
 * Returns a per-base evaluator for the given die and test conditions.
 * Accepts either a `TestConditions` instance or a plain object with a `testType`.
 */
export function getEvaluator(
  dieType: DieTypeValue,
  testConditions: TestConditionsInstance | Record<string, any>,
  modifier?: RollModifierInstance | null,
  useNaturalCrits?: boolean | null
): Evaluator;
