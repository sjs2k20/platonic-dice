/**
 * Example usage of rollDiceMod
 * Demonstrates rolling multiple dice with modifiers,
 * showing how it builds on roll, rollMod, and rollDice
 */

const {
  roll,
  rollMod,
  rollDice,
  rollDiceMod,
  rollDiceModArr,
  rollDiceModNet,
  DieType,
} = require("..");

console.log("=== How rollDiceMod Builds on Other Functions ===\n");

console.log("--- roll() returns a simple number ---");
const oneD20 = roll(DieType.D20);
console.log(`roll(D20): ${oneD20}`);
console.log();

console.log("--- rollMod() adds modifier to single die ---");
const modifiedD20 = rollMod(DieType.D20, (n) => n + 5);
console.log(`rollMod(D20, +5):`);
console.log(`  base: ${modifiedD20.base}`);
console.log(`  modified: ${modifiedD20.modified}`);
console.log();

console.log("--- rollDice() rolls multiple dice ---");
const manyD6 = rollDice(DieType.D6, { count: 3 });
console.log(`rollDice(D6, count: 3):`);
console.log(`  array: [${manyD6.array.join(", ")}]`);
console.log(`  sum: ${manyD6.sum}`);
console.log();

console.log("--- rollDiceMod() combines both: multiple dice + modifiers ---");
const damage = rollDiceMod(DieType.D6, (sum) => sum + 2, { count: 3 });
console.log(`rollDiceMod(D6, +2, count: 3):`);
console.log(
  `  base: { array: [${damage.base.array.join(", ")}], sum: ${
    damage.base.sum
  } }`
);
console.log(`  modified.each.sum: ${damage.modified.each.sum}`);
console.log(`  modified.net.value: ${damage.modified.net.value}`);
console.log(
  `  (rolled ${damage.base.sum}, then added 2 = ${damage.modified.net.value})`
);
console.log();

console.log("\n=== Net Modifier Only (Most Common) ===\n");

console.log("--- Single function becomes net modifier ---");
const simple = rollDiceMod(DieType.D6, (sum) => sum + 3, { count: 3 });
console.log(`3d6 + 3:`);
console.log(`  Base sum: ${simple.base.sum}`);
console.log(`  Final total: ${simple.modified.net.value}`);
console.log();

console.log("--- Using rollDiceModNet alias for quick access ---");
const quickDamage = rollDiceModNet(DieType.D6, (sum) => sum + 3, { count: 3 });
console.log(`rollDiceModNet(D6, +3, count: 3): ${quickDamage}`);
console.log("(Returns just the final number - perfect for damage!)");
console.log();

console.log("--- Common D&D damage rolls ---");
console.log(
  `Longsword (1d8+3): ${rollDiceModNet(DieType.D8, (sum) => sum + 3, {
    count: 1,
  })}`
);
console.log(
  `Greatsword (2d6+4): ${rollDiceModNet(DieType.D6, (sum) => sum + 4, {
    count: 2,
  })}`
);
console.log(
  `Fireball (8d6): ${rollDiceModNet(DieType.D6, (sum) => sum, { count: 8 })}`
);
console.log();

console.log("\n=== Both Each and Net Modifiers ===\n");

console.log("--- Per-die modifier AND total modifier ---");
const complex = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n + 1, // +1 to each die
    net: (sum) => sum + 2, // +2 to total
  },
  { count: 3 }
);
console.log("3d6, with +1 to each die, then +2 to total:");
console.log(
  `  Base dice: [${complex.base.array.join(", ")}] = ${complex.base.sum}`
);
console.log(
  `  After +1 each: [${complex.modified.each.array.join(", ")}] = ${
    complex.modified.each.sum
  }`
);
console.log(`  After +2 total: ${complex.modified.net.value}`);
console.log();

console.log(
  "--- Magical weapon (each modifier) + STR bonus (net modifier) ---"
);
const magicWeapon = rollDiceMod(
  DieType.D8,
  {
    each: (n) => n + 1, // Magic weapon adds 1 to each die
    net: (sum) => sum + 3, // STR modifier
  },
  { count: 2 }
);
console.log("Magical 2d8 weapon (+1 per die) with +3 STR:");
console.log(
  `  Base: [${magicWeapon.base.array.join(", ")}] = ${magicWeapon.base.sum}`
);
console.log(
  `  Magic: [${magicWeapon.modified.each.array.join(", ")}] = ${
    magicWeapon.modified.each.sum
  }`
);
console.log(`  +STR: ${magicWeapon.modified.net.value}`);
console.log();

console.log("\n=== Each Modifier Only ===\n");

console.log("--- Modify individual dice without total bonus ---");
const minDice = rollDiceMod(
  DieType.D6,
  {
    each: (n) => Math.max(n, 2), // Minimum 2 on each die
  },
  { count: 4 }
);
console.log("4d6 with minimum 2 per die:");
console.log(`  Base: [${minDice.base.array.join(", ")}]`);
console.log(`  Modified: [${minDice.modified.each.array.join(", ")}]`);
console.log();

console.log("--- Using rollDiceModArr alias ---");
const arrayOnly = rollDiceModArr(
  DieType.D6,
  { each: (n) => Math.max(n, 3) },
  { count: 4 }
);
console.log(`Modified array only: [${arrayOnly.join(", ")}]`);
console.log();

console.log("\n=== Multiplicative Modifiers ===\n");

console.log("--- Double damage (critical hit) ---");
const normalHit = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 1 });
const critHit = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 2 });
console.log(`Normal hit (1d8+3): ${normalHit}`);
console.log(`Critical hit (2d8+3): ${critHit}`);
console.log();

console.log("--- Critical with each modifier ---");
const critDetailed = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n * 2, // Double each die
    net: (sum) => sum + 4, // Then add STR (not doubled)
  },
  { count: 2 }
);
console.log("Critical 2d6, double dice, then +4 STR:");
console.log(
  `  Base: [${critDetailed.base.array.join(", ")}] = ${critDetailed.base.sum}`
);
console.log(
  `  Doubled: [${critDetailed.modified.each.array.join(", ")}] = ${
    critDetailed.modified.each.sum
  }`
);
console.log(`  +STR: ${critDetailed.modified.net.value}`);
console.log();

console.log("\n=== Practical Use Cases ===\n");

console.log("--- Basic Weapon Damage ---");
console.log(
  `Longsword (1d8+3): ${rollDiceModNet(DieType.D8, (sum) => sum + 3, {
    count: 1,
  })}`
);
console.log(
  `Greatsword (2d6+4): ${rollDiceModNet(DieType.D6, (sum) => sum + 4, {
    count: 2,
  })}`
);
console.log(
  `Dagger (1d4+2): ${rollDiceModNet(DieType.D4, (sum) => sum + 2, {
    count: 1,
  })}`
);
console.log();

console.log("--- Spell Damage ---");
console.log(
  `Fireball (8d6): ${rollDiceModNet(DieType.D6, (sum) => sum, { count: 8 })}`
);
console.log(
  `Lightning Bolt (8d6): ${rollDiceModNet(DieType.D6, (sum) => sum, {
    count: 8,
  })}`
);
console.log();

console.log("--- Magic Missile (3 darts of 1d4+1 each) ---");
const dart1 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
const dart2 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
const dart3 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
console.log(`  Dart 1: ${dart1}`);
console.log(`  Dart 2: ${dart2}`);
console.log(`  Dart 3: ${dart3}`);
console.log(`  Total: ${dart1 + dart2 + dart3}`);
console.log();

console.log("--- Sneak Attack Damage ---");
const weaponDmg = rollDiceModNet(DieType.D4, (sum) => sum + 3, { count: 1 }); // Dagger + DEX
const sneakDmg = rollDiceModNet(DieType.D6, (sum) => sum, { count: 3 }); // 3d6 sneak attack
console.log(`Weapon (1d4+3): ${weaponDmg}`);
console.log(`Sneak Attack (3d6): ${sneakDmg}`);
console.log(`Total: ${weaponDmg + sneakDmg}`);
console.log();

console.log("--- Healing Spells ---");
console.log(
  `Cure Wounds (1d8+3): ${rollDiceModNet(DieType.D8, (sum) => sum + 3, {
    count: 1,
  })}`
);
console.log(
  `Mass Cure Wounds (3d8+4): ${rollDiceModNet(DieType.D8, (sum) => sum + 4, {
    count: 3,
  })}`
);
console.log();

console.log("\n=== Complex Example: Elemental Weapon ===\n");

console.log("--- Weapon: 2d6 base ---");
console.log("--- Each die +1 (enchantment) ---");
console.log("--- Total +3 (STR) + 1d4 (elemental damage) ---");
const elementalBonus = roll(DieType.D4);
const elementalWeapon = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n + 1, // Enchantment
    net: (sum) => sum + 3 + elementalBonus, // STR + elemental
  },
  { count: 2 }
);
console.log(
  `Base 2d6: [${elementalWeapon.base.array.join(", ")}] = ${
    elementalWeapon.base.sum
  }`
);
console.log(
  `After enchantment: [${elementalWeapon.modified.each.array.join(", ")}] = ${
    elementalWeapon.modified.each.sum
  }`
);
console.log(`Elemental bonus (1d4): ${elementalBonus}`);
console.log(`Final damage: ${elementalWeapon.modified.net.value}`);
console.log();

console.log("\n=== Multiple Attacks ===\n");

console.log("--- Fighter with Extra Attack (2 attacks) ---");
for (let i = 1; i <= 2; i++) {
  const dmg = rollDiceModNet(DieType.D6, (sum) => sum + 4, { count: 2 });
  console.log(`Attack ${i} (2d6+4): ${dmg}`);
}
console.log();

console.log("--- Different Damage Types ---");
console.log(
  `Slashing (1d8+3): ${rollDiceModNet(DieType.D8, (sum) => sum + 3, {
    count: 1,
  })}`
);
console.log(
  `Piercing (1d6+2): ${rollDiceModNet(DieType.D6, (sum) => sum + 2, {
    count: 1,
  })}`
);
console.log(
  `Fire (2d6): ${rollDiceModNet(DieType.D6, (sum) => sum, { count: 2 })}`
);
console.log();

console.log("\n=== Comparing Full vs Alias Returns ===\n");

console.log("--- Full rollDiceMod() return ---");
const full = rollDiceMod(DieType.D6, (sum) => sum + 5, { count: 3 });
console.log("Structure:");
console.log(
  `  base: { array: [${full.base.array.join(", ")}], sum: ${full.base.sum} }`
);
console.log(
  `  modified.each: { array: [${full.modified.each.array.join(", ")}], sum: ${
    full.modified.each.sum
  } }`
);
console.log(`  modified.net: { value: ${full.modified.net.value} }`);
console.log();

console.log("--- rollDiceModArr() returns modified array ---");
const arr = rollDiceModArr(DieType.D6, { each: (n) => n + 1 }, { count: 3 });
console.log(`Result: [${arr.join(", ")}]`);
console.log("(Use when you need to see individual modified dice)");
console.log();

console.log("--- rollDiceModNet() returns final number ---");
const net = rollDiceModNet(DieType.D6, (sum) => sum + 5, { count: 3 });
console.log(`Result: ${net}`);
console.log("(Use for damage - fastest and cleanest!)");
