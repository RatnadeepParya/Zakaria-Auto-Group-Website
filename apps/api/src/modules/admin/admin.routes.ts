import { Router } from "express";
import { getDashboardStats, getAuditLogs } from "./admin.controller";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", getDashboardStats);
router.get("/audit", getAuditLogs);

export default router;
