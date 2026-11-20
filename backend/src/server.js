import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import catalogRoutes from "./routes/catalogRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { seedCatalog } from "./services/catalogService.js";

const app = express();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || Buffer.byteLength(jwtSecret, "utf8") < 32) {
  throw new Error("JWT_SECRET must be configured with at least 32 characters before the API can start.");
}
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be configured before the API can start.");
}

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: (process.env.CLIENT_ORIGIN || "http://localhost:5173").split(",").map(value => value.trim()),
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "32kb" }));

app.use("/api/auth", rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false
}));
app.use("/api/auth", authRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/account", accountRoutes);

app.get("/api/health", (_req, res) => res.json({
  status: "ok",
  service: "aurel-api",
  payments: "demo-only"
}));

app.use((err, _req, res, _next) => {
  console.error("Request failed:", err);
  const status = Number.isInteger(err.statusCode) ? err.statusCode : 500;
  res.status(status).json({
    message: status >= 500 ? "Something went wrong. Please try again." : err.message
  });
});

const port = Number(process.env.PORT) || 5000;
connectDB()
  .then(seedCatalog)
  .then(() => app.listen(port, () => console.log(`AUREL API listening on ${port}`)))
  .catch(error => {
    console.error("API startup failed:", error.message);
    process.exit(1);
  });
