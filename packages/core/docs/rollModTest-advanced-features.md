# rollModTest Advanced Features

Advanced TTRPG-style mechanics for natural crits and outcome-based advantage/disadvantage.

## Overview

`rollModTest` supports two advanced features that align with tabletop RPG mechanics:

1. **Natural Crits** - Rolling the die's maximum or minimum value triggers critical success/failure (enabled by default for Skill tests)
2. **Outcome-Based Advantage/Disadvantage** - Rolls are compared by their final outcomes, not just base values (always active)

## Natural Crits

### What are Natural Crits?

In many TTRPGs (like D&D 5e), rolling a natural 20 on a d20 is always a critical success, and rolling a natural 1 is always a critical failure, regardless of modifiers or bonuses.

### Default Behavior

Natural crits are **enabled by default** for `TestType.Skill` tests:

```javascript
// Natural crits automatically enabled for Skill tests
const result = rollModTest(DieType.D20, (n) => n + 5, {
  testType: TestType.Skill,
  target: 15,
  critical_success: 25,
  critical_failure: 6,
});
// If base roll is 20 → CriticalSuccess (natural crit)
// If base roll is 1 → CriticalFailure (natural crit)
```

For other test types, natural crits are disabled by default but can be explicitly enabled:

```javascript
// Opt-in for non-Skill tests
const result = rollModTest(
  DieType.D20,
  (n) => n + 5,
  { testType: TestType.AtLeast, target: 15 },
  undefined,
  { useNaturalCrits: true }
);
```

### How It Works

When natural crits are enabled (default for `TestType.Skill`):

- Rolling the **die's maximum value** (e.g., 20 on d20, 6 on d6) → `CriticalSuccess`
- Rolling **1** → `CriticalFailure`

The modified value is still calculated and returned, but the outcome is overridden by the natural crit mechanic.

### Example Scenarios

#### Scenario 1: Natural 20 with Penalty

```javascript
// Natural crits are default for Skill tests
const result = rollModTest(DieType.D20, (n) => n - 5, {
  testType: TestType.Skill,
  target: 12,
  critical_success: 15, // Max: 20-5=15
  critical_failure: -4, // Min: 1-5=-4
});

// If roll is 20:
// Modified: 20-5=15
// Outcome: CriticalSuccess (natural 20 overrides)
// Without natural crits: would be Success (15 == critical_success threshold)
```

#### Scenario 2: Natural 1 with Huge Bonus

```javascript
// Even with massive bonus, natural 1 causes critical failure
const result = rollModTest(DieType.D20, (n) => n + 100, {
  testType: TestType.Skill,
  target: 105,
  critical_success: 120, // Max: 20+100=120
  critical_failure: 101, // Min: 1+100=101
});

// If roll is 1:
// Modified: 1+100=101
// Outcome: CriticalFailure (natural 1 overrides)
// Without natural crits: 101 >= 101 would be Success
```

#### Scenario 3: Disabling Natural Crits for Skill Tests

```javascript
// Explicitly disable natural crits
const result = rollModTest(
  DieType.D20,
  (n) => n + 5,
  {
    testType: TestType.Skill,
    target: 15,
    critical_success: 25,
    critical_failure: 6,
  },
  undefined,
  { useNaturalCrits: false } // Override default
);

// Now outcomes are determined purely by thresholds
// Roll 20: modified=25 → CriticalSuccess (by threshold, not natural crit)
// Roll 1: modified=6 → CriticalFailure (by threshold, not natural crit)
```

### Important Notes

- Natural crits **only apply to `TestType.Skill`** tests
- **Default: enabled** for Skill tests, disabled for all others
- Can be explicitly controlled via `useNaturalCrits` option
- Works with all die types (d4, d6, d8, d10, d12, d20)
- Test conditions must still be within the achievable modified range

## Outcome-Based Advantage/Disadvantage

### The Problem with Base Roll Comparison

Traditional advantage/disadvantage rolls twice and picks the higher/lower **base roll**. This doesn't account for the fact that a lower base roll might actually result in a better outcome after modifiers and test evaluation.

### How Outcome-Based Comparison Works

When using `RollType.Advantage` or `RollType.Disadvantage`, `rollModTest`:

1. Rolls twice
2. **Evaluates both rolls completely** (apply modifier, determine outcome, check natural crits)
3. **Compares the final outcomes** using a ranking system
4. Returns the result with the better/worse outcome

### Outcome Ranking

Outcomes are ranked from worst to best:

| Rank | Outcome           |
| ---- | ----------------- |
| 0    | `CriticalFailure` |
| 1    | `Failure`         |
| 2    | `Success`         |
| 3    | `CriticalSuccess` |

### Example: Advantage Picks Better Outcome

```javascript
const result = rollModTest(
  DieType.D20,
  (n) => n + 5,
  {
    testType: TestType.Skill,
    target: 10,
    critical_success: 24,
    critical_failure: 6,
  },
  RollType.Advantage
);

// Evaluation:
// Roll 1: base=19, modified=24 → CriticalSuccess (rank 3)
// Roll 2: base=2, modified=7 → Success (rank 2)
//
// Traditional: Would pick Roll 1 (19 > 2) ✓ Same result
// Outcome-based: Picks Roll 1 (CriticalSuccess > Success) ✓

// The difference matters in edge cases where a lower base roll
// produces a better outcome after modifiers
```

### Example: Disadvantage Picks Worse Outcome

```javascript
const result = rollModTest(
  DieType.D20,
  (n) => n - 3,
  { testType: TestType.AtLeast, target: 12 },
  RollType.Disadvantage
);

// Evaluation:
// Roll 1: base=18, modified=15 → Success (rank 2)
// Roll 2: base=10, modified=7 → Failure (rank 1)
//
// Picks Roll 2 (Failure < Success)
```

### Why This Matters

Consider this scenario:

```javascript
// A character with a massive bonus (+15) trying to hit a high DC
const result = rollModTest(
  DieType.D20,
  (n) => n + 15,
  {
    testType: TestType.Skill,
    target: 20,
    critical_success: 35, // Only achievable on natural 20
    critical_failure: 16,
  },
  RollType.Advantage
);

// Roll 1: base=20, modified=35 → CriticalSuccess (rank 3)
// Roll 2: base=19, modified=34 → Success (rank 2)
//
// Traditional: Would pick Roll 1 (20 > 19) ✓ Same result
// But with natural crits enabled, the gap is even more important!
```

## Combining Natural Crits with Advantage/Disadvantage

When using advantage or disadvantage with Skill tests, each roll is fully evaluated (including natural crit checks) before comparing outcomes:

```javascript
// Natural crits are default for Skill tests
const result = rollModTest(
  DieType.D20,
  (n) => n + 2,
  {
    testType: TestType.Skill,
    target: 12,
    critical_success: 22,
    critical_failure: 3,
  },
  RollType.Advantage
);

// Evaluation:
// Roll 1: base=20 (natural max!) → CriticalSuccess (natural crit)
// Roll 2: base=10, modified=12 → Success
// Picks Roll 1 (CriticalSuccess > Success)
//
// Natural 20s are always preferred with advantage
```

### Disadvantage Example

```javascript
// Even with massive bonus, natural 1 loses with disadvantage
const result = rollModTest(
  DieType.D20,
  (n) => n + 100,
  {
    testType: TestType.Skill,
    target: 105,
    critical_success: 120,
    critical_failure: 101,
  },
  RollType.Disadvantage
);

// Evaluation:
// Roll 1: base=20, modified=120 → CriticalSuccess (rank 3)
// Roll 2: base=1 (natural min!), modified=101 → CriticalFailure (natural crit, rank 0)
// Picks Roll 2 (CriticalFailure < CriticalSuccess)
//
// Natural 1 causes critical failure even with +100 bonus
```

## Configuration Summary

| Option            | Type      | Default (Skill) | Default (Other) | Description                                                          |
| ----------------- | --------- | --------------- | --------------- | -------------------------------------------------------------------- |
| `useNaturalCrits` | `boolean` | `true`          | `false`         | Enable/disable natural crit mechanics. Auto-enabled for Skill tests. |

## Compatibility

- **Natural Crits**: Only works with `TestType.Skill`
- **Default Behavior**: Natural crits are enabled by default for Skill tests, disabled for others
- **Outcome-Based Comparison**: Works with all test types and is always active for advantage/disadvantage
- Both features work with all die types (d4-d20)
- Both features respect the achievable modified range validation

## Testing

The advanced features are comprehensively tested in:

- `__tests__/rollModTest-advanced.test.js` - 13 tests covering:
  - Natural crits on max/min rolls
  - Natural crits with different die types
  - Natural crits opt-in behavior
  - Outcome-based advantage/disadvantage
  - Combining both features

## Use Cases

### D&D 5e Style Skill Checks

```javascript
// Natural crits are default for Skill tests
const skillCheck = (modifier, dc) =>
  rollModTest(DieType.D20, (n) => n + modifier, {
    testType: TestType.Skill,
    target: dc,
    critical_success: 20 + modifier, // Natural 20 always hits this
    critical_failure: 1 + modifier, // Natural 1 always hits this
  });

const result = skillCheck(5, 15);
// Natural 20 → always CriticalSuccess
// Natural 1 → always CriticalFailure
```

### Attack Rolls with Advantage

```javascript
// Natural crits work automatically with advantage/disadvantage
const attackRoll = (bonus, ac) =>
  rollModTest(
    DieType.D20,
    (n) => n + bonus,
    {
      testType: TestType.Skill,
      target: ac,
      critical_success: 20 + bonus,
      critical_failure: 1 + bonus,
    },
    RollType.Advantage
  );

const result = attackRoll(7, 18);
// Rolls twice, picks the better outcome
// Natural 20 always wins with advantage
```

## See Also

- [rollModTest Main Documentation](./rollModTest.md)
- [Basic Examples](../examples/rollModTest-example.js)
- [Advanced Features Examples](../examples/rollModTest-advanced-features-example.js)
- [Test Suite](__tests__/rollModTest-advanced.test.js)
