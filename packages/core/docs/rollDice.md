# rollDice

Rolls multiple dice of the same type and returns both individual results and their sum.

## Overview

`rollDice` rolls multiple dice in a single call and returns an object containing both the array of individual die results and their total sum. This is the primary function when you need to see each die's value separately while also having quick access to the total.

## Usage

```javascript
const { rollDice, DieType } = require("@platonic-dice/core");

// Roll 3d6
const result = rollDice(DieType.D6, { count: 3 });
console.log(result.array); // e.g., [4, 2, 6]
console.log(result.sum); // e.g., 12

// Using convenience aliases
const { roll3x } = require("@platonic-dice/core");
const threeD6 = roll3x(DieType.D6);
console.log(threeD6.array); // e.g., [5, 3, 4]
```

## API

### Function Signature

```typescript
rollDice(
  dieType: DieTypeValue,
  options?: { count?: number }
): { array: number[], sum: number }
```

### Parameters

- **dieType**: The type of die to roll (`DieType.D4` through `DieType.D20`)
- **options** _(optional)_: Configuration object
  - **count**: Number of dice to roll (default: 1, must be positive integer)

### Returns

`{ array: number[], sum: number }` - Object containing:

- **array**: Array of individual die roll results
- **sum**: Total sum of all dice

### Convenience Aliases

`rollDice` provides convenient aliases for common counts:

```javascript
const {
  roll2x,
  roll3x,
  roll4x,
  roll5x,
  roll6x,
  roll8x,
  roll10x,
} = require("@platonic-dice/core");

// Roll 2d6
const result = roll2x(DieType.D6);

// Roll 8d6 (fireball)
const fireball = roll8x(DieType.D6);
```

Available aliases: `roll2x`, `roll3x`, `roll4x`, `roll5x`, `roll6x`, `roll7x`, `roll8x`, `roll9x`, `roll10x`, `roll25x`, `roll50x`, `roll100x`

## Examples

### Basic Multiple Dice

```javascript
// Roll 3d6
const result = rollDice(DieType.D6, { count: 3 });
console.log(result.array); // e.g., [4, 2, 6]
console.log(result.sum); // e.g., 12

// Roll different die types
const d8s = rollDice(DieType.D8, { count: 4 });
const d20s = rollDice(DieType.D20, { count: 2 });

// Single die (returns array with one element)
const singleDie = rollDice(DieType.D12, { count: 1 });
const defaultCount = rollDice(DieType.D20); // count defaults to 1
```

### Using Convenience Aliases

```javascript
// Common aliases
const twoD6 = roll2x(DieType.D6);
const threeD6 = roll3x(DieType.D6);
const fourD6 = roll4x(DieType.D6);

// Larger quantities
const eightD6 = roll8x(DieType.D6);
const tenD6 = roll10x(DieType.D6);
const twentyFiveD6 = roll25x(DieType.D6);

// Very large rolls
const fiftyD6 = roll50x(DieType.D6);
console.log(`50d6 sum: ${fiftyD6.sum}`);

const hundredD6 = roll100x(DieType.D6);
console.log(`100d6 sum: ${hundredD6.sum}`);
```

### Accessing Individual Dice

```javascript
// Working with the returned array
const pool = roll6x(DieType.D6);
console.log(pool.array); // e.g., [4, 2, 6, 3, 5, 1]
console.log(pool.array[0]); // First die
console.log(pool.array.length); // Number of dice
console.log(pool.sum); // Total

// Finding highest and lowest
const manyDice = roll10x(DieType.D6);
const highest = Math.max(...manyDice.array);
const lowest = Math.min(...manyDice.array);
const average = manyDice.sum / manyDice.array.length;
```

### Multiple Separate Rolls

```javascript
// Rolling the same dice multiple times
const roll1 = roll2x(DieType.D6);
const roll2 = roll2x(DieType.D6);
const roll3 = roll2x(DieType.D6);

// Different quantities of same die type
const one = rollDice(DieType.D20, { count: 1 });
const two = roll2x(DieType.D20);
const three = roll3x(DieType.D20);
const four = roll4x(DieType.D20);
```

## Notes

- Returns `{ array, sum }` object for convenient access to both individual dice and total
- Default count is 1 if not specified
- Each die in the array is rolled independently
- Convenience aliases (`roll2x`, `roll3x`, etc.) are cleaner than passing count option
- Use this for basic multi-die rolling and accessing individual dice values
- For **damage with modifiers**, use [`rollDiceMod`](./rollDiceMod.md) instead
- For **single die** rolls, use [`roll`](./roll.md)

## See Also

- [`roll`](./roll.md) - Roll a single die
- [`rollDiceMod`](./rollDiceMod.md) - Roll multiple dice with modifiers (use this for damage calculations)
- [`rollMod`](./rollMod.md) - Roll single die with modifiers
- [`DieType`](./entities/DieType.md) - Die type enumeration
