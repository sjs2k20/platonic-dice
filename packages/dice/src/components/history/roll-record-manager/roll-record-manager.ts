import {
  RollRecordStorage,
  isDieRollRecord,
  isModifiedDieRollRecord,
  isTargetDieRollRecord,
  stripTimestamp,
  type RollRecord,
} from "./internal";

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
  private storage: RollRecordStorage<R>;
  /** Maximum number of roll records to retain */
  private maxRecords: number;

  constructor(maxRecords: number = DEFAULT_MAX_RECORDS) {
    this.maxRecords = maxRecords;
    this.storage = new RollRecordStorage<R>(maxRecords);
  }

  /** Returns a copy of all roll records (including timestamps) */
  get full(): R[] {
    return this.storage.full;
  }

  /** Returns a copy of all roll records with timestamps stripped */
  get all(): Omit<R, "timestamp">[] {
    return this.storage.full.map(stripTimestamp);
  }

  /** Returns the number of roll records stored */
  get length(): number {
    return this.storage.size;
  }

  /** Returns the maximum number of roll records stored */
  get maxRecordsCount(): number {
    return this.storage.maxRecordsCount;
  }

  /** Adds a roll record to the history */
  add(record: R) {
    if (!record || typeof record !== "object") {
      throw new TypeError("Record must be an object");
    }
    if (
      !isDieRollRecord(record as any) &&
      !isModifiedDieRollRecord(record as any) &&
      !isTargetDieRollRecord(record as any)
    ) {
      throw new TypeError(
        "Record must be a valid DieRollRecord, ModifiedDieRollRecord, or TargetDieRollRecord"
      );
    }

    this.storage.add(record);
  }

  /** Clears the roll history */
  clear() {
    this.storage.clear();
  }

  /** Returns the last N roll records */
  last(n: number = 1, verbose = false): (R | Omit<R, "timestamp">)[] {
    if (typeof n !== "number" || n < 1) {
      throw new TypeError("Parameter n must be a positive number.");
    }
    const len = this.storage.size;
    if (len === 0) return [];

    const slice = this.storage.last(n);
    return verbose ? slice : slice.map(stripTimestamp);
  }

  /** Produces a roll history report */
  report(options?: {
    limit?: number;
    verbose?: boolean;
  }): (R | Omit<R, "timestamp">)[] {
    const { limit, verbose = false } = options || {};
    const n = Math.min(limit ?? this.storage.size, this.storage.size);
    return n === 0 ? [] : this.last(n, verbose);
  }

  /** Human-readable string summary of roll history */
  toString(): string {
    if (this.storage.size === 0) {
      return `RollRecordManager: empty (maxRecords=${this.maxRecords})`;
    }
    const lastRecord = this.storage.full[this.storage.size - 1];
    return `RollRecordManager: ${this.storage.size}/${
      this.maxRecords
    } rolls (last: ${lastRecord.roll} @ ${lastRecord.timestamp.toISOString()})`;
  }

  /** Returns the full history as an array of records */
  toJSON(): R[] {
    return this.storage.toJSON();
  }
  // Note: Validation and stripping moved to internal/validator.ts
}
