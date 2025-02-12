let timer;
let timeElapsed = 0;

function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        displayTime();
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetTimer() {
    timeElapsed = 0;
    displayTime();
}

function displayTime() {
    const timerDisplay = document.getElementById("timer-display");
    timerDisplay.textContent = `Time: ${timeElapsed} seconds`;
}

export { startTimer, stopTimer, resetTimer };
