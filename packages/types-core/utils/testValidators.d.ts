export type TestTypeValue = import("../entities/TestType").TestTypeValue;
export type DieTypeValue = import("../entities/DieType").DieTypeValue;
export type BaseTestCondition = {
    dieType: DieTypeValue;
};
export type TargetConditions = BaseTestCondition & {
    target: number;
};
export type WithinConditions = BaseTestCondition & {
    min: number;
    max: number;
};
export type SpecificListConditions = BaseTestCondition & {
    values: number[];
};
export type SkillConditions = BaseTestCondition & {
    target: number;
    critical_success?: number;
    critical_failure?: number;
};
export type Conditions = TargetConditions | SkillConditions | WithinConditions | SpecificListConditions;
export type PlainObject = Record<string, any>;
export type ConditionsLike = Conditions | PlainObject;
/**
 * @typedef {import("../entities/TestType").TestTypeValue} TestTypeValue
 * @typedef {import("../entities/DieType").DieTypeValue} DieTypeValue
 *
 * @typedef {Object} BaseTestCondition
 * @property {DieTypeValue} dieType
 *
 * @typedef {BaseTestCondition & { target: number }} TargetConditions
 * @typedef {BaseTestCondition & { min: number, max: number }} WithinConditions
 * @typedef {BaseTestCondition & { values: number[] }} SpecificListConditions
 * @typedef {BaseTestCondition & { target: number, critical_success?: number, critical_failure?: number }} SkillConditions
 *
 * @typedef {TargetConditions | SkillConditions | WithinConditions | SpecificListConditions} Conditions
 *
 * @typedef {Record<string, any>} PlainObject
 * @typedef {Conditions|PlainObject} ConditionsLike
 */
/**
 * Checks if a number is a valid face value for a die with the given sides.
 */
/**
 * @param {number} n
 * @param {number} sides
 * @returns {boolean}
 */
export function isValidFaceValue(n: number, sides: number): boolean;
/**
 * Checks multiple keys in an object for valid face values.
 */
/**
 * @template T
 * @param {T} obj
 * @param {number} sides
 * @param {(keyof T)[]} keys
 * @returns {boolean}
 */
export function areValidFaceValues<T>(obj: T, sides: number, keys: (keyof T)[]): boolean;
/**
 * Validates the ordering of target and critical thresholds.
 */
/**
 * @param {SkillConditions|PlainObject} thresholds
 * @returns {boolean}
 */
export function isValidThresholdOrder({ target, critical_success, critical_failure }: SkillConditions | PlainObject): boolean;
/**
 * @param {TargetConditions|PlainObject} c
 * @returns {boolean}
 */
export function isValidTargetConditions(c: TargetConditions | PlainObject): boolean;
/**
 * @param {SkillConditions|PlainObject} c
 * @returns {boolean}
 */
export function isValidSkillTestCondition(c: SkillConditions | PlainObject): boolean;
/**
 * @param {WithinConditions|PlainObject} c
 * @returns {boolean}
 */
export function isValidWithinConditions(c: WithinConditions | PlainObject): boolean;
/**
 * @param {SpecificListConditions|PlainObject} c
 * @returns {boolean}
 */
export function isValidSpecificListConditions(c: SpecificListConditions | PlainObject): boolean;
/**
 * Master validation function for all test conditions.
 */
/**
 * @param {Conditions|PlainObject} c
 * @param {TestTypeValue|string} testType
 * @returns {boolean}
 */
export function areValidTestConditions(c: Conditions | PlainObject, testType: TestTypeValue | string): boolean;
/**
 * Validates that the given keys on an object are integer values within
 * an explicit inclusive range `[min, max]`.
 *
 * This is useful for modified-range validation where the permissible
 * faces aren't 1..sides but an arbitrary min..max after applying modifiers.
 *
 * @param {PlainObject} obj
 * @param {number} min
 * @param {number} max
 * @param {(string)[]} keys
 * @returns {boolean}
 */
export function areValidValuesInRange(obj: PlainObject, min: number, max: number, keys: (string)[]): boolean;
