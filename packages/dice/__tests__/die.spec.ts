/// <reference types="vitest" />

import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { Die } from "@dice/die";
import {
  DieType,
  RollType,
  roll as coreRoll,
  rollMod as coreRollMod,
  rollTest as coreRollTest,
} from "@platonic-dice/core";

// ------------------------
// MOCK @platonic-dice/core
// ------------------------
vi.mock("@platonic-dice/core", async (importOriginal: () => Promise<any>) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    roll: vi.fn(),
    rollMod: vi.fn(),
    rollTest: vi.fn(),
  };
});

// ------------------------
// TEST SUITE
// ------------------------
describe("Die class", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------
  // CONSTRUCTOR VALIDATION
  // ---------------------
  it("creates a die with a valid type", () => {
    const die = new Die(DieType.D6);
    expect(die.type).toBe(DieType.D6);
    expect(die.result).toBe(undefined);
    expect(die.history("normal")).toEqual([]);
  });

  it("throws for invalid die type", () => {
    // @ts-expect-error testing invalid input
    expect(() => new Die("INVALID")).toThrowError(/Invalid die type/);
  });

  // ---------------------
  // FACE COUNT
  // ---------------------
  it("returns the correct faceCount", () => {
    expect(new Die(DieType.D4).faceCount).toBe(4);
    expect(new Die(DieType.D6).faceCount).toBe(6);
    expect(new Die(DieType.D20).faceCount).toBe(20);
  });

  // ---------------------
  // BASIC ROLL
  // ---------------------
  it("rolls and records a basic DieRollRecord", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(4);

    const result = die.roll();
    expect(result).toBe(4);
    expect(die.result).toBe(4);

    const history = die.history("normal", true);
    expect(history.length).toBe(1);
    expect(history[0]).toMatchObject({ roll: 4 });
  });

  it("passes through rollType to coreRoll()", () => {
    const die = new Die(DieType.D20);
    (coreRoll as Mock).mockReturnValue(17);

    die.roll(RollType.Advantage);
    expect(coreRoll).toHaveBeenCalledWith(DieType.D20, RollType.Advantage);
  });

  it("throws for invalid rollType", () => {
    const die = new Die(DieType.D8);
    // @ts-expect-error
    expect(() => die.roll("INVALID")).toThrowError(/Invalid roll type/);
  });

  // ---------------------
  // MODIFIED ROLL
  // ---------------------
  it("rollMod records ModifiedDieRollRecord", () => {
    const die = new Die(DieType.D6);
    (coreRollMod as Mock).mockReturnValue({ base: 3, modified: 5 });

    const result = die.rollMod((n) => n + 2);
    expect(result).toBe(5);
    expect(die.result).toBe(5);

    const history = die.history("modifier", true);
    expect(history.length).toBe(1);
    expect(history[0]).toMatchObject({ roll: 3, modified: 5 });
  });

  // ---------------------
  // TEST ROLL
  // ---------------------
  it("rollTest records TargetDieRollRecord", () => {
    const die = new Die(DieType.D6);
    (coreRollTest as Mock).mockReturnValue({ base: 4, outcome: "success" });

    const result = die.rollTest({ testType: "AtLeast", target: 3 });
    expect(result).toBe(4);
    expect(die.result).toBe(4);

    const history = die.history("test", true);
    expect(history.length).toBe(1);
    expect(history[0]).toMatchObject({ roll: 4, outcome: "success" });
  });

  // ---------------------
  // HISTORY ACCESS
  // ---------------------
  it("history returns timestamp-stripped records when verbose=false", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(2);
    die.roll();

    const hist = die.history("normal", false);
    expect(hist[0]).not.toHaveProperty("timestamp");

    const histVerbose = die.history("normal", true);
    expect(histVerbose[0]).toHaveProperty("timestamp");
  });

  // ---------------------
  // RESET
  // ---------------------
  it("reset clears latest result and optionally all histories", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(5);
    die.roll();
    die.reset();
    expect(die.result).toBeUndefined();

    die.roll();
    die.reset(true);
    expect(die.result).toBeUndefined();
    expect(die.history("normal")).toEqual([]);
    expect(die.history("modifier")).toEqual([]);
    expect(die.history("test")).toEqual([]);
  });

  // ---------------------
  // toString / toJSON
  // ---------------------
  it("toString reports correctly", () => {
    const die = new Die(DieType.D6);
    expect(die.toString()).toMatch(/not rolled yet/);

    (coreRoll as Mock).mockReturnValue(3);
    die.roll();
    expect(die.toString()).toMatch(/latest=3/);
  });

  it("toJSON returns all histories keyed by type", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(4);
    die.roll();

    const json = die.toJSON();
    expect(json).toHaveProperty("normal");
    expect(json.normal.length).toBe(1);
    expect(json.normal[0]).toMatchObject({ roll: 4 });
  });
});
