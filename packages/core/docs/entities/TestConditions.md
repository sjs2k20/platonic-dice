# TestConditions

A class for defining and validating test conditions against a die roll.

## Overview

`TestConditions` encapsulates the rules for evaluating whether a die roll succeeds or fails. It validates targets and ranges against the base die type, ensuring test conditions are achievable.

## Usage

```javascript
const { TestConditions, TestType, DieType } = require("@platonic-dice/core");

// Create test conditions
const conditions = new TestConditions(
  TestType.AtLeast,
  15, // target
  DieType.D20
);

// Use with rollTest (or pass plain object)
const result = rollTest(DieType.D20, conditions);
```

## API

### Constructor

```typescript
new TestConditions(
  testType: TestTypeValue,
  target?: number,
  dieType?: DieTypeValue,
  min?: number,
  max?: number
)
```

### Properties

```typescript
class TestConditions {
  testType: TestTypeValue;
  target?: number;
  min?: number;
  max?: number;
  dieType?: DieTypeValue;
}
```

### Validation

`TestConditions` validates that:

- `target` is within the die range (1 to die max)
- For `Within` tests, `min <= max`
- For `Within` tests, both `min` and `max` are provided
- Required fields are present for each test type

## Test Type Requirements

| Test Type | Required Fields | Example           |
| --------- | --------------- | ----------------- |
| `AtLeast` | `target`        | DC 15 check       |
| `AtMost`  | `target`        | Roll 5 or less    |
| `Exact`   | `target`        | Roll exactly 7    |
| `Within`  | `min`, `max`    | Roll 8-12         |
| `Skill`   | `target`        | Skill check DC 12 |
| `Attack`  | `target`        | Attack vs AC 16   |

## Examples

### Basic Usage

```javascript
const { TestConditions, TestType, DieType } = require("@platonic-dice/core");

// AtLeast test
const dc15 = new TestConditions(TestType.AtLeast, 15, DieType.D20);

// Within test
const range = new TestConditions(
  TestType.Within,
  undefined, // target not needed
  DieType.D20,
  8, // min
  12 // max
);
```

### Using Plain Objects

You don't need to use the class - plain objects work too:

```javascript
const { rollTest, DieType, TestType } = require("@platonic-dice/core");

// Plain object (more common)
const result = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

// Same as using class
const conditions = new TestConditions(TestType.AtLeast, 15, DieType.D20);
const result2 = rollTest(DieType.D20, conditions);
```

### Validation

```javascript
// Valid: target within die range
const valid = new TestConditions(TestType.AtLeast, 15, DieType.D20);
// ✓ target 15 is within 1-20

// Invalid: target exceeds die range
try {
  const invalid = new TestConditions(TestType.AtLeast, 25, DieType.D20);
} catch (error) {
  console.log("Error: Target 25 exceeds D20 maximum (20)");
}
```

### Range Validation

```javascript
// Valid range
const validRange = new TestConditions(
  TestType.Within,
  undefined,
  DieType.D20,
  8,
  12
);
// ✓ min (8) <= max (12)

// Invalid range
try {
  const invalidRange = new TestConditions(
    TestType.Within,
    undefined,
    DieType.D20,
    15,
    10 // min > max!
  );
} catch (error) {
  console.log("Error: min must be <= max");
}
```

## Use Cases

### Reusable Difficulty Classes

```javascript
const difficulties = {
  easy: new TestConditions(TestType.AtLeast, 10, DieType.D20),
  medium: new TestConditions(TestType.AtLeast, 15, DieType.D20),
  hard: new TestConditions(TestType.AtLeast, 20, DieType.D20),
};

const check = rollTest(DieType.D20, difficulties.medium);
```

### Dynamic Difficulty

```javascript
function createDifficultyCheck(playerLevel, baseDC) {
  const adjustedDC = Math.max(5, baseDC - Math.floor(playerLevel / 2));

  return new TestConditions(TestType.AtLeast, adjustedDC, DieType.D20);
}

const level5Check = createDifficultyCheck(5, 18);
// DC adjusted from 18 to 16 for level 5 player
```

### Combat System

```javascript
class Enemy {
  constructor(name, ac) {
    this.name = name;
    // Use TestType.Skill for attack rolls with natural crits
    this.attackConditions = new TestConditions(TestType.Skill, ac, DieType.D20);
  }

  getAttackTest() {
    return this.attackConditions;
  }
}

const goblin = new Enemy("Goblin", 13);
const attackRoll = rollTest(DieType.D20, goblin.getAttackTest());
```

## Notes

- Plain objects are more common and convenient
- The class provides validation and type safety
- Validation happens at construction time
- Can't use targets outside the base die range
- For modified ranges, use [`ModifiedTestConditions`](./ModifiedTestConditions.md)
- Die type is optional but recommended for validation

## Common Patterns

### Condition Builder

```javascript
class ConditionBuilder {
  static dc(target) {
    return {
      testType: TestType.AtLeast,
      target,
    };
  }

  static skillCheck(dc) {
    return {
      testType: TestType.Skill,
      target: dc,
    };
  }

  static attackVs(ac) {
    // Use TestType.Skill for attack rolls with natural crits
    return {
      testType: TestType.Skill,
      target: ac,
    };
  }

  static range(min, max) {
    return {
      testType: TestType.Within,
      min,
      max,
    };
  }
}

// Usage
const save = rollTest(DieType.D20, ConditionBuilder.dc(15));
const skill = rollTest(DieType.D20, ConditionBuilder.skillCheck(12));
const attack = rollTest(DieType.D20, ConditionBuilder.attackVs(16));
```

## See Also

- [`ModifiedTestConditions`](./ModifiedTestConditions.md) - For tests with modifiers
- [`TestType`](./TestType.md) - Types of tests
- [`rollTest`](../rollTest.md) - Roll with conditions
- [`analyseTest`](../analyseTest.md) - analyse probabilities
