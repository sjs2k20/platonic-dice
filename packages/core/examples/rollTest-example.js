const {
  roll,
  rollTest,
  rollD20,
  rollD20AtLeast,
  rollD20AtMost,
  rollD20Exact,
  rollD20Skill,
  rollD6AtLeast,
  rollD6AtMost,
  rollD10Skill,
  DieType,
  TestType,
  RollType,
  Outcome,
} = require("..");

console.log("=== How rollTest Builds on roll ===\n");

// Demonstrating the relationship
console.log("--- roll() returns a simple number ---");
const simpleRoll = roll(DieType.D20);
console.log(`roll(D20): ${simpleRoll}`);
console.log("(No outcome evaluation)");
console.log();

console.log("--- rollTest() returns base AND outcome ---");
const testRoll = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`rollTest(D20, AtLeast 15):`);
console.log(`  base: ${testRoll.base}`);
console.log(`  outcome: ${testRoll.outcome}`);
console.log(
  `  (rolled ${testRoll.base}, needed ≥15, result: ${testRoll.outcome})`
);
console.log();

console.log("--- Both support advantage/disadvantage ---");
const advTest = rollTest(
  DieType.D20,
  { testType: TestType.AtLeast, target: 15 },
  RollType.Advantage
);
console.log(`rollTest with Advantage:`);
console.log(`  base: ${advTest.base} (best of two rolls)`);
console.log(`  outcome: ${advTest.outcome}`);
console.log();

console.log("\n=== Test Types ===\n");

console.log("--- AtLeast (roll ≥ target) ---");
const atLeast1 = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Roll ${atLeast1.base} vs DC 15: ${atLeast1.outcome}`);

const atLeast2 = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 10,
});
console.log(`Roll ${atLeast2.base} vs DC 10: ${atLeast2.outcome}`);
console.log();

console.log("--- AtMost (roll ≤ target) ---");
const atMost1 = rollTest(DieType.D6, { testType: TestType.AtMost, target: 3 });
console.log(`Roll ${atMost1.base}, need ≤3: ${atMost1.outcome}`);

const atMost2 = rollTest(DieType.D6, { testType: TestType.AtMost, target: 5 });
console.log(`Roll ${atMost2.base}, need ≤5: ${atMost2.outcome}`);
console.log();

console.log("--- Exact (roll must equal target) ---");
const exact1 = rollTest(DieType.D20, { testType: TestType.Exact, target: 20 });
console.log(`Roll ${exact1.base}, need exactly 20: ${exact1.outcome}`);

const exact2 = rollTest(DieType.D6, { testType: TestType.Exact, target: 6 });
console.log(`Roll ${exact2.base}, need exactly 6: ${exact2.outcome}`);
console.log();

console.log("--- Skill (classic skill check with natural 1/20) ---");
const skill1 = rollTest(DieType.D20, { testType: TestType.Skill, target: 15 });
console.log(`Skill check ${skill1.base} vs DC 15: ${skill1.outcome}`);
console.log("(Natural 1 = critical_failure, natural 20 = critical_success)");
console.log();

console.log("--- Skill with Custom Critical Thresholds ---");
const { TestConditions } = require("..");
const customSkill = new TestConditions(
  TestType.Skill,
  {
    target: 12,
    critical_success: 18, // Crit success on 18+ (not just 20)
    critical_failure: 3, // Crit failure on 3 or below (not just 1)
  },
  DieType.D20
);
const customTest = rollTest(DieType.D20, customSkill);
console.log(`Custom skill test ${customTest.base} vs DC 12:`);
console.log(`  Outcome: ${customTest.outcome}`);
console.log(`  (Crit success on 18+, crit failure on ≤3)`);
console.log();

console.log("\n=== Convenience Aliases ===\n");

console.log("--- AtLeast Aliases ---");
const alias1 = rollD20AtLeast(15);
console.log(`rollD20AtLeast(15): ${alias1.base} → ${alias1.outcome}`);

const alias2 = rollD6AtLeast(4);
console.log(`rollD6AtLeast(4): ${alias2.base} → ${alias2.outcome}`);
console.log();

console.log("--- AtMost Aliases ---");
const alias3 = rollD20AtMost(10);
console.log(`rollD20AtMost(10): ${alias3.base} → ${alias3.outcome}`);

const alias4 = rollD6AtMost(3);
console.log(`rollD6AtMost(3): ${alias4.base} → ${alias4.outcome}`);
console.log();

console.log("--- Exact Aliases ---");
const alias5 = rollD20Exact(20);
console.log(`rollD20Exact(20): ${alias5.base} → ${alias5.outcome}`);
console.log();

console.log("--- Skill Aliases ---");
const alias6 = rollD20Skill(15);
console.log(`rollD20Skill(15): ${alias6.base} → ${alias6.outcome}`);

const alias7 = rollD10Skill(8);
console.log(`rollD10Skill(8): ${alias7.base} → ${alias7.outcome}`);
console.log();

console.log("--- Aliases with Advantage/Disadvantage ---");
const aliasAdv = rollD20AtLeast(15, RollType.Advantage);
console.log(
  `rollD20AtLeast(15, Advantage): ${aliasAdv.base} → ${aliasAdv.outcome}`
);

const aliasDis = rollD20AtLeast(15, RollType.Disadvantage);
console.log(
  `rollD20AtLeast(15, Disadvantage): ${aliasDis.base} → ${aliasDis.outcome}`
);
console.log();

console.log("\n=== Practical Use Cases ===\n");

console.log("--- Ability Check (DC 15) ---");
const abilityCheck = rollD20AtLeast(15);
console.log(`Rolled ${abilityCheck.base} vs DC 15: ${abilityCheck.outcome}`);
if (abilityCheck.outcome === Outcome.Success) {
  console.log("  You succeed!");
} else {
  console.log("  You fail.");
}
console.log();

console.log("--- Saving Throw (DC 12, with advantage) ---");
const save = rollD20AtLeast(12, RollType.Advantage);
console.log(`Rolled ${save.base} vs DC 12: ${save.outcome}`);
console.log();

console.log("--- Attack Roll (AC 16) ---");
const attack = rollD20AtLeast(16);
console.log(`Attack roll ${attack.base} vs AC 16: ${attack.outcome}`);
if (attack.outcome === Outcome.Success) {
  console.log("  HIT!");
} else {
  console.log("  MISS");
}
console.log();

console.log("--- Death Save (DC 10) ---");
const deathSave = rollD20AtLeast(10);
console.log(`Death save: ${deathSave.base} → ${deathSave.outcome}`);
if (deathSave.outcome === Outcome.Success) {
  console.log("  You still live!");
} else {
  console.log("  You died...");
}
console.log();

console.log("--- Stealth Check (DC 14, disadvantage) ---");
const stealth = rollD20Skill(14, RollType.Disadvantage);
console.log(`Stealth: ${stealth.base} vs DC 14 → ${stealth.outcome}`);
if (stealth.base === 1) {
  console.log("  Natural 1! Critical failure!");
} else if (stealth.base === 20) {
  console.log("  Natural 20! Critical success!");
}
console.log();

console.log("\n=== Multiple Tests ===\n");

console.log("--- Three Attack Rolls (AC 15) ---");
for (let i = 1; i <= 3; i++) {
  const atk = rollD20AtLeast(15);
  const result = atk.outcome === Outcome.Success ? "HIT" : "MISS";
  console.log(`Attack ${i}: ${atk.base} → ${result}`);
}
console.log();

console.log("--- Party Perception Checks (DC 12) ---");
const party = ["Fighter", "Rogue", "Wizard", "Cleric"];
party.forEach((member) => {
  const check = rollD20AtLeast(12);
  console.log(`${member}: ${check.base} → ${check.outcome}`);
});
console.log();

console.log("\n=== Understanding Outcomes ===\n");

console.log("--- Possible outcomes for AtLeast ---");
console.log("Success: Roll meets or exceeds target");
console.log("Failure: Roll is below target");
console.log();

console.log("--- Possible outcomes for Skill tests ---");
console.log("Critical Success: Natural 20 OR roll ≥ target");
console.log("Success: Roll meets target (but not natural 20)");
console.log("Failure: Roll below target (but not natural 1)");
console.log("Critical Failure: Natural 1");
console.log();

console.log("--- Examples ---");
const skillExample1 = rollD20Skill(10);
console.log(
  `Skill test ${skillExample1.base} vs DC 10: ${skillExample1.outcome}`
);

const skillExample2 = rollD20Skill(15);
console.log(
  `Skill test ${skillExample2.base} vs DC 15: ${skillExample2.outcome}`
);
console.log();

console.log("\n=== Comparing Approaches ===\n");

console.log("--- Using rollTest (full details) ---");
const fullTest = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Base: ${fullTest.base}`);
console.log(`Outcome: ${fullTest.outcome}`);
console.log(`(Full control over test conditions)`);
console.log();

console.log("--- Using alias (cleaner code) ---");
const quickTest = rollD20AtLeast(15);
console.log(`Result: ${quickTest.base} → ${quickTest.outcome}`);
console.log("(Same result, cleaner syntax)");
