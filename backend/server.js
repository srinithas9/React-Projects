const express = require("express");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


app.post("/api/auth/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1", [email]
    );
    if (existingUser.rows.length > 0)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    res.status(200).json({
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/api/todos/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const todos = await pool.query(
      "SELECT * FROM todos WHERE user_id = $1 ORDER BY id DESC", [userId]
    );
    res.json(todos.rows);
  } catch (err) {
    console.error("Get todos error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/api/todos", async (req, res) => {
  const { userId, text } = req.body;
  try {
    const newTodo = await pool.query(
      "INSERT INTO todos (user_id, text, is_complete) VALUES ($1, $2, $3) RETURNING *",
      [userId, text, false]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error("Add todo error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { isComplete } = req.body;
  try {
    const updatedTodo = await pool.query(
      "UPDATE todos SET is_complete = $1 WHERE id = $2 RETURNING *",
      [isComplete, id]
    );
    res.json(updatedTodo.rows[0]);
  } catch (err) {
    console.error("Update todo error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM todos WHERE id = $1", [id]);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    console.error("Delete todo error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
