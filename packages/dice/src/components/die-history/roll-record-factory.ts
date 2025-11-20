import {
  DieType,
  RollType,
  roll as coreRoll,
  rollMod as coreRollMod,
  rollTest as coreRollTest,
} from "@platonic-dice/core";

import type {
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
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
   * @param dieType - The die type (e.g. `DieType.D6`).
   * @param rollType - Optional roll mode (advantage/disadvantage).
   * @throws TypeError for invalid `rollType`.
   */
  createNormalRoll(dieType: DieType, rollType?: RollType): DieRollRecord;

  /**
   * Create a modified roll record. The modifier may be a numeric or
   * functional modifier; the factory resolves base and modified values.
   */
  createModifiedRoll(
    dieType: DieType,
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollType
  ): ModifiedDieRollRecord;

  /**
   * Create a test roll record. `testConditions` may be a plain object or
   * a `TestConditionsInstance` — the core library will normalise and
   * validate it. The returned record contains `roll` and `outcome`.
   */
  createTestRoll(
    dieType: DieType,
    testConditions: TestConditionsInstance | object,
    rollType?: RollType
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
  createNormalRoll(dieType: DieType, rollType?: RollType): DieRollRecord {
    if (rollType !== undefined && !Object.values(RollType).includes(rollType)) {
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
    dieType: DieType,
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollType
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
    dieType: DieType,
    testConditions: TestConditionsInstance | object,
    rollType?: RollType
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
