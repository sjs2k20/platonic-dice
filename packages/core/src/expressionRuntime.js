const { isValidDieType } = require("./entities");
const utils = require("./utils");

/**
 * Parses a simple expression into a structured AST-like shape.
 * Supported forms:
 * - <count>d<die>[+|-<modifier>]
 * - <count>d<die>x<multiplier>
 * - <count>d<die><adv|dis>
 * - <count>d<die><adv|dis>[+|-<modifier>]
 * - <count>d<die><adv|dis>x<multiplier>
 *
 * Examples: 2D6+5, 3d10-2, 3D6x2, 1D20ADV, 1D20ADV+3, 1D20ADVx2
 */
function parseExpression(expression) {
  if (typeof expression !== "string") {
    throw new TypeError("Invalid expression: expected a string");
  }

  const trimmed = expression.trim();
  if (!trimmed) {
    throw new TypeError("Invalid expression: empty string");
  }

  const normalized = trimmed.replace(/\s+/g, "").toUpperCase();
  const additiveMatch = normalized.match(/^([1-9]\d*)D(\d+)([+-]\d+)?$/);
  const multiplicativeMatch = normalized.match(/^([1-9]\d*)D(\d+)X(\d+)$/);
  const rollModeMatch = normalized.match(
    /^([1-9]\d*)D(\d+)(ADV|DIS)([+-]\d+|X\d+)?$/,
  );

  if (!additiveMatch && !multiplicativeMatch && !rollModeMatch) {
    throw new TypeError(`Unsupported expression: ${expression}`);
  }

  const count = Number(
    (additiveMatch || multiplicativeMatch || rollModeMatch)[1],
  );
  const dieSides = Number(
    (additiveMatch || multiplicativeMatch || rollModeMatch)[2],
  );
  const dieType = `d${dieSides}`;

  if (!isValidDieType(dieType)) {
    throw new TypeError(`Unsupported die type: ${dieType}`);
  }

  if (rollModeMatch) {
    const rollMode = rollModeMatch[3].toLowerCase();
    const suffix = rollModeMatch[4] || "";
    const modifier = suffix.startsWith("X")
      ? Number(suffix.slice(1))
      : suffix
        ? Number(suffix)
        : 0;
    const modifierType = suffix.startsWith("X") ? "multiply" : "add";

    return {
      expression: trimmed,
      count,
      dieType,
      modifier,
      modifierType,
      rollMode: rollMode === "adv" ? "advantage" : "disadvantage",
    };
  }

  if (additiveMatch) {
    const modifier = additiveMatch[3] ? Number(additiveMatch[3]) : 0;
    return {
      expression: trimmed,
      count,
      dieType,
      modifier,
      modifierType: "add",
    };
  }

  return {
    expression: trimmed,
    count,
    dieType,
    modifier: Number(multiplicativeMatch[3]),
    modifierType: "multiply",
  };
}

/**
 * Binds a parsed expression into a validated execution plan.
 */
function bindExpression(ast) {
  if (!ast || typeof ast !== "object") {
    throw new TypeError("Invalid expression AST");
  }

  if (
    typeof ast.count !== "number" ||
    !Number.isInteger(ast.count) ||
    ast.count < 1
  ) {
    throw new TypeError(`Invalid count: ${ast.count}`);
  }

  if (!isValidDieType(ast.dieType)) {
    throw new TypeError(`Invalid die type: ${ast.dieType}`);
  }

  return {
    expression: ast.expression,
    count: ast.count,
    dieType: ast.dieType,
    modifier: ast.modifier,
    modifierType: ast.modifierType || "add",
    rollMode: ast.rollMode,
  };
}

/**
 * Executes a bound expression using the existing roll-generation helpers.
 */
function executeExpression(bound) {
  const rollCount = bound.rollMode ? 2 : bound.count;
  const rolls = Array.from({ length: rollCount }, () =>
    utils.generateResult(bound.dieType),
  );
  const base = rolls.reduce((total, value) => total + value, 0);
  const effectiveBase =
    bound.rollMode === "advantage"
      ? Math.max(...rolls)
      : bound.rollMode === "disadvantage"
        ? Math.min(...rolls)
        : base;
  const modified =
    bound.modifierType === "multiply"
      ? effectiveBase * bound.modifier
      : effectiveBase + bound.modifier;

  return {
    expression: bound.expression,
    count: bound.count,
    dieType: bound.dieType,
    rolls,
    base: effectiveBase,
    modifier: bound.modifier,
    modifierType: bound.modifierType,
    modified,
    rollMode: bound.rollMode,
  };
}

function rollExpression(expression) {
  const parsed = parseExpression(expression);
  const bound = bindExpression(parsed);
  return executeExpression(bound);
}

module.exports = {
  parseExpression,
  bindExpression,
  executeExpression,
  rollExpression,
};
