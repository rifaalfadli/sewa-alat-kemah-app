// backend/server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Default XAMPP
  database: "tiga_titik_outdoor",
});

// Login Logic (SRS 2.4)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const sql = "SELECT * FROM pelanggan WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, data) => {
    if (data.length > 0) return res.json({ Login: true, user: data[0] });
    return res.json({ Login: false });
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
