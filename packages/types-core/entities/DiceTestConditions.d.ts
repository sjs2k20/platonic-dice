export type TestConditionsLike = import("./TestConditions").TestConditionsLike;
export type Rule = {
    type: "value_count" | "condition_count";
    value?: number | undefined;
    conditionIndex?: number | undefined;
    exact?: number | undefined;
    atLeast?: number | undefined;
    atMost?: number | undefined;
};
/**
 * Result of evaluating multiple dice against test conditions.
 */
export type DiceTestResult = {
    /**
     * - Matrix of outcomes per die per condition
     */
    matrix: import("./Outcome").OutcomeValue[][];
    /**
     * - Count of successes per condition index
     */
    condCount: Record<number, number>;
    /**
     * - Count of each literal value rolled
     */
    valueCounts: Record<number, number>;
    /**
     * - Results per rule
     */
    ruleResults: Array<{
        id: number;
        rule: Rule;
        count?: number;
        passed: boolean;
    }>;
    /**
     * - Whether all rules passed
     */
    passed: boolean;
};
/**
 * @typedef {import("./TestConditions").TestConditionsLike} TestConditionsLike
 */
/**
 * @typedef {Object} Rule
 * @property {"value_count"|"condition_count"} type
 * @property {number} [value]
 * @property {number} [conditionIndex]
 * @property {number} [exact]
 * @property {number} [atLeast]
 * @property {number} [atMost]
 */
/**
 * Result of evaluating multiple dice against test conditions.
 * @typedef {Object} DiceTestResult
 * @property {import("./Outcome").OutcomeValue[][]} matrix - Matrix of outcomes per die per condition
 * @property {Record<number, number>} condCount - Count of successes per condition index
 * @property {Record<number, number>} valueCounts - Count of each literal value rolled
 * @property {Array<{ id: number, rule: Rule, count?: number, passed: boolean }>} ruleResults - Results per rule
 * @property {boolean} passed - Whether all rules passed
 */
export class DiceTestConditions {
    /**
     * @param {{ count?: number, conditions?: TestConditionsLike[]|TestConditionsArray, rules?: Rule[], dieType?: string }} [opts]
     */
    constructor(opts?: {
        count?: number;
        conditions?: TestConditionsLike[] | TestConditionsArray;
        rules?: Rule[];
        dieType?: string;
    });
    count: number;
    tcArray: TestConditionsArray;
    rules: Rule[];
    /**
     * Returns an evaluator function that accepts an array of rolled values
     * and returns an aggregated result object.
     *
     * @param {import("./RollModifier").RollModifierInstance} [modifier]
     * @param {boolean} [useNaturalCrits]
     * @returns {(rolls: number[]) => DiceTestResult}
     */
    toEvaluator(modifier?: import("./RollModifier").RollModifierInstance, useNaturalCrits?: boolean): (rolls: number[]) => DiceTestResult;
    /**
     * Convenience: evaluate immediately against provided rolls
     * @param {number[]} rolls
     * @param {import("./RollModifier").RollModifierInstance|undefined} [modifier=undefined]
     * @param {boolean|undefined} [useNaturalCrits=undefined]
     * @returns {DiceTestResult}
     */
    evaluateRolls(rolls: number[], modifier?: import("./RollModifier").RollModifierInstance | undefined, useNaturalCrits?: boolean | undefined): DiceTestResult;
}
import { TestConditionsArray } from "./TestConditionsArray";
