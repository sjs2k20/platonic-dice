// src/core/index.js
const { Die } = require("./dice/Die");
const { TargetDie } = require("./dice/TargetDie");
const { TestDie } = require("./dice/TestDie");
const { ModifyMixin } = require("./ModifyMixin");
const { rollDice } = require("./DiceUtils");
const { DieType, RollType, CriticalState } = require("./Types");
const { TestConditions } = require("./TestConditions");

module.exports = {
    Die,
    TargetDie,
    TestDie,
    TestConditions,
    ModifyMixin,
    rollDice,
    DieType,
    RollType,
    CriticalState,
};
