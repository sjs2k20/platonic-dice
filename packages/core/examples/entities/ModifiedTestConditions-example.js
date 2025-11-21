/**
 * Example usage of ModifiedTestConditions
 * Demonstrates modified test conditions with extended ranges
 */

const {
  ModifiedTestConditions,
  TestConditions,
  TestType,
  DieType,
  rollModTest,
} = require("../../src");

console.log("=== ModifiedTestConditions Examples ===\n");

// Example 1: Basic ModifiedTestConditions
console.log("--- Creating ModifiedTestConditions ---");
const { RollModifier } = require("../../src");
const conditions = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D6,
  new RollModifier((n) => n + 10)
);

console.log(`Test Type: ${conditions.testType}`);
console.log(`Target: ${conditions.conditions.target}`);
console.log(
  `Modified Range: ${conditions.modifiedRange.min}-${conditions.modifiedRange.max}`
);
console.log(`Die Type: ${conditions.dieType}\n`);

// Example 2: Extended range target
console.log("=== Extended Range Target (D6 + 10) ===");
// D6 normally can't test DC 15, but with +10 modifier it can
const extendedCheck = rollModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(`Base roll: ${extendedCheck.base}`);
console.log(`Modified: ${extendedCheck.modified}`);
console.log(`Outcome: ${extendedCheck.outcome}`);
console.log("(Target 15 would be impossible without modifier!)\n");

// Example 3: Plain object vs class
console.log("=== Plain Object vs ModifiedTestConditions ===");
// Plain object (automatically calculates range)
const plainResult = rollModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Plain object: ${plainResult.base} + 10 = ${plainResult.modified}`);

// Explicit class (manual range specification)
const classConditions = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 15 },
  DieType.D6,
  new RollModifier((n) => n + 10)
);
const classResult = rollModTest(DieType.D6, (n) => n + 10, classConditions);
console.log(`Class: ${classResult.base} + 10 = ${classResult.modified}`);
console.log("(Both work, plain object is more convenient)\n");

// Example 4: High-level character
console.log("=== High-Level Character (D20 + 17) ===");
// Level 20 character: +5 ability, +6 proficiency, +3 items, +3 buffs = +17
const legendary = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 30 }, // Very high DC
  DieType.D20,
  new RollModifier((n) => n + 17)
);

console.log(`DC ${legendary.conditions.target} check`);
console.log(
  `Modified range: ${legendary.modifiedRange.min}-${legendary.modifiedRange.max}`
);

const legendaryRoll = rollModTest(DieType.D20, (n) => n + 17, legendary);
console.log(`Roll: ${legendaryRoll.base} + 17 = ${legendaryRoll.modified}`);
console.log(`Outcome: ${legendaryRoll.outcome}\n`);

// Example 5: Negative modifier
console.log("=== Negative Modifier (D20 - 5) ===");
const penalty = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 10 },
  DieType.D20,
  new RollModifier((n) => n - 5) // -4 to 15 range
);

console.log(
  `Modified range: ${penalty.modifiedRange.min} to ${penalty.modifiedRange.max}`
);
const penaltyRoll = rollModTest(DieType.D20, (n) => n - 5, penalty);
console.log(`Roll: ${penaltyRoll.base} - 5 = ${penaltyRoll.modified}`);
console.log(`Outcome: ${penaltyRoll.outcome}\n`);

// Example 6: Epic-level difficulty
console.log("=== Epic-Level Difficulty ===");
function createEpicCheck(dc) {
  const requiredBonus = dc - 20;

  return new ModifiedTestConditions(
    TestType.AtLeast,
    { target: dc },
    DieType.D20,
    new RollModifier((n) => n + requiredBonus)
  );
}

const epicDC28 = createEpicCheck(28);
console.log(`Epic DC ${epicDC28.conditions.target}`);
console.log(
  `Requires modifier range: ${epicDC28.modifiedRange.min}-${epicDC28.modifiedRange.max}`
);
console.log(`Minimum bonus needed: +${epicDC28.modifiedRange.min - 1}\n`);

// Example 7: Skill mastery system
console.log("=== Skill Mastery System ===");
class Skill {
  constructor(name, proficiencyBonus, abilityMod) {
    this.name = name;
    this.totalBonus = proficiencyBonus + abilityMod;
    this.modifiedRange = {
      min: 1 + this.totalBonus,
      max: 20 + this.totalBonus,
    };
  }

  canAttempt(dc) {
    return dc <= this.modifiedRange.max;
  }

  createCheck(dc) {
    return new ModifiedTestConditions(
      TestType.Skill,
      { target: dc },
      DieType.D20,
      new RollModifier((n) => n + this.totalBonus)
    );
  }

  attempt(dc) {
    return rollModTest(
      DieType.D20,
      (n) => n + this.totalBonus,
      this.createCheck(dc)
    );
  }
}

const expertise = new Skill("Stealth", 6, 5); // +11 total
console.log(`${expertise.name} (+${expertise.totalBonus})`);
console.log(
  `  Range: ${expertise.modifiedRange.min}-${expertise.modifiedRange.max}`
);
console.log(
  `  Can attempt DC 30? ${expertise.canAttempt(30)} (max ${
    expertise.modifiedRange.max
  })`
);
console.log(
  `  Can attempt DC 35? ${expertise.canAttempt(35)} (max ${
    expertise.modifiedRange.max
  })`
);

const stealthCheck = expertise.attempt(25);
console.log(
  `\n  DC 25 check: ${stealthCheck.base} + 11 = ${stealthCheck.modified} → ${stealthCheck.outcome}\n`
);

// Example 8: Progressive difficulty tiers
console.log("=== Progressive Difficulty Tiers ===");
function getModifiedConditions(baseModifier, tier) {
  const dcMap = {
    normal: 15,
    hard: 20,
    epic: 25,
    legendary: 30,
    mythic: 35,
  };

  return new ModifiedTestConditions(
    TestType.AtLeast,
    { target: dcMap[tier] },
    DieType.D20,
    new RollModifier((n) => n + baseModifier)
  );
}

const modifier = 8;
const tiers = ["normal", "hard", "epic", "legendary", "mythic"];

console.log(
  `With +${modifier} modifier (range: ${1 + modifier}-${20 + modifier}):`
);
tiers.forEach((tier) => {
  try {
    const conditions = getModifiedConditions(modifier, tier);
    const possible =
      conditions.conditions.target <= conditions.modifiedRange.max;
    console.log(
      `  ${tier} (DC ${conditions.conditions.target}): ${
        possible ? "Possible" : "Impossible"
      }`
    );
  } catch (error) {
    const dcMap = { normal: 15, hard: 20, epic: 25, legendary: 30, mythic: 35 };
    console.log(`  ${tier} (DC ${dcMap[tier]}): Out of range`);
  }
});
console.log();

// Example 9: Validation comparison
console.log("=== Validation Comparison ===");
console.log("TestConditions (base die validation):");
try {
  const invalid = new TestConditions(TestType.AtLeast, 25, DieType.D20);
  console.log("  ✗ Should have failed but didn't!");
} catch (error) {
  console.log("  ✗ DC 25 exceeds D20 maximum (20)");
}

console.log("\nModifiedTestConditions (modified range validation):");
const valid = new ModifiedTestConditions(
  TestType.AtLeast,
  { target: 25 }, // Valid within modified range
  DieType.D20,
  new RollModifier((n) => n + 10) // D20 + 10: range 11-30
);
console.log(
  `  ✓ DC ${valid.conditions.target} is valid (within ${valid.modifiedRange.min}-${valid.modifiedRange.max})\n`
);

// Example 10: Auto-calculate helper
console.log("=== Auto-Calculate Modified Range ===");
function createModifiedConditions(dieType, modifier, testType, target) {
  return new ModifiedTestConditions(
    testType,
    { target },
    dieType,
    new RollModifier((n) => n + modifier)
  );
}

const autoCalc = createModifiedConditions(
  DieType.D20,
  12,
  TestType.AtLeast,
  28
);
console.log(`D20 + 12 vs DC ${autoCalc.conditions.target}`);
console.log(
  `  Auto-calculated range: ${autoCalc.modifiedRange.min}-${autoCalc.modifiedRange.max}\n`
);

// Example 11: Conditional validation
console.log("=== Smart Condition Creation ===");
function createSmartConditions(dieType, modifier, testType, target) {
  const dieMax = parseInt(dieType.substring(1));

  // Use ModifiedTestConditions if target is outside base die range
  if (target > dieMax || target < 1) {
    console.log(
      `  → Using ModifiedTestConditions (target ${target} outside 1-${dieMax})`
    );
    return new ModifiedTestConditions(
      testType,
      { target },
      dieType,
      new RollModifier((n) => n + modifier)
    );
  }

  // Use regular TestConditions otherwise
  console.log(`  → Using TestConditions (target ${target} within 1-${dieMax})`);
  return new TestConditions(testType, { target }, dieType);
}

console.log("DC 15 with +5 modifier:");
const normal = createSmartConditions(DieType.D20, 5, TestType.AtLeast, 15);

console.log("\nDC 25 with +5 modifier:");
const extended = createSmartConditions(DieType.D20, 5, TestType.AtLeast, 25);
console.log();

// Example 12: Character progression
console.log("=== Character Progression ===");
const levels = [1, 5, 10, 15, 20];

levels.forEach((level) => {
  const proficiency = Math.floor((level - 1) / 4) + 2;
  const ability = 3 + Math.floor(level / 4); // Ability increases
  const totalMod = proficiency + ability;

  const maxDC = 20 + totalMod;

  console.log(
    `Level ${level
      .toString()
      .padStart(2)}: +${totalMod} modifier, max DC ${maxDC}`
  );
});
