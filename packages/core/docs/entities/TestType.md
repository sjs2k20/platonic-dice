# TestType

Defines the type of test to perform on a die roll.

## Overview

`TestType` specifies how to evaluate a die roll against target conditions. Different test types enable various game mechanics like saving throws, skill checks, attacks, exact values, and range checks.

## Usage

```javascript
const { TestType, rollTest, DieType } = require("@platonic-dice/core");

// At least DC 15
const save = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});
```

## API

### Enum Values

```typescript
enum TestType {
  AtLeast = "at_least",
  AtMost = "at_most",
  Exact = "exact",
  Within = "within",
  InList = "in_list",
  Skill = "skill",
}
```

### Type Definition

```typescript
type TestTypeValue =
  | "at_least"
  | "at_most"
  | "exact"
  | "within"
  | "in_list"
  | "skill";
```

## Test Types

| Type               | Condition            | Use Case                    | Natural Crits  |
| ------------------ | -------------------- | --------------------------- | -------------- |
| `TestType.AtLeast` | `roll >= target`     | Saving throws, basic checks | No             |
| `TestType.AtMost`  | `roll <= target`     | Reverse checks, limbo       | No             |
| `TestType.Exact`   | `roll === target`    | Specific value needed       | No             |
| `TestType.Within`  | `min <= roll <= max` | Range checks                | No             |
| `TestType.InList`  | `roll in list`       | Multiple valid values       | No             |
| `TestType.Skill`   | `roll >= target`     | Skill checks, attack rolls  | Yes (nat 1/20) |

## Examples

### AtLeast (Standard DC Check)

```javascript
const { TestType, rollTest, DieType } = require("@platonic-dice/core");

// Saving throw (DC 15)
const save = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 15,
});

// Success if roll >= 15
console.log(`${save.roll} vs DC 15: ${save.outcome}`);
```

### Skill (With Natural Crits)

```javascript
// Skill check with natural 1/20 as crit fail/success
const perception = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 12,
});

// Can be: CriticalSuccess (nat 20), Success (12-19),
//         Failure (2-11), CriticalFailure (nat 1)
```

### Exact Value

```javascript
// Need to roll exactly 7
const exact = rollTest(DieType.D10, {
  testType: TestType.Exact,
  target: 7,
});

// Success only if roll === 7
```

### Within Range

```javascript
// Must roll between 8 and 12 (inclusive)
const range = rollTest(DieType.D20, {
  testType: TestType.Within,
  min: 8,
  max: 12,
});

// Success if 8 <= roll <= 12
```

### AtMost (Reverse Check)

```javascript
// Success if roll is 5 or lower
const limbo = rollTest(DieType.D20, {
  testType: TestType.AtMost,
  target: 5,
});

// Success if roll <= 5
```

## Natural Crits

Only `Skill` tests support natural crits by default:

```javascript
// Skill test with natural crits enabled by default
rollTest(DieType.D20, { testType: TestType.Skill, target: 15 });
// Can return: CriticalSuccess, Success, Failure, CriticalFailure

// Other test types
rollTest(DieType.D20, { testType: TestType.AtLeast, target: 15 });
rollTest(DieType.D20, { testType: TestType.Exact, target: 10 });
// Can ONLY return: Success or Failure
```

Disable natural crits:

```javascript
rollTest(
  DieType.D20,
  { testType: TestType.Skill, target: 15 },
  { useNaturalCrits: false }
);
// Will only return Success or Failure, even on nat 1/20
```

## Use Cases

### Saving Throws

```javascript
const constitution = rollTest(DieType.D20, {
  testType: TestType.AtLeast,
  target: 13, // DC 13
});
```

### Skill Checks with Crits

```javascript
const stealth = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 15,
});

if (stealth.outcome === "critical_success") {
  console.log("Nat 20! Invisible!");
}
```

### Attack Rolls (using Skill type)

```javascript
// Use TestType.Skill for attack rolls with natural crits
const toHit = rollTest(DieType.D20, {
  testType: TestType.Skill,
  target: 17, // Enemy AC
});

if (toHit.outcome === "critical_success") {
  damage *= 2; // Double dice on crit
}
```

### Random Events (Exact)

```javascript
// 1-in-6 chance of trap
const trap = rollTest(DieType.D6, {
  testType: TestType.Exact,
  target: 1,
});
```

### Range-Based Systems

```javascript
// Hit zones: 1-5 = legs, 6-15 = torso, 16-20 = head
const hitLocation = rollTest(DieType.D20, {
  testType: TestType.Within,
  min: 6,
  max: 15,
});

if (hitLocation.outcome === "success") {
  console.log("Torso hit!");
}
```

## Notes

- `AtLeast` is most common (DC checks, saves)
- `Skill` is `AtLeast` with optional natural crits (use for skill checks and attack rolls)
- `Within` requires both `min` and `max` properties
- `InList` requires `validValues` array property
- Natural crits only apply to base roll, not modified values
- Can disable crits with `{ useNaturalCrits: false }`

## See Also

- [`rollTest`](../rollTest.md) - Roll with test conditions
- [`TestConditions`](./TestConditions.md) - Test configuration class
- [`Outcome`](./Outcome.md) - Test result outcomes
