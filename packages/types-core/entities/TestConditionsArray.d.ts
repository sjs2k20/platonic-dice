export type TestConditionsInstance = import("./TestConditions").TestConditionsInstance;
export type TestConditionsLike = import("./TestConditions").TestConditionsLike;
/**
 * @typedef {import("./TestConditions").TestConditionsInstance} TestConditionsInstance
 * @typedef {import("./TestConditions").TestConditionsLike} TestConditionsLike
 */
export class TestConditionsArray {
    /**
     * @param {Array<TestConditionsInstance|Object>} arr - Array of TestConditions instances or plain objects
     * @param {string|undefined} [defaultDieType] - Optional default die type used to normalise plain objects
    /**
     * @param {Array<TestConditionsInstance|TestConditionsLike>} arr - Array of TestConditions instances or plain objects
     * @param {string|undefined} [defaultDieType] - Optional default die type used to normalise plain objects
     */
    constructor(arr?: Array<TestConditionsInstance | Object>, defaultDieType?: string | undefined);
    defaultDieType: string | undefined;
    /** @type {TestConditionsInstance[]} */
    conditions: TestConditionsInstance[];
    /**
     * Evaluate each contained condition against a provided numeric value.
     * Returns an array of outcome values (strings) for each condition in order.
     *
     * @param {number} value - The numeric value to evaluate (e.g., a die face or modified value)
     * @param {Function} evaluator - A function `(value, testConditionsInstance) => outcome`.
     *        If omitted, each TestConditions instance is expected to be consumable by
     *        existing utilities that accept a TestConditions instance.
     * @returns {Array<string>} outcomes
     */
    evaluateEach(value: number, evaluator: Function): Array<string>;
    /**
     * Convenience to return the raw TestConditions instances array.
     * @returns {TestConditionsInstance[]}
     */
    toArray(): TestConditionsInstance[];
}
