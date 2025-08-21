const express = require("express");
const pool = require("../db");
const router = express.Router();

// GET all tasks for user
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const tasks = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    res.json(tasks.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ADD a task
router.post("/", async (req, res) => {
  const { userId, text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text required" });

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

// TOGGLE task complete
router.put("/toggle/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const task = await pool.query(
      "UPDATE tasks SET is_complete = NOT is_complete WHERE id = $1 RETURNING *",
      [id]
    );
    res.json(task.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});


// DELETE a task
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
