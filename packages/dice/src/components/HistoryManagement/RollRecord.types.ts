import type { OutcomeValue } from "@platonic-dice/core";

/**
 * Simple die roll record.
 */
export interface DieRollRecord {
  roll: number;
  timestamp: Date;
}

/**
 * Modified die roll record.
 */
export interface ModifiedDieRollRecord {
  roll: number;
  modified: number;
  timestamp: Date;
}

/**
 * Targeted test roll record (e.g., success/failure).
 */
export interface TargetDieRollRecord {
  roll: number;
  outcome: OutcomeValue;
  timestamp: Date;
}

/**
 * Union type for all possible roll records.
 */
export type RollRecord =
  | DieRollRecord
  | ModifiedDieRollRecord
  | TargetDieRollRecord;
