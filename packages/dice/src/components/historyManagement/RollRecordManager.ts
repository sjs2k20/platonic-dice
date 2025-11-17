import type {
  RollRecord,
  DieRollRecord,
  ModifiedDieRollRecord,
  TargetDieRollRecord,
} from "./RollRecord.types";
import { Outcome } from "@platonic-dice/core";

/**
 * Default maximum number of roll records stored.
 */
export const DEFAULT_MAX_RECORDS = 1000;

/**
 * Utility class for managing roll history of Die and child/composite classes.
 *
 * Provides methods to add roll records, retrieve the last N rolls,
 * produce history reports, and manage roll record storage.
 *
 * @template R Type of roll record, defaults to all RollRecord variants.
 */
export class RollRecordManager<R extends RollRecord = RollRecord> {
  /** Internal storage of roll records */
  private records: R[] = [];
  /** Maximum number of roll records to retain */
  private maxRecords: number;

  constructor(maxRecords: number = DEFAULT_MAX_RECORDS) {
    this.maxRecords = maxRecords;
  }

  /** Returns a copy of all roll records (including timestamps) */
  get full(): R[] {
    return [...this.records];
  }

  /** Returns a copy of all roll records with timestamps stripped */
  get all(): Omit<R, "timestamp">[] {
    return this.records.map(RollRecordManager.stripTimestamp);
  }

  /** Returns the number of roll records stored */
  get length(): number {
    return this.records.length;
  }

  /** Returns the maximum number of roll records stored */
  get maxRecordsCount(): number {
    return this.maxRecords;
  }

  /** Adds a roll record to the history */
  add(record: R) {
    if (!record || typeof record !== "object") {
      throw new TypeError("Record must be an object");
    }

    if (
      !RollRecordManager.isDieRollRecord(record) &&
      !RollRecordManager.isModifiedDieRollRecord(record) &&
      !RollRecordManager.isTargetDieRollRecord(record)
    ) {
      throw new TypeError(
        "Record must be a valid DieRollRecord, ModifiedDieRollRecord, or TargetDieRollRecord"
      );
    }

    this.records.push(record);
    if (this.records.length > this.maxRecords) {
      this.records.shift(); // remove oldest
    }
  }

  /** Clears the roll history */
  clear() {
    this.records = [];
  }

  /** Returns the last N roll records */
  last(n: number = 1, verbose = false): (R | Omit<R, "timestamp">)[] {
    if (typeof n !== "number" || n < 1) {
      throw new TypeError("Parameter n must be a positive number.");
    }

    const len = this.records.length;
    if (len === 0) return [];

    const slice = this.records.slice(Math.max(len - n, 0));
    return verbose ? slice : slice.map(RollRecordManager.stripTimestamp);
  }

  /** Produces a roll history report */
  report(options?: {
    limit?: number;
    verbose?: boolean;
  }): (R | Omit<R, "timestamp">)[] {
    const { limit, verbose = false } = options || {};
    const n = Math.min(limit ?? this.records.length, this.records.length);
    return n === 0 ? [] : this.last(n, verbose);
  }

  /** Human-readable string summary of roll history */
  toString(): string {
    if (this.records.length === 0) {
      return `RollRecordManager: empty (maxRecords=${this.maxRecords})`;
    }
    const lastRecord = this.records[this.records.length - 1];
    return `RollRecordManager: ${this.records.length}/${
      this.maxRecords
    } rolls (last: ${lastRecord.roll} @ ${lastRecord.timestamp.toISOString()})`;
  }

  /** Returns the full history as an array of records */
  toJSON(): R[] {
    return this.full;
  }

  // -----------------------
  // PRIVATE HELPER METHODS
  // -----------------------
  private static isDieRollRecord(record: RollRecord): record is DieRollRecord {
    return (
      record &&
      typeof record.roll === "number" &&
      record.timestamp instanceof Date &&
      !("modified" in record) &&
      !("outcome" in record)
    );
  }

  private static isModifiedDieRollRecord(
    record: RollRecord
  ): record is ModifiedDieRollRecord {
    return (
      record &&
      typeof record.roll === "number" &&
      typeof (record as ModifiedDieRollRecord).modified === "number" &&
      record.timestamp instanceof Date &&
      !("outcome" in record)
    );
  }

  private static isTargetDieRollRecord(
    record: RollRecord
  ): record is TargetDieRollRecord {
    return (
      record &&
      typeof record.roll === "number" &&
      "outcome" in record &&
      Object.values(Outcome).includes(
        (record as TargetDieRollRecord).outcome
      ) &&
      record.timestamp instanceof Date
    );
  }

  /** Remove timestamp from a record */
  private static stripTimestamp<R extends RollRecord>(
    record: R
  ): Omit<R, "timestamp"> {
    const { timestamp, ...rest } = record;
    return rest;
  }
}
