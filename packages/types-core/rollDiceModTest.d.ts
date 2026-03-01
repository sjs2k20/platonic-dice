export type DieTypeValue = import("./entities/DieType").DieTypeValue;
export type RollModifierLike = import("./entities/RollModifier").RollModifierLike;
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
export type RollDiceModTestOptions = {
    count?: number;
    rules?: RollDiceRule[];
    useNaturalCrits?: boolean;
};
export type RollDiceModTestResult = {
    base: {
        array: number[];
        sum: number;
    };
    modified: {
        each: {
            array: number[];
            sum: number;
        };
        net: {
            value: number;
        };
    };
    result: Object;
};
/**
 * @typedef {import("./entities/DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./entities/RollModifier").RollModifierLike} RollModifierLike
 * @typedef {import("./entities/TestConditions").TestConditionsLike} TestConditionsLike
 * @typedef {{ type: "value_count"|"condition_count", value?: number, conditionIndex?: number, exact?: number, atLeast?: number, atMost?: number }} RollDiceRule
 * @typedef {import("./entities").DiceTestConditions|import("./entities/TestConditionsArray").TestConditionsArray|Array<TestConditionsLike>} ConditionsInput
 * @typedef {{ count?: number, rules?: RollDiceRule[], useNaturalCrits?: boolean }} RollDiceModTestOptions
 * @typedef {{ base: { array: number[], sum: number }, modified: { each: { array: number[], sum: number }, net: { value: number } }, result: Object }} RollDiceModTestResult
 */
/**
 * Roll multiple dice with modifiers and evaluate them against conditions.
 *
 * @param {DieTypeValue} dieType
 * @param {RollModifierLike} modifier
 * @param {ConditionsInput} conditions
 * @param {RollDiceModTestOptions} [options={}]
 *
 * @returns {RollDiceModTestResult}
 */
export function rollDiceModTest(dieType: DieTypeValue, modifier: RollModifierLike, conditions: ConditionsInput, { count, rules, useNaturalCrits }?: RollDiceModTestOptions): RollDiceModTestResult;
