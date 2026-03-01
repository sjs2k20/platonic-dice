/**
 * Enum-like mapping for test evaluation types.
 *
 * We expose this as a `const` object to match the runtime shape used by the
 * JS implementation while providing string-literal types for consumers.
 */
export const TestType: Readonly<{
  Exact: "exact";
  AtLeast: "at_least";
  AtMost: "at_most";
  Within: "within";
  InList: "in_list";
  Skill: "skill";
}>;

export function isValidTestType(testType?: string): boolean;

export type TestTypeKey = keyof typeof TestType;
export type TestTypeValue = (typeof TestType)[TestTypeKey];
