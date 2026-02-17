import type { DieTypeValue } from "./entities/DieType";
import type {
  ConditionsInput,
  RollDiceTestOptions,
  DiceTestResult,
} from "./entities/types";

export function rollDiceTest(
  dieType: DieTypeValue,
  conditions: ConditionsInput,
  options?: RollDiceTestOptions,
): { base: { array: number[]; sum: number }; result: DiceTestResult };
