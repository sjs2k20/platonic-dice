const { isValidDieType, TestType } = require("./entities");
const utils = require("./utils");

const SUPPORTED_FORMS = "2D6+5, 3D6x2, 1D20ADV+3, 1D20ADV>=15.";

function createExpressionError(expression, reason) {
  const message = `${reason} for expression "${expression}". Supported forms: ${SUPPORTED_FORMS}`;
  return new TypeError(message);
}

function buildAggregateTestMatch(match) {
  const aggregate = {
    count: Number(match[3]),
    threshold: Number(match[4] || match[3]),
    total: Number(match[7]),
    totalOperator: match[6],
  };
  Object.defineProperty(aggregate, "conjunction", {
    value: match[5].toLowerCase(),
    enumerable: false,
  });

  return {
    expression: match[1],
    operator:
      match[2] === "atMost" ? "<=" : match[2] === "exactly" ? "=" : ">=",
    target: Number(match[7]),
    aggregate,
  };
}

function buildExplicitKeywordTestMatch(match) {
  return {
    expression: match[1],
    operator: (() => {
      const clause = match[2] || "";
      const operator = match[3] || "";
      if (clause === "atLeast") return ">=";
      if (clause === "atMost") return "<=";
      if (operator === ">=" || operator === "<=") return operator;
      return "=";
    })(),
    target: Number(match[4]),
  };
}

function buildCompactTestMatch(match) {
  return {
    expression: match[1],
    operator: match[2],
    target: Number(match[3]),
  };
}

function resolveTestMatch(
  aggregateClauseMatch,
  explicitKeywordClauseMatch,
  compactClauseMatch,
) {
  if (aggregateClauseMatch) {
    return buildAggregateTestMatch(aggregateClauseMatch);
  }

  if (explicitKeywordClauseMatch) {
    return buildExplicitKeywordTestMatch(explicitKeywordClauseMatch);
  }

  if (compactClauseMatch) {
    return buildCompactTestMatch(compactClauseMatch);
  }

  return undefined;
}

function buildTestDefinition(testMatch, testOperator, testTarget) {
  if (!testOperator) {
    return undefined;
  }

  return {
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
  };
}

function compareValues(actualValue, operator, target) {
  if (operator === "<=") return actualValue <= target;
  if (operator === "=") return actualValue === target;
  return actualValue >= target;
}

function buildAggregateClauseResults(bound, rolls, modified) {
  const aggregate = bound.test.aggregate;
  const thresholdCount = aggregate.count;
  const thresholdValue = aggregate.threshold;
  const totalValue = aggregate.total;
  const actualThresholdCount = rolls.filter(
    (value) => value >= thresholdValue,
  ).length;
  const passesThreshold = actualThresholdCount >= thresholdCount;
  const passesTotal = compareValues(
    modified,
    aggregate.totalOperator || ">=",
    totalValue,
  );

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

  return [
    {
      type: "threshold",
      passed: passesThreshold,
      actualCount: actualThresholdCount,
      thresholdCount,
      thresholdValue,
    },
    {
      type: "total",
      passed: passesTotal,
      target: totalValue,
      actualValue: modified,
      operator: aggregate.totalOperator || ">=",
    },
  ];
}

function evaluateAggregateOutcome(bound, rolls, modified) {
  const clauses = buildAggregateClauseResults(bound, rolls, modified);
  const conjunction = bound.test.aggregate.conjunction || "and";
  const passed =
    conjunction === "or"
      ? clauses.some((clause) => clause.passed)
      : clauses.every((clause) => clause.passed);

  return passed ? "success" : "failure";
}

function evaluateStandardOutcome(bound, effectiveBase, baseValue) {
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

  if (!shouldUseNaturalCrits) {
    return outcome;
  }

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
}

function getRollMetrics(bound, rolls) {
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

  return {
    base,
    effectiveBase,
    perDieRolls,
    perDieSum,
    modified,
  };
}

function evaluateOutcomeForBound(bound, rolls, metrics) {
  if (bound.test?.aggregate) {
    return evaluateAggregateOutcome(bound, rolls, metrics.modified);
  }

  const baseValue = bound.rollMode
    ? metrics.effectiveBase
    : bound.perDieModifier != null
      ? metrics.perDieSum
      : metrics.modified;

  return evaluateStandardOutcome(bound, metrics.effectiveBase, baseValue);
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
  const testMatch = resolveTestMatch(
    aggregateClauseMatch,
    explicitKeywordClauseMatch,
    compactClauseMatch,
  );
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

  const test = buildTestDefinition(testMatch, testOperator, testTarget);

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
    ...(ast.rollMode != null ? { rollMode: ast.rollMode } : {}),
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
  const metrics = getRollMetrics(bound, rolls);

  const test = bound.test
    ? {
        testType: bound.test.testType,
        target: bound.test.target,
        outcome: evaluateOutcomeForBound(bound, rolls, metrics),
        ...(bound.test.aggregate
          ? {
              aggregate: {
                ...bound.test.aggregate,
                clauses: buildAggregateClauseResults(
                  bound,
                  rolls,
                  metrics.modified,
                ),
              },
            }
          : {}),
      }
    : undefined;

  return {
    expression: bound.expression,
    count: bound.count,
    dieType: bound.dieType,
    rolls,
    base: metrics.effectiveBase,
    modifier: bound.modifier,
    modifierType: bound.modifierType,
    ...(bound.perDieModifier != null
      ? {
          perDieModifier: bound.perDieModifier,
          modifierPlan: bound.modifierPlan,
        }
      : {}),
    modified: metrics.modified,
    ...(bound.rollMode != null ? { rollMode: bound.rollMode } : {}),
    ...(test ? { test } : {}),
  };
}

function roll(expression) {
  const parsed = parseExpression(expression);
  const bound = bindExpression(parsed);
  return executeExpression(bound);
}

function analyse(expression) {
  if (typeof expression !== "string") {
    throw createExpressionError(
      expression,
      "Invalid expression: expected a string",
    );
  }

  const trimmed = expression.trim();
  if (!/\bGET\b/i.test(trimmed)) {
    throw createExpressionError(
      expression,
      "Analysis expressions must include a GET test clause",
    );
  }

  const parsed = parseExpression(expression);
  const bound = bindExpression(parsed);

  const sides = Number(bound.dieType.slice(1));
  const outcomeCounts = {};
  const outcomesByRoll = {};
  const aggregateResultsByRoll = {};
  const rolls = [];

  const generateCombinations = (current = []) => {
    if (current.length === bound.count) {
      const comboRolls = [...current];
      const metrics = getRollMetrics(
        {
          ...bound,
          rollMode: undefined,
        },
        comboRolls,
      );
      const outcome = evaluateOutcomeForBound(
        {
          ...bound,
          rollMode: undefined,
        },
        comboRolls,
        metrics,
      );

      const aggregateClauses = bound.test?.aggregate
        ? buildAggregateClauseResults(
            {
              ...bound,
              rollMode: undefined,
            },
            comboRolls,
            metrics.modified,
          )
        : undefined;

      outcomesByRoll[comboRolls.join(",")] = outcome;
      aggregateResultsByRoll[comboRolls.join(",")] = {
        outcome,
        ...(aggregateClauses ? { clauses: aggregateClauses } : {}),
      };
      outcomeCounts[outcome] = (outcomeCounts[outcome] || 0) + 1;
      rolls.push(comboRolls);
      return;
    }

    for (let rollValue = 1; rollValue <= sides; rollValue++) {
      current.push(rollValue);
      generateCombinations(current);
      current.pop();
    }
  };

  generateCombinations();

  const totalPossibilities = sides ** bound.count;
  const outcomeProbabilities = Object.fromEntries(
    Object.entries(outcomeCounts).map(([outcome, count]) => [
      outcome,
      count / totalPossibilities,
    ]),
  );

  return {
    expression: bound.expression,
    count: bound.count,
    dieType: bound.dieType,
    totalPossibilities,
    outcomeCounts,
    outcomeProbabilities,
    outcomesByRoll,
    aggregateResultsByRoll,
    rolls,
    rollsByOutcome: Object.entries(outcomesByRoll).reduce(
      (acc, [rollValue, outcome]) => {
        acc[outcome] ??= [];
        acc[outcome].push(rollValue);
        return acc;
      },
      {},
    ),
    modifier: bound.modifier,
    modifierType: bound.modifierType,
    ...(bound.rollMode != null ? { rollMode: bound.rollMode } : {}),
    ...(bound.test
      ? {
          test: {
            ...bound.test,
            ...(bound.test.aggregate
              ? {
                  aggregate: {
                    ...bound.test.aggregate,
                    clauses:
                      Object.values(aggregateResultsByRoll)[0]?.clauses || [],
                  },
                }
              : {}),
          },
        }
      : {}),
  };
}

module.exports = {
  parseExpression,
  bindExpression,
  executeExpression,
  roll,
  analyse,
};
