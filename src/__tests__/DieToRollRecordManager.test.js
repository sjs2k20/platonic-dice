const { DieType, RollType, Die } = require("../../core");

describe("Integration: Die + RollRecordManager", () => {
  let die;

  beforeEach(() => {
    die = new Die(DieType.D6);
  });

  it("records history through RollRecordManager when rolling", () => {
    die.roll();
    die.roll();

    // The Die API should expose correct history
    expect(die.history.length).toBe(2);

    // The underlying RollRecordManager should be keeping timestamps
    expect(die.history_full[0]).toHaveProperty("timestamp");
  });

  it("report() reflects RollRecordManager state", () => {
    die.roll();
    const report = die.report();

    expect(report.type).toBe(DieType.D6);
    expect(report.latest_roll).toHaveProperty("roll");
    expect(report.times_rolled).toBe(1);
  });

  it("toJSON() produces consistent JSON output with history included", () => {
    die.roll();
    const json = JSON.stringify(die);

    const parsed = JSON.parse(json);
    expect(parsed.type).toBe(DieType.D6);
    expect(parsed.history.length).toBe(1);
    expect(parsed.history[0]).toHaveProperty("roll");
  });

  it("toString() shows latest roll and roll count", () => {
    die.roll();
    const str = die.toString();

    expect(str).toContain("Die(d6)");
    expect(str).toContain("total rolls=1");
  });

  it("handles multiple rolls and history correctly across manager and die", () => {
    die.roll();
    die.roll();
    die.roll();

    expect(die._rolls.length).toBe(3);
    expect(die.history.length).toBe(3);

    const report = die.report({ includeHistory: true });
    expect(report.history.length).toBe(3);
  });
});
