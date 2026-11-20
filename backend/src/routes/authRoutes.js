import { Router } from "express";
import { createAdmin, login, me, signup } from "../controllers/authController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.post("/admins", requireAuth, allowRoles("owner"), createAdmin);
export default router;
