// Primary type entry for @platonic-dice/core

// Public function signatures inferred from JSDoc in `packages/core/src`

// Re-export common types for convenience (mirrors runtime `entities` exports)
export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type RollTypeValue = import("./entities/RollType").RollTypeValue;
export type OutcomeValue = import("./entities/Outcome").OutcomeValue;
export type TestTypeValue = import("./entities/TestType").TestTypeValue;
export type TestConditionsInstance =
  import("./entities/TestConditions").TestConditionsInstance;
export type TestConditionsLike =
  import("./entities/TestConditions").TestConditionsLike;
export type DiceTestResult =
  import("./entities/DiceTestConditions").DiceTestResult;

// Core convenience functions re-exported at package root
export function roll(
  dieType: DieTypeValue,
  rollType?: RollTypeValue | undefined,
): number;
export function rollDice(
  dieType: DieTypeValue,
  options?: { count?: number } | undefined,
): { array: number[]; sum: number };
export function rollMod(
  dieType: DieTypeValue,
  modifier: import("./entities/RollModifier").RollModifierLike,
  rollType?: RollTypeValue | undefined,
): { base: number; modified: number };
export function rollDiceMod(
  dieType: DieTypeValue,
  modifier?: import("./entities/RollModifier").RollModifierLike,
  options?: { count?: number } | undefined,
): {
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
};

export function rollTest(
  dieType: import("./entities/DieType").DieTypeValue,
  testConditions:
    | import("./entities/TestConditions").TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  rollType?: import("./entities/RollType").RollTypeValue,
  options?: { useNaturalCrits?: boolean },
): { base: number; outcome: import("./entities/Outcome").OutcomeValue };

export function rollModTest(
  dieType: import("./entities/DieType").DieTypeValue,
  modifier: import("./entities/RollModifier").RollModifierLike,
  testConditions:
    | import("./entities/TestConditions").TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  rollType?: import("./entities/RollType").RollTypeValue,
  options?: { useNaturalCrits?: boolean },
): {
  base: number;
  modified: number;
  outcome: import("./entities/Outcome").OutcomeValue;
};

export function rollDiceModTest(
  dieType: import("./entities/DieType").DieTypeValue,
  modifier: import("./entities/RollModifier").RollModifierLike,
  conditions:
    | import("./entities/DiceTestConditions").DiceTestConditions
    | import("./entities/TestConditionsArray").TestConditionsArray
    | Array<import("./entities/TestConditions").TestConditionsLike>,
  options?: {
    count?: number;
    rules?: import("./entities/DiceTestConditions").Rule[];
    useNaturalCrits?: boolean;
  },
): {
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
  result: import("./entities/DiceTestConditions").DiceTestResult;
};

export function rollDiceTest(
  dieType: import("./entities/DieType").DieTypeValue,
  conditions:
    | import("./entities/DiceTestConditions").DiceTestConditions
    | import("./entities/TestConditionsArray").TestConditionsArray
    | Array<import("./entities/TestConditions").TestConditionsLike>,
  options?: {
    count?: number;
    rules?: import("./entities/DiceTestConditions").Rule[];
    useNaturalCrits?: boolean;
  },
): {
  base: { array: number[]; sum: number };
  result: import("./entities/DiceTestConditions").DiceTestResult;
};

export function analyseTest(
  dieType: import("./entities/DieType").DieTypeValue,
  testConditions:
    | import("./entities/TestConditions").TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  options?: { useNaturalCrits?: boolean },
): {
  totalPossibilities: number;
  outcomeCounts: Record<string, number>;
  outcomeProbabilities: Record<string, number>;
  outcomesByRoll: Record<number, import("./entities/Outcome").OutcomeValue>;
  rolls: number[];
  rollsByOutcome: Record<string, number[]>;
};

export function analyseModTest(
  dieType: import("./entities/DieType").DieTypeValue,
  modifier: import("./entities/RollModifier").RollModifierLike,
  testConditions:
    | import("./entities/TestConditions").TestConditionsInstance
    | import("./entities/TestConditions").TestConditionsLike,
  options?: { useNaturalCrits?: boolean },
): {
  totalPossibilities: number;
  outcomeCounts: Record<string, number>;
  outcomeProbabilities: Record<string, number>;
  outcomesByRoll: Record<number, import("./entities/Outcome").OutcomeValue>;
  modifiedValuesByRoll: Record<number, number>;
  rolls: number[];
  rollsByOutcome: Record<string, number[]>;
  modifiedRange: { min: number; max: number };
};
// Re-export entity values from the entities index to ensure a single
// identity for enums/classes used in signatures below.
export {
  DieType,
  RollType,
  TestType,
  RollModifier,
  TestConditions,
  TestConditionsArray,
  DiceTestConditions,
  ModifiedTestConditions,
  Outcome,
} from "./entities";
