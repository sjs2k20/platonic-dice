export default "./index.js";

// Public function signatures inferred from JSDoc in `packages/core/src`
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
    | import("./entities").DiceTestConditions
    | import("./entities/TestConditionsArray").TestConditionsArray
    | Array<import("./entities/TestConditions").TestConditionsLike>,
  options?: { count?: number; rules?: any[]; useNaturalCrits?: boolean },
): {
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
  result: any;
};

export function rollDiceTest(
  dieType: import("./entities/DieType").DieTypeValue,
  conditions:
    | import("./entities").DiceTestConditions
    | import("./entities/TestConditionsArray").TestConditionsArray
    | Array<import("./entities/TestConditions").TestConditionsLike>,
  options?: { count?: number; rules?: any[]; useNaturalCrits?: boolean },
): { base: { array: number[]; sum: number }; result: any };

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
declare namespace ___home_me_Code_Git_Repos_platonic_dice_packages_core_src_index_ {}
export {
  DieType,
  isValidDieType,
  Outcome,
  isValidOutcome,
  RollType,
  isValidRollType,
  TestType,
  isValidTestType,
  RollModifier,
  isValidRollModifier,
  normaliseRollModifier,
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
  TestConditionsArray,
  DiceTestConditions,
  ModifiedTestConditions,
  areValidModifiedTestConditions,
  computeModifiedRange,
};
