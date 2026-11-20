import { Router } from "express";
import { randomUUID } from "node:crypto";
import Order from "../models/Order.js";
import { requireAuth } from "../middleware/auth.js";
import { catalog } from "../data/catalog.js";

const router = Router();

// Demo only: no card details are collected and no external payment processor is contacted.
router.post("/demo-checkout", requireAuth, async (req, res) => {
  const requested = Array.isArray(req.body.items) ? req.body.items : [];
  if (!requested.length || requested.length > 30) return res.status(400).json({ message: "Your bag is empty or contains too many lines." });

  const normalized = [];
  for (const item of requested) {
    const product = catalog.find(entry => entry.id === String(item.productId || ""));
    const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
    if (!product) return res.status(400).json({ message: "An item in your bag is no longer available." });
    normalized.push({ productId: product.id, name: product.name, price: product.price, quantity });
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
