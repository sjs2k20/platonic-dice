# analyseModTest

analyses modified test conditions without performing an actual roll. Provides probability information considering the modifier's effect on the die range.

## Overview

`analyseModTest` is like [`analyseTest`](./analyseTest.md) but accounts for modifiers. It calculates all possible outcomes after applying a modifier, their probabilities, and shows the modified value range. This is essential for understanding how bonuses/penalties affect your chances of success.

## Usage

```javascript
const { analyseModTest, DieType, TestType } = require("@platonic-dice/core");

// analyse D20 + 5 against DC 20
const analysis = analyseModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 20,
});

console.log(
  `Modified range: ${analysis.modifiedRange.min}-${analysis.modifiedRange.max}`
);
// "Modified range: 6-25"

console.log(
  `Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`
);
// "Success rate: 30.0%" (rolls 15-20 become 20-25)
```

## API

### Function Signature

```typescript
analyseModTest(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  testConditions: TestConditionsInstance | { testType: TestTypeValue, ...conditions },
  options?: { useNaturalCrits?: boolean }
): ModifiedTestAnalysis
```

### Parameters

- **dieType**: The type of die (`DieType.D4` through `DieType.D20`)
- **modifier**: Function `(n) => number` or `RollModifier` instance
- **testConditions**: Test configuration (instance or plain object)
- **options** _(optional)_:
  - **useNaturalCrits**: Enable natural crit mechanics (default: `true` for Skill tests)

### Returns

`ModifiedTestAnalysis` object with:

- **totalPossibilities**: Number of possible die values
- **outcomeCounts**: Count of each outcome type
- **outcomeProbabilities**: Probability (0-1) of each outcome
- **outcomesByRoll**: Map from **base roll** to outcome
- **modifiedValuesByRoll**: Map from base roll to modified value
- **rolls**: Array of all possible base roll values
- **rollsByOutcome**: Base rolls grouped by outcome
- **modifiedRange**: `{ min, max }` - Range of achievable modified values

## Examples

### Basic Analysis with Bonus

```javascript
// D20 + 5 against DC 15
const analysis = analyseModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Need to roll (base): ${analysis.rollsByOutcome.success.join(", ")}`
);
// "Need to roll (base): 10, 11, 12, ..., 20"

console.log(
  `Success rate: ${(analysis.outcomeProbabilities.success * 100).toFixed(1)}%`
);
// "Success rate: 55.0%" (11 successful rolls out of 20)
```

### Viewing Modified Values

```javascript
const analysis = analyseModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log("Base → Modified:");
analysis.rolls.forEach((roll) => {
  console.log(`  ${roll} → ${analysis.modifiedValuesByRoll[roll]}`);
});
// 1 → 11
// 2 → 12
// 3 → 13
// ...
```

### Extended Range Validation

```javascript
// D6 (1-6) + 10 modifier has range 11-16
// So target 15 is VALID (within achievable range)
const extended = analyseModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15,
});

console.log(
  `Achievable range: ${extended.modifiedRange.min}-${extended.modifiedRange.max}`
);
// "Achievable range: 11-16"

console.log(`Target 15 is achievable!`);
console.log(
  `Need to roll (base): ${extended.rollsByOutcome.success.join(", ")}`
);
// "Need to roll (base): 5, 6"
```

### With Penalty

```javascript
// D20 - 3 against DC 12
const penalty = analyseModTest(DieType.D20, (n) => n - 3, {
  testType: TestType.AtLeast,
  target: 12,
});

console.log(
  `Modified range: ${penalty.modifiedRange.min}-${penalty.modifiedRange.max}`
);
// "Modified range: -2-17"

console.log(`Need base rolls: ${penalty.rollsByOutcome.success.join(", ")}`);
// "Need base rolls: 15, 16, 17, 18, 19, 20"
```

## Use Cases

### Comparing Bonus Effects

```javascript
// How much does each bonus level help?
[0, 2, 5, 7, 10].forEach((bonus) => {
  const analysis = analyseModTest(DieType.D20, (n) => n + bonus, {
    testType: TestType.AtLeast,
    target: 15,
  });

  const rate = (analysis.outcomeProbabilities.success * 100).toFixed(0);
  console.log(`+${bonus} bonus: ${rate}% success`);
});
// +0 bonus: 30% success
// +2 bonus: 40% success
// +5 bonus: 55% success
// ...
```

### Proficiency Impact Analysis

```javascript
// Show how proficiency bonus affects success rate
function analyseProficiencyImpact(dc) {
  const withoutProf = analyseModTest(
    DieType.D20,
    (n) => n + 2, // Just ability modifier
    { testType: TestType.AtLeast, target: dc }
  );

  const withProf = analyseModTest(
    DieType.D20,
    (n) => n + 5, // Ability + proficiency
    { testType: TestType.AtLeast, target: dc }
  );

  const improvement =
    (withProf.outcomeProbabilities.success -
      withoutProf.outcomeProbabilities.success) *
    100;

  console.log(`DC ${dc}:`);
  console.log(
    `  Without proficiency: ${(
      withoutProf.outcomeProbabilities.success * 100
    ).toFixed(0)}%`
  );
  console.log(
    `  With proficiency: ${(
      withProf.outcomeProbabilities.success * 100
    ).toFixed(0)}%`
  );
  console.log(`  Improvement: +${improvement.toFixed(0)} percentage points`);
}

analyseProficiencyImpact(15);
```

### Minimum Required Modifier

```javascript
// What bonus do I need for at least 50% success?
function findRequiredBonus(dieType, dc, targetRate = 0.5) {
  for (let bonus = 0; bonus <= 20; bonus++) {
    const analysis = analyseModTest(dieType, (n) => n + bonus, {
      testType: TestType.AtLeast,
      target: dc,
    });

    if (analysis.outcomeProbabilities.success >= targetRate) {
      return bonus;
    }
  }
  return null;
}

const bonus = findRequiredBonus(DieType.D20, 18);
console.log(`Need at least +${bonus} to have 50%+ chance against DC 18`);
```

### Player Planning Tool

```javascript
// Help player decide whether to use a resource for a bonus
function shouldUseResource(currentMod, resourceMod, dc) {
  const without = analyseModTest(
    DieType.D20,
    (n) => n + currentMod,
    { testType: TestType.AtLeast, target: dc }
  );

  const with = analyseModTest(
    DieType.D20,
    (n) => n + currentMod + resourceMod,
    { testType: TestType.AtLeast, target: dc }
  );

  console.log(`Against DC ${dc}:`);
  console.log(`  Current chance: ${(without.outcomeProbabilities.success * 100).toFixed(0)}%`);
  console.log(`  With resource: ${(with.outcomeProbabilities.success * 100).toFixed(0)}%`);

  const improvement = (with.outcomeProbabilities.success - without.outcomeProbabilities.success) * 100;
  console.log(`  Improvement: +${improvement.toFixed(0)} percentage points`);

  return improvement >= 15; // Worth it if 15%+ improvement
}

const worthIt = shouldUseResource(3, 4, 18); // +3 current, +4 from Bless, DC 18
console.log(`Use Bless? ${worthIt ? "Yes" : "Maybe not"}`);
```

## Notes

- No actual dice are rolled - all calculations are deterministic
- Test conditions are validated against the **modified range**, not base die range
- This allows targets outside the base die range (e.g., DC 25 on d20+10)
- Natural crits check the **base roll**, not the modified value
- Modified values are shown for every possible base roll
- For analysis without modifiers, use [`analyseTest`](./analyseTest.md)

## See Also

- [`analyseTest`](./analyseTest.md) - analyse without modifiers
- [`rollModTest`](./rollModTest.md) - Actually perform the roll
- [`ModifiedTestConditions`](./entities/ModifiedTestConditions.md) - Modified range validation
- [`RollModifier`](./entities/RollModifier.md) - Modifier class documentation
