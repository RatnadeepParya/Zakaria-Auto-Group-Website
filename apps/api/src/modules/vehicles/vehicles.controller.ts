import { Request, Response } from "express";
import { Prisma, VehicleStatus } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../middleware/errors";

export async function listVehicles(req: Request, res: Response): Promise<void> {
  const {
    make,
    model,
    year,
    bodyType,
    minPrice,
    maxPrice,
    transmission,
    drivetrain,
    fuelType,
    search,
    status,
    sort,
    page,
    limit,
  } = req.query as any;

  const where: Prisma.VehicleWhereInput = {
    status: status ? status : VehicleStatus.AVAILABLE,
  };

  if (make) {
    where.make = { equals: make, mode: "insensitive" };
  }
  if (model) {
    where.model = { contains: model, mode: "insensitive" };
  }
  if (year) {
    where.year = Number(year);
  }
  if (bodyType) {
    where.bodyType = { equals: bodyType, mode: "insensitive" };
  }
  if (transmission) {
    where.transmission = { equals: transmission, mode: "insensitive" };
  }
  if (drivetrain) {
    where.drivetrain = { equals: drivetrain, mode: "insensitive" };
  }
  if (fuelType) {
    where.fuelType = { equals: fuelType, mode: "insensitive" };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.priceCents = {};
    if (minPrice !== undefined) where.priceCents.gte = Number(minPrice) * 100;
    if (maxPrice !== undefined) where.priceCents.lte = Number(maxPrice) * 100;
  }
  if (search) {
    const s = String(search).trim();
    where.OR = [
      { make: { contains: s, mode: "insensitive" } },
      { model: { contains: s, mode: "insensitive" } },
      { description: { contains: s, mode: "insensitive" } },
    ];
  }

  let orderBy: Prisma.VehicleOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price_asc") orderBy = { priceCents: "asc" };
  else if (sort === "price_desc") orderBy = { priceCents: "desc" };
  else if (sort === "mileage_asc") orderBy = { mileage: "asc" };

  const p = Math.max(1, Number(page) || 1);
  const l = Math.min(50, Math.max(1, Number(limit) || 12));

  const [items, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy,
      skip: (p - 1) * l,
      take: l,
    }),
    prisma.vehicle.count({ where }),
  ]);

  res.json({
    data: items,
    meta: {
      page: p,
      limit: l,
      total,
      totalPages: Math.ceil(total / l),
    },
  });
}

export async function getVehicleFacets(_req: Request, res: Response): Promise<void> {
  const availableVehicles = await prisma.vehicle.findMany({
    where: { status: VehicleStatus.AVAILABLE },
    select: { make: true, bodyType: true, priceCents: true, year: true },
  });

  const makesCount: Record<string, number> = {};
  const bodyTypesCount: Record<string, number> = {};
  let minPrice = Infinity;
  let maxPrice = 0;

  for (const v of availableVehicles) {
    makesCount[v.make] = (makesCount[v.make] || 0) + 1;
    bodyTypesCount[v.bodyType] = (bodyTypesCount[v.bodyType] || 0) + 1;
    const priceDollars = v.priceCents / 100;
    if (priceDollars < minPrice) minPrice = priceDollars;
    if (priceDollars > maxPrice) maxPrice = priceDollars;
  }

  res.json({
    data: {
      makes: Object.entries(makesCount).map(([name, count]) => ({ name, count })),
      bodyTypes: Object.entries(bodyTypesCount).map(([name, count]) => ({ name, count })),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice === 0 ? 50000 : maxPrice,
      },
      total: availableVehicles.length,
    },
  });
}

export async function getVehicleById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const vehicle = await prisma.vehicle.findFirst({
    where: {
      OR: [{ id }, { vin: id }],
    },
  });

  if (!vehicle) {
    throw new AppError(404, "Vehicle not found.");
  }

  res.json({ data: vehicle });
}

export async function createVehicle(req: Request, res: Response): Promise<void> {
  const data = req.body;

  const existing = await prisma.vehicle.findUnique({
    where: { vin: data.vin },
  });
  if (existing) {
    throw new AppError(409, `A vehicle with VIN ${data.vin} already exists.`);
  }

  const created = await prisma.vehicle.create({
    data,
  });

  res.status(201).json({ data: created });
}

export async function updateVehicle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const data = req.body;

  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Vehicle not found.");
  }

  const updated = await prisma.vehicle.update({
    where: { id },
    data,
  });

  res.json({ data: updated });
}

export async function deleteVehicle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const existing = await prisma.vehicle.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Vehicle not found.");
  }

  await prisma.vehicle.delete({ where: { id } });
  res.json({ data: { message: "Vehicle deleted successfully." } });
}
