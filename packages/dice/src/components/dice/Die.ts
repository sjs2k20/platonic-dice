import { DieType, RollType, roll } from "@platonic-dice/core";
import {
  RollRecordManager,
  type RollRecord,
  type DieRollRecord,
} from "../historyManagement";

/**
 * Generic base Die class
 *
 * @template R - Type of RollRecord this die produces (default DieRollRecord)
 */
export class Die<R extends RollRecord = DieRollRecord> {
  private typeValue: DieType;
  private resultValue: number | null = null;
  private rolls: RollRecordManager<R>;

  constructor(type: DieType) {
    if (!Object.values(DieType).includes(type)) {
      throw new Error(`Invalid die type: ${type}`);
    }
    this.typeValue = type;
    this.rolls = new RollRecordManager<R>();
  }

  get type(): DieType {
    return this.typeValue;
  }

  get result(): number | null {
    return this.resultValue;
  }

  get history(): Omit<R, "timestamp">[] {
    return this.rolls.all;
  }

  get historyFull(): R[] {
    return this.rolls.full;
  }

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

  private reset(complete = false) {
    this.resultValue = null;
    if (complete) this.rolls.clear();
  }

  roll(rollType: RollType | null = null): number {
    if (rollType !== null && !Object.values(RollType).includes(rollType)) {
      throw new Error(`Invalid roll type: ${rollType}`);
    }

    this.reset();
    this.resultValue = roll(this.typeValue, rollType);
    this.rolls.add({ roll: this.resultValue, timestamp: new Date() } as R);
    return this.resultValue;
  }

  historyDetailed(options?: { limit?: number; verbose?: boolean }) {
    return this.rolls.report(options);
  }

  report(options?: {
    limit?: number;
    verbose?: boolean;
    includeHistory?: boolean;
  }) {
    const { limit, verbose = false, includeHistory = false } = options || {};
    const latest = this.rolls.report({ verbose, limit: 1 })[0] || null;

    return {
      type: this.typeValue,
      times_rolled: this.rolls.length,
      latest_record: latest,
      ...(includeHistory && { history: this.rolls.report({ verbose, limit }) }),
    } as const;
  }

  toString(): string {
    if (this.rolls.length === 0)
      return `Die(${this.typeValue}): not rolled yet`;

    const latest = this.historyDetailed({ verbose: true, limit: 1 })[0];
    return `Die(${this.typeValue}): latest=${JSON.stringify(
      latest
    )}, total rolls=${this.rolls.length}`;
  }

  toJSON() {
    return this.report({ verbose: true, includeHistory: true });
  }
}
