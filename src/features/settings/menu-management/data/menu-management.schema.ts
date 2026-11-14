import { z } from "zod";

const menuTypeValues = ["GROUP", "MENU", "SUBMENU"] as const;
const menuCategoryValues = ["USER_MENU", "GUEST_HEADER", "GUEST_FOOTER"] as const;

export const navigationMenuSchema = z.object({
  code: z.string().trim().min(1, { message: "Code is required" }),
  title: z.string().trim().min(1, { message: "Title is required" }),
  titleEn: z.string().trim().max(150, { message: "Title (EN) must be at most 150 characters" }).optional().nullable(),
  url: z.string().trim().min(1, { message: "URL is required" }),
  icon: z.string().trim().optional().nullable(),
  type: z.enum(menuTypeValues, { message: "Type is required" }),
  category: z.enum(menuCategoryValues, { message: "Category is required" }),
  sortOrder: z.number().int().min(0, { message: "Sort order must be >= 0" }),
  openInNewTab: z.boolean(),
  badge: z.string().trim().optional().nullable(),
  parentId: z.number().int().positive().optional().nullable(),
  featureId: z.number().int().positive().optional().nullable(),
  moduleId: z.number().int().positive().optional().nullable(),
});

export type NavigationMenuSchema = z.infer<typeof navigationMenuSchema>;
