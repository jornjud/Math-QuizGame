let score = 0;

function updateScore(points) {
    score += points;
}

function resetScore() {
    score = 0;
}

function getScore() {
    return score;
}

export { score, updateScore, resetScore, getScore };
