import { z } from "zod";

export const internalUserSchema = z.object({
  nipp: z.string().min(1, "NIPP is required"),
  name: z.string().min(1, "Name is required"),
  email: z.email().min(1, "Email is required"),
  phoneNumber: z.string().optional(),
  photo: z.string().nullish().optional(),
  nik: z.string().max(20, "NIK must not exceed 20 characters").optional(),
  dateOfBirth: z.string().optional(),
  placeOfBirth: z
    .string()
    .max(255, "Place of birth must not exceed 255 characters")
    .optional(),
  privyId: z.string().max(255, "Privy ID must not exceed 255 characters").optional(),
  password: z.string().nullish().optional(),
  confirmPassword: z.string().nullish().optional(),

  companyCode: z.string().min(1, "Company Code is required"),
  companyName: z.string().min(1, "Company Name is required"),
  directorateCode: z.string().optional(),
  directorateName: z.string().optional(),
  directorateNomenclature: z.string().optional(),
  personalAreaCode: z.string().optional(),
  personalAreaName: z.string().optional(),
  businessAreaCode: z.string().optional(),
  businessAreaName: z.string().optional(),

  organizationCode: z.string().optional(),
  organizationName: z.string().optional(),
  organizationNomenclature: z.string().optional(),
  costCenterCode: z.string().optional(),
  costCenterName: z.string().optional(),
  corsaCode: z.string().optional(),
  corsaName: z.string().optional(),
  corsaNomenclature: z.string().optional(),

  jobCode: z.string().optional(),
  jobName: z.string().optional(),
  jobFamilyCode: z.string().optional(),
  jobFamilyName: z.string().optional(),
  subJobFamilyCode: z.string().optional(),
  subJobFamilyName: z.string().optional(),
  grade: z.string().optional(),
  positionCode: z.string().optional(),
  positionName: z.string().optional(),
  positionNomenclature: z.string().optional(),

  workerGroupCode: z.string().optional(),
  workerGroupName: z.string().optional(),
  subWorkerGroupCode: z.string().optional(),
  subWorkerGroupName: z.string().optional(),

  tempSupervisorNipp: z.string().optional(),
  tempSupervisorName: z.string().optional(),
  supervisorLevelOneNipp: z.string().optional(),
  supervisorLevelOneName: z.string().optional(),
  supervisorLevelOnePosition: z.string().optional(),
  supervisorLevelTwoNipp: z.string().optional(),
  supervisorLevelTwoName: z.string().optional(),
  supervisorLevelTwoPosition: z.string().optional(),

  employmentStartDate: z.string().optional(),
  mutationDate: z.string().optional(),
  gender: z.string().optional(),
  beginningDate: z.string().optional(),
  endingDate: z.string().optional(),
  recordingDate: z.string().optional(),

  stat2: z.string().optional(),
  psCode: z.string().optional(),
  psText: z.string().optional(),
  psGroup: z.string().optional(),

  roles: z.array(z.number()).min(1, "At least one role is required"),
  status: z.string().min(1, "Status is required"),
});

export const internalUserCreateSchema = z
  .object({
    ...internalUserSchema.shape,
    password: z.string().min(8, "Minimum 8 characters required for password"),
    confirmPassword: z
      .string()
      .min(8, "Minimum 8 characters required for confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // attach the error to confirmPassword
  });

export type InternalUserFormData = z.output<typeof internalUserSchema>;
