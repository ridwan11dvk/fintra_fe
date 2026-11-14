import {
  useCreateCompanyTaxMutation,
  useUpdateCompanyTaxMutation,
} from "@/features/master-data/company-tax/data/company-tax.mutation";
import { companyTaxSchema } from "@/features/master-data/company-tax/data/company-tax.schema";
import type { CompanyTaxResponse } from "@/features/master-data/company-tax/data/company-tax.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetCompanyOptions,
  useGetTaxRateOptions,
} from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { z } from "zod";

type CompanyTaxFormData = z.output<typeof companyTaxSchema>;

interface CompanyTaxFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<CompanyTaxResponse>;
  onSuccess?: () => void;
}

export function CompanyTaxFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<CompanyTaxFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<CompanyTaxFormData>({
    resolver: zodResolver(companyTaxSchema),
    defaultValues: {
      companyCode: defaultValues?.companyCode || "",
      taxRateId: defaultValues?.taxRateId || undefined,
      glAccount: defaultValues?.glAccount || "",
      startDate: defaultValues?.startDate
        ? new Date(defaultValues.startDate).toISOString().split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? new Date(defaultValues.endDate).toISOString().split("T")[0]
        : "",
    },
  });

  const companyCodeValue = useWatch({ control, name: "companyCode" });
  const taxRateIdValue = useWatch({ control, name: "taxRateId" });

  const { data: companiesData } = useGetCompanyOptions({ enabled: open });
  const { data: taxRatesData } = useGetTaxRateOptions({ enabled: open });

  const createMutation = useCreateCompanyTaxMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCompanyTaxMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const mutation = mode === "create" ? createMutation : updateMutation;
  const isLoading = mutation.isPending;

  useEffect(() => {
    if (open) {
      reset({
        companyCode: defaultValues?.companyCode || "",
        taxRateId: defaultValues?.taxRateId || undefined,
        glAccount: defaultValues?.glAccount || "",
        startDate: defaultValues?.startDate
          ? new Date(defaultValues.startDate).toISOString().split("T")[0]
          : "",
        endDate: defaultValues?.endDate
          ? new Date(defaultValues.endDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: CompanyTaxFormData) => {
    const payload = {
      companyCode: data.companyCode,
      taxRateId: data.taxRateId,
      glAccount: data.glAccount || null,
      startDate: data.startDate ? `${data.startDate}T00:00:00` : "",
      endDate: data.endDate ? `${data.endDate}T00:00:00` : null,
    };

    if (mode === "create") {
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      updateMutation.mutate({ id: defaultValues.id, data: payload });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create"
          ? "Add Company Tax Assignment"
          : "Edit Company Tax Assignment"
      }
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Company Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Company Code <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="companyCode"
            control={control}
            render={() => (
              <QuerySelect
                name="companyCode"
                value={companyCodeValue}
                onValueChange={(value) =>
                  setValue("companyCode", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                options={
                  companiesData?.data?.map((company: OptionItem) => ({
                    value: company.label,
                    label: company.label,
                    description: company.description,
                  })) || []
                }
                placeholder="Select company..."
                disabled={isLoading}
                aria-invalid={!!errors.companyCode}
                className={cn(
                  errors.companyCode &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />
            )}
          />
          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Tax Rate */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Tax Rate <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="taxRateId"
            control={control}
            render={() => (
              <QuerySelect
                name="taxRateId"
                value={taxRateIdValue ? String(taxRateIdValue) : ""}
                onValueChange={(value) =>
                  setValue("taxRateId", Number(value), {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                options={
                  taxRatesData?.data?.map((rate: OptionItem) => ({
                    value: rate.value,
                    label: rate.label,
                    description: rate.description,
                  })) || []
                }
                placeholder="Select tax rate..."
                disabled={isLoading}
                aria-invalid={!!errors.taxRateId}
                className={cn(
                  errors.taxRateId &&
                    "border-red-500 focus-visible:ring-red-500",
                )}
              />
            )}
          />
          {errors.taxRateId && (
            <p className="text-xs text-red-500">{errors.taxRateId.message}</p>
          )}
        </div>

        {/* GL Account */}
        <div className="space-y-2">
          <Label htmlFor="glAccount" className="text-sm font-medium">
            GL Account
          </Label>
          <Input
            id="glAccount"
            placeholder="e.g., 2103"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.glAccount && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("glAccount")}
          />
          {errors.glAccount && (
            <p className="text-xs text-red-500">{errors.glAccount.message}</p>
          )}
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.startDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.endDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("endDate")}
            min={useWatch({ name: "startDate", control }) || undefined}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CompanyTaxFormModal;
