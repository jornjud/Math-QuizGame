let currentQuestion = {};
let score = 0;
let playerName = '';
let timer = null;
let timeLeft = 0;
let isTimedMode = false;
let questionsAnswered = 0;
let correctAnswers = 0;
let incorrectAnswers = 0;
let gameMode = '';
let selectedTime = 0;

// Global object to store details of the incorrectly answered question
let incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };

// Timer functions
function setTimer(duration) {
    timeLeft = duration;
    isTimedMode = true;
    selectedTime = duration;
    startQuiz();
}

function setCustomTimer() {
    const customTime = document.getElementById('custom-timer').value;
    if (customTime) {
        timeLeft = parseInt(customTime);
        isTimedMode = true;
        selectedTime = timeLeft;
        startQuiz();
    }
}

function startTimer() {
    if (timer) clearInterval(timer);
    const timerDisplay = document.getElementById('timer-display');
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `เวลา: ${timeLeft} วินาที`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            // On time out, record as incorrect answer
            document.getElementById('result').innerText = `หมดเวลา! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
            incorrectAnswers++;
            incorrectQuestionData.question = document.getElementById('question').textContent;
            incorrectQuestionData.correctAnswer = currentQuestion.answer;
            // If no answer was entered, mark as "No answer"
            const userAns = document.getElementById('answer').value;
            incorrectQuestionData.userAnswer = userAns ? userAns : "No answer";
            showGameOverMenu();
        }
    }, 1000);
}

function stopTimer() {
    if (timer) clearInterval(timer);
}

// Quiz functions
function startNormalMode() {
    isTimedMode = false;
    gameMode = 'Normal';
    playerName = document.getElementById('player-name').value;
    if (playerName.trim() === '') {
        alert('กรุณากรอกชื่อผู้เล่น');
        return;
    }
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    generateQuestion();
}

function startTimedMode() {
    document.getElementById('timed-mode-options').style.display = 'flex';
}

function startQuiz() {
    playerName = document.getElementById('player-name').value;
    if (playerName.trim() === '') {
        alert('กรุณากรอกชื่อผู้เล่น');
        return;
    }
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('timed-mode-options').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    score = 0;
    questionsAnswered = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    // Reset any previous incorrect answer data
    incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };
    generateQuestion();
    if (isTimedMode) {
        gameMode = 'Timed';
        startTimer();
    } else {
        gameMode = 'Normal';
    }
}

function generateQuestion() {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    if (operation === '×') {
        num1 = Math.floor(Math.random() * 11) + 2;
        num2 = Math.floor(Math.random() * 11);
        answer = num1 * num2;
    } else {
        num1 = Math.floor(Math.random() * 90) + 10;
        if (operation === '-') {
            num2 = Math.floor(Math.random() * num1);
        } else {
            num2 = Math.floor(Math.random() * 90) + 10;
        }
        answer = operation === '+' ? num1 + num2 : num1 - num2;
    }

    currentQuestion = {
        num1: num1,
        num2: num2,
        operation: operation,
        answer: answer
    };

    const formattedQuestion = operation === '×'
        ? `${num1} <br>× <br>${num2} = ?`
        : `${num1} <br>${operation} <br>${num2} = ?`;

    document.getElementById('question').innerHTML = formattedQuestion;
    document.getElementById('answer').value = '';
    document.getElementById('result').innerText = '';
    // โฟกัสช่องกรอกคำตอบเมื่อมีคำถามใหม่
    document.getElementById('answer').focus();
}

function checkAnswer(isTimeout = false) {
    const userAnswer = parseInt(document.getElementById('answer').value);
    
    if (isTimeout) {
        // This branch is now handled in startTimer() when time reaches zero.
        return;
    } else if (userAnswer === currentQuestion.answer) {
        score++;
        correctAnswers++;
        document.getElementById('result').innerText = 'ถูกต้อง! 🎉';
        questionsAnswered++;
        document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
        generateQuestion();
        if (isTimedMode) {
            // Restart timer for the next question
            startTimer();
        }
    } else {
        document.getElementById('result').innerText = `ผิด! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
        incorrectAnswers++;
        // Record details of the incorrect answer
        incorrectQuestionData.question = document.getElementById('question').textContent;
        incorrectQuestionData.correctAnswer = currentQuestion.answer;
        incorrectQuestionData.userAnswer = document.getElementById('answer').value;
        questionsAnswered++;
        document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
        showGameOverMenu();
    }
}

function showGameOverMenu() {
    stopTimer();
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('game-over-menu').style.display = 'block';
    
    document.getElementById('final-player-name').textContent = playerName;
    document.getElementById('final-score').textContent = score;
    
    // Record all game data after game over
    recordGameData();
}

function restartQuiz() {
    document.getElementById('game-over-menu').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    // Reset timer and incorrect answer details
    stopTimer();
    incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };
    generateQuestion();
    if (isTimedMode) {
        startTimer();
    }
}

function goToMainMenu() {
    document.getElementById('game-over-menu').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
    resetQuiz();
}

// Reset game variables
function resetQuiz() {
    score = 0;
    timeLeft = 0;
    isTimedMode = false;
    questionsAnswered = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };
    document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
    document.getElementById('timer-display').innerText = '';
    stopTimer();
}

// Record all game data and submit the form
function recordGameData() {
    const form = document.getElementById('submit-score-form');
    form.playerName.value = playerName;
    form.score.value = score;
    form.gameMode.value = gameMode;
    form.selectedTime.value = isTimedMode ? selectedTime : "";
    form.questionsAnswered.value = questionsAnswered;
    form.correctAnswers.value = correctAnswers;
    form.incorrectAnswers.value = incorrectAnswers;
    form.dateTime.value = new Date().toLocaleString();
    form.incorrectQuestion.value = incorrectQuestionData.question;
    form.incorrectUserAnswer.value = incorrectQuestionData.userAnswer;
    form.incorrectCorrectAnswer.value = incorrectQuestionData.correctAnswer;
    form.submit();
}

// Number pad function
function addToAnswer(num) {
    const answerField = document.getElementById('answer');
    answerField.value += num;
}

// เพิ่ม event listener สำหรับกด Enter ในช่องกรอกคำตอบ
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // ป้องกันพฤติกรรมค่าเริ่มต้นของ Enter
        checkAnswer();
    }
});
