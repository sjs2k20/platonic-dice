import { DieType, RollType, roll as coreRoll } from "@platonic-dice/core";
import {
  RollRecordManager,
  type RollRecord,
  type DieRollRecord,
  type HistoryManager,
} from "./historyManagement";

/**
 * Base Die class.
 *
 * Generic over:
 * - `R`: the roll-record shape
 * - `HM`: the manager implementation (must satisfy HistoryManager<R>)
 */
export class Die<
  R extends RollRecord = DieRollRecord,
  HM extends HistoryManager<R> = RollRecordManager<R>
> {
  /** the die type (e.g. DieType.D6) */
  private readonly typeValue: DieType;

  /** most recent roll result, or undefined if none yet */
  private resultValue: number | undefined;

  /**
   * Roll history manager. Protected so subclasses can access to append
   * alternate record shapes (e.g. Modified or Target records).
   */
  protected readonly rolls: HM;

  /**
   * Create a Die.
   * @param type - Die type (must be a value from `DieType`)
   * @param rollsManager - optional custom manager for roll records
   */
  constructor(type: DieType, rollsManager?: HM) {
    if (!Object.values(DieType).includes(type)) {
      throw new Error(`Invalid die type: ${type}`);
    }
    this.typeValue = type;

    // Default to RollRecordManager if no custom manager provided.
    // Type assertion needed because TS can't verify HM is RollRecordManager<R>.
    this.rolls = rollsManager ?? (new RollRecordManager<R>() as unknown as HM);
  }

  /** The die type (e.g. "d6") */
  get type(): DieType {
    return this.typeValue;
  }

  /** The most recent roll result, or undefined if not rolled yet */
  get result(): number | undefined {
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
    this.resultValue = undefined;
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
  roll(rollType?: RollType): number {
    if (rollType !== undefined && !Object.values(RollType).includes(rollType)) {
      throw new Error(`Invalid roll type: ${rollType}`);
    }

    this.reset();
    this.resultValue = coreRoll(this.typeValue, rollType);

    // Default behaviour: record a plain DieRollRecord.
    const record = {
      roll: this.resultValue,
      timestamp: new Date(),
    } as R;

    this.rolls.add(record);
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
    const report = this.report({ verbose: true, includeHistory: true });
    // Convert undefined latest_record to null for backend/API
    report.latest_record = report.latest_record ?? null;
    return report;
  }
}
