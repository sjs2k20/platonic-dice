import core from "@platonic-dice/core";
const {
  RollType,
  roll: coreRoll,
  rollMod: coreRollMod,
  rollTest: coreRollTest,
} = core;

import type {
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
} from "@platonic-dice/core";
import type {
  DieTypeValue,
  TestTypeValue,
  RollTypeValue,
} from "@platonic-dice/core";

import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
} from "@dice/types";

import {
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
} from "./internal";

// Runtime validation for rollType values uses the runtime `RollType` object.

/**
 * Factory interface for producing RollRecord values.
 *
 * This module centralizes the creation of roll records (normal, modified
 * and test rolls). The implementation intentionally keeps a small public
 * surface: callers request a record and receive a validated object ready
 * to be persisted in history. The default implementation delegates to the
 * `@platonic-dice/core` roll functions and stamps records with the system
 * clock. No constructor-based dependency injection is used here to keep
 * the API simple; tests can still override behaviour by calling the
 * factory methods directly.
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
    rollType?: RollTypeValue
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
    rollType?: RollTypeValue
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
    rollType?: RollTypeValue
  ): TestDieRollRecord;
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
    rollType?: RollTypeValue
  ): DieRollRecord {
    // Runtime validation without `any` casts: compare against the known
    // RollType members (explicit checks keep types narrow and avoid casts).
    if (
      rollType !== undefined &&
      rollType !== RollType.Advantage &&
      rollType !== RollType.Disadvantage
    ) {
      throw new TypeError(`Invalid rollType: ${String(rollType)}`);
    }
    // Delegate to core roll implementation and attach a timestamp.
    const value = coreRoll(dieType, rollType);
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
    rollType?: RollTypeValue
  ): ModifiedDieRollRecord {
    // Resolve base and modified values using the core helper, then stamp.
    const { base, modified } = coreRollMod(dieType, modifier, rollType);
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
    rollType?: RollTypeValue
  ): TestDieRollRecord {
    // Core normalises and evaluates test conditions; we retain the outcome
    // and attach a timestamp to produce a TestDieRollRecord.
    const { base, outcome } = coreRollTest(dieType, testConditions, rollType);
    const ts = new Date();
    const record: TestDieRollRecord = { roll: base, outcome, timestamp: ts };

    if (!isTargetDieRollRecord(record)) {
      throw new Error("Factory produced invalid TestDieRollRecord");
    }

    return record;
  }
}

export default RollRecordFactory;
