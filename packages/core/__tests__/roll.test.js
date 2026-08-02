"use strict";

const { DieType, RollType } = require("../src/entities");
const utils = require("../src/utils");
const rollModule = require("../src/roll");
import { vi } from "vitest";

describe("@platonic-dice/core/roll", () => {
  describe("validation", () => {
    it("should throw a TypeError for invalid die types", () => {
      expect(() => rollModule.roll("invalid")).toThrow(TypeError);
    });

    it("should throw a TypeError for invalid roll types", () => {
      expect(() => rollModule.roll(DieType.D6, "invalid")).toThrow(TypeError);
    });

    it("should surface actionable diagnostics for invalid expressions", () => {
      expect(() => rollModule.roll("2D7")).toThrow(/Supported forms/i);
      expect(() => rollModule.roll("2D7")).toThrow(/2D6\+5/i);
    });
  });

  describe("core roll behavior", () => {
    it("should return an integer between 1 and max die sides", () => {
      vi.spyOn(utils, "generateResult").mockReturnValue(4);
      const val = rollModule.roll(DieType.D6);
      expect(val).toBe(4);
    });

    it("should apply advantage correctly", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);
      const val = rollModule.roll(DieType.D6, RollType.Advantage);
      expect(val).toBe(5);
    });

    it("should apply disadvantage correctly", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(2);
      const val = rollModule.roll(DieType.D6, RollType.Disadvantage);
      expect(val).toBe(2);
    });

    it("should return a single roll when rollType is undefined", () => {
      vi.spyOn(utils, "generateResult").mockReturnValue(6);
      const val = rollModule.roll(DieType.D6, undefined);
      expect(val).toBe(6);
    });
  });

  describe("expression-first API", () => {
    it("should execute a simple expression string and return structured results", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("2D6+5");

      expect(result).toEqual({
        expression: "2D6+5",
        count: 2,
        dieType: DieType.D6,
        rolls: [2, 4],
        base: 6,
        modifier: 5,
        modifierType: "add",
        modified: 11,
      });
    });

    it("should execute a multiplicative expression string", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("3D6x2");

      expect(result).toEqual({
        expression: "3D6x2",
        count: 3,
        dieType: DieType.D6,
        rolls: [2, 4, 6],
        base: 12,
        modifier: 2,
        modifierType: "multiply",
        modified: 24,
      });
    });

    it("should execute an expression string with advantage", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);

      const result = rollModule.roll("1D20ADV");

      expect(result).toEqual({
        expression: "1D20ADV",
        count: 1,
        dieType: DieType.D20,
        rolls: [3, 5],
        base: 5,
        modifier: 0,
        modifierType: "add",
        modified: 5,
        rollMode: "advantage",
      });
    });

    it("should execute an expression string with modifier and advantage", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("1D20ADV+3");

      expect(result).toEqual({
        expression: "1D20ADV+3",
        count: 1,
        dieType: DieType.D20,
        rolls: [2, 6],
        base: 6,
        modifier: 3,
        modifierType: "add",
        modified: 9,
        rollMode: "advantage",
      });
    });

    it("should execute an expression string with multiplier and advantage", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("1D20ADVx2");

      expect(result).toEqual({
        expression: "1D20ADVx2",
        count: 1,
        dieType: DieType.D20,
        rolls: [2, 6],
        base: 6,
        modifier: 2,
        modifierType: "multiply",
        modified: 12,
        rollMode: "advantage",
      });
    });

    it("should execute an expression string with a negative modifier", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("2D6-3");

      expect(result).toEqual({
        expression: "2D6-3",
        count: 2,
        dieType: DieType.D6,
        rolls: [2, 4],
        base: 6,
        modifier: -3,
        modifierType: "add",
        modified: 3,
      });
    });

    it("should execute an expression string with negative modifier and advantage", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("1D20ADV-3");

      expect(result).toEqual({
        expression: "1D20ADV-3",
        count: 1,
        dieType: DieType.D20,
        rolls: [2, 6],
        base: 6,
        modifier: -3,
        modifierType: "add",
        modified: 3,
        rollMode: "advantage",
      });
    });

    it("should evaluate an expression against a test condition", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("1D20ADV GET >= 15");

      expect(result).toEqual({
        expression: "1D20ADV GET >= 15",
        count: 1,
        dieType: DieType.D20,
        rolls: [6, 4],
        base: 6,
        modifier: 0,
        modifierType: "add",
        modified: 6,
        rollMode: "advantage",
        test: {
          testType: "at_least",
          target: 15,
          outcome: "failure",
        },
      });
    });

    it("should still accept shorthand operator syntax as a convenience form", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("1D20ADV>=15");

      expect(result).toEqual({
        expression: "1D20ADV>=15",
        count: 1,
        dieType: DieType.D20,
        rolls: [6, 4],
        base: 6,
        modifier: 0,
        modifierType: "add",
        modified: 6,
        rollMode: "advantage",
        test: {
          testType: "at_least",
          target: 15,
          outcome: "failure",
        },
      });
    });

    it("should evaluate an expression with a GET-style test clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(16)
        .mockReturnValueOnce(14);

      const result = rollModule.roll("1D20ADV GET >= 15");

      expect(result).toEqual({
        expression: "1D20ADV GET >= 15",
        count: 1,
        dieType: DieType.D20,
        rolls: [16, 14],
        base: 16,
        modifier: 0,
        modifierType: "add",
        modified: 16,
        rollMode: "advantage",
        test: {
          testType: "at_least",
          target: 15,
          outcome: "success",
        },
      });
    });

    it("should evaluate an expression with a keyword-style test clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);

      const result = rollModule.roll("1D20ADV AT MOST 4");

      expect(result).toEqual({
        expression: "1D20ADV AT MOST 4",
        count: 1,
        dieType: DieType.D20,
        rolls: [3, 5],
        base: 5,
        modifier: 0,
        modifierType: "add",
        modified: 5,
        rollMode: "advantage",
        test: {
          testType: "at_most",
          target: 4,
          outcome: "failure",
        },
      });
    });

    it("should evaluate an expression with an exact keyword clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("1D20ADV EXACTLY 6");

      expect(result).toEqual({
        expression: "1D20ADV EXACTLY 6",
        count: 1,
        dieType: DieType.D20,
        rolls: [6, 4],
        base: 6,
        modifier: 0,
        modifierType: "add",
        modified: 6,
        rollMode: "advantage",
        test: {
          testType: "exact",
          target: 6,
          outcome: "success",
        },
      });
    });
  });

  describe("aliases", () => {
    it("rollAdv should return max of two rolls", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);
      expect(rollModule.rollAdv(DieType.D6)).toBe(5);
    });

    it("rollDis should return min of two rolls", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(5);
      expect(rollModule.rollDis(DieType.D6)).toBe(1);
    });

    it("rollD6 and rollD20 should return valid integers", () => {
      vi.spyOn(utils, "generateResult").mockReturnValueOnce(4);
      expect(rollModule.rollD6()).toBe(4);

      vi.spyOn(utils, "generateResult").mockReturnValueOnce(19);
      expect(rollModule.rollD20()).toBe(19);
    });

    it("aliases respect rollType parameter", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(6);
      expect(rollModule.rollD20(RollType.Disadvantage)).toBe(2);
    });
  });
});
