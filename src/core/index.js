// src/core/index.js
const { Die } = require("./Die");
const { TargetDie } = require("./TargetDie");
const { TestDie } = require("./TestDie");
const { ModifyMixin } = require("./ModifyMixin");
const { rollDice } = require("./DiceUtils");
const { DieType, RollType, CriticalState } = require("./Types");

module.exports = {
    Die,
    TargetDie,
    TestDie,
    ModifyMixin,
    rollDice,
    DieType,
    RollType,
    CriticalState,
};
