import type { DieTypeValue } from "./entities/DieType";
import type { RollDiceModModifier } from "./rollDiceMod";
import type {
  ConditionsInput,
  RollDiceTestOptions,
  DiceTestResult,
} from "./entities/types";

export function rollDiceModTest(
  dieType: DieTypeValue,
  modifier: RollDiceModModifier,
  conditions: ConditionsInput,
  options?: RollDiceTestOptions,
): {
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
  result: DiceTestResult;
};
