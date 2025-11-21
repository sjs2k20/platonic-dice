/**
 * Example usage of rollModTest
 * Demonstrates combining modifiers with test conditions, including
 * the ability to use targets outside the base die range when modifiers extend it.
 */

const {
  rollModTest,
  DieType,
  RollType,
  RollModifier,
  TestType,
  Outcome,
} = require("../src");

// Example 1: Simple skill check with modifier
console.log("=== Example 1: D20 skill check with +5 bonus ===");
const result1 = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(`Base roll: ${result1.base}`);
console.log(`Modified (base + 5): ${result1.modified}`);
console.log(`Outcome: ${result1.outcome}`);
console.log(`Success: ${result1.outcome === Outcome.Success}\n`);

// Example 2: Using RollModifier instance with advantage
console.log("=== Example 2: D20 with advantage and +3 bonus ===");
const bonus = new RollModifier((n) => n + 3);
const result2 = rollModTest(
  DieType.D20,
  bonus,
  {
    testType: TestType.Skill,
    target: 12,
    critical_success: 23, // Max achievable: 20+3=23
    critical_failure: 4, // Min achievable: 1+3=4
  },
  RollType.Advantage
);
console.log(`Base roll (with advantage): ${result2.base}`);
console.log(`Modified (base + 3): ${result2.modified}`);
console.log(`Outcome: ${result2.outcome}\n`);

// Example 3: Exact value test with modifier
console.log("=== Example 3: D6 exact value check ===");
const result3 = rollModTest(DieType.D6, (n) => n + 2, {
  testType: TestType.Exact,
  target: 5,
});
console.log(`Base roll: ${result3.base}`);
console.log(`Modified (base + 2): ${result3.modified}`);
console.log(`Target: 5`);
console.log(`Outcome: ${result3.outcome}`);
console.log(`Hit exact target: ${result3.outcome === Outcome.Success}\n`);

// Example 4: Penalty modifier with disadvantage
console.log("=== Example 4: D10 with disadvantage and -2 penalty ===");
const result4 = rollModTest(
  DieType.D10,
  (n) => n - 2,
  { testType: TestType.AtMost, target: 5 },
  RollType.Disadvantage
);
console.log(`Base roll (with disadvantage): ${result4.base}`);
console.log(`Modified (base - 2): ${result4.modified}`);
console.log(`Outcome: ${result4.outcome}\n`);

// Example 5: Complex modifier with skill test
console.log("=== Example 5: D20 skill test with complex modifier ===");
const complexMod = new RollModifier((n) => Math.min(n + 7, 20)); // +7 but capped at 20
const result5 = rollModTest(DieType.D20, complexMod, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 20, // Max is capped at 20
  critical_failure: 8, // Min achievable: 1+7=8
});
console.log(`Base roll: ${result5.base}`);
console.log(`Modified (base + 7, max 20): ${result5.modified}`);
console.log(`Outcome: ${result5.outcome}`);
console.log(`Critical success: ${result5.outcome === Outcome.CriticalSuccess}`);
console.log(
  `Critical failure: ${result5.outcome === Outcome.CriticalFailure}\n`
);

// Example 6: Extended range - target above base die range
console.log("=== Example 6: Extended range validation ===");
console.log("D6 normally has range 1-6, but with +10 modifier has range 11-16");
const result6 = rollModTest(
  DieType.D6,
  (n) => n + 10,
  { testType: TestType.AtLeast, target: 15 } // Valid! 15 is achievable with modifier
);
console.log(`Base roll: ${result6.base}`);
console.log(`Modified (base + 10): ${result6.modified}`);
console.log(`Target: 15 (outside base die range, but within modified range)`);
console.log(`Outcome: ${result6.outcome}\n`);

// Example 7: Extended range with negative modifier
console.log("=== Example 7: Negative modifier extending range downward ===");
console.log("D20 with -5 modifier has range -4 to 15");
const result7 = rollModTest(
  DieType.D20,
  (n) => n - 5,
  { testType: TestType.AtMost, target: 0 } // Valid! 0 is achievable
);
console.log(`Base roll: ${result7.base}`);
console.log(`Modified (base - 5): ${result7.modified}`);
console.log(
  `Target: 0 (would be invalid for base die, but valid with modifier)`
);
console.log(`Outcome: ${result7.outcome}\n`);

// Example 8: Natural crits with TTRPG-style mechanics
console.log("=== Example 8: Natural critical hits (TTRPG style) ===");
console.log(
  "With useNaturalCrits, rolling max die value always triggers critical success"
);

// Simulate a natural 20 with Math.random mock
const originalRandom = Math.random;
Math.random = () => 0.999; // Will roll 20

const result8 = rollModTest(
  DieType.D20,
  (n) => n - 5, // Negative modifier
  {
    testType: TestType.Skill,
    target: 10,
    critical_success: 15, // Max achievable: 20-5=15
    critical_failure: -4, // Min achievable: 1-5=-4
  },
  undefined,
  { useNaturalCrits: true }
);

console.log(`Base roll: ${result8.base} (natural 20!)`);
console.log(`Modified: ${result8.modified} (20-5=15)`);
console.log(`Outcome: ${result8.outcome} (natural crit overrides!)`);
console.log(
  `Note: Natural 20 triggers CriticalSuccess even though 15 === critical_success\n`
);

// Restore Math.random
Math.random = originalRandom;

// Example 9: Natural failure with massive bonus
console.log("=== Example 9: Natural 1 always fails (with huge bonus) ===");
Math.random = () => 0.001; // Will roll 1

const result9 = rollModTest(
  DieType.D20,
  (n) => n + 100, // Massive bonus
  {
    testType: TestType.Skill,
    target: 105,
    critical_success: 120, // Max achievable: 20+100=120
    critical_failure: 101, // Min achievable: 1+100=101
  },
  undefined,
  { useNaturalCrits: true }
);

console.log(`Base roll: ${result9.base} (natural 1!)`);
console.log(`Modified: ${result9.modified} (1+100=101)`);
console.log(`Outcome: ${result9.outcome} (natural fail overrides!)`);
console.log(`Without useNaturalCrits, would be: Success or CriticalSuccess\n`);

Math.random = originalRandom;

// Example 10: Outcome-based advantage/disadvantage
console.log("=== Example 10: Outcome-based advantage ===");
console.log(
  "Advantage picks the better OUTCOME, not just the higher base roll"
);

Math.random = (() => {
  const values = [0.9, 0.05]; // Will roll 19 and 2
  let i = 0;
  return () => values[i++];
})();

const result10 = rollModTest(
  DieType.D20,
  (n) => n + 5,
  {
    testType: TestType.Skill,
    target: 10,
    critical_success: 24, // 19+5=24 hits this!
    critical_failure: 6, // 2+5=7 misses this
  },
  RollType.Advantage
);

console.log(`Roll 1: base=19, modified=24 → CriticalSuccess`);
console.log(`Roll 2: base=2, modified=7 → Success`);
console.log(`Selected: Roll 1 (CriticalSuccess > Success)`);
console.log(`Result base: ${result10.base}`);
console.log(`Result modified: ${result10.modified}`);
console.log(`Result outcome: ${result10.outcome}\n`);

Math.random = originalRandom;

// Example 11: Combining natural crits with advantage
console.log("=== Example 11: Natural crits + Advantage ===");
console.log("Natural 20 will always be selected with advantage");

Math.random = (() => {
  const values = [0.999, 0.5]; // Will roll 20 and 11
  let i = 0;
  return () => values[i++];
})();

const result11 = rollModTest(
  DieType.D20,
  (n) => n + 2,
  {
    testType: TestType.Skill,
    target: 12,
    critical_success: 22, // Max achievable: 20+2=22
    critical_failure: 3, // Min achievable: 1+2=3
  },
  RollType.Advantage,
  { useNaturalCrits: true }
);

console.log(
  `Roll 1: base=20 (natural max!) → CriticalSuccess (by natural crit)`
);
console.log(`Roll 2: base=11, modified=13 → Success`);
console.log(`Selected: Roll 1 (CriticalSuccess > Success)`);
console.log(`Result base: ${result11.base}`);
console.log(`Result outcome: ${result11.outcome}\n`);

Math.random = originalRandom;
