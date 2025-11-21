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
const attackBonus = new RollModifier(
  (n) => n + 5,
  "Attack Bonus (+3 STR, +2 Proficiency)"
);

const attack = rollMod(DieType.D20, attackBonus);
console.log(`Description: ${attackBonus.description}`);
console.log(`Roll: ${attack.base} + 5 = ${attack.modified}\n`);

// Example 2: Modifier without description
console.log("=== Modifier Without Description ===");
const simpleBonus = new RollModifier((n) => n + 3);
console.log(`Description: ${simpleBonus.description || "(none)"}`);

const result = rollMod(DieType.D20, simpleBonus);
console.log(`Roll: ${result.base} → ${result.modified}\n`);

// Example 3: Conditional modifier
console.log("=== Conditional Modifier (Minimum Damage) ===");
const grazingHit = new RollModifier(
  (n) => Math.max(n, 5),
  "Great Weapon Fighting (min 5)"
);

for (let i = 0; i < 5; i++) {
  const damage = rollMod(DieType.D8, grazingHit);
  console.log(
    `  ${damage.base} → ${damage.modified} (${grazingHit.description})`
  );
}
console.log();

// Example 4: Stacking modifiers
console.log("=== Stacking Modifiers ===");
function combineModifiers(...modifiers) {
  return new RollModifier(
    (n) => {
      return modifiers.reduce((acc, mod) => mod.modifierFn(acc), n);
    },
    modifiers
      .map((m) => m.description)
      .filter(Boolean)
      .join(" + ")
  );
}

const abilityMod = new RollModifier((n) => n + 3, "STR +3");
const proficiency = new RollModifier((n) => n + 4, "Proficiency +4");
const magicWeapon = new RollModifier((n) => n + 1, "+1 Weapon");

const totalMod = combineModifiers(abilityMod, proficiency, magicWeapon);
console.log(`Combined: ${totalMod.description}`);

const attackRoll = rollMod(DieType.D20, totalMod);
console.log(`Roll: ${attackRoll.base} + 8 = ${attackRoll.modified}\n`);

// Example 5: Debugging with descriptions
console.log("=== Multiple Modifiers with Logging ===");
const modifiers = [
  new RollModifier((n) => n + 2, "Bless"),
  new RollModifier((n) => n + 4, "Bardic Inspiration"),
  new RollModifier((n) => n - 2, "Exhaustion Penalty"),
];

modifiers.forEach((mod) => {
  const result = rollMod(DieType.D20, mod);
  console.log(`${mod.description}: ${result.base} → ${result.modified}`);
});
console.log();

// Example 6: Bonus library system
console.log("=== Bonus Library ===");
class BonusLibrary {
  static proficiency(level) {
    const bonus = Math.floor((level - 1) / 4) + 2;
    return new RollModifier(
      (n) => n + bonus,
      `Proficiency +${bonus} (Level ${level})`
    );
  }

  static ability(score) {
    const modifier = Math.floor((score - 10) / 2);
    return new RollModifier(
      (n) => n + modifier,
      `Ability ${modifier >= 0 ? "+" : ""}${modifier}`
    );
  }

  static magicItem(bonus) {
    return new RollModifier((n) => n + bonus, `+${bonus} Magic Item`);
  }
}

const level5Prof = BonusLibrary.proficiency(5);
const strBonus = BonusLibrary.ability(16);
const magicSword = BonusLibrary.magicItem(2);

console.log(
  `${level5Prof.description}: ${
    rollMod(DieType.D20, level5Prof).modified - roll(DieType.D20)
  }`
);
console.log(
  `${strBonus.description}: ${
    rollMod(DieType.D20, strBonus).modified - roll(DieType.D20)
  }`
);
console.log(`${magicSword.description}: +${magicSword.modifierFn(0)}\n`);

// Example 7: Modifier audit trail
console.log("=== Modifier Audit Trail ===");
class ModifierStack {
  constructor() {
    this.modifiers = [];
  }

  add(modifier) {
    this.modifiers.push(modifier);
    return this;
  }

  apply(baseValue) {
    let current = baseValue;
    const steps = [];

    this.modifiers.forEach((mod) => {
      const before = current;
      current = mod.modifierFn(current);
      steps.push({
        description: mod.description || "Anonymous",
        before,
        after: current,
        change: current - before,
      });
    });

    return { final: current, steps };
  }
}

const baseRoll = roll(DieType.D20);
console.log(`Base roll: ${baseRoll}`);

const stack = new ModifierStack()
  .add(new RollModifier((n) => n + 5, "Base Attack Bonus"))
  .add(new RollModifier((n) => n + 2, "Magic Item"))
  .add(new RollModifier((n) => n - 3, "Exhaustion Penalty"));

const auditResult = stack.apply(baseRoll);
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
const criticalDamage = new RollModifier(
  (n) => Math.floor(n * 1.5),
  "Critical Hit (×1.5)"
);

const baseDamage = roll(DieType.D8);
const critDamage = criticalDamage.modifierFn(baseDamage);
console.log(`Base damage: ${baseDamage}`);
console.log(`${criticalDamage.description}: ${critDamage}\n`);

// Example 9: With rollModTest
console.log("=== Using with rollModTest ===");
const skillBonus = new RollModifier(
  (n) => n + 7,
  "Persuasion (+3 CHA, +4 Proficiency)"
);

const skillCheck = rollModTest(DieType.D20, skillBonus, {
  testType: TestType.AtLeast,
  target: 18,
});

console.log(`${skillBonus.description}`);
console.log(`Roll: ${skillCheck.base} + 7 = ${skillCheck.modified}`);
console.log(`Result: ${skillCheck.outcome}\n`);

// Example 10: Named modifier collection
console.log("=== Named Modifier Collection ===");
const commonModifiers = {
  bless: new RollModifier((n) => n + roll(DieType.D4), "Bless"),
  guidance: new RollModifier((n) => n + roll(DieType.D4), "Guidance"),
  bardicInspiration: new RollModifier(
    (n) => n + roll(DieType.D6),
    "Bardic Inspiration"
  ),
  cover: new RollModifier((n) => n + 2, "Half Cover"),
  advantage: new RollModifier((n) => n, "Advantage (roll twice)"),
};

console.log("Available modifiers:");
Object.entries(commonModifiers).forEach(([key, mod]) => {
  console.log(`  - ${key}: ${mod.description}`);
});
console.log();

// Example 11: Negative modifier
console.log("=== Negative Modifier ===");
const disadvantage = new RollModifier(
  (n) => n - 5,
  "Disadvantage Approximation (-5)"
);

const disadCheck = rollMod(DieType.D20, disadvantage);
console.log(`${disadvantage.description}`);
console.log(`${disadCheck.base} - 5 = ${disadCheck.modified}\n`);

// Example 12: Clamped modifier
console.log("=== Clamped Modifier (Range 1-20) ===");
const clamped = new RollModifier(
  (n) => Math.max(1, Math.min(20, n + 15)),
  "Huge Bonus (clamped to 1-20)"
);

for (let i = 0; i < 3; i++) {
  const clampedRoll = rollMod(DieType.D20, clamped);
  console.log(`  ${clampedRoll.base} → ${clampedRoll.modified}`);
}
