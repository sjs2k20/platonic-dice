const { DieType, RollType } = require("../core/Types");
const { rollModDice } = require("../core/DiceUtils");
const { ModifiedDie } = require("../core/ModifiedDie");

// Mock rollModDice to return predictable values
jest.mock("../core/DiceUtils", () => ({
    rollModDice: jest.fn(),
}));

describe("ModifiedDie Class", () => {
    let modifiedDie;
    const mockModifier = (n) => n + 2; // Example modifier: Adds 2 to roll

    beforeEach(() => {
        modifiedDie = new ModifiedDie(DieType.D6, mockModifier);
        rollModDice.mockClear(); // Reset the mock before each test
    });

    describe("Initialization", () => {
        it("should initialize with correct type and modifier", () => {
            expect(modifiedDie.type).toBe("Modified_d6");
            expect(modifiedDie._modifier).toBe(mockModifier);
            expect(modifiedDie.result).toBeNull();
            expect(modifiedDie.history).toEqual([]);
            expect(modifiedDie.modifiedHistory).toEqual([]);
        });
    });

    describe("Rolling", () => {
        it("should roll the die and apply the modifier", () => {
            rollModDice.mockReturnValue({ base: 4, modified: 6 });

            const result = modifiedDie.roll();

            expect(result).toBe(6);
            expect(modifiedDie.history).toEqual([4]); // Base roll
            expect(modifiedDie.modifiedHistory).toEqual([6]); // Modified roll
            expect(rollModDice).toHaveBeenCalledWith(DieType.D6, mockModifier, {
                rollType: null,
            });
        });

        it("should roll with advantage and apply the modifier", () => {
            rollModDice.mockReturnValue({ base: 5, modified: 7 });

            const result = modifiedDie.roll(RollType.Advantage);

            expect(result).toBe(7);
            expect(modifiedDie.history).toEqual([5]);
            expect(modifiedDie.modifiedHistory).toEqual([7]);
            expect(rollModDice).toHaveBeenCalledWith(DieType.D6, mockModifier, {
                rollType: RollType.Advantage,
            });
        });

        it("should roll with disadvantage and apply the modifier", () => {
            rollModDice.mockReturnValue({ base: 2, modified: 4 });

            const result = modifiedDie.roll(RollType.Disadvantage);

            expect(result).toBe(4);
            expect(modifiedDie.history).toEqual([2]);
            expect(modifiedDie.modifiedHistory).toEqual([4]);
            expect(rollModDice).toHaveBeenCalledWith(DieType.D6, mockModifier, {
                rollType: RollType.Disadvantage,
            });
        });
    });

    describe("Modifier Handling", () => {
        it("should allow changing the modifier and reset modified history", () => {
            modifiedDie.roll();

            const newModifier = (n) => n * 2;
            modifiedDie.modifier = newModifier;

            expect(modifiedDie._modifier).toBe(newModifier);
            expect(modifiedDie.modifiedHistory).toEqual([]); // Reset history
        });

        it("should apply the new modifier after changing it", () => {
            const newModifier = (n) => n * 2;
            modifiedDie.modifier = newModifier;

            rollModDice.mockReturnValue({ base: 3, modified: 6 });

            const result = modifiedDie.roll();
            expect(result).toBe(6);
            expect(modifiedDie.history).toEqual([3]);
            expect(modifiedDie.modifiedHistory).toEqual([6]);
            expect(rollModDice).toHaveBeenCalledWith(DieType.D6, newModifier, {
                rollType: null,
            });
        });
    });

    describe("Report", () => {
        it("should generate a concise report with last modified result", () => {
            rollModDice.mockReturnValue({ base: 4, modified: 6 });
            modifiedDie.roll();

            expect(modifiedDie.report()).toBe(
                JSON.stringify({
                    type: "Modified_d6",
                    last_result: 6,
                })
            );
        });

        it("should generate a verbose report including full history", () => {
            rollModDice.mockReturnValueOnce({ base: 3, modified: 5 });
            modifiedDie.roll();
            rollModDice.mockReturnValueOnce({ base: 5, modified: 7 });
            modifiedDie.roll();

            expect(modifiedDie.report(true)).toBe(
                JSON.stringify(
                    {
                        type: "Modified_d6",
                        last_result: 7,
                        history: [3, 5], // Base history
                        modified_history: [5, 7], // Modified history
                    },
                    null,
                    2
                )
            );
        });
    });
});
