/*
* TASK 3
* */
const {prompt} = require("readline-sync");

module.exports.guessTheNum = function () {

    function codeGenerator() {
        let generatedLen = Math.floor(Math.random() * 4) + 3;
        let generatedNum = [];
        while (generatedNum.length < generatedLen) {
            let num = Math.floor(Math.random() * 10);
            if (generatedNum.includes(num)) continue;
            generatedNum.push(num);
        }
        return {num: generatedNum.join(""), len: generatedLen};
    }

    const {num, len} = codeGenerator();

    console.log(`Guess the number of length ${len}`)
    for (let tryCounter = len; tryCounter > 0;) {
        console.log(`You have ${tryCounter} tries left`);
        let userInput = prompt();
        if (isNaN(userInput)) {
            console.log("Incorrect input, fortunately, doesn't count as a try");
            continue;
        }
        let inPlace = 0, inString = 0;
        Array.from(userInput).forEach((dig, place) => {
            if (num.includes(dig) && num[place] === dig) {
                inPlace++
            } else if (num.includes(dig)) {
                inString++
            }
        })
        console.log(`You have ${inPlace} digits in right place, ${inString} digits not in right place`);
        if (inPlace === len) {
            console.log("Congratulations, you guessed the secret code");
            return;
        }
        tryCounter--;
    }
    console.log(`You lost, the answer was ${num}`);
}
