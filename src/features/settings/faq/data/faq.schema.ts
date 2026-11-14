import { z } from "zod";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} must not exceed ${max} characters`)
    .optional()
    .or(z.literal(""));

export const faqSchema = z
  .object({
    target: z
      .string()
      .min(1, "Target is required")
      .max(100, "Target must not exceed 100 characters"),
    question: z
      .string()
      .min(1, "Question (ID) is required")
      .max(500, "Question (ID) must not exceed 500 characters"),
    questionEn: optionalText(500, "Question (EN)"),
    answer: z
      .string()
      .min(1, "Answer (ID) is required")
      .max(4000, "Answer (ID) must not exceed 4000 characters"),
    answerEn: optionalText(4000, "Answer (EN)"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().or(z.literal("")),
    sortOrder: z.coerce
      .number({ message: "Sort order is required" })
      .int("Sort order must be an integer")
      .min(0, "Sort order cannot be negative"),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      if (!data.startDate) return false;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

export type FaqFormData = z.output<typeof faqSchema>;