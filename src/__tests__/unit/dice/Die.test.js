const { DieType, RollType, rollDie, Die } = require("../../../core");

// Mock rollDie to return predictable values
jest.mock("../../../core/utils/DiceUtils", () => ({
    rollDie: jest.fn(),
}));

describe("Die Class", () => {
    let die;

    beforeEach(() => {
        die = new Die(DieType.D6);
        rollDie.mockClear();
    });

    // ---------------------------------------------------------
    // Initialization
    // ---------------------------------------------------------
    describe("Initialization", () => {
        it("should throw an error if constructed with an invalid die type", () => {
            expect(() => new Die("d7")).toThrow("Invalid die type: d7");
            expect(() => new Die(null)).toThrow("Invalid die type: null");
            expect(() => new Die(42)).toThrow("Invalid die type: 42");
        });

        it("should initialize with the correct type and empty state", () => {
            expect(die.type).toBe(DieType.D6);
            expect(die.result).toBeNull();
            expect(die.history).toEqual([]);
            expect(die.history_full).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // Rolling
    // ---------------------------------------------------------
    describe("Rolling", () => {
        it("should roll the die and store the result", () => {
            rollDie.mockReturnValue(4);

            const result = die.roll();

            expect(result).toBe(4);
            expect(die.result).toBe(4);
            expect(die.history).toEqual([{ roll: 4 }]);
            expect(rollDie).toHaveBeenCalledWith(DieType.D6, null);
        });

        it("should throw an error if roll is called with an invalid roll type", () => {
            expect(() => die.roll("not_a_roll_type")).toThrow(
                "Invalid roll type: not_a_roll_type"
            );
            expect(() => die.roll(123)).toThrow("Invalid roll type: 123");
        });

        it("should roll with advantage", () => {
            rollDie.mockReturnValue(6);

            const result = die.roll(RollType.Advantage);

            expect(result).toBe(6);
            expect(die.history).toEqual([{ roll: 6 }]);
            expect(rollDie).toHaveBeenCalledWith(
                DieType.D6,
                RollType.Advantage
            );
        });

        it("should roll with disadvantage", () => {
            rollDie.mockReturnValue(2);

            const result = die.roll(RollType.Disadvantage);

            expect(result).toBe(2);
            expect(die.history).toEqual([{ roll: 2 }]);
            expect(rollDie).toHaveBeenCalledWith(
                DieType.D6,
                RollType.Disadvantage
            );
        });

        it("should allow multiple rolls and preserve history", () => {
            rollDie.mockReturnValueOnce(1).mockReturnValueOnce(6);

            die.roll();
            die.roll();

            expect(die.history).toEqual([{ roll: 1 }, { roll: 6 }]);
            expect(die.result).toBe(6);
        });
    });

    // ---------------------------------------------------------
    // Reset
    // ---------------------------------------------------------
    describe("Reset", () => {
        it("should reset only the result when called without arguments", () => {
            rollDie.mockReturnValueOnce(5);
            die.roll();

            die._reset();

            expect(die.result).toBeNull();
            expect(die.history).toEqual([{ roll: 5 }]); // history intact
        });

        it("should reset both result and history when complete = true", () => {
            rollDie.mockReturnValueOnce(5);
            die.roll();

            die._reset(true);

            expect(die.result).toBeNull();
            expect(die.history).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // Report
    // ---------------------------------------------------------
    describe("Report", () => {
        it("should return a concise report by default", () => {
            rollDie.mockReturnValueOnce(3);
            die.roll();

            expect(die.report()).toEqual({
                type: DieType.D6,
                latest_record: { roll: 3 },
                times_rolled: 1,
            });
        });

        it("should return a verbose report including history", () => {
            rollDie.mockReturnValueOnce(2).mockReturnValueOnce(5);
            die.roll();
            die.roll();

            const report = die.report({ verbose: true, includeHistory: true });

            expect(report.type).toBe(DieType.D6);
            expect(report.times_rolled).toBe(2);
            expect(report.latest_record).toHaveProperty("roll", 5);
            expect(report.history).toHaveLength(2);
            expect(report.history[0]).toHaveProperty("timestamp"); // verbose adds timestamp
        });

        it("should handle report when no rolls have been made", () => {
            expect(die.report()).toEqual({
                type: DieType.D6,
                latest_record: null,
                times_rolled: 0,
            });
        });
    });

    // ---------------------------------------------------------
    // toJSON
    // ---------------------------------------------------------
    describe("toJSON", () => {
        it("should return a JSON-friendly object with history", () => {
            rollDie.mockReturnValueOnce(4);
            die.roll();

            const json = die.toJSON();

            expect(json.type).toBe(DieType.D6);
            expect(json.times_rolled).toBe(1);
            expect(json.latest_record).toHaveProperty("roll", 4);
            expect(json.history).toBeDefined();
            expect(Array.isArray(json.history)).toBe(true);
        });

        it("should integrate with JSON.stringify correctly", () => {
            rollDie.mockReturnValueOnce(2);
            die.roll();

            const str = JSON.stringify(die, null, 2);

            expect(str).toContain(`"type": "${DieType.D6}"`);
            expect(str).toContain(`"roll": 2`);
        });
    });

    // ---------------------------------------------------------
    // toString
    // ---------------------------------------------------------
    describe("toString", () => {
        it("should show not rolled yet if no rolls", () => {
            expect(die.toString()).toBe("Die(d6): not rolled yet");
        });

        it("should show the latest record and count when rolled", () => {
            rollDie.mockReturnValueOnce(6);
            die.roll();

            const str = die.toString();
            expect(str).toContain("Die(d6): latest=");
            expect(str).toContain("total rolls=1");
        });
    });

    // ---------------------------------------------------------
    // History Tracking
    // ---------------------------------------------------------
    describe("History Tracking", () => {
        it("should return abridged history without timestamps", () => {
            rollDie.mockReturnValueOnce(3).mockReturnValueOnce(5);

            die.roll();
            die.roll();

            expect(die.history).toEqual([{ roll: 3 }, { roll: 5 }]);
        });

        it("should return full history with timestamps", () => {
            rollDie.mockReturnValueOnce(3);
            die.roll();

            const full = die.history_full;

            expect(full[0]).toHaveProperty("roll", 3);
            expect(full[0]).toHaveProperty("timestamp");
        });

        it("should return an empty array if no rolls", () => {
            expect(die.history).toEqual([]);
            expect(die.history_full).toEqual([]);
        });
    });
});
