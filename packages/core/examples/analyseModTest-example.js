/**
 * Example usage of analyseModTest
 * Demonstrates analyzing modified test conditions without rolling
 */

const {
  analyseModTest,
  DieType,
  TestType,
  Outcome,
  RollModifier,
} = require("../src");

console.log("=== analyseModTest Examples ===\n");

// Example 1: Basic analysis with bonus
console.log("--- D20 + 5 against DC 15 ---");
const basic = analyseModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Modified range: ${basic.modifiedRange.min}-${basic.modifiedRange.max}`
);
console.log(
  `Need to roll (base): ${basic.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `Success rate: ${(basic.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    1
  )}%\n`
);

// Example 2: Viewing modified values
console.log("=== Modified Values Map (D6 + 10) ===");
const modified = analyseModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log("Base Roll → Modified Value → Outcome:");
modified.rolls.forEach((roll) => {
  const modValue = modified.modifiedValuesByRoll[roll];
  const outcome = modified.outcomesByRoll[roll];
  const symbol = outcome === Outcome.Success ? "✓" : "✗";
  console.log(`  ${roll} → ${modValue} ${symbol}`);
});
console.log();

// Example 3: Extended range validation
console.log("=== Extended Range (D6 + 10 vs DC 15) ===");
const extended = analyseModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(`Base die range: 1-6`);
console.log(
  `Modified range: ${extended.modifiedRange.min}-${extended.modifiedRange.max}`
);
console.log(`Target DC: 15 (within modified range!)`);
console.log(
  `Need to roll (base): ${extended.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `Success rate: ${(
    extended.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%\n`
);

// Example 4: Penalty modifier
console.log("=== Penalty Modifier (D20 - 3 vs DC 12) ===");
const penalty = analyseModTest(DieType.D20, (n) => n - 3, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log(
  `Modified range: ${penalty.modifiedRange.min}-${penalty.modifiedRange.max}`
);
console.log(
  `Need base rolls: ${penalty.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `Success rate: ${(
    penalty.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%\n`
);

// Example 5: Comparing bonus effects
console.log("=== Comparing Bonus Effects (DC 15) ===");
[0, 2, 5, 7, 10].forEach((bonus) => {
  const analysis = analyseModTest(DieType.D20, (n) => n + bonus, {
    testType: TestType.AtLeast,
    target: 15,
  });

  const rate = (analysis.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    0
  );
  console.log(`+${bonus} bonus: ${rate}% success`);
});
console.log();

// Example 6: Proficiency impact analysis
console.log("=== Proficiency Impact ===");
function analyseProficiencyImpact(dc) {
  const withoutProf = analyseModTest(
    DieType.D20,
    (n) => n + 2, // Just ability modifier
    { testType: TestType.AtLeast, target: dc }
  );

  const withProf = analyseModTest(
    DieType.D20,
    (n) => n + 5, // Ability + proficiency (+3)
    { testType: TestType.AtLeast, target: dc }
  );

  const improvement =
    (withProf.outcomeProbabilities[Outcome.Success] -
      withoutProf.outcomeProbabilities[Outcome.Success]) *
    100;

  console.log(`DC ${dc}:`);
  console.log(
    `  Without proficiency: ${(
      withoutProf.outcomeProbabilities[Outcome.Success] * 100
    ).toFixed(0)}%`
  );
  console.log(
    `  With proficiency: ${(
      withProf.outcomeProbabilities[Outcome.Success] * 100
    ).toFixed(0)}%`
  );
  console.log(`  Improvement: +${improvement.toFixed(0)} percentage points`);
}

analyseProficiencyImpact(12);
console.log();
analyseProficiencyImpact(18);
console.log();

// Example 7: Minimum required modifier
console.log("=== Finding Required Bonus for 50% Success ===");
function findRequiredBonus(dieType, dc, targetRate = 0.5) {
  for (let bonus = 0; bonus <= 20; bonus++) {
    // If bonus makes minimum roll >= DC, success rate is 100%
    if (1 + bonus >= dc) {
      return {
        bonus,
        actualRate: 1.0,
      };
    }

    const analysis = analyseModTest(dieType, (n) => n + bonus, {
      testType: TestType.AtLeast,
      target: dc,
    });

    if (analysis.outcomeProbabilities[Outcome.Success] >= targetRate) {
      return {
        bonus,
        actualRate: analysis.outcomeProbabilities[Outcome.Success],
      };
    }
  }
  return null;
}

const result = findRequiredBonus(DieType.D20, 18);
console.log(`For 50%+ chance against DC 18: need +${result.bonus}`);
console.log(`  Actual rate: ${(result.actualRate * 100).toFixed(1)}%\n`);

// Example 8: Player planning tool (should I use a resource?)
console.log("=== Resource Usage Decision ===");
function shouldUseResource(currentMod, resourceMod, dc) {
  const without = analyseModTest(DieType.D20, (n) => n + currentMod, {
    testType: TestType.AtLeast,
    target: dc,
  });

  const withResource = analyseModTest(
    DieType.D20,
    (n) => n + currentMod + resourceMod,
    { testType: TestType.AtLeast, target: dc }
  );

  console.log(`Against DC ${dc}:`);
  console.log(
    `  Current chance (+${currentMod}): ${(
      without.outcomeProbabilities[Outcome.Success] * 100
    ).toFixed(0)}%`
  );
  console.log(
    `  With resource (+${currentMod + resourceMod}): ${(
      withResource.outcomeProbabilities[Outcome.Success] * 100
    ).toFixed(0)}%`
  );

  const improvement =
    (withResource.outcomeProbabilities[Outcome.Success] -
      without.outcomeProbabilities[Outcome.Success]) *
    100;
  console.log(`  Improvement: +${improvement.toFixed(0)} percentage points`);

  return improvement >= 15; // Worth it if 15%+ improvement
}

const worthIt = shouldUseResource(3, 4, 18); // +3 current, +4 from Bless, DC 18
console.log(
  `\nUse Bless? ${
    worthIt ? "Yes - significant improvement" : "Maybe not - marginal gain"
  }\n`
);

// Example 9: RollModifier class usage
console.log("=== Using RollModifier Class ===");
const attackMod = new RollModifier(
  (n) => n + 7,
  "Attack Roll (+3 DEX, +4 Proficiency)"
);

const attackAnalysis = analyseModTest(DieType.D20, attackMod, {
  testType: TestType.AtLeast,
  target: 16,
});

console.log(
  `Modified range: ${attackAnalysis.modifiedRange.min}-${attackAnalysis.modifiedRange.max}`
);
console.log(
  `Success rate: ${(
    attackAnalysis.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(0)}%\n`
);

// Example 10: Capped modifier
console.log("=== Capped Modifier (Min 1) ===");
const capped = analyseModTest(DieType.D4, (n) => Math.max(1, n - 2), {
  testType: TestType.AtLeast,
  target: 1,
});

console.log("Base → Modified (capped at 1):");
capped.rolls.forEach((roll) => {
  console.log(`  ${roll} → ${capped.modifiedValuesByRoll[roll]}`);
});
console.log(
  `Success rate: ${(capped.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    0
  )}%\n`
);

// Example 11: Advantage approximation
console.log("=== Comparing Flat Bonus vs Advantage ===");
// Advantage ≈ +5 bonus on average
const flatBonus = analyseModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Flat +5 bonus against DC 15: ${(
    flatBonus.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(0)}%`
);
console.log(
  `(Actual advantage would be slightly different due to reroll mechanics)\n`
);

// Example 12: Multiple difficulty tiers with same modifier
console.log("=== Difficulty Tiers with +5 Modifier ===");
const modifier = 5;
[
  { dc: 10, difficulty: "Easy" },
  { dc: 15, difficulty: "Medium" },
  { dc: 20, difficulty: "Hard" },
  { dc: 25, difficulty: "Very Hard" },
].forEach(({ dc, difficulty }) => {
  const analysis = analyseModTest(DieType.D20, (n) => n + modifier, {
    testType: TestType.AtLeast,
    target: dc,
  });

  const rate = (analysis.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    0
  );
  console.log(`${difficulty} (DC ${dc}): ${rate}%`);
});
console.log();

// Example 13: Exact value with modifier
console.log("=== Exact Value Test with Modifier ===");
const exact = analyseModTest(DieType.D8, (n) => n + 5, {
  testType: TestType.Exact,
  target: 10,
});

console.log(`Rolling for exactly 10 on D8+5:`);
console.log(
  `  Need base roll: ${exact.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `  Probability: ${(exact.outcomeProbabilities[Outcome.Success] * 100).toFixed(
    2
  )}%\n`
);

// Example 14: Range test with modifier
console.log("=== Range Test with Modifier ===");
const range = analyseModTest(DieType.D20, (n) => n + 3, {
  testType: TestType.Within,
  min: 15,
  max: 18,
});

console.log(`Rolling 15-18 on D20+3:`);
console.log(
  `  Need base rolls: ${range.rollsByOutcome[Outcome.Success].join(", ")}`
);
console.log(
  `  Success rate: ${(
    range.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%\n`
);

// Example 15: Negative outcomes (impossible targets)
console.log("=== Impossible Target Analysis ===");
try {
  const impossible = analyseModTest(DieType.D20, (n) => n + 2, {
    testType: TestType.AtLeast,
    target: 25,
  });

  console.log(`D20+2 vs DC 25:`);
  console.log(
    `  Modified range: ${impossible.modifiedRange.min}-${impossible.modifiedRange.max}`
  );
  console.log(
    `  Success rate: ${(
      impossible.outcomeProbabilities[Outcome.Success] * 100
    ).toFixed(1)}%`
  );
} catch (error) {
  console.log(`D20+2 vs DC 25:`);
  console.log(`  Modified range: 3-22`);
  console.log(`  Result: Impossible! Target DC 25 exceeds maximum roll of 22.`);
  console.log(`  The library correctly rejects this invalid test.`);
}
console.log(`  (Target exceeds maximum possible roll!)\n`);

// Example 16: Skill test with natural crits
console.log("=== Skill Test with Modifier and Natural Crits ===");
const skillTest = analyseModTest(DieType.D20, (n) => n + 4, {
  testType: TestType.Skill,
  target: 18,
});

console.log("D20+4 Skill Check (DC 18):");
console.log(
  `  Critical Success (nat 20): ${(
    skillTest.outcomeProbabilities[Outcome.CriticalSuccess] * 100
  ).toFixed(1)}%`
);
console.log(
  `  Success (18+): ${(
    skillTest.outcomeProbabilities[Outcome.Success] * 100
  ).toFixed(1)}%`
);
console.log(
  `  Failure: ${(skillTest.outcomeProbabilities[Outcome.Failure] * 100).toFixed(
    1
  )}%`
);
console.log(
  `  Critical Failure (nat 1): ${(
    skillTest.outcomeProbabilities[Outcome.CriticalFailure] * 100
  ).toFixed(1)}%`
);
console.log(
  `\nBase rolls for success: ${skillTest.rollsByOutcome[Outcome.Success].join(
    ", "
  )}`
);
