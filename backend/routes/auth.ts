import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import { createAccessToken, createRefreshToken } from "../utils/token";

const router = express.Router();

/* REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, age, funfact, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO users (name, email, age, funfact, password)
     VALUES ($1,$2,$3,$4,$5)`,
    [name, email, age, funfact, hashed]
  );

  res.status(201).json({ message: "Registered" });
});

/* LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = createAccessToken(user.id);
  const refreshToken = createRefreshToken(user.id);

  await pool.query(
    "UPDATE users SET refresh_token=$1 WHERE id=$2",
    [refreshToken, user.id]
  );

  res
    .cookie("access_token", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refresh_token", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json({ message: "Login successful" });
});

/* REFRESH */
router.post("/refresh", async (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string };

    const result = await pool.query(
      "SELECT refresh_token FROM users WHERE id=$1",
      [decoded.id]
    );

    if (result.rows[0]?.refresh_token !== token) {
      return res.sendStatus(403);
    }

    const newAccessToken = createAccessToken(decoded.id);

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.sendStatus(200);
  } catch {
    res.sendStatus(403);
  }
});

/* LOGOUT */
router.post("/logout", async (req, res) => {
  const token = req.cookies.refresh_token;

  if (token) {
    await pool.query(
      "UPDATE users SET refresh_token=NULL WHERE refresh_token=$1",
      [token]
    );
  }

  res
    .clearCookie("access_token")
    .clearCookie("refresh_token")
    .sendStatus(200);
});

export default router;
