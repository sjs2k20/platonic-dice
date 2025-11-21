import { describe, it, expect } from "vitest";
import { Outcome } from "@platonic-dice/core/entities";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
  ModifiedTestDieRollRecord,
  RollRecord,
} from "@dice/types";

describe("RollRecord types (runtime shape validation)", () => {
  const now = new Date();

  const dieRecord: DieRollRecord = {
    roll: 5,
    timestamp: now,
  };

  const modifiedRecord: ModifiedDieRollRecord = {
    roll: 10,
    modified: 12,
    timestamp: now,
  };

  const targetRecord: TestDieRollRecord = {
    roll: 17,
    outcome: Outcome.Success,
    timestamp: now,
  };

  const modifiedTestRecord: ModifiedTestDieRollRecord = {
    roll: 15,
    modified: 20,
    outcome: Outcome.Success,
    timestamp: now,
  };

  it("should have the correct shape for DieRollRecord", () => {
    expect(dieRecord).toHaveProperty("roll");
    expect(dieRecord).toHaveProperty("timestamp");
    expect(dieRecord.timestamp).toBeInstanceOf(Date);
    expect(Object.keys(dieRecord)).toHaveLength(2);
  });

  it("should have the correct shape for ModifiedDieRollRecord", () => {
    expect(modifiedRecord).toHaveProperty("roll");
    expect(modifiedRecord).toHaveProperty("modified");
    expect(modifiedRecord).toHaveProperty("timestamp");
    expect(modifiedRecord.timestamp).toBeInstanceOf(Date);
  });

  it("should have the correct shape for TargetDieRollRecord", () => {
    expect(targetRecord).toHaveProperty("roll");
    expect(targetRecord).toHaveProperty("outcome");
    expect(targetRecord).toHaveProperty("timestamp");
    expect(targetRecord.timestamp).toBeInstanceOf(Date);
  });

  it("should have the correct shape for ModifiedTestDieRollRecord", () => {
    expect(modifiedTestRecord).toHaveProperty("roll");
    expect(modifiedTestRecord).toHaveProperty("modified");
    expect(modifiedTestRecord).toHaveProperty("outcome");
    expect(modifiedTestRecord).toHaveProperty("timestamp");
    expect(modifiedTestRecord.timestamp).toBeInstanceOf(Date);
    expect(modifiedTestRecord.roll).toBe(15);
    expect(modifiedTestRecord.modified).toBe(20);
    expect(modifiedTestRecord.outcome).toBe(Outcome.Success);
  });

  it("should be compatible with the RollRecord union", () => {
    const records: RollRecord[] = [
      dieRecord,
      modifiedRecord,
      targetRecord,
      modifiedTestRecord,
    ];
    expect(records).toHaveLength(4);
  });
});
