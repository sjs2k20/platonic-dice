import { Conditions, ConditionsLike } from "./testValidators";
import { DieTypeValue } from "../entities/DieType";
import { OutcomeValue } from "../entities/Outcome";

/** A per-roll evaluator mapping `base` -> `OutcomeValue`. */
export type Evaluator = (base: number) => OutcomeValue;

/**
 * Factory that builds an `Evaluator` for a specific die and conditions.
 * Accepts either a plain `ConditionsLike` object or a `TestConditions` instance.
 */
export type BuildEvaluator = (
  dieType: DieTypeValue,
  testConditions:
    | ConditionsLike
    | import("../entities/TestConditions").TestConditionsInstance,
  modifier?: any | null,
  useNaturalCrits?: boolean | null
) => Evaluator;

/** Lightweight registry entry describing validation and optional evaluator builder. */
export interface RegistryEntry {
  validateShape: (c: ConditionsLike) => boolean;
  /** Optional evaluator builder used to construct a per-base-roll evaluator. */
  buildEvaluator?: BuildEvaluator;
}

/** Register a new test type with its validator and optional evaluator builder. */
export function registerTestType(name: string, opts: RegistryEntry): void;

/** Retrieve a registry entry by test type name. */
export function getRegistration(name: string): RegistryEntry | undefined;

/** Internal registry map (exported for testing/inspection). */
export const registry: Map<string, RegistryEntry>;
