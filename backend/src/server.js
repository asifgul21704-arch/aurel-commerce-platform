import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: "draft-7", legacyHeaders: false }));
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "aurel-api", payments: "demo-only" }));
app.use((err, _req, res, _next) => {
  console.error(err.message);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

const port = Number(process.env.PORT) || 5000;
connectDB().then(() => app.listen(port, () => console.log(`AUREL API listening on ${port}`)))
  .catch(error => { console.error("API startup failed:", error.message); process.exit(1); });
