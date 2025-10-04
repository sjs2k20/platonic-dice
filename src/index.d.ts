declare module "platonic-dice" {

    /** --- Global Constants --- */

    /**
     * Default maximum number of roll records stored by RollRecordManager.
     */
    export const DEFAULT_MAX_RECORDS: 1000;

    /** --- Enums --- */

    /** Supported die types:
     * The platonic solids: 'd4', 'd6', 'd8', 'd12', 'd20'
     * Plus the 'd10' (pentagonal trapezohedron) commonly used in RPGs. 
     */
    export enum DieType {
        D4 = "d4",
        D6 = "d6",
        D8 = "d8",
        D10 = "d10",
        D12 = "d12",
        D20 = "d20",
    }

    /** Roll types for advantage/disadvantage mechanics. */
    export enum RollType {
        Advantage = "advantage",
        Disadvantage = "disadvantage",
    }

    /** Possible outcomes for TargetDie and ModifiedTargetDie rolls. */
    export enum Outcome {
        Success = "success",
        Failure = "failure",
        Critical_Success = "critical_success",
        Critical_Failure = "critical_failure",
    }

    /** --- Type Definitions --- */

    /** A value or function representing a custom outcome for a die face. */
    export type FaceResult = number | string | ((face: number) => number);

    /** An array of mappings for all die faces in a custom die. */
    export type FaceResultMap = FaceMapping[];

    /** Maps a specific die face to its outcome. */
    export interface FaceMapping {
        face: number;
        result: FaceResult;
    }

    /** Base roll record (used by all dice) */
    export interface BaseRollRecord {
        roll: number;
        timestamp: Date;
    }

    /** ModifiedDie roll record */
    export interface ModifiedDieRollRecord extends BaseRollRecord {
        modified: number;
    }

    /** TargetDie roll record */
    export interface TargetDieRollRecord extends BaseRollRecord {
        outcome: Outcome;
    }

    /** Union type for any kind of roll record */
    export type RollRecord =
        | BaseRollRecord
        | ModifiedDieRollRecord
        | TargetDieRollRecord;

    /** Base report for any die */
    export interface BaseDieReport<
        R extends RollRecord = BaseRollRecord
    > {
        type: string;
        times_rolled: number;
        latest_record: R | null;
        history?: R[];
    }

    /** ModifiedDie report */
    export interface ModifiedDieReport
        extends BaseDieReport<ModifiedDieRollRecord> {
        modifier: string;
    }

    /** Union type for all possible die reports */
    export type DieReport = BaseDieReport | ModifiedDieReport;


    /** --- Classes --- */

    /**
     * Manages roll history for Die or derived classes.
     * Stores RollRecord objects and provides controlled access,
     * limiting the total number of retained records.
     */
    export class RollRecordManager<R extends RollRecord = BaseRollRecord> {
        private _records: R[];
        private _maxRecords: number;

        /**
         * @param maxRecords Maximum number of roll records to retain.
         * Defaults to {@link DEFAULT_MAX_RECORDS} (= 1000).
         */
        constructor(maxRecords?: number);

        /**
         * The maximum number of roll records retained before the oldest are discarded.
         */
        get maxRecords(): number;

        /**
         * All roll records, including timestamps.
         */
        get full(): R[];

        /**
         * Roll records without timestamps.
         */
        get all(): R[];

        /**
         * Number of stored roll records.
         */
        get length(): number;

        /**
         * Adds a roll record to the history.
         * Automatically trims history if exceeding {@link maxRecords}.
         * @param record RollRecord to add.
         * @throws {TypeError} If record is not a valid RollRecord variant.
         */
        add(record: R): void;

        /**
         * Clears all roll records.
         */
        clear(): void;

        /**
         * Returns the last roll record(s).
         * @param n Number of records to retrieve. Default: 1
         * @param verbose Whether to include timestamps. Default: false
         * @returns Last record(s) or null if empty.
         */
        last(n?: number, verbose?: boolean): R | R[] | null;

        /**
         * Produces a report of roll records.
         * Always returns an array (even when `limit = 1`).
         *
         * - If `limit` ≤ 0 → returns an empty array.
         * - If `limit` > available records → clamps to available.
         *
         * @param options.limit Maximum number of records to return (default: all available).
         * @param options.verbose Include timestamps if true.
         * @returns Array of RollRecords matching the specified options.
         */
        report(options?: { limit?: number; verbose?: boolean }): R[];


        /**
         * Human-readable summary of the record manager.
         * Example (non-empty):
         * `"RollRecordManager: 42/1000 rolls (last: 17 @ 2025-10-04T15:02:56.123Z)"`
         *
         * Example (empty):
         * `"RollRecordManager: empty (maxRecords=1000)"`
         */
        toString(): string;

        /**
         * JSON representation of the roll history.
         * Calls `report({ verbose: true })` under the hood. Refer to report() for structure.
         */
        toJSON(): R[];
    }


    /**
     * A wrapper for RollRecordManager that maintains multiple, independently capped histories.
     *
     * Useful for scenarios where a single RollRecordManager needs to support "history parking",
     * such as storing separate roll histories per modifier or context.
     */
    export class RollHistoryCache<R extends RollRecord = BaseRollRecord> {
        /**
         * @param options.maxRecordsPerKey Maximum records per history key.
         * * Defaults to {@link DEFAULT_MAX_RECORDS}/10 = 100).
         * @param options.maxKeys Maximum number of keys to store in cache. Default: 10
         */
        constructor(options?: { maxRecordsPerKey?: number; maxKeys?: number });

        /** Currently active history key */
        get activeKey(): string | null;

        /** Currently active RollRecordManager (or null if no key set) */
        get activeManager(): RollRecordManager<R> | null;

        /** Sets the currently active history key */
        setActiveKey(key: string): void;

        /** Adds a record to the active history */
        add(record: R): void;

        /** Retrieves all roll records for the active key */
        getAll(verbose?: boolean): R[];

        /** Clears all roll records for the active key */
        clearActive(): void;

        /** Clears all cached histories */
        clearAll(): void;

        /**
         * Returns a roll history report for all cached keys.
         * @param options.limit Maximum number of records per key
         * @param options.verbose Include timestamps if true
         */
        report(options?: { limit?: number; verbose?: boolean }): Record<string, R[]>;

        /** String summary of the cache */
        toString(): string;

        /** JSON-friendly object mapping keys to arrays of RollRecords */
        toJSON(): Record<string, R[]>;
    }

    /**
     * Represents a standard die with roll tracking and history.
     * 
     * @template TResult Type of value returned by `roll()` (default: number)
     * @template TRollRecord Type of roll record stored
     * @template TReport Type of structured report produced
    */
    export class Die<
        TResult = number,
        TRollRecord extends RollRecord = BaseRollRecord,
        TReport extends BaseDieReport<TRollRecord> = BaseDieReport<TRollRecord>
    > {
        protected _type: DieType;
        protected _result: TResult | null;
        protected _rolls: RollRecordManager<TRollRecord>;

        /**
         * Create a new die.
         * @param type The die type (e.g. D6, D20).
         * @throws If an invalid die type is provided.
        */
        constructor(type: DieType);

        /** The most recent roll result. */
        get result(): TResult | null;

        /** The die type as a string (e.g., "d6"). */
        get type(): string;

        /** Roll history without timestamps. */
        get history(): TRollRecord[];

        /** Full roll history with timestamps. */
        get history_full(): TRollRecord[];

        /** Number of faces for this die. */
        get faceCount(): number;

        /**
         * Roll the die.
         * @param rollType Optional roll modifier (advantage/disadvantage).
         * @returns The roll result.
        */
        roll(rollType?: RollType | null): TResult;

        /**
         * Retrieve roll history with fine-grained control.
         * @param options.limit Maximum number of records.
         * @param options.verbose Include timestamps if true.
        */
        historyDetailed(options?: {
            limit?: number;
            verbose?: boolean;
        }): TRollRecord[];

        /**
         * Generate a structured report of the die.
         * Always includes type, latest roll, and total rolls.
         * Optionally includes history.
        */
        report(options?: {
            limit?: number;
            verbose?: boolean;
            includeHistory?: boolean;
        }): TReport;

        toString(): string;

        /**
         * JSON representation of the die.
         * Calls 'this.report({ verbose: true, includeHistory: true })' under the hood.
         * Refer to report() doc for structure.
        */
        toJSON(): TReport;
    }

    /** Standard Die instance type definition */
    export type DieInstance = Die<number, BaseRollRecord, BaseDieReport>;

    /**
     * Represents a Die that supports result modification.
     * 
     * Uses the inherited RollRecordManager to store ModifiedDieRollRecord objects:
     * ```ts
     * { roll: number, modified: number, timestamp: Date }
     * ```
    */
    export class ModifiedDie extends Die<
        number,
        ModifiedDieRollRecord,
        ModifiedDieReport
    > {
        protected _modifier: (roll: number) => number;
        protected _modifiedResult: number | null;

        /**
         * @param type Die type (e.g. `"d6"`).
         * @param modifier Function that accepts a base roll and returns a modified result.
         * @throws {TypeError} If the modifier is not a function.
        */
        constructor(type: DieType, modifier: (roll: number) => number);

        /**
         * The descriptive type string for this die, e.g. `"Modified_d6"`.
        */
        get type(): string;

        /**
         * The last modified roll result.
         */
        get result(): number | null;

        /**
         * Replace the modifier function and clear all history.
         * 
         * @param newModifier New modifier function.
         * @throws {TypeError} If `newModifier` is not a function.
        */
        set modifier(newModifier: (roll: number) => number);

        /**
         * Rolls the die (via `rollModDie`), records a ModifiedDieRollRecord,
          * and returns the modified result.
          * 
          * @param rollType Optional roll modifier (e.g. advantage/disadvantage).
          * @returns The modified roll result.
          * @throws {Error} If `rollType` is invalid.
          */
        roll(rollType?: RollType | null): number;

        /**
         * Generate a report for this ModifiedDie.
         * 
         * @param options Report options.
         * @param options.limit Limit the number of history entries returned.
         * @param options.verbose Include timestamps if true.
         * @param options.includeHistory Include full roll history if true.
         * 
         * @returns An object containing type, modifier (as string),
         * last result, roll count, and optionally history.
        */
        report(options?: {
            limit?: number;
            verbose?: boolean;
            includeHistory?: boolean;
        }): ModifiedDieReport;

        /**
         * String representation of this ModifiedDie.
         * Includes the latest roll, total rolls, and modifier function string.
         */
        toString(): string;
    }

    /** Modified Die instance type definition */
    export type ModifiedDieInstance = Die<number, ModifiedDieRollRecord, ModifiedDieReport>;

    // // Class for custom die
    // export class CustomDie extends Die {
    //     constructor(
    //         type: DieType,
    //         faceMappings: FaceResultMap,
    //         defaultOutcome?: FaceResult,
    //     );
    //     private _faceMappings: Map<number, FaceResult>;
    //     private _outcome: number | string | null;
    //     private _outcomeHistory: (number | string | null)[];

    //     get faceMappings(): FaceResultMap;

    //     roll(): number | string | null;
    //     getOutcome(): number | string | null;
    //     getOutcomeHistory(): (number | string | null)[];
    //     get type(): DieType;
    //     report(verbose?: boolean): object;
    // }



    // Class for test conditions
    export class TestConditions {
        constructor(target: number, critical_success?: number, critical_failure?: number);
        target: number;
        critical_success?: number;
        critical_failure?: number;
    }

    // // Class for test die
    // export class TestDie extends ModifiedDie {
    //     constructor(type: DieType, conditions: TestConditions, modifier?: (roll: number) => number);
    //     private _conditions: TestConditions;
    //     private _outcomeHistory: Outcome[];

    //     roll(): number;
    //     getLastOutcome(): Outcome | null;
    //     getOutcomeHistory(): Outcome[];
    // }

    // // Class for target die
    // export class TargetDie extends Die {
    //     constructor(type: DieType, targetValues: number[]);
    //     private _targetValues: number[];
    //     private _outcomeHistory: Outcome[];

    //     roll(): number;
    //     getHistory(): Array<{ roll: number; outcome: Outcome }>;
    //     getLastOutcome(): Outcome | null;
    //     report(verbose?: boolean): object;
    // }

    // Interface for platonicDice module
    export interface PlatonicDice {
        rollDie(dieType: DieType, rollType?: RollType): number;
        rollDice(dieType: DieType, options?: { rollType?: RollType; count?: number }): number | number[];
        rollModDie(
            dieType: DieType,
            modifier: (roll: number) => number,
            rollType?: RollType,
        ): { base: number; modified: number };
        rollModDice(
            dieType: DieType,
            modifier: (roll: number) => number,
            options?: { rollType?: RollType; count?: number },
        ): { base: number[]; modified: number[] } | { base: number; modified: number };
        rollTargetDie(
            dieType: DieType,
            targets: number[],
            options?: { successOutcome?: (roll: number) => Outcome; failureOutcome?: (roll: number) => Outcome },
        ): { roll: number; outcome: Outcome };
        rollTestDie(
            dieType: DieType,
            target: number,
            options?: { critical_success?: number; critical_failure?: number; modifier?: (roll: number) => number },
        ): { base: number; modified: number; outcome: Outcome };

        TestConditions: typeof TestConditions;
    }

    // Export the platonicDice module object
    export const platonicDice: PlatonicDice;

    export default platonicDice;
}
