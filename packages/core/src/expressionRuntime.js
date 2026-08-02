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
  const aggregateClauseMatch = trimmed.match(
    /^(\S+?)\s+GET\s+(atLeast|atMost|exactly)\s*(\d+)(?:x\s*(\d+)\+)?\s+(AND|OR)\s+(?:TOTAL|total)\s*(>=|<=|=)\s*(\d+)$/,
  );
  const aggregateLikeMatch = trimmed.match(
    /^(\S+?)\s+GET\s+(atLeast|atMost|exactly)\s*(\d+)(?:x\s*(\d+)\+)?\s+(AND|OR)\s+(?:TOTAL|total)\s*([<>]=?|=)\s*(\d+)$/,
  );
  const explicitKeywordClauseMatch = trimmed.match(
    /^(\S+?)\s+GET\s+(atLeast|atMost|exactly)?\s*(>=|<=|=)?\s*(\d+)?$/,
  );
  const bareKeywordClauseMatch = trimmed.match(
    /^(\S+?)\s+(atLeast|atMost|exactly)\s*(>=|<=|=|\d+)?\s*(\d+)?$/,
  );
  const compactClauseMatch = normalized.match(/^(.*?)(>=|<=|=)(\d+)$/);
  if (aggregateLikeMatch && !aggregateClauseMatch) {
    throw createExpressionError(
      expression,
      "Invalid aggregate clause: expected >=, <=, or = after AND/OR TOTAL",
    );
  }
  const testMatch = aggregateClauseMatch
    ? {
        expression: aggregateClauseMatch[1],
        operator:
          aggregateClauseMatch[2] === "atMost"
            ? "<="
            : aggregateClauseMatch[2] === "exactly"
              ? "="
              : ">=",
        target: Number(aggregateClauseMatch[7]),
        aggregate: (() => {
          const aggregate = {
            count: Number(aggregateClauseMatch[3]),
            threshold: Number(
              aggregateClauseMatch[4] || aggregateClauseMatch[3],
            ),
            total: Number(aggregateClauseMatch[7]),
          };
          Object.defineProperty(aggregate, "conjunction", {
            value: aggregateClauseMatch[5].toLowerCase(),
            enumerable: false,
          });
          return aggregate;
        })(),
      }
    : explicitKeywordClauseMatch
      ? {
          expression: explicitKeywordClauseMatch[1],
          operator: (() => {
            const clause = explicitKeywordClauseMatch[2] || "";
            const operator = explicitKeywordClauseMatch[3] || "";
            if (clause === "atLeast") return ">=";
            if (clause === "atMost") return "<=";
            if (operator === ">=" || operator === "<=") return operator;
            return "=";
          })(),
          target: Number(explicitKeywordClauseMatch[4]),
        }
      : compactClauseMatch
        ? {
            expression: compactClauseMatch[1],
            operator: compactClauseMatch[2],
            target: Number(compactClauseMatch[3]),
          }
        : undefined;
  if (!testMatch && bareKeywordClauseMatch) {
    throw createExpressionError(
      expression,
      "Explicit test clauses must be prefixed with GET",
    );
  }

  const baseExpression = testMatch ? testMatch.expression : normalized;
  const testOperator = testMatch ? testMatch.operator : undefined;
  const testTarget = testMatch ? testMatch.target : undefined;

  const additiveMatch = baseExpression.match(
    /^([1-9]\d*)D(\d+)(?:([+-]\d+)(?:(toEach)([+-]\d+))?)?$/i,
  );
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
        ...(testMatch && testMatch.aggregate
          ? { aggregate: testMatch.aggregate }
          : {}),
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
    const firstModifier = additiveMatch[3] ? Number(additiveMatch[3]) : 0;
    const hasPerDieModifier = Boolean(additiveMatch[4]);
    const netModifier = additiveMatch[5]
      ? Number(additiveMatch[5])
      : firstModifier;
    const modifier = hasPerDieModifier ? netModifier : firstModifier;

    return {
      expression: trimmed,
      count,
      dieType,
      modifier,
      modifierType: "add",
      ...(hasPerDieModifier
        ? {
            perDieModifier:
              Math.abs(firstModifier) * (firstModifier < 0 ? -1 : 1),
            modifierPlan: {
              each: Math.abs(firstModifier) * (firstModifier < 0 ? -1 : 1),
              net: netModifier,
            },
          }
        : {}),
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
    ...(ast.perDieModifier != null
      ? {
          perDieModifier: ast.perDieModifier,
          modifierPlan: ast.modifierPlan,
        }
      : {}),
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
  const perDieRolls =
    bound.perDieModifier != null
      ? rolls.map((value) => value + bound.perDieModifier)
      : rolls;
  const perDieSum = perDieRolls.reduce((total, value) => total + value, 0);
  const modified =
    bound.perDieModifier != null
      ? perDieSum + bound.modifier
      : bound.modifierType === "multiply"
        ? effectiveBase * bound.modifier
        : effectiveBase + bound.modifier;

  const test = bound.test
    ? {
        testType: bound.test.testType,
        target: bound.test.target,
        outcome: bound.test.aggregate
          ? (() => {
              const thresholdCount = bound.test.aggregate.count;
              const thresholdValue = bound.test.aggregate.threshold;
              const totalValue = bound.test.aggregate.total;
              const passesThreshold =
                rolls.filter((value) => value >= thresholdValue).length >=
                thresholdCount;
              const passesTotal = modified >= totalValue;
              const conjunction = bound.test.aggregate.conjunction || "and";
              if (thresholdCount > bound.count) {
                throw createExpressionError(
                  bound.expression,
                  "Invalid aggregate clause: count exceeds available dice",
                );
              }
              if (thresholdValue > Number(bound.dieType.slice(1))) {
                throw createExpressionError(
                  bound.expression,
                  "Invalid aggregate clause: threshold exceeds die faces",
                );
              }
              return conjunction === "or"
                ? passesThreshold || passesTotal
                  ? "success"
                  : "failure"
                : passesThreshold && passesTotal
                  ? "success"
                  : "failure";
            })()
          : (() => {
              const baseValue = bound.rollMode
                ? effectiveBase
                : bound.perDieModifier != null
                  ? perDieSum
                  : modified;
              const outcome = utils.determineOutcome(baseValue, {
                testType: bound.test.testType,
                target: bound.test.target,
                dieType: bound.dieType,
                ...(bound.test.criticalSuccess != null
                  ? { critical_success: bound.test.criticalSuccess }
                  : {}),
                ...(bound.test.criticalFailure != null
                  ? { critical_failure: bound.test.criticalFailure }
                  : {}),
              });
              const shouldUseNaturalCrits =
                bound.test.criticalSuccess == null &&
                bound.test.criticalFailure == null &&
                [TestType.Skill, TestType.AtLeast, TestType.AtMost].includes(
                  bound.test.testType,
                );
              if (!shouldUseNaturalCrits) return outcome;
              const sides = Number(bound.dieType.slice(1));
              const isNaturalMax = effectiveBase === sides;
              const isNaturalMin = effectiveBase === 1;
              if (bound.test.testType === TestType.Skill) {
                if (isNaturalMax) return "critical_success";
                if (isNaturalMin) return "critical_failure";
              }
              if (bound.test.testType === TestType.AtMost) {
                if (isNaturalMax) return "failure";
                if (isNaturalMin) return "success";
              }
              if (bound.test.testType === TestType.AtLeast) {
                if (isNaturalMax) return "success";
                if (isNaturalMin) return "failure";
              }
              return outcome;
            })(),
        ...(bound.test.aggregate ? { aggregate: bound.test.aggregate } : {}),
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
    ...(bound.perDieModifier != null
      ? {
          perDieModifier: bound.perDieModifier,
          modifierPlan: bound.modifierPlan,
        }
      : {}),
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
