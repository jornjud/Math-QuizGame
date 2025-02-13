function doPost(e) {
    try {
        const data = e.parameter;
     
        if (data.action === 'submitScore') {
            submitScore(data);
        } else if (data.action === 'recordGameOver') {
            recordGameOver(data);
        } else {
            recordIncorrectAnswer(data);
        }
     
        return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
    } catch (error) {
        return ContentService.createTextOutput("Error: " + error.message).setMimeType(ContentService.MimeType.TEXT);
    }
}

function submitScore(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ranking');
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1).setValue(data.playerName); // A: Player Name
    sheet.getRange(newRow, 2).setValue(data.score);      // B: Score
    sheet.getRange(newRow, 3).setValue(new Date());     // C: Timestamp
    sheet.getRange(newRow, 4).setValue(data.gameMode);  // D: Game Mode
    sheet.getRange(newRow, 5).setValue(data.selectedTime); // E: Selected Time
    sheet.getRange(newRow, 6).setValue(data.questionsAnswered); // F: Questions Answered
    sheet.getRange(newRow, 7).setValue(data.correctAnswers); // G: Correct Answers
    sheet.getRange(newRow, 8).setValue(data.incorrectAnswers); // H: Incorrect Answers
}

function recordGameOver(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ranking');
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1).setValue(data.playerName); // A: Player Name
    sheet.getRange(newRow, 2).setValue(data.score);      // B: Score
    sheet.getRange(newRow, 3).setValue(new Date());     // C: Timestamp
    sheet.getRange(newRow, 4).setValue(data.gameMode);  // D: Game Mode
    sheet.getRange(newRow, 5).setValue(data.selectedTime); // E: Selected Time
    sheet.getRange(newRow, 6).setValue(data.questionsAnswered); // F: Questions Answered
    sheet.getRange(newRow, 7).setValue(data.correctAnswers); // G: Correct Answers
    sheet.getRange(newRow, 8).setValue(data.incorrectAnswers); // H: Incorrect Answers
}

function recordIncorrectAnswer(data) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ranking');
    const newRow = sheet.getLastRow() + 1;
    sheet.getRange(newRow, 1).setValue(data.playerName);   // A: Player Name
    sheet.getRange(newRow, 4).setValue(data.question);    // D: Question
    sheet.getRange(newRow, 5).setValue(data.correctAnswer); // E: Correct Answer
    sheet.getRange(newRow, 6).setValue(data.userAnswer);   // F: User Answer
    sheet.getRange(newRow, 3).setValue(new Date());      // C: Timestamp
    sheet.getRange(newRow, 9).setValue(data.question);   // I: Incorrectly Answered Question
    sheet.getRange(newRow, 10).setValue(data.userAnswer); // J: Incorrect Answer
    sheet.getRange(newRow, 11).setValue(data.correctAnswer); // K: Correct Answer
}
