import { describe, it, expect } from "vitest";
import {
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
  stripTimestamp,
} from "@dice/components/history/roll-record-manager/internal/validator";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
} from "@dice/components/history/roll-record-manager/internal/roll-record.types";
import { Outcome } from "@platonic-dice/core";

describe("RollRecord validator", () => {
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

  it("recognises valid shapes", () => {
    expect(isDieRollRecord(dieRecord)).toBe(true);
    expect(isModifiedDieRollRecord(modifiedRecord)).toBe(true);
    expect(isTargetDieRollRecord(targetRecord)).toBe(true);
  });

  it("rejects invalid shapes", () => {
    // missing timestamp
    expect(isDieRollRecord({ roll: 5 } as any)).toBe(false);
    // wrong modified type
    expect(isModifiedDieRollRecord({ roll: 5, modified: "x" } as any)).toBe(
      false
    );
    // invalid outcome
    expect(isTargetDieRollRecord({ roll: 5, outcome: "nope" } as any)).toBe(
      false
    );
  });

  it("stripTimestamp removes timestamp and preserves other fields", () => {
    const stripped = stripTimestamp(dieRecord);
    expect((stripped as any).timestamp).toBeUndefined();
    expect((stripped as any).roll).toBe(dieRecord.roll);
  });
});
