import { Router } from "express";
import Product from "../models/Product.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = Router();
const safe = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const staff = [requireAuth, allowRoles("admin", "owner")];

function validProduct(body) {
  const name = String(body.name || "").trim();
  const collection = String(body.collection || "").trim();
  const price = Number(body.price);
  const currency = String(body.currency || "USD").toUpperCase();
  if (name.length < 2 || name.length > 140) return "Product name must be 2–140 characters.";
  if (collection.length < 2 || collection.length > 80) return "Collection must be 2–80 characters.";
  if (!Number.isFinite(price) || price < 0 || price > 1000000) return "Enter a valid product price.";
  if (!["USD", "EUR"].includes(currency)) return "Currency must be USD or EUR.";
  if (body.image && (!String(body.image).startsWith("https://") || String(body.image).length > 1000)) return "Product image must be a valid HTTPS URL.";
  return null;
}

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
  const error = validProduct(req.body);
  if (error) return res.status(400).json({ message: error });
  const name = String(req.body.name).trim();
  const productId = `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70)}-${Date.now().toString(36)}`;
  const product = await Product.create({
    productId,
    name,
    collection: String(req.body.collection).trim(),
    category: String(req.body.category || "General").trim().slice(0, 80),
    description: String(req.body.description || "").trim().slice(0, 1000),
    price: Number(req.body.price),
    currency: String(req.body.currency || "USD").toUpperCase(),
    image: String(req.body.image || "").trim(),
    createdBy: req.user._id
  });
  res.status(201).json({ product });
}));

router.patch("/admin/products/:id", ...staff, safe(async (req, res) => {
  const error = validProduct({
    ...req.body,
    name: req.body.name || "Valid name",
    collection: req.body.collection || "General",
    price: req.body.price ?? 0
  });
  if (error) return res.status(400).json({ message: error });
  const updates = {};
  for (const field of ["name", "collection", "category", "description", "image", "isActive"]) {
    if (req.body[field] !== undefined) {
      updates[field] = typeof req.body[field] === "string"
        ? req.body[field].trim().slice(0, field === "description" ? 1000 : 1000)
        : Boolean(req.body[field]);
    }
  }
  if (req.body.price !== undefined) updates.price = Number(req.body.price);
  if (req.body.currency !== undefined) updates.currency = String(req.body.currency).toUpperCase();
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
