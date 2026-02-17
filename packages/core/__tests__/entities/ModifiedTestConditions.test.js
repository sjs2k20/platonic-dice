/**
 * @jest-environment node
 */

const {
  ModifiedTestConditions,
  computeModifiedRange,
} = require("../../src/entities/ModifiedTestConditions");
const { DieType, TestType, RollModifier } = require("../../src/entities");

describe("ModifiedTestConditions", () => {
  describe("computeModifiedRange", () => {
    it("should compute range for positive flat modifier", () => {
      const mod = new RollModifier((n) => n + 5);
      const range = computeModifiedRange(DieType.D6, mod);
      expect(range).toEqual({ min: 6, max: 11 }); // 1+5=6, 6+5=11
    });

    it("should compute range for negative flat modifier", () => {
      const mod = new RollModifier((n) => n - 2);
      const range = computeModifiedRange(DieType.D6, mod);
      expect(range).toEqual({ min: -1, max: 4 }); // 1-2=-1, 6-2=4
    });

    it("should compute range for multiplicative modifier", () => {
      const mod = new RollModifier((n) => n * 2);
      const range = computeModifiedRange(DieType.D6, mod);
      expect(range).toEqual({ min: 2, max: 12 }); // 1*2=2, 6*2=12
    });

    it("should compute range for negative multiplicative modifier", () => {
      const mod = new RollModifier((n) => n * -1);
      const range = computeModifiedRange(DieType.D6, mod);
      expect(range).toEqual({ min: -6, max: -1 }); // 1*-1=-1, 6*-1=-6, min/max swapped
    });

    it("should compute range for complex modifier", () => {
      const mod = new RollModifier((n) => Math.floor(n / 2) + 3);
      const range = computeModifiedRange(DieType.D10, mod);
      expect(range).toEqual({ min: 3, max: 8 }); // floor(1/2)+3=3, floor(10/2)+3=8
    });

    it("should compute range for D20", () => {
      const mod = new RollModifier((n) => n + 10);
      const range = computeModifiedRange(DieType.D20, mod);
      expect(range).toEqual({ min: 11, max: 30 });
    });
  });

  describe("constructor validation", () => {
    describe("AtLeast test type", () => {
      it("should accept target within modified range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 15 },
          DieType.D6,
          (n) => n + 10 // Range: 11-16
        );
        expect(conditions.testType).toBe(TestType.AtLeast);
        expect(conditions.conditions.target).toBe(15);
      });

      it("should reject target above modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.AtLeast,
            { target: 20 }, // Out of range 11-16
            DieType.D6,
            (n) => n + 10
          );
        }).toThrow(RangeError);
      });

      it("should reject target below modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.AtLeast,
            { target: 5 }, // Out of range 11-16
            DieType.D6,
            (n) => n + 10
          );
        }).toThrow(RangeError);
      });

      it("should accept target at exact minimum of range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 11 },
          DieType.D6,
          (n) => n + 10
        );
        expect(conditions.conditions.target).toBe(11);
      });

      it("should accept target at exact maximum of range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 16 },
          DieType.D6,
          (n) => n + 10
        );
        expect(conditions.conditions.target).toBe(16);
      });
    });

    describe("Exact test type", () => {
      it("should accept target within modified range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.Exact,
          { target: 8 },
          DieType.D6,
          (n) => n + 2 // Range: 3-8
        );
        expect(conditions.conditions.target).toBe(8);
      });

      it("should reject target outside modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.Exact,
            { target: 10 }, // Out of range 3-8
            DieType.D6,
            (n) => n + 2
          );
        }).toThrow(RangeError);
      });
    });

    describe("Within test type", () => {
      it("should accept range within modified range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.Within,
          { min: 12, max: 15 },
          DieType.D6,
          (n) => n + 10 // Range: 11-16
        );
        expect(conditions.conditions.min).toBe(12);
        expect(conditions.conditions.max).toBe(15);
      });

      it("should reject range outside modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.Within,
            { min: 5, max: 20 }, // Outside 11-16
            DieType.D6,
            (n) => n + 10
          );
        }).toThrow(RangeError);
      });
    });

    describe("InList test type", () => {
      it("should accept values within modified range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.InList,
          { values: [12, 14, 16] },
          DieType.D6,
          (n) => n + 10 // Range: 11-16
        );
        expect(conditions.conditions.values).toEqual([12, 14, 16]);
      });

      it("should reject values outside modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.InList,
            { values: [5, 10, 20] }, // 5 and 20 out of range 11-16
            DieType.D6,
            (n) => n + 10
          );
        }).toThrow(RangeError);
      });
    });

    describe("Skill test type", () => {
      it("should accept valid skill conditions within range", () => {
        const conditions = new ModifiedTestConditions(
          TestType.Skill,
          { target: 15, critical_success: 22, critical_failure: 3 },
          DieType.D20,
          (n) => n + 2 // Range: 3-22
        );
        expect(conditions.conditions.target).toBe(15);
        expect(conditions.conditions.critical_success).toBe(22);
        expect(conditions.conditions.critical_failure).toBe(3);
      });

      it("should reject critical_success below target", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.Skill,
            { target: 15, critical_success: 10 },
            DieType.D20,
            (n) => n + 2
          );
        }).toThrow(RangeError);
      });

      it("should reject critical_failure above target", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.Skill,
            { target: 10, critical_failure: 15 },
            DieType.D20,
            (n) => n + 2
          );
        }).toThrow(RangeError);
      });

      it("should reject target outside modified range", () => {
        expect(() => {
          new ModifiedTestConditions(
            TestType.Skill,
            { target: 50 }, // Out of range 3-22
            DieType.D20,
            (n) => n + 2
          );
        }).toThrow(RangeError);
      });
    });
  });

  describe("with negative modifiers", () => {
    it("should handle negative range correctly for AtLeast", () => {
      const conditions = new ModifiedTestConditions(
        TestType.AtLeast,
        { target: -5 },
        DieType.D10,
        (n) => n - 10 // Range: -9 to 0 (1-10=-9, 10-10=0)
      );
      expect(conditions.conditions.target).toBe(-5);
    });

    it("should reject positive target when range is negative", () => {
      expect(() => {
        new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 5 },
          DieType.D10,
          (n) => n - 10 // Range: -9 to 0
        );
      }).toThrow(RangeError);
    });
  });

  describe("with RollModifier instances", () => {
    it("should accept RollModifier instance", () => {
      const mod = new RollModifier((n) => n + 7);
      const conditions = new ModifiedTestConditions(
        TestType.AtLeast,
        { target: 12 },
        DieType.D6,
        mod // Range: 8-13
      );
      expect(conditions.conditions.target).toBe(12);
    });

    it("should store normalised RollModifier", () => {
      const conditions = new ModifiedTestConditions(
        TestType.AtLeast,
        { target: 12 },
        DieType.D6,
        (n) => n + 7
      );
      expect(conditions.modifier).toBeInstanceOf(RollModifier);
    });
  });

  describe("validation errors", () => {
    it("should throw if testType is invalid", () => {
      expect(() => {
        new ModifiedTestConditions(
          "invalid",
          { target: 10 },
          DieType.D6,
          (n) => n + 5
        );
      }).toThrow(TypeError);
    });

    it("should throw if conditions is not an object", () => {
      expect(() => {
        new ModifiedTestConditions(
          TestType.AtLeast,
          null,
          DieType.D6,
          (n) => n + 5
        );
      }).toThrow(TypeError);
    });

    it("should throw if dieType is missing", () => {
      expect(() => {
        new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 10 },
          null,
          (n) => n + 5
        );
      }).toThrow(TypeError);
    });

    it("should throw if modifier is missing", () => {
      expect(() => {
        new ModifiedTestConditions(
          TestType.AtLeast,
          { target: 10 },
          DieType.D6,
          null
        );
      }).toThrow(TypeError);
    });
  });
});
