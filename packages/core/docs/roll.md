# roll

Rolls a single die and returns the result.

## Overview

`roll` is the most basic dice rolling function. It rolls a single die of the specified type and optionally applies advantage or disadvantage mechanics.

## Usage

```javascript
const { roll, DieType, RollType } = require("@platonic-dice/core");

// Basic roll
const result = roll(DieType.D20);
console.log(result); // e.g., 14

// Roll with advantage
const advantageRoll = roll(DieType.D20, RollType.Advantage);
console.log(advantageRoll); // e.g., 18 (higher of two rolls)
```

## API

### Function Signature

```typescript
roll(
  dieType: DieTypeValue,
  rollType?: RollTypeValue
): number
```

### Parameters

- **dieType**: The type of die to roll

  - `DieType.D4` - Four-sided die (1-4)
  - `DieType.D6` - Six-sided die (1-6)
  - `DieType.D8` - Eight-sided die (1-8)
  - `DieType.D10` - Ten-sided die (1-10)
  - `DieType.D12` - Twelve-sided die (1-12)
  - `DieType.D20` - Twenty-sided die (1-20)

- **rollType** _(optional)_: How to roll the die
  - `undefined` - Standard single roll (default)
  - `RollType.Advantage` - Roll twice, return higher value
  - `RollType.Disadvantage` - Roll twice, return lower value

### Returns

`number` - The result of the die roll

### Convenience Aliases

`roll` provides convenient aliases for common use cases:

**Roll Type Aliases:**

```javascript
const { rollAdv, rollDis } = require("@platonic-dice/core");

// Roll with advantage
const advantageResult = rollAdv(DieType.D20);

// Roll with disadvantage
const disadvantageResult = rollDis(DieType.D20);
```

**Die Type Aliases:**

```javascript
const {
  rollD4,
  rollD6,
  rollD8,
  rollD10,
  rollD12,
  rollD20,
} = require("@platonic-dice/core");

// Roll specific die types directly
const d6 = rollD6();
const d20 = rollD20();

// Die type aliases also accept RollType
const d20Adv = rollD20(RollType.Advantage);
const d20Dis = rollD20(RollType.Disadvantage);
```

Available die type aliases: `rollD4`, `rollD6`, `rollD8`, `rollD10`, `rollD12`, `rollD20`

## Examples

### Basic Rolls

```javascript
// Standard d20 roll
const d20 = roll(DieType.D20);
// Returns: 1-20

// Standard d6 roll
const d6 = roll(DieType.D6);
// Returns: 1-6

// Using die type aliases
const d8 = rollD8();
const d12 = rollD12();
```

### Advantage and Disadvantage

```javascript
// Roll with advantage (takes higher of two rolls)
const withAdvantage = roll(DieType.D20, RollType.Advantage);
// Internally: rolls 14 and 18, returns 18

// Roll with disadvantage (takes lower of two rolls)
const withDisadvantage = roll(DieType.D20, RollType.Disadvantage);
// Internally: rolls 14 and 7, returns 7

// Using rollType aliases
const advResult = rollAdv(DieType.D20);
const disResult = rollDis(DieType.D20);

// Combining die type and roll type aliases
const d20Adv = rollD20(RollType.Advantage);
const d20Dis = rollD20(RollType.Disadvantage);
```

### All Die Types

```javascript
// Using roll()
roll(DieType.D4); // 1-4
roll(DieType.D6); // 1-6
roll(DieType.D8); // 1-8
roll(DieType.D10); // 1-10
roll(DieType.D12); // 1-12
roll(DieType.D20); // 1-20

// Using die type aliases
rollD4(); // 1-4
rollD6(); // 1-6
rollD8(); // 1-8
rollD10(); // 1-10
rollD12(); // 1-12
rollD20(); // 1-20
```

## Use Cases

### Simple Ability Score Generation

```javascript
// Roll 4d6, drop lowest (common D&D method)
function rollAbilityScore() {
  const rolls = [
    roll(DieType.D6),
    roll(DieType.D6),
    roll(DieType.D6),
    roll(DieType.D6),
  ];
  rolls.sort((a, b) => a - b);
  rolls.shift(); // Remove lowest
  return rolls.reduce((sum, val) => sum + val, 0);
}

const strength = rollAbilityScore();
console.log(`Strength: ${strength}`);
```

### Basic Damage Roll

```javascript
// Weapon damage
const swordDamage = roll(DieType.D8);
console.log(`Sword deals ${swordDamage} damage`);

// Critical hit (double damage dice)
const critDamage = roll(DieType.D8) + roll(DieType.D8);
console.log(`Critical hit! ${critDamage} damage`);
```

### Random Encounters

```javascript
// d6 for number of enemies
const enemyCount = roll(DieType.D6);

// d20 for initiative
const initiative = roll(DieType.D20, RollType.Advantage);
console.log(`${enemyCount} enemies, initiative ${initiative}`);
```

## Notes

- All rolls use JavaScript's `Math.random()` for randomization
- Results are always integers within the die's range
- Advantage/disadvantage rolls twice internally but returns a single value
- Convenience aliases (`rollAdv`, `rollDis`, `rollD4`-`rollD20`) provide cleaner syntax
- For multiple independent rolls, use [`rollDice`](./rollDice.md)
- For rolls with modifiers, use [`rollMod`](./rollMod.md)
- For rolls with test conditions, use [`rollTest`](./rollTest.md)

## See Also

- [`rollDice`](./rollDice.md) - Roll multiple dice at once
- [`rollMod`](./rollMod.md) - Roll with modifiers (bonuses/penalties)
- [`rollTest`](./rollTest.md) - Roll with pass/fail evaluation
- [`DieType`](./entities/DieType.md) - Die type enumeration
- [`RollType`](./entities/RollType.md) - Roll type enumeration (advantage/disadvantage)
