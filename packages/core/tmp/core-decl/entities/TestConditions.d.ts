export type TestTypeValue = import("./TestType").TestTypeValue;
export type DieTypeValue = import("./DieType").DieTypeValue;
export type Conditions = import("../utils/testValidators").Conditions;
export type ConditionsLike = import("../utils/testValidators").ConditionsLike;
/**
 * A public 'like' type for test conditions accepted by many APIs.
 * - Either a fully constructed `TestConditions` instance, or a plain
 *   object containing at minimum a `testType` property and other condition
 *   fields. We reuse `PlainObject` from `testValidators` for the plain case.
 */
export type TestConditionsLike = InstanceType<typeof TestConditions> | ({
    testType: TestTypeValue;
} & import("../utils/testValidators").PlainObject);
export type TestConditionsInstance = InstanceType<typeof TestConditions>;
/**
 * @typedef {import("./TestType").TestTypeValue} TestTypeValue
 * @typedef {import("./DieType").DieTypeValue} DieTypeValue
 * @typedef {import("../utils/testValidators").Conditions} Conditions
 * @typedef {import("../utils/testValidators").ConditionsLike} ConditionsLike
 */
/**
 * A public 'like' type for test conditions accepted by many APIs.
 * - Either a fully constructed `TestConditions` instance, or a plain
 *   object containing at minimum a `testType` property and other condition
 *   fields. We reuse `PlainObject` from `testValidators` for the plain case.
 *
 * @typedef {InstanceType<typeof TestConditions>|({ testType: TestTypeValue } & import("../utils/testValidators").PlainObject)} TestConditionsLike
 */
/**
 * Represents a set of conditions for a dice roll test.
 */
export class TestConditions {
    /**
     * @param {TestTypeValue} testType - The test type.
     * @param {Conditions} conditions - The test conditions object.
     * @param {DieTypeValue} dieType - The die type to validate numeric ranges.
     * @throws {TypeError|RangeError} If the test type or conditions are invalid.
     */
    constructor(testType: TestTypeValue, conditions: Conditions, dieType: DieTypeValue);
    /** @type {TestTypeValue} */
    testType: TestTypeValue;
    /** @type {Conditions} */
    conditions: Conditions;
    /** @type {DieTypeValue} */
    dieType: DieTypeValue;
    /**
     * Validates that the test conditions still conforms to spec.
     * (Useful if they are loaded dynamically or serialised.)
     * @throws {TypeError} If the test conditions are invalid.
     */
    validate(): void;
}
/**
 * Master validation function for all test conditions.
 *
 * @function areValidTestConditions
 * @param {Conditions} c
 * @param {TestTypeValue} testType
 * @returns {boolean}
 */
export function areValidTestConditions(c: Conditions, testType: TestTypeValue): boolean;
/**
 * Normalises any input into a {@link TestConditions} instance.
 * Supports both pre-existing instances and plain objects.
 * Automatically validates all conditions for the specified die type.
 *
 * @function normaliseTestConditions
 * @param {TestConditions | TestConditionsLike} tc
 *   A {@link TestConditions} instance or plain object with `testType` and other fields.
 * @param {DieTypeValue} dieType
 *   The die type (e.g., `'d6'`, `'d20'`) used for validation.
 * @returns {TestConditions}
 *   A validated {@link TestConditions} instance.
 * @throws {TypeError}
 *   If the input is neither a TestConditions instance nor a plain object.
 *
 * @example
 * // Passing a plain object
 * const conditions = normaliseTestConditions({ testType: 'atLeast', target: 4 }, 'd6');
 *
 * @example
 * // Passing an existing TestConditions instance
 * const existing = new TestConditions('exact', { target: 3 }, 'd6');
 * const conditions2 = normaliseTestConditions(existing, 'd6');
 */
export function normaliseTestConditions(tc: TestConditions | TestConditionsLike, dieType: DieTypeValue): TestConditions;
