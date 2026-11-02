import { Request, Response } from "express";
import { MessageStatus } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { AppError } from "../../middleware/errors";

export async function submitContactMessage(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, email, phone, message, vehicleId } = req.body;

  if (vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new AppError(400, "Referenced vehicle does not exist.");
    }
  }

  const created = await prisma.contactMessage.create({
    data: {
      firstName,
      lastName,
      email,
      phone: phone || null,
      message,
      vehicleId: vehicleId || null,
      status: MessageStatus.NEW,
    },
  });

  res.status(201).json({
    data: {
      id: created.id,
      message: "Thank you! Your message has been received. Our team will contact you shortly.",
    },
  });
}

export async function listContactMessages(req: Request, res: Response): Promise<void> {
  const status = req.query.status as MessageStatus | undefined;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      include: {
        vehicle: {
          select: { id: true, make: true, model: true, year: true, priceCents: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  res.json({
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function updateContactStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status } = req.body;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Message not found.");
  }

  const updated = await prisma.contactMessage.update({
    where: { id },
    data: { status },
  });

  res.json({ data: updated });
}
