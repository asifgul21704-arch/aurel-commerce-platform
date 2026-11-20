import { Router } from "express";
import { randomUUID } from "node:crypto";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// This endpoint deliberately simulates outcomes. It never contacts a bank or payment processor.
router.post("/demo-checkout", requireAuth, async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length || items.length > 30) return res.status(400).json({ message: "Your bag is empty or contains too many lines." });
  const normalized = items.map(item => ({
    productId: String(item.productId || "").slice(0, 100),
    name: String(item.name || "AUREL item").slice(0, 120),
    price: Number(item.price),
    quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1))
  }));
  if (normalized.some(item => !Number.isFinite(item.price) || item.price < 0 || item.price > 100000)) {
    return res.status(400).json({ message: "One or more item prices are invalid." });
  }
  const total = Number(normalized.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const outcome = req.body.demoOutcome === "failed" ? "failed" : "succeeded";
  const order = await Order.create({
    customer: req.user._id,
    items: normalized,
    total,
    payment: { method: req.body.method === "demo-wallet" ? "demo-wallet" : "demo-card", status: outcome, reference: `AUREL-DEMO-${randomUUID().slice(0, 8).toUpperCase()}` },
    status: outcome === "succeeded" ? "processing" : "cancelled"
  });
  res.status(201).json({ message: outcome === "succeeded" ? "Demo payment approved. No money was charged." : "Demo payment declined. No money was charged.", order });
});

router.get("/my-orders", requireAuth, async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ orders });
});
export default router;
