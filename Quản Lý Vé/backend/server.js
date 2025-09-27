const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Lỗi kết nối DB:", err.message);
  } else {
    console.log("Kết nối database thành công!");
  }
});

db.run(`CREATE TABLE IF NOT EXISTS Ve (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  maVe TEXT,
  giaVe REAL,
  tenPhim TEXT,
  theLoai TEXT,
  ngay TEXT
)`);

app.get("/api/ve", (req, res) => {
  db.all("SELECT * FROM Ve", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/ve", (req, res) => {
  const { maVe, giaVe, tenPhim, theLoai, ngay } = req.body;
  db.run(
    `INSERT INTO Ve (maVe, giaVe, tenPhim, theLoai, ngay) VALUES (?, ?, ?, ?, ?)`,
    [maVe, giaVe, tenPhim, theLoai, ngay],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, maVe, giaVe, tenPhim, theLoai, ngay });
    }
  );
});

app.put("/api/ve/:id", (req, res) => {
  const { id } = req.params;
  const { maVe, giaVe, tenPhim, theLoai, ngay } = req.body;
  db.run(
    `UPDATE Ve SET maVe=?, giaVe=?, tenPhim=?, theLoai=?, ngay=? WHERE id=?`,
    [maVe, giaVe, tenPhim, theLoai, ngay, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Cập nhật thành công" });
    }
  );
});

app.delete("/api/ve/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM Ve WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Xóa thành công" });
  });
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
