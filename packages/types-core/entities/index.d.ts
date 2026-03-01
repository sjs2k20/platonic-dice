export const DieType: Readonly<{
    D4: "d4";
    D6: "d6";
    D8: "d8";
    D10: "d10";
    D12: "d12";
    D20: "d20";
}>;
export const isValidDieType: typeof import("./DieType").isValidDieType;
export const Outcome: Readonly<{
    Success: "success";
    Failure: "failure";
    CriticalSuccess: "critical_success";
    CriticalFailure: "critical_failure";
}>;
export const isValidOutcome: typeof import("./Outcome").isValidOutcome;
export const RollModifier: typeof import("./RollModifier").RollModifier;
export const isValidRollModifier: typeof import("./RollModifier").isValidRollModifier;
export const normaliseRollModifier: typeof import("./RollModifier").normaliseRollModifier;
export const RollType: Readonly<{
    Advantage: "advantage";
    Disadvantage: "disadvantage";
}>;
export const isValidRollType: typeof import("./RollType").isValidRollType;
export const TestConditions: typeof import("./TestConditions").TestConditions;
export const areValidTestConditions: typeof import("./TestConditions").areValidTestConditions;
export const normaliseTestConditions: typeof import("./TestConditions").normaliseTestConditions;
export const DiceTestConditions: typeof import("./DiceTestConditions").DiceTestConditions;
export const TestConditionsArray: typeof import("./TestConditionsArray").TestConditionsArray;
export const ModifiedTestConditions: typeof import("./ModifiedTestConditions").ModifiedTestConditions;
export const areValidModifiedTestConditions: typeof import("./ModifiedTestConditions").areValidModifiedTestConditions;
export const computeModifiedRange: typeof import("./ModifiedTestConditions").computeModifiedRange;
export const TestType: Readonly<{
    Exact: "exact";
    AtLeast: "at_least";
    AtMost: "at_most";
    Within: "within";
    InList: "in_list";
    Skill: "skill";
}>;
export const isValidTestType: typeof import("./TestType").isValidTestType;
