// const { DieType, RollType } = require("../core/Types");
// const { rollDice } = require("../core/DiceUtils");
// const { Die } = require("../core/Die");

// // Mock rollDice to return predictable values
// jest.mock("../core/DiceUtils", () => ({
//     rollDice: jest.fn(),
// }));

// describe("Die Class", () => {
//     let die;

//     beforeEach(() => {
//         die = new Die(DieType.D6);
//         rollDice.mockClear(); // Reset the mock before each test
//     });

//     describe("Initialization", () => {
//         it("should initialize with the correct type and empty result/history", () => {
//             expect(die.type).toBe(DieType.D6);
//             expect(die.result).toBeNull();
//             expect(die.history).toEqual([]);
//         });
//     });

//     describe("Rolling", () => {
//         it("should roll the die and store the result", () => {
//             rollDice.mockReturnValue(4); // Mock the roll result

//             const result = die.roll();

//             expect(result).toBe(4);
//             expect(die.result).toBe(4);
//             expect(die.history).toEqual([4]);
//             expect(rollDice).toHaveBeenCalledWith(DieType.D6, undefined);
//         });

//         it("should roll with advantage", () => {
//             rollDice.mockReturnValue(6);

//             const result = die.roll(RollType.Advantage);

//             expect(result).toBe(6);
//             expect(die.history).toEqual([6]);
//             expect(rollDice).toHaveBeenCalledWith(
//                 DieType.D6,
//                 RollType.Advantage
//             );
//         });

//         it("should roll with disadvantage", () => {
//             rollDice.mockReturnValue(2);

//             const result = die.roll(RollType.Disadvantage);

//             expect(result).toBe(2);
//             expect(die.history).toEqual([2]);
//             expect(rollDice).toHaveBeenCalledWith(
//                 DieType.D6,
//                 RollType.Disadvantage
//             );
//         });
//     });

//     describe("Reset", () => {
//         beforeEach(() => {
//             die.result = 5;
//             die.history = [2, 3, 5];
//         });

//         it("should reset only the result when called without arguments", () => {
//             die.reset();

//             expect(die.result).toBeNull();
//             expect(die.history).toEqual([2, 3, 5]);
//         });

//         it("should reset both result and history when called with 'complete' set to true", () => {
//             die.reset(true);

//             expect(die.result).toBeNull();
//             expect(die.history).toEqual([]);
//         });
//     });

//     describe("Report", () => {
//         it("should return the correct report when a result exists", () => {
//             die.result = 3;
//             expect(die.report()).toBe("Result: 3");
//         });

//         it("should return the correct message when no roll has been made", () => {
//             expect(die.report()).toBe("Die has not been rolled.");
//         });
//     });

//     describe("getResult", () => {
//         it("should return the current result after rolling", () => {
//             die.roll();
//             const result = die.getResult();
//             expect(result).toBeGreaterThanOrEqual(1);
//             expect(result).toBeLessThanOrEqual(6);
//         });

//         it("should return null if the die has not been rolled", () => {
//             const result = die.getResult();
//             expect(result).toBeNull();
//         });
//     });

//     describe("getHistory", () => {
//         it("should return an array of all rolls", () => {
//             die.roll();
//             die.roll();
//             const history = die.getHistory();
//             expect(history.length).toBe(2);
//             expect(history[0]).toBeGreaterThanOrEqual(1);
//             expect(history[0]).toBeLessThanOrEqual(6);
//             expect(history[1]).toBeGreaterThanOrEqual(1);
//             expect(history[1]).toBeLessThanOrEqual(6);
//         });

//         it("should return an empty array if the die has not been rolled", () => {
//             const history = die.getHistory();
//             expect(history).toEqual([]);
//         });
//     });
// });
