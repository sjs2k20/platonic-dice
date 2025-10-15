// const { TestConditions } = require("../../src/entities/TestConditions");
// const { TestType, DieType } = require("../../src/entities");
// const { isTestType, isValidTestCondition } = require("../../src/validators");

// jest.mock("../../src/validators", () => ({
//   isTestType: jest.fn(),
//   isValidTestCondition: jest.fn(),
// }));

// describe("@dice/core/entities/TestConditions", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("constructor", () => {
//     it("should create an instance when valid testType, conditions, and dieType are provided", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValue(true);

//       const conditions = { target: 10 };
//       const tc = new TestConditions(TestType.AtLeast, conditions, DieType.D20);

//       expect(tc).toBeInstanceOf(TestConditions);
//       expect(tc.testType).toBe(TestType.AtLeast);
//       expect(tc.conditions).toBe(conditions);
//       expect(tc.dieType).toBe(DieType.D20);
//       expect(isTestType).toHaveBeenCalledWith(TestType.AtLeast);
//       expect(isValidTestCondition).toHaveBeenCalled();
//     });

//     it("should throw TypeError if testType is invalid", () => {
//       isTestType.mockReturnValue(false);

//       expect(() => new TestConditions("invalidType", {}, DieType.D6)).toThrow(
//         TypeError
//       );
//       expect(() => new TestConditions("invalidType", {}, DieType.D6)).toThrow(
//         /Invalid test type/
//       );
//       expect(isTestType).toHaveBeenCalledWith("invalidType");
//     });

//     it("should throw TypeError if conditions is not an object", () => {
//       isTestType.mockReturnValue(true);
//       expect(
//         () => new TestConditions(TestType.AtLeast, null, DieType.D6)
//       ).toThrow(TypeError);
//       expect(
//         () => new TestConditions(TestType.AtLeast, 42, DieType.D6)
//       ).toThrow(TypeError);
//     });

//     it("should throw TypeError if dieType is missing", () => {
//       isTestType.mockReturnValue(true);
//       expect(() => new TestConditions(TestType.AtLeast, {}, undefined)).toThrow(
//         TypeError
//       );
//     });

//     it("should throw RangeError for invalid numeric conditions", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValue(false);

//       expect(
//         () => new TestConditions(TestType.AtLeast, { target: 99 }, DieType.D6)
//       ).toThrow(RangeError);
//     });

//     it("should throw TypeError for unknown testType in range validation", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValue(false);

//       expect(() => new TestConditions("unknownType", {}, DieType.D6)).toThrow(
//         TypeError
//       );
//     });
//   });

//   describe("validate", () => {
//     it("should not throw if conditions are still valid", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValue(true);

//       const tc = new TestConditions(
//         TestType.AtLeast,
//         { target: 10 },
//         DieType.D20
//       );
//       expect(() => tc.validate()).not.toThrow();
//     });

//     it("should throw TypeError if conditions become invalid", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValueOnce(true).mockReturnValueOnce(false);

//       const tc = new TestConditions(
//         TestType.AtLeast,
//         { target: 10 },
//         DieType.D20
//       );

//       try {
//         tc.validate();
//       } catch (err) {
//         expect(err).toBeInstanceOf(TypeError);
//         expect(err.message).toMatch(/Invalid test conditions shape/);
//       }

//       expect(isValidTestCondition).toHaveBeenCalledTimes(2);
//     });
//   });

//   describe("integration behavior", () => {
//     it("should store conditions and dieType correctly", () => {
//       isTestType.mockReturnValue(true);
//       isValidTestCondition.mockReturnValue(true);

//       const conditions = { target: 12 };
//       const tc = new TestConditions(TestType.Exact, conditions, DieType.D12);

//       expect(tc.conditions).toBe(conditions);
//       expect(tc.dieType).toBe(DieType.D12);
//       expect(tc.testType).toBe(TestType.Exact);
//     });
//   });
// });
