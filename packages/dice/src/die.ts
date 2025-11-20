import { DieType, RollType } from "@platonic-dice/core";

import type {
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
} from "@platonic-dice/core";

import { RollRecordFactory, HistoryCache } from "@dice/components";

import type { RollRecord } from "@dice/types";

/**
 * Represents a single die with flexible history tracking.
 *
 * The Die class provides:
 * - Normal rolls (numeric)
 * - Modified rolls (numeric or functional modifiers)
 * - Test rolls (success/failure evaluation)
 *
 * Each roll type is stored independently in a `RollHistoryCache`.
 *
 * Example:
 * ```ts
 * const d20 = new Die(DieType.D20);
 * const result = d20.roll(); // normal roll
 * const modResult = d20.rollMod(n => n + 2); // modified roll
 * const testResult = d20.rollTest({ testType: "AtLeast", target: 15 });
 * ```
 */
export class Die {
  private readonly typeValue: DieType;
  private readonly rolls: HistoryCache<RollRecord>;
  private resultValue?: number;
  private readonly recordFactory = new RollRecordFactory();

  /** Keys used internally for history separation */
  private static readonly NORMAL_KEY = "normal";
  private static readonly MODIFIER_KEY = "modifier";
  private static readonly TEST_KEY = "test";

  /**
   * Create a new Die instance.
   * @param type - The die type (must be a value from `DieType`)
   * @param historyCache - Optional custom `RollHistoryCache` instance
   */
  constructor(type: DieType, historyCache?: HistoryCache<RollRecord>) {
    if (!Object.values(DieType).includes(type)) {
      throw new Error(`Invalid die type: ${type}`);
    }
    this.typeValue = type;
    this.rolls = historyCache ?? new HistoryCache({ maxKeys: 10 });
  }

  /**
   * Notes on behavior and contracts
   * - `resultValue` holds the most recent numeric value produced by a roll
   *   operation. It is updated from factory-produced records: for normal and
   *   test rolls it tracks `record.roll`; for modified rolls it tracks
   *   `record.modified`.
   * - `rolls` is a `HistoryCache` that stores separate histories keyed by
   *   roll type (normal/modifier/test). Each public roll method sets the
   *   corresponding active key, creates a factory-produced record and adds
   *   it to the active history. Record shape validation happens at the
   *   `RollRecordManager.add()` boundary.
   */

  /** The die type (e.g., `d6`, `d20`) */
  get type(): DieType {
    return this.typeValue;
  }

  /** The most recent numeric roll result, or undefined if not rolled yet */
  get result(): number | undefined {
    return this.resultValue;
  }

  /** Number of faces on this die */
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
   * Reset the most recent result.
   * @param complete - If true, clears all histories for all roll types
   */
  reset(complete = false): void {
    this.resultValue = undefined;
    if (complete) this.rolls.clearAll();
  }

  /**
   * Perform a normal die roll.
   * @param rollType - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`)
   * @returns The numeric result
   */
  roll(rollType?: RollType): number {
    if (rollType !== undefined && !Object.values(RollType).includes(rollType)) {
      throw new Error(`Invalid roll type: ${rollType}`);
    }

    // Delegate record creation to the RollRecordFactory to centralize shape
    const record = this.recordFactory.createNormalRoll(
      this.typeValue,
      rollType
    );
    this.resultValue = record.roll;

    this.rolls.setActiveKey(Die.NORMAL_KEY);
    this.rolls.add(record);

    return record.roll;
  }

  /**
   * Perform a roll with a modifier.
   *
   * @param modifier - Numeric or functional modifier (function `(n: number) => number` or `RollModifierInstance`)
   * @param rollType - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`)
   * @returns The modified numeric result
   *
   * Example:
   * ```ts
   * d20.rollMod(n => n + 2); // adds +2 to the roll
   * ```
   */
  rollMod(
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollType
  ): number {
    const record = this.recordFactory.createModifiedRoll(
      this.typeValue,
      modifier,
      rollType
    );
    this.resultValue = record.modified;

    this.rolls.setActiveKey(Die.MODIFIER_KEY);
    this.rolls.add(record);

    return record.modified;
  }

  /**
   * Perform a roll against test conditions (success/failure evaluation).
   *
   * @param testConditions - Test conditions (plain object or `TestConditionsInstance`)
   * @param rollType - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`)
   * @returns The base numeric roll
   *
   * Example:
   * ```ts
   * d20.rollTest({ testType: "AtLeast", target: 15 });
   * ```
   */
  rollTest(
    testConditions: TestConditionsInstance | object,
    rollType?: RollType
  ): number {
    const record = this.recordFactory.createTestRoll(
      this.typeValue,
      testConditions,
      rollType
    );
    this.resultValue = record.roll;

    this.rolls.setActiveKey(Die.TEST_KEY);
    this.rolls.add(record);

    return record.roll;
  }

  /**
   * Retrieve roll history for a given key.
   *
   * @param key - `"normal" | "modifier" | "test"`
   * @param verbose - Include timestamps if true
   * @returns Array of roll records (timestamps included if verbose)
   */
  history(key: string = Die.NORMAL_KEY, verbose = false) {
    this.rolls.setActiveKey(key);
    return this.rolls.getAll(verbose);
  }

  /**
   * Retrieve a roll report for a specific key.
   *
   * @param key - `"normal" | "modifier" | "test"`
   * @param options - Optional report options (`limit` and `verbose`)
   * @returns Array of roll records (subject to limit and verbose)
   */
  report(
    key: string = Die.NORMAL_KEY,
    options?: { limit?: number; verbose?: boolean }
  ) {
    this.rolls.setActiveKey(key);
    return this.rolls.activeManager?.report(options) ?? [];
  }

  /** Human-readable summary of the die */
  toString(): string {
    if (this.resultValue === undefined)
      return `Die(${this.typeValue}): not rolled yet`;
    return `Die(${this.typeValue}): latest=${this.resultValue}`;
  }

  /** JSON representation of all histories keyed by roll type */
  toJSON() {
    return this.rolls.toJSON();
  }
}
