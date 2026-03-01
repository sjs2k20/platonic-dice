export type TestTypeKey = keyof typeof TestType;
export type TestTypeValue = (typeof TestType)[keyof typeof TestType];
export type TestType = string;
/**
 * @module @platonic-dice/core/src/entities/TestType
 * @description
 * Enum for test evaluation types (used in {@link TestConditions}).
 *
 * @readonly
 * @enum {string}
 */
export const TestType: Readonly<{
    Exact: "exact";
    AtLeast: "at_least";
    AtMost: "at_most";
    Within: "within";
    InList: "in_list";
    Skill: "skill";
}>;
/**
 * Checks whether a given value is a valid `TestType`.
 *
 * @function isValidTestType
 * @param {TestTypeValue | null | undefined} testType
 * @returns {boolean}
 */
export function isValidTestType(testType: TestTypeValue | null | undefined): boolean;
