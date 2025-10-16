/**
 * @file rollMod.test.js
 * @description
 * Unit tests for @platonic-dice/core/src/rollMod.
 *
 * Covers validation, core roll-modifier logic, and representative
 * alias functionality (flat bonus, flat penalty, multiplicative),
 * including proper handling of advantage/disadvantage.
 */

const r = require("../src/roll.js"); // same reference as used inside rollMod.js
const rollModModule = require("../src/rollMod.js");
const { DieType, RollModifier } = require("../src/entities");

describe("@platonic-dice/core/rollMod", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Validation ---
  describe("validation", () => {
    it("should throw TypeError if dieType is invalid", () => {
      expect(() => rollModModule.rollMod("dX", (n) => n + 1)).toThrow(
        TypeError
      );
    });

    it("should throw TypeError if modifier is invalid", () => {
      expect(() => rollModModule.rollMod(DieType.D6, "not a function")).toThrow(
        TypeError
      );
    });
  });

  // --- Core rollMod behavior ---
  describe("core rollMod behavior", () => {
    it("should return base and modified values using function modifier", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(4);
      const result = rollModModule.rollMod(DieType.D6, (n) => n + 3);
      expect(result).toEqual({ base: 4, modified: 7 });
      expect(spy).toHaveBeenCalledWith(DieType.D6, undefined);
    });

    it("should apply RollModifier instances correctly", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(6);
      const modifier = new RollModifier((n) => n * 2);
      const result = rollModModule.rollMod(DieType.D6, modifier);
      expect(result).toEqual({ base: 6, modified: 12 });
      expect(spy).toHaveBeenCalledWith(DieType.D6, undefined);
    });

    it("should support advantage/disadvantage", () => {
      // mock roll once to handle both rollTypes deterministically
      const mockRoll = jest
        .spyOn(r, "roll")
        .mockImplementation((die, rollType) => {
          if (rollType === "advantage") return 5;
          if (rollType === "disadvantage") return 1;
          return 3;
        });

      // advantage: returns max roll
      const resultAdv = rollModModule.rollMod(
        DieType.D6,
        (n) => n + 1,
        "advantage"
      );
      expect(resultAdv.base).toBe(5);
      expect(resultAdv.modified).toBe(6);

      // disadvantage: returns min roll
      const resultDis = rollModModule.rollMod(
        DieType.D6,
        (n) => n + 2,
        "disadvantage"
      );
      expect(resultDis.base).toBe(1);
      expect(resultDis.modified).toBe(3);

      // normal roll (undefined)
      const resultNormal = rollModModule.rollMod(DieType.D6, (n) => n + 4);
      expect(resultNormal.base).toBe(3);
      expect(resultNormal.modified).toBe(7);

      expect(mockRoll).toHaveBeenCalledWith(DieType.D6, "advantage");
      expect(mockRoll).toHaveBeenCalledWith(DieType.D6, "disadvantage");
      expect(mockRoll).toHaveBeenCalledWith(DieType.D6, undefined);
    });
  });

  // --- Alias tests ---
  describe("aliases", () => {
    afterEach(() => jest.restoreAllMocks());

    it("flat positive alias (P) should apply bonus correctly", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(3);
      const alias = rollModModule["rollD6P5"]; // +5 bonus alias
      const modified = alias();
      expect(modified).toBe(8);
      expect(spy).toHaveBeenCalledWith(DieType.D6, undefined);
    });

    it("flat negative alias (M) should apply penalty correctly", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(6);
      const alias = rollModModule["rollD6M2"]; // -2 penalty alias
      const modified = alias();
      expect(modified).toBe(4);
      expect(spy).toHaveBeenCalledWith(DieType.D6, undefined);
    });

    it("multiplicative alias (T) should multiply correctly", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(4);
      const alias = rollModModule["rollD6T10"]; // ×10
      const modified = alias();
      expect(modified).toBe(40);
      expect(spy).toHaveBeenCalledWith(DieType.D6, undefined);
    });

    it("should respect rollType parameter in alias", () => {
      const spy = jest.spyOn(r, "roll").mockReturnValue(5);
      const alias = rollModModule["rollD6P3"]; // +3 bonus
      const modified = alias("advantage");
      expect(modified).toBe(8);
      expect(spy).toHaveBeenCalledWith(DieType.D6, "advantage");
    });
  });
});
