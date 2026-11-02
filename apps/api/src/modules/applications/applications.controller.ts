import { Request, Response } from "express";
import { ApplicationStatus } from "@prisma/client";
import { prisma } from "../../db/prisma";
import { encrypt, decrypt } from "../../lib/crypto";
import { AppError } from "../../middleware/errors";

export async function submitApplication(req: Request, res: Response): Promise<void> {
  const data = req.body;

  let ssnLast4: string | null = null;
  let ssnEncrypted: string | null = null;

  if (data.ssn) {
    const digitsOnly = data.ssn.replace(/\D/g, "");
    ssnLast4 = digitsOnly.slice(-4) || null;
    ssnEncrypted = encrypt(digitsOnly);
  }

  const created = await prisma.creditApplication.create({
    data: {
      userId: req.user?.id || null,
      vehicleId: data.vehicleId || null,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth,
      ssnLast4,
      ssnEncrypted,
      driversLicenseNumber: data.driversLicenseNumber || null,
      driversLicenseState: data.driversLicenseState || null,
      driversLicenseExpiry: data.driversLicenseExpiry || null,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      postalCode: data.postalCode,
      housingStatus: data.housingStatus || null,
      monthlyPayment: data.monthlyPayment || null,
      employmentStatus: data.employmentStatus,
      employerName: data.employerName || null,
      jobTitle: data.jobTitle || null,
      annualIncomeCents: data.annualIncome ? data.annualIncome * 100 : null,
      yearsEmployed: data.yearsEmployed || null,
      status: ApplicationStatus.SUBMITTED,
    },
  });

  res.status(201).json({
    data: {
      id: created.id,
      message: "Your credit pre-approval application has been submitted securely. Our financing team will review it and contact you.",
    },
  });
}

export async function listApplications(req: Request, res: Response): Promise<void> {
  const status = req.query.status as ApplicationStatus | undefined;
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

  const where = status ? { status } : {};

  const [items, total] = await Promise.all([
    prisma.creditApplication.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        dateOfBirth: true,
        ssnLast4: true,
        driversLicenseState: true,
        city: true,
        state: true,
        employmentStatus: true,
        employerName: true,
        annualIncomeCents: true,
        status: true,
        createdAt: true,
        vehicle: {
          select: { id: true, make: true, model: true, year: true, priceCents: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.creditApplication.count({ where }),
  ]);

  res.json({
    data: items,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function getApplicationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const app = await prisma.creditApplication.findUnique({
    where: { id },
    include: {
      vehicle: true,
      user: { select: { id: true, email: true, firstName: true, lastName: true } },
    },
  });

  if (!app) {
    throw new AppError(404, "Application not found.");
  }

  // Never return encrypted SSN directly
  const { ssnEncrypted, ...safeApp } = app;
  res.json({ data: safeApp });
}

export async function revealSensitiveData(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const app = await prisma.creditApplication.findUnique({
    where: { id },
    select: { id: true, ssnEncrypted: true, driversLicenseNumber: true },
  });

  if (!app) {
    throw new AppError(404, "Application not found.");
  }

  let fullSsn = null;
  if (app.ssnEncrypted) {
    try {
      fullSsn = decrypt(app.ssnEncrypted);
    } catch {
      throw new AppError(500, "Unable to decrypt sensitive record.");
    }
  }

  // Record audit event
  await prisma.auditLog.create({
    data: {
      actorId: req.user?.id || null,
      action: "REVEAL_PII",
      entityType: "CreditApplication",
      entityId: id,
      metadata: { timestamp: new Date().toISOString() },
    },
  });

  res.json({
    data: {
      ssn: fullSsn,
      driversLicenseNumber: app.driversLicenseNumber,
    },
  });
}

export async function updateApplicationStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { status, notes } = req.body;

  const existing = await prisma.creditApplication.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(404, "Application not found.");
  }

  const updated = await prisma.creditApplication.update({
    where: { id },
    data: { status, notes },
  });

  res.json({ data: updated });
}
