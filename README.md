# Platonic Dice

_A flexible and extensible JavaScript library for simulating tabletop RPG dice rolls._

## Overview

**Platonic Dice** is a JavaScript library designed to model and simulate dice rolling mechanics commonly used in tabletop role-playing games (TTRPGs), such as _Dungeons & Dragons_. It provides a robust API to handle standard dice rolls, advantage/disadvantage mechanics, target-based success checks, and more.

Whether you need a simple dice roller, a way to track roll history, or an extensible library to integrate with your own gaming applications, **Platonic Dice** is built for flexibility and ease of use.

---

## Features

✅ **Full TTRPG Dice Support** – Supports d4, d6, d8, d10, d12, d20 rolls.  
✅ **Advantage & Disadvantage Rolls** – Implements rolling mechanics for TTRPG rules.  
✅ **Persistent Dice Objects** – Track roll history for each die instance.  
✅ **Custom Dice** – Define custom faces with unique outcomes.  
✅ **Target-Based Rolling** – Test against predefined success/failure conditions.  
✅ **Modifier Functions** – Apply transformations to dice rolls dynamically.  
✅ **Library-Friendly** – Designed for easy import and use in other applications.

---

## Installation

To install via **npm**, run:

```bash
npm install platonic-dice
```

Or via **yarn**:

```bash
yarn add platonic-dice
```

---

## Usage Examples

### 1️⃣ Basic Dice Rolls

```javascript
const { rollDie, rollDice } = require("platonic-dice");

console.log(rollDie("d20")); // Rolls a single d20
console.log(rollDice("d6", { count: 3 })); // Rolls three d6 dice
```

### 2️⃣ Rolling with Advantage/Disadvantage

```javascript
const { RollType } = require("platonic-dice");

console.log(rollDie("d20", RollType.Advantage)); // Rolls with advantage
console.log(rollDie("d20", RollType.Disadvantage)); // Rolls with disadvantage
```

### 3️⃣ Persistent Dice Instances

```javascript
const { Die } = require("platonic-dice");

const myDie = new Die("d12");
console.log(myDie.roll()); // Roll the die
console.log(myDie.history); // View roll history
console.log(myDie.toJSON()); // Get a JSON representation
```

### 4️⃣ Applying Modifiers to Rolls

```javascript
const { ModifiedDie } = require("platonic-dice");

const addTwoModifier = (roll) => roll + 2;
const modDie = new ModifiedDie("d10", addTwoModifier);

console.log(modDie.roll()); // Rolls d10 and adds 2 to result
console.log(modDie.modifiedHistory); // Check modified roll history
```

### 5️⃣ Target-Based Rolling (Success/Failure)

```javascript
const { TargetDie } = require("platonic-dice");

const targetDie = new TargetDie("d20", [18, 19, 20]); // Success on 18+
console.log(targetDie.roll()); // Rolls and checks success/failure
console.log(targetDie.getHistory()); // View full roll history
```

### 6️⃣ Custom Dice with Face Mapping

```javascript
const { CustomDie } = require("platonic-dice");

const faceMappings = {
  1: () => "Critical Failure",
  20: () => "Critical Success",
};

const customDie = new CustomDie("d20", faceMappings, () => "Normal Roll");
console.log(customDie.roll()); // Rolls and maps result
console.log(customDie.report(true)); // View detailed roll report
```

### 7️⃣ Test Dice with Critical Success/Failure

```javascript
const { TestDie, TestConditions } = require("platonic-dice");

const testConditions = new TestConditions(10, 18, 2); // Success at 10+, Crit at 18+, Fail at 2-
const testDie = new TestDie("d20", testConditions);

console.log(testDie.roll()); // Rolls and evaluates success/failure
console.log(testDie.report()); // View latest roll result and outcome
```

---

## Development Roadmap

✅ **Core Dice Functionality** – Standard rolls, advantage/disadvantage, roll history.  
✅ **Target-Based & Test Rolls** – Rolling against thresholds with outcomes.  
🔲 **Dice Pools & Multiple Dice Mechanics** – Implement grouped rolls with different conditions.  
🔲 **Optional UI Component** – Develop a visual dice roller for web apps.

---

## Contributing

Want to contribute? Here’s how:

1. **Fork the repo** and create your feature branch (`git checkout -b feature-name`).
2. **Make your changes** and commit (`git commit -m "Add new feature"`).
3. **Push to your branch** (`git push origin feature-name`).
4. **Submit a Pull Request** for review.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

🚀 **Ready to roll some dice? Let’s play!** 🎲
