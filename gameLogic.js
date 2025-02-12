function createQuestion(mode) {
    let question = "";
    let correctAnswer = 0;

    if (mode === "times-tables") {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        question = `${num1} x ${num2}`;
        correctAnswer = num1 * num2;
    } else if (mode === "plus-minus") {
        const num1 = Math.floor(Math.random() * 100) + 1;
        const num2 = Math.floor(Math.random() * 100) + 1;
        const operator = Math.random() < 0.5 ? "+" : "-";
        question = `${num1} ${operator} ${num2}`;
        correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    }

    return { question, correctAnswer };
}

function checkAnswer(userAnswer, correctAnswer) {
    return parseInt(userAnswer) === correctAnswer;
}

export { createQuestion, checkAnswer };
