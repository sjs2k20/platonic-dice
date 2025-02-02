// const { DieType } = require("../core/Types");
// const { rollDice } = require("../core/DiceUtils");
// const { TestDie, CriticalState } = require("../core/TestDie");

// // Mock rollDice to return predictable values
// jest.mock("../core/DiceUtils", () => ({
//     rollDice: jest.fn(),
// }));

// describe("TestDie Class", () => {
//     let testDie;
//     const testConditions = {
//         target: 4, // Success if roll is 4 or higher
//         critSuccessThreshold: 6, // Critical success if roll is 6 or higher
//         critFailThreshold: 1, // Critical failure if roll is 1 or lower
//     };

//     beforeEach(() => {
//         testDie = new TestDie(DieType.D6, testConditions);
//         rollDice.mockClear(); // Reset the mock before each test
//     });

//     describe("Initialization", () => {
//         it("should initialize with the correct type, conditions, and default success/critical values", () => {
//             expect(testDie.type).toBe(DieType.D6);
//             expect(testDie.conditions).toEqual(testConditions);
//             expect(testDie.success).toBeNull(); // Initial success should be null
//             expect(testDie.critical).toBe(CriticalState.None); // Initial critical state should be 'none'
//         });
//     });

//     describe("Rolling", () => {
//         it("should roll the die and determine success based on target conditions", () => {
//             rollDice.mockReturnValue(5); // Mock a roll result of 5

//             const result = testDie.roll();

//             expect(result).toBe(5); // Check the roll result
//             expect(testDie.success).toBe(true); // Since 5 >= 4 (target)
//             expect(testDie.critical).toBe(CriticalState.None); // No critical state for 5
//         });

//         it("should determine failure if the roll is below the target condition", () => {
//             rollDice.mockReturnValue(3); // Mock a roll result of 3

//             const result = testDie.roll();

//             expect(result).toBe(3); // Check the roll result
//             expect(testDie.success).toBe(false); // Since 3 < 4 (target)
//             expect(testDie.critical).toBe(CriticalState.None); // No critical state for 3
//         });

//         it("should determine critical success if the roll is above the critSuccessThreshold", () => {
//             rollDice.mockReturnValue(6); // Mock a roll result of 6

//             const result = testDie.roll();

//             expect(result).toBe(6); // Check the roll result
//             expect(testDie.success).toBe(true); // Since 6 >= 4 (target)
//             expect(testDie.critical).toBe(CriticalState.Success); // Since 6 >= 6 (critSuccessThreshold)
//         });

//         it("should determine critical failure if the roll is below the critFailThreshold", () => {
//             rollDice.mockReturnValue(1); // Mock a roll result of 1

//             const result = testDie.roll();

//             expect(result).toBe(1); // Check the roll result
//             expect(testDie.success).toBe(false); // Since 1 < 4 (target)
//             expect(testDie.critical).toBe(CriticalState.Failure); // Since 1 <= 1 (critFailThreshold)
//         });

//         it("should not be critical if the roll is between critSuccessThreshold and critFailThreshold", () => {
//             rollDice.mockReturnValue(4); // Mock a roll result of 4

//             const result = testDie.roll();

//             expect(result).toBe(4); // Check the roll result
//             expect(testDie.success).toBe(true); // Since 4 >= 4 (target)
//             expect(testDie.critical).toBe(CriticalState.None); // Since 4 is not a critical success or failure
//         });
//     });

//     describe("checkCritical", () => {
//         it("should return 'success' for a roll greater than or equal to the critSuccessThreshold", () => {
//             expect(testDie.checkCritical(6)).toBe(CriticalState.Success);
//         });

//         it("should return 'failure' for a roll less than or equal to the critFailThreshold", () => {
//             expect(testDie.checkCritical(1)).toBe(CriticalState.Failure);
//         });

//         it("should return 'none' for a roll between the critSuccessThreshold and critFailThreshold", () => {
//             expect(testDie.checkCritical(4)).toBe(CriticalState.None);
//         });
//     });

//     describe("getResult", () => {
//         it("should return the correct result and status after rolling", () => {
//             rollDice.mockReturnValue(5); // Mock a roll result of 5
//             testDie.roll(); // Perform a roll

//             const result = testDie.getResult();

//             expect(result).toEqual({
//                 roll: 5,
//                 success: true, // Since 5 >= 4 (target)
//                 critical: CriticalState.None, // No critical state for 5
//             });
//         });

//         it("should return the correct result and critical state", () => {
//             rollDice.mockReturnValue(6); // Mock a roll result of 6
//             testDie.roll(); // Perform a roll

//             const result = testDie.getResult();

//             expect(result).toEqual({
//                 roll: 6,
//                 success: true, // Since 6 >= 4 (target)
//                 critical: CriticalState.Success, // Since 6 >= 6 (critSuccessThreshold)
//             });
//         });
//     });

//     describe("report", () => {
//         it("should report roll result, success, and critical state", () => {
//             rollDice.mockReturnValue(5); // Mock roll result
//             testDie.roll();

//             const report = testDie.report();
//             expect(report).toBe("Roll: 5, Success: Yes");
//         });

//         it("should report critical success", () => {
//             rollDice.mockReturnValue(6); // Mock roll result
//             testDie.roll();

//             const report = testDie.report();
//             expect(report).toBe("Roll: 6, Success: Yes, Critical: success");
//         });

//         it("should report critical failure", () => {
//             rollDice.mockReturnValue(1); // Mock roll result
//             testDie.roll();

//             const report = testDie.report();
//             expect(report).toBe("Roll: 1, Success: No, Critical: failure");
//         });

//         it("should report failure without critical state", () => {
//             rollDice.mockReturnValue(3); // Mock roll result
//             testDie.roll();

//             const report = testDie.report();
//             expect(report).toBe("Roll: 3, Success: No");
//         });
//     });
// });
