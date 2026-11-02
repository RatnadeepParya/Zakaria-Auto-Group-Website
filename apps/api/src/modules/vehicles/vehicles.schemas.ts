import { z } from "zod";
import { VehicleStatus } from "@prisma/client";

export const vehicleQuerySchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().optional(),
  bodyType: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  transmission: z.string().optional(),
  drivetrain: z.string().optional(),
  fuelType: z.string().optional(),
  search: z.string().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "mileage_asc"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
});

export const createVehicleSchema = z.object({
  vin: z.string().min(11).max(17).toUpperCase(),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1970).max(2100),
  priceCents: z.number().int().min(0),
  mileage: z.number().int().min(0),
  bodyType: z.string().min(1).max(50),
  transmission: z.string().max(50).default("Automatic"),
  fuelType: z.string().max(50).default("Gasoline"),
  drivetrain: z.string().max(50).default("FWD"),
  exteriorColor: z.string().max(50).optional(),
  interiorColor: z.string().max(50).optional(),
  description: z.string().max(3000).optional(),
  imageUrl: z.string().url().optional(),
  status: z.nativeEnum(VehicleStatus).default(VehicleStatus.AVAILABLE),
  featured: z.boolean().default(false),
});

export const updateVehicleSchema = createVehicleSchema.partial();
