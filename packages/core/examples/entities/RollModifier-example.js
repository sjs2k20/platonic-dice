/**
 * Example usage of RollModifier
 * Demonstrates modifier class usage
 */

const {
  RollModifier,
  rollMod,
  rollModTest,
  roll,
  DieType,
  TestType,
} = require("../../src");

console.log("=== RollModifier Examples ===\n");

// Example 1: Basic RollModifier
console.log("--- Basic RollModifier ---");
const attackBonus = new RollModifier((n) => n + 5);

const attack = rollMod(DieType.D20, attackBonus);
console.log(`Roll: ${attack.base} + 5 = ${attack.modified}\n`);

// Example 2: Modifier without description
console.log("=== Modifier Without Description ===");
const simpleBonus = new RollModifier((n) => n + 3);

const result = rollMod(DieType.D20, simpleBonus);
console.log(`Roll: ${result.base} → ${result.modified}\n`);

// Example 3: Conditional modifier
console.log("=== Conditional Modifier (Minimum Damage) ===");
const grazingHit = new RollModifier((n) => Math.max(n, 5));

for (let i = 0; i < 5; i++) {
  const damage = rollMod(DieType.D8, grazingHit);
  console.log(`  ${damage.base} → ${damage.modified}`);
}
console.log();

// Example 4: Stacking modifiers
console.log("=== Stacking Modifiers ===");
function combineModifiers(...modifiers) {
  return new RollModifier((n) => {
    return modifiers.reduce((acc, mod) => mod.fn(acc), n);
  });
}

const abilityMod = new RollModifier((n) => n + 3);
const proficiency = new RollModifier((n) => n + 4);
const magicWeapon = new RollModifier((n) => n + 1);

const totalMod = combineModifiers(abilityMod, proficiency, magicWeapon);

const attackRoll = rollMod(DieType.D20, totalMod);
console.log(`Roll: ${attackRoll.base} + 8 = ${attackRoll.modified}\n`);

// Example 5: Multiple modifiers
console.log("=== Multiple Modifiers ===");
const bless = new RollModifier((n) => n + 2);
const bardicInspiration = new RollModifier((n) => n + 4);
const exhaustion = new RollModifier((n) => n - 2);

console.log(`Bless: ${rollMod(DieType.D20, bless).modified}`);
console.log(
  `Bardic Inspiration: ${rollMod(DieType.D20, bardicInspiration).modified}`
);
console.log(`Exhaustion: ${rollMod(DieType.D20, exhaustion).modified}\n`);

// Example 6: Bonus library system
console.log("=== Bonus Library ===");
class BonusLibrary {
  static proficiency(level) {
    const bonus = Math.floor((level - 1) / 4) + 2;
    return new RollModifier((n) => n + bonus);
  }

  static ability(score) {
    const modifier = Math.floor((score - 10) / 2);
    return new RollModifier((n) => n + modifier);
  }

  static magicItem(bonus) {
    return new RollModifier((n) => n + bonus);
  }
}

const level5Prof = BonusLibrary.proficiency(5);
const strBonus = BonusLibrary.ability(16);
const magicSword = BonusLibrary.magicItem(2);

console.log(
  `Proficiency +3 (Level 5): ${
    rollMod(DieType.D20, level5Prof).modified -
    rollMod(DieType.D20, level5Prof).base
  }`
);
console.log(
  `STR Ability +3 (16): ${
    rollMod(DieType.D20, strBonus).modified -
    rollMod(DieType.D20, strBonus).base
  }`
);
console.log(`Magic Sword +2: ${magicSword.fn(0)}\n`);

// Example 7: Modifier audit trail
console.log("=== Modifier Audit Trail ===");
class ModifierStack {
  constructor() {
    this.modifiers = [];
    this.descriptions = [];
  }

  add(modifier, description) {
    this.modifiers.push(modifier);
    this.descriptions.push(description);
    return this;
  }

  apply(baseValue) {
    let current = baseValue;
    const steps = [];

    this.modifiers.forEach((mod, index) => {
      const before = current;
      current = mod.fn(current);
      steps.push({
        description: this.descriptions[index] || "Anonymous",
        before,
        after: current,
        change: current - before,
      });
    });

    return { final: current, steps };
  }
}

const baseRoll2 = roll(DieType.D20);
console.log(`Base roll: ${baseRoll2}`);

const stack = new ModifierStack()
  .add(new RollModifier((n) => n + 5), "Base Attack Bonus")
  .add(new RollModifier((n) => n + 2), "Magic Item")
  .add(new RollModifier((n) => n - 3), "Exhaustion Penalty");

const auditResult = stack.apply(baseRoll2);
console.log(`\nModification steps:`);
auditResult.steps.forEach((step) => {
  console.log(
    `  ${step.description}: ${step.before} → ${step.after} (${
      step.change >= 0 ? "+" : ""
    }${step.change})`
  );
});
console.log(`\nFinal: ${auditResult.final}\n`);

// Example 8: Percentage modifier
console.log("=== Percentage Modifier ===");
const criticalDamage = new RollModifier((n) => Math.floor(n * 1.5));

const baseDamage = roll(DieType.D8);
const critDamage = criticalDamage.fn(baseDamage);
console.log(`Base damage: ${baseDamage}`);
console.log(`Critical Hit (×1.5): ${critDamage}\n`);

// Example 9: With rollModTest
console.log("=== Using with rollModTest ===");
const skillBonus = new RollModifier((n) => n + 7);

const skillCheck = rollModTest(DieType.D20, skillBonus, {
  testType: TestType.AtLeast,
  target: 18,
});

console.log(`Persuasion (+3 CHA, +4 Proficiency)`);
console.log(`Roll: ${skillCheck.base} + 7 = ${skillCheck.modified}`);
console.log(`Result: ${skillCheck.outcome}\n`);

// Example 10: Named modifier collection
console.log("=== Named Modifier Collection ===");
const commonModifiers = {
  bless: new RollModifier((n) => n + roll(DieType.D4)),
  guidance: new RollModifier((n) => n + roll(DieType.D4)),
  bardicInspiration: new RollModifier((n) => n + roll(DieType.D6)),
  cover: new RollModifier((n) => n + 2),
};

console.log("Available modifiers:");
console.log("  - bless: +1d4");
console.log("  - guidance: +1d4");
console.log("  - bardicInspiration: +1d6");
console.log("  - cover: +2");
console.log();

// Example 11: Negative modifier
// Example 11: Negative modifier
console.log("=== Negative Modifier ===");
const disadvantage = new RollModifier((n) => n - 5);

const disadCheck = rollMod(DieType.D20, disadvantage);
console.log(`Disadvantage Approximation (-5)`);
console.log(`${disadCheck.base} - 5 = ${disadCheck.modified}\n`);

// Example 12: Clamped modifier
console.log("=== Clamped Modifier (Range 1-20) ===");
const clamped = new RollModifier((n) => Math.max(1, Math.min(20, n + 15)));

console.log("Huge Bonus (clamped to 1-20):");
for (let i = 0; i < 3; i++) {
  const clampedRoll = rollMod(DieType.D20, clamped);
  console.log(`  ${clampedRoll.base} → ${clampedRoll.modified}`);
}
