// "use strict";
// const { RollType } = require("../../src/entities/RollType.js");

// describe("@dice/core/entities/RollType", () => {
//   it("should be an object", () => {
//     expect(typeof RollType).toBe("object");
//   });

//   it("should be frozen (immutable)", () => {
//     expect(Object.isFrozen(RollType)).toBe(true);
//   });

//   it("should contain expected roll types", () => {
//     const expected = {
//       Advantage: "advantage",
//       Disadvantage: "disadvantage",
//     };
//     expect(RollType).toEqual(expected);
//   });

//   it("should have PascalCase keys and lowercase string values", () => {
//     for (const [key, value] of Object.entries(RollType)) {
//       expect(key).toMatch(/^[A-Z][a-z]+$/);
//       expect(value).toMatch(/^[a-z]+$/);
//     }
//   });

//   it("should not allow adding or modifying properties", () => {
//     expect(() => {
//       // @ts-ignore
//       RollType.Extra = "extra";
//     }).toThrow();
//     expect(RollType.Extra).toBeUndefined();

//     expect(() => {
//       // @ts-ignore
//       RollType.Advantage = "changed";
//     }).toThrow();
//     expect(RollType.Advantage).toBe("advantage");
//   });
// });
