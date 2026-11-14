import {
  partnerErpCodeSchema,
  useCreatePartnerErpCodeMutation,
  useUpdatePartnerErpCodeMutation,
  type PartnerErpCode,
  type PartnerErpCodeFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect as Combobox } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { useGetCompanyOptions } from "@railfinance/core/masterdata";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useCallback, useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

interface PartnerErpCodeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerErpCode>;
  onSuccess?: (data?: PartnerErpCode) => void;
}

type FormData = z.input<typeof partnerErpCodeSchema>;

export function PartnerErpCodeFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerErpCodeFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(partnerErpCodeSchema),
    defaultValues: {
      erpCode: defaultValues?.erpCode ?? "",
      companyCode: defaultValues?.companyCode ?? null,
      partnerClassificationId: defaultValues?.partnerClassificationId ?? null,
      partnerCategoryId: defaultValues?.partnerCategoryId ?? null,
      partnerLegalityId: defaultValues?.partnerLegalityId ?? null,
      partnerRoleId: defaultValues?.partnerRoleId ?? null,
      partnerTypeId: defaultValues?.partnerTypeId ?? null,
      partnerSubTypeId: defaultValues?.partnerSubTypeId ?? null,
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  const { data: companiesData } = useGetCompanyOptions();

  const createMutation = useCreatePartnerErpCodeMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerErpCodeMutation({
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

  const submitForm = handleSubmit(
    useCallback(
      (values: FormData) => {
        const outputData: PartnerErpCodeFormData = {
          ...values,
          companyCode: values.companyCode || null,
          endDate: values.endDate || null,
        };
        if (mode === "create") {
          createMutation.mutate(outputData);
        } else if (mode === "edit" && defaultValues?.id) {
          updateMutation.mutate({
            partnerId,
            erpCodeId: defaultValues.id,
            data: outputData,
          });
        }
      },
      [mode, defaultValues, createMutation, updateMutation, partnerId],
    ),
  );

  useEffect(() => {
    if (open) {
      reset({
        erpCode: defaultValues?.erpCode ?? "",
        companyCode: defaultValues?.companyCode ?? null,
        partnerClassificationId: defaultValues?.partnerClassificationId ?? null,
        partnerCategoryId: defaultValues?.partnerCategoryId ?? null,
        partnerLegalityId: defaultValues?.partnerLegalityId ?? null,
        partnerRoleId: defaultValues?.partnerRoleId ?? null,
        partnerTypeId: defaultValues?.partnerTypeId ?? null,
        partnerSubTypeId: defaultValues?.partnerSubTypeId ?? null,
        startDate: defaultValues?.startDate
          ? new Date(defaultValues.startDate).toISOString().split("T")[0]
          : "",
        endDate: defaultValues?.endDate
          ? new Date(defaultValues.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add ERP Code" : "Edit ERP Code"}
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="erpCode">
            ERP Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="erpCode"
            placeholder="Enter ERP code"
            disabled={isLoading}
            className={cn(errors.erpCode && "border-red-500")}
            {...register("erpCode")}
          />
          {errors.erpCode && (
            <p className="text-sm text-red-500">{errors.erpCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyCode">Company</Label>
          <Controller
            name="companyCode"
            control={control}
            render={({ field }) => (
              <Combobox
                id="companyCode"
                options={
                  companiesData?.data?.map((company) => ({
                    value: company.alias ?? company.value,
                    label: company.label,
                    description: company.description ?? "",
                  })) ?? []
                }
                value={field.value}
                onValueChange={(val) => field.onChange(val)}
                placeholder="Select company"
                disabled={isLoading}
                aria-invalid={!!errors.companyCode}
              />
            )}
          />
          {errors.companyCode && (
            <p className="text-sm text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            disabled={isLoading}
            className={cn("h-10", errors.startDate && "border-red-500")}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            disabled={isLoading}
            className={cn("h-10", errors.endDate && "border-red-500")}
            {...register("endDate")}
            min={useWatch({ name: "startDate", control }) || undefined}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default PartnerErpCodeFormModal;
