const { DieType, ModifiedDie } = require("../../core");

describe("Integration: ModifiedDie + RollHistoryCache", () => {
    let die;

    beforeEach(() => {
        die = new ModifiedDie(DieType.D6, (x) => x + 1);
    });

    it("uses a distinct cache key per modifier", () => {
        const key1 = die._cacheKey;
        die.modifier = (x) => x + 2;
        const key2 = die._cacheKey;

        expect(key1).not.toBe(key2);
    });

    it("creates and restores cached histories when switching modifiers", () => {
        // roll with +1
        die.roll();
        const key1History = die.report({ includeHistory: true }).history;

        // change to +3
        die.modifier = (x) => x + 3;
        die.roll();
        const key2History = die.report({ includeHistory: true }).history;

        // switch back to +1
        die.modifier = (x) => x + 1;
        const restoredHistory = die.report({ includeHistory: true }).history;

        // verify original +1 rolls restored
        expect(restoredHistory.map((r) => r.modified)).toEqual(
            key1History.map((r) => r.modified)
        );

        // verify +3 rolls are *not* in +1’s history
        expect(restoredHistory).not.toContainEqual(key2History[0]);
    });

    it("report() and toJSON() reflect current cache only", () => {
        die.roll(); // +1
        die.modifier = (x) => x + 2;
        die.roll(); // +2

        const json = JSON.parse(JSON.stringify(die));
        expect(json.history.every((r) => r.modified === r.roll + 2)).toBe(true);
    });
});
