import { Outcome } from "@platonic-dice/core";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TargetDieRollRecord,
} from "../../../src/components/HistoryManagement/RollRecord.types";
import {
  DEFAULT_MAX_RECORDS,
  RollRecordManager,
} from "../../../src/components/HistoryManagement/RollRecordManager";

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

  const targetDieRoll: TargetDieRollRecord = {
    roll: 20,
    outcome: Outcome.Success,
    timestamp: new Date(),
  };

  beforeEach(() => {
    manager = new RollRecordManager();
  });

  test("should initialize empty with default maxRecords", () => {
    expect(manager.length).toBe(0);
    expect(manager.maxRecordsCount).toBe(DEFAULT_MAX_RECORDS);
    expect(manager.full).toEqual([]);
    expect(manager.all).toEqual([]);
  });

  test("should add DieRollRecord correctly", () => {
    manager.add(dieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(dieRoll);
    expect(manager.all[0]).toEqual({ roll: dieRoll.roll });
  });

  test("should add ModifiedDieRollRecord correctly", () => {
    manager.add(modifiedDieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(modifiedDieRoll);
    expect(manager.all[0]).toEqual({
      roll: modifiedDieRoll.roll,
      modified: modifiedDieRoll.modified,
    });
  });

  test("should add TargetDieRollRecord correctly", () => {
    manager.add(targetDieRoll);
    expect(manager.length).toBe(1);
    expect(manager.full[0]).toEqual(targetDieRoll);
    expect(manager.all[0]).toEqual({
      roll: targetDieRoll.roll,
      outcome: targetDieRoll.outcome,
    });
  });

  test("should throw TypeError for invalid records", () => {
    // @ts-expect-error testing runtime validation
    expect(() => manager.add({})).toThrow(TypeError);
    // @ts-expect-error testing runtime validation
    expect(() => manager.add(null)).toThrow(TypeError);
    // @ts-expect-error testing runtime validation
    expect(() => manager.add({ roll: 5, foo: "bar" })).toThrow(TypeError);
  });

  test("should maintain maxRecords correctly", () => {
    const smallManager = new RollRecordManager<DieRollRecord>(2);
    smallManager.add({ roll: 1, timestamp: new Date() });
    smallManager.add({ roll: 2, timestamp: new Date() });
    smallManager.add({ roll: 3, timestamp: new Date() }); // should push out oldest
    expect(smallManager.length).toBe(2);
    expect(smallManager.full.map((r) => r.roll)).toEqual([2, 3]);
  });

  test("should return last N records with last()", () => {
    manager.add(dieRoll);
    manager.add(modifiedDieRoll);
    manager.add(targetDieRoll);

    const lastOne = manager.last();
    expect(lastOne).toEqual([
      { roll: targetDieRoll.roll, outcome: targetDieRoll.outcome },
    ]);

    const lastTwo = manager.last(2);
    expect(lastTwo).toEqual([
      { roll: modifiedDieRoll.roll, modified: modifiedDieRoll.modified },
      { roll: targetDieRoll.roll, outcome: targetDieRoll.outcome },
    ]);

    const verboseLastTwo = manager.last(2, true);
    expect(verboseLastTwo).toEqual([modifiedDieRoll, targetDieRoll]);
  });

  test("should report records with report()", () => {
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

  test("should clear records with clear()", () => {
    manager.add(dieRoll);
    manager.clear();
    expect(manager.length).toBe(0);
    expect(manager.full).toEqual([]);
  });

  test("toString() should reflect last roll", () => {
    expect(manager.toString()).toContain("empty");

    manager.add(dieRoll);
    const str = manager.toString();
    expect(str).toContain("1/");
    expect(str).toContain(dieRoll.roll.toString());
    expect(str).toContain(dieRoll.timestamp.toISOString());
  });

  test("toJSON() should return full records", () => {
    manager.add(dieRoll);
    expect(manager.toJSON()).toEqual(manager.full);
  });
});
