/**
 * Example usage of analyseTest
 * Demonstrates analyzing test conditions without rolling dice
 */

const { analyseTest, DieType, TestType, Outcome } = require("../src");

console.log("=== analyseTest Examples ===\n");

// Example 1: Basic DC analysis
console.log("--- Analyzing D20 Skill Check (DC 15) ---");
const dc15 = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Success rolls: ${dc15.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `Success chance: ${(dc15.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  )}%`
);
console.log(
  `Failure chance: ${(dc15.outcomeProbabilities[Outcome.Failure] * 100).toFixed(
    1
  )}%\n`
);

// Example 2: Comparing difficulty classes
console.log("=== Comparing Different DCs ===");
[10, 12, 15, 18, 20].forEach((dc) => {
  const analysis = analyseTest(DieType.D20, {
    testType: TestType.AtLeast,
    target: dc,
  });
  const rate = (analysis.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    0
  );
  console.log(`DC ${dc}: ${rate}% success`);
});
console.log();

// Example 3: Skill test with natural crits
console.log("=== Skill Test (Natural Crits Enabled) ===");
const skillCheck = analyseTest(DieType.D20, {
  testType: TestType.Skill,
  target: 12,
});

console.log(
  `Critical Success (nat 20): ${
    skillCheck.rollsByOutcome[Outcome.CriticalSuccess]
  }`
);
console.log(
  `  Chance: ${(
    skillCheck.outcomeProbabilities[Outcome.CriticalSuccess] * 100
  ).toFixed(1)}%`
);
console.log(
  `Success (12-19): ${skillCheck.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `  Chance: ${(skillCheck.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  )}%`
);
console.log(
  `Failure (2-11): ${skillCheck.rollsByOutcome[Outcome.Failure].join(", ")}`
);
console.log(
  `  Chance: ${(skillCheck.outcomeProbabilities[Outcome.Failure] * 100).toFixed(
    1
  )}%`
);
console.log(
  `Critical Failure (nat 1): ${
    skillCheck.rollsByOutcome[Outcome.CriticalFailure]
  }`
);
console.log(
  `  Chance: ${(
    skillCheck.outcomeProbabilities[Outcome.CriticalFailure] * 100
  ).toFixed(1)}%\n`
);

// Example 4: Different die types
console.log("=== Success Rates Across Die Types (DC 3) ===");
[
  DieType.D4,
  DieType.D6,
  DieType.D8,
  DieType.D10,
  DieType.D12,
  DieType.D20,
].forEach((die) => {
  const analysis = analyseTest(die, {
    testType: TestType.AtLeast,
    target: 3,
  });
  const rate = (analysis.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  );
  console.log(`${die}: ${rate}%`);
});
console.log();

// Example 5: Exact value test
console.log("=== Exact Value Test (D6) ===");
for (let target = 1; target <= 6; target++) {
  const analysis = analyseTest(DieType.D6, {
    testType: TestType.Exact,
    target,
  });
  const prob = (analysis.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  );
  console.log(`Rolling exactly ${target}: ${prob}%`);
}
console.log();

// Example 6: Range/Within test
console.log("=== Range Test (D20, rolling 8-12) ===");
const rangeTest = analyseTest(DieType.D20, {
  testType: TestType.Within,
  min: 8,
  max: 12,
});

console.log(
  `Success range: ${rangeTest.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `Success chance: ${(
    rangeTest.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%\n`
);

// Example 7: Finding optimal DC for target success rate
console.log("=== Finding DC for 50% Success Rate ===");
function findDCForRate(targetRate) {
  for (let dc = 1; dc <= 20; dc++) {
    const analysis = analyseTest(DieType.D20, {
      testType: TestType.AtLeast,
      target: dc,
    });
    const rate = analysis.outcomeProbabilities[Outcome.Success];
    if (Math.abs(rate - targetRate) < 0.05) {
      return { dc, actualRate: rate };
    }
  }
}

const result = findDCForRate(0.5);
console.log(
  `For ~50% success: DC ${result.dc} (${(result.actualRate * 100).toFixed(
    1
  )}%)\n`
);

// Example 8: Difficulty rating system
console.log("=== Auto-Difficulty Rating ===");
function rateDifficulty(dc) {
  const analysis = analyseTest(DieType.D20, {
    testType: TestType.AtLeast,
    target: dc,
  });
  const rate = analysis.outcomeProbabilities[Outcome.Success];

  if (rate >= 0.75) return "Trivial";
  if (rate >= 0.6) return "Easy";
  if (rate >= 0.4) return "Medium";
  if (rate >= 0.25) return "Hard";
  if (rate >= 0.1) return "Very Hard";
  return "Nearly Impossible";
}

[5, 10, 12, 15, 18, 20].forEach((dc) => {
  console.log(`DC ${dc}: ${rateDifficulty(dc)}`);
});
console.log();

// Example 9: Showing odds to players
console.log("=== Player Odds Display ===");
function showPlayerOdds(dc) {
  const analysis = analyseTest(DieType.D20, {
    testType: TestType.AtLeast,
    target: dc,
  });

  const successRolls = analysis.rollsByOutcome[Outcome.Success];
  const successRate = (
    analysis.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(0);

  console.log(`\nTo beat DC ${dc}:`);
  console.log(`  You need: ${successRolls.join(", ")}`);
  console.log(`  Success rate: ${successRate}%`);

  if (successRate >= 75) {
    console.log(`  Assessment: Very likely to succeed!`);
  } else if (successRate >= 50) {
    console.log(`  Assessment: Good chance of success.`);
  } else if (successRate >= 25) {
    console.log(`  Assessment: Challenging, but possible.`);
  } else {
    console.log(`  Assessment: This will be very difficult.`);
  }
}

showPlayerOdds(12);
showPlayerOdds(18);
console.log();

// Example 10: AtMost test (lower is better)
console.log("=== AtMost Test (D20, must roll 6 or less) ===");
const atMost = analyseTest(DieType.D20, {
  testType: TestType.AtMost,
  target: 6,
});

console.log(`Success on: ${atMost.rollsByOutcome[Outcome.Success].join(", ")}`);
console.log(
  `Success chance: ${(
    atMost.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%\n`
);

// Example 11: Probability distribution visualization
console.log("=== Probability Distribution (D20 vs DC 12) ===");
const dist = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log("Roll | Outcome");
console.log("-----|--------");
Object.entries(dist.outcomesByRoll).forEach(([roll, outcome]) => {
  const symbol = outcome === Outcome.Success ? "✓" : "✗";
  console.log(`  ${roll.padStart(2)} | ${symbol} ${outcome}`);
});
console.log();

// Example 12: Comparing with and without natural crits
console.log("=== Natural Crits Comparison ===");
const withoutCrits = analyseTest(
  DieType.D20,
  { testType: TestType.Skill, target: 15 },
  { useNaturalCrits: false }
);

const withCrits = analyseTest(
  DieType.D20,
  { testType: TestType.Skill, target: 15 }
  // Natural crits enabled by default for Skill tests
);

console.log("Without natural crits:");
console.log(
  `  Success: ${(
    withoutCrits.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%`
);

console.log("\nWith natural crits:");
console.log(
  `  Critical Success: ${(
    withCrits.outcomeProbabilities[Outcome.CriticalSuccess] * 100
  ).toFixed(1)}%`
);
console.log(
  `  Success: ${(withCrits.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  )}%`
);
console.log(
  `  Failure: ${(withCrits.outcomeProbabilities[Outcome.Failure] * 100).toFixed(
    1
  )}%`
);
console.log(
  `  Critical Failure: ${(
    withCrits.outcomeProbabilities[Outcome.CriticalFailure] * 100
  ).toFixed(1)}%`
);
