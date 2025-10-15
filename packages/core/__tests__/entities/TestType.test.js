// "use strict";
// const { TestType } = require("../../src/entities/TestType.js");

// describe("@dice/core/entities/TestType", () => {
//   it("should be an object", () => {
//     expect(typeof TestType).toBe("object");
//   });

//   it("should be frozen (immutable)", () => {
//     expect(Object.isFrozen(TestType)).toBe(true);
//   });

//   it("should contain all expected test types", () => {
//     const expected = {
//       Exact: "exact",
//       AtLeast: "at_least",
//       AtMost: "at_most",
//       Within: "within",
//       InList: "in_list",
//       Skill: "skill",
//     };
//     expect(TestType).toEqual(expected);
//   });

//   it("should have PascalCase keys and lowercase/underscored string values", () => {
//     for (const [key, value] of Object.entries(TestType)) {
//       expect(key).toMatch(/^[A-Z][a-zA-Z]+$/);
//       expect(value).toMatch(/^[a-z_]+$/);
//     }
//   });

//   it("should not allow adding new properties", () => {
//     expect(() => {
//       // @ts-ignore
//       TestType.NewType = "new_type";
//     }).toThrow();
//     expect(TestType.NewType).toBeUndefined();
//   });

//   it("should not allow modification of existing values", () => {
//     expect(() => {
//       // @ts-ignore
//       TestType.AtLeast = "modified";
//     }).toThrow();
//     expect(TestType.AtLeast).toBe("at_least");
//   });
// });
