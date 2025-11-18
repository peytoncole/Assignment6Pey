const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/university.db");

// GET all courses
router.get("/", (req, res) => {
  db.all(`SELECT * FROM courses`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET course by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Course not found" });

    res.json(row);
  });
});

// POST create new course
router.post("/", (req, res) => {
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    `INSERT INTO courses (courseCode, title, credits, description, semester)
     VALUES (?, ?, ?, ?, ?)`,
    [courseCode, title, credits, description, semester],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ id: this.lastID });
    }
  );
});

// PUT update course
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { courseCode, title, credits, description, semester } = req.body;

  db.run(
    `UPDATE courses 
     SET courseCode = ?, title = ?, credits = ?, description = ?, semester = ?
     WHERE id = ?`,
    [courseCode, title, credits, description, semester, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

      res.json({ message: "Course updated" });
    }
  );
});

// DELETE course
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM courses WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Course not found" });

    res.json({ message: "Course deleted" });
  });
});

module.exports = router;
