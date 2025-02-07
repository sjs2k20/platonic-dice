const { DieType } = require("../core/Types");
const { rollDie } = require("../core/DiceUtils");
const { CustomDie } = require("../core/CustomDie");

// Mock rollDie to return predictable values
jest.mock("../core/DiceUtils", () => ({
    rollDie: jest.fn(),
}));

describe("CustomDie Class", () => {
    let customDie;
    const faceMappings = {
        1: () => "Gain 10 Gold",
        2: () => "Lose 5 Gold",
        3: () => "Extra Turn",
    };
    const defaultOutcome = () => "No effect";

    beforeEach(() => {
        customDie = new CustomDie(DieType.D6, faceMappings, defaultOutcome);
        rollDie.mockClear(); // Reset mock before each test
    });

    // Initialization tests
    describe("Initialization", () => {
        it("should initialize with correct type and mappings", () => {
            expect(customDie.type).toBe("Custom_d6");
            expect(customDie._faceMappings).toEqual(faceMappings);
            expect(customDie._defaultOutcome).toBe(defaultOutcome);
        });

        it("should start with empty outcome history", () => {
            expect(customDie.getOutcomeHistory()).toEqual([]);
        });
    });

    // Rolling tests
    describe("Rolling", () => {
        it("should return mapped outcome if face is explicitly mapped", () => {
            rollDie.mockReturnValue(1); // Mock roll of 1

            const outcome = customDie.roll();

            expect(outcome).toBe("Gain 10 Gold");
            expect(customDie.getOutcome()).toBe("Gain 10 Gold");
            expect(customDie.getOutcomeHistory()).toEqual(["Gain 10 Gold"]);
            expect(rollDie).toHaveBeenCalledWith(DieType.D6);
        });

        it("should return default outcome if face is not explicitly mapped", () => {
            rollDie.mockReturnValue(5); // Mock roll of 5 (not in faceMappings)

            const outcome = customDie.roll();

            expect(outcome).toBe("No effect");
            expect(customDie.getOutcome()).toBe("No effect");
            expect(customDie.getOutcomeHistory()).toEqual(["No effect"]);
        });

        it("should handle rolling multiple times and track history", () => {
            rollDie.mockReturnValueOnce(2).mockReturnValueOnce(3); // First roll 2, then 3

            customDie.roll(); // Rolls 2 -> "Lose 5 Gold"
            customDie.roll(); // Rolls 3 -> "Extra Turn"

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
            rollDie.mockReturnValueOnce(2).mockReturnValueOnce(4); // Rolls 2 (mapped) and 4 (default)

            customDie.roll();
            customDie.roll();

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
