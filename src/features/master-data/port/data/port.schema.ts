import { z } from "zod";

export const portSchema = z.object({
  customsOfficeId: z.number().min(1, "Customs Office is required"),
  code: z
    .string()
    .min(1, "Port code is required")
    .max(50, "Port code must not exceed 50 characters"),
  name: z
    .string()
    .min(1, "Port name is required")
    .max(255, "Port name must not exceed 255 characters"),
  isActive: z.boolean(),
});

export type PortFormData = z.output<typeof portSchema>;
