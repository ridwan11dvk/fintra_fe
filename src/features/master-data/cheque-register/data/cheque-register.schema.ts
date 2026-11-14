import { z } from "zod";

const chequeRegisterEntrySchema = z.object({
  chequeNumber: z.string().trim().min(1, "Cheque Number is required").max(50),
  status: z.enum(["OPEN", "BOOKED", "CANCEL", "RELEASE"]),
  releaseDate: z.string(),
});

export const chequeRegisterSchema = z
  .object({
    houseBankId: z.string().min(1, "House Bank is required"),
    cheques: z.array(chequeRegisterEntrySchema).min(1, "At least one Cheque Number is required"),
    isActive: z.boolean(),
  })
  .superRefine((value, context) => {
    const firstIndexByNumber = new Map<string, number>();
    value.cheques.forEach((cheque, index) => {
      const normalizedNumber = cheque.chequeNumber.trim().toLocaleLowerCase();
      const firstIndex = firstIndexByNumber.get(normalizedNumber);
      if (firstIndex !== undefined) {
        const message = "Cheque Number must be unique within this batch";
        context.addIssue({
          code: "custom",
          path: ["cheques", firstIndex, "chequeNumber"],
          message,
        });
        context.addIssue({
          code: "custom",
          path: ["cheques", index, "chequeNumber"],
          message,
        });
      } else {
        firstIndexByNumber.set(normalizedNumber, index);
      }

      if (cheque.status === "RELEASE" && !cheque.releaseDate) {
        context.addIssue({
          code: "custom",
          path: ["cheques", index, "releaseDate"],
          message: "Release Date is required when Status is Release",
        });
      }
      if (cheque.status !== "RELEASE" && cheque.releaseDate) {
        context.addIssue({
          code: "custom",
          path: ["cheques", index, "releaseDate"],
          message: "Release Date must be empty unless Status is Release",
        });
      }
    });
  });

export type ChequeRegisterFormValues = z.infer<typeof chequeRegisterSchema>;
