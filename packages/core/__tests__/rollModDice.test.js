/**
 * @file rollModDice.test.js
 * @description
 * Unit tests for @dice/core/src/rollModDice.
 *
 * Covers validation, core roll-modifier logic, handling of `each` and `net`
 * modifiers, and convenience aliases (`rollModDiceArr`, `rollModDiceNet`).
 */

const rd = require("../src/rollDice.js");
const rollModDiceModule = require("../src/rollModDice.js");
const {
  DieType,
  RollModifier,
  normaliseRollModifier,
} = require("../src/entities");

describe("@dice/core/rollModDice", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Validation ---
  describe("validation", () => {
    it("should throw TypeError if count is invalid", () => {
      expect(() =>
        rollModDiceModule.rollModDice(DieType.D6, {}, { count: 0 })
      ).toThrow(TypeError);
      expect(() =>
        rollModDiceModule.rollModDice(DieType.D6, {}, { count: -3 })
      ).toThrow(TypeError);
      expect(() =>
        rollModDiceModule.rollModDice(DieType.D6, {}, { count: 1.5 })
      ).toThrow(TypeError);
      expect(() =>
        rollModDiceModule.rollModDice(DieType.D6, {}, { count: "3" })
      ).toThrow(TypeError);
    });

    it("should throw TypeError if modifier is invalid type", () => {
      expect(() =>
        rollModDiceModule.rollModDice(DieType.D6, "invalid")
      ).toThrow(TypeError);
      expect(() => rollModDiceModule.rollModDice(DieType.D6, 42)).toThrow(
        TypeError
      );
    });
  });

  // --- Core rollModDice behavior ---
  describe("core rollModDice behavior", () => {
    const mockBase = { array: [2, 4, 6], sum: 12 };

    it("should roll dice and apply identity modifiers by default", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const result = rollModDiceModule.rollModDice(
        DieType.D6,
        {},
        { count: 3 }
      );

      expect(result.base).toEqual(mockBase);
      expect(result.modified.each.array).toEqual(mockBase.array);
      expect(result.modified.each.sum).toEqual(mockBase.sum);
      expect(result.modified.net.value).toEqual(mockBase.sum);
      expect(rd.rollDice).toHaveBeenCalledWith(DieType.D6, { count: 3 });
    });

    it("should apply 'each' modifier function correctly", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const modifier = { each: (n) => n + 1 };
      const result = rollModDiceModule.rollModDice(DieType.D6, modifier, {
        count: 3,
      });

      expect(result.modified.each.array).toEqual([3, 5, 7]);
      expect(result.modified.each.sum).toEqual(15);
      expect(result.modified.net.value).toEqual(15); // net default = identity
    });

    it("should apply 'net' modifier function correctly", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const modifier = { net: (sum) => sum * 2 };
      const result = rollModDiceModule.rollModDice(DieType.D6, modifier, {
        count: 3,
      });

      expect(result.modified.each.array).toEqual(mockBase.array);
      expect(result.modified.each.sum).toEqual(mockBase.sum);
      expect(result.modified.net.value).toEqual(24);
    });

    it("should apply both 'each' and 'net' modifiers correctly", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const modifier = {
        each: (n) => n + 1,
        net: (sum) => sum * 2,
      };

      const result = rollModDiceModule.rollModDice(DieType.D6, modifier, {
        count: 3,
      });

      expect(result.modified.each.array).toEqual([3, 5, 7]);
      expect(result.modified.each.sum).toEqual(15);
      expect(result.modified.net.value).toEqual(30);
    });

    it("should support single RollModifier instance as net modifier", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const netMod = new RollModifier((sum) => sum + 5);
      const result = rollModDiceModule.rollModDice(DieType.D6, netMod, {
        count: 3,
      });

      expect(result.modified.each.array).toEqual(mockBase.array); // identity
      expect(result.modified.each.sum).toEqual(mockBase.sum);
      expect(result.modified.net.value).toEqual(17);
    });

    it("should support single function as net modifier", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const result = rollModDiceModule.rollModDice(
        DieType.D6,
        (sum) => sum * 3,
        { count: 3 }
      );

      expect(result.modified.each.array).toEqual(mockBase.array);
      expect(result.modified.each.sum).toEqual(mockBase.sum);
      expect(result.modified.net.value).toEqual(36);
    });
  });

  // --- Alias tests ---
  describe("aliases", () => {
    const mockBase = { array: [1, 2, 3], sum: 6 };

    afterEach(() => jest.restoreAllMocks());

    it("rollModDiceArr should return modified 'each' array", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);
      const modifier = { each: (n) => n + 1 };

      const arr = rollModDiceModule.rollModDiceArr(DieType.D6, modifier, {
        count: 3,
      });

      expect(arr).toEqual([2, 3, 4]);
      expect(rd.rollDice).toHaveBeenCalledWith(DieType.D6, { count: 3 });
    });

    it("rollModDiceNet should return modified 'net' value", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);
      const modifier = { net: (sum) => sum * 2 };

      const net = rollModDiceModule.rollModDiceNet(DieType.D6, modifier, {
        count: 3,
      });

      expect(net).toEqual(12);
      expect(rd.rollDice).toHaveBeenCalledWith(DieType.D6, { count: 3 });
    });

    it("aliases should work with default identity modifiers", () => {
      jest.spyOn(rd, "rollDice").mockReturnValue(mockBase);

      const arr = rollModDiceModule.rollModDiceArr(
        DieType.D6,
        {},
        { count: 3 }
      );
      const net = rollModDiceModule.rollModDiceNet(
        DieType.D6,
        {},
        { count: 3 }
      );

      expect(arr).toEqual(mockBase.array);
      expect(net).toEqual(mockBase.sum);
    });
  });
});
