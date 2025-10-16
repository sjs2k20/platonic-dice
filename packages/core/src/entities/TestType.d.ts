/**
 * Enum for test evaluation types.
 *
 * Defines how a roll is compared against its conditions
 * in {@link TestConditions}-based evaluations.
 */
export enum TestType {
  Exact = "exact",
  AtLeast = "at_least",
  AtMost = "at_most",
  Within = "within",
  InList = "in_list",
  Skill = "skill",
}

/**
 * Checks whether a given value is a valid {@link TestType}.
 *
 * @param testType - The test type to validate.
 * @returns `true` if valid, otherwise `false`.
 */
export function isValidTestType(testType: string | null): boolean;

/** The keys of {@link TestType} (e.g., `"AtLeast"`). */
export type TestTypeKey = keyof typeof TestType;

/** The string values of {@link TestType} (e.g., `"at_least"`). */
export type TestTypeValue = (typeof TestType)[TestTypeKey];
