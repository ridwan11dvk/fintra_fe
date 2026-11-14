import { z } from "zod";

export const externalUserSchema = z.object({
  userType: z.string().min(1, "User type is required"),
  name: z.string().min(3, "Name is required"),
  email: z.email("Invalid email address"),
  username: z.string().min(4, "Username must be at least 4 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  roles: z.array(z.number()).min(1, "At least one role is required"),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z
    .string()
    .max(255, "Place of birth must not exceed 255 characters")
    .optional(),
  privyId: z.string().max(255, "Privy ID must not exceed 255 characters").optional(),
  photo: z.string().nullish().optional(),
  nik: z.string().max(50, "NIK must not exceed 50 characters").optional(),
  npwp: z.string().max(50, "NPWP must not exceed 50 characters").optional(),
  ktpFile: z.string().optional(),
  npwpFile: z.string().optional(),
  address: z.string().optional(),
  companyCode: z.string().optional(),
  companyName: z
    .string()
    .max(150, "Company name must not exceed 150 characters")
    .optional(),
  partnerCode: z.string().optional(),
  businessAreaCode: z.string().optional(),
  businessAreaName: z
    .string()
    .max(150, "Business area name must not exceed 150 characters")
    .optional(),
  supervisorPositionCode: z
    .string()
    .max(50, "Supervisor position code must not exceed 50 characters")
    .optional(),
  supervisorPositionName: z
    .string()
    .max(150, "Supervisor position name must not exceed 150 characters")
    .optional(),
  responsibleName: z.string().optional(),
  responsibleEmail: z
    .email("Invalid email address")
    .optional()
    .or(z.literal("")),
  responsibleNik: z.string().optional(),
  responsibleAddress: z.string().optional(),
  purpose: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  twoFactorEnabled: z.boolean().default(false),
  otpSecret: z.string().optional(),
})
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      return new Date(data.endDate) >= new Date(data.startDate);
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    },
  );

export type ExternalUserFormData = z.output<typeof externalUserSchema>;

export const userTypeOptions = [
  { value: "PERSONAL", label: "Personal" },
  { value: "COMPANY", label: "Company" },
  { value: "OTHER", label: "Other" },
] as const;

export const twoFactorOptions = [
  { value: true, label: "Enabled" },
  { value: false, label: "Disabled" },
] as const;
