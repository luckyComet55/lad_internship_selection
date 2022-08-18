/*
* TASK 4
**/

const {prompt} = require("readline-sync")

const fierceHead = {
    maxHealth: 10,
    name: "Лютый",
    moves: [
        {
            "name": "Удар когтистой лапой",
            "physicalDmg": 3,
            "magicDmg": 0,
            "physicArmorPercent": 20,
            "magicArmorPercent": 20,
            "cooldown": 0
        },
        {
            "name": "Огненное дыхание",
            "physicalDmg": 0,
            "magicDmg": 4,
            "physicArmorPercent": 0,
            "magicArmorPercent": 0,
            "cooldown": 3
        },
        {
            "name": "Удар хвостом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercent": 50,
            "magicArmorPercent": 0,
            "cooldown": 2
        }
    ]
}
const eustathiusTheWhite = {
    name: "Евстафий",
    moves: [
        {
            "name": "Удар боевым кадилом",
            "physicalDmg": 2,
            "magicDmg": 0,
            "physicArmorPercent": 0,
            "magicArmorPercent": 50,
            "cooldown": 0
        },
        {
            "name": "Вертушка левой пяткой",
            "physicalDmg": 4,
            "magicDmg": 0,
            "physicArmorPercent": 0,
            "magicArmorPercent": 0,
            "cooldown": 4
        },
        {
            "name": "Каноничный фаербол",
            "physicalDmg": 0,
            "magicDmg": 5,
            "physicArmorPercent": 0,
            "magicArmorPercent": 0,
            "cooldown": 3
        },
        {
            "name": "Магический блок",
            "physicalDmg": 0,
            "magicDmg": 0,
            "physicArmorPercent": 100,
            "magicArmorPercent": 100,
            "cooldown": 4
        }
    ]
}

function choseFromList(choices, message) {
    let counter = 0;
    for (let choice of choices) {
        console.log(`[${++counter}] ${choice}`);
    }
    console.log(`\n${message}`);
    let conditionOnExit = false;
    let userInput;
    while(!conditionOnExit) {
        userInput = prompt();
        if(1 > userInput || counter < userInput || isNaN(userInput)) {
            console.log("Incorrect input");
            continue;
        }
        conditionOnExit = true;
    }
    return userInput - 1;
}

function createBattleState(difficultyLevel) {
    let newState = Object.create(null);
    newState.stateCode = true;
    newState["fierceHeadHealth"] = fierceHead.maxHealth;
    newState["eustathuisTheWhiteHealth"] = difficultyLevel;
    newState["currentlyOnCooldown"] = [];
    newState.updateState = function (dmg2Fierce, dmg2Eusta) {
        newState["fierceHeadHealth"] -= dmg2Fierce;
        newState["eustathuisTheWhiteHealth"] -= dmg2Eusta;
        if(newState["fierceHeadHealth"] <= 0 && 0 >= newState["eustathuisTheWhiteHealth"]) {
            console.log("Ничья");
            newState.stateCode = false;
        } else if(newState["fierceHeadHealth"] <= 0 || 0 >= newState["eustathuisTheWhiteHealth"]) {
            console.log(`${newState["fierceHeadHealth"] <= 0 ? "Евстафий" : "Лютый монстр"} выиграл`)
            newState.stateCode = false;
        }
    }
    newState.checkForCooldowns = function (move) {
        for(let onCoolDown of this["currentlyOnCooldown"]) {
            if(move.name === onCoolDown.name) return true;
        }
        return false;
    }
    newState.monsterMove = function () {
        let iterativeMethod = true;
        let nextMove;
        while(iterativeMethod) {
            let moveIndex = Math.floor(Math.random() * 3);
            nextMove = fierceHead.moves[moveIndex];
            if(!this.checkForCooldowns(nextMove)) iterativeMethod = false;
        }
        return nextMove;
    }
    newState.eustaMove = function () {
        let iterativeMethod = true;
        let nextMove;
        while(iterativeMethod) {
            let moveId = choseFromList(["Удар боевым кадилом", "Вертушка левой пяткой", "Каноничный фаербол", "Магический блок"], "Выбери ход!");
            if(moveId === -1) {
                console.log("Необходимо выбрать ход!");
            } else if(this.checkForCooldowns(eustathiusTheWhite.moves[moveId])) {
                console.log("Этот ход сейчас на кулдауне!");
                continue;
            }
            nextMove = eustathiusTheWhite.moves[moveId];
            iterativeMethod = false;
        }
        return nextMove;
    }
    newState.updateCooldowns = function (...moves) {
        this["currentlyOnCooldown"] = this["currentlyOnCooldown"].map(cooling => {
            cooling.cooldown--;
            return cooling;
        });
        for (let move of moves) {
            let newOnCooldown = Object.create(null);
            newOnCooldown.name = move["name"];
            newOnCooldown.cooldown = move["cooldown"];
            this["currentlyOnCooldown"].push(newOnCooldown);
        }
        this["currentlyOnCooldown"] = this["currentlyOnCooldown"].filter(cooling => cooling.cooldown !== 0);
    }
    return newState;
}

function percents(num, percents) {
    return num * (100 - percents) / 100;
}

function summariseMoves(fierceMove, eustathiusMove) {
    let fromEusta = percents(eustathiusMove["physicalDmg"], fierceMove["physicArmorPercent"])
        + percents(eustathiusMove["magicDmg"], fierceMove["magicArmorPercent"]);
    let fromFierce = percents(fierceMove["physicalDmg"], eustathiusMove["physicArmorPercent"])
        + percents(fierceMove["magicDmg"], eustathiusMove["magicArmorPercent"]);
    return {fromEusta, fromFierce};
}

module.exports.startMagicBattle = function () {
    const difficulty = choseFromList(["Просто (20 hp)", "Норм (15 hp)", "Средне (10 hp)", "Сложно, удачи (5 hp)"],
                            "Выбери уровень сложности (он влияет только на уровень здоровья)");
    const battleState = createBattleState(20 - 5 * difficulty);
    console.log("Начало раунда!");
    while (battleState.stateCode) {
        const fierceMove = battleState.monsterMove();
        const eustathiusMove = battleState.eustaMove();
        console.log(`Евстафий использует ${eustathiusMove.name}, лютый монстр выбирает ${fierceMove.name}`);
        const {fromEusta, fromFierce} = summariseMoves(fierceMove, eustathiusMove);
        console.log(`Евстафий получает ${fromFierce} урона, лютый монстр - ${fromEusta}`);
        console.log(`Здоровье героев следующее: ${battleState["eustathuisTheWhiteHealth"]} у Евстафия; ${battleState["fierceHeadHealth"]} у лютого монстра`);
        battleState.updateCooldowns(fierceMove, eustathiusMove);
        battleState.updateState(fromEusta, fromFierce);
    }
}