const { DieType, rollDie, CustomDie } = require("../../core");

// Mock rollDie to return predictable values
jest.mock("../../core/DiceUtils", () => ({
    rollDie: jest.fn(),
}));

describe("CustomDie Class", () => {
    let customDie;
    const faceMappings = [
        { face: 1, result: "Gain 10 Gold" },
        { face: 2, result: "Lose 5 Gold" },
        { face: 3, result: "Extra Turn" },
    ];
    const defaultOutcome = "No effect";

    beforeEach(() => {
        customDie = new CustomDie(DieType.D6, faceMappings, defaultOutcome);
        rollDie.mockClear(); // Reset mock before each test
    });

    // Initialization tests
    describe("Initialization", () => {
        it("should initialize with correct type and mappings", () => {
            expect(customDie.type).toBe("Custom_d6");
            expect(customDie.faceMappings).toEqual(
                expect.arrayContaining(faceMappings)
            );
            expect(customDie.getOutcomeHistory()).toEqual([]);
        });

        it("should throw if faceMappings is not an array", () => {
            expect(() => new CustomDie(DieType.D6, {}, defaultOutcome)).toThrow(
                "faceMappings must be an array of DieFaceMapping objects."
            );
        });

        it("should throw on invalid face values", () => {
            const badMappings = [{ face: 7, result: "Oops" }]; // outside d6 range
            expect(() => new CustomDie(DieType.D6, badMappings)).toThrow(
                "Invalid face value in faceMappings[0]: 7. Must be between 1 and 6."
            );
        });

        it("should throw on duplicate face values", () => {
            const dupMappings = [
                { face: 1, result: "Gold" },
                { face: 1, result: "More Gold" },
            ];
            expect(() => new CustomDie(DieType.D6, dupMappings)).toThrow(
                "Duplicate mapping found for face 1."
            );
        });

        it("should throw on invalid result type", () => {
            const badMappings = [{ face: 1, result: {} }];
            expect(() => new CustomDie(DieType.D6, badMappings)).toThrow(
                "Invalid result for face 1. Must be number, string, or function(number): number."
            );
        });

        it("should throw on invalid default outcome", () => {
            expect(() => new CustomDie(DieType.D6, faceMappings, {})).toThrow(
                "defaultOutcome must be null, a number, a string, or a function(number): number."
            );
        });
    });

    // Rolling tests
    describe("Rolling", () => {
        it("should return mapped outcome if face is explicitly mapped", () => {
            rollDie.mockReturnValue(1);

            const outcome = customDie.roll();

            expect(outcome).toBe("Gain 10 Gold");
            expect(customDie.getOutcome()).toBe("Gain 10 Gold");
            expect(customDie.getOutcomeHistory()).toEqual(["Gain 10 Gold"]);
            expect(rollDie).toHaveBeenCalledWith(DieType.D6);
        });

        it("should return default outcome if face is not explicitly mapped", () => {
            rollDie.mockReturnValue(5);

            const outcome = customDie.roll();

            expect(outcome).toBe("No effect");
            expect(customDie.getOutcome()).toBe("No effect");
            expect(customDie.getOutcomeHistory()).toEqual(["No effect"]);
        });

        it("should call a function result with the rolled face", () => {
            const fnMappings = [{ face: 2, result: (n) => n * 10 }];
            const die = new CustomDie(DieType.D6, fnMappings, "default");

            rollDie.mockReturnValue(2);
            const outcome = die.roll();

            expect(outcome).toBe(20); // 2 * 10
        });

        it("should handle multiple rolls and track history", () => {
            rollDie.mockReturnValueOnce(2).mockReturnValueOnce(3);

            customDie.roll(); // 2 -> "Lose 5 Gold"
            customDie.roll(); // 3 -> "Extra Turn"

            expect(customDie.getOutcomeHistory()).toEqual([
                "Lose 5 Gold",
                "Extra Turn",
            ]);
        });
    });

    // Report tests
    describe("Report", () => {
        it("should generate a concise report for last roll", () => {
            rollDie.mockReturnValue(3);
            customDie.roll();

            expect(customDie.report()).toEqual({
                type: "Custom_d6",
                last_result: 3,
                last_outcome: "Extra Turn",
            });
        });

        it("should generate a verbose report with full history", () => {
            rollDie.mockReturnValueOnce(2).mockReturnValueOnce(4);

            customDie.roll(); // mapped
            customDie.roll(); // default

            expect(customDie.report(true)).toEqual({
                type: "Custom_d6",
                last_result: 4,
                last_outcome: "No effect",
                roll_history: [2, 4],
                outcome_history: ["Lose 5 Gold", "No effect"],
            });
        });
    });
});
