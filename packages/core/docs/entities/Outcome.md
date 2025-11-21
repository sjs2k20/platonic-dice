# Outcome

Represents the result of a test (Success, Failure, Critical Success, Critical Failure).

## Overview

`Outcome` is a string literal type and enum that defines possible test outcomes. It's used when rolling with test conditions to determine if the roll succeeded or failed.

## Usage

```javascript
const { Outcome, rollTest, DieType, TestType } = require("@platonic-dice/core");

const result = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

if (result.outcome === Outcome.Success) {
  console.log("You succeeded!");
}
```

## API

### Enum Values

```typescript
enum Outcome {
  Success = "success",
  Failure = "failure",
  CriticalSuccess = "critical_success",
  CriticalFailure = "critical_failure",
}
```

### Type Definition

```typescript
type OutcomeValue =
  | "success"
  | "failure"
  | "critical_success"
  | "critical_failure";
```

## Outcome Types

| Outcome                   | String Value         | When It Occurs                        |
| ------------------------- | -------------------- | ------------------------------------- |
| `Outcome.Success`         | `"success"`          | Test condition met (non-critical)     |
| `Outcome.Failure`         | `"failure"`          | Test condition not met (non-critical) |
| `Outcome.CriticalSuccess` | `"critical_success"` | Natural 20 on Skill tests             |
| `Outcome.CriticalFailure` | `"critical_failure"` | Natural 1 on Skill tests              |

## Examples

### Basic Outcome Checking

```javascript
const { rollTest, DieType, TestType, Outcome } = require("@platonic-dice/core");

const result = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 12,
});

switch (result.outcome) {
  case Outcome.Success:
    console.log("Success!");
    break;
  case Outcome.Failure:
    console.log("Failed.");
    break;
}
```

### Handling Critical Outcomes

```javascript
const { rollTest, DieType, TestType, Outcome } = require("@platonic-dice/core");

const result = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});

if (result.outcome === Outcome.CriticalSuccess) {
  console.log("Natural 20! Critical success!");
} else if (result.outcome === Outcome.CriticalFailure) {
  console.log("Natural 1! Critical failure!");
} else if (result.outcome === Outcome.Success) {
  console.log("Success!");
} else {
  console.log("Failure.");
}
```

### Grouping Outcomes

```javascript
const { Outcome } = require("@platonic-dice/core");

function isSuccess(outcome) {
  return outcome === Outcome.Success || outcome === Outcome.CriticalSuccess;
}

function isCritical(outcome) {
  return (
    outcome === Outcome.CriticalSuccess || outcome === Outcome.CriticalFailure
  );
}

// Usage
if (isSuccess(result.outcome)) {
  console.log("You passed the check!");
}

if (isCritical(result.outcome)) {
  console.log("Something dramatic happens!");
}
```

## Natural Crits

Critical outcomes only occur with **natural rolls** (1 or 20 on the **base die**, before modifiers):

```javascript
// Skill test with natural crits enabled (default)
const skill = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});
// Can be: CriticalSuccess, Success, Failure, or CriticalFailure

// AtLeast test (no natural crits)
const check = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 12,
});
// Can ONLY be: Success or Failure (never critical)
```

## Use Cases

### Combat System

```javascript
function resolveAttack(attackRoll) {
  switch (attackRoll.outcome) {
    case Outcome.CriticalSuccess:
      return { hit: true, damage: rollDamage() * 2 };
    case Outcome.Success:
      return { hit: true, damage: rollDamage() };
    case Outcome.CriticalFailure:
      return { hit: false, fumble: true };
    case Outcome.Failure:
      return { hit: false, fumble: false };
  }
}
```

### Skill Check with Degrees of Success

```javascript
function skillCheckResult(roll) {
  if (roll.outcome === Outcome.CriticalSuccess) {
    return "Exceptional success! Extra benefit.";
  } else if (roll.outcome === Outcome.Success) {
    return "Success!";
  } else if (roll.outcome === Outcome.Failure) {
    return "Failure.";
  } else if (roll.outcome === Outcome.CriticalFailure) {
    return "Critical failure! Something goes wrong.";
  }
}
```

### Statistics Tracking

```javascript
const stats = {
  [Outcome.CriticalSuccess]: 0,
  [Outcome.Success]: 0,
  [Outcome.Failure]: 0,
  [Outcome.CriticalFailure]: 0,
};

// Track 100 rolls
for (let i = 0; i < 100; i++) {
  const result = rollTest(DieType.D20, {
    testType: TestType.Skill,
    target: 12,
  });
  stats[result.outcome]++;
}

console.log(`Critical Successes: ${stats[Outcome.CriticalSuccess]}`);
console.log(`Successes: ${stats[Outcome.Success]}`);
console.log(`Failures: ${stats[Outcome.Failure]}`);
console.log(`Critical Failures: ${stats[Outcome.CriticalFailure]}`);
```

## Notes

- Outcome values are lowercase with underscores (e.g., `"critical_success"`)
- Use the enum for type safety and autocomplete
- Critical outcomes require `TestType.Skill`
- Natural crits check the **base roll**, not modified values
- Can be disabled with `{ useNaturalCrits: false }`

## See Also

- [`rollTest`](../rollTest.md) - Roll with test conditions
- [`TestType`](./TestType.md) - Types of tests
- [`analyseTest`](../analyseTest.md) - Probability analysis
