/// <reference types="vitest" />

import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";
import { Die } from "../../src/components/Die";
import { DieType, RollType, roll as coreRoll } from "@platonic-dice/core";
import {
  RollRecordManager,
  type DieRollRecord,
  type ModifiedDieRollRecord,
  type TargetDieRollRecord,
} from "../../src/components/historyManagement";

// ------------------------
// MOCK @platonic-dice/core
// ------------------------
vi.mock("@platonic-dice/core", async (importOriginal: () => Promise<any>) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, any>),
    roll: vi.fn(),
  };
});

// ------------------------
// SPY RollRecordManager
// ------------------------
const addSpy = vi.spyOn(RollRecordManager.prototype, "add");
const clearSpy = vi.spyOn(RollRecordManager.prototype, "clear");
const reportSpy = vi.spyOn(RollRecordManager.prototype, "report");

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
    expect(die.history).toEqual([]);
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
  // ROLLING
  // ---------------------
  it("rolls and records a basic DieRollRecord", () => {
    const die = new Die(DieType.D6);

    (coreRoll as Mock).mockReturnValue(4);

    const result = die.roll();
    expect(result).toBe(4);

    expect(addSpy).toHaveBeenCalledTimes(1);
    const record = addSpy.mock.calls[0][0] as DieRollRecord;
    expect(record.roll).toBe(4);
    expect(record.timestamp).toBeInstanceOf(Date);
    expect(die.result).toBe(4);
    expect(die.history.length).toBe(1);
  });

  it("passes through rollType to coreRoll()", () => {
    const die = new Die(DieType.D20);
    (coreRoll as Mock).mockReturnValue(17);

    die.roll(RollType.Advantage);

    expect(coreRoll).toHaveBeenCalledWith(DieType.D20, RollType.Advantage);
  });

  it("throws for invalid rollType", () => {
    const die = new Die(DieType.D8);
    // @ts-expect-error testing invalid argument
    expect(() => die.roll("INVALID")).toThrowError(/Invalid roll type/);
  });

  // ---------------------
  // HISTORY ACCESSORS
  // ---------------------
  it("history returns timestamps removed; historyFull returns full objects", () => {
    const die = new Die(DieType.D10);
    (coreRoll as Mock).mockReturnValue(6);

    die.roll();

    expect(die.historyFull.length).toBe(1);
    expect(die.historyFull[0]).toHaveProperty("timestamp");
    expect(die.history.length).toBe(1);
    expect(die.history[0]).not.toHaveProperty("timestamp");
  });

  // ---------------------
  // DETAILED HISTORY + REPORT
  // ---------------------
  it("historyDetailed delegates to RollRecordManager.report", () => {
    const die = new Die(DieType.D6);
    die.historyDetailed({ limit: 10 });
    expect(reportSpy).toHaveBeenCalledWith({ limit: 10 });
  });

  it("report() builds correct summary", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValueOnce(3).mockReturnValueOnce(5);

    die.roll();
    die.roll();

    const report = die.report({ verbose: false });
    expect(report.type).toBe(DieType.D6);
    expect(report.times_rolled).toBe(2);
    expect(report.latest_record).toBeTruthy();
    expect(report.history).toBeUndefined();
  });

  it("report({ includeHistory:true }) includes history", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(2);
    die.roll();

    const report = die.report({ includeHistory: true });
    expect(report.history).toBeTruthy();
    expect(report.history!.length).toBe(1);
  });

  // ---------------------
  // toString()
  // ---------------------
  it("toString() reports 'not rolled yet' when empty", () => {
    const die = new Die(DieType.D6);
    expect(die.toString()).toMatch(/not rolled yet/);
  });

  it("toString() includes latest roll when available", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(5);
    die.roll();

    expect(die.toString()).toMatch(/latest=/);
    expect(die.toString()).toMatch(/total rolls=1/);
  });

  // ---------------------
  // toJSON()
  // ---------------------
  it("toJSON() returns full verbose report", () => {
    const die = new Die(DieType.D6);
    (coreRoll as Mock).mockReturnValue(4);
    die.roll();

    const json = die.toJSON();
    expect(json.type).toBe(DieType.D6);
    expect(json.times_rolled).toBe(1);
    expect(json.history!.length).toBe(1);
    expect(json.latest_record).toBeTruthy();
  });

  // ---------------------
  // SUBCLASSING BEHAVIOUR
  // ---------------------
  it("subclasses can override roll() to store different record types", () => {
    class ModifiedDie extends Die<ModifiedDieRollRecord> {
      roll(): number {
        this.reset();
        const value = 10;
        const mod = 2;
        this.rolls.add({
          roll: value,
          modified: mod,
          timestamp: new Date(),
        });
        return value + mod;
      }
    }

    const die = new ModifiedDie(DieType.D6);
    const result = die.roll();
    expect(result).toBe(12);
    expect(die.historyFull[0].modified).toBe(2);
  });

  it("subclasses for targeted rolls store outcome correctly", () => {
    class TargetDie extends Die<TargetDieRollRecord> {
      roll(): number {
        this.reset();
        const roll = 7;
        const outcome = "success" as TargetDieRollRecord["outcome"];
        this.rolls.add({
          roll,
          outcome,
          timestamp: new Date(),
        });
        return roll;
      }
    }

    const die = new TargetDie(DieType.D8);
    die.roll();
    expect(die.historyFull[0].outcome).toBe("success");
  });
});
