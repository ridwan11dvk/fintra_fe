import {
  partnerLegalitySchema,
  useCreatePartnerLegalityMutation,
  useUpdatePartnerLegalityMutation,
  type PartnerLegality,
  type PartnerLegalityFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerLegalityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerLegality>;
  onSuccess?: (data?: PartnerLegality) => void;
}

type FormData = z.input<typeof partnerLegalitySchema>;

export function PartnerLegalityFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerLegalityFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(partnerLegalitySchema),
    defaultValues: {
      nibNumber: defaultValues?.nibNumber || "",
      nibDate: defaultValues?.nibDate || "",
      nibDocument: defaultValues?.nibDocument || "",
      deedEstablishmentNumber: defaultValues?.deedEstablishmentNumber || "",
      deedEstablishmentDate: defaultValues?.deedEstablishmentDate || "",
      deedEstablishmentDocument: defaultValues?.deedEstablishmentDocument || "",
    },
  });

  const createMutation = useCreatePartnerLegalityMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerLegalityMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const submitForm = handleSubmit((values) => {
    // After validation by zodResolver, values match the output type
    const outputData = values as PartnerLegalityFormData;
    if (mode === "create") {
      createMutation.mutate(outputData);
    } else if (mode === "edit" && defaultValues?.id) {
      updateMutation.mutate({
        legalityId: defaultValues.id,
        data: outputData,
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        nibNumber: defaultValues?.nibNumber || "",
        nibDate: defaultValues?.nibDate || "",
        nibDocument: defaultValues?.nibDocument || "",
        deedEstablishmentNumber: defaultValues?.deedEstablishmentNumber || "",
        deedEstablishmentDate: defaultValues?.deedEstablishmentDate || "",
        deedEstablishmentDocument:
          defaultValues?.deedEstablishmentDocument || "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Legality" : "Edit Legality"}
      description={
        mode === "create"
          ? "Create the legality record for this partner"
          : "Edit the legality record of this partner"
      }
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nibNumber">NIB Number</Label>
          <Input
            id="nibNumber"
            {...register("nibNumber")}
            placeholder="e.g., 0220110000000"
            className={cn(errors.nibNumber && "border-red-500")}
            disabled={isLoading}
          />
          {errors.nibNumber && (
            <p className="text-sm text-red-500">{errors.nibNumber.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nibDate">NIB Date</Label>
          <Input
            id="nibDate"
            type="date"
            {...register("nibDate")}
            className={cn(errors.nibDate && "border-red-500")}
            disabled={isLoading}
          />
          {errors.nibDate && (
            <p className="text-sm text-red-500">{errors.nibDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="nibDocument">NIB Document</Label>
          <Input
            id="nibDocument"
            {...register("nibDocument")}
            placeholder="Document path or reference"
            className={cn(errors.nibDocument && "border-red-500")}
            disabled={isLoading}
          />
          {errors.nibDocument && (
            <p className="text-sm text-red-500">{errors.nibDocument.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deedEstablishmentNumber">
            Deed of Establishment Number
          </Label>
          <Input
            id="deedEstablishmentNumber"
            {...register("deedEstablishmentNumber")}
            placeholder="e.g., AHU-0000123.AH.01.01.TAHUN 2020"
            className={cn(errors.deedEstablishmentNumber && "border-red-500")}
            disabled={isLoading}
          />
          {errors.deedEstablishmentNumber && (
            <p className="text-sm text-red-500">
              {errors.deedEstablishmentNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deedEstablishmentDate">
            Deed of Establishment Date
          </Label>
          <Input
            id="deedEstablishmentDate"
            type="date"
            {...register("deedEstablishmentDate")}
            className={cn(errors.deedEstablishmentDate && "border-red-500")}
            disabled={isLoading}
          />
          {errors.deedEstablishmentDate && (
            <p className="text-sm text-red-500">
              {errors.deedEstablishmentDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deedEstablishmentDocument">
            Deed of Establishment Document
          </Label>
          <Input
            id="deedEstablishmentDocument"
            {...register("deedEstablishmentDocument")}
            placeholder="Document path or reference"
            className={cn(errors.deedEstablishmentDocument && "border-red-500")}
            disabled={isLoading}
          />
          {errors.deedEstablishmentDocument && (
            <p className="text-sm text-red-500">
              {errors.deedEstablishmentDocument.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default PartnerLegalityFormModal;
