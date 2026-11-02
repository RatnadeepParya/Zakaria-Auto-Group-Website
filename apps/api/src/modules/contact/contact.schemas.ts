import { z } from "zod";
import { MessageStatus } from "@prisma/client";

// Validate Phone Number if provided
const optionalPhoneSchema = z.string().optional().refine((val) => {
  if (!val || val.trim() === "") return true;
  const digits = val.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}, {
  message: "Phone number must be at least 10 digits",
});

export const contactMessageSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(100),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(100),
  email: z.string().email("A valid email address is required"),
  phone: optionalPhoneSchema,
  message: z.string().min(5, "Message must be at least 5 characters").max(3000),
  vehicleId: z.string().optional(),
});

export const updateMessageStatusSchema = z.object({
  status: z.nativeEnum(MessageStatus),
});
