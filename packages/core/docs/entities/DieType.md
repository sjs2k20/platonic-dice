# DieType

Represents the type of die to roll (D4, D6, D8, D10, D12, D20).

## Overview

`DieType` is a string literal type and enum that defines the supported polyhedral dice. It ensures type safety when specifying which die to roll.

## Usage

```javascript
const { DieType, roll } = require("@platonic-dice/core");

// Use as enum
const result = roll(DieType.D20);

// Or as string (TypeScript will validate)
const result2 = roll("d20");
```

## API

### Enum Values

```typescript
enum DieType {
  D4 = "d4",
  D6 = "d6",
  D8 = "d8",
  D10 = "d10",
  D12 = "d12",
  D20 = "d20",
}
```

### Type Definition

```typescript
type DieTypeValue = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";
```

## Supported Dice

| Die Type      | Sides | Common Usage                                         |
| ------------- | ----- | ---------------------------------------------------- |
| `DieType.D4`  | 4     | Damage (dagger, healing), small ranges               |
| `DieType.D6`  | 6     | Damage (shortsword), ability scores, general purpose |
| `DieType.D8`  | 8     | Damage (longsword), hit dice for medium classes      |
| `DieType.D10` | 10    | Damage (heavy weapons), hit dice for martial classes |
| `DieType.D12` | 12    | Damage (greataxe), hit dice for barbarian            |
| `DieType.D20` | 20    | Attack rolls, ability checks, saving throws          |

## Examples

### Basic Usage

```javascript
const { DieType, roll } = require("@platonic-dice/core");

// Using enum (recommended)
const d20Roll = roll(DieType.D20);
const d6Roll = roll(DieType.D6);

// Using string literal
const d8Roll = roll("d8");
```

### Iterating Over Die Types

```javascript
const { DieType, roll } = require("@platonic-dice/core");

// Roll each die type
Object.values(DieType).forEach((die) => {
  const result = roll(die);
  console.log(`${die}: ${result}`);
});
```

### Dynamic Die Selection

```javascript
function rollBySize(size) {
  const dieMap = {
    small: DieType.D4,
    medium: DieType.D8,
    large: DieType.D12,
  };

  return roll(dieMap[size]);
}

const damage = rollBySize("medium"); // Rolls d8
```

## Notes

- **D100 is NOT supported** - This package explicitly excludes percentile dice
- All die types are lowercase strings (e.g., `"d20"`, not `"D20"`)
- The enum provides autocomplete in IDEs and type safety in TypeScript
- String literals work at runtime, but TypeScript will validate them

## Common Patterns

### Weapon Damage by Size

```javascript
const weaponDamage = {
  dagger: DieType.D4,
  shortsword: DieType.D6,
  longsword: DieType.D8,
  greataxe: DieType.D12,
};
```

### Class Hit Dice

```javascript
const hitDice = {
  wizard: DieType.D6,
  rogue: DieType.D8,
  fighter: DieType.D10,
  barbarian: DieType.D12,
};
```

## See Also

- [`roll`](../roll.md) - Roll a single die
- [`rollDice`](../rollDice.md) - Roll multiple dice
- [`Outcome`](./Outcome.md) - Test result outcomes
