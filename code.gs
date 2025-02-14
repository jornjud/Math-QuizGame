/**
 * โค้ด Google Apps Script สำหรับรับข้อมูลจากเกมและบันทึกลง Google Sheet
 * โดย header จะมีคอลัมน์ดังนี้: Timestamp, Player Name, Mode, Score, Question, User Answer, Correct Answer
 */

function doPost(e) {
  try {
    // แปลงข้อมูล JSON ที่ส่งมาจากฟังก์ชัน fetch ใน script.js
    var data = JSON.parse(e.postData.contents);
    
    // ระบุ Sheet ID และ Sheet Name ที่ต้องการบันทึกข้อมูล
    var SHEET_ID = '1OF8Q5xdYkrz0t3SwNWi9NfHPU9aj2y0kb7QgBX833FE';        // เปลี่ยนเป็น Sheet ID ของคุณ
    var SHEET_NAME = 'Scores';      // เปลี่ยนเป็นชื่อ sheet ที่คุณต้องการ

    // เปิดสเปรดชีตและเรียกใช้ sheet ตามชื่อที่กำหนด
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    
    // หากไม่พบ sheet ที่กำหนดไว้ ให้สร้างใหม่และตั้ง header ตามที่กำหนด
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Timestamp", "Player Name", "Mode", "Score", "Question", "User Answer", "Correct Answer"]);
    }
    
    // เตรียมข้อมูล wrongAnswer โดยแยกออกเป็นแต่ละฟิลด์ หากไม่มีข้อมูลก็ให้เป็นค่าว่าง
    var wrong = data.wrongAnswer || {};
    
    // บันทึกข้อมูลใหม่ โดยแทรกค่าวันที่และเวลา พร้อมข้อมูลที่ส่งมา
    sheet.appendRow([
      new Date(),
      data.playerName || "",
      data.mode || "",
      data.score || 0,
      wrong.question || "",
      wrong.userAnswer || "",
      wrong.correctAnswer || ""
    ]);
    
    // ส่งกลับผลลัพธ์ในรูปแบบ JSON เมื่อบันทึกสำเร็จ
    return ContentService
      .createTextOutput(JSON.stringify({result: "success", data: data}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // หากเกิดข้อผิดพลาด ให้ส่งกลับข้อความ error ในรูปแบบ JSON
    return ContentService
      .createTextOutput(JSON.stringify({result: "error", error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
