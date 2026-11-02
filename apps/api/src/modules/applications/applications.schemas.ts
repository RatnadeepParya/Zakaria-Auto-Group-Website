import { z } from "zod";
import { ApplicationStatus } from "@prisma/client";

// Validate Date of Birth (must be valid calendar date, and applicant must be at least 18 years old)
const dateOfBirthSchema = z.string().refine((val) => {
  if (!val || typeof val !== "string") return false;
  const trimmed = val.trim();

  // Support YYYY-MM-DD or MM/DD/YYYY
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const usMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(trimmed);

  let year: number, month: number, day: number;
  if (isoMatch) {
    year = parseInt(isoMatch[1], 10);
    month = parseInt(isoMatch[2], 10);
    day = parseInt(isoMatch[3], 10);
  } else if (usMatch) {
    month = parseInt(usMatch[1], 10);
    day = parseInt(usMatch[2], 10);
    year = parseInt(usMatch[3], 10);
  } else {
    return false;
  }

  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return false;
  }

  // Calculate age as of today
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }

  return age >= 18 && age <= 120;
}, {
  message: "Applicant must be at least 18 years old with a valid Date of Birth (YYYY-MM-DD or MM/DD/YYYY)",
});

// Validate Phone Number (must contain 10-15 digits)
const phoneSchema = z.string().refine((val) => {
  if (!val) return false;
  const digits = val.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}, {
  message: "A valid phone number with at least 10 digits is required",
});

// Validate SSN (must be 9 digits, rejecting invalid prefixes)
const ssnSchema = z.string().refine((val) => {
  if (!val) return true;
  const cleaned = val.replace(/\D/g, "");
  if (cleaned.length !== 9) return false;
  if (/^000|^666|^9\d{2}/.test(cleaned)) return false;
  if (/^(\d)\1{8}$/.test(cleaned)) return false; // reject 111111111, 222222222, etc.
  return true;
}, {
  message: "SSN must be a valid 9-digit Social Security Number (format: XXX-XX-XXXX or 9 digits)",
}).optional();

// Validate US Postal Code
const postalCodeSchema = z.string().regex(/^\d{5}(-\d{4})?$/, {
  message: "Postal code must be a valid 5-digit US ZIP code",
});

export const creditApplicationSchema = z.object({
  // Step 1: Personal Info
  firstName: z.string().min(2, "First name must be at least 2 characters").max(100),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(100),
  email: z.string().email("A valid email address is required"),
  phone: phoneSchema,
  dateOfBirth: dateOfBirthSchema,
  ssn: ssnSchema,
  driversLicenseNumber: z.string().max(50).optional(),
  driversLicenseState: z.string().max(10).optional(),
  driversLicenseExpiry: z.string().max(20).optional(),

  // Step 2: Address
  addressLine1: z.string().min(5, "Address must be at least 5 characters").max(200),
  addressLine2: z.string().max(100).optional(),
  city: z.string().min(2, "City must be at least 2 characters").max(100),
  state: z.string().min(2, "State is required").max(50),
  postalCode: postalCodeSchema,
  housingStatus: z.enum(["Own", "Rent", "Other"]).optional(),
  monthlyPayment: z.number().int().min(0, "Monthly payment cannot be negative").optional(),

  // Step 3: Employment
  employmentStatus: z.enum(["Employed", "Self-Employed", "Retired", "Other"]),
  employerName: z.string().max(150).optional(),
  jobTitle: z.string().max(100).optional(),
  annualIncome: z.number().int().min(0, "Annual income cannot be negative").optional(),
  yearsEmployed: z.number().int().min(0, "Years employed cannot be negative").optional(),

  // Vehicle Interest
  vehicleId: z.string().optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.nativeEnum(ApplicationStatus),
  notes: z.string().max(1000).optional(),
});
