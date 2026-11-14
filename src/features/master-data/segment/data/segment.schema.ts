import { z } from "zod";

export const segmentSchema = z.object({
  segmentId: z.string().trim().min(1, "Segment ID is required").max(32, "Segment ID must be 32 characters or fewer"),
  segmentName: z.string().trim().min(1, "Segment Name is required"),
  parentSegmentId: z.string().nullable(),
  description: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type SegmentFormData = z.output<typeof segmentSchema>;
