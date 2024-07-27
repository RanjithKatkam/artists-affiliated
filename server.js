const bodyParser = require("body-parser");
const express = require("express");
const db = require("./db/database");
const app = express();

const PORT = 3000;
app.use(bodyParser.json());

app.get("/transactions", (req, res) => {
    db.all(`SELECT * FROM transactions`, (err, rows) => {
        if (err) {
            console.log("Error fetching data: ", err.message);
            res.status(500).send("Error fetching transactions.");
        } else {
            res.send(rows);
        }
    });
});

app.post("/add-transaction", (req, res) => {
    const { type, amount, description, date, running_balance } = req.body;
    if (!type || !amount || !description || !date || running_balance === undefined) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    if (description.trim() === "") {
        return res.status(400).json({ error: "Description cannot be empty" });
    }

    const query = `INSERT INTO transactions(type, amount, description, date, running_balance) VALUES (?, ?, ?, ?, ?)`;
    db.run(query, [type, amount, description, date, running_balance], function (err) {
        if (err) {
            console.error("Error Inserting Trasaction: ", err.message);
            res.status(500).send("Error inserting transaction: ", err.message);
        } else {
            res.status(201).send(`Transaction successfully Added to Database with ID ${this.lastID}`);
        }
    });
});

app.listen(PORT, () => {
    console.log("Server is started and running on " + PORT);
});
