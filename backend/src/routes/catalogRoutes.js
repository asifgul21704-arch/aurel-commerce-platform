import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { validateProductInput } from "../utils/validation.js";

const router = Router();
const safe = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const staff = [requireAuth, allowRoles("admin", "owner")];

router.get("/", safe(async (_req, res) => {
  const products = await Product.find({ isActive: true }).sort({ collection: 1, name: 1 }).lean();
  res.json({ products });
}));

router.get("/admin/summary", ...staff, safe(async (_req, res) => {
  const [products, collections] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.distinct("collection", { isActive: true })
  ]);
  res.json({ products, collections: collections.length });
}));

router.get("/admin/products", ...staff, safe(async (_req, res) => {
  const products = await Product.find().sort({ collection: 1, name: 1 }).lean();
  res.json({ products });
}));

router.post("/admin/products", ...staff, safe(async (req, res) => {
  const error = validateProductInput(req.body);
  if (error) return res.status(400).json({ message: error });
  const name = req.body.name.trim();
  const productId = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${Date.now().toString(36)}`;
  const product = await Product.create({
    productId,
    name,
    collection: req.body.collection.trim(),
    category: (req.body.category || "General").trim(),
    description: (req.body.description || "").trim(),
    price: Number(req.body.price),
    currency: (req.body.currency || "USD").toUpperCase(),
    image: (req.body.image || "").trim(),
    createdBy: req.user._id
  });
  res.status(201).json({ product });
}));

router.patch("/admin/products/:id", ...staff, safe(async (req, res) => {
  const error = validateProductInput(req.body, { partial: true });
  if (error) return res.status(400).json({ message: error });
  const updates = {};
  for (const field of ["name", "collection", "category", "description", "image"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field].trim();
  }
  if (req.body.price !== undefined) updates.price = Number(req.body.price);
  if (req.body.currency !== undefined) updates.currency = req.body.currency.toUpperCase();
  if (req.body.isActive !== undefined) updates.isActive = req.body.isActive;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json({ product });
}));

router.delete("/admin/products/:id", ...staff, safe(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!product) return res.status(404).json({ message: "Product not found." });
  res.json({ message: "Product archived.", product });
}));

export default router;
