const {
  roll,
  rollMod,
  rollAdv,
  rollDis,
  rollD20,
  rollD20P1,
  rollD20P2,
  rollD20P3,
  rollD20P5,
  rollD20P7,
  rollD20P10,
  rollD20M1,
  rollD20M2,
  rollD20M3,
  rollD6P2,
  rollD6P3,
  rollD8P3,
  rollD8P4,
  rollD6T2,
  rollD6T3,
  rollD8T2,
  rollD10T10,
  rollD10T100,
  rollD20T5,
  DieType,
  RollType,
} = require("..");

console.log("=== How rollMod Builds on roll ===\n");

// Demonstrating the relationship
console.log("--- roll() returns a simple number ---");
const simpleRoll = roll(DieType.D20);
console.log(`roll(D20): ${simpleRoll}`);
console.log();

console.log("--- rollMod() returns base AND modified ---");
const modRoll = rollMod(DieType.D20, (n) => n + 5);
console.log(`rollMod(D20, +5):`);
console.log(`  base: ${modRoll.base}`);
console.log(`  modified: ${modRoll.modified}`);
console.log(`  (rolled ${modRoll.base}, then added 5 = ${modRoll.modified})`);
console.log();

console.log("--- Both support advantage/disadvantage ---");
const advRoll = rollAdv(DieType.D20);
console.log(`rollAdv(D20): ${advRoll}`);

const advModRoll = rollMod(DieType.D20, (n) => n + 5, RollType.Advantage);
console.log(`rollMod(D20, +5, Advantage):`);
console.log(`  base: ${advModRoll.base} (best of two rolls)`);
console.log(`  modified: ${advModRoll.modified} (then +5)`);
console.log();

console.log("\n=== Plus Modifier Aliases ===\n");

console.log("--- Returns modified value only ---");
console.log(`rollD20P1(): ${rollD20P1()} (d20 + 1)`);
console.log(`rollD20P2(): ${rollD20P2()} (d20 + 2)`);
console.log(`rollD20P3(): ${rollD20P3()} (d20 + 3)`);
console.log(`rollD20P5(): ${rollD20P5()} (d20 + 5)`);
console.log(`rollD20P7(): ${rollD20P7()} (d20 + 7)`);
console.log(`rollD20P10(): ${rollD20P10()} (d20 + 10)`);
console.log();

console.log("--- Different die types ---");
console.log(`rollD6P2(): ${rollD6P2()} (d6 + 2)`);
console.log(`rollD6P3(): ${rollD6P3()} (d6 + 3)`);
console.log(`rollD8P3(): ${rollD8P3()} (d8 + 3)`);
console.log(`rollD8P4(): ${rollD8P4()} (d8 + 4)`);
console.log();

console.log("--- With advantage/disadvantage ---");
console.log(`rollD20P5(Advantage): ${rollD20P5(RollType.Advantage)}`);
console.log(`rollD20P5(Disadvantage): ${rollD20P5(RollType.Disadvantage)}`);
console.log();

console.log("\n=== Minus Modifier Aliases ===\n");

console.log("--- Penalties ---");
console.log(`rollD20M1(): ${rollD20M1()} (d20 - 1)`);
console.log(`rollD20M2(): ${rollD20M2()} (d20 - 2)`);
console.log(`rollD20M3(): ${rollD20M3()} (d20 - 3)`);
console.log();

console.log("--- With disadvantage ---");
console.log(`rollD20M2(Disadvantage): ${rollD20M2(RollType.Disadvantage)}`);
console.log();

console.log("\n=== Multiplicative Aliases ===\n");

console.log("--- Times modifiers ---");
console.log(`rollD6T2(): ${rollD6T2()} (d6 × 2)`);
console.log(`rollD6T3(): ${rollD6T3()} (d6 × 3)`);
console.log(`rollD8T2(): ${rollD8T2()} (d8 × 2)`);
console.log();

console.log("--- Large multipliers ---");
console.log(`rollD10T10(): ${rollD10T10()} (d10 × 10)`);
console.log(`rollD10T100(): ${rollD10T100()} (d10 × 100)`);
console.log(`rollD20T5(): ${rollD20T5()} (d20 × 5)`);
console.log();

console.log("\n=== Practical Use Cases ===\n");

console.log("--- Attack Roll (d20 + 7) ---");
const attack = rollD20P7();
console.log(`Attack total: ${attack}`);
if (attack >= 15) {
  console.log("  HIT!");
} else {
  console.log("  MISS");
}
console.log();

console.log("--- Ability Check with Proficiency (d20 + 5) ---");
const check = rollD20P5();
console.log(`Skill check: ${check}`);
console.log();

console.log("--- Weapon Damage (d8 + 3) ---");
const damage = rollD8P3();
console.log(`Damage: ${damage} slashing`);
console.log();

console.log("--- Critical Hit (d6 × 2, then add STR) ---");
const critDice = rollD6T2(); // Double the dice
const critDamage = critDice + 3; // Then add modifier
console.log(`Critical: ${critDice} + 3 = ${critDamage} damage`);
console.log();

console.log("--- Random Gold (d10 × 100) ---");
const gold = rollD10T100();
console.log(`Found ${gold} gold pieces!`);
console.log();

console.log("--- Percentage Roll (d20 × 5) ---");
const percentage = rollD20T5();
console.log(`Chance: ${percentage}%`);
console.log();

console.log("\n=== Comparing Approaches ===\n");

console.log("--- When you need BOTH values ---");
const fullResult = rollMod(DieType.D20, (n) => n + 5);
console.log(`Base roll: ${fullResult.base}`);
console.log(`With bonus: ${fullResult.modified}`);
console.log(
  `The +5 made a difference of ${fullResult.modified - fullResult.base}`
);
console.log();

console.log("--- When you only need the TOTAL ---");
const quickResult = rollD20P5();
console.log(`Total: ${quickResult}`);
console.log("(Use aliases for cleaner, faster code)");
console.log();

console.log("\n=== Multiple Rolls ===\n");

console.log("--- Initiative for party ---");
console.log(`Fighter (+1): ${rollD20P1()}`);
console.log(`Rogue (+4): ${rollD20P5()}`); // Using P5 as close to +4
console.log(`Wizard (+2): ${rollD20P2()}`);
console.log(`Cleric (+0): ${rollD20()}`);
console.log();

console.log("--- Multiple attacks ---");
for (let i = 1; i <= 3; i++) {
  const atk = rollD20P7();
  console.log(`Attack ${i}: ${atk}`);
}
console.log();

console.log("--- Different damage types ---");
console.log(`Slashing (d8+3): ${rollD8P3()}`);
console.log(`Piercing (d6+2): ${rollD6P2()}`);
console.log(`Fire (d6+3): ${rollD6P3()}`);
