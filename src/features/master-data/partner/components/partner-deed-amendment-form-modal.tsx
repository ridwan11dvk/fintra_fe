import {
  partnerDeedAmendmentSchema,
  useCreatePartnerDeedAmendmentMutation,
  useUpdatePartnerDeedAmendmentMutation,
  type PartnerDeedAmendment,
  type PartnerDeedAmendmentFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerDeedAmendmentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  /** Owning partner (used for query cache invalidation). */
  partnerId: number;
  /** Legality record the amendments belong to. */
  legalityId: number;
  defaultValues?: Partial<PartnerDeedAmendment>;
  onSuccess?: (data?: PartnerDeedAmendment) => void;
}

type FormData = z.input<typeof partnerDeedAmendmentSchema>;

export function PartnerDeedAmendmentFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  legalityId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerDeedAmendmentFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(partnerDeedAmendmentSchema),
    defaultValues: {
      number: defaultValues?.number || "",
      date: defaultValues?.date || "",
      document: defaultValues?.document || "",
    },
  });

  const createMutation = useCreatePartnerDeedAmendmentMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerDeedAmendmentMutation(partnerId, {
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
    const outputData = values as PartnerDeedAmendmentFormData;
    if (mode === "create") {
      createMutation.mutate({ ...outputData, legalityId });
    } else if (mode === "edit" && defaultValues?.id) {
      updateMutation.mutate({
        legalityId,
        amendmentId: defaultValues.id,
        data: outputData,
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        number: defaultValues?.number || "",
        date: defaultValues?.date || "",
        document: defaultValues?.document || "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Deed Amendment" : "Edit Deed Amendment"}
      description={
        mode === "create"
          ? "Add a deed amendment to this legality record"
          : "Edit the deed amendment"
      }
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amendmentNumber">Amendment Number</Label>
          <Input
            id="amendmentNumber"
            {...register("number")}
            placeholder="e.g., AHU-0000456.AH.01.01.TAHUN 2022"
            className={cn(errors.number && "border-red-500")}
            disabled={isLoading}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amendmentDate">Amendment Date</Label>
          <Input
            id="amendmentDate"
            type="date"
            {...register("date")}
            className={cn(errors.date && "border-red-500")}
            disabled={isLoading}
          />
          {errors.date && (
            <p className="text-sm text-red-500">{errors.date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amendmentDocument">Document</Label>
          <Input
            id="amendmentDocument"
            {...register("document")}
            placeholder="Document path or reference"
            className={cn(errors.document && "border-red-500")}
            disabled={isLoading}
          />
          {errors.document && (
            <p className="text-sm text-red-500">{errors.document.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default PartnerDeedAmendmentFormModal;
