const {
    TestConditions,
    TestDie,
    rollTestDie,
    DieType,
    Outcome,
} = require("../../core");

// Mock rollTestDie to control test outcomes
jest.mock("../../core/DiceUtils", () => ({
    rollTestDie: jest.fn(),
}));

describe("TestDie Class", () => {
    let testDie;
    const conditions = new TestConditions(4, 6, 2);
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
                base: 4,
                modified: 5,
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
                base: 2,
                modified: 3,
                outcome: Outcome.Failure,
            });

            const result = testDie.roll();

            expect(result).toBe(3); // Adjusted for modifier
            expect(testDie.getLastOutcome()).toBe(Outcome.Failure);
            expect(testDie.modifiedHistory).toEqual([3]); // Include modified history
        });

        it("should determine critical success if roll meets critical threshold", () => {
            rollTestDie.mockReturnValue({
                base: 6,
                modified: 7,
                outcome: Outcome.Critical_Success,
            });

            const result = testDie.roll();

            expect(result).toBe(7);
            expect(testDie.getLastOutcome()).toBe(Outcome.Critical_Success);
            expect(testDie.history).toEqual([6]);
            expect(testDie._outcomeHistory).toEqual([Outcome.Critical_Success]);
        });

        it("should determine critical failure if roll meets critical failure threshold", () => {
            rollTestDie.mockReturnValue({
                base: 1,
                modified: 2,
                outcome: Outcome.Critical_Failure,
            });

            const result = testDie.roll();

            expect(result).toBe(2);
            expect(testDie.getLastOutcome()).toBe(Outcome.Critical_Failure);
            expect(testDie.history).toEqual([1]);
            expect(testDie._outcomeHistory).toEqual([Outcome.Critical_Failure]);
        });
    });

    // **History Tracking**
    describe("History Tracking", () => {
        it("should return full roll history with outcomes", () => {
            rollTestDie.mockReturnValueOnce({
                base: 4,
                modified: 5,
                outcome: Outcome.Success,
            });
            testDie.roll();
            rollTestDie.mockReturnValueOnce({
                base: 2,
                modified: 3,
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
                base: 3,
                modified: 4,
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
                base: 5,
                modified: 6,
                outcome: Outcome.Critical_Success,
            });
            testDie.roll();

            expect(testDie.report()).toEqual({
                type: "Modified_d6",
                last_result: 6,
                last_outcome: Outcome.Critical_Success,
            });
        });

        it("should return a verbose report including full history", () => {
            rollTestDie.mockReturnValueOnce({
                base: 4,
                modified: 5,
                outcome: Outcome.Success,
            });
            testDie.roll();
            rollTestDie.mockReturnValueOnce({
                base: 2,
                modified: 3,
                outcome: Outcome.Failure,
            });
            testDie.roll();

            expect(testDie.report(true)).toEqual({
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
            });
        });
    });
});
