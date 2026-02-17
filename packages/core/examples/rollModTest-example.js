/**
 * Example usage of rollModTest
 * Demonstrates combining modifiers with test conditions
 */

const {
  roll,
  rollMod,
  rollTest,
  rollModTest,
  DieType,
  TestType,
  RollType,
  RollModifier,
  Outcome,
} = require("../src");

console.log("=== How rollModTest Builds on Other Functions ===\n");

console.log("--- roll() returns a simple number ---");
const oneD20 = roll(DieType.D20);
console.log(`roll(D20): ${oneD20}`);
console.log();

console.log("--- rollMod() adds modifier, returns { base, modified } ---");
const modRoll = rollMod(DieType.D20, (n) => n + 5);
console.log(`rollMod(D20, +5):`);
console.log(`  base: ${modRoll.base}`);
console.log(`  modified: ${modRoll.modified}`);
console.log();

console.log(
  "--- rollTest() evaluates condition, returns { base, outcome } ---"
);
const testRoll = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`rollTest(D20, AtLeast 15):`);
console.log(`  base: ${testRoll.base}`);
console.log(`  outcome: ${testRoll.outcome}`);
console.log();

console.log("--- rollModTest() combines both: modifier + evaluation ---");
const modTestRoll = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`rollModTest(D20, +5, AtLeast 15):`);
console.log(`  base: ${modTestRoll.base}`);
console.log(`  modified: ${modTestRoll.modified}`);
console.log(`  outcome: ${modTestRoll.outcome}`);
console.log(
  `  (Rolled ${modTestRoll.base}, added 5 = ${modTestRoll.modified}, checked if >= 15)`
);
console.log();

console.log("\n=== Basic Test Types ===\n");

console.log("--- AtLeast: modified value ≥ target ---");
const abilityCheck = rollModTest(DieType.D20, (n) => n + 3, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(
  `D20+3 vs DC 15: ${abilityCheck.modified} → ${abilityCheck.outcome}`
);
console.log();

console.log("--- AtMost: modified value ≤ target ---");
const percentileCheck = rollModTest(DieType.D20, (n) => n - 2, {
  testType: TestType.AtMost,
  target: 10,
});
console.log(
  `D20-2, need ≤10: ${percentileCheck.modified} → ${percentileCheck.outcome}`
);
console.log();

console.log("--- Exact: modified value = target ---");
const exactRoll = rollModTest(DieType.D6, (n) => n + 2, {
  testType: TestType.Exact,
  target: 5,
});
console.log(`D6+2, need exact 5: ${exactRoll.modified} → ${exactRoll.outcome}`);
console.log();

console.log("--- Within: min ≤ modified value ≤ max ---");
const rangeCheck = rollModTest(DieType.D10, (n) => n + 5, {
  testType: TestType.Within,
  min: 10,
  max: 15,
});
console.log(
  `D10+5, need 10-15: ${rangeCheck.modified} → ${rangeCheck.outcome}`
);
console.log();

console.log("--- InList: modified value in array ---");
const specificRoll = rollModTest(DieType.D8, (n) => n + 1, {
  testType: TestType.InList,
  values: [3, 6, 9],
});
console.log(
  `D8+1, need [3,6,9]: ${specificRoll.modified} → ${specificRoll.outcome}`
);
console.log();

console.log("--- Skill: threshold with critical ranges ---");
const skillCheck = rollModTest(DieType.D20, (n) => n + 4, {
  testType: TestType.Skill,
  target: 12,
  critical_success: 24, // Max: 20+4=24
  critical_failure: 5, // Min: 1+4=5
});
console.log(`D20+4 skill check vs DC 12:`);
console.log(`  Base: ${skillCheck.base}, Modified: ${skillCheck.modified}`);
console.log(`  Outcome: ${skillCheck.outcome}`);
console.log();

console.log("\n=== Extended Range Examples ===\n");

console.log("--- D6 (1-6) + 10 = range 11-16 ---");
const boostedD6 = rollModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15, // Valid! 15 is within 11-16
});
console.log(`Base: ${boostedD6.base}, Modified: ${boostedD6.modified}`);
console.log(`Target 15 (outside base die range, but valid with modifier)`);
console.log(`Outcome: ${boostedD6.outcome}`);
console.log();

console.log("--- D20 (1-20) - 5 = range -4 to 15 ---");
const penalisedD20 = rollModTest(DieType.D20, (n) => n - 5, {
  testType: TestType.AtMost,
  target: 0, // Valid! 0 is within -4 to 15
});
console.log(`Base: ${penalisedD20.base}, Modified: ${penalisedD20.modified}`);
console.log(`Target 0 (negative targets possible with penalty)`);
console.log(`Outcome: ${penalisedD20.outcome}`);
console.log();

console.log("--- D6 (1-6) × 2 = range 2-12 ---");
const doubledD6 = rollModTest(DieType.D6, (n) => n * 2, {
  testType: TestType.Exact,
  target: 8, // Valid! 8 is within 2-12
});
console.log(`Base: ${doubledD6.base}, Modified: ${doubledD6.modified}`);
console.log(`Target 8 (achievable with multiplier)`);
console.log(`Outcome: ${doubledD6.outcome}`);
console.log();

console.log("\n=== Using RollModifier Instance ===\n");

const bonus = new RollModifier((n) => n + 3);
const withInstance = rollModTest(DieType.D20, bonus, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Using RollModifier instance:`);
console.log(`  Base: ${withInstance.base}, Modified: ${withInstance.modified}`);
console.log(`  Outcome: ${withInstance.outcome}`);
console.log();

const cappedBonus = new RollModifier((n) => Math.min(n + 7, 20));
const capped = rollModTest(DieType.D20, cappedBonus, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 20, // Max is capped at 20
  critical_failure: 8, // Min: 1+7=8
});
console.log(`Capped modifier (max 20):`);
console.log(`  Base: ${capped.base}, Modified: ${capped.modified}`);
console.log(`  Outcome: ${capped.outcome}`);
console.log();

console.log("\n=== With Advantage and Disadvantage ===\n");

console.log("--- Advantage: rolls twice, picks better outcome ---");
const advantage = rollModTest(
  DieType.D20,
  (n) => n + 2,
  { testType: TestType.AtLeast, target: 15 },
  RollType.Advantage
);
console.log(`D20+2 with advantage vs DC 15:`);
console.log(`  Base: ${advantage.base}, Modified: ${advantage.modified}`);
console.log(`  Outcome: ${advantage.outcome}`);
console.log();

console.log("--- Disadvantage: rolls twice, picks worse outcome ---");
const disadvantage = rollModTest(
  DieType.D10,
  (n) => n - 3,
  { testType: TestType.AtMost, target: 5 },
  RollType.Disadvantage
);
console.log(`D10-3 with disadvantage, need ≤5:`);
console.log(`  Base: ${disadvantage.base}, Modified: ${disadvantage.modified}`);
console.log(`  Outcome: ${disadvantage.outcome}`);
console.log();

console.log("\n=== Practical Use Cases ===\n");

console.log("--- Ability Checks ---");
const strCheck = rollModTest(DieType.D20, (n) => n + 4, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Strength check (d20+4 vs DC 15): ${strCheck.outcome}`);
console.log();

const dexSave = rollModTest(
  DieType.D20,
  (n) => n + 3,
  { testType: TestType.AtLeast, target: 12 },
  RollType.Advantage
);
console.log(
  `Dexterity save with advantage (d20+3 vs DC 12): ${dexSave.outcome}`
);
console.log();

console.log("--- Skill Tests with Criticals ---");
const acrobatics = rollModTest(DieType.D20, (n) => n + 7, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 27, // Max: 20+7=27
  critical_failure: 8, // Min: 1+7=8
});
console.log(`Acrobatics check (d20+7 vs DC 15):`);
console.log(`  Modified: ${acrobatics.modified}`);
console.log(`  Outcome: ${acrobatics.outcome}`);

if (acrobatics.outcome === Outcome.CriticalSuccess) {
  console.log("  → Spectacular success!");
} else if (acrobatics.outcome === Outcome.CriticalFailure) {
  console.log("  → Spectacular failure!");
}
console.log();

console.log("--- Complex Modifiers ---");
const situationalMod = (n) => {
  const base = n + 5; // Proficiency + ability
  return base >= 10 ? base + 2 : base; // +2 bonus if already high
};

const complex = rollModTest(DieType.D20, situationalMod, {
  testType: TestType.AtLeast,
  target: 18,
});
console.log(`Situational modifier (base+5, then +2 if ≥10):`);
console.log(`  Base: ${complex.base}, Modified: ${complex.modified}`);
console.log(`  Outcome: ${complex.outcome}`);
