import { describe, it, expect } from "vitest";
import RollRecordStorage from "@dice/components/history/roll-record-manager/internal/storage";
import type { DieRollRecord } from "@dice/components/history/roll-record-manager/internal/roll-record.types";

describe("RollRecordStorage", () => {
  it("evicts oldest when capacity exceeded", () => {
    const s = new RollRecordStorage<DieRollRecord>(2);
    s.add({ roll: 1, timestamp: new Date() });
    s.add({ roll: 2, timestamp: new Date() });
    s.add({ roll: 3, timestamp: new Date() });
    expect(s.size).toBe(2);
    expect(s.full.map((r) => r.roll)).toEqual([2, 3]);
  });

  it("last returns correct slice and order", () => {
    const s = new RollRecordStorage<DieRollRecord>(10);
    s.add({ roll: 1, timestamp: new Date() });
    s.add({ roll: 2, timestamp: new Date() });
    s.add({ roll: 3, timestamp: new Date() });
    s.add({ roll: 4, timestamp: new Date() });
    const last2 = s.last(2);
    expect(last2.map((r) => r.roll)).toEqual([3, 4]);
  });

  it("getters return array copies (mutating returned arrays doesn't affect storage)", () => {
    const s = new RollRecordStorage<DieRollRecord>(3);
    s.add({ roll: 1, timestamp: new Date() });
    const full = s.full;
    full.pop();
    expect(s.size).toBe(1);
    const last = s.last(1);
    // mutating the returned array should not affect internal storage length
    (last as DieRollRecord[]).pop();
    expect(s.size).toBe(1);
  });

  it("throws for invalid constructor args and parameters", () => {
    // call via any to test runtime throw without TS compile errors
    expect(() => new (RollRecordStorage as any)(0)).toThrow(TypeError);
    const s = new RollRecordStorage<DieRollRecord>(2);
    expect(() => (s.last as any)(0)).toThrow(TypeError);
    // pass null to add
    expect(() => (s.add as any)(null)).toThrow(TypeError);
  });
});
