// "use strict";
// const { Outcome } = require("../../src/entities/Outcome.js");

// describe("@dice/core/entities/Outcome", () => {
//   it("should be an object", () => {
//     expect(typeof Outcome).toBe("object");
//   });

//   it("should be frozen (immutable)", () => {
//     expect(Object.isFrozen(Outcome)).toBe(true);
//   });

//   it("should contain all expected outcomes", () => {
//     const expected = {
//       Success: "success",
//       Failure: "failure",
//       Critical_Success: "critical_success",
//       Critical_Failure: "critical_failure",
//     };
//     expect(Outcome).toEqual(expected);
//   });

//   it("should have properly formatted keys and values", () => {
//     for (const [key, value] of Object.entries(Outcome)) {
//       expect(key).toMatch(/^[A-Z][A-Za-z_]+$/);
//       expect(value).toMatch(/^[a-z_]+$/);
//     }
//   });

//   it("should not allow adding or modifying properties", () => {
//     expect(() => {
//       // @ts-ignore
//       Outcome.NewOutcome = "new_outcome";
//     }).toThrow();
//     expect(Outcome.NewOutcome).toBeUndefined();

//     expect(() => {
//       // @ts-ignore
//       Outcome.Success = "win";
//     }).toThrow();
//     expect(Outcome.Success).toBe("success");
//   });
// });
