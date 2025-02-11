document.getElementById('player-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const playerName = document.getElementById('player-name').value;
    document.getElementById('player-form').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
});

document.getElementById('normal-mode').addEventListener('click', function() {
    startGame('normal');
});

document.getElementById('timed-mode').addEventListener('click', function() {
    document.getElementById('timer-settings').style.display = 'block';
    document.getElementById('timer').addEventListener('change', function() {
        const timerValue = document.getElementById('timer').value;
        startGame('timed', timerValue);
    });
});

document.getElementById('return-main-menu').addEventListener('click', function() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
    document.getElementById('player-form').style.display = 'block';
    document.getElementById('statistics').style.display = 'none';
});

document.getElementById('numeric-keypad').addEventListener('click', function(event) {
    const value = event.target.getAttribute('data-value');
    const answerInput = document.getElementById('answer');
    if (value === 'clear') {
        answerInput.value = '';
    } else {
        answerInput.value += value;
    }
});

function startGame(mode, timerValue = 0) {
    document.getElementById('mode-selection').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('statistics').style.display = 'none';
    let score = 0;
    let questionCount = 0;
    let timer;

    if (mode === 'timed') {
        timer = setTimeout(function() {
            endGame(mode, score);
        }, timerValue * 1000);
    }

    generateQuestion();

    document.getElementById('submit-answer').addEventListener('click', function() {
        const answer = parseInt(document.getElementById('answer').value);
        const correctAnswer = parseInt(document.getElementById('question').dataset.answer);
        if (answer === correctAnswer) {
            score++;
        }
        questionCount++;
        if (questionCount < 10) {
            generateQuestion();
        } else {
            if (mode === 'timed') {
                clearTimeout(timer);
            }
            endGame(mode, score);
        }
    });
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 11) + 2;
    const num2 = Math.floor(Math.random() * 11) + 2;
    const question = `${num1} x ${num2} = ?`;
    const answer = num1 * num2;
    document.getElementById('question').textContent = question;
    document.getElementById('question').dataset.answer = answer;
}

function endGame(mode, score) {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('statistics').style.display = 'block';
    document.getElementById('mode-played').textContent = `โหมดที่เล่น: ${mode === 'normal' ? 'ปกติ' : 'จับเวลา'}`;
    document.getElementById('score').textContent = `คะแนนที่ได้: ${score}`;
}
