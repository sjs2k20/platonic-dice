# rollTest

Rolls a single die and evaluates it against test conditions, returning both the roll and outcome.

## Overview

`rollTest` builds on [`roll`](./roll.md) by adding outcome evaluation. While `roll` returns a simple number, `rollTest` compares the roll against test conditions (like a difficulty class) and returns both the roll and an outcome (`success`, `failure`, `critical_success`, or `critical_failure`).

This is the foundation for pass/fail checks in RPG systems like D&D saving throws, ability checks, and attack rolls.

## Usage

```javascript
const {
  rollTest,
  rollD20AtLeast,
  DieType,
  TestType,
  RollType,
} = require("@platonic-dice/core");

// Using rollTest - returns both base and outcome
const result = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(result); // { base: 14, outcome: "failure" }

// Using alias - cleaner syntax
const check = rollD20AtLeast(15);
console.log(check); // { base: 18, outcome: "success" }

// With advantage
const save = rollD20AtLeast(12, RollType.Advantage);
```

## API

### Function Signature

```typescript
rollTest(
  dieType: DieTypeValue,
  testConditions: TestConditionsInstance | { testType: TestTypeValue, ...conditions },
  rollType?: RollTypeValue,
  options?: { useNaturalCrits?: boolean }
): { base: number, outcome: OutcomeValue }
```

### Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`)
- **testConditions**: Test evaluation criteria
  - Can be a `TestConditions` instance
  - Or a plain object: `{ testType: TestType.AtLeast, target: 15 }`
  - See Test Types section below
- **rollType** _(optional)_: How to roll the die
  - `undefined` - Standard roll (default)
  - `RollType.Advantage` - Roll twice, use higher value
  - `RollType.Disadvantage` - Roll twice, use lower value
- **options** _(optional)_:
  - `useNaturalCrits`: Enable natural 1/max for critical results (default: true for Skill tests, false otherwise)

### Returns

`{ base: number, outcome: OutcomeValue }` - Object containing:

- **base**: The die roll value
- **outcome**: The evaluation result
  - `Outcome.Success` - Test passed
  - `Outcome.Failure` - Test failed
  - `Outcome.CriticalSuccess` - Exceptional success (Skill tests)
  - `Outcome.CriticalFailure` - Exceptional failure (Skill tests)

### Test Types

**AtLeast** - Roll must be ≥ target (most common for D&D):

```javascript
{ testType: TestType.AtLeast, target: 15 }
// Success if roll ≥ 15, failure otherwise
```

**AtMost** - Roll must be ≤ target:

```javascript
{ testType: TestType.AtMost, target: 3 }
// Success if roll ≤ 3, failure otherwise
```

**Exact** - Roll must exactly equal target:

```javascript
{ testType: TestType.Exact, target: 20 }
// Success only if roll = 20
```

**Skill** - Classic skill check with natural 1/20 criticals:

```javascript
{ testType: TestType.Skill, target: 15 }
// Natural 1 = critical_failure
// Natural 20 = critical_success
// Otherwise: success if ≥ target, failure if < target
```

**Within** - Roll must be within range:

```javascript
{ testType: TestType.Within, min: 10, max: 15 }
// Success if 10 ≤ roll ≤ 15
```

**InList** - Roll must be in array:

```javascript
{ testType: TestType.InList, values: [1, 3, 5, 7] }
// Success if roll is in the array
```

### Convenience Aliases

`rollTest` provides aliases for all die types × test types:

**AtLeast Aliases** (most common):

```javascript
const {
  rollD20AtLeast,
  rollD6AtLeast,
  rollD10AtLeast,
} = require("@platonic-dice/core");

// Roll d20, check if ≥ target
rollD20AtLeast(15); // { base: 18, outcome: "success" }
rollD6AtLeast(4); // { base: 3, outcome: "failure" }

// With advantage/disadvantage
rollD20AtLeast(15, RollType.Advantage);
rollD20AtLeast(15, RollType.Disadvantage);
```

**AtMost Aliases**:

```javascript
rollD20AtMost(10); // Success if ≤ 10
rollD6AtMost(3); // Success if ≤ 3
```

**Exact Aliases**:

```javascript
rollD20Exact(20); // Success only on 20
rollD6Exact(6); // Success only on 6
```

**Skill Aliases** (with natural crits):

```javascript
rollD20Skill(15); // Natural 1 = crit fail, natural 20 = crit success
rollD10Skill(8); // Skill check for d10 systems
```

**Available Patterns:**

- `rollD[4|6|8|10|12|20]AtLeast(target, rollType?)`
- `rollD[4|6|8|10|12|20]AtMost(target, rollType?)`
- `rollD[4|6|8|10|12|20]Exact(target, rollType?)`
- `rollD[4|6|8|10|12|20]Skill(target, rollType?)`
- `rollD[4|6|8|10|12|20]Within(min, max, rollType?)`
- `rollD[4|6|8|10|12|20]InList(values, rollType?)`

## Examples

### How rollTest Builds on roll

```javascript
// roll() returns a simple number
const simpleRoll = roll(DieType.D20);
console.log(simpleRoll); // 14

// rollTest() returns base AND outcome
const testRoll = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
console.log(testRoll);
// { base: 14, outcome: "failure" }

// Both support advantage/disadvantage
const advTest = rollTest(
  DieType.D20,
  { testType: TestType.AtLeast, target: 15 },
  RollType.Advantage,
);
// { base: 18, outcome: "success" } (picked higher of two rolls)
```

### Basic Test Types

```javascript
// AtLeast (≥ target) - most common
const atLeast = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
// { base: 16, outcome: "success" } if roll ≥ 15

// AtMost (≤ target)
const atMost = rollTest(DieType.D6, { testType: TestType.AtMost, target: 3 });
// { base: 2, outcome: "success" } if roll ≤ 3

// Exact (= target)
const exact = rollTest(DieType.D20, { testType: TestType.Exact, target: 20 });
// { base: 20, outcome: "success" } only if exactly 20

// Skill (with natural 1/20)
const skill = rollTest(DieType.D20, { testType: TestType.Skill, target: 15 });
// Natural 1 = "critical_failure", natural 20 = "critical_success"

// Skill with custom critical thresholds
const { TestConditions } = require("@platonic-dice/core");
const customSkill = new TestConditions(
  TestType.Skill,
  {
    target: 12,
    critical_success: 18, // Crit on 18+ instead of just 20
    critical_failure: 3, // Crit fail on ≤3 instead of just 1
  },
  DieType.D20,
);
const customTest = rollTest(DieType.D20, customSkill);
// Crit success if ≥18, crit failure if ≤3, otherwise normal success/failure at 12
```

### Using Convenience Aliases

```javascript
// AtLeast - most common for D&D
const check = rollD20AtLeast(15);
console.log(`Rolled ${check.base}: ${check.outcome}`);

// AtMost
const lowRoll = rollD6AtMost(3);

// Exact
const exactRoll = rollD20Exact(20);

// Skill (with natural crits)
const skillCheck = rollD20Skill(15);
if (skillCheck.base === 20) {
  console.log("Natural 20! Critical success!");
}
```

### Practical Use Cases

```javascript
// Ability check
const athletics = rollD20AtLeast(15);
if (athletics.outcome === Outcome.Success) {
  console.log("You climb the wall!");
} else {
  console.log("You slip and fall.");
}

// Saving throw with advantage
const dexSave = rollD20AtLeast(12, RollType.Advantage);
console.log(`Save: ${dexSave.base} → ${dexSave.outcome}`);

// Attack roll
const attack = rollD20AtLeast(16); // AC 16
if (attack.outcome === Outcome.Success) {
  console.log(`Hit! Rolled ${attack.base}`);
}

// Death save
const deathSave = rollD20AtLeast(10);
if (deathSave.outcome === Outcome.Success) {
  console.log("One success!");
} else {
  console.log("One failure...");
}

// Skill check with natural crits
const stealth = rollD20Skill(14);
if (stealth.base === 1) {
  console.log("Critical failure! You knock over a vase!");
} else if (stealth.base === 20) {
  console.log("Critical success! You're invisible!");
}
```

### With Advantage/Disadvantage

```javascript
// Attack with advantage
const advAttack = rollD20AtLeast(15, RollType.Advantage);
console.log(`With advantage: ${advAttack.base} → ${advAttack.outcome}`);

// Save with disadvantage
const disSave = rollD20AtLeast(12, RollType.Disadvantage);
console.log(`With disadvantage: ${disSave.base} → ${disSave.outcome}`);

// Skill check with advantage
const advSkill = rollD20Skill(14, RollType.Advantage);
```

### Multiple Tests

```javascript
// Three attacks against AC 15
for (let i = 1; i <= 3; i++) {
  const atk = rollD20AtLeast(15);
  const result = atk.outcome === Outcome.Success ? "HIT" : "MISS";
  console.log(`Attack ${i}: ${atk.base} → ${result}`);
}

// Party perception checks
const party = ["Fighter", "Rogue", "Wizard", "Cleric"];
party.forEach((member) => {
  const check = rollD20AtLeast(12);
  console.log(`${member}: ${check.base} → ${check.outcome}`);
});
```

## Understanding Outcomes

### AtLeast / AtMost / Exact Outcomes

These test types return two outcomes:

- `Outcome.Success` - Test passed
- `Outcome.Failure` - Test failed

```javascript
const check = rollD20AtLeast(15);
// If roll ≥ 15: outcome = "success"
// If roll < 15: outcome = "failure"
```

### Skill Test Outcomes

Skill tests return four possible outcomes:

- `Outcome.CriticalSuccess` - Natural 20 OR (roll ≥ target AND natural max)
- `Outcome.Success` - Roll meets target (not natural 20)
- `Outcome.Failure` - Roll below target (not natural 1)
- `Outcome.CriticalFailure` - Natural 1

```javascript
const skill = rollD20Skill(15);
// Natural 20: "critical_success"
// Roll 15-19: "success"
// Roll 2-14: "failure"
// Natural 1: "critical_failure"
```

## Notes

- **Builds on [`roll`](./roll.md)**: Uses the same die rolling logic with outcome evaluation
- `rollTest()` returns `{ base, outcome }` for both the roll and result
- **Convenience aliases** provide cleaner syntax for common test types
- Aliases accept optional `RollType` parameter for advantage/disadvantage
- The test evaluation happens AFTER advantage/disadvantage selection
- For tests with modifiers, use [`rollModTest`](./rollModTest.md)
- For testing multiple dice with aggregate rules, use [`rollDiceTest`](./rollDiceTest.md)

## When to Use rollTest vs Aliases

**Use `rollTest()` when:**

- You need complex test conditions (Within, InList)
- You want explicit control over test type
- You're using TestConditions instances
- You need custom `useNaturalCrits` options

**Use aliases when:**

- You're using standard test types (AtLeast, AtMost, Exact, Skill)
- You want cleaner, more readable code
- You're making many quick checks
- You're working with typical D&D mechanics

## See Also

- [`roll`](./roll.md) - Roll without tests (what rollTest builds on)
- [`rollMod`](./rollMod.md) - Roll with modifiers (no test evaluation)
- [`rollModTest`](./rollModTest.md) - Roll with modifiers AND test conditions
- [`TestType`](./entities/TestType.md) - Test type enumeration
- [`TestConditions`](./entities/TestConditions.md) - Test conditions class
- [`Outcome`](./entities/Outcome.md) - Outcome enumeration
