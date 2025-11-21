# ModifiedTestConditions

A class for test conditions that validates against modified value ranges instead of base die ranges.

## Overview

`ModifiedTestConditions` extends validation to account for roll modifiers. It validates targets against the **modified range** (e.g., 11-16 for D6+10) rather than the base die range (1-6), enabling tests with targets outside the base die's natural range.

## Usage

```javascript
const {
  ModifiedTestConditions,
  TestType,
  DieType,
} = require("@platonic-dice/core");

// D6 (1-6) with +10 modifier has range 11-16
const conditions = new ModifiedTestConditions(
  TestType.AtLeast,
  15, // Valid! Within 11-16
  11, // modifiedMin
  16, // modifiedMax
  DieType.D6
);

// Use with rollModTest
const result = rollModTest(DieType.D6, (n) => n + 10, conditions);
```

## API

### Constructor

```typescript
new ModifiedTestConditions(
  testType: TestTypeValue,
  target: number | undefined,
  modifiedMin: number,
  modifiedMax: number,
  dieType?: DieTypeValue,
  min?: number,
  max?: number
)
```

### Properties

```typescript
class ModifiedTestConditions extends TestConditions {
  modifiedMin: number;
  modifiedMax: number;

  // Inherited from TestConditions:
  testType: TestTypeValue;
  target?: number;
  min?: number;
  max?: number;
  dieType?: DieTypeValue;
}
```

### Validation

`ModifiedTestConditions` validates:

- `target` is within `[modifiedMin, modifiedMax]` (not base die range)
- `min` and `max` (for `Within` tests) are within modified range
- All standard `TestConditions` validation rules apply

## Examples

### Extended Range Target

```javascript
const {
  ModifiedTestConditions,
  TestType,
  DieType,
  rollModTest,
} = require("@platonic-dice/core");

// D6 (1-6) + 10 modifier → range 11-16
const conditions = new ModifiedTestConditions(
  TestType.AtLeast,
  15, // Valid! 15 is within 11-16
  11, // modifiedMin
  16, // modifiedMax
  DieType.D6
);

const result = rollModTest(DieType.D6, (n) => n + 10, conditions);
// Can test against DC 15, even though base die is only 1-6
```

### Using Plain Objects (More Common)

```javascript
// Plain object works without the class
const result = rollModTest(DieType.D6, (n) => n + 10, {
  testType: TestType.AtLeast,
  target: 15,
});
// The library calculates modified range automatically
```

### High-Level Character

```javascript
// Level 20 character: D20 + 17 (ability + proficiency + items)
// Modified range: 18-37

const legendaryCheck = new ModifiedTestConditions(
  TestType.AtLeast,
  30, // Very high DC, but achievable!
  18, // min (1 + 17)
  37, // max (20 + 17)
  DieType.D20
);

const result = rollModTest(DieType.D20, (n) => n + 17, legendaryCheck);
```

### Negative Modifier

```javascript
// D20 - 5 penalty → range -4 to 15
const penalty = new ModifiedTestConditions(
  TestType.AtLeast,
  10, // Still achievable
  -4, // min (1 - 5)
  15, // max (20 - 5)
  DieType.D20
);

const result = rollModTest(DieType.D20, (n) => n - 5, penalty);
```

## Use Cases

### High-Level Difficulty

```javascript
// Epic-level DC that requires bonuses
function createEpicCheck(dc) {
  const modBonus = 10; // Requires at least +10 to attempt

  return new ModifiedTestConditions(
    TestType.AtLeast,
    dc,
    1 + modBonus, // min
    20 + modBonus, // max
    DieType.D20
  );
}

const epicDC = createEpicCheck(28); // DC 28 (needs +8 minimum)
```

### Skill Mastery System

```javascript
class Skill {
  constructor(name, proficiencyBonus, abilityMod) {
    this.name = name;
    this.totalBonus = proficiencyBonus + abilityMod;
    this.modifiedRange = {
      min: 1 + this.totalBonus,
      max: 20 + this.totalBonus,
    };
  }

  canAttempt(dc) {
    return dc <= this.modifiedRange.max;
  }

  createCheck(dc) {
    return new ModifiedTestConditions(
      TestType.Skill,
      dc,
      this.modifiedRange.min,
      this.modifiedRange.max,
      DieType.D20
    );
  }
}

const expertise = new Skill("Stealth", 6, 5); // +11 total
console.log(`Can attempt DC 30? ${expertise.canAttempt(30)}`); // true (max 31)
```

### Progressive Difficulty

```javascript
function getModifiedConditions(baseModifier, difficultyTier) {
  const dcMap = {
    normal: 15,
    hard: 20,
    epic: 25,
    legendary: 30,
  };

  return new ModifiedTestConditions(
    TestType.AtLeast,
    dcMap[difficultyTier],
    1 + baseModifier,
    20 + baseModifier,
    DieType.D20
  );
}

// With +5 bonus, can attempt up to DC 25
const conditions = getModifiedConditions(5, "hard"); // DC 20
```

## Notes

- Most users won't need this class - plain objects work fine
- The library automatically calculates modified ranges internally
- Use this when you need explicit validation or documentation
- Validates targets against **modified range**, not base die range
- Natural crits still check the **base roll** (1 or 20), not modified value
- For basic tests without modifiers, use [`TestConditions`](./TestConditions.md)

## Validation Comparison

```javascript
// TestConditions: validates against base die (1-20)
const base = new TestConditions(TestType.AtLeast, 25, DieType.D20);
// ❌ Error: 25 exceeds die maximum (20)

// ModifiedTestConditions: validates against modified range (11-30)
const modified = new ModifiedTestConditions(
  TestType.AtLeast,
  25, // ✓ Valid! Within 11-30
  11, // D20 + 10 minimum
  30, // D20 + 10 maximum
  DieType.D20
);
// ✓ Success: 25 is within modified range
```

## Common Patterns

### Auto-Calculate Modified Range

```javascript
function createModifiedConditions(dieType, modifier, testType, target) {
  const dieMax = parseInt(dieType.substring(1)); // "d20" → 20

  const modifiedMin = 1 + modifier;
  const modifiedMax = dieMax + modifier;

  return new ModifiedTestConditions(
    testType,
    target,
    modifiedMin,
    modifiedMax,
    dieType
  );
}

const check = createModifiedConditions(DieType.D20, 7, TestType.AtLeast, 25);
```

### Conditional Validation

```javascript
function createSmartConditions(dieType, modifier, testType, target) {
  const dieMax = parseInt(dieType.substring(1));

  // Use ModifiedTestConditions if target exceeds base die
  if (target > dieMax || target < 1) {
    return new ModifiedTestConditions(
      testType,
      target,
      1 + modifier,
      dieMax + modifier,
      dieType
    );
  }

  // Use regular TestConditions otherwise
  return new TestConditions(testType, target, dieType);
}
```

## See Also

- [`TestConditions`](./TestConditions.md) - Base test conditions
- [`rollModTest`](../rollModTest.md) - Roll with modifier and test
- [`analyseModTest`](../analyseModTest.md) - analyse modified tests
- [`RollModifier`](./RollModifier.md) - Modifier functions
