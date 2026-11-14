import { z } from "zod";
import {
  BANNER_IMAGE_ACCEPTED_EXTENSIONS,
  BANNER_IMAGE_MAX_SIZE_BYTES,
} from "./banner.utils";

const optionalText = (max: number, label: string) =>
  z
    .string()
    .max(max, `${label} must not exceed ${max} characters`)
    .optional()
    .or(z.literal(""));

export const bannerSchema = z
  .object({
    target: z
      .string()
      .min(1, "Target is required")
      .max(100, "Target must not exceed 100 characters"),
    title: z
      .string()
      .min(1, "Title (ID) is required")
      .max(200, "Title (ID) must not exceed 200 characters"),
    titleEn: optionalText(200, "Title (EN)"),
    subtitle: optionalText(200, "Subtitle (ID)"),
    subtitleEn: optionalText(200, "Subtitle (EN)"),
    description: optionalText(2000, "Description (ID)"),
    descriptionEn: optionalText(2000, "Description (EN)"),
    image: z
      .instanceof(File, { message: "Invalid image file" })
      .optional()
      .nullable(),
    removeImage: z.boolean().optional(),
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
  )
  .refine(
    (data) => {
      if (!data.image) return true;
      if (data.image.size > BANNER_IMAGE_MAX_SIZE_BYTES) {
        return false;
      }
      const extension = data.image.name
        .substring(data.image.name.lastIndexOf(".") + 1)
        .toLowerCase();
      return (BANNER_IMAGE_ACCEPTED_EXTENSIONS as readonly string[]).includes(
        extension,
      );
    },
    {
      message: "Image must be JPG, PNG, or WebP and max 2MB",
      path: ["image"],
    },
  );

export type BannerFormData = z.output<typeof bannerSchema>;
