/**
 * Example usage of DieType
 * Demonstrates die type enum usage
 */

const { DieType, roll, rollDice } = require("../../src");

console.log("=== DieType Examples ===\n");

// Example 1: Using DieType enum
console.log("--- Using DieType Enum ---");
console.log(`D4: ${roll(DieType.D4)}`);
console.log(`D6: ${roll(DieType.D6)}`);
console.log(`D8: ${roll(DieType.D8)}`);
console.log(`D10: ${roll(DieType.D10)}`);
console.log(`D12: ${roll(DieType.D12)}`);
console.log(`D20: ${roll(DieType.D20)}\n`);

// Example 2: Using string literals
console.log("--- Using String Literals ---");
console.log(`d20: ${roll("d20")}`);
console.log(`d6: ${roll("d6")}\n`);

// Example 3: Iterating over all die types
console.log("=== All Die Types ===");
Object.values(DieType).forEach((die) => {
  const result = roll(die);
  console.log(`${die}: ${result}`);
});
console.log();

// Example 4: Die type constants
console.log("=== DieType Values ===");
console.log(`D4 value: "${DieType.D4}"`);
console.log(`D6 value: "${DieType.D6}"`);
console.log(`D8 value: "${DieType.D8}"`);
console.log(`D10 value: "${DieType.D10}"`);
console.log(`D12 value: "${DieType.D12}"`);
console.log(`D20 value: "${DieType.D20}"\n`);

// Example 5: Dynamic die selection
console.log("=== Dynamic Die Selection ===");
function rollBySize(size) {
  const dieMap = {
    tiny: DieType.D4,
    small: DieType.D6,
    medium: DieType.D8,
    large: DieType.D10,
    huge: DieType.D12,
  };

  return roll(dieMap[size]);
}

console.log(`Tiny damage: ${rollBySize("tiny")}`);
console.log(`Small damage: ${rollBySize("small")}`);
console.log(`Medium damage: ${rollBySize("medium")}`);
console.log(`Large damage: ${rollBySize("large")}`);
console.log(`Huge damage: ${rollBySize("huge")}\n`);

// Example 6: Weapon damage mapping
console.log("=== Weapon Damage Dice ===");
const weapons = {
  dagger: DieType.D4,
  mace: DieType.D6,
  longsword: DieType.D8,
  greatsword: { count: 2, die: DieType.D6 },
  greataxe: DieType.D12,
};

console.log(`Dagger: 1${weapons.dagger}`);
console.log(`Mace: 1${weapons.mace}`);
console.log(`Longsword: 1${weapons.longsword}`);
console.log(`Greatsword: ${weapons.greatsword.count}${weapons.greatsword.die}`);
console.log(`Greataxe: 1${weapons.greataxe}\n`);

// Example 7: Class hit dice
console.log("=== Class Hit Dice ===");
const classes = {
  sorcerer: DieType.D6,
  wizard: DieType.D6,
  bard: DieType.D8,
  cleric: DieType.D8,
  rogue: DieType.D8,
  fighter: DieType.D10,
  paladin: DieType.D10,
  ranger: DieType.D10,
  barbarian: DieType.D12,
};

Object.entries(classes).forEach(([className, hitDie]) => {
  const hp = roll(hitDie);
  console.log(`${className.padEnd(10)} (${hitDie}): ${hp} HP at level 1`);
});
console.log();

// Example 8: Rolling multiple dice of different types
console.log("=== Mixed Dice Rolls ===");
console.log(
  "Fireball damage (8d6):",
  rollDice(DieType.D6, { count: 8 }).array.join(" + ")
);
console.log(
  "Fall damage (6d6):",
  rollDice(DieType.D6, { count: 6 }).array.join(" + ")
);
console.log(
  "Healing (2d8):",
  rollDice(DieType.D8, { count: 2 }).array.join(" + ")
);
console.log();

// Example 9: Conditional die selection
console.log("=== Conditional Die Selection ===");
function selectWeaponDie(weaponSize, isTwoHanded) {
  if (weaponSize === "light") return DieType.D4;
  if (weaponSize === "small") return DieType.D6;

  if (isTwoHanded) {
    return weaponSize === "medium" ? DieType.D10 : DieType.D12;
  } else {
    return weaponSize === "medium" ? DieType.D8 : DieType.D10;
  }
}

console.log(`Light weapon: 1${selectWeaponDie("light", false)}`);
console.log(`Small one-handed: 1${selectWeaponDie("small", false)}`);
console.log(`Medium one-handed: 1${selectWeaponDie("medium", false)}`);
console.log(`Medium two-handed: 1${selectWeaponDie("medium", true)}`);
console.log(`Large two-handed: 1${selectWeaponDie("large", true)}\n`);

// Example 10: Spell level to damage dice
console.log("=== Spell Damage by Level ===");
function getSpellDamageDice(spellLevel) {
  const baseCount = 2 + spellLevel;
  return { count: baseCount, die: DieType.D6 };
}

for (let level = 1; level <= 5; level++) {
  const { count, die } = getSpellDamageDice(level);
  const damage = rollDice(die, { count });
  console.log(`Level ${level} spell (${count}${die}): ${damage.sum}`);
}
