import { Request, Response } from "express";
import { VehicleStatus, MessageStatus, ApplicationStatus } from "@prisma/client";
import { prisma } from "../../db/prisma";

export async function getDashboardStats(_req: Request, res: Response): Promise<void> {
  const [
    totalVehicles,
    availableVehicles,
    reservedVehicles,
    soldVehicles,
    totalMessages,
    newMessages,
    totalApplications,
    submittedApplications,
    latestMessages,
    latestApplications,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: VehicleStatus.AVAILABLE } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.RESERVED } }),
    prisma.vehicle.count({ where: { status: VehicleStatus.SOLD } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { status: MessageStatus.NEW } }),
    prisma.creditApplication.count(),
    prisma.creditApplication.count({ where: { status: ApplicationStatus.SUBMITTED } }),
    prisma.contactMessage.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { vehicle: { select: { year: true, make: true, model: true } } },
    }),
    prisma.creditApplication.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        status: true,
        createdAt: true,
        vehicle: { select: { year: true, make: true, model: true } },
      },
    }),
  ]);

  res.json({
    data: {
      inventory: {
        total: totalVehicles,
        available: availableVehicles,
        reserved: reservedVehicles,
        sold: soldVehicles,
      },
      messages: {
        total: totalMessages,
        new: newMessages,
      },
      applications: {
        total: totalApplications,
        submitted: submittedApplications,
      },
      latestMessages,
      latestApplications,
    },
  });
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      include: { actor: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count(),
  ]);

  res.json({
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
