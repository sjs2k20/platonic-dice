/**
 * Example usage of TestConditions
 * Demonstrates test conditions class and validation
 */

const { TestConditions, TestType, DieType, rollTest } = require("../../src");

console.log("=== TestConditions Examples ===\n");

// Example 1: Basic TestConditions
console.log("--- Creating TestConditions ---");
const dc15 = new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20);

console.log(`Test Type: ${dc15.testType}`);
console.log(`Target: ${dc15.conditions.target}`);
console.log(`Die Type: ${dc15.dieType}\n`);

// Example 2: Using with rollTest
console.log("=== Using TestConditions with rollTest ===");
const conditions = new TestConditions(
  TestType.AtLeast,
  { target: 12 },
  DieType.D20,
);
const result = rollTest(DieType.D20, conditions);

console.log(`Roll: ${result.base}, Target: ${conditions.conditions.target}`);
console.log(`Outcome: ${result.outcome}\n`);

// Example 3: Plain object vs class
console.log("=== Plain Object vs Class ===");
// Plain object (more common)
const plainResult = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Plain object: ${plainResult.base} → ${plainResult.outcome}`);

// Class instance
const classConditions = new TestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D20,
);
const classResult = rollTest(DieType.D20, classConditions);
console.log(`Class instance: ${classResult.base} → ${classResult.outcome}`);
console.log("(Both work identically)\n");

// Example 4: Different test types
console.log("=== Different Test Types ===");
const atLeast = new TestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D20,
);
console.log(`AtLeast: target >= ${atLeast.conditions.target}`);

const atMost = new TestConditions(TestType.AtMost, { target: 5 }, DieType.D20);
console.log(`AtMost: target <= ${atMost.conditions.target}`);

const exact = new TestConditions(TestType.Exact, { target: 10 }, DieType.D20);
console.log(`Exact: target === ${exact.conditions.target}`);

const within = new TestConditions(
  TestType.Within,
  { min: 8, max: 12 },
  DieType.D20,
);
console.log(
  `Within: ${within.conditions.min} <= target <= ${within.conditions.max}\n`,
);

// Example 5: Range test conditions
console.log("=== Range Test Conditions ===");
const range = new TestConditions(
  TestType.Within,
  { min: 10, max: 15 },
  DieType.D20,
);

console.log(`Test type: ${range.testType}`);
console.log(`Range: ${range.conditions.min}-${range.conditions.max}`);

const rangeTest = rollTest(DieType.D20, range);
console.log(`Roll: ${rangeTest.base} → ${rangeTest.outcome}\n`);

// Example 6: Reusable difficulty classes
console.log("=== Reusable Difficulty Classes ===");
const difficulties = {
  trivial: new TestConditions(TestType.AtLeast, { target: 5 }, DieType.D20),
  easy: new TestConditions(TestType.AtLeast, { target: 10 }, DieType.D20),
  medium: new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20),
  hard: new TestConditions(TestType.AtLeast, { target: 20 }, DieType.D20),
};

Object.entries(difficulties).forEach(([name, conditions]) => {
  console.log(`${name}: DC ${conditions.conditions.target}`);
});
console.log();

// Example 7: Dynamic difficulty
console.log("=== Dynamic Difficulty ===");
function createDifficultyCheck(playerLevel, baseDC) {
  const adjustedDC = Math.max(5, baseDC - Math.floor(playerLevel / 2));

  return new TestConditions(
    TestType.AtLeast,
    { target: adjustedDC },
    DieType.D20,
  );
}

const level1Check = createDifficultyCheck(1, 18);
const level5Check = createDifficultyCheck(5, 18);
const level10Check = createDifficultyCheck(10, 18);

console.log(`Level 1: DC ${level1Check.conditions.target} (from base DC 18)`);
console.log(`Level 5: DC ${level5Check.conditions.target} (from base DC 18)`);
console.log(
  `Level 10: DC ${level10Check.conditions.target} (from base DC 18)\n`,
);

// Example 8: Combat system
console.log("=== Combat System ===");
class Enemy {
  constructor(name, ac) {
    this.name = name;
    this.attackConditions = new TestConditions(
      TestType.AtLeast,
      { target: ac },
      DieType.D20,
    );
  }

  getAttackTest() {
    return this.attackConditions;
  }
}

const enemies = [
  new Enemy("Goblin", 13),
  new Enemy("Orc", 15),
  new Enemy("Dragon", 19),
];

enemies.forEach((enemy) => {
  const attack = rollTest(DieType.D20, enemy.getAttackTest());
  console.log(
    `${enemy.name} (AC ${enemy.attackConditions.conditions.target}): ${attack.base} → ${attack.outcome}`,
  );
});
console.log();

// Example 9: Condition builder pattern
console.log("=== Condition Builder Pattern ===");
class ConditionBuilder {
  static dc(target) {
    return {
      testType: TestType.AtLeast,
      target,
    };
  }

  static skillCheck(dc) {
    return {
      testType: TestType.Skill,
      target: dc,
    };
  }

  static attackVs(ac) {
    return {
      testType: TestType.AtLeast,
      target: ac,
    };
  }

  static range(min, max) {
    return {
      testType: TestType.Within,
      min,
      max,
    };
  }

  static exactly(value) {
    return {
      testType: TestType.Exact,
      target: value,
    };
  }
}

const save = rollTest(DieType.D20, ConditionBuilder.dc(15));
console.log(`DC 15 save: ${save.base} → ${save.outcome}`);

const skill = rollTest(DieType.D20, ConditionBuilder.skillCheck(12));
console.log(`Skill check (DC 12): ${skill.base} → ${skill.outcome}`);

const attack = rollTest(DieType.D20, ConditionBuilder.attackVs(16));
console.log(`Attack (AC 16): ${attack.base} → ${attack.outcome}\n`);

// Example 10: Skill check library
console.log("=== Skill Check Library ===");
const skills = {
  athletics: new TestConditions(TestType.Skill, { target: 15 }, DieType.D20),
  acrobatics: new TestConditions(TestType.Skill, { target: 12 }, DieType.D20),
  perception: new TestConditions(TestType.Skill, { target: 10 }, DieType.D20),
  stealth: new TestConditions(TestType.Skill, { target: 18 }, DieType.D20),
};

Object.entries(skills).forEach(([skillName, conditions]) => {
  const check = rollTest(DieType.D20, conditions);
  console.log(
    `${skillName} (DC ${conditions.conditions.target}): ${check.base} → ${check.outcome}`,
  );
});
console.log();

// Example 11: Multiple dice types
console.log("=== Different Die Types ===");
const d4Check = new TestConditions(TestType.AtLeast, { target: 3 }, DieType.D4);
const d6Check = new TestConditions(TestType.AtLeast, { target: 4 }, DieType.D6);
const d20Check = new TestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D20,
);

console.log(`D4 (target 3): ${rollTest(DieType.D4, d4Check).outcome}`);
console.log(`D6 (target 4): ${rollTest(DieType.D6, d6Check).outcome}`);
console.log(`D20 (target 15): ${rollTest(DieType.D20, d20Check).outcome}\n`);

// Example 12: Condition collections
console.log("=== Saving Throw Conditions ===");
const savingThrows = {
  fortitude: { testType: TestType.AtLeast, target: 13 },
  reflex: { testType: TestType.AtLeast, target: 15 },
  will: { testType: TestType.AtLeast, target: 14 },
};

Object.entries(savingThrows).forEach(([save, conditions]) => {
  const result = rollTest(DieType.D20, conditions);
  console.log(
    `${save} (DC ${conditions.target}): ${result.base} → ${result.outcome}`,
  );
});
console.log();

// Example 13: Validation example (commented to avoid error)
console.log("=== Validation ===");
console.log("Valid: DC 15 on D20 (target within 1-20)");
const valid = new TestConditions(TestType.AtLeast, { target: 15 }, DieType.D20);
console.log(`  Created successfully: DC ${valid.conditions.target}\n`);

console.log("Note: Creating DC 25 on D20 would throw validation error");
console.log("  (target 25 exceeds die maximum of 20)\n");

// Example 14: Condition with all properties
console.log("=== Complete TestConditions Object ===");
const complete = new TestConditions(
  TestType.Skill,
  { target: 14 },
  DieType.D20,
);

console.log("Properties:");
console.log(`  testType: ${complete.testType}`);
console.log(`  target: ${complete.conditions.target}`);
console.log(`  dieType: ${complete.dieType}`);
console.log(`  min: ${complete.conditions.min || "(not set)"}`);
console.log(`  max: ${complete.conditions.max || "(not set)"}`);
