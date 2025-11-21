/**
 * Example usage of roll
 * Demonstrates basic die rolling with various die types, advantage/disadvantage,
 * and convenience aliases
 */

const {
  roll,
  rollAdv,
  rollDis,
  rollD4,
  rollD6,
  rollD8,
  rollD10,
  rollD12,
  rollD20,
  DieType,
  RollType,
} = require("../src");

console.log("=== Basic Roll Examples ===\n");

// Example 1: Standard rolls for each die type
console.log("--- All Die Types ---");
console.log(`D4:  ${roll(DieType.D4)}`);
console.log(`D6:  ${roll(DieType.D6)}`);
console.log(`D8:  ${roll(DieType.D8)}`);
console.log(`D10: ${roll(DieType.D10)}`);
console.log(`D12: ${roll(DieType.D12)}`);
console.log(`D20: ${roll(DieType.D20)}\n`);

// Example 2: Die type aliases
console.log("--- Die Type Aliases ---");
console.log(`rollD4():  ${rollD4()}`);
console.log(`rollD6():  ${rollD6()}`);
console.log(`rollD8():  ${rollD8()}`);
console.log(`rollD10(): ${rollD10()}`);
console.log(`rollD12(): ${rollD12()}`);
console.log(`rollD20(): ${rollD20()}\n`);

// Example 3: Advantage - roll twice, take higher
console.log("--- Advantage (roll twice, take higher) ---");
for (let i = 1; i <= 3; i++) {
  const result = roll(DieType.D20, RollType.Advantage);
  console.log(`Roll ${i} with advantage: ${result}`);
}
console.log();

// Example 4: Using rollAdv alias
console.log("--- Using rollAdv Alias ---");
for (let i = 1; i <= 3; i++) {
  const result = rollAdv(DieType.D20);
  console.log(`Roll ${i}: rollAdv(D20) = ${result}`);
}
console.log();

// Example 5: Disadvantage - roll twice, take lower
console.log("--- Disadvantage (roll twice, take lower) ---");
for (let i = 1; i <= 3; i++) {
  const result = roll(DieType.D20, RollType.Disadvantage);
  console.log(`Roll ${i} with disadvantage: ${result}`);
}
console.log();

// Example 6: Using rollDis alias
console.log("--- Using rollDis Alias ---");
for (let i = 1; i <= 3; i++) {
  const result = rollDis(DieType.D20);
  console.log(`Roll ${i}: rollDis(D20) = ${result}`);
}
console.log();

// Example 7: Combining die type and roll type aliases
console.log("--- Combining Aliases ---");
console.log(`rollD20(RollType.Advantage): ${rollD20(RollType.Advantage)}`);
console.log(
  `rollD20(RollType.Disadvantage): ${rollD20(RollType.Disadvantage)}`
);
console.log(`rollD10(RollType.Advantage): ${rollD10(RollType.Advantage)}`);
console.log();

// Example 8: Attack roll simulation
console.log("=== Attack Roll Simulation ===");
console.log("Player attacks with advantage:");
const attackRoll = rollAdv(DieType.D20);
console.log(`Attack roll: ${attackRoll}`);
if (attackRoll >= 15) {
  console.log("HIT! Rolling damage...");
  const damage = rollD8();
  console.log(`Damage: ${damage}`);
} else {
  console.log("MISS!");
}
console.log();

// Example 9: Ability score generation (4d6 drop lowest)
console.log("=== Ability Score Generation (4d6 drop lowest) ===");
function rollAbilityScore() {
  const rolls = [rollD6(), rollD6(), rollD6(), rollD6()];
  console.log(`  Rolled: ${rolls.join(", ")}`);

  rolls.sort((a, b) => a - b);
  const dropped = rolls.shift();
  console.log(`  Dropped: ${dropped}`);

  const total = rolls.reduce((sum, val) => sum + val, 0);
  console.log(`  Total: ${total}`);
  return total;
}

const stats = {
  Strength: rollAbilityScore(),
  Dexterity: rollAbilityScore(),
  Constitution: rollAbilityScore(),
  Intelligence: rollAbilityScore(),
  Wisdom: rollAbilityScore(),
  Charisma: rollAbilityScore(),
};

console.log("\nFinal Ability Scores:");
Object.entries(stats).forEach(([stat, value]) => {
  console.log(`  ${stat}: ${value}`);
});
console.log();

// Example 10: Critical hit simulation
console.log("=== Critical Hit Damage ===");
const attackIs20 = 20; // Simulating a crit
console.log(`Attack roll: ${attackIs20} (CRITICAL HIT!)`);
console.log("Rolling double damage dice...");
const normalDamage = rollD8();
const critDamage = rollD8();
const totalDamage = normalDamage + critDamage;
console.log(`  First d8: ${normalDamage}`);
console.log(`  Second d8: ${critDamage}`);
console.log(`  Total damage: ${totalDamage}\n`);

// Example 11: Random encounter
console.log("=== Random Encounter ===");
const encounterType = rollD6();
console.log(`Encounter roll (d6): ${encounterType}`);
switch (encounterType) {
  case 1:
  case 2:
    console.log("Encounter: Nothing");
    break;
  case 3:
  case 4:
    console.log("Encounter: Friendly NPC");
    break;
  case 5:
    console.log("Encounter: Hostile creature");
    const enemyCount = rollD4();
    console.log(`  Number of enemies: ${enemyCount}`);
    break;
  case 6:
    console.log("Encounter: Treasure!");
    const goldPieces = rollD20() * 10;
    console.log(`  Found ${goldPieces} gold pieces`);
    break;
}
console.log();

// Example 12: Initiative order
console.log("=== Initiative Order (Party of 4) ===");
const party = [
  { name: "Fighter", initiative: rollD20() },
  { name: "Rogue (advantage)", initiative: rollAdv(DieType.D20) },
  { name: "Wizard", initiative: rollD20() },
  { name: "Cleric (disadvantage)", initiative: rollDis(DieType.D20) },
];

party.sort((a, b) => b.initiative - a.initiative);
console.log("Turn order:");
party.forEach((character, index) => {
  console.log(`  ${index + 1}. ${character.name}: ${character.initiative}`);
});
console.log();

// Example 13: Percentile-style check with d10s
console.log("=== Percentile Check (using 2d10) ===");
const tens = (rollD10() - 1) * 10; // 0, 10, 20, ..., 90
const ones = rollD10() - 1; // 0-9
const percentile = tens + ones; // 0-99
console.log(`Percentile roll: ${percentile}%`);
if (percentile < 50) {
  console.log("Success! (needed < 50%)");
} else {
  console.log("Failure! (needed < 50%)");
}
console.log();

// Example 14: Wild Magic Surge (d20)
console.log("=== Wild Magic Surge ===");
const surgeRoll = rollD20();
console.log(`Surge check (d20): ${surgeRoll}`);
if (surgeRoll === 1) {
  console.log("WILD MAGIC SURGE! Roll on the wild magic table:");
  const wildMagicEffect = roll(DieType.D100); // Not implemented, but showing concept
  console.log(`  Effect #${wildMagicEffect} occurs!`);
} else {
  console.log("No surge this time.");
}
