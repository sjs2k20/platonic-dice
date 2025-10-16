/**
 * A function that takes a single numeric input (the base roll or total sum)
 * and returns a numeric result.
 *
 * Implementations should:
 * - Declare exactly one parameter (checked via `fn.length === 1`).
 * - Accept and return numbers (preferably integers for dice operations).
 *
 * Examples:
 * ```js
 * const plusOne: RollModifierFunction = n => n + 1;
 * const halve: RollModifierFunction = n => Math.floor(n / 2);
 * ```
 */
export type RollModifierFunction = (n: number) => number;

/**
 * Represents a composite modifier for {@link rollDiceMod}.
 *
 * Each field is optional and defaults to the identity modifier if omitted.
 *
 * @example
 * const modifier: DiceModifier = {
 *   each: n => n + 1,
 *   net: sum => sum + 2
 * };
 */
export interface DiceModifier {
  /** Function or {@link RollModifier} applied to each individual die. */
  each?: RollModifierFunction | RollModifier | null | undefined;

  /** Function or {@link RollModifier} applied to the total (sum) of all dice. */
  net?: RollModifierFunction | RollModifier | null | undefined;
}

/**
 * Represents a numeric modifier applied to dice rolls.
 *
 * Wraps a pure function `(n: number) => number` and provides
 * validation and `apply` semantics.
 *
 * @example
 * const bonus = new RollModifier(n => n + 2);
 * const result = bonus.apply(10); // 12
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
   * @param baseValue - The base roll value.
   * @returns The modified result.
   */
  apply(baseValue: number): number;

  /**
   * Validates the modifier’s internal function.
   * @throws {TypeError} If the modifier function is invalid.
   */
  validate(): void;
}

/**
 * Checks whether a given function is a valid roll modifier.
 *
 * Validation ensures:
 * - It is a function
 * - It declares exactly one parameter
 * - It returns an integer when applied to a test value
 *
 * @param m - The function to validate.
 * @returns `true` if the function is valid, else `false`.
 */
export function isValidRollModifier(m: Function | null): boolean;

/**
 * Ensures that a modifier conforms to the `RollModifier` structure.
 *
 * - `RollModifier` instance → returned as-is
 * - Function → wrapped in a new `RollModifier`
 * - `null` or `undefined` → identity modifier
 *
 * @param m - The modifier input to normalize.
 * @returns A valid `RollModifier` instance.
 * @throws {TypeError} If the input is invalid.
 *
 * @example
 * const rm1 = normaliseRollModifier(); // identity modifier
 * const rm2 = normaliseRollModifier(n => n + 1);
 * const rm3 = normaliseRollModifier(new RollModifier(n => n * 2));
 */
export function normaliseRollModifier(
  m?: RollModifier | RollModifierFunction | null
): RollModifier;

/** Alias type for instances of {@link RollModifier}. */
export type RollModifierInstance = InstanceType<typeof RollModifier>;
