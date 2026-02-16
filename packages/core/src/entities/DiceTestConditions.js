/**
 * @module @platonic-dice/core/src/entities/DiceTestConditions
 * @description
 * Aggregates `TestConditionsArray` evaluations across multiple dice and
 * applies simple aggregation rules such as "at least N dice equal X" or
 * "at least N dice satisfy condition #k".
 */

const { TestConditionsArray } = require("./TestConditionsArray");
const { getArrayEvaluator } = require("../utils/getArrayEvaluator");
const { Outcome } = require("./Outcome");
const { DieType } = require("./DieType");

/**
 * @typedef {import("./TestConditions").TestConditionsLike} TestConditionsLike
 */

class DiceTestConditions {
  /**
   * @param {{ count: number, conditions: TestConditionsLike[]|TestConditionsArray, rules: Array<Object>, dieType?: string }} opts
   */
  constructor({ count, conditions, rules = [], dieType = undefined } = {}) {
    if (typeof count !== "number" || !Number.isInteger(count) || count < 1) {
      throw new TypeError("count must be a positive integer");
    }
    this.count = count;

    // Normalise conditions into TestConditionsArray
    if (conditions instanceof TestConditionsArray) {
      this.tcArray = conditions;
    } else if (Array.isArray(conditions)) {
      // If caller didn't supply a default die type, assume D6 for value-based
      // multi-dice tests (most common simple use-case in tests).
      const defaultDie = dieType || DieType.D6;
      this.tcArray = new TestConditionsArray(conditions, defaultDie);
    } else {
      throw new TypeError("conditions must be an array or TestConditionsArray");
    }

    // Rules are simple objects. We'll validate minimally here.
    this.rules = rules.map((r, idx) => {
      if (!r || typeof r !== "object")
        throw new TypeError(`rule ${idx} must be an object`);
      if (r.type !== "value_count" && r.type !== "condition_count")
        throw new TypeError(`unsupported rule type: ${r.type}`);
      return r;
    });
  }

  /**
   * Returns an evaluator function that accepts an array of rolled values
   * and returns an aggregated result object.
   *
   * @param {import("./RollModifier").RollModifierInstance|null} [modifier=null]
   * @param {boolean|null} [useNaturalCrits=null]
   * @returns {(rolls: number[]) => Object}
   */
  toEvaluator(modifier = null, useNaturalCrits = null) {
    const tcArray = this.tcArray;
    const arrayEvaluator = getArrayEvaluator(
      tcArray,
      modifier,
      useNaturalCrits,
    );
    const expectedCount = this.count;
    const rules = this.rules;

    return /** @param {number[]} rolls */ (rolls) => {
      if (!Array.isArray(rolls))
        throw new TypeError("rolls must be an array of numbers");
      if (rolls.length !== expectedCount)
        throw new TypeError(
          `rolls length ${rolls.length} does not match expected count ${expectedCount}`,
        );

      // Build matrix: for each die -> array of outcomes per condition
      const matrix = rolls.map((v) => arrayEvaluator(v));

      // Count successes per condition (treat success or critical_success as match)
      const condCount = {};
      for (let i = 0; i < tcArray.toArray().length; i++) condCount[i] = 0;

      matrix.forEach((outcomes) => {
        outcomes.forEach((o, condIdx) => {
          if (o === Outcome.Success || o === Outcome.CriticalSuccess)
            condCount[condIdx]++;
        });
      });

      // Count literal values matches (raw equality)
      const valueCounts = {};
      rolls.forEach((v) => {
        valueCounts[v] = (valueCounts[v] || 0) + 1;
      });

      // Evaluate rules
      const ruleResults = rules.map((r, idx) => {
        if (r.type === "value_count") {
          const val = r.value;
          const cnt = valueCounts[val] || 0;
          const passed = _checkThreshold(cnt, r);
          return { id: idx, rule: r, count: cnt, passed };
        }

        // condition_count
        if (r.type === "condition_count") {
          const ci = r.conditionIndex;
          if (typeof ci !== "number" || !(ci in condCount)) {
            throw new TypeError(`invalid conditionIndex in rule ${idx}`);
          }
          const cnt = condCount[ci] || 0;
          const passed = _checkThreshold(cnt, r);
          return { id: idx, rule: r, count: cnt, passed };
        }
        // unreachable
        return { id: idx, rule: r, passed: false };
      });

      const passed = ruleResults.every((rr) => rr.passed);

      return {
        matrix,
        condCount,
        valueCounts,
        ruleResults,
        passed,
      };
    };
  }

  /**
   * Convenience: evaluate immediately against provided rolls
   * @param {number[]} rolls
   * @param {import("./RollModifier").RollModifierInstance|null} [modifier=null]
   * @param {boolean|null} [useNaturalCrits=null]
   */
  evaluateRolls(rolls, modifier = null, useNaturalCrits = null) {
    return this.toEvaluator(modifier, useNaturalCrits)(rolls);
  }
}

function _checkThreshold(count, rule) {
  if (rule.exact != null) return count === rule.exact;
  if (rule.atLeast != null) return count >= rule.atLeast;
  if (rule.atMost != null) return count <= rule.atMost;
  // default: require atLeast 1 if nothing provided
  return count >= 1;
}

module.exports = {
  DiceTestConditions,
};
