/**
 * A function that takes a single numeric input (the base roll or total sum)
 * and returns a numeric result.
 *
 * Implementations should:
 * - Declare exactly one parameter (checked via `fn.length === 1`)
 * - Accept and return numbers (preferably integers for dice operations)
 *
 * Examples:
 * ```js
 * const plusOne: RollModifierFunction = n => n + 1;
 * const halve: RollModifierFunction = n => Math.floor(n / 2);
 * ```
 */
export type RollModifierFunction = (n: number) => number;

/**
 * Represents a composite modifier for dice operations.
 *
 * Each field is optional and defaults to the identity modifier if omitted.
 */
export interface DiceModifier {
  /**
   * Function or {@link RollModifier} applied to each individual die.
   *
   * Accepts:
   * - RollModifier instance
   * - RollModifierFunction
   * - undefined
   */
  each?: RollModifierFunction | RollModifier | undefined;

  /**
   * Function or {@link RollModifier} applied to the total sum.
   *
   * Accepts:
   * - RollModifier instance
   * - RollModifierFunction
   * - undefined
   */
  net?: RollModifierFunction | RollModifier | undefined;
}

/**
 * Represents a numeric modifier applied to dice rolls.
 *
 * Wraps a pure function `(n: number) => number` and provides
 * validation and `apply` semantics.
 */
export class RollModifier {
  /**
   * @param fn - The modifier function.
   * @throws {TypeError} If the function is invalid.
   */
  constructor(fn: RollModifierFunction);

  /** The underlying modifier function. */
  fn: RollModifierFunction;

  /**
   * Applies this modifier to a numeric roll result.
   */
  apply(baseValue: number): number;

  /**
   * Validates the modifier’s internal function.
   * @throws {TypeError} If invalid.
   */
  validate(): void;
}

/**
 * Checks whether a given function is a valid roll modifier.
 *
 * Validation ensures:
 * - `m` is a function
 * - It declares exactly one parameter
 * - Applying it to a test number returns an integer
 *
 * The JS accepts `null`/`undefined`, so TS reflects that.
 */
export function isValidRollModifier(m: Function | null | undefined): boolean;

/**
 * Ensures that a modifier conforms to the `RollModifier` structure.
 *
 * Accepts:
 * - RollModifier instance
 * - Function `(n: number) => number`
 * - undefined (treated as identity modifier)
 *
 * Returns a valid `RollModifier`.
 *
 * @throws {TypeError} If the input is invalid.
 */
export function normaliseRollModifier(
  m?: RollModifier | RollModifierFunction | undefined
): RollModifier;

/** Alias type for instances of {@link RollModifier}. */
export type RollModifierInstance = InstanceType<typeof RollModifier>;
export type RollModifierLike =
  | RollModifierInstance
  | RollModifierFunction
  | DiceModifier;
