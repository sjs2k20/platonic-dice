# rollMod

Rolls a single die with a modifier and returns both the base and modified values.

## Overview

`rollMod` builds on [`roll`](./roll.md) by adding modifier support. While `roll` returns a simple number, `rollMod` applies a transformation (bonus, penalty, or multiplication) and returns both the original roll and the modified result.

This is useful when you need to track both values separately, such as for game logging or determining if a modifier made the difference between success and failure.

## Usage

```javascript
const {
  rollMod,
  rollD20P5,
  DieType,
  RollType,
} = require("@platonic-dice/core");

// Using rollMod - returns both base and modified
const result = rollMod(DieType.D20, (n) => n + 5);
console.log(result); // { base: 14, modified: 19 }

// Using alias - returns only modified value
const attack = rollD20P5();
console.log(attack); // 19

// With advantage
const advantageAttack = rollD20P5(RollType.Advantage);
```

## API

### Function Signature

```typescript
rollMod(
  dieType: DieTypeValue,
  modifier: RollModifierFunction | RollModifierInstance,
  rollType?: RollTypeValue
): { base: number, modified: number }
```

### Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`)
- **modifier**: Function `(n) => number` or `RollModifier` instance
  - Takes the base roll as input
  - Returns the modified value
  - Can be addition, subtraction, multiplication, or any transformation
- **rollType** _(optional)_: How to roll the die
  - `undefined` - Standard roll (default)
  - `RollType.Advantage` - Roll twice, use higher base value
  - `RollType.Disadvantage` - Roll twice, use lower base value

### Returns

`{ base: number, modified: number }` - Object containing:

- **base**: The original die roll (before modifier)
- **modified**: The result after applying the modifier function

### Convenience Aliases

`rollMod` provides extensive aliases that return only the modified value:

**Plus Modifiers** (P1 through P10):

```javascript
const { rollD20P5, rollD6P3, rollD8P4 } = require("@platonic-dice/core");

// Returns modified value only
rollD20P5(); // d20 + 5
rollD6P3(); // d6 + 3
rollD8P4(); // d8 + 4

// Works with all die types: D4, D6, D8, D10, D12, D20
rollD4P2(); // d4 + 2
rollD12P5(); // d12 + 5

// All accept RollType for advantage/disadvantage
rollD20P7(RollType.Advantage); // (d20 with advantage) + 7
```

**Minus Modifiers** (M1 through M10):

```javascript
const { rollD20M2, rollD20M3 } = require("@platonic-dice/core");

rollD20M2(); // d20 - 2
rollD20M3(); // d20 - 3
```

**Times Modifiers** (T2, T3, T5, T10, T50, T100):

```javascript
const { rollD6T2, rollD10T10, rollD10T100 } = require("@platonic-dice/core");

rollD6T2(); // d6 × 2
rollD10T10(); // d10 × 10 (10-100)
rollD10T100(); // d10 × 100 (100-1000)
```

**Available Patterns:**

- Plus: `rollD[4|6|8|10|12|20]P[1-10]`
- Minus: `rollD[4|6|8|10|12|20]M[1-10]`
- Times: `rollD[4|6|8|10|12|20]T[2|3|5|10|50|100]`

All aliases accept optional `RollType` parameter and return only the modified value (not the full object).

## Examples

### How rollMod Builds on roll

```javascript
// roll() returns a simple number
const simpleRoll = roll(DieType.D20);
console.log(simpleRoll); // 14

// rollMod() returns base AND modified
const modifiedRoll = rollMod(DieType.D20, (n) => n + 5);
console.log(modifiedRoll);
// { base: 14, modified: 19 }

// Both support advantage/disadvantage
const advRoll = rollAdv(DieType.D20); // 18
const advModRoll = rollMod(DieType.D20, (n) => n + 5, RollType.Advantage);
// { base: 18, modified: 23 }
```

### Using rollMod() for Full Details

```javascript
// When you need both values
const result = rollMod(DieType.D20, (n) => n + 5);
console.log(`Rolled ${result.base}`);
console.log(`With +5 bonus: ${result.modified}`);

if (result.modified >= 15 && result.base < 10) {
  console.log("The bonus saved you!");
}
```

### Using Aliases for Quick Rolls

```javascript
// When you only need the total
const attack = rollD20P7(); // d20 + 7
const damage = rollD8P3(); // d8 + 3
const initiative = rollD20P2(); // d20 + 2

console.log(`Attack: ${attack}`);
console.log(`Damage: ${damage}`);
console.log(`Initiative: ${initiative}`);
```

### Plus Modifiers

```javascript
// Common bonuses
rollD20P1(); // d20 + 1
rollD20P2(); // d20 + 2
rollD20P3(); // d20 + 3
rollD20P5(); // d20 + 5
rollD20P7(); // d20 + 7
rollD20P10(); // d20 + 10

// Different die types
rollD6P2(); // d6 + 2 (common damage)
rollD8P3(); // d8 + 3 (weapon damage)
rollD4P1(); // d4 + 1 (Bless spell)
```

### Minus Modifiers

```javascript
// Penalties
rollD20M1(); // d20 - 1
rollD20M2(); // d20 - 2
rollD20M3(); // d20 - 3

// With disadvantage
const cursedSave = rollD20M2(RollType.Disadvantage);
```

### Multiplicative Modifiers

```javascript
// Double dice
rollD6T2(); // d6 × 2 (critical damage)
rollD8T2(); // d8 × 2

// Large multipliers
rollD10T10(); // d10 × 10 = 10-100
rollD10T100(); // d10 × 100 = 100-1000 (treasure)
rollD20T5(); // d20 × 5 = 5-100 (percentage)
```

### Practical Use Cases

```javascript
// Attack roll
const attackRoll = rollD20P7();
console.log(`Attack: ${attackRoll}`);

// Damage roll
const damage = rollD8P3();
console.log(`Damage: ${damage} slashing`);

// Critical hit
const critDice = rollD6T2(); // Double the dice
const critTotal = critDice + 3; // Then add modifier
console.log(`Critical: ${critTotal} damage`);

// Random gold
const gold = rollD10T100();
console.log(`Found ${gold} gold pieces!`);

// Percentage check
const percentage = rollD20T5();
console.log(`Success chance: ${percentage}%`);
```

### With Advantage/Disadvantage

```javascript
// Attack with advantage
const advantageAttack = rollD20P7(RollType.Advantage);

// Save with disadvantage
const disadvantageSave = rollD20P5(RollType.Disadvantage);

// Critical with advantage
const critAdv = rollD6T2(RollType.Advantage);
```

### Multiple Rolls

```javascript
// Party initiative
console.log(`Fighter (+1): ${rollD20P1()}`);
console.log(`Rogue (+4): ${rollD20P5()}`);
console.log(`Wizard (+2): ${rollD20P2()}`);
console.log(`Cleric (+0): ${rollD20()}`);

// Multiple attacks
for (let i = 0; i < 3; i++) {
  console.log(`Attack ${i + 1}: ${rollD20P7()}`);
}
```

## Notes

- **Builds on [`roll`](./roll.md)**: Uses the same die rolling logic with modifier support
- `rollMod()` returns `{ base, modified }` object for full details
- **Convenience aliases return only the modified value** for cleaner code
- Aliases accept optional `RollType` parameter for advantage/disadvantage
- The modifier is applied AFTER advantage/disadvantage selection
- For test conditions (pass/fail), use [`rollTest`](./rollTest.md) or [`rollModTest`](./rollModTest.md)
- For multiple dice with modifiers, use [`rollDiceMod`](./rollDiceMod.md)

## When to Use rollMod vs Aliases

**Use `rollMod()` when:**

- You need to see both the base and modified values
- You want to log what was rolled before modifiers
- You need to check if the modifier made a difference
- You're using complex custom modifier functions

**Use aliases when:**

- You only need the final modified value
- You want cleaner, more readable code
- You're using standard bonuses (+1 to +10, ×2, ×10, etc.)
- You're making many quick rolls

## See Also

- [`roll`](./roll.md) - Roll without modifiers (what rollMod builds on)
- [`rollDiceMod`](./rollDiceMod.md) - Roll multiple dice with modifiers
- [`rollModTest`](./rollModTest.md) - Roll with modifiers and test conditions
- [`RollModifier`](./entities/RollModifier.md) - Modifier class documentation
- [`RollType`](./entities/RollType.md) - Roll type enumeration
