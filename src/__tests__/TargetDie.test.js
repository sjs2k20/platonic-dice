const { DieType, Outcome } = require("../core/Types");
const { rollTargetDie } = require("../core/DiceUtils");
const { TargetDie } = require("../core/TargetDie");

// Mock rollTargetDie to return predictable values
jest.mock("../core/DiceUtils", () => ({
    rollTargetDie: jest.fn(),
}));

describe("TargetDie Class", () => {
    let targetDie;
    const targetConditions = { target_values: [3, 5, 6] }; // Define target conditions for success

    beforeEach(() => {
        targetDie = new TargetDie(DieType.D6, targetConditions);
        rollTargetDie.mockClear(); // Reset the mock before each test
    });

    describe("Initialization", () => {
        it("should initialize with the correct type and target conditions", () => {
            expect(targetDie.type).toBe(DieType.D6);
            expect(targetDie._conditions).toEqual(targetConditions);
            expect(targetDie.getLastOutcome()).toBeNull();
        });
    });

    describe("Rolling", () => {
        it("should roll the die and determine success based on target conditions", () => {
            rollTargetDie.mockReturnValue({
                roll: 5,
                outcome: Outcome.Success,
            });

            const result = targetDie.roll();

            expect(result).toBe(5);
            expect(targetDie.getLastOutcome()).toBe(Outcome.Success);
            expect(targetDie.history).toEqual([5]);
            expect(targetDie._outcomeHistory).toEqual([Outcome.Success]);
            expect(rollTargetDie).toHaveBeenCalledWith(DieType.D6, [3, 5, 6]);
        });

        it("should determine failure if the roll is not in the target conditions", () => {
            rollTargetDie.mockReturnValue({
                roll: 2,
                outcome: Outcome.Failure,
            });

            const result = targetDie.roll();

            expect(result).toBe(2);
            expect(targetDie.getLastOutcome()).toBe(Outcome.Failure);
            expect(targetDie.history).toEqual([2]);
            expect(targetDie._outcomeHistory).toEqual([Outcome.Failure]);
        });
    });

    describe("History Tracking", () => {
        it("should return full roll history with outcomes", () => {
            rollTargetDie
                .mockReturnValueOnce({ roll: 3, outcome: Outcome.Success })
                .mockReturnValueOnce({ roll: 4, outcome: Outcome.Failure });

            targetDie.roll();
            targetDie.roll();

            expect(targetDie.getHistory()).toEqual([
                { roll: 3, outcome: Outcome.Success },
                { roll: 4, outcome: Outcome.Failure },
            ]);
        });

        it("should return an empty array if no rolls have been made", () => {
            expect(targetDie.getHistory()).toEqual([]);
        });
    });

    describe("Report", () => {
        it("should return a concise report of the last roll", () => {
            rollTargetDie.mockReturnValue({
                roll: 5,
                outcome: Outcome.Success,
            });
            targetDie.roll();

            expect(targetDie.report()).toBe(
                `{"type":"d6","last_result":5,"last_outcome":"success"}`
            );
        });

        it("should return a verbose report including full history", () => {
            rollTargetDie
                .mockReturnValueOnce({ roll: 3, outcome: Outcome.Success })
                .mockReturnValueOnce({ roll: 4, outcome: Outcome.Failure });

            targetDie.roll();
            targetDie.roll();

            expect(targetDie.report(true)).toBe(
                JSON.stringify(
                    {
                        type: "d6",
                        last_result: 4,
                        last_outcome: Outcome.Failure,
                        history: [
                            { roll: 3, outcome: Outcome.Success },
                            { roll: 4, outcome: Outcome.Failure },
                        ],
                    },
                    null,
                    2
                )
            );
        });

        it("should return a minimal report if no roll has been made", () => {
            expect(targetDie.report()).toBe(
                `{"type":"d6","last_result":null,"last_outcome":null}`
            );
        });
    });
});
