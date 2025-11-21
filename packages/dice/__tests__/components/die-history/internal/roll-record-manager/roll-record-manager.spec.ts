import { describe, it, expect, beforeEach } from "vitest";
import { Outcome } from "@platonic-dice/core";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
  ModifiedTestDieRollRecord,
} from "@dice/types/roll-record.types";
import {
  DEFAULT_MAX_RECORDS,
  RollRecordManager,
} from "@dice/components/die-history/internal";

describe("RollRecordManager", () => {
  let manager: RollRecordManager;

  const dieRoll: DieRollRecord = {
    roll: 5,
    timestamp: new Date(),
  };

  const modifiedDieRoll: ModifiedDieRollRecord = {
    roll: 3,
    modified: 1,
    timestamp: new Date(),
  };

  const targetDieRoll: TestDieRollRecord = {
    roll: 20,
    outcome: Outcome.Success,
    timestamp: new Date(),
  };

  const modifiedTestDieRoll: ModifiedTestDieRollRecord = {
    roll: 15,
    modified: 20,
    outcome: Outcome.Success,
    timestamp: new Date(),
  };

  beforeEach(() => {
    manager = new RollRecordManager();
  });

  it("should initialize empty with default maxRecords", () => {
    expect(manager.length).toBe(0);
    expect(manager.maxRecordsCount).toBe(DEFAULT_MAX_RECORDS);
    expect(manager.full).toEqual([]);
    expect(manager.all).toEqual([]);
  });

  it("should add DieRollRecord correctly", () => {
    manager.add(dieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(dieRoll);
    expect(manager.all[0]).toEqual({ roll: dieRoll.roll });
  });

  it("should add ModifiedDieRollRecord correctly", () => {
    manager.add(modifiedDieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(modifiedDieRoll);
    expect(manager.all[0]).toEqual({
      roll: modifiedDieRoll.roll,
      modified: modifiedDieRoll.modified,
    });
  });

  it("should add TargetDieRollRecord correctly", () => {
    manager.add(targetDieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(targetDieRoll);
    expect(manager.all[0]).toEqual({
      roll: targetDieRoll.roll,
      outcome: targetDieRoll.outcome,
    });
  });

  it("should add ModifiedTestDieRollRecord correctly", () => {
    manager.add(modifiedTestDieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(modifiedTestDieRoll);
    expect(manager.all[0]).toEqual({
      roll: modifiedTestDieRoll.roll,
      modified: modifiedTestDieRoll.modified,
      outcome: modifiedTestDieRoll.outcome,
    });
  });

  it("should throw TypeError for invalid records", () => {
    // @ts-expect-error testing runtime validation
    expect(() => manager.add({})).toThrow(TypeError);
    // @ts-expect-error testing runtime validation
    expect(() => manager.add(null)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation
    expect(() => manager.add({ roll: 5, foo: "bar" })).toThrow(TypeError);
  });

  it("should maintain maxRecords correctly", () => {
    const smallManager = new RollRecordManager<DieRollRecord>(2);
    smallManager.add({ roll: 1, timestamp: new Date() });
    smallManager.add({ roll: 2, timestamp: new Date() });
    smallManager.add({ roll: 3, timestamp: new Date() }); // should push out oldest
    expect(smallManager.length).toBe(2);
    expect(smallManager.full.map((r) => r.roll)).toEqual([2, 3]);
  });

  it("should return last N records with last()", () => {
    manager.add(dieRoll);
    manager.add(modifiedDieRoll);
    manager.add(targetDieRoll);
    manager.add(modifiedTestDieRoll);

    const lastOne = manager.last();
    expect(lastOne).toEqual([
      {
        roll: modifiedTestDieRoll.roll,
        modified: modifiedTestDieRoll.modified,
        outcome: modifiedTestDieRoll.outcome,
      },
    ]);

    const lastTwo = manager.last(2);
    expect(lastTwo).toEqual([
      { roll: targetDieRoll.roll, outcome: targetDieRoll.outcome },
      {
        roll: modifiedTestDieRoll.roll,
        modified: modifiedTestDieRoll.modified,
        outcome: modifiedTestDieRoll.outcome,
      },
    ]);

    const verboseLastTwo = manager.last(2, true);
    expect(verboseLastTwo).toEqual([targetDieRoll, modifiedTestDieRoll]);
  });

  it("should report records with report()", () => {
    manager.add(dieRoll);
    manager.add(modifiedDieRoll);
    manager.add(targetDieRoll);

    expect(manager.report()).toEqual(manager.all);
    expect(manager.report({ verbose: true })).toEqual(manager.full);
    expect(manager.report({ limit: 2 })).toEqual(manager.all.slice(-2));
    expect(manager.report({ limit: 2, verbose: true })).toEqual(
      manager.full.slice(-2)
    );
  });

  it("should clear records with clear()", () => {
    manager.add(dieRoll);
    manager.clear();
    expect(manager.length).toBe(0);
    expect(manager.full).toEqual([]);
  });

  it("toString() should reflect last roll", () => {
    expect(manager.toString()).toContain("empty");

    manager.add(dieRoll);
    const str = manager.toString();
    expect(str).toContain("1/");
    expect(str).toContain(dieRoll.roll.toString());
    expect(str).toContain(dieRoll.timestamp.toISOString());
  });

  it("toJSON() should return full records", () => {
    manager.add(dieRoll);
    expect(manager.toJSON()).toEqual(manager.full);
  });
});
