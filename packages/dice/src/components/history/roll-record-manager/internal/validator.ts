import type {
  RollRecord,
  DieRollRecord,
  ModifiedDieRollRecord,
  TestDieRollRecord,
} from "./roll-record.types";
import { Outcome } from "@platonic-dice/core";

/**
 * Runtime type-guards for RollRecord shapes.
 * Kept intentionally small and side-effect free.
 */
export function isDieRollRecord(
  record: RollRecord | null | undefined
): record is DieRollRecord {
  return (
    !!record &&
    typeof (record as any).roll === "number" &&
    (record as any).timestamp instanceof Date &&
    !("modified" in (record as any)) &&
    !("outcome" in (record as any))
  );
}

export function isModifiedDieRollRecord(
  record: RollRecord | null | undefined
): record is ModifiedDieRollRecord {
  return (
    !!record &&
    typeof (record as any).roll === "number" &&
    typeof (record as any).modified === "number" &&
    (record as any).timestamp instanceof Date &&
    !("outcome" in (record as any))
  );
}

export function isTargetDieRollRecord(
  record: RollRecord | null | undefined
): record is TestDieRollRecord {
  return (
    !!record &&
    typeof (record as any).roll === "number" &&
    "outcome" in (record as any) &&
    Object.values(Outcome).includes((record as any).outcome) &&
    (record as any).timestamp instanceof Date
  );
}

/** Remove timestamp property from a record (immutable-friendly) */
export function stripTimestamp<R extends RollRecord>(
  record: R
): Omit<R, "timestamp"> {
  const { timestamp, ...rest } = record as any;
  return rest as Omit<R, "timestamp">;
}

export default {
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
  stripTimestamp,
};
