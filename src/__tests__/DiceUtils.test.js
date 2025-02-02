// const rewire = require("rewire");
// const { DieType, RollType } = require("../core/Types");

// // Load DiceUtils using 'rewire' for mocking
// const DiceUtils = rewire("../core/DiceUtils");

// // Get rollDice from the rewired module
// const rollDice = DiceUtils.__get__("rollDice");

// // Access the private `generateDieResult` function using rewire
// const generateDieResult = DiceUtils.__get__("generateDieResult");

// describe("generateDieResult (Private Function)", () => {
//     it("should roll a single die and return a number within range", () => {
//         const resultD6 = generateDieResult(DieType.D6);
//         expect(resultD6).toBeGreaterThanOrEqual(1);
//         expect(resultD6).toBeLessThanOrEqual(6);
//         const resultD100 = generateDieResult(DieType.D100);
//         expect(resultD100).toBeGreaterThanOrEqual(1);
//         expect(resultD100).toBeLessThanOrEqual(100);
//     });

//     it("should throw an error for an invalid die type", () => {
//         expect(() => generateDieResult("DINVALID")).toThrow(
//             "Invalid die type: DINVALID"
//         );
//     });

//     it("should return each die face roughly the same number of times (i.e. be suitably fair.)", () => {
//         const numRolls = 10000; // Simulate a large number of rolls to get a good sample.
//         const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
//         // Calculate the expected count per number
//         const expectedCount = numRolls / 6;
//         const tolerance = expectedCount * 0.05; // Allow for a 5% margin of error.
//         // Simulate the die rolls
//         for (let i = 0; i < numRolls; i++) {
//             const result = generateDieResult(DieType.D6);
//             counts[result]++;
//         }
//         // Check if each number's count is within the expected range
//         for (let i = 1; i <= 6; i++) {
//             const count = counts[i];
//             expect(count).toBeGreaterThanOrEqual(
//                 Math.floor(expectedCount - tolerance)
//             );
//             expect(count).toBeLessThanOrEqual(
//                 Math.ceil(expectedCount + tolerance)
//             );
//         }
//     });
// });

// describe("rollDice (Public Function)", () => {
//     let originalGenerateDieResult;

//     beforeEach(() => {
//         // Save the original function before mocking
//         originalGenerateDieResult = DiceUtils.__get__("generateDieResult");
//     });

//     afterEach(() => {
//         // Restore the original function after each test
//         DiceUtils.__set__("generateDieResult", originalGenerateDieResult);
//     });

//     it("should roll multiple dice when passed a count", () => {
//         const results = rollDice(DieType.D6, 3);
//         expect(results).toHaveLength(3);
//         results.forEach((result) => {
//             expect(result).toBeGreaterThanOrEqual(1);
//             expect(result).toBeLessThanOrEqual(6);
//         });
//     });

//     it("should return highest/lowest result correctly when rolling with advantage/disadvantage", () => {
//         // Mock generateDieResult for this test, alternating between 15 and 1
//         let rollCount = 0;
//         DiceUtils.__set__("generateDieResult", (dieType) => {
//             if (dieType === DieType.D20) {
//                 return rollCount++ % 2 === 0 ? 15 : 1; // Alternates between 15 and 1
//             }
//         });
//         // Each call to rollDice method with adv or dis rolls the dieType twice,
//         // and the mock should ensure these are always 15 then 1
//         const resultAdvantage = rollDice(DieType.D20, RollType.Advantage);
//         const resultDisadvantage = rollDice(DieType.D20, RollType.Disadvantage);
//         expect(resultAdvantage).toBe(15);
//         expect(resultDisadvantage).toBe(1);
//     });

//     it("should correctly handle special die types like D66", () => {
//         const mockedRoll = 5;
//         DiceUtils.__set__("generateDieResult", (dieType) => {
//             // Mock all rolls of a D6
//             if (dieType === DieType.D6) {
//                 return mockedRoll;
//             }
//             // For other die types, call the original function
//             return originalGenerateDieResult(dieType);
//         });
//         const result = rollDice(DieType.D66);
//         expect(result).toBe(55);
//     });

//     it("should correctly handle 'rolling' double '0' on a D100", () => {
//         const mockedRoll = 1;
//         DiceUtils.__set__("generateDieResult", (dieType) => {
//             // Mock all rolls of a D10
//             if (dieType === DieType.D10) {
//                 return mockedRoll; // D10 roll of 1 becomes a 0 in resolving a D100 roll.
//             }
//             // For other die types, call the original function
//             return originalGenerateDieResult(dieType);
//         });
//         const result = rollDice(DieType.D100);
//         expect(result).toBe(100);
//     });
// });
