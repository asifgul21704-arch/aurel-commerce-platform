import { Router } from "express";
import { createAdmin, login, me, signup, listAdmins, setAdminStatus } from "../controllers/authController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", requireAuth, me);
router.get("/admins", requireAuth, allowRoles("owner"), listAdmins);
router.post("/admins", requireAuth, allowRoles("owner"), createAdmin);
router.patch("/admins/:id", requireAuth, allowRoles("owner"), setAdminStatus);
export default router;
