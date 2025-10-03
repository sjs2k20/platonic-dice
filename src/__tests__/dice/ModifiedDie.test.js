const { DieType, RollType, ModifiedDie } = require("../../core");

// Mock rollModDie to return predictable values
jest.mock("../../core/DiceUtils", () => ({
    rollModDie: jest.fn(),
}));
const { rollModDie } = require("../../core/DiceUtils");

describe("ModifiedDie Class", () => {
    let modifiedDie;
    const mockModifier = (n) => n + 2;

    beforeEach(() => {
        modifiedDie = new ModifiedDie(DieType.D6, mockModifier);
        rollModDie.mockClear();
    });

    // --- Initialization ---
    describe("Initialization", () => {
        it("should throw if modifier is not a function", () => {
            expect(() => new ModifiedDie(DieType.D6, null)).toThrow(
                "Modifier must be a function."
            );
            expect(() => new ModifiedDie(DieType.D6, 123)).toThrow(
                "Modifier must be a function."
            );
        });

        it("should initialize with correct type and state", () => {
            expect(modifiedDie.type).toBe("Modified_d6");
            expect(modifiedDie.result).toBeNull();
            expect(modifiedDie.history).toEqual([]);
            expect(modifiedDie.history_full).toEqual([]);
        });
    });

    // --- Rolling ---
    describe("Rolling", () => {
        it("should throw if rollType is invalid", () => {
            expect(() => modifiedDie.roll("foo")).toThrow(
                "Invalid roll type: foo"
            );
        });

        it("should roll and record a ModifiedDieRollRecord", () => {
            rollModDie.mockReturnValue({ base: 4, modified: 6 });

            const result = modifiedDie.roll();

            expect(result).toBe(6);
            const history = modifiedDie.historyDetailed({ verbose: true });
            expect(history[0]).toMatchObject({ roll: 4, modified: 6 });
            expect(rollModDie).toHaveBeenCalledWith(
                DieType.D6,
                mockModifier,
                null
            );
        });

        it("should support advantage rolls", () => {
            rollModDie.mockReturnValue({ base: 5, modified: 7 });

            const result = modifiedDie.roll(RollType.Advantage);

            expect(result).toBe(7);
            const latest = modifiedDie.historyDetailed({ verbose: true })[0];
            expect(latest).toMatchObject({ roll: 5, modified: 7 });
            expect(rollModDie).toHaveBeenCalledWith(
                DieType.D6,
                mockModifier,
                RollType.Advantage
            );
        });

        it("should support disadvantage rolls", () => {
            rollModDie.mockReturnValue({ base: 2, modified: 4 });

            const result = modifiedDie.roll(RollType.Disadvantage);

            expect(result).toBe(4);
            const latest = modifiedDie.historyDetailed({ verbose: true })[0];
            expect(latest).toMatchObject({ roll: 2, modified: 4 });
        });
    });

    // --- Modifier Handling ---
    describe("Modifier Handling", () => {
        it("should reset state when modifier is changed", () => {
            rollModDie.mockReturnValue({ base: 3, modified: 5 });
            modifiedDie.roll();

            const newModifier = (n) => n * 2;
            modifiedDie.modifier = newModifier;

            expect(modifiedDie.result).toBeNull();
            expect(modifiedDie.history).toEqual([]);
        });

        it("should use the new modifier for subsequent rolls", () => {
            const newModifier = (n) => n * 2;
            modifiedDie.modifier = newModifier;

            rollModDie.mockReturnValue({ base: 3, modified: 6 });
            const result = modifiedDie.roll();

            expect(result).toBe(6);
            const latest = modifiedDie.historyDetailed({ verbose: true })[0];
            expect(latest).toMatchObject({ roll: 3, modified: 6 });
            expect(rollModDie).toHaveBeenCalledWith(
                DieType.D6,
                newModifier,
                null
            );
        });
    });

    // --- Reporting ---
    describe("Report", () => {
        it("should generate a report without history by default", () => {
            rollModDie.mockReturnValue({ base: 4, modified: 6 });
            modifiedDie.roll();

            const report = modifiedDie.report();
            expect(report).toMatchObject({
                type: "Modified_d6",
                last_result: 6,
                times_rolled: 1,
                latest_record: expect.objectContaining({
                    roll: 4,
                    modified: 6,
                }),
            });
            expect(report.history).toBeUndefined();
        });

        it("should include history when includeHistory=true", () => {
            rollModDie.mockReturnValueOnce({ base: 3, modified: 5 });
            modifiedDie.roll();
            rollModDie.mockReturnValueOnce({ base: 6, modified: 8 });
            modifiedDie.roll();

            const report = modifiedDie.report({ includeHistory: true });

            expect(report.history.length).toBe(2);
            expect(report.history[0]).toMatchObject({ roll: 3, modified: 5 });
            expect(report.history[1]).toMatchObject({ roll: 6, modified: 8 });
        });

        it("should respect limit in report options", () => {
            rollModDie.mockReturnValue({ base: 1, modified: 2 });
            modifiedDie.roll();
            modifiedDie.roll();
            modifiedDie.roll();

            const report = modifiedDie.report({
                includeHistory: true,
                limit: 2,
            });
            expect(report.history.length).toBe(2);
        });

        it("should include the modifier string in reports", () => {
            rollModDie.mockReturnValue({ base: 4, modified: 6 });
            modifiedDie.roll();

            const report = modifiedDie.report();
            expect(report.modifier).toContain("n"); // loose check
            expect(report.modifier).toContain("+ 2");
        });
    });

    // --- toString ---
    describe("toString", () => {
        it("should mention the modifier function", () => {
            rollModDie.mockReturnValue({ base: 2, modified: 4 });
            modifiedDie.roll();
            const str = modifiedDie.toString();
            expect(str).toContain("modifier=");
            expect(str).toContain("+ 2");
        });
    });

    // --- toJSON ---
    describe("toJSON", () => {
        it("should return full report with history", () => {
            rollModDie.mockReturnValue({ base: 5, modified: 7 });
            modifiedDie.roll();
            const json = modifiedDie.toJSON();
            expect(json).toHaveProperty("type", "Modified_d6");
            expect(json).toHaveProperty("history");
            expect(json.history[0]).toMatchObject({ roll: 5, modified: 7 });
        });
    });
});
