import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import tasksRouter from "./routes/tasks";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true,
  })
);

// both parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/app", authRoutes);
app.use("/app", userRoutes);
app.use("/app/tasks", tasksRouter);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
