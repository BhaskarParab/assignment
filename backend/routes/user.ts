import { Router } from "express";
import { protect, AuthRequest } from "../middleware/auth";
import { pool } from "../db";

const router = Router();

router.get("/me", protect, async (req: AuthRequest, res) => {
  const result = await pool.query(
    "SELECT id, name, email, age, funfact FROM users WHERE id=$1::uuid",
    [req.userId]
  );

  res.json(result.rows[0]);
});

export default router;
