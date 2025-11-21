# rollDiceMod

Rolls multiple dice with modifiers and returns the base rolls plus modified values.

## Overview

`rollDiceMod` combines the multiple-dice rolling of [`rollDice`](./rollDice.md) with the modifier support of [`rollMod`](./rollMod.md). While `rollDice` returns just `{ array, sum }` and `rollMod` handles single-die modifiers, `rollDiceMod` supports both **per-die** (`each`) and **total** (`net`) modifiers across multiple dice.

This is essential for damage calculations where you need to modify individual dice (like magical weapon effects) or apply bonuses to the total (like ability score modifiers).

## Usage

```javascript
const { rollDiceMod, DieType } = require("@platonic-dice/core");

// Roll 3d6 with +2 to total (common damage: 3d6+2)
const damage = rollDiceMod(DieType.D6, (sum) => sum + 2, { count: 3 });
console.log(damage.base); // { array: [4, 2, 5], sum: 11 }
console.log(damage.modified.net.value); // 13

// Using the net alias for quick access
const { rollDiceModNet } = require("@platonic-dice/core");
const total = rollDiceModNet(DieType.D6, (sum) => sum + 2, { count: 3 });
console.log(total); // 13
```

## API

### Function Signature

```typescript
rollDiceMod(
  dieType: DieTypeValue,
  modifier?: ModifierInput,
  options?: { count?: number }
): {
  base: { array: number[], sum: number },
  modified: {
    each: { array: number[], sum: number },
    net: { value: number }
  }
}
```

### Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`)
- **modifier** _(optional)_: How to modify the rolls
  - **Function** `(sum) => number` - Applied to total (net modifier)
  - **Object** `{ each?, net? }` - Separate per-die and total modifiers
    - `each: (n) => number` - Applied to each individual die
    - `net: (sum) => number` - Applied to the sum after `each`
  - **RollModifier** instance - Applied as net modifier
- **options** _(optional)_: Configuration object
  - **count**: Number of dice to roll (default: 1, must be positive integer)

### Returns

```typescript
{
  base: { array: number[], sum: number },
  modified: {
    each: { array: number[], sum: number },
    net: { value: number }
  }
}
```

- **base**: Original rolls before any modifiers
  - `array`: Individual die results
  - `sum`: Total of base rolls
- **modified**: All modified values
  - **each**: Results after per-die modifier
    - `array`: Modified individual dice
    - `sum`: Sum of modified dice
  - **net**: Final result after net modifier
    - `value`: The final total

### Convenience Aliases

`rollDiceMod` provides two aliases for quick access to commonly-needed values:

```javascript
const { rollDiceModArr, rollDiceModNet } = require("@platonic-dice/core");

// Get modified dice array only
const modifiedDice = rollDiceModArr(
  DieType.D6,
  { each: (n) => n + 1 },
  { count: 3 }
);
console.log(modifiedDice); // [5, 3, 7] (just the array)

// Get final total only (most common for damage)
const total = rollDiceModNet(DieType.D6, (sum) => sum + 3, { count: 3 });
console.log(total); // 16 (just the number)
```

**Available aliases:**

- `rollDiceModArr` - Returns `modified.each.array` (modified dice array)
- `rollDiceModNet` - Returns `modified.net.value` (final total)

## Examples

### How rollDiceMod Builds on Other Functions

```javascript
// roll() returns a simple number
const oneD20 = roll(DieType.D20);
// 14

// rollMod() adds modifier to single die, returns { base, modified }
const modifiedD20 = rollMod(DieType.D20, (n) => n + 5);
// { base: 14, modified: 19 }

// rollDice() rolls multiple dice, returns { array, sum }
const manyD6 = rollDice(DieType.D6, { count: 3 });
// { array: [4, 2, 5], sum: 11 }

// rollDiceMod() combines both: multiple dice with modifiers
const damage = rollDiceMod(DieType.D6, (sum) => sum + 2, { count: 3 });
// {
//   base: { array: [4, 2, 5], sum: 11 },
//   modified: {
//     each: { array: [4, 2, 5], sum: 11 },
//     net: { value: 13 }
//   }
// }
```

### Net Modifier Only (Most Common)

```javascript
// Single function = net modifier (added to total)
const damage = rollDiceMod(DieType.D6, (sum) => sum + 3, { count: 3 });
console.log(damage.base.sum); // e.g., 11
console.log(damage.modified.net.value); // e.g., 14 (11 + 3)

// Using alias for quick access
const total = rollDiceModNet(DieType.D6, (sum) => sum + 3, { count: 3 });
console.log(total); // 14

// Common D&D damage rolls
const swordDamage = rollDiceModNet(DieType.D6, (sum) => sum + 3, { count: 2 }); // 2d6+3
const fireballDamage = rollDiceModNet(DieType.D6, (sum) => sum, { count: 8 }); // 8d6
```

### Both Each and Net Modifiers

```javascript
// Per-die modifier AND total modifier
const result = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n + 1, // +1 to each die
    net: (sum) => sum + 2, // +2 to total
  },
  { count: 3 }
);

console.log(result.base); // { array: [3, 1, 4], sum: 8 }
console.log(result.modified.each); // { array: [4, 2, 5], sum: 11 }
console.log(result.modified.net); // { value: 13 }

// Example: Magical weapon that adds 1 to each die, plus STR bonus
const magicDamage = rollDiceMod(
  DieType.D8,
  {
    each: (n) => n + 1, // Magic weapon effect
    net: (sum) => sum + 3, // STR modifier
  },
  { count: 2 }
);
```

### Each Modifier Only

```javascript
// Only modify individual dice
const result = rollDiceMod(
  DieType.D6,
  {
    each: (n) => Math.max(n, 2), // Minimum 2 on each die
  },
  { count: 4 }
);

// Using alias to get just the modified array
const minDice = rollDiceModArr(
  DieType.D6,
  { each: (n) => Math.max(n, 2) },
  { count: 4 }
);
console.log(minDice); // e.g., [3, 2, 5, 2]
```

### Multiplicative Modifiers

```javascript
// Double the total damage (critical hit)
const critDamage = rollDiceModNet(DieType.D8, (sum) => sum * 2, { count: 2 });

// Critical with ability modifier (don't multiply the modifier)
const critWithBonus = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n * 2, // Double each die
    net: (sum) => sum + 4, // Then add STR (not doubled)
  },
  { count: 2 }
);
```

### Complex Example: Elemental Weapon

```javascript
// Weapon: 2d6 base
// Each die gets +1 (enchantment)
// Total gets +3 (STR) and +1d4 (magic bonus)
const { roll } = require("@platonic-dice/core");

const magicD4 = roll(DieType.D4); // Roll separately
const weaponDamage = rollDiceMod(
  DieType.D6,
  {
    each: (n) => n + 1, // Enchantment
    net: (sum) => sum + 3 + magicD4, // STR + magic
  },
  { count: 2 }
);

console.log(`Base: ${weaponDamage.base.sum}`);
console.log(`After enchantment: ${weaponDamage.modified.each.sum}`);
console.log(`Final damage: ${weaponDamage.modified.net.value}`);
```

## Practical Use Cases

### Basic Weapon Damage

```javascript
// Longsword: 1d8 + 3 (STR)
const longsword = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 1 });

// Greatsword: 2d6 + 4 (STR)
const greatsword = rollDiceModNet(DieType.D6, (sum) => sum + 4, { count: 2 });

// Dagger: 1d4 + 2 (DEX)
const dagger = rollDiceModNet(DieType.D4, (sum) => sum + 2, { count: 1 });
```

### Spell Damage

```javascript
// Fireball: 8d6
const fireball = rollDiceModNet(DieType.D6, (sum) => sum, { count: 8 });

// Magic Missile: 3 darts of 1d4+1 each
const dart1 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
const dart2 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
const dart3 = rollDiceModNet(DieType.D4, (sum) => sum + 1, { count: 1 });
const totalMagicMissile = dart1 + dart2 + dart3;
```

### Critical Hits

```javascript
// Normal hit: 1d8 + 3
const normalHit = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 1 });

// Critical hit: 2d8 + 3 (double dice, not modifier)
const criticalHit = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 2 });

// Alternative: Using each modifier to show doubled dice clearly
const critAlt = rollDiceMod(
  DieType.D8,
  {
    each: (n) => n, // Keep dice as-is (or could double here)
    net: (sum) => sum + 3, // Add modifier once
  },
  { count: 2 }
);
```

### Sneak Attack Damage

```javascript
// Rogue hits with dagger + sneak attack
// 1d4 (weapon) + 3 (DEX) + 3d6 (sneak attack)
const weaponDmg = rollDiceModNet(DieType.D4, (sum) => sum + 3, { count: 1 });
const sneakDmg = rollDiceModNet(DieType.D6, (sum) => sum, { count: 3 });
const totalDamage = weaponDmg + sneakDmg;

console.log(`Weapon: ${weaponDmg}`);
console.log(`Sneak Attack: ${sneakDmg}`);
console.log(`Total: ${totalDamage}`);
```

### Healing Spells

```javascript
// Cure Wounds: 1d8 + 3 (spell mod)
const healing = rollDiceModNet(DieType.D8, (sum) => sum + 3, { count: 1 });

// Mass Cure Wounds: 3d8 + 4
const massHealing = rollDiceModNet(DieType.D8, (sum) => sum + 4, { count: 3 });
```

## Notes

- **Builds on [`rollDice`](./rollDice.md) and [`rollMod`](./rollMod.md)**: Combines multiple dice with modifier support
- Returns full structure with base and modified values at each step
- **Single function** passed as modifier becomes a **net** modifier (most common)
- **Object with `each` and `net`** allows granular control over modification stages
- Use `rollDiceModNet` alias for quick damage calculations (most common case)
- Use `rollDiceModArr` alias when you need the modified dice array
- For **single die with modifier**, use [`rollMod`](./rollMod.md) instead
- For **multiple dice without modifiers**, use [`rollDice`](./rollDice.md) instead
- Does not support advantage/disadvantage (use [`roll`](./roll.md) or [`rollMod`](./rollMod.md) for that)

## See Also

- [`roll`](./roll.md) - Roll a single die (supports advantage/disadvantage)
- [`rollMod`](./rollMod.md) - Roll single die with modifiers
- [`rollDice`](./rollDice.md) - Roll multiple dice without modifiers
- [`DieType`](./entities/DieType.md) - Die type enumeration
- [`RollModifier`](./entities/RollModifier.md) - Modifier class
