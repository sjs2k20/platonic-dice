const { Outcome, RollRecordManager } = require("../../../core");

/**
 * @typedef {import("../../../core/Types").RollRecord} RollRecord
 * @typedef {import("../../../core/Types").ModifiedDieRollRecord} ModifiedDieRollRecord
 */

describe("RollRecordManager", () => {
    let manager;
    let baseDate;

    beforeEach(() => {
        manager = new RollRecordManager();
        baseDate = new Date("2023-01-01T00:00:00.000Z");
    });

    // Utility builders
    const makeDieRecord = (roll = 4, timestamp = baseDate) => ({
        roll,
        timestamp,
    });

    const makeModifiedDieRecord = (
        roll = 5,
        modified = 7,
        timestamp = baseDate
    ) => ({
        roll,
        modified,
        timestamp,
    });

    const makeTargetDieRecord = (
        roll = 3,
        outcome = Outcome.Success,
        timestamp = baseDate
    ) => ({
        roll,
        outcome,
        timestamp,
    });

    // ---------------------------------------------------------
    // Initialization
    // ---------------------------------------------------------
    describe("Initialization", () => {
        it("should start with empty records", () => {
            expect(manager.full).toEqual([]);
            expect(manager.all).toEqual([]);
            expect(manager.length).toBe(0);
        });
    });

    // ---------------------------------------------------------
    // Adding Records
    // ---------------------------------------------------------
    describe("add()", () => {
        it("should add a valid DieRollRecord", () => {
            const record = makeDieRecord();
            manager.add(record);

            expect(manager.length).toBe(1);
            expect(manager.full[0]).toBe(record);
        });

        it("should add a valid ModifiedDieRollRecord", () => {
            const record = makeModifiedDieRecord();
            manager.add(record);

            expect(manager.length).toBe(1);
            expect(manager.full[0]).toBe(record);
        });

        it("should add a valid TargetDieRollRecord", () => {
            const record = makeTargetDieRecord();
            manager.add(record);

            expect(manager.length).toBe(1);
            expect(manager.full[0]).toBe(record);
        });

        it("should throw if given null/undefined", () => {
            expect(() => manager.add(null)).toThrow(TypeError);
            expect(() => manager.add(undefined)).toThrow(TypeError);
        });

        it("should throw if given an invalid object", () => {
            expect(() => manager.add({ foo: "bar" })).toThrow(TypeError);
        });
    });

    // ---------------------------------------------------------
    // Accessors
    // ---------------------------------------------------------
    describe("Accessors", () => {
        beforeEach(() => {
            manager.add(makeDieRecord(1));
            manager.add(makeDieRecord(2));
        });

        it("full should return a shallow copy of records", () => {
            const copy = manager.full;
            expect(copy).toEqual(manager._records);
            expect(copy).not.toBe(manager._records);
        });

        it("all should strip timestamps", () => {
            const records = manager.all;
            expect(records[0]).toEqual({ roll: 1 });
            expect(records[1]).toEqual({ roll: 2 });
        });

        it("length should reflect record count", () => {
            expect(manager.length).toBe(2);
        });
    });

    // ---------------------------------------------------------
    // last()
    // ---------------------------------------------------------
    describe("last()", () => {
        beforeEach(() => {
            manager.add(makeDieRecord(1));
            manager.add(makeDieRecord(2));
            manager.add(makeDieRecord(3));
        });

        it("should return the last record by default", () => {
            const last = manager.last();
            expect(last).toEqual({ roll: 3 });
        });

        it("should return verbose record when requested", () => {
            const last = manager.last(1, true);
            expect(last).toHaveProperty("timestamp");
            expect(last.roll).toBe(3);
        });

        it("should return last N records", () => {
            const last2 = manager.last(2);
            expect(last2).toEqual([{ roll: 2 }, { roll: 3 }]);
        });

        it("should return all records if n >= length", () => {
            const all = manager.last(10);
            expect(all).toEqual([{ roll: 1 }, { roll: 2 }, { roll: 3 }]);
        });

        it("should return null if no records", () => {
            manager.clear();
            expect(manager.last()).toBeNull();
        });

        it("should throw if n is invalid", () => {
            expect(() => manager.last(0)).toThrow(TypeError);
            expect(() => manager.last(-1)).toThrow(TypeError);
        });
    });

    // ---------------------------------------------------------
    // report()
    // ---------------------------------------------------------
    describe("report()", () => {
        beforeEach(() => {
            manager.add(makeDieRecord(1));
            manager.add(makeDieRecord(2));
            manager.add(makeDieRecord(3));
        });

        it("should return all records if no options", () => {
            const report = manager.report();
            expect(report).toEqual([{ roll: 1 }, { roll: 2 }, { roll: 3 }]);
        });

        it("should return limited records", () => {
            const report = manager.report({ limit: 2 });
            expect(report).toEqual([{ roll: 2 }, { roll: 3 }]);
        });

        it("should return single record in array if limit=1", () => {
            const report = manager.report({ limit: 1 });
            expect(Array.isArray(report)).toBe(true);
            expect(report).toEqual([{ roll: 3 }]);
        });

        it("should return verbose records", () => {
            const report = manager.report({ verbose: true });
            expect(report[0]).toHaveProperty("timestamp");
        });

        it("should handle empty history gracefully", () => {
            manager.clear();
            expect(manager.report()).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // clear()
    // ---------------------------------------------------------
    describe("clear()", () => {
        it("should remove all records", () => {
            manager.add(makeDieRecord());
            manager.clear();
            expect(manager.length).toBe(0);
            expect(manager.full).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // toString()
    // ---------------------------------------------------------
    describe("toString()", () => {
        it("should return 'empty' message if no records", () => {
            expect(manager.toString()).toBe(
                "RollRecordManager: empty " +
                    `(maxRecords=${manager._maxRecords})`
            );
        });

        it("should include record count and last roll when not empty", () => {
            const record = makeDieRecord(7);
            manager.add(record);

            const str = manager.toString();
            expect(str).toContain(
                "RollRecordManager: " + `1/${manager._maxRecords} rolls`
            );
            expect(str).toContain("last: 7");
            expect(str).toContain(record.timestamp.toISOString());
        });
    });

    // ---------------------------------------------------------
    // toJSON()
    // ---------------------------------------------------------
    describe("toJSON()", () => {
        it("should return full history", () => {
            const record1 = makeDieRecord(1);
            const record2 = makeModifiedDieRecord(2, 3);
            manager.add(record1);
            manager.add(record2);

            const json = manager.toJSON();
            expect(json).toEqual([record1, record2]);
        });

        it("should integrate with JSON.stringify", () => {
            const record = makeDieRecord(6);
            manager.add(record);

            const str = JSON.stringify(manager);
            expect(str).toContain('"roll":6');
        });
    });
});
