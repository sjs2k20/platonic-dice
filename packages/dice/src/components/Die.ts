import { DieType, RollType, roll as coreRoll } from "@platonic-dice/core";
import {
  RollRecordManager,
  DEFAULT_MAX_RECORDS,
  type RollRecord,
  type DieRollRecord,
} from "./historyManagement";

/**
 * Base Die class.
 *
 * Generic over the roll-record shape so subclasses can specialise:
 * - `Die<DieRollRecord>` (default)
 * - `Die<ModifiedDieRollRecord>`
 * - `Die<TargetDieRollRecord>`
 *
 * Subclasses should override `roll()` if they need to store records with
 * extra fields (e.g. `modified` or `outcome`).
 *
 * @template R - The RollRecord variant produced by this Die (defaults to DieRollRecord)
 */
export class Die<R extends RollRecord = DieRollRecord> {
  /** the die type (e.g. DieType.D6) */
  private readonly typeValue: DieType;

  /** most recent roll result, or null if none yet */
  private resultValue: number | null = null;

  /**
   * Roll history manager. Protected so subclasses can access to append
   * alternate record shapes (e.g. Modified or Target records).
   */
  protected readonly rolls: RollRecordManager<R>;

  /**
   * Create a Die.
   * @param type - Die type (must be a value from `DieType`)
   * @param maxHistory - optional maximum history size to pass to the manager
   */
  constructor(type: DieType, maxHistory = DEFAULT_MAX_RECORDS) {
    if (!Object.values(DieType).includes(type)) {
      throw new Error(`Invalid die type: ${type}`);
    }
    this.typeValue = type;
    this.rolls = new RollRecordManager<R>(maxHistory);
  }

  /** The die type (e.g. "d6") */
  get type(): DieType {
    return this.typeValue;
  }

  /** The most recent roll result, or null if not rolled yet */
  get result(): number | null {
    return this.resultValue;
  }

  /** History without timestamps (array of records with timestamp removed) */
  get history(): Omit<R, "timestamp">[] {
    return this.rolls.all;
  }

  /** Full history including timestamps */
  get historyFull(): R[] {
    return this.rolls.full;
  }

  /** Number of faces / sides on this die */
  get faceCount(): number {
    const lookup: Record<DieType, number> = {
      [DieType.D4]: 4,
      [DieType.D6]: 6,
      [DieType.D8]: 8,
      [DieType.D10]: 10,
      [DieType.D12]: 12,
      [DieType.D20]: 20,
    };
    return lookup[this.typeValue];
  }

  /**
   * Reset die state.
   * @param complete - if true, clear history as well
   */
  protected reset(complete = false): void {
    this.resultValue = null;
    if (complete) this.rolls.clear();
  }

  /**
   * Roll the die and store a DieRollRecord by default.
   *
   * Subclasses that produce a different record shape SHOULD override this
   * method and add the appropriate record type to `this.rolls`.
   *
   * @param rollType - optional advantage/disadvantage mode
   * @returns the numeric roll result
   */
  roll(rollType: RollType | null = null): number {
    if (rollType !== null && !Object.values(RollType).includes(rollType)) {
      throw new Error(`Invalid roll type: ${rollType}`);
    }

    this.reset();
    this.resultValue = coreRoll(this.typeValue, rollType);

    // Default behaviour: record a plain DieRollRecord.
    // This is safe because the generic default R === DieRollRecord.
    // If a subclass uses a different R, that subclass should override roll()
    // to push its own record shape instead.
    const record: unknown = {
      roll: this.resultValue,
      timestamp: new Date(),
    };

    // Use a type assertion here: for the base class R will be DieRollRecord so
    // this assertion is correct. Subclasses should override if they need a
    // different record shape and avoid relying on this.
    this.rolls.add(record as R);

    return this.resultValue;
  }

  /**
   * Retrieve roll history with options.
   * @param options.limit - maximum number of records
   * @param options.verbose - include timestamps if true
   * @returns array of records (with timestamps if verbose=true)
   */
  historyDetailed(options?: { limit?: number; verbose?: boolean }) {
    return this.rolls.report(options);
  }

  /**
   * Build a simple report for the die.
   *
   * Returned object shape:
   * {
   *   type: DieType,
   *   times_rolled: number,
   *   latest_record: R | Omit<R,'timestamp'> | null,
   *   history?: R[] | Omit<R,'timestamp'>[]   // if includeHistory === true
   * }
   *
   * Subclasses can refine the report shape if desired.
   */
  report(options?: {
    limit?: number;
    verbose?: boolean;
    includeHistory?: boolean;
  }): {
    type: DieType;
    times_rolled: number;
    latest_record: R | Omit<R, "timestamp"> | null;
    history?: (R | Omit<R, "timestamp">)[];
  } {
    const { limit, verbose = false, includeHistory = false } = options || {};

    // ask the manager for the most recent record (limit:1)
    const latestArr = this.rolls.report({ verbose, limit: 1 });
    const latest = latestArr.length > 0 ? latestArr[0] : null;

    const baseReport: {
      type: DieType;
      times_rolled: number;
      latest_record: R | Omit<R, "timestamp"> | null;
      history?: (R | Omit<R, "timestamp">)[];
    } = {
      type: this.typeValue,
      times_rolled: this.rolls.length,
      latest_record: latest ?? null,
    };

    if (includeHistory) {
      baseReport.history = this.rolls.report({ verbose, limit });
    }

    return baseReport;
  }

  /** Human-friendly summary */
  toString(): string {
    if (this.rolls.length === 0) {
      return `Die(${this.typeValue}): not rolled yet`;
    }
    const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];
    return `Die(${this.typeValue}): latest=${JSON.stringify(
      latest
    )}, total rolls=${this.rolls.length}`;
  }

  /** JSON representation (includes history) */
  toJSON() {
    return this.report({ verbose: true, includeHistory: true });
  }
}
