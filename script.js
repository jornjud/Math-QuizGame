// Global Variables
let playerName;
let mode;
let score = 0;
let timeLeft;
let timerInterval;
let correctAnswer;
let questionsCount = 0;
let wrongAnswer = null; // เก็บข้อมูลข้อที่ผิด *ข้อเดียว*

// DOM Element References
const playerNameInput = document.getElementById("player_name");
const modeSelect = document.getElementById("mode");
const startButton = document.getElementById("start_button");
const quizContainer = document.getElementById("quiz-container");
const questionDisplay = document.getElementById("question");
const answerInput = document.getElementById("answer");
const submitButton = document.getElementById("submit-button");
const feedbackDisplay = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const nextButton = document.getElementById("next_button");
const resultContainer = document.getElementById("result-container");
const restartButton = document.getElementById("restart-button");
const homeButton = document.getElementById("home-button");

// Event Listeners
startButton.addEventListener("click", startGame);
submitButton.addEventListener("click", checkAnswer);
answerInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});
nextButton.addEventListener('click', nextQuestion);
restartButton.addEventListener("click", restartGame);
homeButton.addEventListener("click", goHome);

// --- Game Functions ---

function startGame() {
    playerName = playerNameInput.value;
    mode = modeSelect.value;

    if (!playerName) {
        alert("Please enter your name. ✍️");
        return;
    }

    // ซ่อนหน้าจอเริ่มต้น และแสดงหน้าคำถาม
    document.getElementById("start-screen").style.display = "none";
    quizContainer.style.display = "block";

    // รีเซ็ตค่าตัวแปรของเกม
    score = 0;
    questionsCount = 0;
    wrongAnswer = null; // รีเซ็ตข้อมูลข้อผิดพลาด
    scoreDisplay.textContent = score;
    feedbackDisplay.textContent = "";
    answerInput.value = ""; // เคลียร์ช่องตอบ

    // ตั้งค่า timer หากเลือกโหมด timed
    if (mode.startsWith("timed")) {
        timeLeft = parseInt(mode.split("-")[1]);
        timerDisplay.style.display = "block";
        timerDisplay.textContent = "Time left: " + timeLeft;
        timerInterval = setInterval(updateTimer, 1000);
    }

    generateQuestion(); // เริ่มถามคำถามแรก
}

function generateQuestion() {
    let num1, num2, operator;
    operator = getRandomOperator();

    if (operator === "*") {
        num1 = getRandomInt(2, 12);
        num2 = getRandomInt(1, 12);
    } else if (operator === "/") {
        num2 = getRandomInt(1, 12);
        num1 = num2 * getRandomInt(1, 12); // เพื่อให้หารลงตัว
    } else {
        num1 = getRandomInt(1, 99);
        num2 = getRandomInt(1, 99);
    }

    questionDisplay.textContent = formatQuestion(num1, num2, operator);
    correctAnswer = calculateAnswer(num1, num2, operator);
    questionsCount++;
}

// ฟังก์ชันช่วยจัดรูปแบบคำถามสำหรับการแสดงผล
function formatQuestion(num1, num2, operator) {
    return `${num1.toString().padStart(2)}\n${operator} ${num2.toString().padStart(2)}`;
}

// ฟังก์ชันคำนวณคำตอบที่ถูกต้อง
function calculateAnswer(num1, num2, operator) {
    let answer;
    switch (operator) {
        case "+":
            answer = num1 + num2;
            break;
        case "-":
            answer = num1 - num2;
            break;
        case "*":
            answer = num1 * num2;
            break;
        case "/":
            answer = num1 / num2;
            break;
    }
    return (typeof answer === 'number') ? Math.round(answer * 100) / 100 : answer; // ปัดเศษ 2 ตำแหน่ง
}

// ฟังก์ชันช่วยสุ่ม operator
function getRandomOperator() {
    const operators = ["+", "-", "*", "/"];
    return operators[getRandomInt(0, operators.length - 1)];
}

// ฟังก์ชันช่วยสุ่มจำนวนเต็ม
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value);

    if (isNaN(userAnswer)) {
        feedbackDisplay.textContent = "Please enter a number. 🤔";
        return;
    }

    if (userAnswer === correctAnswer) {
        feedbackDisplay.textContent = "Correct! 🎉👍";
        score++;
        scoreDisplay.textContent = score;
        answerInput.value = "";
        nextQuestion();
    } else {
        feedbackDisplay.textContent = `Incorrect 😞`;
        // บันทึกข้อมูลข้อที่ผิด (เพียงข้อเดียว)
        wrongAnswer = {
            question: questionDisplay.textContent,
            userAnswer: userAnswer,
            correctAnswer: correctAnswer
        };
        gameOver();
    }
}

function nextQuestion() {
    if (mode === "timed" && timeLeft <= 0) {
        showResult();
        return;
    }
    answerInput.value = "";
    generateQuestion();
}

function updateTimer() {
    timeLeft--;
    timerDisplay.textContent = "Time left: " + timeLeft;
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        showResult();
    }
}

function gameOver() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    let resultHTML = `
        <h2>Game Over! 💔</h2>
        <p>Name: ${playerName}</p>
        <p>Mode: ${mode}</p>
        <p>Score: ${score}</p>
        <p>Questions count: ${questionsCount}</p>
        <h3>Wrong Answer:</h3>
        <p>Question: <pre>${wrongAnswer.question}</pre></p>
        <p>Your Answer: ${wrongAnswer.userAnswer}</p>
        <p>Correct Answer: ${wrongAnswer.correctAnswer}</p>
    `;

    resultHTML += `<button id="restart-in-result">Restart 🔄</button>
                   <button id="home-in-result">Home 🏠</button>`;

    resultContainer.innerHTML = resultHTML;

    document.getElementById("restart-in-result").addEventListener("click", restartGame);
    document.getElementById("home-in-result").addEventListener("click", goHome);

    sendToGoogleSheet({
        playerName: playerName,
        mode: mode,
        score: score,
        wrongAnswer: wrongAnswer
    });
}

function showResult() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    quizContainer.style.display = "none";
    resultContainer.style.display = "block";

    let resultHTML = `
        <h2>Result 🏆</h2>
        <p>Name: ${playerName}</p>
        <p>Mode: ${mode}</p>
        <p>Score: ${score}</p>
        <p>Questions count: ${questionsCount}</p>
        <h3>Wrong Answer:</h3>
        <p>Question: <pre>${wrongAnswer.question}</pre></p>
        <p>Your Answer: ${wrongAnswer.userAnswer}</p>
        <p>Correct Answer: ${wrongAnswer.correctAnswer}</p>
    `;

    resultHTML += `<button id="restart-in-result">Restart 🔄</button>
                   <button id="home-in-result">Home 🏠</button>`;

    resultContainer.innerHTML = resultHTML;
    document.getElementById("restart-in-result").addEventListener("click", restartGame);
    document.getElementById("home-in-result").addEventListener("click", goHome);

    sendToGoogleSheet({
        playerName: playerName,
        mode: mode,
        score: score,
        wrongAnswer: wrongAnswer
    });
}

function restartGame() {
    score = 0;
    timeLeft = undefined;
    timerInterval = undefined;
    correctAnswer = undefined;
    questionsCount = 0;
    wrongAnswer = null; // รีเซ็ต

    resultContainer.style.display = "none";
    quizContainer.style.display = "block";
    feedbackDisplay.textContent = "";
    scoreDisplay.textContent = score;
    answerInput.value = "";

    if (mode.startsWith("timed")) {
        timeLeft = parseInt(mode.split("-")[1]);
        timerDisplay.style.display = "block";
        timerDisplay.textContent = "Time left: " + timeLeft;
        timerInterval = setInterval(updateTimer, 1000);
    }
    generateQuestion();
}

function goHome() {
    score = 0;
    timeLeft = undefined;
    timerInterval = undefined;
    correctAnswer = undefined;
    questionsCount = 0;
    wrongAnswer = null; // รีเซ็ต
    playerNameInput.value = "";

    resultContainer.style.display = "none";
    quizContainer.style.display = "none";
    document.getElementById("start-screen").style.display = "block";
    feedbackDisplay.textContent = "";
    answerInput.value = "";
}

// --- Google Sheets Integration ---

function sendToGoogleSheet(data) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxjjp0iOm7h50Bcu7MyHSLyH6GP-xH0Gp7Y5xaUOfUZfDXr3-NLiLaTzMu88jiIaGGY/exec';

    // ปรับข้อความในคอลัมน์ Question ให้แสดงเป็นบรรทัดเดียว
    if (data.wrongAnswer && data.wrongAnswer.question) {
        data.wrongAnswer.question = data.wrongAnswer.question.split("\n").join("").replace(/\s+/g, "");
    }

    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors', // ใช้ no-cors เพื่อละเว้นปัญหา CORS
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Request sent successfully');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
