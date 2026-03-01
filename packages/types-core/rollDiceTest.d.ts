export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type TestConditionsLike = import("./entities/TestConditions").TestConditionsLike;
export type RollDiceRule = {
    type: "value_count" | "condition_count";
    value?: number;
    conditionIndex?: number;
    exact?: number;
    atLeast?: number;
    atMost?: number;
};
export type ConditionsInput = import("./entities/DiceTestConditions").DiceTestConditions | import("./entities/TestConditionsArray").TestConditionsArray | Array<TestConditionsLike>;
export type RollDiceTestOptions = {
    count?: number;
    rules?: RollDiceRule[];
    useNaturalCrits?: boolean;
};
export type RollDiceTestResult = {
    base: {
        array: number[];
        sum: number;
    };
    result: Object;
};
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @typedef {{ type: "value_count"|"condition_count", value?: number, conditionIndex?: number, exact?: number, atLeast?: number, atMost?: number }} RollDiceRule
 * @typedef {import("./entities").DiceTestConditions|import("./entities/TestConditionsArray").TestConditionsArray|Array<TestConditionsLike>} ConditionsInput
 * @typedef {{ count?: number, rules?: RollDiceRule[], useNaturalCrits?: boolean }} RollDiceTestOptions
 * @typedef {{ base: { array: number[], sum: number }, result: Object }} RollDiceTestResult
 */
/**
 * Roll multiple dice and evaluate them against provided conditions.
 *
 * @param {DieTypeValue} dieType
 * @param {ConditionsInput} conditions
 * @param {RollDiceTestOptions} [options={}]
 *
 * @returns {RollDiceTestResult}
 */
export function rollDiceTest(dieType: DieTypeValue, conditions: ConditionsInput, { count, rules, useNaturalCrits }?: RollDiceTestOptions): RollDiceTestResult;
