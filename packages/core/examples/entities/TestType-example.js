/**
 * Example usage of TestType
 * Demonstrates different test type configurations
 */

const { TestType, rollTest, DieType, Outcome } = require("../../src");

console.log("=== TestType Examples ===\n");

// Example 1: TestType values
console.log("--- TestType Enum Values ---");
console.log(`AtLeast: "${TestType.AtLeast}"`);
console.log(`AtMost: "${TestType.AtMost}"`);
console.log(`Exact: "${TestType.Exact}"`);
console.log(`Within: "${TestType.Within}"`);
console.log(`InList: "${TestType.InList}"`);
console.log(`Skill: "${TestType.Skill}"\n`);

// Example 2: AtLeast (Standard DC)
console.log("=== AtLeast Test (Saving Throw) ===");
const save = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(`Roll: ${save.base}, DC: 15`);
console.log(`Outcome: ${save.outcome} (${save.base >= 15 ? "✓" : "✗"})\n`);

// Example 3: Skill test with natural crits
console.log("=== Skill Test (Natural Crits Enabled) ===");
for (let i = 0; i < 5; i++) {
  const skill = rollTest(DieType.D20, {
    testType: TestType.Skill,
    target: 12,
  });

  let symbol = "•";
  if (skill.outcome === Outcome.CriticalSuccess) symbol = "🌟";
  else if (skill.outcome === Outcome.Success) symbol = "✓";
  else if (skill.outcome === Outcome.Failure) symbol = "✗";
  else if (skill.outcome === Outcome.CriticalFailure) symbol = "💀";

  console.log(`  ${symbol} Roll ${skill.base}: ${skill.outcome}`);
}
console.log();

// Example 4: Attack roll using AtLeast (vs AC)
console.log("=== Attack Roll (vs AC 16) ===");
const attack = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 16,
});

console.log(`Roll: ${attack.base}, AC: 16`);
console.log(`Outcome: ${attack.outcome}`);

if (attack.base === 20) {
  console.log("💥 Natural 20! CRITICAL HIT!\n");
} else if (attack.base === 1) {
  console.log("💀 Natural 1! Fumble!\n");
} else {
  console.log();
}

// Example 5: Exact value test
console.log("=== Exact Value Test (D6) ===");
for (let target = 1; target <= 6; target++) {
  const exact = rollTest(DieType.D6, {
    testType: TestType.Exact,
    target,
  });

  const symbol = exact.outcome === Outcome.Success ? "✓" : "✗";
  console.log(`  ${symbol} Target ${target}, rolled ${exact.base}`);
}
console.log();

// Example 6: Within range test
console.log("=== Within Range Test (8-12 on D20) ===");
const range = rollTest(DieType.D20, {
  testType: TestType.Within,
  min: 8,
  max: 12,
});

console.log(`Roll: ${range.base}`);
console.log(
  `In range [8-12]? ${range.outcome === Outcome.Success ? "Yes ✓" : "No ✗"}\n`,
);

// Example 7: AtMost test (reverse)
console.log("=== AtMost Test (Roll 5 or Less) ===");
const atMost = rollTest(DieType.D20, {
  testType: TestType.AtMost,
  target: 5,
});

console.log(`Roll: ${atMost.base}, Target: <= 5`);
console.log(`Outcome: ${atMost.outcome}\n`);

// Example 8: Comparing test types
console.log("=== Comparing Test Types (All vs Target 12) ===");
const testTypes = [
  { type: TestType.AtLeast, desc: "At least 12" },
  { type: TestType.AtMost, desc: "At most 12" },
  { type: TestType.Exact, desc: "Exactly 12" },
  { type: TestType.Skill, desc: "Skill (>= 12 with crits)" },
];

testTypes.forEach(({ type, desc }) => {
  const result = rollTest(DieType.D20, {
    testType: type,
    target: 12,
  });

  console.log(`${desc}: rolled ${result.base} → ${result.outcome}`);
});
console.log();

// Example 9: Natural crits enabled vs disabled
console.log("=== Natural Crits: Enabled vs Disabled ===");
console.log("With natural crits (default):");
const withCrits = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});
console.log(`  Roll ${withCrits.base}: ${withCrits.outcome}`);

console.log("\nWithout natural crits:");
const withoutCrits = rollTest(
  DieType.D20,
  {
    testType: TestType.Skill,
    target: 15,
  },
  undefined,
  { useNaturalCrits: false },
);
console.log(`  Roll ${withoutCrits.base}: ${withoutCrits.outcome}`);
console.log("  (No critical outcomes, even on nat 1/20)\n");

// Example 10: Use case - saving throws
console.log("=== Use Case: Saving Throws ===");
const saves = ["Fortitude", "Reflex", "Will"];
const dcs = [13, 15, 18];

saves.forEach((saveName, i) => {
  const saveRoll = rollTest(DieType.D20, {
    testType: TestType.AtLeast,
    target: dcs[i],
  });

  console.log(
    `${saveName} (DC ${dcs[i]}): ${saveRoll.base} → ${saveRoll.outcome}`,
  );
});
console.log();

// Example 11: Use case - hit location system
console.log("=== Use Case: Hit Location System ===");
function determineHitLocation(roll) {
  if (roll >= 1 && roll <= 5) return "Legs";
  if (roll >= 6 && roll <= 15) return "Torso";
  if (roll >= 16 && roll <= 20) return "Head";
  return "Miss";
}

const hitRoll = rollTest(DieType.D20, {
  testType: TestType.Within,
  min: 1,
  max: 20,
});

console.log(`Roll: ${hitRoll.base}`);
console.log(`Hit location: ${determineHitLocation(hitRoll.base)}\n`);

// Example 12: Use case - random events
console.log("=== Use Case: Random Events (1-in-6 Trap) ===");
for (let i = 0; i < 3; i++) {
  const check = rollTest(DieType.D6, {
    testType: TestType.Exact,
    target: 1,
  });

  if (check.outcome === Outcome.Success) {
    console.log(`  Room ${i + 1}: 🚨 TRAP! (rolled ${check.base})`);
  } else {
    console.log(`  Room ${i + 1}: Safe (rolled ${check.base})`);
  }
}
console.log();

// Example 13: Dynamic test type selection
console.log("=== Dynamic Test Type Selection ===");
function selectTestType(rollPurpose) {
  const typeMap = {
    attack: TestType.AtLeast, // Attack rolls use AtLeast (vs AC)
    skill: TestType.Skill,
    save: TestType.AtLeast,
    exact: TestType.Exact,
    range: TestType.Within,
  };

  return typeMap[rollPurpose] || TestType.AtLeast;
}

const purposes = ["attack", "skill", "save"];
purposes.forEach((purpose) => {
  const testType = selectTestType(purpose);
  console.log(`${purpose} → ${testType}`);
});
console.log();

// Example 14: Test type with modifiers
console.log("=== Test Types Work with Modifiers ===");
const { rollModTest } = require("../../src");

const modifiedSkill = rollModTest(DieType.D20, (n) => n + 7, {
  testType: TestType.Skill,
  target: 18,
});

console.log(`Skill +7: ${modifiedSkill.base} + 7 = ${modifiedSkill.modified}`);
console.log(`Outcome: ${modifiedSkill.outcome}`);
console.log("(Natural crits check base roll, not modified value)\n");

// Example 15: All test types iteration
console.log("=== All Test Types ===");
Object.entries(TestType).forEach(([key, value]) => {
  console.log(`  ${key}: "${value}"`);
});
