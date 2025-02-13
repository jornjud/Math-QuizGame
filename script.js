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
            checkAnswer(true); // Auto-check on timeout
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
    generateQuestion();
    if (isTimedMode) {
        gameMode = 'Timed';
        startTimer();
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
}

function checkAnswer(isTimeout = false) {
    const userAnswer = parseInt(document.getElementById('answer').value);
    stopTimer();
    
    if (isTimeout) {
        document.getElementById('result').innerText = `หมดเวลา! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
        incorrectAnswers++;
    } else if (userAnswer === currentQuestion.answer) {
        score++;
        correctAnswers++;
        document.getElementById('result').innerText = 'ถูกต้อง! 🎉';
        generateQuestion(); // Remove the condition to always generate new question
    } else {
        document.getElementById('result').innerText = `ผิด! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
        incorrectAnswers++;
        recordIncorrectAnswer();
        showGameOverMenu();
    }

    questionsAnswered++;
    document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
}

function showGameOverMenu() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('game-over-menu').style.display = 'block';
    
    document.getElementById('final-player-name').textContent = playerName;
    document.getElementById('final-score').textContent = score;
    
    if (isTimedMode) {
        submitScore();
    } else {
        recordGameOver();
    }
}

function restartQuiz() {
    document.getElementById('game-over-menu').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
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

function resetQuiz() {
    score = 0;
    timeLeft = 0;
    isTimedMode = false;
    questionsAnswered = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
    stopTimer();
    document.getElementById('timer-display').innerText = '';
}

// Player data submission
function recordIncorrectAnswer() {
    const form = document.getElementById('record-answer-form');
    form.playerName.value = playerName;
    // Get the HTML content of the question (including <br> and formatting)
    form.question.value = document.getElementById('question').innerHTML;
    form.correctAnswer.value = currentQuestion.answer;
    form.userAnswer.value = document.getElementById('answer').value;
    form.submit();
}

function submitScore() {
    const form = document.getElementById('submit-score-form');
    form.playerName.value = playerName;
    form.score.value = score;
    form.gameMode.value = gameMode;
    form.selectedTime.value = selectedTime; // Only relevant for timed mode
    form.questionsAnswered.value = questionsAnswered;
    form.correctAnswers.value = correctAnswers;
    form.incorrectAnswers.value = incorrectAnswers;
    form.submit();
}

function recordGameOver() {
    const form = document.getElementById('submit-score-form');
    form.playerName.value = playerName;
    form.score.value = score;
    form.gameMode.value = gameMode;
    form.selectedTime.value = selectedTime;
    form.questionsAnswered.value = questionsAnswered;
    form.correctAnswers.value = correctAnswers;
    form.incorrectAnswers.value = incorrectAnswers;
    form.action = 'https://script.google.com/macros/s/AKfycbyh_yxJkzrKt-i4HVoXO_9kacplw_oQ4lDel-Rz69EhgQqU-UAX7_4run2q4NxjkeYM/exec?action=recordGameOver';
    console.log('Form action:', form.action);
    console.log('Form data:', form);
	form.submit();
}

// Number pad
function addToAnswer(num) {
    const answerField = document.getElementById('answer');
    answerField.value += num;
}