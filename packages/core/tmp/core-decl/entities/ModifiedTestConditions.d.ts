export type TestTypeValue = import("./TestType").TestTypeValue;
export type DieTypeValue = import("./DieType").DieTypeValue;
export type RollModifierFunction = import("./RollModifier").RollModifierFunction;
export type RollModifierInstance = import("./RollModifier").RollModifierInstance;
export type RollModifierLike = import("./RollModifier").RollModifierLike;
export type Conditions = import("../utils/testValidators").Conditions;
export type PlainObject = import("../utils/testValidators").PlainObject;
export type ModifiedBaseTestCondition = {
    modifiedRange: {
        min: number;
        max: number;
    };
};
export type ModifiedTargetConditions = ModifiedBaseTestCondition & {
    target: number;
};
export type ModifiedWithinConditions = ModifiedBaseTestCondition & {
    min: number;
    max: number;
};
export type ModifiedSpecificListConditions = ModifiedBaseTestCondition & {
    values: number[];
};
export type ModifiedSkillConditions = ModifiedBaseTestCondition & {
    target: number;
    critical_success?: number;
    critical_failure?: number;
};
export type ModifiedConditions = ModifiedTargetConditions | ModifiedSkillConditions | ModifiedWithinConditions | ModifiedSpecificListConditions;
export type ModifiedTestConditionsInstance = InstanceType<typeof ModifiedTestConditions>;
/**
 * Represents a set of validated test conditions for modified rolls.
 *
 * This class is similar to {@link TestConditions} but validates numeric
 * targets against the achievable range after applying a modifier.
 */
export class ModifiedTestConditions {
    /**
     * @param {TestTypeValue} testType - The test type.
     * @param {Conditions} conditions - The test conditions object.
     * @param {DieTypeValue} dieType - The base die type.
     * @param {RollModifierLike} modifier - The modifier to apply.
     * @throws {TypeError|RangeError} If the test type or conditions are invalid.
     */
    constructor(testType: TestTypeValue, conditions: Conditions, dieType: DieTypeValue, modifier: RollModifierLike);
    /** @type {TestTypeValue} */
    testType: TestTypeValue;
    /** @type {Conditions} */
    conditions: Conditions;
    /** @type {DieTypeValue} */
    dieType: DieTypeValue;
    /** @type {RollModifierInstance} */
    modifier: RollModifierInstance;
    /** @type {{ min: number, max: number }} */
    modifiedRange: {
        min: number;
        max: number;
    };
    /**
     * Validates that the test conditions still conform to spec.
     * @throws {TypeError} If the test conditions are invalid.
     */
    validate(): void;
}
/**
 * Validates test conditions against a modified range.
 *
 * @private
 * @param {ModifiedConditions & PlainObject} c - Conditions with modifiedRange
 * @param {TestTypeValue} testType
 * @returns {boolean}
 */
export function areValidModifiedTestConditions(c: ModifiedConditions & PlainObject, testType: TestTypeValue): boolean;
/**
 * @typedef {import("./TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./DieType").DieTypeValue} DieTypeValue
 * @typedef {import("./RollModifier").RollModifierFunction} RollModifierFunction
 * @typedef {import("./RollModifier").RollModifierInstance} RollModifierInstance
 * @typedef {import("./RollModifier").RollModifierLike} RollModifierLike
 */
/**
 * @typedef {import("../utils/testValidators").Conditions} Conditions
 * @typedef {import("../utils/testValidators").PlainObject} PlainObject
 */
/**
 * Computes the achievable range for a die + modifier combination.
 *
 * @private
 * @param {DieTypeValue} dieType
 * @param {RollModifierInstance} modifier
 * @returns {{ min: number, max: number }}
 */
export function computeModifiedRange(dieType: DieTypeValue, modifier: RollModifierInstance): {
    min: number;
    max: number;
};
