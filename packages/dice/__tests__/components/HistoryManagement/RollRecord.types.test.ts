import { Outcome } from "@platonic-dice/core/entities";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TargetDieRollRecord,
  RollRecord,
} from "../../../src/components/historyManagement/RollRecord.types.js";

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

  const targetRecord: TargetDieRollRecord = {
    roll: 17,
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

  it("should be compatible with the RollRecord union", () => {
    const records: RollRecord[] = [dieRecord, modifiedRecord, targetRecord];
    expect(records).toHaveLength(3);
  });
});
