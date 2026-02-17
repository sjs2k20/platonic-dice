import core from "@platonic-dice/core";
const { DieType, RollType } = core;

import type {
  DieTypeValue,
  RollModifierFunction,
  RollModifierInstance,
  TestConditionsInstance,
} from "@platonic-dice/core";
import type { RollTypeValue, TestTypeValue } from "@platonic-dice/core";

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
  private readonly typeValue: DieTypeValue;
  private readonly rolls: HistoryCache<RollRecord>;
  private resultValue?: number;
  private readonly recordFactory = new RollRecordFactory();

  /** Keys used internally for history separation */
  private static readonly NORMAL_KEY = "normal";
  private static readonly MODIFIER_KEY = "modifier";
  private static readonly TEST_KEY = "test";
  private static readonly MODIFIED_TEST_KEY = "modifiedTest";

  /**
   * Create a new Die instance.
   * @param type - The die type (must be a value from `DieType`)
   * @param historyCache - Optional custom `RollHistoryCache` instance
   */
  /**
   * Create a new Die instance.
   *
   * @param {DieTypeValue} type - The die type (must be a value from `DieType`).
   * @param {HistoryCache<RollRecord>} [historyCache] - Optional custom history cache instance.
   * @throws {Error} If `type` is not a valid `DieType` value.
   */
  constructor(type: DieTypeValue, historyCache?: HistoryCache<RollRecord>) {
    // Accept only the narrow literal union type (DieTypeValue) for strictness.
    // Runtime validation still guards against invalid values.
    if (!Object.values(DieType).includes(type as any)) {
      throw new Error(`Invalid die type: ${type}`);
    }
    this.typeValue = type as DieTypeValue;
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
  get type(): DieTypeValue {
    return this.typeValue;
  }

  /** The most recent numeric roll result, or undefined if not rolled yet */
  get result(): number | undefined {
    return this.resultValue;
  }

  /** Number of faces on this die */
  get faceCount(): number {
    const lookup: Record<DieTypeValue, number> = {
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
  /**
   * Perform a normal die roll.
   *
   * @param {RollTypeValue} [rollType] - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`).
   * @returns {number} The numeric result of the roll.
   * @throws {Error} If `rollType` is provided but invalid.
   */
  roll(rollType?: RollTypeValue): number {
    if (
      rollType !== undefined &&
      !Object.values(RollType).includes(rollType as any)
    ) {
      throw new Error(`Invalid roll type: ${rollType}`);
    }

    // Delegate record creation to the RollRecordFactory to centralise shape
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
  /**
   * Perform a roll with a modifier.
   *
   * @param {RollModifierFunction | RollModifierInstance} modifier - Numeric or functional modifier applied to the base roll.
   * @param {RollTypeValue} [rollType] - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`).
   * @returns {number} The modified numeric result.
   * @example
   * d20.rollMod(n => n + 2); // adds +2 to the roll
   */
  rollMod(
    modifier: RollModifierFunction | RollModifierInstance,
    rollType?: RollTypeValue
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
  /**
   * Perform a roll against test conditions (success/failure evaluation).
   *
   * @param {TestConditionsInstance | { testType: TestTypeValue; [k: string]: any }} testConditions - Test conditions (plain object or normalised `TestConditions` instance).
   * @param {RollTypeValue} [rollType] - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`).
   * @returns {number} The base numeric roll used to evaluate the test.
   * @throws {Error} If `testConditions` or `rollType` are invalid (delegated to core).
   * @example
   * d20.rollTest({ testType: "at_least", target: 15 });
   */
  rollTest(
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue
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
   * Perform a roll with a modifier and evaluate against test conditions.
   * Combines rollMod and rollTest functionality.
   *
   * @param {RollModifierFunction | RollModifierInstance} modifier - Numeric or functional modifier applied to the base roll.
   * @param {TestConditionsInstance | { testType: TestTypeValue; [k: string]: any }} testConditions - Test conditions (plain object or normalised `TestConditions` instance).
   * @param {RollTypeValue} [rollType] - Optional roll mode (`RollType.Advantage` / `RollType.Disadvantage`).
   * @param {{useNaturalCrits?: boolean}} [options] - Optional configuration for natural crits behavior.
   * @returns {number} The modified numeric result.
   * @throws {Error} If inputs are invalid (delegated to core).
   * @example
   * d20.rollModTest(n => n + 5, { testType: "at_least", target: 15 });
   */
  rollModTest(
    modifier: RollModifierFunction | RollModifierInstance,
    testConditions:
      | TestConditionsInstance
      | { testType: TestTypeValue; [k: string]: any },
    rollType?: RollTypeValue,
    options?: { useNaturalCrits?: boolean }
  ): number {
    const record = this.recordFactory.createModifiedTestRoll(
      this.typeValue,
      modifier,
      testConditions,
      rollType,
      options
    );
    this.resultValue = record.modified;

    this.rolls.setActiveKey(Die.MODIFIED_TEST_KEY);
    this.rolls.add(record);

    return record.modified;
  }

  /**
   * Retrieve roll history for a given key.
   *
   * @param key - `"normal" | "modifier" | "test"`
   * @param verbose - Include timestamps if true
   * @returns Array of roll records (timestamps included if verbose)
   */
  /**
   * Retrieve roll history for a given key.
   *
   * @param {string} [key=Die.NORMAL_KEY] - One of "normal" | "modifier" | "test" | "modifiedTest".
   * @param {boolean} [verbose=false] - Include timestamps when true.
   * @returns {Array} Array of roll records (timestamps included when verbose).
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
  /**
   * Retrieve a roll report for a specific key.
   *
   * @param {string} [key=Die.NORMAL_KEY] - History key to report on.
   * @param {{limit?: number, verbose?: boolean}} [options] - Report options.
   * @returns {Array} Array of roll records (subject to `limit` and `verbose`).
   */
  report(
    key: string = Die.NORMAL_KEY,
    options?: { limit?: number; verbose?: boolean }
  ) {
    this.rolls.setActiveKey(key);
    return this.rolls.activeManager?.report(options) ?? [];
  }

  /** Human-readable summary of the die */
  /**
   * Human-readable summary of the die
   *
   * @returns {string} Short description including last result if present.
   */
  toString(): string {
    if (this.resultValue === undefined)
      return `Die(${this.typeValue}): not rolled yet`;
    return `Die(${this.typeValue}): latest=${this.resultValue}`;
  }

  /** JSON representation of all histories keyed by roll type */
  /**
   * JSON representation of all histories keyed by roll type
   *
   * @returns {Record<string, RollRecord[]>} Mapping of history keys to arrays of records.
   */
  toJSON() {
    return this.rolls.toJSON();
  }
}
