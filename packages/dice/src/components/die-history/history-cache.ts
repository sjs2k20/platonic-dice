import { RollRecordManager, DEFAULT_MAX_RECORDS } from "./internal";
import type { RollRecord } from "@dice/types";

/**
 * A wrapper for RollRecordManager that maintains multiple, independently capped histories.
 *
 * Useful for scenarios where a single RollRecordManager needs to support "history parking",
 * such as storing separate roll histories per modifier or context.
 *
 * @template R - The type of roll records stored
 */
export class HistoryCache<R extends RollRecord = RollRecord> {
  private readonly cache = new Map<string, RollRecordManager<R>>();
  private readonly maxRecordsPerKey: number;
  private readonly maxKeys: number;
  private activeKey: string | undefined;

  constructor({
    maxRecordsPerKey = Math.floor(DEFAULT_MAX_RECORDS / 10),
    maxKeys = 10,
  } = {}) {
    this.maxRecordsPerKey = maxRecordsPerKey;
    this.maxKeys = maxKeys;
  }

  /** Sets the currently active history key */
  setActiveKey(key: string) {
    if (!this.cache.has(key)) {
      if (this.cache.size >= this.maxKeys) {
        const oldestKey = this.cache.keys().next().value;
        if (!oldestKey)
          throw new Error("Unexpected empty cache while evicting oldest key");
        this.cache.delete(oldestKey);
      }
      this.cache.set(key, new RollRecordManager<R>(this.maxRecordsPerKey));
    }
    this.activeKey = key;
  }

  /** Returns the currently active RollRecordManager */
  get activeManager(): RollRecordManager<R> | undefined {
    if (!this.activeKey) return undefined;
    return this.cache.get(this.activeKey);
  }

  /** Adds a roll record to the active history */
  add(record: R) {
    const manager = this.activeManager;
    if (!manager)
      throw new Error("No active history key set. Call setActiveKey() first.");
    manager.add(record);
  }

  /** Returns a copy of the roll records for the active key */
  getAll(verbose = false): R[] | Omit<R, "timestamp">[] {
    const manager = this.activeManager;
    if (!manager) return [];
    return verbose ? manager.full : manager.all;
  }

  /** Clears all roll records for the active key */
  clearActive() {
    const manager = this.activeManager;
    if (manager) manager.clear();
  }

  /** Clears all cached histories */
  clearAll() {
    this.cache.clear();
    this.activeKey = undefined;
  }

  /** Returns a roll history report for all cached keys */
  report({
    limit,
    verbose = false,
  }: { limit?: number; verbose?: boolean } = {}): Record<
    string,
    (R | Omit<R, "timestamp">)[]
  > {
    const reports: Record<string, (R | Omit<R, "timestamp">)[]> = {};
    for (const [key, manager] of this.cache.entries()) {
      reports[key] = manager.report({ limit, verbose });
    }
    return reports;
  }

  /** Returns a string summary of the cache */
  toString(): string {
    return `RollHistoryCache: ${this.cache.size} keys (active: ${
      this.activeKey ?? "none"
    })`;
  }

  /** Returns a JSON-friendly object mapping keys to arrays of RollRecords */
  toJSON(): Record<string, R[]> {
    const json: Record<string, R[]> = {};
    for (const [key, manager] of this.cache.entries()) {
      json[key] = manager.toJSON();
    }
    return json;
  }
}
