import { expectType } from "tsd";
import {
  roll,
  analyse,
  rollDice,
  rollMod,
  rollDiceMod,
  rollDiceModTest,
  rollTest,
  rollModTest,
  type RollExpressionResult,
  type RollExpressionAnalysisResult,
  type ExpressionAggregateClause,
  type RollExpressionAst,
  type RollExpressionDiagnostic,
  type RollExpressionTestDefinition,
  DieType,
  RollType,
  TestType,
  RollModifier,
  TestConditions,
  type OutcomeValue,
  type DieTypeValue,
  type RollTypeValue,
  type TestTypeValue,
} from "../core";

// Basic roll helpers
expectType<number>(roll(DieType.D20));
expectType<number>(roll(DieType.D20, RollType.Advantage));

// rollDice helpers
expectType<{ array: number[]; sum: number }>(
  rollDice(DieType.D6, { count: 3 }),
);

// rollMod helpers
expectType<{ base: number; modified: number }>(
  rollMod(DieType.D10, (n) => n + 2),
);

// rollDiceMod helpers
expectType<{
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
}>(rollDiceMod(DieType.D8, (n) => n * 2, { count: 2 }));

// rollDiceModTest helpers
expectType<{
  base: { array: number[]; sum: number };
  modified: { each: { array: number[]; sum: number }; net: { value: number } };
  result: Object;
}>(
  rollDiceModTest(
    DieType.D6,
    { each: (n) => n + 1 },
    [{ testType: TestType.AtLeast, target: 4 }],
    { count: 2 },
  ),
);

// rollTest helpers
expectType<{ base: number; outcome: OutcomeValue }>(
  rollTest(DieType.D20, { testType: TestType.AtLeast, target: 15 }),
);

// rollModTest helpers
expectType<{ base: number; modified: number; outcome: OutcomeValue }>(
  rollModTest(DieType.D20, (n) => n + 5, {
    testType: TestType.AtLeast,
    target: 15,
  }),
);

// Expression-first DSL helpers
const expressionResult = roll("2D6+5");
expectType<RollExpressionResult>(expressionResult);
expectType<string>(expressionResult.expression);
expectType<number>(expressionResult.count);
expectType<string>(expressionResult.dieType);
expectType<number[]>(expressionResult.rolls);
expectType<number>(expressionResult.base);
expectType<number>(expressionResult.modified);
expectType<ExpressionAggregateClause | undefined>(
  expressionResult.test?.aggregate,
);

const analysisResult = analyse("2D6+5 GET atLeast 15");
expectType<RollExpressionAnalysisResult>(analysisResult);

const ast: RollExpressionAst = {
  expression: "2D6+5",
  count: 2,
  dieType: "d6",
  modifier: 5,
  modifierType: "add",
};
expectType<RollExpressionAst>(ast);

const diagnostic: RollExpressionDiagnostic = {
  message: "Unsupported expression",
  code: "unsupported-expression",
  severity: "error",
};
expectType<RollExpressionDiagnostic>(diagnostic);

const testDefinition: RollExpressionTestDefinition = {
  testType: TestType.AtLeast,
  target: 15,
};
expectType<RollExpressionTestDefinition>(testDefinition);

// Entity class exports
const modifier = new RollModifier((n) => n + 1);
expectType<RollModifier>(modifier);

const tc = new TestConditions(
  TestType.AtLeast,
  { target: 10, dieType: DieType.D20 },
  DieType.D20,
);
expectType<TestConditions>(tc);

// Enum value type compatibility
const dieTypeFromEnum: DieTypeValue = DieType.D6;
const rollTypeFromEnum: RollTypeValue = RollType.Advantage;
const testTypeFromEnum: TestTypeValue = TestType.AtLeast;
expectType<typeof DieType.D6>(dieTypeFromEnum);
expectType<typeof RollType.Advantage>(rollTypeFromEnum);
expectType<typeof TestType.AtLeast>(testTypeFromEnum);

// Negative tests
// @ts-expect-error roll only supports valid roll-type values
roll(DieType.D6, "not_real");
// @ts-expect-error rollDice expects a numeric count option
rollDice(DieType.D6, { count: "2" });
// @ts-expect-error rollMod should only accept single-parameter modifier functions
rollMod(DieType.D6, (a: number, b: number) => a + b);
// @ts-expect-error rollTest requires a known test type
rollTest(DieType.D6, { testType: "not_real" });
