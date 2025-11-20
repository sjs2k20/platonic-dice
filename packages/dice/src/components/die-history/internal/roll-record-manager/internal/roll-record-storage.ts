import type { RollRecord } from "@dice/types";

/**
 * Simple in-memory storage for roll records with a fixed capacity.
 *
 * This class focuses solely on storage and eviction policy. It does not
 * perform shape validation of records (delegated to validators elsewhere).
 */
export class RollRecordStorage<R extends RollRecord = RollRecord> {
  private records: R[] = [];
  private readonly maxRecords: number;

  /**
   * Create a new storage container.
   * @param maxRecords Maximum number of records to retain (FIFO eviction).
   */
  constructor(maxRecords: number = 1000) {
    if (typeof maxRecords !== "number" || maxRecords < 1) {
      throw new TypeError("maxRecords must be a positive number");
    }
    this.maxRecords = Math.floor(maxRecords);
  }

  /** Number of records currently stored */
  get size(): number {
    return this.records.length;
  }

  /** Configured maximum number of records */
  get maxRecordsCount(): number {
    return this.maxRecords;
  }

  /** Returns a shallow copy of all records (timestamps preserved) */
  get full(): R[] {
    return [...this.records];
  }

  /** Add a new record and evict oldest if capacity exceeded */
  add(record: R): void {
    if (!record || typeof record !== "object") {
      throw new TypeError("Record must be an object");
    }

    this.records.push(record);
    if (this.records.length > this.maxRecords) {
      this.records.shift();
    }
  }

  /** Clear all stored records */
  clear(): void {
    this.records = [];
  }

  /** Return the most recent N records in chronological order (oldest first) */
  last(n: number = 1): R[] {
    if (typeof n !== "number" || n < 1) {
      throw new TypeError("Parameter n must be a positive number");
    }
    const len = this.records.length;
    if (len === 0) return [];
    const slice = this.records.slice(Math.max(len - n, 0));
    return [...slice];
  }

  /** JSON-friendly copy of stored records */
  toJSON(): R[] {
    return this.full;
  }
}

export default RollRecordStorage;
