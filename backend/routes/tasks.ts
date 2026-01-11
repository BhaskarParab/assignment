import { Router } from "express";
import { pool } from "../db"; // your Postgres pool
import { protect, AuthRequest } from "../middleware/auth";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// Get all tasks for logged-in user
router.get("/", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { rows } = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a task
router.post("/", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "Title required" });

    const { rows } = await pool.query(
      "INSERT INTO tasks (id, title, user_id) VALUES ($1, $2, $3) RETURNING *",
      [uuidv4(), title, userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;
    const { title, completed } = req.body;

    const { rows } = await pool.query(
      "UPDATE tasks SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, completed, taskId, userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/:id", protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const taskId = req.params.id;

    const { rows } = await pool.query(
      "DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *",
      [taskId, userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
