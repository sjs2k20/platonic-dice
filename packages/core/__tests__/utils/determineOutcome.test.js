const { determineOutcome } = require("../../src/utils/determineOutcome");
const {
  TestConditions,
  TestType,
  Outcome,
  DieType,
} = require("../../src/entities");

describe("determineOutcome", () => {
  const d20 = DieType.D20; // Using a standard die for testing

  describe("input validation", () => {
    it("throws if value is not a number", () => {
      expect(() =>
        determineOutcome("foo", {
          testType: TestType.AtLeast,
          target: 5,
          dieType: d20,
        })
      ).toThrow(TypeError);
      expect(() =>
        determineOutcome(NaN, {
          testType: TestType.AtLeast,
          target: 5,
          dieType: d20,
        })
      ).toThrow(TypeError);
      expect(() =>
        determineOutcome(undefined, {
          testType: TestType.AtLeast,
          target: 5,
          dieType: d20,
        })
      ).toThrow(TypeError);
    });

    it("throws if testType is unknown", () => {
      const fakeConditions = { testType: "FakeType", target: 5, dieType: d20 };
      expect(() => determineOutcome(5, fakeConditions)).toThrow(TypeError);
    });
  });

  describe("normalizes plain object input", () => {
    it("creates a TestConditions instance from plain object", () => {
      const plain = { testType: TestType.AtLeast, target: 10, dieType: d20 };
      const result = determineOutcome(12, plain);
      expect(result).toBe(Outcome.Success);
    });
  });

  describe("TestType: AtLeast", () => {
    const conditions = new TestConditions(
      TestType.AtLeast,
      { target: 10 },
      d20
    );

    it("returns Success when value >= target", () => {
      expect(determineOutcome(10, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(15, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure when value < target", () => {
      expect(determineOutcome(5, conditions)).toBe(Outcome.Failure);
    });
  });

  describe("TestType: AtMost", () => {
    const conditions = new TestConditions(TestType.AtMost, { target: 10 }, d20);

    it("returns Success when value <= target", () => {
      expect(determineOutcome(5, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(10, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure when value > target", () => {
      expect(determineOutcome(15, conditions)).toBe(Outcome.Failure);
    });
  });

  describe("TestType: Exact", () => {
    const conditions = new TestConditions(TestType.Exact, { target: 7 }, d20);

    it("returns Success when value === target", () => {
      expect(determineOutcome(7, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure otherwise", () => {
      expect(determineOutcome(6, conditions)).toBe(Outcome.Failure);
      expect(determineOutcome(8, conditions)).toBe(Outcome.Failure);
    });
  });

  describe("TestType: Within", () => {
    const conditions = new TestConditions(
      TestType.Within,
      { min: 3, max: 7 },
      d20
    );

    it("returns Success when value is within range", () => {
      expect(determineOutcome(3, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(5, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(7, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure otherwise", () => {
      expect(determineOutcome(2, conditions)).toBe(Outcome.Failure);
      expect(determineOutcome(8, conditions)).toBe(Outcome.Failure);
    });
  });

  describe("TestType: InList", () => {
    const conditions = new TestConditions(
      TestType.InList,
      { values: [1, 3, 5] },
      d20
    );

    it("returns Success if value is in values array", () => {
      expect(determineOutcome(1, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(3, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure otherwise", () => {
      expect(determineOutcome(2, conditions)).toBe(Outcome.Failure);
      expect(determineOutcome(4, conditions)).toBe(Outcome.Failure);
    });
  });

  describe("TestType: Skill", () => {
    const conditions = new TestConditions(
      TestType.Skill,
      {
        target: 10,
        critical_success: 20,
        critical_failure: 1,
      },
      d20
    );

    it("returns Critical_Failure if value <= critical_failure", () => {
      expect(determineOutcome(0, conditions)).toBe(Outcome.Critical_Failure);
      expect(determineOutcome(1, conditions)).toBe(Outcome.Critical_Failure);
    });

    it("returns Critical_Success if value >= critical_success", () => {
      expect(determineOutcome(20, conditions)).toBe(Outcome.Critical_Success);
      expect(determineOutcome(25, conditions)).toBe(Outcome.Critical_Success);
    });

    it("returns Success if value >= target and not critical", () => {
      expect(determineOutcome(10, conditions)).toBe(Outcome.Success);
      expect(determineOutcome(15, conditions)).toBe(Outcome.Success);
    });

    it("returns Failure if value < target and not critical", () => {
      expect(determineOutcome(5, conditions)).toBe(Outcome.Failure);
      expect(determineOutcome(9, conditions)).toBe(Outcome.Failure);
    });
  });
});
