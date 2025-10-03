declare module "platonic-dice" {
    // Enums for die types, roll types, and outcomes
    export enum DieType {
        D4 = "d4",
        D6 = "d6",
        D8 = "d8",
        D10 = "d10",
        D12 = "d12",
        D20 = "d20",
    }

    export enum RollType {
        Advantage = "advantage",
        Disadvantage = "disadvantage",
    }

    export enum Outcome {
        Success = "success",
        Failure = "failure",
        Critical_Success = "critical_success",
        Critical_Failure = "critical_failure",
    }

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

        Die: typeof Die;
        CustomDie: typeof CustomDie;
        TargetDie: typeof TargetDie;
        ModifiedDie: typeof ModifiedDie;
        TestDie: typeof TestDie;
        TestConditions: typeof TestConditions;
    }

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

    // Class for standard die
    export class Die {
        constructor(type: DieType);
        protected _type: DieType;
        protected _result: number | null;
        protected _history: number[];

        roll(rollType?: RollType): number | string | null;
        get result(): number | null;
        get type(): DieType;
        get history(): number[];
        report(verbose?: boolean): object;
        toJSON(verbose?: boolean): string;
    }

    // Class for custom die
    export class CustomDie extends Die {
        constructor(
            type: DieType,
            faceMappings: FaceResultMap,
            defaultOutcome?: FaceResult,
        );
        private _faceMappings: Map<number, FaceResult>;
        private _outcome: number | string | null;
        private _outcomeHistory: (number | string | null)[];

        get faceMappings(): FaceResultMap;

        roll(): number | string | null;
        getOutcome(): number | string | null;
        getOutcomeHistory(): (number | string | null)[];
        get type(): DieType;
        report(verbose?: boolean): object;
    }

    // Class for modified die
    export class ModifiedDie extends Die {
        constructor(type: DieType, modifier: (roll: number) => number);
        private _modifier: (roll: number) => number;
        private _modifiedResult: number | null;
        private _modifiedHistory: number[];

        roll(rollType?: RollType): number;
        set modifier(newModifier: (roll: number) => number);
        get result(): number | null;
        get modifiedHistory(): number[];
        report(verbose?: boolean): object;
        get type(): DieType;
    }

    // Class for test conditions
    export class TestConditions {
        constructor(target: number, critical_success?: number, critical_failure?: number);
        target: number;
        critical_success?: number;
        critical_failure?: number;
    }

    // Class for test die
    export class TestDie extends ModifiedDie {
        constructor(type: DieType, conditions: TestConditions, modifier?: (roll: number) => number);
        private _conditions: TestConditions;
        private _outcomeHistory: Outcome[];

        roll(): number;
        getLastOutcome(): Outcome | null;
        getOutcomeHistory(): Outcome[];
    }

    // Class for target die
    export class TargetDie extends Die {
        constructor(type: DieType, targetValues: number[]);
        private _targetValues: number[];
        private _outcomeHistory: Outcome[];

        roll(): number;
        getHistory(): Array<{ roll: number; outcome: Outcome }>;
        getLastOutcome(): Outcome | null;
        report(verbose?: boolean): object;
    }

    // A value or function representing a custom outcome for a die face.
    export type FaceResult = number | string | ((face: number) => number);

    // Maps a specific die face to its outcome.
    export interface FaceMapping {
        face: number;
        result: FaceResult;
    }

    // An array of mappings for all die faces in a custom die.
    export type FaceResultMap = FaceMapping[];

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

    // Export the platonicDice module object
    export const platonicDice: PlatonicDice;

    export default platonicDice;
}
