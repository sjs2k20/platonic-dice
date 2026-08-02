const { isValidDieType } = require("./entities");
const utils = require("./utils");

/**
 * Parses a simple expression into a structured AST-like shape.
 * Supported forms:
 * - <count>d<die>[+|-<modifier>]
 * - <count>d<die>x<multiplier>
 *
 * Examples: 2D6+5, 3d10-2, 3D6x2
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

  if (!additiveMatch && !multiplicativeMatch) {
    throw new TypeError(`Unsupported expression: ${expression}`);
  }

  const count = Number((additiveMatch || multiplicativeMatch)[1]);
  const dieSides = Number((additiveMatch || multiplicativeMatch)[2]);
  const dieType = `d${dieSides}`;

  if (!isValidDieType(dieType)) {
    throw new TypeError(`Unsupported die type: ${dieType}`);
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
  };
}

/**
 * Executes a bound expression using the existing roll-generation helpers.
 */
function executeExpression(bound) {
  const rolls = Array.from({ length: bound.count }, () =>
    utils.generateResult(bound.dieType),
  );
  const base = rolls.reduce((total, value) => total + value, 0);
  const modified =
    bound.modifierType === "multiply"
      ? base * bound.modifier
      : base + bound.modifier;

  return {
    expression: bound.expression,
    count: bound.count,
    dieType: bound.dieType,
    rolls,
    base,
    modifier: bound.modifier,
    modifierType: bound.modifierType,
    modified,
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
