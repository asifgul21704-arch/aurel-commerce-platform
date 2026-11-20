import { Router } from "express";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { catalog } from "../data/catalog.js";

const router = Router();
router.get("/", (_req, res) => res.json({ products: catalog }));
router.get("/admin/summary", requireAuth, allowRoles("admin", "owner"), (_req, res) => res.json({ products: catalog.length, collections: 6, note: "Catalog management foundation is ready." }));
export default router;
