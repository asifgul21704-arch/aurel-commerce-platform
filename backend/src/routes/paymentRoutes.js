import { Router } from "express";
import { randomUUID } from "node:crypto";
import Order from "../models/Order.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { catalog } from "../data/catalog.js";

const router = Router();

// Demo only: no card details are collected and no external payment processor is contacted.
router.post("/demo-checkout", requireAuth, async (req, res) => {
  const requested = Array.isArray(req.body.items) ? req.body.items : [];
  if (!requested.length || requested.length > 30) return res.status(400).json({ message: "Your bag is empty or contains too many lines." });

  const normalized = [];
  const currencies = new Set();
  for (const item of requested) {
    const product = catalog.find(entry => entry.id === String(item.productId || ""));
    const quantity = Math.max(1, Math.min(20, Number(item.quantity) || 1));
    if (!product) return res.status(400).json({ message: "An item in your bag is no longer available." });
    currencies.add(product.currency || "USD");
    normalized.push({ productId: product.id, name: product.name, price: product.price, quantity, currency: product.currency || "USD", size: String(item.size || "").slice(0, 8), color: String(item.color || "").slice(0, 40) });
  }

  if (currencies.size !== 1) return res.status(400).json({ message: "Please check out one currency at a time. Separate EUR and USD items into different demo orders." });
  const currency = [...currencies][0];
  const total = Number(normalized.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
  const outcome = req.body.demoOutcome === "failed" ? "failed" : "succeeded";
  const order = await Order.create({
    customer: req.user._id,
    items: normalized,
    total,
    currency,
    payment: { method: req.body.method === "demo-wallet" ? "demo-wallet" : "demo-card", status: outcome, reference: `AUREL-DEMO-${randomUUID().slice(0, 8).toUpperCase()}` },
    status: outcome === "succeeded" ? "processing" : "cancelled"
  });
  res.status(201).json({ message: outcome === "succeeded" ? "Demo payment approved. No money was charged." : "Demo payment declined. No money was charged.", order });
});

router.get("/admin/orders", requireAuth, allowRoles("admin", "owner"), async (_req, res) => {
  const orders = await Order.find().populate("customer", "name email").sort({ createdAt: -1 }).limit(100);
  res.json({ orders });
});

router.patch("/admin/orders/:id/status", requireAuth, allowRoles("admin", "owner"), async (req, res) => {
  const allowed = ["pending", "processing", "completed", "cancelled"];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid order status." });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate("customer", "name email");
  if (!order) return res.status(404).json({ message: "Order not found." });
  res.json({ order });
});

router.get("/my-orders", requireAuth, async (req, res) => {
  const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 }).limit(50);
  res.json({ orders });
});
export default router;
