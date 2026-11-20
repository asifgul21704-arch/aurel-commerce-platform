import { Router } from "express";
import { createAdmin, login, me, signup, listAdmins, setAdminStatus } from "../controllers/authController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

const router = Router();
const safe = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.post("/signup", safe(signup));
router.post("/login", safe(login));
router.get("/me", requireAuth, safe(me));
router.get("/admins", requireAuth, allowRoles("owner"), safe(listAdmins));
router.post("/admins", requireAuth, allowRoles("owner"), safe(createAdmin));
router.patch("/admins/:id", requireAuth, allowRoles("owner"), safe(setAdminStatus));

export default router;
