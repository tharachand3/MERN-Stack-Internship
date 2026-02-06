import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRoutes.js";
import songRouter from "./routes/songRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

/* DB */
connectDB();

/* ROUTES */
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

app.listen(PORT, () =>
  console.log(`Server is running on Port ${PORT}`)
);
