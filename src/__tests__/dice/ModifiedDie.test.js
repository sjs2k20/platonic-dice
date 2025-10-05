const { DieType, RollType, ModifiedDie } = require("../../core");

// Mock rollModDie to return deterministic values
jest.mock("../../core/DiceUtils", () => ({
    rollModDie: jest.fn(),
}));
const { rollModDie } = require("../../core/DiceUtils");

describe("ModifiedDie", () => {
    let modifiedDie;
    const mockModifier = (n) => n + 2;

    beforeEach(() => {
        modifiedDie = new ModifiedDie(DieType.D6, mockModifier);
        rollModDie.mockClear();
    });

    // --- Initialization ---
    describe("Initialization", () => {
        it("throws if modifier is not a function", () => {
            expect(() => new ModifiedDie(DieType.D6, null)).toThrow(
                "Modifier must be a function."
            );
            expect(() => new ModifiedDie(DieType.D6, 42)).toThrow(
                "Modifier must be a function."
            );
        });

        it("initializes with correct defaults", () => {
            expect(modifiedDie.type).toBe("Modified_d6");
            expect(modifiedDie.result).toBeNull();
            expect(modifiedDie.history).toEqual([]);
            expect(modifiedDie.historyDetailed()).toEqual([]);
        });
    });

    // --- Rolling Behaviour ---
    describe("Rolling", () => {
        it("throws if rollType is invalid", () => {
            expect(() => modifiedDie.roll("invalid")).toThrow(
                "Invalid roll type: invalid"
            );
        });

        it("rolls and records a modified result", () => {
            rollModDie.mockReturnValue({ base: 4, modified: 6 });

            const result = modifiedDie.roll();
            expect(result).toBe(6);

            const history = modifiedDie.historyDetailed({ verbose: true });
            expect(history).toHaveLength(1);
            expect(history[0]).toMatchObject({ roll: 4, modified: 6 });
            expect(typeof history[0].timestamp).toBe("object");

            expect(rollModDie).toHaveBeenCalledWith(
                DieType.D6,
                mockModifier,
                null
            );
        });

        it("supports advantage and disadvantage rolls", () => {
            rollModDie.mockReturnValueOnce({ base: 5, modified: 7 });
            const adv = modifiedDie.roll(RollType.Advantage);
            expect(adv).toBe(7);

            rollModDie.mockReturnValueOnce({ base: 2, modified: 4 });
            const disadv = modifiedDie.roll(RollType.Disadvantage);
            expect(disadv).toBe(4);

            expect(rollModDie).toHaveBeenNthCalledWith(
                1,
                DieType.D6,
                mockModifier,
                RollType.Advantage
            );
            expect(rollModDie).toHaveBeenNthCalledWith(
                2,
                DieType.D6,
                mockModifier,
                RollType.Disadvantage
            );
        });

        it("preserves modifier-specific histories", () => {
            rollModDie.mockReturnValue({ base: 3, modified: 5 });
            modifiedDie.roll();

            const mod2 = (n) => n * 2;
            modifiedDie.modifier = mod2;
            expect(modifiedDie.history).toEqual([]);

            rollModDie.mockReturnValue({ base: 2, modified: 4 });
            modifiedDie.roll();

            // Each modifier has its own independent roll history
            expect(Object.keys(modifiedDie.reportAll())).toHaveLength(2);
            const reports = modifiedDie.reportAll();
            expect(reports[mockModifier.toString()]).toHaveLength(1);
            expect(reports[mod2.toString()]).toHaveLength(1);
        });
    });

    // --- Modifier Handling ---
    describe("Modifier Handling", () => {
        it("resets result but keeps other histories when modifier changes", () => {
            rollModDie.mockReturnValue({ base: 3, modified: 5 });
            modifiedDie.roll();
            expect(modifiedDie.result).toBe(5);

            const newMod = (n) => n * 3;
            modifiedDie.modifier = newMod;

            expect(modifiedDie.result).toBeNull();
            expect(modifiedDie.history).toEqual([]);
            expect(Object.keys(modifiedDie.reportAll())).toContain(
                mockModifier.toString()
            );
        });

        it("uses new modifier for subsequent rolls", () => {
            const newMod = (n) => n - 1;
            modifiedDie.modifier = newMod;
            rollModDie.mockReturnValue({ base: 6, modified: 5 });

            const result = modifiedDie.roll();
            expect(result).toBe(5);

            const history = modifiedDie.historyDetailed({ verbose: true });
            expect(history[0]).toMatchObject({ roll: 6, modified: 5 });
            expect(rollModDie).toHaveBeenCalledWith(DieType.D6, newMod, null);
        });
    });

    // --- Reporting ---
    describe("Reporting", () => {
        beforeEach(() => {
            rollModDie.mockReturnValue({ base: 4, modified: 6 });
        });

        it("generates report without history by default", () => {
            modifiedDie.roll();
            const report = modifiedDie.report();

            expect(report).toMatchObject({
                type: "Modified_d6",
                times_rolled: 1,
                latest_record: expect.objectContaining({
                    roll: 4,
                    modified: 6,
                }),
                modifier: expect.any(String),
            });
            expect(report.history).toBeUndefined();
        });

        it("includes history when includeHistory=true", () => {
            rollModDie.mockReturnValueOnce({ base: 3, modified: 5 });
            modifiedDie.roll();
            rollModDie.mockReturnValueOnce({ base: 6, modified: 8 });
            modifiedDie.roll();

            const report = modifiedDie.report({ includeHistory: true });
            expect(report.history).toHaveLength(2);
            expect(report.history[0]).toMatchObject({ roll: 3, modified: 5 });
            expect(report.history[1]).toMatchObject({ roll: 6, modified: 8 });
        });

        it("respects history limit", () => {
            rollModDie.mockReturnValue({ base: 1, modified: 2 });
            modifiedDie.roll();
            modifiedDie.roll();
            modifiedDie.roll();

            const report = modifiedDie.report({
                includeHistory: true,
                limit: 2,
            });
            expect(report.history).toHaveLength(2);
        });

        it("includes modifier string in report", () => {
            modifiedDie.roll();
            const report = modifiedDie.report();
            expect(report.modifier).toContain("n");
            expect(report.modifier).toContain("+ 2");
        });

        it("reportAll aggregates all modifier histories", () => {
            rollModDie.mockReturnValue({ base: 3, modified: 5 });
            modifiedDie.roll();
            const mod2 = (n) => n * 2;
            modifiedDie.modifier = mod2;
            rollModDie.mockReturnValue({ base: 2, modified: 4 });
            modifiedDie.roll();

            const reportAll = modifiedDie.reportAll();
            expect(Object.keys(reportAll)).toHaveLength(2);
            expect(Object.values(reportAll).flat().length).toBe(2);
        });
    });

    // --- History Management ---
    describe("History Management", () => {
        it("can clear all histories", () => {
            rollModDie.mockReturnValue({ base: 5, modified: 7 });
            modifiedDie.roll();

            const mod2 = (n) => n * 2;
            modifiedDie.modifier = mod2;
            rollModDie.mockReturnValue({ base: 2, modified: 4 });
            modifiedDie.roll();

            expect(Object.keys(modifiedDie.reportAll())).toHaveLength(2);
            modifiedDie.clearAllHistories();
            expect(modifiedDie.reportAll()).toEqual({});
        });
    });

    // --- String & JSON Output ---
    describe("Output Methods", () => {
        it("returns readable string summary", () => {
            rollModDie.mockReturnValue({ base: 2, modified: 4 });
            modifiedDie.roll();
            const str = modifiedDie.toString();
            expect(str).toContain("Modified_d6");
            expect(str).toContain("modifier=");
        });

        it("returns correct JSON structure matching ModifiedDieReport", () => {
            rollModDie.mockReturnValue({ base: 5, modified: 7 });
            modifiedDie.roll();
            const json = modifiedDie.toJSON();

            expect(json).toHaveProperty("type", "Modified_d6");
            expect(json).toHaveProperty("modifier");
            expect(json).toHaveProperty("times_rolled", 1);
            expect(json).toHaveProperty("latest_record");
            expect(json.latest_record).toMatchObject({ roll: 5, modified: 7 });
            expect(json).toHaveProperty("history");
            expect(json.history[0]).toMatchObject({ roll: 5, modified: 7 });
            expect(json).toHaveProperty("rolls");
            expect(typeof json.rolls).toBe("object");
        });
    });
});
