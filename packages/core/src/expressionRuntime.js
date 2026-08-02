const { isValidDieType, TestType } = require("./entities");
const utils = require("./utils");

function createExpressionError(expression, reason) {
  const message = `${reason} for expression "${expression}". Supported forms: 2D6+5, 3D6x2, 1D20ADV+3, 1D20ADV>=15.`;
  return new TypeError(message);
}

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
    throw createExpressionError(
      expression,
      "Invalid expression: expected a string",
    );
  }

  const trimmed = expression.trim();
  if (!trimmed) {
    throw createExpressionError(expression, "Invalid expression: empty string");
  }

  const normalized = trimmed.replace(/\s+/g, "").toUpperCase();
  const keywordClauseMatch = trimmed.match(
    /^(\S+?)\s+(GET|AT\s+LEAST|AT\s+MOST|EXACTLY)\s*(>=|<=|=|\d+)\s*(\d+)?$/i,
  );
  const compactClauseMatch = normalized.match(/^(.*?)(>=|<=|=)(\d+)$/);
  const testMatch = keywordClauseMatch
    ? {
        expression: keywordClauseMatch[1],
        operator:
          keywordClauseMatch[2].toUpperCase() === "GET"
            ? keywordClauseMatch[3]
            : keywordClauseMatch[2].toUpperCase() === "AT LEAST"
              ? ">="
              : keywordClauseMatch[2].toUpperCase() === "AT MOST"
                ? "<="
                : "=",
        target: Number(
          keywordClauseMatch[4] ||
            keywordClauseMatch[5] ||
            keywordClauseMatch[3],
        ),
      }
    : compactClauseMatch
      ? {
          expression: compactClauseMatch[1],
          operator: compactClauseMatch[2],
          target: Number(compactClauseMatch[3]),
        }
      : undefined;
  const baseExpression = testMatch ? testMatch.expression : normalized;
  const testOperator = testMatch ? testMatch.operator : undefined;
  const testTarget = testMatch ? testMatch.target : undefined;

  const additiveMatch = baseExpression.match(/^([1-9]\d*)D(\d+)([+-]\d+)?$/);
  const multiplicativeMatch = baseExpression.match(/^([1-9]\d*)D(\d+)X(\d+)$/);
  const rollModeMatch = baseExpression.match(
    /^([1-9]\d*)D(\d+)(ADV|DIS)([+-]\d+|X\d+)?$/,
  );

  if (!additiveMatch && !multiplicativeMatch && !rollModeMatch) {
    throw createExpressionError(expression, "Unsupported expression");
  }

  const count = Number(
    (additiveMatch || multiplicativeMatch || rollModeMatch)[1],
  );
  const dieSides = Number(
    (additiveMatch || multiplicativeMatch || rollModeMatch)[2],
  );
  const dieType = `d${dieSides}`;

  if (!isValidDieType(dieType)) {
    throw createExpressionError(expression, `Unsupported die type: ${dieType}`);
  }

  const test = testOperator
    ? {
        testType:
          testOperator === ">="
            ? TestType.AtLeast
            : testOperator === "<="
              ? TestType.AtMost
              : TestType.Exact,
        target: testTarget,
      }
    : undefined;

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
      test,
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
      test,
    };
  }

  return {
    expression: trimmed,
    count,
    dieType,
    modifier: Number(multiplicativeMatch[3]),
    modifierType: "multiply",
    test,
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
    test: ast.test,
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

  const test = bound.test
    ? {
        testType: bound.test.testType,
        target: bound.test.target,
        outcome: utils.determineOutcome(modified, {
          testType: bound.test.testType,
          target: bound.test.target,
          dieType: bound.dieType,
        }),
      }
    : undefined;

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
    ...(test ? { test } : {}),
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
