const rewire = require("rewire");
const DiceUtils = rewire("../core/DiceUtils");
const { DieType, RollType, Outcome } = require("../core/Types");

// Get private methods using rewire
const generateDieResult = DiceUtils.__get__("generateDieResult");
const rollDice = DiceUtils.__get__("rollDice");

describe("generateDieResult (Private Function)", () => {
    it("should roll a single die and return a number within range", () => {
        const resultD6 = generateDieResult(DieType.D6);
        expect(resultD6).toBeGreaterThanOrEqual(1);
        expect(resultD6).toBeLessThanOrEqual(6);
    });

    it("should throw an error for an invalid die type", () => {
        expect(() => generateDieResult("DINVALID")).toThrow(
            "Invalid die type: DINVALID"
        );
    });

    it("should return each die face roughly the same number of times (i.e. be suitably fair.)", () => {
        const numRolls = 10000; // Simulate a large number of rolls to get a good sample.
        const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
        const expectedCount = numRolls / 6;
        const tolerance = expectedCount * 0.05; // Allow 5% margin of error.

        for (let i = 0; i < numRolls; i++) {
            const result = generateDieResult(DieType.D6);
            counts[result]++;
        }

        for (let i = 1; i <= 6; i++) {
            expect(counts[i]).toBeGreaterThanOrEqual(
                Math.floor(expectedCount - tolerance)
            );
            expect(counts[i]).toBeLessThanOrEqual(
                Math.ceil(expectedCount + tolerance)
            );
        }
    });
});

describe("rollDice", () => {
    let originalGenerateDieResult;

    beforeEach(() => {
        originalGenerateDieResult = DiceUtils.__get__("generateDieResult");
    });

    afterEach(() => {
        DiceUtils.__set__("generateDieResult", originalGenerateDieResult);
    });

    it("should roll multiple dice and return an array of results", () => {
        const results = rollDice(DieType.D6, { count: 3 });
        expect(results).toHaveLength(3);
        results.forEach((result) => {
            expect(result).toBeGreaterThanOrEqual(1);
            expect(result).toBeLessThanOrEqual(6);
        });
    });

    it("should return highest/lowest result correctly when rolling with advantage/disadvantage", () => {
        let rollCount = 0;
        DiceUtils.__set__("generateDieResult", () =>
            rollCount++ % 2 === 0 ? 15 : 1
        );

        const resultAdvantage = rollDice(DieType.D20, {
            rollType: RollType.Advantage,
        });
        const resultDisadvantage = rollDice(DieType.D20, {
            rollType: RollType.Disadvantage,
        });

        expect(resultAdvantage).toBe(15);
        expect(resultDisadvantage).toBe(1);
    });
});

describe("rollModDice", () => {
    it("should apply a modifier to a roll", () => {
        DiceUtils.__set__("generateDieResult", () => 4);

        const { base, modified } = DiceUtils.rollModDice(DieType.D6, {
            modifier: (n) => n + 2,
        });

        expect(base).toBe(4);
        expect(modified).toBe(6);
    });

    it("should not modify the roll if no modifier is provided", () => {
        DiceUtils.__set__("generateDieResult", () => 5);

        const { base, modified } = DiceUtils.rollModDice(DieType.D6);

        expect(base).toBe(5);
        expect(modified).toBe(5);
    });
});

describe("rollTestDie", () => {
    it("should return success if the roll is equal or above the target", () => {
        DiceUtils.__set__("generateDieResult", () => 4);

        const result = DiceUtils.rollTestDie(DieType.D6, 3);
        expect(result.outcome).toBe(Outcome.Success);
    });

    it("should return failure if the roll is below the target", () => {
        DiceUtils.__set__("generateDieResult", () => 2);

        const result = DiceUtils.rollTestDie(DieType.D6, 3);
        expect(result.outcome).toBe(Outcome.Failure);
    });

    it("should return critical success if the roll meets or exceeds critical success threshold", () => {
        DiceUtils.__set__("generateDieResult", () => 6);

        const result = DiceUtils.rollTestDie(DieType.D6, 3, {
            criticalSuccess: 6,
        });

        expect(result.outcome).toBe(Outcome.CriticalSuccess);
    });

    it("should return critical failure if the roll meets or falls below critical failure threshold", () => {
        DiceUtils.__set__("generateDieResult", () => 1);

        const result = DiceUtils.rollTestDie(DieType.D6, 3, {
            criticalFailure: 1,
        });

        expect(result.outcome).toBe(Outcome.CriticalFailure);
    });
});

describe("rollTargetDie", () => {
    it("should return success if the roll matches a target value", () => {
        DiceUtils.__set__("generateDieResult", () => 3);

        const result = DiceUtils.rollTargetDie(DieType.D6, [3, 5]);
        expect(result.outcome).toBe(Outcome.Success);
    });

    it("should return failure if the roll does not match a target value", () => {
        DiceUtils.__set__("generateDieResult", () => 2);

        const result = DiceUtils.rollTargetDie(DieType.D6, [3, 5]);
        expect(result.outcome).toBe(Outcome.Failure);
    });

    it("should apply custom success and failure outcomes", () => {
        DiceUtils.__set__("generateDieResult", () => 3);

        const result = DiceUtils.rollTargetDie(DieType.D6, [3, 5], {
            successOutcome: () => "Lucky!",
            failureOutcome: () => "Unlucky!",
        });

        expect(result.outcome).toBe("Lucky!");
    });
});
