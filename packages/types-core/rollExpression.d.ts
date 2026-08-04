import type { OutcomeValue, TestTypeValue } from "./entities";

/**
 * Shape of the structured result produced by the expression-first runtime used
 * by `roll(expression)` and `analyse(expression)` for DSL expressions.
 */
export type RollExpressionModifierType = "add" | "multiply";
export type RollExpressionRollMode = "advantage" | "disadvantage";
export type RollExpressionDiagnosticSeverity = "error" | "warning";

export interface ExpressionAggregateClause {
  count: number;
  threshold: number;
  total: number;
  totalOperator?: ">=" | "<=" | "=";
  conjunction?: "and" | "or";
  clauses?: ExpressionAggregateClauseResult[];
}

export interface ExpressionAggregateClauseResult {
  type: "threshold" | "total";
  passed: boolean;
  actualCount?: number;
  thresholdCount?: number;
  thresholdValue?: number;
  target?: number;
  actualValue?: number;
  operator?: ">=" | "<=" | "=";
}

export interface RollExpressionTestDefinition {
  testType: TestTypeValue;
  target: number;
  aggregate?: ExpressionAggregateClause;
  criticalSuccess?: number;
  criticalFailure?: number;
}

export interface RollExpressionTestResult {
  testType: TestTypeValue;
  target: number;
  outcome?: OutcomeValue;
  aggregate?: ExpressionAggregateClause;
}

export interface RollExpressionAst {
  expression: string;
  count: number;
  dieType: string;
  modifier: number;
  modifierType: RollExpressionModifierType;
  rollMode?: RollExpressionRollMode;
  perDieModifier?: number;
  modifierPlan?: {
    each: number;
    net: number;
  };
  test?: RollExpressionTestDefinition;
}

export interface RollExpressionDiagnostic {
  message: string;
  code: string;
  severity: RollExpressionDiagnosticSeverity;
  location?: {
    start: number;
    end: number;
  };
}

export interface RollExpressionResult {
  expression: string;
  count: number;
  dieType: string;
  rolls: number[];
  base: number;
  modifier: number;
  modifierType: RollExpressionModifierType;
  modified: number;
  rollMode?: RollExpressionRollMode;
  perDieModifier?: number;
  modifierPlan?: {
    each: number;
    net: number;
  };
  test?: RollExpressionTestResult;
}

export interface RollExpressionAnalysisResult {
  expression: string;
  count: number;
  dieType: string;
  totalPossibilities: number;
  outcomeCounts: Record<string, number>;
  outcomeProbabilities: Record<string, number>;
  outcomesByRoll: Record<string, string>;
  aggregateResultsByRoll?: Record<
    string,
    { outcome: OutcomeValue; clauses?: ExpressionAggregateClauseResult[] }
  >;
  rolls: number[][];
  rollsByOutcome: Record<string, string[]>;
  modifier: number;
  modifierType: RollExpressionModifierType;
  rollMode?: RollExpressionRollMode;
  test?: RollExpressionTestResult;
}

export declare function rollExpression(
  expression: string,
): RollExpressionResult;
