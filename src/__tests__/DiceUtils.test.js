const rewire = require("rewire");
const DiceUtils = rewire("../core/DiceUtils");
const { DieType, RollType, Outcome } = require("../core/Types");

// Get private methods using rewire
const generateDieResult = DiceUtils.__get__("generateDieResult");
const rollDie = DiceUtils.__get__("rollDie");
const rollDice = DiceUtils.__get__("rollDice");
const rollModDie = DiceUtils.__get__("rollModDie");
const rollModDice = DiceUtils.__get__("rollModDice");

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
        const tolerance = expectedCount * 0.06; // Allow 6% margin of error.

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

describe("rollDie", () => {
    it("should roll a single die and return a number", () => {
        DiceUtils.__set__("generateDieResult", () => 4);

        const result = rollDie(DieType.D6);
        expect(result).toBe(4);
    });

    it("should return highest/lowest result correctly when rolling with advantage/disadvantage", () => {
        let rollCount = 0;
        DiceUtils.__set__("generateDieResult", () =>
            rollCount++ % 2 === 0 ? 15 : 1
        );

        const resultAdvantage = rollDie(DieType.D20, RollType.Advantage);
        const resultDisadvantage = rollDie(DieType.D20, RollType.Disadvantage);

        expect(resultAdvantage).toBe(15);
        expect(resultDisadvantage).toBe(1);
    });
});

describe("rollDice", () => {
    it("should throw an error if count is less than 1", () => {
        expect(() => rollDice(DieType.D6, { count: 0 })).toThrow(
            "Count must be at least 1."
        );
    });

    it("should roll multiple dice and return an array of results", () => {
        DiceUtils.__set__("generateDieResult", () => 3);

        const results = rollDice(DieType.D6, { count: 3 });
        expect(results).toEqual([3, 3, 3]);
    });

    it("should handle multiple dice rolls with advantage/disadvantage", () => {
        DiceUtils.__set__("generateDieResult", () => 10);

        const results = rollDice(DieType.D6, {
            count: 2,
            rollType: RollType.Advantage,
        });

        expect(results).toEqual([10, 10]);
    });
});

describe("rollModDie", () => {
    it("should apply a modifier to a single roll", () => {
        DiceUtils.__set__("generateDieResult", () => 4);

        const { base, modified } = rollModDie(DieType.D6, (n) => n + 2);

        expect(base).toBe(4);
        expect(modified).toBe(6);
    });

    it("should handle advantage/disadvantage when rolling a single modified die", () => {
        let rollCount = 0;
        DiceUtils.__set__("generateDieResult", () =>
            rollCount++ % 2 === 0 ? 5 : 2
        );

        const { base, modified } = rollModDie(
            DieType.D6,
            (n) => n + 3,
            RollType.Advantage
        );

        expect(base).toBe(5);
        expect(modified).toBe(8);
    });
});

describe("rollModDice", () => {
    it("should throw an error if count is less than 1", () => {
        expect(() =>
            rollModDice(DieType.D6, (n) => n + 1, { count: 0 })
        ).toThrow("Count must be at least 1.");
    });

    it("should apply a modifier to multiple rolls", () => {
        DiceUtils.__set__("generateDieResult", () => 3);

        const { base, modified } = rollModDice(DieType.D6, (n) => n * 2, {
            count: 2,
        });

        expect(base).toEqual([3, 3]);
        expect(modified).toEqual([6, 6]);
    });
});

describe("rollTestDie", () => {
    it("should return success if the modified roll is equal or above the target", () => {
        DiceUtils.__set__("generateDieResult", () => 4);

        const result = DiceUtils.rollTestDie(DieType.D6, 3, {
            modifier: (n) => n + 1,
        });

        expect(result.base).toBe(4);
        expect(result.modified).toBe(5);
        expect(result.outcome).toBe(Outcome.Success);
    });

    it("should return failure if the modified roll is below the target", () => {
        DiceUtils.__set__("generateDieResult", () => 2);

        const result = DiceUtils.rollTestDie(DieType.D6, 4);

        expect(result.base).toBe(2);
        expect(result.modified).toBe(2);
        expect(result.outcome).toBe(Outcome.Failure);
    });

    it("should return critical success if modified roll meets critical threshold", () => {
        DiceUtils.__set__("generateDieResult", () => 6);

        const result = DiceUtils.rollTestDie(DieType.D6, 4, {
            critical_success: 6,
        });

        expect(result.outcome).toBe(Outcome.Critical_Success);
    });

    it("should return critical failure if modified roll meets critical failure threshold", () => {
        DiceUtils.__set__("generateDieResult", () => 1);

        const result = DiceUtils.rollTestDie(DieType.D6, 4, {
            critical_failure: 1,
        });

        expect(result.outcome).toBe(Outcome.Critical_Failure);
    });

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
            critical_success: 6,
        });

        expect(result.outcome).toBe(Outcome.Critical_Success);
    });

    it("should return critical failure if the roll meets or falls below critical failure threshold", () => {
        DiceUtils.__set__("generateDieResult", () => 1);

        const result = DiceUtils.rollTestDie(DieType.D6, 3, {
            critical_failure: 1,
        });

        expect(result.outcome).toBe(Outcome.Critical_Failure);
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
