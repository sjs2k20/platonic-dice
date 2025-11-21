/**
 * Example usage of Outcome
 * Demonstrates outcome enum usage and handling
 */

const {
  Outcome,
  rollTest,
  rollModTest,
  DieType,
  TestType,
} = require("../../src");

console.log("=== Outcome Examples ===\n");

// Example 1: Outcome values
console.log("--- Outcome Enum Values ---");
console.log(`Success: "${Outcome.Success}"`);
console.log(`Failure: "${Outcome.Failure}"`);
console.log(`CriticalSuccess: "${Outcome.CriticalSuccess}"`);
console.log(`CriticalFailure: "${Outcome.CriticalFailure}"\n`);

// Example 2: Basic outcome checking
console.log("=== Basic Outcome Checking ===");
const check = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log(`Roll: ${check.base}, Target: 12`);
if (check.outcome === Outcome.Success) {
  console.log("✓ Success!");
} else {
  console.log("✗ Failure");
}
console.log();

// Example 3: Switch statement handling
console.log("=== Using Switch Statement ===");
const skillCheck = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});

console.log(`Roll: ${skillCheck.base}, Outcome: ${skillCheck.outcome}`);
switch (skillCheck.outcome) {
  case Outcome.CriticalSuccess:
    console.log("🌟 Natural 20! Critical success!");
    break;
  case Outcome.Success:
    console.log("✓ Success!");
    break;
  case Outcome.Failure:
    console.log("✗ Failure");
    break;
  case Outcome.CriticalFailure:
    console.log("💀 Natural 1! Critical failure!");
    break;
}
console.log();

// Example 4: Grouping outcomes
console.log("=== Grouping Outcomes ===");
function isSuccess(outcome) {
  return outcome === Outcome.Success || outcome === Outcome.CriticalSuccess;
}

function isCritical(outcome) {
  return (
    outcome === Outcome.CriticalSuccess || outcome === Outcome.CriticalFailure
  );
}

const attack = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 16,
});

console.log(`Attack roll: ${attack.base}, Outcome: ${attack.outcome}`);
console.log(`Is success? ${isSuccess(attack.outcome)}`);
console.log(`Is critical? ${isCritical(attack.outcome)}\n`);

// Example 5: Combat resolution
console.log("=== Combat Resolution ===");
function resolveAttack(attackRoll, baseDamage, ac) {
  console.log(`  Attack: ${attackRoll.base} vs AC ${ac}`);

  switch (attackRoll.outcome) {
    case Outcome.CriticalSuccess:
      console.log(`  💥 CRITICAL HIT! Double damage: ${baseDamage * 2}`);
      return { hit: true, damage: baseDamage * 2, crit: true };

    case Outcome.Success:
      console.log(`  ✓ Hit! Damage: ${baseDamage}`);
      return { hit: true, damage: baseDamage, crit: false };

    case Outcome.CriticalFailure:
      console.log(`  💀 FUMBLE! Critical miss with consequences`);
      return { hit: false, damage: 0, fumble: true };

    case Outcome.Failure:
      console.log(`  ✗ Miss`);
      return { hit: false, damage: 0, fumble: false };
  }
}

const attackRoll = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
resolveAttack(attackRoll, 8, 15);
console.log();

// Example 6: Skill check with degrees of success
console.log("=== Skill Check Degrees ===");
function describeSkillResult(roll) {
  switch (roll.outcome) {
    case Outcome.CriticalSuccess:
      return "Exceptional success! You learn extra information.";
    case Outcome.Success:
      return "Success! You accomplish the task.";
    case Outcome.Failure:
      return "Failure. You don't accomplish the task.";
    case Outcome.CriticalFailure:
      return "Critical failure! Something goes wrong.";
  }
}

const investigation = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 14,
});

console.log(`Investigation: ${investigation.base}`);
console.log(describeSkillResult(investigation));
console.log();

// Example 7: Statistics tracking
console.log("=== Outcome Statistics (100 Skill Checks) ===");
const stats = {
  [Outcome.CriticalSuccess]: 0,
  [Outcome.Success]: 0,
  [Outcome.Failure]: 0,
  [Outcome.CriticalFailure]: 0,
};

for (let i = 0; i < 100; i++) {
  const result = rollTest(DieType.D20, {
    testType: TestType.Skill,
    target: 12,
  });
  stats[result.outcome]++;
}

console.log(
  `Critical Successes: ${stats[Outcome.CriticalSuccess]} (${
    stats[Outcome.CriticalSuccess]
  }%)`
);
console.log(
  `Successes: ${stats[Outcome.Success]} (${stats[Outcome.Success]}%)`
);
console.log(`Failures: ${stats[Outcome.Failure]} (${stats[Outcome.Failure]}%)`);
console.log(
  `Critical Failures: ${stats[Outcome.CriticalFailure]} (${
    stats[Outcome.CriticalFailure]
  }%)\n`
);

// Example 8: Outcome-based rewards
console.log("=== Outcome-Based Rewards ===");
function calculateReward(outcome) {
  const rewards = {
    [Outcome.CriticalSuccess]: { gold: 100, xp: 500 },
    [Outcome.Success]: { gold: 50, xp: 200 },
    [Outcome.Failure]: { gold: 0, xp: 50 },
    [Outcome.CriticalFailure]: { gold: -20, xp: 0 },
  };
  return rewards[outcome];
}

const questRoll = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});

const reward = calculateReward(questRoll.outcome);
console.log(`Quest outcome: ${questRoll.outcome}`);
console.log(`Reward: ${reward.gold} gold, ${reward.xp} XP\n`);

// Example 9: Modified roll outcome
console.log("=== Modified Roll with Outcome ===");
const modifiedCheck = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.Skill,
  target: 18,
});

console.log(
  `Base roll: ${modifiedCheck.base}, Modified: ${modifiedCheck.modified}`
);
console.log(`Outcome: ${modifiedCheck.outcome}`);

if (modifiedCheck.outcome === Outcome.CriticalSuccess) {
  console.log("Natural 20! (Crits check base roll, not modified)");
}
console.log();

// Example 10: Success rate helper
console.log("=== Success Rate Helper ===");
function getSuccessRate(outcomes) {
  const successCount = outcomes.filter(
    (o) => o === Outcome.Success || o === Outcome.CriticalSuccess
  ).length;
  return ((successCount / outcomes.length) * 100).toFixed(1);
}

const rolls = Array.from(
  { length: 20 },
  () =>
    rollTest(DieType.D20, {
      testType: TestType.AtLeast,
      target: 12,
    }).outcome
);

console.log(`Success rate over 20 rolls: ${getSuccessRate(rolls)}%\n`);

// Example 11: All possible outcomes
console.log("=== All Possible Outcomes ===");
Object.values(Outcome).forEach((outcome) => {
  console.log(`- ${outcome}`);
});
