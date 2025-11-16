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

  /**
   * @param maxRecords Maximum number of roll records to retain (default 1000)
   */
  constructor(maxRecords: number = DEFAULT_MAX_RECORDS) {
    this.maxRecords = maxRecords;
  }

  /**
   * The maximum number of roll records retained.
   */
  get maxRecordsCount(): number {
    return this.maxRecords;
  }

  /**
   * Returns a copy of all roll records (including timestamps)
   */
  get full(): R[] {
    return [...this.records];
  }

  /**
   * Returns a copy of all roll records with timestamps stripped
   */
  get all(): Omit<R, "timestamp">[] {
    return this.records.map(RollRecordManager.stripTimestamp);
  }

  /**
   * Returns the number of roll records stored
   */
  get length(): number {
    return this.records.length;
  }

  /**
   * Adds a roll record to the history.
   * Automatically infers the type of RollRecord.
   * @param record Roll record to add
   */
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

  /**
   * Clears the roll history
   */
  clear() {
    this.records = [];
  }

  /**
   * Returns the last N roll records.
   *
   * @param n Number of records to retrieve (default 1)
   * @param verbose Include timestamps if true (default false)
   * @returns Array of roll records; timestamps included if verbose=true, otherwise omitted
   */
  last(n: number = 1, verbose = false): (R | Omit<R, "timestamp">)[] {
    if (typeof n !== "number" || n < 1) {
      throw new TypeError("Parameter n must be a positive number.");
    }

    const len = this.records.length;
    if (len === 0) return [];

    const slice = this.records.slice(Math.max(len - n, 0));
    if (!verbose) return slice.map(RollRecordManager.stripTimestamp);
    return slice;
  }

  /**
   * Produces a roll history report.
   *
   * @param options.limit Maximum number of records to return (default all)
   * @param options.verbose Include timestamps if true (default false)
   * @returns Array of roll records according to options
   */
  report(options?: {
    limit?: number;
    verbose?: boolean;
  }): (R | Omit<R, "timestamp">)[] {
    const { limit, verbose = false } = options || {};

    // Ensure n is at least 1 if there are records, otherwise return []
    const n = Math.max(1, limit ?? this.records.length);
    return this.records.length === 0
      ? []
      : this.last(Math.min(n, this.records.length), verbose);
  }

  /**
   * Human-readable string summary of roll history
   */
  toString(): string {
    if (this.records.length === 0) {
      return `RollRecordManager: empty (maxRecords=${this.maxRecords})`;
    }
    const lastRecord = this.records[this.records.length - 1];
    return `RollRecordManager: ${this.records.length}/${
      this.maxRecords
    } rolls (last: ${lastRecord.roll} @ ${lastRecord.timestamp.toISOString()})`;
  }

  /**
   * Returns the full history as an array of records
   */
  toJSON(): R[] {
    return this.full;
  }

  // -----------------------
  // PRIVATE HELPER METHODS
  // -----------------------

  /** Type guard for simple die roll record */
  private static isDieRollRecord(record: RollRecord): record is DieRollRecord {
    return (
      record &&
      typeof record.roll === "number" &&
      record.timestamp instanceof Date &&
      !("modified" in record) &&
      !("outcome" in record)
    );
  }

  /** Type guard for modified die roll record */
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

  /** Type guard for targeted die roll record */
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
