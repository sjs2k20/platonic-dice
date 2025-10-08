module.exports = {
    get Die() {
        return require("./Die").Die;
    },
    get TargetDie() {
        return require("./TargetDie").TargetDie;
    },
    get CustomDie() {
        return require("./CustomDie").CustomDie;
    },
    get ModifiedDie() {
        return require("./ModifiedDie").ModifiedDie;
    },
    get TestDie() {
        return require("./TestDie").TestDie;
    },
    get TestConditions() {
        return require("./TestDie").TestConditions;
    },
};
