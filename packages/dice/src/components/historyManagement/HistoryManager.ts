import type { RollRecord } from "./RollRecord.types";

/**
 * Generic interface for a roll history manager.
 *
 * Any class implementing this interface should support basic operations
 * needed by Die subclasses: add, clear, report, and read-only accessors.
 *
 * Compatible with RollRecordManager<R> and RollHistoryCache<R>.
 */
export interface HistoryManager<R extends RollRecord> {
  add(record: R): void;
  clear(): void;
  report(options?: any): (R | Omit<R, "timestamp">)[];
  readonly length: number;
  readonly all: Omit<R, "timestamp">[];
  readonly full: R[];
}
