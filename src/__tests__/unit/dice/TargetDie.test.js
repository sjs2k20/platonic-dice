const {
    DieType,
    Outcome,
    rollTargetDie,
    RollType,
    TargetDie,
} = require("../../../core");

// Mock rollTargetDie to return predictable values
jest.mock("../../../core/utils/DiceUtils", () => ({
    rollTargetDie: jest.fn(),
}));

describe("TargetDie Class", () => {
    let targetDie;
    const targetValues = [3, 5, 6]; // Define target values for success

    beforeEach(() => {
        targetDie = new TargetDie(DieType.D6, targetValues);
        rollTargetDie.mockClear(); // Reset the mock before each test
    });

    // ---------------------------------------------------------
    // Initialization
    // ---------------------------------------------------------
    describe("Initialization", () => {
        it("should throw if targetValues is not an array", () => {
            expect(() => new TargetDie(DieType.D6, "not-an-array")).toThrow(
                "targetValues must be an array of integers."
            );
        });

        it("should throw if targetValues is empty", () => {
            expect(() => new TargetDie(DieType.D6, [])).toThrow(
                "targetValues cannot be empty."
            );
        });

        it("should throw if targetValues contains non-integers", () => {
            expect(() => new TargetDie(DieType.D6, [1, 2.5, 3])).toThrow(
                "targetValues must only contain integers."
            );
        });

        it("should throw if targetValues contains values outside die range", () => {
            expect(() => new TargetDie(DieType.D6, [0, 7])).toThrow(
                "Invalid target value: 0. Must be between 1 and 6."
            );
        });

        it("should throw if targetValues contains duplicates", () => {
            expect(() => new TargetDie(DieType.D6, [2, 2, 3])).toThrow(
                "targetValues must not contain duplicates."
            );
        });

        it("should allow valid targetValues", () => {
            expect(() => new TargetDie(DieType.D6, [1, 3, 6])).not.toThrow();
        });

        it("should initialize with the correct type and empty state", () => {
            expect(targetDie.type).toBe(DieType.D6);
            expect(targetDie._targetValues).toEqual(targetValues);
            expect(targetDie.lastOutcome).toBeNull();
            expect(targetDie.historyDetailed()).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // Rolling
    // ---------------------------------------------------------
    describe("Rolling", () => {
        it("should roll the die and return the outcome", () => {
            rollTargetDie.mockReturnValue({
                roll: 5,
                outcome: Outcome.Success,
            });

            const result = targetDie.roll();

            expect(result).toBe(Outcome.Success);
            expect(targetDie.lastOutcome).toBe(Outcome.Success);
            expect(targetDie.historyDetailed({ verbose: true })).toEqual([
                {
                    roll: 5,
                    outcome: Outcome.Success,
                    timestamp: expect.any(Date),
                },
            ]);
            expect(rollTargetDie).toHaveBeenCalledWith(
                DieType.D6,
                targetValues
            );
        });

        it("should throw if roll type is invalid", () => {
            expect(() => targetDie.roll("invalid")).toThrow(
                "Invalid roll type: invalid"
            );
        });
    });

    // ---------------------------------------------------------
    // History Tracking
    // ---------------------------------------------------------
    describe("History Tracking", () => {
        it("should record multiple rolls in order", () => {
            rollTargetDie
                .mockReturnValueOnce({ roll: 3, outcome: Outcome.Success })
                .mockReturnValueOnce({ roll: 4, outcome: Outcome.Failure });

            targetDie.roll();
            targetDie.roll();

            const history = targetDie.historyDetailed();
            expect(history).toHaveLength(2);
            expect(history[0]).toEqual(
                expect.objectContaining({ roll: 3, outcome: Outcome.Success })
            );
            expect(history[1]).toEqual(
                expect.objectContaining({ roll: 4, outcome: Outcome.Failure })
            );
        });

        it("should return empty array if no rolls", () => {
            expect(targetDie.historyDetailed()).toEqual([]);
        });
    });

    // ---------------------------------------------------------
    // Report
    // ---------------------------------------------------------
    describe("Report", () => {
        it("should return concise report by default", () => {
            rollTargetDie.mockReturnValue({
                roll: 5,
                outcome: Outcome.Success,
            });
            targetDie.roll();

            const report = targetDie.report();
            expect(report).toEqual(
                expect.objectContaining({
                    type: DieType.D6,
                    latest_outcome: Outcome.Success,
                    targets: targetValues,
                })
            );
        });

        it("should include full history if verbose", () => {
            rollTargetDie
                .mockReturnValueOnce({ roll: 3, outcome: Outcome.Success })
                .mockReturnValueOnce({ roll: 4, outcome: Outcome.Failure });

            targetDie.roll();
            targetDie.roll();

            const report = targetDie.report({
                verbose: true,
                includeHistory: true,
            });
            expect(report.history).toHaveLength(2);
            expect(report.history[0]).toEqual(
                expect.objectContaining({ roll: 3 })
            );
            expect(report.history[1]).toEqual(
                expect.objectContaining({ roll: 4 })
            );
        });

        it("should handle report when no rolls", () => {
            const report = targetDie.report();
            expect(report.latest_outcome).toBeNull();
        });
    });

    // ---------------------------------------------------------
    // toString
    // ---------------------------------------------------------
    describe("toString", () => {
        it("should show not rolled yet if no rolls", () => {
            expect(targetDie.toString()).toContain("not rolled yet");
        });

        it("should show latest roll and outcome after rolling", () => {
            rollTargetDie.mockReturnValue({
                roll: 6,
                outcome: Outcome.Success,
            });
            targetDie.roll();
            expect(targetDie.toString()).toContain(
                "latest={ roll: 6, outcome: success }"
            );
        });
    });
});
