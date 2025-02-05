const { TestDie } = require("../core/TestDie");
const { rollTestDie } = require("../core/DiceUtils");
const { DieType, Outcome } = require("../core/Types");

// Mock rollTestDie to control test outcomes
jest.mock("../core/DiceUtils", () => ({
    rollTestDie: jest.fn(),
}));

describe("TestDie Class", () => {
    let testDie;
    const conditions = {
        target: 4, // Success on 4+
        critical_success: 6,
        critical_failure: 2,
    };
    const mockModifier = (n) => n + 1; // Example modifier

    beforeEach(() => {
        testDie = new TestDie(DieType.D6, conditions, mockModifier);
        rollTestDie.mockClear(); // Reset mock before each test
    });

    // **Initialization Tests**
    describe("Initialization", () => {
        it("should initialize with the correct type, conditions, and modifier", () => {
            expect(testDie.type).toBe("Modified_d6"); // Because of modifier
            expect(testDie._conditions).toEqual(conditions);
            expect(testDie._modifier).toBe(mockModifier);
            expect(testDie._outcomeHistory).toEqual([]);
        });
    });

    // **Rolling Tests**
    describe("Rolling", () => {
        it("should roll the die and determine success", () => {
            rollTestDie.mockReturnValueOnce({
                baseRoll: 4,
                modifiedRoll: 5,
                outcome: Outcome.Success,
            });

            const result = testDie.roll();

            expect(result).toBe(5);
            expect(testDie.getLastOutcome()).toBe(Outcome.Success);
            expect(testDie.history).toEqual([4]); // Base roll
            expect(testDie.modifiedHistory).toEqual([5]); // Modified roll
        });

        it("should determine failure if roll is below target", () => {
            rollTestDie.mockReturnValue({
                baseRoll: 2,
                modifiedRoll: 3,
                outcome: Outcome.Failure,
            });

            const result = testDie.roll();

            expect(result).toBe(3); // Adjusted for modifier
            expect(testDie.getLastOutcome()).toBe(Outcome.Failure);
            expect(testDie.modifiedHistory).toEqual([3]); // Include modified history
        });

        it("should determine critical success if roll meets critical threshold", () => {
            rollTestDie.mockReturnValue({
                baseRoll: 6,
                modifiedRoll: 7,
                outcome: Outcome.CriticalSuccess,
            });

            const result = testDie.roll();

            expect(result).toBe(7);
            expect(testDie.getLastOutcome()).toBe(Outcome.CriticalSuccess);
            expect(testDie.history).toEqual([6]);
            expect(testDie._outcomeHistory).toEqual([Outcome.CriticalSuccess]);
        });

        it("should determine critical failure if roll meets critical failure threshold", () => {
            rollTestDie.mockReturnValue({
                baseRoll: 1,
                modifiedRoll: 2,
                outcome: Outcome.CriticalFailure,
            });

            const result = testDie.roll();

            expect(result).toBe(2);
            expect(testDie.getLastOutcome()).toBe(Outcome.CriticalFailure);
            expect(testDie.history).toEqual([1]);
            expect(testDie._outcomeHistory).toEqual([Outcome.CriticalFailure]);
        });
    });

    // **History Tracking**
    describe("History Tracking", () => {
        it("should return full roll history with outcomes", () => {
            rollTestDie.mockReturnValueOnce({
                baseRoll: 4,
                modifiedRoll: 5,
                outcome: Outcome.Success,
            });
            testDie.roll();
            rollTestDie.mockReturnValueOnce({
                baseRoll: 2,
                modifiedRoll: 3,
                outcome: Outcome.Failure,
            });
            testDie.roll();

            expect(testDie.getHistory()).toEqual([
                { roll: 5, outcome: Outcome.Success },
                { roll: 3, outcome: Outcome.Failure },
            ]);
        });
    });

    // **Modifier Functionality**
    describe("Modifier Functionality", () => {
        it("should apply the modifier correctly", () => {
            rollTestDie.mockReturnValue({
                baseRoll: 3,
                modifiedRoll: 4,
                outcome: Outcome.Success,
            });

            testDie.roll();

            expect(testDie.history).toEqual([3]); // Base roll before modification
            expect(testDie.result).toBe(4); // Modified result (3+1)
        });

        it("should reset modified history when modifier is changed", () => {
            testDie.roll();
            testDie.modifier = (n) => n * 2; // Change modifier
            expect(testDie.history).toEqual([]); // Should reset history
            expect(testDie.modifiedHistory).toEqual([]); // Reset modified history too
        });
    });

    // **Report Generation**
    describe("Report", () => {
        it("should return a concise report of the last roll", () => {
            rollTestDie.mockReturnValue({
                baseRoll: 5,
                modifiedRoll: 6,
                outcome: Outcome.CriticalSuccess,
            });
            testDie.roll();

            expect(testDie.report()).toBe(
                JSON.stringify({
                    type: "Modified_d6",
                    last_result: 6,
                    last_outcome: Outcome.CriticalSuccess,
                })
            );
        });

        it("should return a verbose report including full history", () => {
            rollTestDie.mockReturnValueOnce({
                baseRoll: 4,
                modifiedRoll: 5,
                outcome: Outcome.Success,
            });
            testDie.roll();
            rollTestDie.mockReturnValueOnce({
                baseRoll: 2,
                modifiedRoll: 3,
                outcome: Outcome.Failure,
            });
            testDie.roll();

            expect(testDie.report(true)).toBe(
                JSON.stringify(
                    {
                        type: "Modified_d6",
                        last_result: 3,
                        last_outcome: Outcome.Failure,
                        history: [
                            {
                                roll: 5,
                                outcome: Outcome.Success,
                            },
                            {
                                roll: 3,
                                outcome: Outcome.Failure,
                            },
                        ],
                    },
                    null,
                    2
                )
            );
        });
    });
});
