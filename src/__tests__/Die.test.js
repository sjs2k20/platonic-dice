const { DieType, RollType } = require("../core/Types");
const { rollDice } = require("../core/DiceUtils");
const { Die } = require("../core/Die");

// Mock rollDice to return predictable values
jest.mock("../core/DiceUtils", () => ({
    rollDice: jest.fn(),
}));

describe("Die Class", () => {
    let die;

    beforeEach(() => {
        die = new Die(DieType.D6);
        rollDice.mockClear(); // Reset the mock before each test
    });

    describe("Initialization", () => {
        it("should initialize with the correct type and empty result/history", () => {
            expect(die.type).toBe(DieType.D6);
            expect(die.result).toBeNull();
            expect(die.history).toEqual([]);
        });
    });

    describe("Rolling", () => {
        it("should roll the die and store the result", () => {
            rollDice.mockReturnValue(4); // Mock the roll result

            const result = die.roll();

            expect(result).toBe(4);
            expect(die.result).toBe(4);
            expect(die.history).toEqual([4]);
            expect(rollDice).toHaveBeenCalledWith(DieType.D6, {
                rollType: null,
            });
        });

        it("should roll with advantage", () => {
            rollDice.mockReturnValue(6);

            const result = die.roll(RollType.Advantage);

            expect(result).toBe(6);
            expect(die.history).toEqual([6]);
            expect(rollDice).toHaveBeenCalledWith(DieType.D6, {
                rollType: RollType.Advantage,
            });
        });

        it("should roll with disadvantage", () => {
            rollDice.mockReturnValue(2);

            const result = die.roll(RollType.Disadvantage);

            expect(result).toBe(2);
            expect(die.history).toEqual([2]);
            expect(rollDice).toHaveBeenCalledWith(DieType.D6, {
                rollType: RollType.Disadvantage,
            });
        });
    });

    describe("Reset", () => {
        beforeEach(() => {
            die._result = 5;
            die._history = [2, 3, 5];
        });

        it("should reset only the result when called without arguments", () => {
            die._reset();

            expect(die.result).toBeNull();
            expect(die.history).toEqual([2, 3, 5]);
        });

        it("should reset both result and history when called with 'complete' set to true", () => {
            die._reset(true);

            expect(die.result).toBeNull();
            expect(die.history).toEqual([]);
        });
    });

    describe("Report", () => {
        it("should return the correct concise report when a result exists", () => {
            die._result = 3;
            expect(die.report()).toBe(`{"type":"d6","last_result":3}`);
        });

        it("should return the correct verbose report including history", () => {
            die._result = 4;
            die._history = [2, 3, 4];

            expect(die.report(true)).toBe(
                JSON.stringify(
                    {
                        type: "d6",
                        last_result: 4,
                        history: [2, 3, 4],
                    },
                    null,
                    2
                )
            );
        });

        it("should return a minimal report if the die has not been rolled", () => {
            expect(die.report()).toBe(`{"type":"d6","last_result":null}`);
        });
    });

    describe("History Tracking", () => {
        it("should return an array of all rolls", () => {
            rollDice.mockReturnValueOnce(3).mockReturnValueOnce(5);

            die.roll();
            die.roll();
            expect(die.history).toEqual([3, 5]);
        });

        it("should return an empty array if the die has not been rolled", () => {
            expect(die.history).toEqual([]);
        });
    });
});
