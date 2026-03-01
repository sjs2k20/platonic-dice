export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type OutcomeValue = import("./entities/Outcome").OutcomeValue;
export type RollTypeValue = import("./entities/RollType").RollTypeValue;
export type TestTypeValue = import("./entities/TestType").TestTypeValue;
export type TestConditionsInstance = import("./entities/TestConditions").TestConditionsInstance;
export type RollTestOptions = {
    /**
     * - If true, rolling the die's maximum value
     * triggers CriticalSuccess (for Skill tests) or Success (for AtLeast/AtMost tests),
     * and rolling 1 triggers CriticalFailure (for Skill tests) or Failure (for AtLeast)
     * or Success (for AtMost). If undefined, defaults to true for TestType.Skill
     * and false for all other test types.
     */
    useNaturalCrits?: boolean | undefined;
};
