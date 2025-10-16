"use strict";

const { DieType, RollType } = require("../src/entities");
const utils = require("../src/utils");
const rollModule = require("../src/roll");

describe("@dice/core/roll", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("validation", () => {
    it("should throw a TypeError for invalid die types", () => {
      expect(() => rollModule.roll("invalid")).toThrow(TypeError);
    });

    it("should throw a TypeError for invalid roll types", () => {
      expect(() => rollModule.roll(DieType.D6, "invalid")).toThrow(TypeError);
    });
  });

  describe("core roll behavior", () => {
    it("should return an integer between 1 and max die sides", () => {
      jest.spyOn(utils, "generateResult").mockReturnValue(4);
      const val = rollModule.roll(DieType.D6);
      expect(val).toBe(4);
    });

    it("should apply advantage correctly", () => {
      jest
        .spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);
      const val = rollModule.roll(DieType.D6, RollType.Advantage);
      expect(val).toBe(5);
    });

    it("should apply disadvantage correctly", () => {
      jest
        .spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(2);
      const val = rollModule.roll(DieType.D6, RollType.Disadvantage);
      expect(val).toBe(2);
    });

    it("should return a single roll when rollType is undefined", () => {
      jest.spyOn(utils, "generateResult").mockReturnValue(6);
      const val = rollModule.roll(DieType.D6, undefined);
      expect(val).toBe(6);
    });
  });

  describe("aliases", () => {
    it("rollAdv should return max of two rolls", () => {
      jest
        .spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);
      expect(rollModule.rollAdv(DieType.D6)).toBe(5);
    });

    it("rollDis should return min of two rolls", () => {
      jest
        .spyOn(utils, "generateResult")
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(5);
      expect(rollModule.rollDis(DieType.D6)).toBe(1);
    });

    it("rollD6 and rollD20 should return valid integers", () => {
      jest.spyOn(utils, "generateResult").mockReturnValueOnce(4);
      expect(rollModule.rollD6()).toBe(4);

      jest.spyOn(utils, "generateResult").mockReturnValueOnce(19);
      expect(rollModule.rollD20()).toBe(19);
    });

    it("aliases respect rollType parameter", () => {
      jest
        .spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(6);
      expect(rollModule.rollD20(RollType.Disadvantage)).toBe(2);
    });
  });
});
