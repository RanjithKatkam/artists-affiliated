const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
    db.run(
        `CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            amount INTEGER NOT NULL,
            description TEXT UNIQUE NOT NULL,
            date TEXT NOT NULL,
            running_balance INTEGER NOT NULL
        )`,
        (err) => {
            if (err) {
                console.error("Error Creating table: ", err.message);
            } else {
                console.log("Transactions table created or already exists");
                const query = db.prepare(`
                        INSERT OR IGNORE INTO transactions (type, amount, description, date, running_balance) VALUES (?, ?, ?, ?, ?)
                    `);
                query.run(`credit`, 10000, "Credited to Office Account", "2024-05-17", 10000);
                query.run(`debit`, 1000, "Snacks Party", "2024-05-22", 9000);
                query.run(`debit`, 200, "Priniting sheets for Office documents", "2024-05-25", 8800);
                query.run(`debit`, 2000, "other expenses", "2024-05-25", 6800);
                query.finalize();
                console.log("Initial Transactions Added.");
            }
        }
    );
});

module.exports = db;
