/// <reference types="vitest" />

import { describe, it, expect, beforeEach } from "vitest";
import { HistoryCache } from "@dice/components/die-history";
import type { RollRecord } from "@dice/types";

type TestRecord = RollRecord & {
  roll: number;
  timestamp: Date;
};

describe("RollHistoryCache", () => {
  let cache: HistoryCache<TestRecord>;

  beforeEach(() => {
    cache = new HistoryCache<TestRecord>({
      maxRecordsPerKey: 3,
      maxKeys: 2,
    });
  });

  it("starts empty", () => {
    expect(cache.activeManager).toBeUndefined();
    expect(cache.getAll()).toEqual([]);
  });

  it("throws if add called before setting active key", () => {
    expect(() => cache.add({ roll: 1, timestamp: new Date() })).toThrow(
      /No active history key set/
    );
  });

  it("creates and sets an active key", () => {
    cache.setActiveKey("first");
    expect(cache.activeManager).toBeDefined();
    expect(cache.getAll()).toEqual([]);
  });

  it("adds records to the active key", () => {
    cache.setActiveKey("key1");
    const record = { roll: 5, timestamp: new Date() };
    cache.add(record);

    const all = cache.getAll(true) as TestRecord[];
    expect(all.length).toBe(1);
    expect(all[0].roll).toBe(5);
  });

  it("respects maxRecordsPerKey", () => {
    cache.setActiveKey("key1");
    const now = new Date();
    for (let i = 1; i <= 5; i++) {
      cache.add({ roll: i, timestamp: new Date(now.getTime() + i) });
    }
    const all = cache.getAll(true) as TestRecord[];
    expect(all.length).toBe(3); // capped
    expect(all[0].roll).toBe(3); // oldest removed
    expect(all[2].roll).toBe(5);
  });

  it("switching keys creates independent histories", () => {
    cache.setActiveKey("A");
    cache.add({ roll: 1, timestamp: new Date() });
    cache.setActiveKey("B");
    cache.add({ roll: 2, timestamp: new Date() });

    cache.setActiveKey("A");
    expect((cache.getAll(true) as TestRecord[])[0].roll).toBe(1);

    cache.setActiveKey("B");
    expect((cache.getAll(true) as TestRecord[])[0].roll).toBe(2);
  });

  it("evicts oldest key when maxKeys exceeded", () => {
    cache.setActiveKey("K1");
    cache.add({ roll: 1, timestamp: new Date() });

    cache.setActiveKey("K2");
    cache.add({ roll: 2, timestamp: new Date() });

    // Max keys = 2, next key should evict K1
    cache.setActiveKey("K3");
    cache.add({ roll: 3, timestamp: new Date() });

    const report = cache.report({ verbose: true });

    expect(Object.keys(report)).not.toContain("K1");
    expect(Object.keys(report)).toContain("K2");
    expect(Object.keys(report)).toContain("K3");
  });

  it("clearActive clears only the active key", () => {
    cache.setActiveKey("A");
    cache.add({ roll: 1, timestamp: new Date() });
    cache.setActiveKey("B");
    cache.add({ roll: 2, timestamp: new Date() });

    cache.setActiveKey("A");
    cache.clearActive();
    expect(cache.getAll(true)).toEqual([]);

    cache.setActiveKey("B");
    expect((cache.getAll(true) as TestRecord[]).length).toBe(1);
  });

  it("clearAll clears everything", () => {
    cache.setActiveKey("X");
    cache.add({ roll: 1, timestamp: new Date() });
    cache.setActiveKey("Y");
    cache.add({ roll: 2, timestamp: new Date() });

    cache.clearAll();
    expect(cache.getAll()).toEqual([]);
    expect(Object.keys(cache.report())).toEqual([]);
  });

  it("report returns correct verbose and non-verbose data", () => {
    cache.setActiveKey("R1");
    cache.add({ roll: 10, timestamp: new Date() });

    const reportsVerbose = cache.report({ verbose: true });
    const reportsNonVerbose = cache.report({ verbose: false });

    expect(reportsVerbose["R1"][0]).toHaveProperty("timestamp");
    expect(reportsNonVerbose["R1"][0]).not.toHaveProperty("timestamp");
  });

  it("toString returns a readable summary", () => {
    cache.setActiveKey("Active");
    expect(cache.toString()).toMatch(/HistoryCache: 1 keys \(active: Active\)/);
  });

  it("toJSON returns object with arrays of RollRecords", () => {
    cache.setActiveKey("J");
    const record = { roll: 7, timestamp: new Date() };
    cache.add(record);

    const json = cache.toJSON();
    expect(json).toHaveProperty("J");
    expect(json["J"][0].roll).toBe(7);
  });
});
