// routes/tasks.js
const express = require("express");
const pool = require("../db"); 
const router = express.Router();

// Get all tasks for a user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
      [userId]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Add a new task
router.post("/", async (req, res) => {
  const { userId, text } = req.body;
  try {
    const newTask = await pool.query(
      "INSERT INTO tasks (user_id, text, is_complete) VALUES ($1, $2, false) RETURNING *",
      [userId, text]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update task
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { isComplete } = req.body;
  try {
    const updatedTask = await pool.query(
      "UPDATE tasks SET is_complete = $1 WHERE id = $2 RETURNING *",
      [isComplete, id]
    );
    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
