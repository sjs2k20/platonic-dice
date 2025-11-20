/**
 * @file rollTest.test.js
 * @description
 * Unit tests for @platonic-dice/core/src/rollTest.
 *
 * Covers validation, core roll-test logic, and representative
 * alias functionality across multiple die types and test types.
 */

const r = require("../src/roll.js");
const td = require("../src/entities/TestConditions.js");
const rollTestModule = require("../src/rollTest.js");
const { DieType, TestType } = require("../src/entities");
const utils = require("../src/utils");

describe("@platonic-dice/core/rollTest", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Validation ---
  describe("validation", () => {
    it("should throw TypeError if dieType is missing", () => {
      expect(() =>
        rollTestModule.rollTest(undefined, {
          testType: TestType.AtLeast,
          target: 5,
        })
      ).toThrow(TypeError);
    });

    it("should delegate invalid testConditions to normaliseTestConditions", () => {
      const spy = jest.spyOn(td, "normaliseTestConditions");
      const dieType = DieType.D6;
      const cond = { testType: "invalid" };
      jest.spyOn(r, "roll").mockReturnValue(3);
      expect(() => rollTestModule.rollTest(dieType, cond)).toThrow();
      expect(spy).toHaveBeenCalledWith(cond, dieType);
    });
  });

  // --- Core rollTest behavior ---
  describe("core rollTest behavior", () => {
    it("should return base and outcome correctly for function condition", () => {
      const dieType = DieType.D6;
      const testConditions = { testType: TestType.AtLeast, target: 4 };

      jest.spyOn(r, "roll").mockReturnValue(5);
      jest.spyOn(utils, "determineOutcome").mockReturnValue("success");

      const result = rollTestModule.rollTest(dieType, testConditions);

      expect(result.base).toBe(5);
      expect(result.outcome).toBe("success");
      expect(r.roll).toHaveBeenCalledWith(dieType, undefined);
      // determineOutcome receives a normalized TestConditions instance
      expect(utils.determineOutcome).toHaveBeenCalledWith(
        5,
        expect.any(td.TestConditions)
      );
    });

    it("should pass rollType through to underlying roll", () => {
      const dieType = DieType.D20;
      const testConditions = { testType: TestType.AtMost, target: 10 };

      jest.spyOn(r, "roll").mockReturnValue(7);
      jest.spyOn(utils, "determineOutcome").mockReturnValue("success");

      const result = rollTestModule.rollTest(
        dieType,
        testConditions,
        "advantage"
      );

      expect(result.base).toBe(7);
      expect(result.outcome).toBe("success");
      expect(r.roll).toHaveBeenCalledWith(dieType, "advantage");
    });
  });

  // --- Alias tests ---
  describe("aliases", () => {
    afterEach(() => jest.restoreAllMocks());

    // Pick a representative subset of aliases: D6 × AtLeast, D20 × AtMost, D8 × Exact
    const testAliases = [
      {
        aliasName: "rollD6AtLeast",
        dieType: DieType.D6,
        testType: TestType.AtLeast,
      },
      {
        aliasName: "rollD20AtMost",
        dieType: DieType.D20,
        testType: TestType.AtMost,
      },
      {
        aliasName: "rollD8Exact",
        dieType: DieType.D8,
        testType: TestType.Exact,
      },
    ];

    testAliases.forEach(({ aliasName, dieType, testType }) => {
      it(`alias ${aliasName} should return base and outcome correctly`, () => {
        jest.spyOn(r, "roll").mockReturnValue(4);
        jest.spyOn(utils, "determineOutcome").mockReturnValue("failure");

        const aliasFn = rollTestModule[aliasName];
        expect(typeof aliasFn).toBe("function");

        const result = aliasFn(3, "disadvantage"); // target = 3, rollType = disadvantage

        expect(result.base).toBe(4);
        expect(result.outcome).toBe("failure");
        expect(r.roll).toHaveBeenCalledWith(dieType, "disadvantage");
        // determineOutcome now receives a normalized TestConditions instance
        expect(utils.determineOutcome).toHaveBeenCalledWith(
          4,
          expect.any(td.TestConditions)
        );
      });
    });

    it("should work with default rollType (undefined)", () => {
      const aliasFn = rollTestModule.rollD6AtLeast;

      jest.spyOn(r, "roll").mockReturnValue(5);
      jest.spyOn(utils, "determineOutcome").mockReturnValue("success");

      const result = aliasFn(4); // default rollType = undefined

      expect(result.base).toBe(5);
      expect(result.outcome).toBe("success");
      expect(r.roll).toHaveBeenCalledWith(DieType.D6, undefined);
      // determineOutcome now receives a normalized TestConditions instance
      expect(utils.determineOutcome).toHaveBeenCalledWith(
        5,
        expect.any(td.TestConditions)
      );
    });
  });
});
