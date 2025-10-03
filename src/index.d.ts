declare module "platonic-dice" {

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

    /** Simple Die roll record */
    export interface DieRollRecord {
        roll: number;
        timestamp: Date;
    }

    /** ModifiedDie roll record */
    export interface ModifiedDieRollRecord {
        roll: number;
        modified: number;
        timestamp: Date;
    }

    /** TargetDie roll record */
    export interface TargetDieRollRecord {
        roll: number;
        outcome: Outcome;
        timestamp: Date;
    }

    /** Union type for all possible roll records */
    export type RollRecord =
        | DieRollRecord
        | ModifiedDieRollRecord
        | TargetDieRollRecord;


    /**
     * Manages roll history for Die or derived classes.
    */
    export class RollRecordManager {
        private _records: RollRecord[];

        /** All roll records, including timestamps. */
        get full(): RollRecord[];

        /** Roll records without timestamps. */
        get all(): RollRecord[];

        /** Number of stored roll records. */
        get length(): number;

        /**
         * Adds a roll record to the history.
         * @param record RollRecord to add.
         */
        add(record: RollRecord): void;

        /** Clears all roll records. */
        clear(): void;

        /**
         * Returns the last roll record(s).
         * @param n Number of records to retrieve. Default: 1
         * @param verbose Whether to include timestamps. Default: false
         * @returns Last record(s) or null if empty.
         */
        last(n?: number, verbose?: boolean): RollRecord | RollRecord[] | null;

        /**
         * Produces a report of roll records.
         * @param options.limit Maximum number of records to return.
         * @param options.verbose Include timestamps if true.
         * @returns Array of RollRecords.
         */
        report(options?: { limit?: number; verbose?: boolean }): RollRecord[];

        /**
         * Human-readable string representation of the manager.
         * Example: "RollRecordManager: 5 rolls (last: 12 @ 2025-10-03T12:00:00.000Z)"
         */
        toString(): string;

        /**
         * JSON representation of the roll history.
         * Calls `report({ verbose: true })` under the hood. Refer to report() for structure.
         */
        toJSON(): RollRecord[];
    }

    /**
     * Represents a standard die with roll tracking and history.
     */
    export class Die {
        /**
         * Create a new die.
         * @param type The die type (e.g. D6, D20).
         * @throws If an invalid die type is provided.
         */
        constructor(type: DieType);

        protected _type: DieType;
        protected _result: number | null;
        protected _rolls: RollRecordManager;

        /** The most recent roll result. */
        get result(): number | null;

        /** The die type as a string (e.g., "d6"). */
        get type(): string;

        /** Roll history without timestamps. */
        get history(): RollRecord[];

        /** Full roll history with timestamps. */
        get history_full(): RollRecord[];

        /** Number of faces for this die. */
        get faceCount(): number;

        /**
         * Roll the die.
         * @param rollType Optional roll modifier (advantage/disadvantage).
         * @returns The roll result.
         */
        roll(rollType?: RollType | null): number;

        /**
         * Retrieve roll history with fine-grained control.
         * @param options.limit Maximum number of records.
         * @param options.verbose Include timestamps if true.
         */
        historyDetailed(options?: {
            limit?: number;
            verbose?: boolean;
        }): RollRecord[];

        /**
         * Generate a structured report of the die.
         * Always includes type, latest roll, and total rolls.
         * Optionally includes history.
         */
        report(options?: {
            limit?: number;
            verbose?: boolean;
            includeHistory?: boolean;
        }): object;

        toString(): string;

        /**
         * JSON representation of the die.
         * Calls 'this.report({ verbose: true, includeHistory: true })' under the hood.
         * Refer to report() doc for structure.
         */
        toJSON(): RollRecord[];
    }

    /**
     * Represents a Die that supports result modification.
     * 
     * Uses the inherited RollRecordManager to store ModifiedDieRollRecord objects:
     * ```ts
     * { roll: number, modified: number, timestamp: Date }
     * ```
     */
    export class ModifiedDie extends Die {
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
        }): {
            type: string;
            modifier: string;
            last_result: number | null;
            times_rolled: number;
            latest_record: ModifiedDieRollRecord | null;
            history?: ModifiedDieRollRecord[];
        };

        /**
         * String representation of this ModifiedDie.
         * Includes the latest roll, total rolls, and modifier function string.
         */
        toString(): string;
    }


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
