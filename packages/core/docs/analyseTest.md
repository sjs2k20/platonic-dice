# analyseTest

analyses test conditions without performing an actual roll. Provides probability information and possible outcomes.

## Overview

`analyseTest` is a "dry run" function that lets you preview what outcomes are possible for a given test configuration. Instead of rolling dice, it calculates all possible results, their probabilities, and which rolls produce which outcomes. This is useful for planning, balancing game mechanics, or showing players their chances of success.

## Usage

```javascript
const { analyseTest, DieType, TestType } = require("@platonic-dice/core");

// analyse a D20 skill check with DC 15
const analysis = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(analysis);
// {
//   totalPossibilities: 20,
//   outcomeCounts: { success: 6, failure: 14 },
//   outcomeProbabilities: { success: 0.3, failure: 0.7 },
//   outcomesByRoll: { 1: 'failure', ..., 15: 'success', ..., 20: 'success' },
//   rolls: [1, 2, 3, ..., 20],
//   rollsByOutcome: { success: [15,16,17,18,19,20], failure: [1,2,...,14] }
// }
```

## API

### Function Signature

```typescript
analyseTest(
  dieType: DieTypeValue,
  testConditions: TestConditionsInstance | { testType: TestTypeValue, ...conditions },
  options?: { useNaturalCrits?: boolean }
): TestAnalysis
```

### Parameters

- **dieType**: The type of die (`DieType.D4` through `DieType.D20`)
- **testConditions**: Test configuration (instance or plain object)
- **options** _(optional)_:
  - **useNaturalCrits**: Enable natural crit mechanics
    - Default: `true` for `TestType.Skill`, `false` for others
    - When enabled for Skill tests: natural max → CriticalSuccess, natural 1 → CriticalFailure

### Returns

`TestAnalysis` object with:

- **totalPossibilities**: Number of possible die values
- **outcomeCounts**: Count of each outcome type
- **outcomeProbabilities**: Probability (0-1) of each outcome
- **outcomesByRoll**: Map from roll value to its outcome
- **rolls**: Array of all possible roll values
- **rollsByOutcome**: Rolls grouped by outcome

## Examples

### Basic Analysis

```javascript
// What are my chances with DC 15?
const analysis = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`,
);
// "Success rate: 30.0%"

console.log(`You need to roll: ${analysis.rollsByOutcome.success.join(", ")}`);
// "You need to roll: 15, 16, 17, 18, 19, 20"
```

### Skill Test with Crits

```javascript
const analysis = analyseTest(DieType.D20, {
  testType: TestType.Skill,
  target: 12,
});

// Natural crits are enabled by default for Skill tests
console.log(
  `Critical Success: ${analysis.outcomeProbabilities.critical_success * 100}%`,
);
console.log(`Success: ${analysis.outcomeProbabilities.success * 100}%`);
console.log(`Failure: ${analysis.outcomeProbabilities.failure * 100}%`);
console.log(
  `Critical Failure: ${analysis.outcomeProbabilities.critical_failure * 100}%`,
);
```

### Comparing Difficulties

```javascript
const easy = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 10,
});
const medium = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
const hard = analyseTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 20,
});

console.log(
  `Easy (DC 10): ${(easy.outcomeProbabilities.success * 100).toFixed(
    0,
  )}% success`,
);
console.log(
  `Medium (DC 15): ${(medium.outcomeProbabilities.success * 100).toFixed(
    0,
  )}% success`,
);
console.log(
  `Hard (DC 20): ${(hard.outcomeProbabilities.success * 100).toFixed(
    0,
  )}% success`,
);
```

### Exact Value Test

```javascript
const exactCheck = analyseTest(DieType.D6, {
  testType: TestType.Exact,
  target: 4,
});

console.log(
  `Chance of rolling exactly 4: ${(
    exactCheck.outcomeProbabilities.success * 100
  ).toFixed(1)}%`,
);
// "Chance of rolling exactly 4: 16.7%"
```

### Range Test

```javascript
const rangeCheck = analyseTest(DieType.D20, {
  testType: TestType.Within,
  min: 10,
  max: 15,
});

console.log(
  `Rolling 10-15: ${(rangeCheck.outcomeProbabilities.success * 100).toFixed(
    1,
  )}%`,
);
// "Rolling 10-15: 30.0%" (6 values out of 20)
```

## Use Cases

### Difficulty Balancing

```javascript
// Is this DC too hard for a d20?
function evaluateDifficulty(dc) {
  const analysis = analyseTest(DieType.D20, {
    testType: TestType.AtLeast,
    target: dc,
  });

  const successRate = analysis.outcomeProbabilities.success * 100;

  if (successRate >= 75) return "Easy";
  if (successRate >= 50) return "Medium";
  if (successRate >= 25) return "Hard";
  return "Very Hard";
}

console.log(`DC 10 is ${evaluateDifficulty(10)}`); // "Medium"
console.log(`DC 20 is ${evaluateDifficulty(20)}`); // "Very Hard"
```

### Player Information

```javascript
// Show player their odds before committing to an action
function showOdds(dieType, target) {
  const analysis = analyseTest(dieType, {
    testType: TestType.AtLeast,
    target,
  });

  console.log(`To succeed (DC ${target} on d${dieType.substring(1)}):`);
  console.log(`  Need to roll: ${analysis.rollsByOutcome.success.join(", ")}`);
  console.log(
    `  Success chance: ${(analysis.outcomeProbabilities.success * 100).toFixed(
      1,
    )}%`,
  );
}

showOdds(DieType.D20, 15);
```

### Game Design Tool

```javascript
// Find the right DC for a 50% success rate
function findTargetForSuccessRate(dieType, desiredRate) {
  const sides = parseInt(dieType.substring(1).replace(/[^0-9]/g, ""));

  for (let dc = 1; dc <= sides; dc++) {
    const analysis = analyseTest(dieType, {
      testType: TestType.AtLeast,
      target: dc,
    });

    const rate = analysis.outcomeProbabilities.success;
    if (Math.abs(rate - desiredRate) < 0.05) {
      return dc;
    }
  }
}

const dc = findTargetForSuccessRate(DieType.D20, 0.5);
console.log(`For 50% success rate, use DC ${dc}`);
```

## Notes

- No actual dice are rolled - all calculations are deterministic
- Useful for testing and balancing before implementing mechanics
- Natural crits only apply to `TestType.Skill` tests by default
- For non-Skill tests, natural crits can be enabled but produce Success/Failure (not Critical)
- All outcomes and probabilities are pre-computed
- For analysis with modifiers, use [`analyseModTest`](./analyseModTest.md)

## See Also

- [`analyseModTest`](./analyseModTest.md) - analyse with modifiers
- [`rollTest`](./rollTest.md) - Actually perform the roll and test
- [`TestConditions`](./entities/TestConditions.md) - Test conditions documentation
- [`TestType`](./entities/TestType.md) - Test type enumeration
