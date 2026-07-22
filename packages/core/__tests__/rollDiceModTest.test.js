"use strict";

const rd = require("../src/rollDice.js");
const { rollDiceModTest } = require("../src/rollDiceModTest.js");
const {
  DiceTestConditions,
  DieType,
  Outcome,
  RollModifier,
  TestConditionsArray,
  TestType,
} = require("../src/entities");
import { vi } from "vitest";

describe("@platonic-dice/core/rollDiceModTest", () => {
  describe("validation", () => {
    const conditions = [{ testType: TestType.AtLeast, target: 4 }];

    it("rejects invalid arguments", () => {
      expect(() =>
        rollDiceModTest("invalid", { each: (n) => n }, conditions),
      ).toThrow(TypeError);
      expect(() => rollDiceModTest(DieType.D6, null, conditions)).toThrow(
        TypeError,
      );
      expect(() => rollDiceModTest(DieType.D6, "invalid", conditions)).toThrow(
        TypeError,
      );
      expect(() =>
        rollDiceModTest(DieType.D6, { each: (n) => n }, conditions, {
          count: 0,
        }),
      ).toThrow(TypeError);
    });

    it("requires a DiceTestConditions count to match the roll count", () => {
      const conditionSet = new DiceTestConditions({
        count: 2,
        dieType: DieType.D6,
        conditions,
      });

      expect(() =>
        rollDiceModTest(DieType.D6, { each: (n) => n }, conditionSet, {
          count: 1,
        }),
      ).toThrow(TypeError);
    });
  });

  it("applies each modifiers to condition outcomes while retaining all roll results", () => {
    vi.spyOn(rd, "rollDice").mockReturnValue({ array: [3, 4], sum: 7 });

    const result = rollDiceModTest(
      DieType.D6,
      { each: (n) => n + 1, net: (sum) => sum + 2 },
      [{ testType: TestType.AtLeast, target: 5 }],
      {
        count: 2,
        rules: [{ type: "condition_count", conditionIndex: 0, atLeast: 1 }],
      },
    );

    expect(rd.rollDice).toHaveBeenCalledWith(DieType.D6, { count: 2 });
    expect(result.base).toEqual({ array: [3, 4], sum: 7 });
    expect(result.modified).toEqual({
      each: { array: [4, 5], sum: 9 },
      net: { value: 11 },
    });
    expect(result.result.matrix).toEqual([
      [Outcome.Failure],
      [Outcome.Success],
    ]);
    expect(result.result.condCount).toEqual({ 0: 1 });
    expect(result.result.passed).toBe(true);
  });

  it("leaves evaluation unchanged for net-only modifiers", () => {
    vi.spyOn(rd, "rollDice").mockReturnValue({ array: [3, 4], sum: 7 });

    const result = rollDiceModTest(
      DieType.D6,
      { net: (sum) => sum * 2 },
      [{ testType: TestType.AtLeast, target: 4 }],
      { count: 2 },
    );

    expect(result.modified.each.array).toEqual([3, 4]);
    expect(result.modified.net.value).toBe(14);
    expect(result.result.matrix).toEqual([
      [Outcome.Failure],
      [Outcome.Success],
    ]);
  });

  it("treats standalone functions and RollModifier instances as net-only", () => {
    vi.spyOn(rd, "rollDice").mockReturnValue({ array: [2], sum: 2 });
    const conditions = [{ testType: TestType.AtLeast, target: 3 }];

    const fromFunction = rollDiceModTest(
      DieType.D6,
      (sum) => sum + 1,
      conditions,
    );
    const fromModifier = rollDiceModTest(
      DieType.D6,
      new RollModifier((sum) => sum + 2),
      conditions,
    );

    expect(fromFunction.modified.net.value).toBe(3);
    expect(fromModifier.modified.net.value).toBe(4);
    expect(fromFunction.result.matrix).toEqual([[Outcome.Failure]]);
    expect(fromModifier.result.matrix).toEqual([[Outcome.Failure]]);
  });

  it("uses raw faces for value_count and modified outcomes for condition_count", () => {
    vi.spyOn(rd, "rollDice").mockReturnValue({ array: [4, 4], sum: 8 });

    const result = rollDiceModTest(
      DieType.D6,
      { each: (n) => n + 1 },
      [{ testType: TestType.Exact, target: 5 }],
      {
        count: 2,
        rules: [
          { type: "value_count", value: 4, exact: 2 },
          { type: "condition_count", conditionIndex: 0, exact: 2 },
        ],
      },
    );

    expect(result.result.valueCounts).toEqual({ 4: 2 });
    expect(result.result.condCount).toEqual({ 0: 2 });
    expect(result.result.passed).toBe(true);
  });

  it("accepts TestConditionsArray and DiceTestConditions inputs", () => {
    vi.spyOn(rd, "rollDice").mockReturnValue({ array: [5], sum: 5 });
    const conditionArray = new TestConditionsArray(
      [{ testType: TestType.AtLeast, target: 5 }],
      DieType.D6,
    );
    const conditionSet = new DiceTestConditions({
      count: 1,
      dieType: DieType.D6,
      conditions: conditionArray,
    });

    expect(
      rollDiceModTest(DieType.D6, { each: (n) => n }, conditionArray).result
        .passed,
    ).toBe(true);
    expect(
      rollDiceModTest(DieType.D6, { each: (n) => n }, conditionSet).result
        .passed,
    ).toBe(true);
  });
});
