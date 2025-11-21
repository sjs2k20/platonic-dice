import { describe, it, expect } from "vitest";
import { Outcome } from "@platonic-dice/core";
import {
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
  isModifiedTestDieRollRecord,
  stripTimestamp,
} from "@dice/components/die-history/internal";
import type {
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
  ModifiedTestDieRollRecord,
} from "@dice/types";

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

  const modifiedTestRecord: ModifiedTestDieRollRecord = {
    roll: 15,
    modified: 20,
    outcome: Outcome.Success,
    timestamp: now,
  };

  it("recognises valid shapes", () => {
    expect(isDieRollRecord(dieRecord)).toBe(true);
    expect(isModifiedDieRollRecord(modifiedRecord)).toBe(true);
    expect(isTargetDieRollRecord(targetRecord)).toBe(true);
    expect(isModifiedTestDieRollRecord(modifiedTestRecord)).toBe(true);
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
    // missing modified in ModifiedTestDieRollRecord
    expect(
      isModifiedTestDieRollRecord({
        roll: 5,
        outcome: Outcome.Success,
        timestamp: now,
      } as any)
    ).toBe(false);
  });

  it("distinguishes between TestDieRollRecord and ModifiedTestDieRollRecord", () => {
    expect(isTargetDieRollRecord(targetRecord)).toBe(true);
    expect(isModifiedTestDieRollRecord(targetRecord)).toBe(false);

    expect(isTargetDieRollRecord(modifiedTestRecord)).toBe(false);
    expect(isModifiedTestDieRollRecord(modifiedTestRecord)).toBe(true);
  });

  it("stripTimestamp removes timestamp and preserves other fields", () => {
    const stripped = stripTimestamp(dieRecord);
    expect((stripped as any).timestamp).toBeUndefined();
    expect((stripped as any).roll).toBe(dieRecord.roll);

    const strippedModTest = stripTimestamp(modifiedTestRecord);
    expect((strippedModTest as any).timestamp).toBeUndefined();
    expect((strippedModTest as any).roll).toBe(modifiedTestRecord.roll);
    expect((strippedModTest as any).modified).toBe(modifiedTestRecord.modified);
    expect((strippedModTest as any).outcome).toBe(modifiedTestRecord.outcome);
  });
});
