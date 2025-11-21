# RollModifier

A class for encapsulating roll modification functions with optional descriptions.

## Overview

`RollModifier` wraps a modifier function and provides an optional description for debugging and logging purposes. While functions work directly, the class adds metadata and semantic clarity.

## Usage

```javascript
const { RollModifier, rollMod, DieType } = require("@platonic-dice/core");

// Create modifier
const proficiencyBonus = new RollModifier(
  (n) => n + 3,
  "Proficiency Bonus (+3)"
);

// Use with rollMod
const result = rollMod(DieType.D20, proficiencyBonus);
```

## API

### Constructor

```typescript
new RollModifier(
  modifierFn: (baseValue: number) => number,
  description?: string
)
```

### Properties

```typescript
class RollModifier {
  modifierFn: (baseValue: number) => number;
  description?: string;
}
```

## Examples

### Basic Modifier

```javascript
const { RollModifier, rollMod, DieType } = require("@platonic-dice/core");

const attackBonus = new RollModifier(
  (n) => n + 5,
  "Attack Bonus (+3 STR, +2 Proficiency)"
);

const attack = rollMod(DieType.D20, attackBonus);
console.log(`${attack.base} + 5 = ${attack.modified}`);
```

### Conditional Modifier

```javascript
const grazingHit = new RollModifier((n) => Math.max(n, 5), "Minimum 5 damage");

const damage = rollMod(DieType.D8, grazingHit);
// Even if you roll 1, damage is at least 5
```

### Stacking Modifiers

```javascript
function combineModifiers(...modifiers) {
  return new RollModifier(
    (n) => {
      return modifiers.reduce((acc, mod) => mod.modifierFn(acc), n);
    },
    modifiers
      .map((m) => m.description)
      .filter(Boolean)
      .join(" + ")
  );
}

const abilityMod = new RollModifier((n) => n + 3, "STR +3");
const proficiency = new RollModifier((n) => n + 4, "Proficiency +4");
const magicWeapon = new RollModifier((n) => n + 1, "Magic Weapon +1");

const totalMod = combineModifiers(abilityMod, proficiency, magicWeapon);
// Description: "STR +3 + Proficiency +4 + Magic Weapon +1"
```

### Debugging with Descriptions

```javascript
const modifiers = [
  new RollModifier((n) => n + 2, "Bless"),
  new RollModifier((n) => n + 4, "Bardic Inspiration"),
  new RollModifier((n) => n - 2, "Exhaustion Penalty"),
];

modifiers.forEach((mod) => {
  const result = rollMod(DieType.D20, mod);
  console.log(`${mod.description}: ${result.base} → ${result.modified}`);
});
```

## Use Cases

### Named Bonuses System

```javascript
class BonusLibrary {
  static proficiency(level) {
    const bonus = Math.floor((level - 1) / 4) + 2;
    return new RollModifier((n) => n + bonus, `Proficiency +${bonus}`);
  }

  static ability(score) {
    const modifier = Math.floor((score - 10) / 2);
    return new RollModifier(
      (n) => n + modifier,
      `Ability ${modifier >= 0 ? "+" : ""}${modifier}`
    );
  }

  static bless() {
    return new RollModifier((n) => n + roll(DieType.D4), "Bless (1d4)");
  }
}

const attack = rollMod(DieType.D20, BonusLibrary.proficiency(5));
```

### Modifier Audit Trail

```javascript
class ModifierStack {
  constructor() {
    this.modifiers = [];
  }

  add(modifier) {
    this.modifiers.push(modifier);
    return this;
  }

  apply(baseValue) {
    let current = baseValue;
    const steps = [];

    this.modifiers.forEach((mod) => {
      const before = current;
      current = mod.modifierFn(current);
      steps.push({
        description: mod.description || "Anonymous",
        before,
        after: current,
        change: current - before,
      });
    });

    return { final: current, steps };
  }
}

// Usage
const stack = new ModifierStack()
  .add(new RollModifier((n) => n + 5, "Base Bonus"))
  .add(new RollModifier((n) => n + 2, "Magic Item"))
  .add(new RollModifier((n) => n - 3, "Penalty"));

const result = stack.apply(12);
console.log(`Final: ${result.final}`);
result.steps.forEach((step) => {
  console.log(`  ${step.description}: ${step.before} → ${step.after}`);
});
```

## Notes

- The `description` field is optional but highly recommended
- Modifier functions receive the current value and return the modified value
- Can be chained by composing multiple functions
- Works with all roll functions that accept modifiers
- Pure modifier functions also work without the class wrapper

## See Also

- [`rollMod`](../rollMod.md) - Single die with modifier
- [`rollDiceMod`](../rollDiceMod.md) - Multiple dice with modifier
- [`rollModTest`](../rollModTest.md) - Modified roll with test
