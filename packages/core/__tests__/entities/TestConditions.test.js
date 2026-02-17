/**
 * @file TestConditions.test.js
 * @description
 * Comprehensive test suite for the TestConditions entity module.
 * Covers:
 *  - Class construction and validation
 *  - Error handling and type safety
 *  - Internal condition validation logic
 *  - Normalisation behaviour
 *
 * @module @platonic-dice/core/__tests__/entities/TestConditions
 */

const {
  TestConditions,
  areValidTestConditions,
  normaliseTestConditions,
} = require("../../src/entities/TestConditions");

const { TestType } = require("../../src/entities/TestType");
const { DieType } = require("../../src/entities/DieType");

//
// ────────────────────────────────────────────────────────────────
//   Test Suite
// ────────────────────────────────────────────────────────────────
//

describe("@platonic-dice/core/entities/TestConditions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ────────────────────────────────────────────────────────────────
  //  Constructor behaviour
  // ────────────────────────────────────────────────────────────────
  describe("constructor", () => {
    it("should create an instance when valid testType, conditions, and dieType are provided", () => {
      const tc = new TestConditions(
        TestType.AtLeast,
        { target: 10 },
        DieType.D20
      );
      expect(tc).toBeInstanceOf(TestConditions);
      expect(tc.testType).toBe(TestType.AtLeast);
      expect(tc.conditions).toEqual({ target: 10 });
      expect(tc.dieType).toBe(DieType.D20);
    });

    it("should throw TypeError if testType is invalid", () => {
      expect(() => new TestConditions("invalidType", {}, DieType.D6)).toThrow(
        TypeError
      );
      expect(() => new TestConditions("invalidType", {}, DieType.D6)).toThrow(
        /Invalid test type/
      );
    });

    it("should throw TypeError if conditions is not an object", () => {
      expect(
        () => new TestConditions(TestType.AtLeast, null, DieType.D6)
      ).toThrow(TypeError);
      expect(
        () => new TestConditions(TestType.AtLeast, 42, DieType.D6)
      ).toThrow(TypeError);
      expect(
        () => new TestConditions(TestType.AtLeast, "bad", DieType.D6)
      ).toThrow(TypeError);
    });

    it("should throw TypeError if dieType is missing", () => {
      expect(() => new TestConditions(TestType.AtLeast, {}, undefined)).toThrow(
        TypeError
      );
      expect(() => new TestConditions(TestType.AtLeast, {}, null)).toThrow(
        TypeError
      );
    });

    it("should throw RangeError for out-of-range target values", () => {
      expect(
        () => new TestConditions(TestType.AtLeast, { target: 99 }, DieType.D6)
      ).toThrow(RangeError);
    });

    it("should throw RangeError for 'within' with invalid range", () => {
      expect(
        () =>
          new TestConditions(TestType.Within, { min: 5, max: 2 }, DieType.D6)
      ).toThrow(RangeError);
    });

    it("should throw RangeError for 'in_list' with invalid values", () => {
      expect(
        () =>
          new TestConditions(TestType.InList, { values: [0, 8] }, DieType.D6)
      ).toThrow(RangeError);
    });

    it("should throw RangeError for 'skill' with invalid threshold order", () => {
      expect(
        () =>
          new TestConditions(
            TestType.Skill,
            { target: 10, critical_success: 5, critical_failure: 12 },
            DieType.D20
          )
      ).toThrow(RangeError);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  Validation Method
  // ────────────────────────────────────────────────────────────────
  describe("validate()", () => {
    it("should not throw if conditions are valid", () => {
      const tc = new TestConditions(TestType.AtMost, { target: 4 }, DieType.D6);
      expect(() => tc.validate()).not.toThrow();
    });

    it("should throw TypeError if conditions become invalid", () => {
      const tc = new TestConditions(TestType.AtMost, { target: 4 }, DieType.D6);
      tc.conditions.target = 42; // now invalid
      expect(() => tc.validate()).toThrow(TypeError);
      expect(() => tc.validate()).toThrow(/Invalid test conditions shape/);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  areValidTestConditions
  // ────────────────────────────────────────────────────────────────
  describe("areValidTestConditions()", () => {
    const base = { dieType: DieType.D6 };

    it("should validate simple target conditions", () => {
      expect(
        areValidTestConditions({ ...base, target: 3 }, TestType.AtLeast)
      ).toBe(true);
      expect(
        areValidTestConditions({ ...base, target: 7 }, TestType.AtLeast)
      ).toBe(false);
    });

    it("should validate 'within' conditions correctly", () => {
      expect(
        areValidTestConditions({ ...base, min: 1, max: 4 }, TestType.Within)
      ).toBe(true);
      expect(
        areValidTestConditions({ ...base, min: 4, max: 1 }, TestType.Within)
      ).toBe(false);
    });

    it("should validate 'in_list' conditions", () => {
      expect(
        areValidTestConditions({ ...base, values: [1, 2, 3] }, TestType.InList)
      ).toBe(true);
      expect(
        areValidTestConditions({ ...base, values: [0, 8] }, TestType.InList)
      ).toBe(false);
      expect(
        areValidTestConditions({ ...base, values: [] }, TestType.InList)
      ).toBe(false);
    });

    it("should validate 'skill' conditions", () => {
      expect(
        areValidTestConditions(
          { ...base, target: 4, critical_success: 6, critical_failure: 1 },
          TestType.Skill
        )
      ).toBe(true);

      expect(
        areValidTestConditions(
          { ...base, target: 10, critical_success: 5, critical_failure: 12 },
          TestType.Skill
        )
      ).toBe(false);
    });

    it("should return false for unknown testType", () => {
      expect(
        areValidTestConditions({ ...base, target: 3 }, "unknown_type")
      ).toBe(false);
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  normaliseTestConditions
  // ────────────────────────────────────────────────────────────────
  describe("normaliseTestConditions()", () => {
    const mockDieType = DieType.D6;

    it("should return the same instance if already a TestConditions", () => {
      const instance = new TestConditions(
        TestType.Exact,
        { target: 3 },
        mockDieType
      );
      const result = normaliseTestConditions(instance, mockDieType);
      expect(result).toBe(instance);
    });

    it("should create a new instance from a plain object", () => {
      const obj = { testType: TestType.AtLeast, target: 4 };
      const result = normaliseTestConditions(obj, mockDieType);
      expect(result).toBeInstanceOf(TestConditions);
      expect(result.testType).toBe(TestType.AtLeast);
      expect(result.conditions.target).toBe(4);
    });

    it("should include extra fields in conditions when normalising", () => {
      const obj = {
        testType: TestType.Exact,
        target: 3,
        bonus: 2,
        note: "extra",
      };
      const result = normaliseTestConditions(obj, mockDieType);
      expect(result.conditions).toMatchObject({
        target: 3,
        bonus: 2,
        note: "extra",
      });
    });

    it("should throw TypeError for invalid input types", () => {
      expect(() => normaliseTestConditions(null, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(undefined, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(123, mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions("invalid", mockDieType)).toThrow(
        TypeError
      );
      expect(() => normaliseTestConditions(() => {}, mockDieType)).toThrow(
        TypeError
      );
    });

    it("should include descriptive message for invalid input", () => {
      try {
        normaliseTestConditions("not-valid", mockDieType);
      } catch (err) {
        expect(err.message).toMatch(/Invalid TestConditions/);
      }
    });
  });

  // ────────────────────────────────────────────────────────────────
  //  Integration Behavior
  // ────────────────────────────────────────────────────────────────
  describe("integration", () => {
    it("should store and expose conditions and dieType correctly", () => {
      const conditions = { target: 12 };
      const tc = new TestConditions(TestType.Exact, conditions, DieType.D12);
      expect(tc.conditions).toBe(conditions);
      expect(tc.dieType).toBe(DieType.D12);
      expect(tc.testType).toBe(TestType.Exact);
    });
  });

  describe("integration: delegate to utils validators (TDD)", () => {
    it("calls utils/testValidators.areValidTestConditions during construction", () => {
      jest.resetModules();
      const mockValidators = {
        areValidTestConditions: jest.fn().mockReturnValue(true),
      };
      jest.mock("../../src/utils/testValidators.js", () => mockValidators);

      const { TestConditions } = require("../../src/entities/TestConditions");
      const { TestType, DieType } = require("../../src/entities");

      const tc = new TestConditions(
        TestType.AtLeast,
        { target: 2 },
        DieType.D6
      );
      expect(mockValidators.areValidTestConditions).toHaveBeenCalled();
    });
  });
});
