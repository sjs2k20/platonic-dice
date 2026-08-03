"use strict";

const { DieType, RollType, TestType } = require("../src/entities");
const utils = require("../src/utils");
const rollModule = require("../src/roll");
const coreIndex = require("../src/index");
const { executeExpression } = require("../src/expressionRuntime");
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

    it("should require GET for explicit test clauses", () => {
      expect(() => rollModule.roll("1D20ADV atMost 4")).toThrow(/GET/i);
      expect(() => rollModule.roll("1D20ADV exactly 6")).toThrow(/GET/i);
      expect(() => rollModule.roll("1D20ADV atLeast 15")).toThrow(/GET/i);
      expect(() => rollModule.roll("1D20ADV GET atMost 4")).not.toThrow();
    });

    it("should require GET for analysis expressions", () => {
      expect(() => rollModule.analyse("2D6+5")).toThrow(/GET/i);
      expect(() => rollModule.analyse("1D20ADV>=15")).toThrow(/GET/i);
      expect(() => rollModule.analyse("1D20ADV GET >= 15")).not.toThrow();
    });

    it("should surface a targeted diagnostic for malformed aggregate clauses", () => {
      expect(() =>
        rollModule.roll("3D6 GET atLeast 2x 5+ AND total > 15"),
      ).toThrow(/aggregate/i);
    });

    it("should reject aggregate clauses that exceed the available dice or threshold", () => {
      expect(() =>
        rollModule.roll("3D6 GET atLeast 4x 5+ AND total >= 15"),
      ).toThrow(/aggregate/i);
      expect(() =>
        rollModule.roll("3D6 GET atLeast 1x 7+ AND total >= 15"),
      ).toThrow(/aggregate/i);
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

    it("should evaluate an expression with a GET keyword-style test clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(5);

      const result = rollModule.roll("1D20ADV GET atMost 4");

      expect(result).toEqual({
        expression: "1D20ADV GET atMost 4",
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

    it("should evaluate an expression with an exact GET keyword clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(6)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("1D20ADV GET exactly 6");

      expect(result).toEqual({
        expression: "1D20ADV GET exactly 6",
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

    it("should preserve natural crit defaults for skill-style tests", () => {
      vi.spyOn(utils, "generateResult").mockReturnValueOnce(20);

      const result = executeExpression({
        expression: "1D20",
        count: 1,
        dieType: DieType.D20,
        modifier: 0,
        modifierType: "add",
        test: {
          testType: TestType.Skill,
          target: 10,
        },
      });

      expect(result.test.outcome).toBe("critical_success");
    });

    it("should expose roll and analyse from the package root", () => {
      expect(coreIndex.roll).toBeDefined();
      expect(typeof coreIndex.roll).toBe("function");
      expect(coreIndex.analyse).toBeDefined();
      expect(typeof coreIndex.analyse).toBe("function");
      expect(coreIndex.rollExpression).toBeUndefined();
    });

    it("should evaluate an expression with chained each and net modifiers", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(3);

      const result = rollModule.roll("4D6+1toEach+10");

      expect(result).toEqual({
        expression: "4D6+1toEach+10",
        count: 4,
        dieType: DieType.D6,
        rolls: [4, 1, 2, 3],
        base: 10,
        modifier: 10,
        modifierType: "add",
        modified: 24,
        perDieModifier: 1,
        modifierPlan: {
          each: 1,
          net: 10,
        },
      });
    });

    it("should evaluate an expression with a simple aggregate clause", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("3D6 GET atLeast 2x 5+ AND total >= 15");

      expect(result).toEqual({
        expression: "3D6 GET atLeast 2x 5+ AND total >= 15",
        count: 3,
        dieType: DieType.D6,
        rolls: [4, 5, 6],
        base: 15,
        modifier: 0,
        modifierType: "add",
        modified: 15,
        test: {
          testType: "at_least",
          target: 15,
          outcome: "success",
          aggregate: {
            count: 2,
            threshold: 5,
            total: 15,
          },
        },
      });
    });

    it("should evaluate an expression with the explicit aggregate example syntax", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(4);

      const result = rollModule.roll("3D6 GET atLeast 1x 5+ AND total >= 15");

      expect(result).toEqual({
        expression: "3D6 GET atLeast 1x 5+ AND total >= 15",
        count: 3,
        dieType: DieType.D6,
        rolls: [5, 5, 4],
        base: 14,
        modifier: 0,
        modifierType: "add",
        modified: 14,
        test: {
          testType: "at_least",
          target: 15,
          outcome: "failure",
          aggregate: {
            count: 1,
            threshold: 5,
            total: 15,
          },
        },
      });
    });

    it("should support OR aggregate clauses for total-threshold checks", () => {
      vi.spyOn(utils, "generateResult")
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(5)
        .mockReturnValueOnce(6);

      const result = rollModule.roll("3D6 GET atLeast 2x 5+ OR total >= 15");

      expect(result.test.outcome).toBe("success");
      expect(result.test.aggregate).toEqual({
        count: 2,
        threshold: 5,
        total: 15,
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
