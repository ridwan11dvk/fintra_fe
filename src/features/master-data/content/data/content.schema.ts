import { z } from "zod";
import { contentSections } from "./content.types";

export const contentSchema = z.object({
  sectionName: z.enum(contentSections, { message: "Section Name is required" }),
  content: z.string().trim().min(1, "Content is required").max(5000, "Content must be 5000 characters or fewer"),
});

export type ContentFormValues = z.infer<typeof contentSchema>;
