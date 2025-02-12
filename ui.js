function displayQuestion(question) {
    const questionDisplay = document.getElementById("question-display");
    questionDisplay.textContent = question;
}

function clearAnswerInput() {
    const answerInput = document.getElementById("answer-input");
    answerInput.value = "";
}

function displayScore(score) {
    const scoreDisplay = document.getElementById("score-display");
    scoreDisplay.textContent = `Score: ${score}`;
}

function displayTimer(time) {
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `Time: ${time} seconds`;
}

function updateLeaderboardUI(leaderboardData) {
    const leaderboardList = document.getElementById("leaderboard-list");
    leaderboardList.innerHTML = "";
    leaderboardData.forEach(entry => {
        const listItem = document.createElement("li");
        listItem.textContent = `${entry.playerName}: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}

function showMainMenu() {
    document.getElementById("main-menu").style.display = "block";
    document.getElementById("game-area").style.display = "none";
    document.getElementById("leaderboard-area").style.display = "none";
}

function showGameArea() {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game-area").style.display = "block";
    document.getElementById("leaderboard-area").style.display = "none";
}

function showLeaderboardArea() {
    document.getElementById("main-menu").style.display = "none";
    document.getElementById("game-area").style.display = "none";
    document.getElementById("leaderboard-area").style.display = "block";
}

export {
    displayQuestion,
    clearAnswerInput,
    displayScore,
    displayTimer,
    updateLeaderboardUI,
    showMainMenu,
    showGameArea,
    showLeaderboardArea
};
