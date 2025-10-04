const { RollHistoryCache } = require("../../core/utils/RollHistoryCache");
const {
    RollRecordManager,
    DEFAULT_MAX_RECORDS,
} = require("../../core/utils/RollRecordManager");

describe("RollHistoryCache", () => {
    let cache;
    let baseDate;

    beforeEach(() => {
        cache = new RollHistoryCache();
        baseDate = new Date("2023-01-01T00:00:00.000Z");
    });

    // ---------------------------------------------------------
    // Utility builders
    // ---------------------------------------------------------
    const makeRecord = (roll = 1, timestamp = baseDate) => ({
        roll,
        timestamp,
    });

    // ---------------------------------------------------------
    // Initialization
    // ---------------------------------------------------------
    describe("Initialization", () => {
        it("should start empty with no active key", () => {
            expect(cache.activeManager).toBeNull();
            expect(cache.toJSON()).toEqual({});
            expect(cache.toString()).toContain("0 keys");
        });
    });

    // ---------------------------------------------------------
    // setActiveKey()
    // ---------------------------------------------------------
    describe("setActiveKey()", () => {
        it("should throw if key is not a string", () => {
            expect(() => cache.setActiveKey(123)).toThrow(TypeError);
            expect(() => cache.setActiveKey(null)).toThrow(TypeError);
        });

        it("should create a new RollRecordManager for new keys", () => {
            cache.setActiveKey("key1");
            expect(cache.activeManager).toBeInstanceOf(RollRecordManager);
        });

        it("should switch active key if already exists", () => {
            cache.setActiveKey("key1");
            const manager1 = cache.activeManager;
            cache.setActiveKey("key2");
            const manager2 = cache.activeManager;
            expect(manager2).not.toBe(manager1);
            cache.setActiveKey("key1");
            expect(cache.activeManager).toBe(manager1);
        });

        it("should evict oldest key when maxKeys is exceeded", () => {
            const limitedCache = new RollHistoryCache({ maxKeys: 2 });
            limitedCache.setActiveKey("a");
            limitedCache.setActiveKey("b");
            limitedCache.setActiveKey("c"); // "a" should be evicted
            expect(Object.keys(limitedCache.toJSON())).toEqual(["b", "c"]);
        });
    });

    // ---------------------------------------------------------
    // add() and getAll()
    // ---------------------------------------------------------
    describe("add() and getAll()", () => {
        beforeEach(() => {
            cache.setActiveKey("active");
        });

        it("should throw if no active key set", () => {
            const emptyCache = new RollHistoryCache();
            expect(() => emptyCache.add(makeRecord())).toThrow();
        });

        it("should add records to active manager", () => {
            const record = makeRecord(5);
            cache.add(record);
            expect(cache.getAll()).toEqual([{ roll: 5 }]);
            expect(cache.getAll(true)).toEqual([record]);
        });

        it("should maintain independent histories per key", () => {
            cache.add(makeRecord(1));
            cache.setActiveKey("key2");
            cache.add(makeRecord(2));
            cache.setActiveKey("active");
            expect(cache.getAll()).toEqual([{ roll: 1 }]);
            cache.setActiveKey("key2");
            expect(cache.getAll()).toEqual([{ roll: 2 }]);
        });
    });

    // ---------------------------------------------------------
    // clearActive() and clearAll()
    // ---------------------------------------------------------
    describe("clearActive() and clearAll()", () => {
        beforeEach(() => {
            cache.setActiveKey("a");
            cache.add(makeRecord(1));
            cache.setActiveKey("b");
            cache.add(makeRecord(2));
        });

        it("should clear only active key", () => {
            cache.setActiveKey("a");
            cache.clearActive();
            expect(cache.getAll()).toEqual([]);
            cache.setActiveKey("b");
            expect(cache.getAll()).toEqual([{ roll: 2 }]);
        });

        it("should clear all keys and reset active", () => {
            cache.clearAll();
            expect(cache.activeManager).toBeNull();
            expect(cache.toJSON()).toEqual({});
        });
    });

    // ---------------------------------------------------------
    // report()
    // ---------------------------------------------------------
    describe("report()", () => {
        beforeEach(() => {
            cache.setActiveKey("x");
            cache.add(makeRecord(1));
            cache.setActiveKey("y");
            cache.add(makeRecord(2));
        });

        it("should return all records for all keys", () => {
            const report = cache.report();
            expect(report.x).toEqual([{ roll: 1 }]);
            expect(report.y).toEqual([{ roll: 2 }]);
        });

        it("should limit records per key", () => {
            cache.setActiveKey("x");
            cache.add(makeRecord(3));
            const report = cache.report({ limit: 1 });
            expect(report.x).toEqual([{ roll: 3 }]);
        });

        it("should return verbose records", () => {
            const report = cache.report({ verbose: true });
            expect(report.x[0]).toHaveProperty("timestamp");
            expect(report.y[0]).toHaveProperty("timestamp");
        });
    });

    // ---------------------------------------------------------
    // toString() and toJSON()
    // ---------------------------------------------------------
    describe("toString() and toJSON()", () => {
        it("toString should summarize keys and active", () => {
            cache.setActiveKey("key1");
            expect(cache.toString()).toContain("1 keys");
            expect(cache.toString()).toContain("active: key1");
        });

        it("toJSON should return full record structure", () => {
            cache.setActiveKey("key1");
            const record = makeRecord(9);
            cache.add(record);
            const json = cache.toJSON();
            expect(json.key1).toEqual([record]);
        });
    });
});
