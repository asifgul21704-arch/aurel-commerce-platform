import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const safe = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.use(requireAuth);

router.get("/me", safe(async (req, res) => {
  res.json({
    cartItems: req.user.cartItems || [],
    savedProductIds: req.user.savedProductIds || []
  });
}));

router.put("/cart", safe(async (req, res) => {
  if (!Array.isArray(req.body.items) || req.body.items.length > 30) {
    return res.status(400).json({ message: "Cart must contain no more than 30 items." });
  }
  const items = [];
  for (const item of req.body.items) {
    const productId = String(item.productId || "").trim();
    const quantity = Number(item.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ message: "Each cart item needs a valid product and quantity from 1 to 20." });
    }
    const productExists = await Product.exists({ productId, isActive: true });
    if (!productExists) return res.status(400).json({ message: "A product in your cart is no longer available." });
    items.push({
      productId,
      quantity,
      size: String(item.size || "").slice(0, 8),
      color: String(item.color || "").slice(0, 40)
    });
  }
  req.user.cartItems = items;
  await req.user.save();
  res.json({ cartItems: req.user.cartItems });
}));

router.put("/wishlist", safe(async (req, res) => {
  if (!Array.isArray(req.body.productIds) || req.body.productIds.length > 100) {
    return res.status(400).json({ message: "Wishlist must contain no more than 100 products." });
  }
  const productIds = [...new Set(req.body.productIds.map(value => String(value).trim()).filter(Boolean))];
  const products = await Product.find({ productId: { $in: productIds }, isActive: true }).select("productId").lean();
  if (products.length !== productIds.length) {
    return res.status(400).json({ message: "One or more saved products are unavailable." });
  }
  req.user.savedProductIds = productIds;
  await req.user.save();
  res.json({ savedProductIds: req.user.savedProductIds });
}));

router.get("/wishlist", safe(async (req, res) => {
  const products = await Product.find({
    productId: { $in: req.user.savedProductIds || [] },
    isActive: true
  }).lean();
  res.json({ products });
}));

export default router;
