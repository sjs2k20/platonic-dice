import * as validators from "#validators";
import { DieType } from "#entities";
import rewire from "rewire";

// Load the module with rewire
const rollDiceModule = rewire("#src");

// Extract functions using rewire
const rollDice = rollDiceModule.__get__("rollDice");
const roll2x = rollDiceModule.__get__("roll2x");
const roll3x = rollDiceModule.__get__("roll3x");
const roll10x = rollDiceModule.__get__("roll10x");

// Mock the validator
jest.mock("../../src/validators", () => ({
  isDieType: jest.fn(),
}));

describe("rollDice", () => {
  let mockRoll;

  beforeEach(() => {
    validators.isDieType.mockReset();

    // Create a new mock roll function before each test
    mockRoll = jest.fn();
    // Inject mockRoll into the module
    rollDiceModule.__set__("roll", mockRoll);
  });

  // --- Validation Tests ---
  it("throws if dieType is invalid", () => {
    validators.isDieType.mockReturnValue(false);
    expect(() => rollDice("invalidDie")).toThrow(TypeError);
  });

  it("throws if count is not a positive integer", () => {
    validators.isDieType.mockReturnValue(true);

    expect(() => rollDice(DieType.D6, { count: 0 })).toThrow(TypeError);
    expect(() => rollDice(DieType.D6, { count: -1 })).toThrow(TypeError);
    expect(() => rollDice(DieType.D6, { count: 2.5 })).toThrow(TypeError);
    expect(() => rollDice(DieType.D6, { count: "3" })).toThrow(TypeError);
  });

  // --- Single die roll ---
  it("rolls a single die correctly", () => {
    validators.isDieType.mockReturnValue(true);
    mockRoll.mockReturnValue(4);

    const result = rollDice(DieType.D6);
    expect(result.array).toEqual([4]);
    expect(result.sum).toBe(4);
    expect(mockRoll).toHaveBeenCalledTimes(1);
    expect(mockRoll).toHaveBeenCalledWith(DieType.D6);
  });

  // --- Multiple dice rolls ---
  it("rolls multiple dice correctly", () => {
    validators.isDieType.mockReturnValue(true);
    mockRoll
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(3);

    const result = rollDice(DieType.D6, { count: 3 });
    expect(result.array).toEqual([2, 5, 3]);
    expect(result.sum).toBe(10);
    expect(mockRoll).toHaveBeenCalledTimes(3);
  });

  // --- Alias Tests ---
  it("roll2x rolls two dice correctly", () => {
    validators.isDieType.mockReturnValue(true);
    mockRoll.mockReturnValueOnce(1).mockReturnValueOnce(6);

    const result = roll2x(DieType.D6);
    expect(result.array).toEqual([1, 6]);
    expect(result.sum).toBe(7);
    expect(mockRoll).toHaveBeenCalledTimes(2);
  });

  it("roll3x rolls three dice correctly", () => {
    validators.isDieType.mockReturnValue(true);
    mockRoll
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(5)
      .mockReturnValueOnce(4);

    const result = roll3x(DieType.D6);
    expect(result.array).toEqual([2, 5, 4]);
    expect(result.sum).toBe(11);
    expect(mockRoll).toHaveBeenCalledTimes(3);
  });

  it("roll10x rolls ten dice correctly", () => {
    validators.isDieType.mockReturnValue(true);

    const values = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4];
    values.forEach((v, i) => mockRoll.mockReturnValueOnce(v));

    const result = roll10x(DieType.D6);
    expect(result.array).toEqual(values);
    expect(result.sum).toBe(values.reduce((a, b) => a + b, 0));
    expect(mockRoll).toHaveBeenCalledTimes(10);
  });
});
