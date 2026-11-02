import { Router } from "express";
import {
  listVehicles,
  getVehicleFacets,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "./vehicles.controller";
import {
  vehicleQuerySchema,
  createVehicleSchema,
  updateVehicleSchema,
} from "./vehicles.schemas";
import { validateQuery, validateBody } from "../../middleware/validate";
import { requireAuth, requireAdmin } from "../../middleware/auth";

const router = Router();

// Public routes
router.get("/", validateQuery(vehicleQuerySchema), listVehicles);
router.get("/facets", getVehicleFacets);
router.get("/:id", getVehicleById);

// Admin-only routes
router.post("/", requireAuth, requireAdmin, validateBody(createVehicleSchema), createVehicle);
router.patch("/:id", requireAuth, requireAdmin, validateBody(updateVehicleSchema), updateVehicle);
router.delete("/:id", requireAuth, requireAdmin, deleteVehicle);

export default router;
