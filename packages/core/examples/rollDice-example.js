const {
  rollDice,
  roll2x,
  roll3x,
  roll4x,
  roll5x,
  roll6x,
  roll7x,
  roll8x,
  roll9x,
  roll10x,
  roll25x,
  roll50x,
  roll100x,
  DieType,
} = require("..");

console.log("=== Basic rollDice Usage ===\n");

// Rolling multiple dice
console.log("--- Rolling 3d6 ---");
const result = rollDice(DieType.D6, { count: 3 });
console.log("Individual dice:", result.array);
console.log("Sum:", result.sum);
console.log();

// Rolling different die types
console.log("--- Different Die Types ---");
console.log("4d8:", rollDice(DieType.D8, { count: 4 }));
console.log("2d20:", rollDice(DieType.D20, { count: 2 }));
console.log("5d4:", rollDice(DieType.D4, { count: 5 }));
console.log();

// Single die (returns array with one element)
console.log("--- Single Die ---");
console.log("1d12:", rollDice(DieType.D12, { count: 1 }));
console.log("1d20 (default count):", rollDice(DieType.D20));
console.log();

console.log("\n=== Convenience Aliases ===\n");

// roll2x through roll10x
console.log("--- Common Aliases ---");
console.log("roll2x(D6):", roll2x(DieType.D6));
console.log("roll3x(D6):", roll3x(DieType.D6));
console.log("roll4x(D6):", roll4x(DieType.D6));
console.log("roll5x(D8):", roll5x(DieType.D8));
console.log("roll6x(D10):", roll6x(DieType.D10));
console.log();

// Larger quantities
console.log("--- Larger Quantities ---");
console.log("roll8x(D6):", roll8x(DieType.D6));
console.log("roll10x(D6):", roll10x(DieType.D6));
console.log("roll25x(D6):", roll25x(DieType.D6));
console.log();

// Very large rolls
console.log("--- Very Large Rolls ---");
const fiftyD6 = roll50x(DieType.D6);
console.log(
  "roll50x(D6) sum:",
  fiftyD6.sum,
  "(array length:",
  fiftyD6.array.length,
  ")"
);

const hundredD6 = roll100x(DieType.D6);
console.log(
  "roll100x(D6) sum:",
  hundredD6.sum,
  "(array length:",
  hundredD6.array.length,
  ")"
);
console.log();

console.log("\n=== Accessing Individual Dice ===\n");

// Working with the returned array
const pool = roll6x(DieType.D6);
console.log("--- 6d6 Pool ---");
console.log("All dice:", pool.array);
console.log("First die:", pool.array[0]);
console.log("Last die:", pool.array[pool.array.length - 1]);
console.log("Number of dice:", pool.array.length);
console.log("Sum:", pool.sum);
console.log();

// Finding specific values
const manyDice = roll10x(DieType.D6);
console.log("--- 10d6 Analysis ---");
console.log("Dice:", manyDice.array);
console.log("Highest:", Math.max(...manyDice.array));
console.log("Lowest:", Math.min(...manyDice.array));
console.log("Sum:", manyDice.sum);
console.log("Average:", (manyDice.sum / manyDice.array.length).toFixed(2));
console.log();

console.log("\n=== Multiple Rolls ===\n");

// Rolling the same dice multiple times
console.log("--- Three Separate 2d6 Rolls ---");
console.log("Roll 1:", roll2x(DieType.D6));
console.log("Roll 2:", roll2x(DieType.D6));
console.log("Roll 3:", roll2x(DieType.D6));
console.log();

// Different quantities of same die type
console.log("--- Various Quantities of d20 ---");
console.log("1d20:", rollDice(DieType.D20, { count: 1 }));
console.log("2d20:", roll2x(DieType.D20));
console.log("3d20:", roll3x(DieType.D20));
console.log("4d20:", roll4x(DieType.D20));
console.log();
