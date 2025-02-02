// const { DieType } = require("../core/Types");
// const { rollDice } = require("../core/DiceUtils");
// const { Die } = require("../core/Die");
// const { TargetDie } = require("../core/TargetDie");

// // Mock rollDice to return predictable values
// jest.mock("../core/DiceUtils", () => ({
//     rollDice: jest.fn(),
// }));

// describe("TargetDie Class", () => {
//     let targetDie;
//     const targetConditions = { target: [3, 5, 6] }; // Define target conditions for success

//     beforeEach(() => {
//         targetDie = new TargetDie(DieType.D6, targetConditions);
//         rollDice.mockClear(); // Reset the mock before each test
//     });

//     describe("Initialization", () => {
//         it("should initialize with the correct type, target conditions, and success as null", () => {
//             expect(targetDie.type).toBe(DieType.D6);
//             expect(targetDie.conditions).toEqual(targetConditions);
//             expect(targetDie.success).toBeNull();
//         });
//     });

//     describe("Rolling", () => {
//         it("should roll the die and determine success based on target conditions", () => {
//             rollDice.mockReturnValue(5); // Mock a roll result of 5

//             const result = targetDie.roll();

//             expect(result).toBe(5); // Check the roll result
//             expect(targetDie.success).toBe(true); // Since 5 is in the target conditions [3, 5, 6]
//             expect(targetDie.history).toEqual([5]);
//             expect(rollDice).toHaveBeenCalledWith(DieType.D6, undefined);
//         });

//         it("should determine failure if the roll is not in the target conditions", () => {
//             rollDice.mockReturnValue(2); // Mock a roll result of 2

//             const result = targetDie.roll();

//             expect(result).toBe(2); // Check the roll result
//             expect(targetDie.success).toBe(false); // Since 2 is not in the target conditions [3, 5, 6]
//             expect(targetDie.history).toEqual([2]);
//         });
//     });

//     describe("getResult", () => {
//         it("should return the correct result and success status", () => {
//             rollDice.mockReturnValue(6); // Mock a roll result of 6
//             targetDie.roll(); // Perform a roll

//             const result = targetDie.getResult();

//             expect(result).toEqual({ roll: 6, success: true }); // Since 6 is in the target conditions
//         });

//         it("should return the correct result and failure status", () => {
//             rollDice.mockReturnValue(4); // Mock a roll result of 4
//             targetDie.roll(); // Perform a roll

//             const result = targetDie.getResult();

//             expect(result).toEqual({ roll: 4, success: false }); // Since 4 is not in the target conditions
//         });
//     });

//     describe("report", () => {
//         it("should report roll result and success status", () => {
//             rollDice.mockReturnValue(5); // Mock roll result
//             targetDie.roll();

//             const report = targetDie.report();
//             expect(report).toBe("Roll: 5, Success: Yes");
//         });

//         it("should report failure", () => {
//             rollDice.mockReturnValue(4); // Mock roll result
//             targetDie.roll();

//             const report = targetDie.report();
//             expect(report).toBe("Roll: 4, Success: No");
//         });
//     });
// });
