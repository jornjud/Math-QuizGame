// script.js
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

// เก็บข้อมูลของข้อที่ตอบผิด
let incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };

/* ------------------- ส่วนฟังก์ชันช่วยจัดรูปแบบโจทย์ ------------------- */
// เติมช่องว่างทางซ้าย (Pad Left) ให้ตัวเลขมีความยาวตามต้องการ
function padLeft(num, width) {
  let s = num.toString();
  while (s.length < width) {
    s = ' ' + s;
  }
  return s;
}

// จัดรูปแบบโจทย์ในแท็ก <pre> เพื่อให้ตัวเลขแต่ละหลักอยู่คอลัมน์เดียวกัน
function formatQuestion(num1, op, num2) {
  // เปลี่ยนสัญลักษณ์คูณให้เป็น '×' หรือจะใช้ '*' ก็ได้
  const opChar = (op === '×') ? '×' : op;
  
  // กำหนดให้แต่ละตัวเลขมีความกว้าง 3 ตัวอักษร เช่น " 90", " 49"
  const strNum1 = padLeft(num1, 3);
  const strNum2 = padLeft(num2, 3);
  
  // สร้างโจทย์ 3 บรรทัด เช่น
  //   90
  // - 49
  // =  ?
  // แล้วห่อด้วย <pre class="aligned-question"> (กำหนดฟอนต์เป็น Monospaced ใน styles.css)
  return `
<pre class="aligned-question">
${strNum1}
${opChar}${strNum2.slice(1)}
=  ?
</pre>
`;
}
/* -------------------------------------------------------------------- */

// ตั้งเวลาสำหรับโหมดจับเวลา
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

// เริ่มนับถอยหลัง
function startTimer() {
  if (timer) clearInterval(timer);
  const timerDisplay = document.getElementById('timer-display');
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `เวลา: ${timeLeft} วินาที`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      // หมดเวลา
      document.getElementById('result').innerText = `หมดเวลา! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
      incorrectAnswers++;
      incorrectQuestionData.question = document.getElementById('question').textContent;
      incorrectQuestionData.correctAnswer = currentQuestion.answer;
      // ถ้าไม่มีการกรอกคำตอบ ให้เป็น "No answer"
      const userAns = document.getElementById('answer').value;
      incorrectQuestionData.userAnswer = userAns ? userAns : "No answer";
      showGameOverMenu();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) clearInterval(timer);
}

/* ------------------- ฟังก์ชันการทำงานหลักของ Quiz ------------------- */
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
  
  // รีเซ็ตค่าสถิติต่าง ๆ
  score = 0;
  questionsAnswered = 0;
  correctAnswers = 0;
  incorrectAnswers = 0;
  incorrectQuestionData = { question: "", userAnswer: "", correctAnswer: "" };

  generateQuestion();
  if (isTimedMode) {
    gameMode = 'Timed';
    startTimer();
  } else {
    gameMode = 'Normal';
  }
}

// สุ่มโจทย์เลข + แสดงบนหน้า
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

  // ใช้ formatQuestion() เพื่อจัดเลขให้อยู่คอลัมน์เดียวกัน
  const formattedQuestion = formatQuestion(num1, operation, num2);
  
  document.getElementById('question').innerHTML = formattedQuestion;
  document.getElementById('answer').value = '';
  document.getElementById('result').innerText = '';
  document.getElementById('answer').focus(); // โฟกัสช่องกรอกคำตอบ
}

// ตรวจคำตอบ
function checkAnswer(isTimeout = false) {
  const userAnswer = parseInt(document.getElementById('answer').value);
  
  if (isTimeout) {
    // จัดการใน startTimer() เมื่อหมดเวลา
    return;
  } else if (userAnswer === currentQuestion.answer) {
    score++;
    correctAnswers++;
    document.getElementById('result').innerText = 'ถูกต้อง! 🎉';
    questionsAnswered++;
    document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
    generateQuestion();
    if (isTimedMode) {
      // เริ่มนับถอยหลังใหม่เมื่อขึ้นโจทย์ใหม่
      startTimer();
    }
  } else {
    document.getElementById('result').innerText = `ผิด! คำตอบที่ถูกคือ ${currentQuestion.answer} 😢`;
    incorrectAnswers++;
    // บันทึกข้อมูลข้อที่ตอบผิด
    incorrectQuestionData.question = document.getElementById('question').textContent;
    incorrectQuestionData.correctAnswer = currentQuestion.answer;
    incorrectQuestionData.userAnswer = document.getElementById('answer').value;
    questionsAnswered++;
    document.getElementById('score').innerText = `คะแนน: ${score} 🏆`;
    showGameOverMenu();
  }
}

// แสดงเมนูเกมจบ
function showGameOverMenu() {
  stopTimer();
  document.getElementById('quiz-section').style.display = 'none';
  document.getElementById('game-over-menu').style.display = 'block';
  
  document.getElementById('final-player-name').textContent = playerName;
  document.getElementById('final-score').textContent = score;
  
  // บันทึกข้อมูลลง Google Sheet
  recordGameData();
}

function restartQuiz() {
  document.getElementById('game-over-menu').style.display = 'none';
  document.getElementById('quiz-section').style.display = 'block';
  // รีเซ็ตข้อมูลและเริ่มใหม่
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

// รีเซ็ตตัวแปรเกม
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

// บันทึกข้อมูลทั้งหมดและส่งฟอร์ม
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

// ปุ่มตัวเลข
function addToAnswer(num) {
  const answerField = document.getElementById('answer');
  answerField.value += num;
}

// กด Enter ในช่องกรอกคำตอบ = ตรวจคำตอบ
document.getElementById('answer').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // ป้องกัน default ที่อาจเกิดการ submit form
    checkAnswer();
  }
});
