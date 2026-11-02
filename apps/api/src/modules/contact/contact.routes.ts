import { Router } from "express";
import {
  submitContactMessage,
  listContactMessages,
  updateContactStatus,
} from "./contact.controller";
import {
  contactMessageSchema,
  updateMessageStatusSchema,
} from "./contact.schemas";
import { validateBody } from "../../middleware/validate";
import { formLimiter } from "../../middleware/rateLimit";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public submission
router.post("/", formLimiter, validateBody(contactMessageSchema), submitContactMessage);

// Admin-only management
router.get("/", requireAuth, requireAdmin, listContactMessages);
router.patch("/:id/status", requireAuth, requireAdmin, validateBody(updateMessageStatusSchema), updateContactStatus);

export default router;
