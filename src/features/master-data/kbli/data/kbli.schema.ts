import { z } from "zod";

export const kbliSchema = z.object({
  code: z.string().trim().min(1, "KBLI Code is required"),
  category: z.string().trim().min(1, "Category/Golongan is required"),
  businessFieldName: z.string().trim().min(1, "Business Field Name is required"),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type KbliFormValues = z.output<typeof kbliSchema>;
