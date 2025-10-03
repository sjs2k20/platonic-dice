module.exports = {
    get DieType() {
        return require("./Types").DieType;
    },
    get RollType() {
        return require("./Types").RollType;
    },
    get Outcome() {
        return require("./Types").Outcome;
    },
    get rollDie() {
        return require("./utils/DiceUtils").rollDie;
    },
    get rollDice() {
        return require("./utils/DiceUtils").rollDice;
    },
    get rollModDie() {
        return require("./utils/DiceUtils").rollModDie;
    },
    get rollTargetDie() {
        return require("./utils/DiceUtils").rollTargetDie;
    },
    get rollTestDie() {
        return require("./utils/DiceUtils").rollTestDie;
    },
    get RollRecordManager() {
        return require("./utils/RollRecordManager").RollRecordManager;
    },
    get Die() {
        return require("./dice").Die;
    },
    get TargetDie() {
        return require("./dice").TargetDie;
    },
    get CustomDie() {
        return require("./dice").CustomDie;
    },
    get ModifiedDie() {
        return require("./dice").ModifiedDie;
    },
    get TestDie() {
        return require("./dice").TestDie;
    },
    get TestConditions() {
        return require("./dice").TestConditions;
    },
};
