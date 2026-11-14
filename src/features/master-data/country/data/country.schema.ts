import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(1, "Country name is required").max(100),
  iso2Code: z
    .string()
    .refine((val) => val === "" || val.length === 2, {
      message: "ISO 2 code must be exactly 2 characters",
    })
    .transform((val) => (val === "" ? undefined : val.toUpperCase()))
    .optional(),
  iso3Code: z
    .string()
    .refine((val) => val === "" || val.length === 3, {
      message: "ISO 3 code must be exactly 3 characters",
    })
    .transform((val) => (val === "" ? undefined : val.toUpperCase()))
    .optional(),
  dialCode: z
    .string()
    .refine((val) => val === "" || /^\+\d+$/.test(val), {
      message: "Dial code must start with + followed by numbers (e.g., +62)",
    })
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  isActive: z.boolean(),
});

export type CountryFormData = z.output<typeof countrySchema>;
