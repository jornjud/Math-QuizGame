import { GoogleSpreadsheet } from 'google-spreadsheet';

const SPREADSHEET_ID = 'your-spreadsheet-id';
const SHEET_ID = 'your-sheet-id';
const CLIENT_EMAIL = 'your-service-account-email';
const PRIVATE_KEY = 'your-private-key';

async function fetchLeaderboard(mode) {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[SHEET_ID];
    const rows = await sheet.getRows();
    return rows.filter(row => row.mode === mode).map(row => ({
        playerName: row.playerName,
        score: row.score,
    }));
}

async function saveScore(playerName, score, mode) {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsById[SHEET_ID];
    await sheet.addRow({ playerName, score, mode });
}

export { fetchLeaderboard, saveScore };
