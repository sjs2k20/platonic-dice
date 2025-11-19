import { describe, it, expect } from "vitest";
import { RollRecordFactory } from "../../../../src/components/history/roll-record-manager/internal/roll-record-factory";
import { DieType, RollType } from "@platonic-dice/core";

describe("RollRecordFactory", () => {
  const factory = new RollRecordFactory();

  it("should create a valid DieRollRecord for normal rolls", () => {
    const record = factory.createNormalRoll(DieType.D6);
    expect(record).toMatchObject({
      roll: expect.any(Number),
      timestamp: expect.any(Date),
    });
    expect(record.roll).toBeGreaterThanOrEqual(1);
    expect(record.roll).toBeLessThanOrEqual(6);
  });

  it("should create a valid ModifiedDieRollRecord for modified rolls", () => {
    const record = factory.createModifiedRoll(DieType.D20, (n) => n + 2);
    expect(record).toMatchObject({
      roll: expect.any(Number),
      modified: expect.any(Number),
      timestamp: expect.any(Date),
    });
    expect(record.roll).toBeGreaterThanOrEqual(1);
    expect(record.roll).toBeLessThanOrEqual(20);
    expect(record.modified).toBe(record.roll + 2);
  });

  it("should create a valid TestDieRollRecord for test rolls", () => {
    const record = factory.createTestRoll(DieType.D10, {
      testType: "at_least",
      target: 5,
    });
    expect(record).toMatchObject({
      roll: expect.any(Number),
      outcome: expect.any(String),
      timestamp: expect.any(Date),
    });
    expect(record.roll).toBeGreaterThanOrEqual(1);
    expect(record.roll).toBeLessThanOrEqual(10);
    expect(["Success", "Failure"].map((o) => o.toLowerCase())).toContain(
      record.outcome.toLowerCase()
    );
  });

  it("should throw an error for invalid RollType in createNormalRoll", () => {
    expect(() =>
      factory.createNormalRoll(DieType.D6, "InvalidRollType" as RollType)
    ).toThrow(TypeError);
  });
});
