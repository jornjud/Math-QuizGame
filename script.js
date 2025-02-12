import { createQuestion, checkAnswer } from './js/gameLogic.js';
import { startTimer, stopTimer, resetTimer } from './js/timer.js';
import { updateScore, resetScore, getScore } from './scoring.js';
import { fetchLeaderboard, saveScore } from './googleSheet.js';
import { displayQuestion, clearAnswerInput, displayScore, displayTimer, updateLeaderboardUI, showMainMenu, showGameArea, showLeaderboardArea } from './ui.js';

document.getElementById("times-tables-btn").addEventListener("click", () => startGameMode("times-tables"));
document.getElementById("plus-minus-btn").addEventListener("click", () => startGameMode("plus-minus"));
document.getElementById("view-scores-btn").addEventListener("click", showLeaderboard);

document.getElementById("submit-answer-btn").addEventListener("click", submitAnswer);
document.getElementById("back-to-menu-btn").addEventListener("click", showMainMenu);
document.getElementById("back-to-menu-from-leaderboard-btn").addEventListener("click", showMainMenu);

let currentGameMode;
let currentQuestion;
let timeLeft;
let timerInterval;

function startGameMode(mode) {
    currentGameMode = mode;
    resetGame();
    generateNewQuestion();
    showGameArea();
    if (mode === "times-tables-time-challenge" || mode === "plus-minus-time-challenge") {
        startChallengeTimer();
    }
}

function resetGame() {
    resetScore();
    resetTimer();
    displayScore(getScore());
    displayTimer(timeLeft);
    clearAnswerInput();
}

function generateNewQuestion() {
    currentQuestion = createQuestion(currentGameMode);
    displayQuestion(currentQuestion.question);
}

function submitAnswer() {
    const userAnswer = document.getElementById("answer-input").value;
    if (checkAnswer(userAnswer, currentQuestion.correctAnswer)) {
        updateScore(10);
        displayScore(getScore());
        generateNewQuestion();
    } else {
        alert("Incorrect answer, try again!");
    }
    clearAnswerInput();
}

function startChallengeTimer() {
    timeLeft = 60;
    displayTimer(timeLeft);
    timerInterval = setInterval(() => {
        timeLeft--;
        displayTimer(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Time's up! Your score is: " + getScore());
            showMainMenu();
        }
    }, 1000);
}

function showLeaderboard() {
    fetchLeaderboard(currentGameMode).then(leaderboardData => {
        updateLeaderboardUI(leaderboardData);
        showLeaderboardArea();
    });
}

showMainMenu();
