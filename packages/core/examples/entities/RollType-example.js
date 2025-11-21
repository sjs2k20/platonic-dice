/**
 * Example usage of RollType
 * Demonstrates roll type enum for advantage/disadvantage
 */

const { RollType, roll, rollTest, DieType, TestType } = require("../../src");

console.log("=== RollType Examples ===\n");

// Example 1: RollType values
console.log("--- RollType Enum Values ---");
console.log(`Normal: "${RollType.Normal}"`);
console.log(`Advantage: "${RollType.Advantage}"`);
console.log(`Disadvantage: "${RollType.Disadvantage}"\n`);

// Example 2: Basic usage
console.log("=== Basic Roll Types ===");
console.log(`Normal: ${roll(DieType.D20)}`);
console.log(`Advantage: ${roll(DieType.D20, RollType.Advantage)}`);
console.log(`Disadvantage: ${roll(DieType.D20, RollType.Disadvantage)}\n`);

// Example 3: Comparing roll types
console.log("=== Comparing Roll Types (10 rolls each) ===");
const results = {
  [RollType.Normal]: [],
  [RollType.Advantage]: [],
  [RollType.Disadvantage]: [],
};

for (let i = 0; i < 10; i++) {
  results[RollType.Normal].push(roll(DieType.D20));
  results[RollType.Advantage].push(roll(DieType.D20, RollType.Advantage));
  results[RollType.Disadvantage].push(roll(DieType.D20, RollType.Disadvantage));
}

Object.entries(results).forEach(([type, rolls]) => {
  const avg = (rolls.reduce((a, b) => a + b, 0) / rolls.length).toFixed(1);
  console.log(`${type}: avg ${avg} | rolls: ${rolls.join(", ")}`);
});
console.log();

// Example 4: Attack with advantage
console.log("=== Attack with Advantage ===");
const attackAdv = rollTest(
  DieType.D20,
  { testType: TestType.AtLeast, target: 15 },
  RollType.Advantage
);

console.log(`Roll: ${attackAdv.roll}, Outcome: ${attackAdv.outcome}`);
console.log("(Hidden, attacking from stealth)\n");

// Example 5: Skill check with disadvantage
console.log("=== Skill Check with Disadvantage ===");
const skillDisadv = rollTest(
  DieType.D20,
  { testType: TestType.Skill, target: 12 },
  RollType.Disadvantage
);

console.log(`Roll: ${skillDisadv.roll}, Outcome: ${skillDisadv.outcome}`);
console.log("(Exhaustion, difficult terrain)\n");

// Example 6: Conditional roll type selection
console.log("=== Conditional Roll Type ===");
function determineRollType(hasAdvantage, hasDisadvantage) {
  if (hasAdvantage && hasDisadvantage) {
    return RollType.Normal; // Cancel out
  }

  if (hasAdvantage) return RollType.Advantage;
  if (hasDisadvantage) return RollType.Disadvantage;
  return RollType.Normal;
}

const scenarios = [
  { adv: false, disadv: false, desc: "Normal conditions" },
  { adv: true, disadv: false, desc: "Friendly help" },
  { adv: false, disadv: true, desc: "Prone" },
  { adv: true, disadv: true, desc: "Both (cancel out)" },
];

scenarios.forEach((s) => {
  const type = determineRollType(s.adv, s.disadv);
  const result = roll(DieType.D20, type);
  console.log(`${s.desc}: ${type} → ${result}`);
});
console.log();

// Example 7: Advantage/disadvantage cancellation
console.log("=== Multiple Sources (Cancellation) ===");
function getEffectiveRollType(advantages, disadvantages) {
  const hasAdv = advantages > 0;
  const hasDisadv = disadvantages > 0;

  if (hasAdv && hasDisadv) {
    return RollType.Normal;
  }

  if (hasAdv) return RollType.Advantage;
  if (hasDisadv) return RollType.Disadvantage;
  return RollType.Normal;
}

console.log("2 advantages, 1 disadvantage:");
const type1 = getEffectiveRollType(2, 1);
console.log(`  Result: ${type1} (cancel out, doesn't stack)\n`);

console.log("3 advantages, 0 disadvantage:");
const type2 = getEffectiveRollType(3, 0);
console.log(`  Result: ${type2} (multiple sources don't stack)\n`);

// Example 8: Situational advantage system
console.log("=== Situational Advantage System ===");
function calculateRollType(conditions) {
  let advantages = 0;
  let disadvantages = 0;

  if (conditions.isHidden) {
    advantages++;
    console.log("  + Hidden (advantage)");
  }
  if (conditions.hasHighGround) {
    advantages++;
    console.log("  + High ground (advantage)");
  }
  if (conditions.targetProne) {
    advantages++;
    console.log("  + Target prone (advantage)");
  }
  if (conditions.isBlinded) {
    disadvantages++;
    console.log("  - Blinded (disadvantage)");
  }
  if (conditions.isRestrained) {
    disadvantages++;
    console.log("  - Restrained (disadvantage)");
  }

  return getEffectiveRollType(advantages, disadvantages);
}

const attackConditions = {
  isHidden: true,
  hasHighGround: false,
  targetProne: false,
  isBlinded: false,
  isRestrained: false,
};

const rollType = calculateRollType(attackConditions);
console.log(`\nEffective roll type: ${rollType}\n`);

// Example 9: All roll types iteration
console.log("=== Iterating All Roll Types ===");
Object.values(RollType).forEach((type) => {
  const result = roll(DieType.D20, type);
  console.log(`${type}: ${result}`);
});
console.log();

// Example 10: Statistical comparison
console.log("=== Statistical Comparison (100 rolls) ===");
function getStats(rollType, samples = 100) {
  const rolls = Array.from({ length: samples }, () =>
    roll(DieType.D20, rollType)
  );

  const avg = rolls.reduce((a, b) => a + b, 0) / samples;
  const min = Math.min(...rolls);
  const max = Math.max(...rolls);

  return { avg, min, max };
}

const normalStats = getStats(RollType.Normal);
const advStats = getStats(RollType.Advantage);
const disadvStats = getStats(RollType.Disadvantage);

console.log(
  `Normal:       avg ${normalStats.avg.toFixed(2)}, range ${normalStats.min}-${
    normalStats.max
  }`
);
console.log(
  `Advantage:    avg ${advStats.avg.toFixed(2)}, range ${advStats.min}-${
    advStats.max
  } (+${(advStats.avg - normalStats.avg).toFixed(2)})`
);
console.log(
  `Disadvantage: avg ${disadvStats.avg.toFixed(2)}, range ${disadvStats.min}-${
    disadvStats.max
  } (${(disadvStats.avg - normalStats.avg).toFixed(2)})`
);
console.log("\n(Advantage ≈ +5 bonus, Disadvantage ≈ -5 penalty)\n");

// Example 11: Roll type in character sheet
console.log("=== Character Sheet Roll Type Helper ===");
class Character {
  constructor(name) {
    this.name = name;
    this.conditions = {
      advantages: [],
      disadvantages: [],
    };
  }

  addAdvantage(source) {
    this.conditions.advantages.push(source);
  }

  addDisadvantage(source) {
    this.conditions.disadvantages.push(source);
  }

  getRollType() {
    return getEffectiveRollType(
      this.conditions.advantages.length,
      this.conditions.disadvantages.length
    );
  }

  clearConditions() {
    this.conditions.advantages = [];
    this.conditions.disadvantages = [];
  }
}

const ranger = new Character("Aragorn");
ranger.addAdvantage("Hidden");
ranger.addAdvantage("High Ground");
ranger.addDisadvantage("Exhaustion");

console.log(`${ranger.name}'s conditions:`);
console.log(`  Advantages: ${ranger.conditions.advantages.join(", ")}`);
console.log(`  Disadvantages: ${ranger.conditions.disadvantages.join(", ")}`);
console.log(`  Effective: ${ranger.getRollType()}`);

const attackResult = roll(DieType.D20, ranger.getRollType());
console.log(`  Attack roll: ${attackResult}`);
