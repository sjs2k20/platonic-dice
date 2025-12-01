/**
 * @jest-environment node
 */

const validators = require("../../src/utils/testValidators.js");
const { DieType } = require("../../src/entities/DieType.js");

describe("testValidators", () => {
  describe("isValidFaceValue", () => {
    it("validates within range", () => {
      expect(validators.isValidFaceValue(1, 6)).toBe(true);
      expect(validators.isValidFaceValue(6, 6)).toBe(true);
      expect(validators.isValidFaceValue(0, 6)).toBe(false);
      expect(validators.isValidFaceValue(7, 6)).toBe(false);
    });
  });

  describe("isValidTargetConditions", () => {
    it("accepts a valid target for a d6", () => {
      expect(
        validators.isValidTargetConditions({ dieType: DieType.D6, target: 4 })
      ).toBe(true);
    });

    it("rejects invalid dieType or out-of-range target", () => {
      expect(
        validators.isValidTargetConditions({ dieType: "d100", target: 50 })
      ).toBe(false);
      expect(
        validators.isValidTargetConditions({ dieType: DieType.D6, target: 0 })
      ).toBe(false);
    });
  });

  describe("isValidSkillTestCondition", () => {
    it("accepts valid skill thresholds with proper ordering", () => {
      expect(
        validators.isValidSkillTestCondition({
          dieType: DieType.D20,
          target: 10,
          critical_success: 20,
          critical_failure: 1,
        })
      ).toBe(true);
    });

    it("rejects skill conditions with invalid threshold ordering", () => {
      // critical_failure >= target -> invalid
      expect(
        validators.isValidSkillTestCondition({
          dieType: DieType.D20,
          target: 10,
          critical_failure: 12,
        })
      ).toBe(false);

      // critical_success < target -> invalid
      expect(
        validators.isValidSkillTestCondition({
          dieType: DieType.D20,
          target: 15,
          critical_success: 10,
        })
      ).toBe(false);
    });
  });

  describe("isValidWithinConditions and isValidSpecificListConditions", () => {
    it("accepts within conditions with min<=max", () => {
      expect(
        validators.isValidWithinConditions({
          dieType: DieType.D10,
          min: 2,
          max: 5,
        })
      ).toBe(true);
      expect(
        validators.isValidWithinConditions({
          dieType: DieType.D10,
          min: 6,
          max: 5,
        })
      ).toBe(false);
    });

    it("accepts specific list when values are valid faces", () => {
      expect(
        validators.isValidSpecificListConditions({
          dieType: DieType.D8,
          values: [1, 3, 7],
        })
      ).toBe(true);
      expect(
        validators.isValidSpecificListConditions({
          dieType: DieType.D8,
          values: [0, 9],
        })
      ).toBe(false);
    });
  });

  describe("areValidTestConditions (master)", () => {
    it("routes to the correct validators by test type", () => {
      expect(
        validators.areValidTestConditions(
          { dieType: DieType.D6, target: 3 },
          "at_least"
        )
      ).toBe(true);
      expect(
        validators.areValidTestConditions(
          { dieType: DieType.D6, target: 7 },
          "at_least"
        )
      ).toBe(false);
      expect(
        validators.areValidTestConditions(
          { dieType: DieType.D8, min: 2, max: 4 },
          "within"
        )
      ).toBe(true);
      expect(
        validators.areValidTestConditions(
          { dieType: DieType.D8, values: [2, 3] },
          "in_list"
        )
      ).toBe(true);
      expect(
        validators.areValidTestConditions(
          { dieType: DieType.D20, target: 10, critical_success: 20 },
          "skill"
        )
      ).toBe(true);
    });
  });
});
