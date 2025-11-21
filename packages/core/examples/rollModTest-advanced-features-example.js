/**
 * Example usage of rollModTest Advanced Features
 * Demonstrates natural crits and outcome-based advantage/disadvantage
 */

const { rollModTest, DieType, TestType, RollType, Outcome } = require("../src");

console.log("=== Natural Crits (TTRPG-Style) ===\n");

console.log("--- Natural Crits are DEFAULT for Skill tests ---");
console.log(
  "Rolling a natural max (e.g., 20 on d20) always triggers CriticalSuccess"
);
console.log("Rolling a natural 1 always triggers CriticalFailure\n");

// Simulate natural 20
const originalRandom = Math.random;
Math.random = () => 0.999; // Will roll 20

const nat20Result = rollModTest(DieType.D20, (n) => n - 5, {
  testType: TestType.Skill,
  target: 10,
  critical_success: 15, // Max achievable: 20-5=15
  critical_failure: -4, // Min achievable: 1-5=-4
});

console.log("Example 1: Natural 20 with negative modifier");
console.log(`  Modifier: -5`);
console.log(`  Base roll: ${nat20Result.base} (natural 20!)`);
console.log(`  Modified: ${nat20Result.modified} (20-5=15)`);
console.log(`  Outcome: ${nat20Result.outcome}`);
console.log(`  → Natural 20 forces CriticalSuccess, even with penalty`);
console.log();

// Restore and simulate natural 1
Math.random = () => 0.001; // Will roll 1

const nat1Result = rollModTest(
  DieType.D20,
  (n) => n + 100, // Massive bonus
  {
    testType: TestType.Skill,
    target: 105,
    critical_success: 120, // Max achievable: 20+100=120
    critical_failure: 101, // Min achievable: 1+100=101
  }
);

console.log("Example 2: Natural 1 with huge bonus");
console.log(`  Modifier: +100`);
console.log(`  Base roll: ${nat1Result.base} (natural 1!)`);
console.log(`  Modified: ${nat1Result.modified} (1+100=101)`);
console.log(`  Outcome: ${nat1Result.outcome}`);
console.log(`  → Natural 1 forces CriticalFailure, even with massive bonus`);
console.log(`  → Without natural crits, 101 >= 105 would be Success`);
console.log();

// Restore Math.random
Math.random = originalRandom;

console.log("--- Natural Crits with Different Die Types ---\n");

Math.random = () => 0.999; // Will roll max

const d6MaxResult = rollModTest(DieType.D6, (n) => n + 2, {
  testType: TestType.Skill,
  target: 5,
  critical_success: 8, // Max: 6+2=8
  critical_failure: 3, // Min: 1+2=3
});

console.log("D6 with natural max (6):");
console.log(`  Base: ${d6MaxResult.base}, Modified: ${d6MaxResult.modified}`);
console.log(`  Outcome: ${d6MaxResult.outcome} (natural max triggers crit!)`);
console.log();

Math.random = () => 0.001; // Will roll 1

const d6MinResult = rollModTest(DieType.D6, (n) => n + 2, {
  testType: TestType.Skill,
  target: 5,
  critical_success: 8, // Max: 6+2=8
  critical_failure: 3, // Min: 1+2=3
});

console.log("D6 with natural min (1):");
console.log(`  Base: ${d6MinResult.base}, Modified: ${d6MinResult.modified}`);
console.log(
  `  Outcome: ${d6MinResult.outcome} (natural 1 triggers crit fail!)`
);
console.log();

Math.random = originalRandom;

console.log("--- Disabling Natural Crits (opt-in) ---\n");

Math.random = () => 0.999; // Will roll 20

const noNatCrits = rollModTest(
  DieType.D20,
  (n) => n + 5,
  {
    testType: TestType.Skill,
    target: 15,
    critical_success: 25, // Max: 20+5=25
    critical_failure: 6, // Min: 1+5=6
  },
  undefined,
  { useNaturalCrits: false } // Explicitly disable
);

console.log("With useNaturalCrits: false");
console.log(`  Base roll: ${noNatCrits.base} (natural 20)`);
console.log(`  Modified: ${noNatCrits.modified}`);
console.log(`  Outcome: ${noNatCrits.outcome}`);
console.log(
  `  → CriticalSuccess by threshold (25 >= 25), not by natural crit override`
);
console.log();

Math.random = originalRandom;

console.log("\n=== Outcome-Based Advantage/Disadvantage ===\n");

console.log("--- How It Works ---");
console.log("Traditional advantage: picks higher base roll");
console.log("Outcome-based: picks better final outcome after evaluation");
console.log(
  "Outcomes ranked: CriticalFailure (0) < Failure (1) < Success (2) < CriticalSuccess (3)\n"
);

console.log("--- Advantage Example ---");

Math.random = (() => {
  const values = [0.9, 0.05]; // Will roll 19 and 2
  let i = 0;
  return () => values[i++];
})();

const advExample = rollModTest(
  DieType.D20,
  (n) => n + 5,
  {
    testType: TestType.Skill,
    target: 10,
    critical_success: 24, // 19+5=24 hits this!
    critical_failure: 7, // 2+5=7 doesn't
  },
  RollType.Advantage
);

console.log("D20+5 with advantage:");
console.log(`  Roll 1: base=19, modified=24 → CriticalSuccess (rank 3)`);
console.log(`  Roll 2: base=2, modified=7 → Success (rank 2)`);
console.log(`  Selected: Roll 1 (CriticalSuccess > Success)`);
console.log(`  Result base: ${advExample.base}`);
console.log(`  Result modified: ${advExample.modified}`);
console.log(`  Result outcome: ${advExample.outcome}`);
console.log();

Math.random = originalRandom;

console.log("--- Disadvantage Example ---");

Math.random = (() => {
  const values = [0.9, 0.1]; // Will roll 18 and 3
  let i = 0;
  return () => values[i++];
})();

const disExample = rollModTest(
  DieType.D20,
  (n) => n - 3,
  { testType: TestType.AtLeast, target: 12 },
  RollType.Disadvantage
);

console.log("D20-3 with disadvantage vs DC 12:");
console.log(`  Roll 1: base=18, modified=15 → Success (rank 2)`);
console.log(`  Roll 2: base=3, modified=0 → Failure (rank 1)`);
console.log(`  Selected: Roll 2 (Failure < Success)`);
console.log(`  Result base: ${disExample.base}`);
console.log(`  Result modified: ${disExample.modified}`);
console.log(`  Result outcome: ${disExample.outcome}`);
console.log();

Math.random = originalRandom;

console.log("\n=== Combining Natural Crits + Advantage ===\n");

console.log("--- Natural 20 with Advantage ---");
console.log("Natural crits are evaluated BEFORE comparing outcomes\n");

Math.random = (() => {
  const values = [0.999, 0.5]; // Will roll 20 and 11
  let i = 0;
  return () => values[i++];
})();

const natCritAdv = rollModTest(
  DieType.D20,
  (n) => n + 2,
  {
    testType: TestType.Skill,
    target: 12,
    critical_success: 22, // Max: 20+2=22
    critical_failure: 3, // Min: 1+2=3
  },
  RollType.Advantage
);

console.log("D20+2 skill check with advantage:");
console.log(
  `  Roll 1: base=20 (natural max!) → CriticalSuccess by natural crit (rank 3)`
);
console.log(`  Roll 2: base=11, modified=13 → Success (rank 2)`);
console.log(`  Selected: Roll 1 (CriticalSuccess > Success)`);
console.log(`  Result base: ${natCritAdv.base}`);
console.log(`  Result outcome: ${natCritAdv.outcome}`);
console.log(`  → Natural 20 always wins with advantage`);
console.log();

Math.random = originalRandom;

console.log("--- Natural 1 with Disadvantage ---");

Math.random = (() => {
  const values = [0.999, 0.001]; // Will roll 20 and 1
  let i = 0;
  return () => values[i++];
})();

const natFailDis = rollModTest(
  DieType.D20,
  (n) => n + 100, // Massive bonus doesn't save natural 1
  {
    testType: TestType.Skill,
    target: 105,
    critical_success: 120, // Max: 20+100=120
    critical_failure: 101, // Min: 1+100=101
  },
  RollType.Disadvantage
);

console.log("D20+100 with disadvantage:");
console.log(`  Roll 1: base=20, modified=120 → CriticalSuccess (rank 3)`);
console.log(
  `  Roll 2: base=1 (natural min!), modified=101 → CriticalFailure by natural crit (rank 0)`
);
console.log(`  Selected: Roll 2 (CriticalFailure < CriticalSuccess)`);
console.log(`  Result base: ${natFailDis.base}`);
console.log(`  Result modified: ${natFailDis.modified}`);
console.log(`  Result outcome: ${natFailDis.outcome}`);
console.log(
  `  → Natural 1 always loses with disadvantage, even with +100 bonus`
);
console.log();

Math.random = originalRandom;

console.log("\n=== Practical TTRPG Examples ===\n");

console.log("--- D&D 5e Style Attack Roll ---");

Math.random = () => 0.999; // Natural 20

const attackRoll = rollModTest(DieType.D20, (n) => n + 7, {
  testType: TestType.Skill,
  target: 18, // Enemy AC
  critical_success: 27, // Max: 20+7=27
  critical_failure: 8, // Min: 1+7=8
});

console.log(`Attack with +7 bonus vs AC 18:`);
console.log(`  Base: ${attackRoll.base}, Modified: ${attackRoll.modified}`);
console.log(`  Outcome: ${attackRoll.outcome}`);

if (attackRoll.outcome === Outcome.CriticalSuccess) {
  console.log(`  → CRITICAL HIT! Roll double damage dice.`);
} else if (attackRoll.outcome === Outcome.Success) {
  console.log(`  → Hit! Roll damage.`);
} else {
  console.log(`  → Miss!`);
}
console.log();

Math.random = originalRandom;

console.log("--- Saving Throw with Advantage ---");

Math.random = (() => {
  const values = [0.3, 0.8]; // Will roll 7 and 17
  let i = 0;
  return () => values[i++];
})();

const savingThrow = rollModTest(
  DieType.D20,
  (n) => n + 3,
  {
    testType: TestType.Skill,
    target: 15,
    critical_success: 23, // Max: 20+3=23
    critical_failure: 4, // Min: 1+3=4
  },
  RollType.Advantage
);

console.log(`Constitution save with advantage (+3 vs DC 15):`);
console.log(`  Roll 1: 7+3=10 → Failure`);
console.log(`  Roll 2: 17+3=20 → Success`);
console.log(`  Selected: Success (better outcome)`);
console.log(`  Result: ${savingThrow.outcome}`);
console.log();

Math.random = originalRandom;
