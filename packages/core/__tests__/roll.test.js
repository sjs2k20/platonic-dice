const validators = require("../../src/validators");
const utils = require("../../src/utils");
const { roll, rollAdv, rollDis, rollD6, rollD20 } = require("../../src/");
const { DieType, RollType } = require("../../src/entities");

jest.mock("../../src/validators", () => ({
  isDieType: jest.fn(),
  isRollType: jest.fn(),
}));

jest.mock("../../src/utils", () => ({
  generateDieResult: jest.fn(),
}));

describe("roll", () => {
  beforeEach(() => {
    validators.isDieType.mockReset();
    validators.isRollType.mockReset();
    utils.generateDieResult.mockReset();
  });

  it("throws if dieType is invalid", () => {
    validators.isDieType.mockReturnValue(false);
    expect(() => roll("invalidDie")).toThrow(TypeError);
  });

  it("throws if rollType is invalid", () => {
    validators.isDieType.mockReturnValue(true);
    validators.isRollType.mockReturnValue(false);
    expect(() => roll(DieType.D6, "invalidRoll")).toThrow(TypeError);
  });

  it("returns a number from generateDieResult for normal roll", () => {
    validators.isDieType.mockReturnValue(true);
    validators.isRollType.mockReturnValue(true);
    utils.generateDieResult.mockReturnValue(4);

    expect(roll(DieType.D6)).toBe(4);
    expect(utils.generateDieResult).toHaveBeenCalledWith(DieType.D6);
  });

  it("returns max for advantage roll", () => {
    validators.isDieType.mockReturnValue(true);
    validators.isRollType.mockReturnValue(true);
    utils.generateDieResult.mockReturnValueOnce(3).mockReturnValueOnce(5);

    expect(roll(DieType.D6, RollType.Advantage)).toBe(5);
  });

  it("returns min for disadvantage roll", () => {
    validators.isDieType.mockReturnValue(true);
    validators.isRollType.mockReturnValue(true);
    utils.generateDieResult.mockReturnValueOnce(2).mockReturnValueOnce(6);

    expect(roll(DieType.D6, RollType.Disadvantage)).toBe(2);
  });

  describe("convenience aliases", () => {
    beforeEach(() => {
      validators.isDieType.mockReturnValue(true);
      validators.isRollType.mockReturnValue(true);
      utils.generateDieResult.mockReturnValue(3);
    });

    it("rollAdv calls roll with advantage", () => {
      expect(rollAdv(DieType.D20)).toBe(3);
    });

    it("rollDis calls roll with disadvantage", () => {
      expect(rollDis(DieType.D20)).toBe(3);
    });

    it("rollD6 rolls a D6 normally", () => {
      expect(rollD6()).toBe(3);
    });

    it("rollD20 rolls a D20 normally", () => {
      expect(rollD20()).toBe(3);
    });
  });
});
