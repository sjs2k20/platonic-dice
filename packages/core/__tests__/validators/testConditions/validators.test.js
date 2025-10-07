const validators = require("../../../src/validators/testConditions/validators");
const helpers = require("../../../src/validators/testConditions/helpers");
const { numSides } = require("../../../src/utils");
const { isDieType } = require("../../../src/validators");

jest.mock("../../../src/validators", () => ({
  isDieType: jest.fn(),
}));

jest.mock("../../../src/utils", () => ({
  numSides: jest.fn(),
}));

describe("validators.js", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isValidTargetCondition", () => {
    it("returns false for missing dieType", () => {
      isDieType.mockReturnValue(false);
      expect(validators.isValidTargetCondition({})).toBe(false);
    });

    it("returns true if target is valid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "isValidFaceValue").mockReturnValue(true);
      expect(
        validators.isValidTargetCondition({ dieType: "d6", target: 4 })
      ).toBe(true);
    });

    it("returns false if target is invalid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "isValidFaceValue").mockReturnValue(false);
      expect(
        validators.isValidTargetCondition({ dieType: "d6", target: 7 })
      ).toBe(false);
    });
  });

  describe("isValidSkillTestCondition", () => {
    it("returns false if dieType invalid", () => {
      isDieType.mockReturnValue(false);
      expect(validators.isValidSkillTestCondition({})).toBe(false);
    });

    it("returns false if face values invalid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(false);
      expect(validators.isValidSkillTestCondition({ dieType: "d6" })).toBe(
        false
      );
    });

    it("returns false if thresholds invalid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(true);
      jest.spyOn(helpers, "isValidThresholdOrder").mockReturnValue(false);
      expect(validators.isValidSkillTestCondition({ dieType: "d6" })).toBe(
        false
      );
    });

    it("returns true if all checks pass", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(true);
      jest.spyOn(helpers, "isValidThresholdOrder").mockReturnValue(true);
      expect(
        validators.isValidSkillTestCondition({ dieType: "d6", target: 4 })
      ).toBe(true);
    });
  });

  describe("isValidWithinCondition", () => {
    it("returns false for invalid dieType", () => {
      isDieType.mockReturnValue(false);
      expect(validators.isValidWithinCondition({})).toBe(false);
    });

    it("returns false for invalid min/max", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(false);
      expect(
        validators.isValidWithinCondition({ dieType: "d6", min: 1, max: 6 })
      ).toBe(false);
    });

    it("returns false if min > max", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(true);
      expect(
        validators.isValidWithinCondition({ dieType: "d6", min: 5, max: 4 })
      ).toBe(false);
    });

    it("returns true if valid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "areValidFaceValues").mockReturnValue(true);
      expect(
        validators.isValidWithinCondition({ dieType: "d6", min: 1, max: 6 })
      ).toBe(true);
    });
  });

  describe("isValidSpecificListCondition", () => {
    it("returns false for invalid dieType", () => {
      isDieType.mockReturnValue(false);
      expect(validators.isValidSpecificListCondition({})).toBe(false);
    });

    it("returns false if values not array or empty", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      expect(
        validators.isValidSpecificListCondition({ dieType: "d6", values: [] })
      ).toBe(false);
      expect(
        validators.isValidSpecificListCondition({
          dieType: "d6",
          values: "notarray",
        })
      ).toBe(false);
    });

    it("returns false if any value invalid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "isValidFaceValue").mockImplementation((v) => v <= 6);
      expect(
        validators.isValidSpecificListCondition({
          dieType: "d6",
          values: [1, 2, 7],
        })
      ).toBe(false);
    });

    it("returns true if all values valid", () => {
      isDieType.mockReturnValue(true);
      numSides.mockReturnValue(6);
      jest.spyOn(helpers, "isValidFaceValue").mockReturnValue(true);
      expect(
        validators.isValidSpecificListCondition({
          dieType: "d6",
          values: [1, 2, 3],
        })
      ).toBe(true);
    });
  });

  describe("isValidTestCondition", () => {
    it("dispatches correctly based on testType", () => {
      const target = { dieType: "d6", target: 4 };
      const within = { dieType: "d6", min: 1, max: 6 };
      const list = { dieType: "d6", values: [1, 2] };
      const skill = { dieType: "d6", target: 4 };

      jest.spyOn(validators, "isValidTargetCondition").mockReturnValue(true);
      jest.spyOn(validators, "isValidWithinCondition").mockReturnValue(true);
      jest
        .spyOn(validators, "isValidSpecificListCondition")
        .mockReturnValue(true);
      jest.spyOn(validators, "isValidSkillTestCondition").mockReturnValue(true);

      expect(validators.isValidTestCondition(target, "at_least")).toBe(true);
      expect(validators.isValidTestCondition(within, "within")).toBe(true);
      expect(validators.isValidTestCondition(list, "in_list")).toBe(true);
      expect(validators.isValidTestCondition(skill, "skill")).toBe(true);

      expect(validators.isValidTestCondition({}, "unknown")).toBe(false);
    });
  });
});
