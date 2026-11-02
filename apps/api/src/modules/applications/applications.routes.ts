import { Router } from "express";
import {
  submitApplication,
  listApplications,
  getApplicationById,
  revealSensitiveData,
  updateApplicationStatus,
} from "./applications.controller";
import {
  creditApplicationSchema,
  updateApplicationStatusSchema,
} from "./applications.schemas";
import { validateBody } from "../../middleware/validate";
import { formLimiter } from "../../middleware/rateLimit";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public submission
router.post("/", formLimiter, validateBody(creditApplicationSchema), submitApplication);

// Admin-only review
router.get("/", requireAuth, requireAdmin, listApplications);
router.get("/:id", requireAuth, requireAdmin, getApplicationById);
router.get("/:id/sensitive", requireAuth, requireAdmin, revealSensitiveData);
router.patch("/:id/status", requireAuth, requireAdmin, validateBody(updateApplicationStatusSchema), updateApplicationStatus);

export default router;
