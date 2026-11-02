import { Router } from "express";
import { login, logout, me } from "./auth.controller";
import { loginSchema } from "./auth.schemas";
import { validateBody } from "../../middleware/validate";
import { authLimiter } from "../../middleware/rateLimit";
import { requireAuth } from "../../middleware/auth";

const router = Router();

router.post("/login", authLimiter, validateBody(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
