const helpers = require("../../../src/validators/testConditions/helpers");

describe("helpers.js", () => {
  describe("isValidFaceValue", () => {
    it("returns true for valid integer within 1..sides", () => {
      expect(helpers.isValidFaceValue(1, 6)).toBe(true);
      expect(helpers.isValidFaceValue(3, 6)).toBe(true);
      expect(helpers.isValidFaceValue(6, 6)).toBe(true);
    });

    it("returns false for values below 1 or above sides", () => {
      expect(helpers.isValidFaceValue(0, 6)).toBe(false);
      expect(helpers.isValidFaceValue(7, 6)).toBe(false);
    });

    it("returns false for non-integer values", () => {
      expect(helpers.isValidFaceValue(3.5, 6)).toBe(false);
      expect(helpers.isValidFaceValue("3", 6)).toBe(false);
      expect(helpers.isValidFaceValue(NaN, 6)).toBe(false);
    });
  });

  describe("areValidFaceValues", () => {
    it("returns true if all keys are valid or null/undefined", () => {
      const obj = { a: 1, b: 3, c: null, d: undefined };
      expect(helpers.areValidFaceValues(obj, 6, ["a", "b", "c", "d"])).toBe(
        true
      );
    });

    it("returns false if any key is invalid", () => {
      const obj = { a: 1, b: 7 };
      expect(helpers.areValidFaceValues(obj, 6, ["a", "b"])).toBe(false);
    });

    it("ignores keys not present in the object", () => {
      const obj = { a: 2 };
      expect(helpers.areValidFaceValues(obj, 6, ["a", "b"])).toBe(true);
    });
  });

  describe("isValidThresholdOrder", () => {
    it("returns true if criticals are in correct order", () => {
      expect(
        helpers.isValidThresholdOrder({
          target: 10,
          critical_success: 15,
          critical_failure: 5,
        })
      ).toBe(true);
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_success: 15 })
      ).toBe(true);
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_failure: 5 })
      ).toBe(true);
      expect(helpers.isValidThresholdOrder({ target: 10 })).toBe(true);
    });

    it("returns false if critical_failure >= target", () => {
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_failure: 10 })
      ).toBe(false);
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_failure: 11 })
      ).toBe(false);
    });

    it("returns false if critical_success < target", () => {
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_success: 9 })
      ).toBe(false);
      expect(
        helpers.isValidThresholdOrder({ target: 10, critical_success: 0 })
      ).toBe(false);
    });
  });
});
