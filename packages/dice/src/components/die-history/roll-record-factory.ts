import { Outcome, RollType, roll as coreRoll } from "@platonic-dice/core";

import type {
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
} from "@platonic-dice/core";
import type {
  DieTypeValue,
  TestTypeValue,
  RollTypeValue,
  OutcomeValue,
} from "@platonic-dice/core";

import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
  ModifiedTestDieRollRecord,
} from "@dice/types";

import {
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
  isModifiedTestDieRollRecord,
} from "./internal";

function formatDieExpression(
  dieType: DieTypeValue,
  rollType?: RollTypeValue,
): string {
  const suffix = rollType
    ? rollType === RollType.Advantage
      ? "ADV"
      : "DIS"
    : "";
  return `1${dieType.toUpperCase()}${suffix}`;
}

function formatTestExpression(
  dieType: DieTypeValue,
  testConditions:
    | TestConditionsInstance
    | { testType: TestTypeValue; [k: string]: any },
  rollType?: RollTypeValue,
): string {
  const normalizedTest = testConditions as {
    testType?: TestTypeValue;
    target?: number;
  };
  const testType = normalizedTest.testType ?? "at_least";
  const target = normalizedTest.target ?? 0;
  const grammarTestType =
    testType === "at_least"
      ? "atLeast"
      : testType === "at_most"
        ? "atMost"
        : testType === "exact"
          ? "exactly"
          : testType;

  return `${formatDieExpression(dieType, rollType)} GET ${grammarTestType} ${target}`;
}

function evaluateOutcome(
  value: number,
  testConditions:
    | TestConditionsInstance
    | { testType: TestTypeValue; [k: string]: any },
): OutcomeValue {
  const normalizedTest = testConditions as {
    testType?: TestTypeValue;
    target?: number;
  };
  const testType = normalizedTest.testType ?? "at_least";
  const target = normalizedTest.target ?? 0;

  switch (testType) {
    case "at_most":
      return value <= target ? Outcome.Success : Outcome.Failure;
    case "exact":
      return value === target ? Outcome.Success : Outcome.Failure;
    case "at_least":
    default:
      return value >= target ? Outcome.Success : Outcome.Failure;
  }
}

function resolveModifierValue(
  modifier: RollModifierFunction | RollModifierInstance,
  baseValue: number,
): number {
  if (typeof modifier === "function") {
    return modifier(baseValue);
  }

  if (
    modifier &&
    typeof (
      modifier as RollModifierInstance & { apply?: (value: number) => number }
    ).apply === "function"
  ) {
    return (
      modifier as RollModifierInstance & { apply?: (value: number) => number }
    ).apply!(baseValue);
  }

  return baseValue;
}

// Runtime validation for rollType values uses the runtime `RollType` object.

/**
 * Factory interface for producing roll-record values.
 *
 * This module translates the Die wrapper API into expressions for the core
 * expression-first runtime, then normalises the returned structured result into
 * the persisted history record shape. The public surface stays small so callers
 * can request a record and receive a validated object ready for history storage.
 */
export interface IRollRecordFactory {
  /**
   * Create a simple numeric roll record for the given die.
   *
   * @param {DieTypeValue} dieType - The die type (e.g. `DieType.D6`).
   * @param {RollTypeValue} [rollType] - Optional roll mode (advantage/disadvantage).
   * @returns {DieRollRecord} A validated die roll record containing `roll` and `timestamp`.
   * @throws {TypeError} If `rollType` is not a valid `RollTypeValue`.
   */
  createNormalRoll(
    dieType: DieTypeValue,
    rollType?: RollTypeValue,
  ): DieRollRecord;

  /**
   * Create a modified roll record. The modifier may be a numeric or
   * functional modifier; the factory resolves base and modified values.
   *
   * @param {DieTypeValue} dieType - The die type to roll.
   * @param {RollModifierFunction|RollModifierInstance} modifier - Modifier applied to the base roll.
   * @param {RollTypeValue} [rollType] - Optional roll mode.
   * @returns {ModifiedDieRollRecord} A validated modified roll record.
   */
  createModifiedRoll(
    dieType: DieTypeValue,
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollTypeValue,
  ): ModifiedDieRollRecord;

  /**
   * Create a test roll record. `testConditions` may be a plain object or
   * a `TestConditionsInstance` — the core library will normalise and
   * validate it. The returned record contains `roll` and `outcome`.
   *
   * @param {DieTypeValue} dieType - The die type to roll.
   * @param {TestConditionsInstance|{ testType: TestTypeValue; [k: string]: any }} testConditions - Test descriptor or instance.
   * @param {RollTypeValue} [rollType] - Optional roll mode.
   * @returns {TestDieRollRecord} A validated test roll record containing `roll`, `outcome`, and `timestamp`.
   */
  createTestRoll(
    dieType: DieTypeValue,
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue,
  ): TestDieRollRecord;

  /**
   * Create a modified test roll record. Combines modifier and test evaluation.
   *
   * @param {DieTypeValue} dieType - The die type to roll.
   * @param {RollModifierFunction|RollModifierInstance} modifier - Modifier applied to the base roll.
   * @param {TestConditionsInstance|{ testType: TestTypeValue; [k: string]: any }} testConditions - Test descriptor or instance.
   * @param {RollTypeValue} [rollType] - Optional roll mode.
   * @param {{useNaturalCrits?: boolean}} [options] - Optional configuration for natural crits.
   * @returns {ModifiedTestDieRollRecord} A validated modified test roll record containing `roll`, `modified`, `outcome`, and `timestamp`.
   */
  createModifiedTestRoll(
    dieType: DieTypeValue,
    modifier: RollModifierFunction | RollModifierInstance,
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue,
    options?: { useNaturalCrits?: boolean },
  ): ModifiedTestDieRollRecord;
}

/**
 * Default implementation that delegates to `@platonic-dice/core` and uses
 * the system clock. This keeps the public API simple and avoids DI.
 */

/**
 * Implementation of RollRecordFactory that delegates to @platonic-dice/core and uses the system clock.
 * This keeps the public API simple and avoids DI.
 */
export class RollRecordFactory implements IRollRecordFactory {
  createNormalRoll(
    dieType: DieTypeValue,
    rollType?: RollTypeValue,
  ): DieRollRecord {
    if (
      rollType !== undefined &&
      rollType !== RollType.Advantage &&
      rollType !== RollType.Disadvantage
    ) {
      throw new TypeError(`Invalid rollType: ${String(rollType)}`);
    }

    const expression = formatDieExpression(dieType, rollType);
    const result = coreRoll(expression);
    const value =
      typeof result === "number"
        ? result
        : (result?.base ?? result?.modified ?? 0);
    const ts = new Date();
    const record: DieRollRecord = { roll: value, timestamp: ts };

    if (!isDieRollRecord(record)) {
      throw new Error("Factory produced invalid DieRollRecord");
    }

    return record;
  }

  createModifiedRoll(
    dieType: DieTypeValue,
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollTypeValue,
  ): ModifiedDieRollRecord {
    const expression = formatDieExpression(dieType, rollType);
    const result = coreRoll(expression);
    const base =
      typeof result === "number"
        ? result
        : (result?.base ?? result?.modified ?? 0);
    const modified = resolveModifierValue(modifier, base);
    const ts = new Date();
    const record: ModifiedDieRollRecord = {
      roll: base,
      modified,
      timestamp: ts,
    };

    if (!isModifiedDieRollRecord(record)) {
      throw new Error("Factory produced invalid ModifiedDieRollRecord");
    }

    return record;
  }

  createTestRoll(
    dieType: DieTypeValue,
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue,
  ): TestDieRollRecord {
    const expression = formatTestExpression(dieType, testConditions, rollType);
    const result = coreRoll(expression);
    const base =
      typeof result === "number"
        ? result
        : (result?.base ?? result?.modified ?? 0);
    const outcome = evaluateOutcome(base, testConditions);
    const ts = new Date();
    const record: TestDieRollRecord = { roll: base, outcome, timestamp: ts };

    if (!isTargetDieRollRecord(record)) {
      throw new Error("Factory produced invalid TestDieRollRecord");
    }

    return record;
  }

  createModifiedTestRoll(
    dieType: DieTypeValue,
    modifier: RollModifierFunction | RollModifierInstance,
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue,
    options?: { useNaturalCrits?: boolean },
  ): ModifiedTestDieRollRecord {
    const expression = formatTestExpression(dieType, testConditions, rollType);
    const result = coreRoll(expression);
    const base =
      typeof result === "number"
        ? result
        : (result?.base ?? result?.modified ?? 0);
    const modified = resolveModifierValue(modifier, base);
    const outcome = evaluateOutcome(modified, testConditions);
    const ts = new Date();
    const record: ModifiedTestDieRollRecord = {
      roll: base,
      modified,
      outcome,
      timestamp: ts,
    };

    if (!isModifiedTestDieRollRecord(record)) {
      throw new Error("Factory produced invalid ModifiedTestDieRollRecord");
    }

    return record;
  }
}

export default RollRecordFactory;
