# RollType

Represents roll behavior: normal, advantage, or disadvantage.

## Overview

`RollType` controls how dice are rolled when dealing with advantage/disadvantage mechanics. It determines whether to roll once, twice and take the higher, or twice and take the lower.

## Usage

```javascript
const { RollType, roll, DieType } = require("@platonic-dice/core");

// Roll with advantage (take higher of two rolls)
const advantageRoll = roll(DieType.D20, RollType.Advantage);

// Roll with disadvantage (take lower of two rolls)
const disadvantageRoll = roll(DieType.D20, RollType.Disadvantage);
```

## API

### Enum Values

```typescript
enum RollType {
  Advantage = "advantage",
  Disadvantage = "disadvantage",
}
```

### Type Definition

```typescript
type RollTypeValue = "advantage" | "disadvantage";
```

## Roll Types

| Type                    | String Value     | Behavior                |
| ----------------------- | ---------------- | ----------------------- |
| `RollType.Advantage`    | `"advantage"`    | Roll twice, take higher |
| `RollType.Disadvantage` | `"disadvantage"` | Roll twice, take lower  |

## Examples

### Basic Usage

```javascript
const { RollType, roll, DieType } = require("@platonic-dice/core");

// Normal roll
const normal = roll(DieType.D20);
console.log(`Normal: ${normal}`);

// Advantage
const adv = roll(DieType.D20, RollType.Advantage);
console.log(`Advantage: ${adv}`);

// Disadvantage
const disadv = roll(DieType.D20, RollType.Disadvantage);
console.log(`Disadvantage: ${disadv}`);
```

### With Attack Rolls

```javascript
const {
  RollType,
  rollTest,
  DieType,
  TestType,
} = require("@platonic-dice/core");

// Attack with advantage (hidden, high ground, etc.)
// Use TestType.Skill for attack rolls with natural crits
const attackAdv = rollTest(
  DieType.D20,
  { testType: TestType.Skill, target: 16 },
  RollType.Advantage,
);

console.log(`Attack (Advantage): ${attackAdv.base}`);
```

### Conditional Roll Type

```javascript
function determineRollType(hasAdvantage, hasDisadvantage) {
  // They cancel out
  if (hasAdvantage && hasDisadvantage) {
    return undefined;
  }

  if (hasAdvantage) return RollType.Advantage;
  if (hasDisadvantage) return RollType.Disadvantage;
  return undefined;
}

const rollType = determineRollType(true, false);
const result = roll(DieType.D20, rollType);
```

## Notes

- Default behavior is a normal roll when roll type is omitted (`undefined`)
- Advantage/disadvantage only affect the final roll value
- Multiple sources of advantage don't stack (same with disadvantage)
- Advantage and disadvantage cancel each other out
- Statistical advantage ≈ +5 bonus, disadvantage ≈ -5 penalty
- Works with all roll functions that accept options

## Common Patterns

### Advantage/Disadvantage Cancellation

```javascript
function getEffectiveRollType(advantages, disadvantages) {
  const hasAdv = advantages > 0;
  const hasDisadv = disadvantages > 0;

  if (hasAdv && hasDisadv) {
    return undefined; // Cancel out
  }

  if (hasAdv) return RollType.Advantage;
  if (hasDisadv) return RollType.Disadvantage;
  return undefined;
}
```

### Situational Advantage

```javascript
const conditions = {
  isHidden: true,
  targetProne: false,
  isBlinded: false,
};

function getRollTypeFromConditions(conditions) {
  let advantages = 0;
  let disadvantages = 0;

  if (conditions.isHidden) advantages++;
  if (conditions.targetProne) advantages++;
  if (conditions.isBlinded) disadvantages++;

  return getEffectiveRollType(advantages, disadvantages);
}

const rollType = getRollTypeFromConditions(conditions);
```

## See Also

- [`roll`](../roll.md) - Roll with advantage/disadvantage
- [`rollTest`](../rollTest.md) - Test with advantage/disadvantage
- [`TestConditions`](./TestConditions.md) - Test configuration
