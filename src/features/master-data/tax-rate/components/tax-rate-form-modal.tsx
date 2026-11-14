/* eslint-disable react-hooks/incompatible-library */
import {
  taxRateSchema,
  useCreateTaxRateMutation,
  useUpdateTaxRateMutation,
  type TaxRateResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { useGetLookupValueOptions } from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Textarea } from "@railfinance/core/ui/textarea";
import { Activity, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type TaxRateFormData = z.infer<typeof taxRateSchema>;

interface TaxRateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<TaxRateResponse>;
  onSuccess?: () => void;
}

function generateCodeFromName(name: string) {
  return name
    .trim()
    .toUpperCase()
    .replaceAll(/[^A-Z0-9\s]/g, "")
    .replaceAll(/\s+/g, "_")
    .substring(0, 50);
}

function getDefaultTaxRateValues(defaultValues?: Partial<TaxRateResponse>) {
  return {
    code: defaultValues?.code || "",
    name: defaultValues?.name || "",
    description: defaultValues?.description || "",
    taxType: defaultValues?.taxType || "",
    ratePercent: defaultValues?.ratePercent || 0,
    coefficientNumerator: defaultValues?.coefficientNumerator || 1,
    coefficientDenominator: defaultValues?.coefficientDenominator || 1,
    isUsedInRkip: defaultValues?.isUsedInRkip ?? false,
    postingType: defaultValues?.postingType || "",
    isPostingRequired: defaultValues?.isPostingRequired ?? false,
    startDate: defaultValues?.startDate
      ? new Date(defaultValues.startDate).toISOString().split("T")[0]
      : "",
    endDate: defaultValues?.endDate
      ? new Date(defaultValues.endDate).toISOString().split("T")[0]
      : "",
  };
}

export function TaxRateFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<TaxRateFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(taxRateSchema),
    defaultValues: getDefaultTaxRateValues(defaultValues),
  });

  const createMutation = useCreateTaxRateMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateTaxRateMutation({
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

  const { data: postingTypeOptions } = useGetLookupValueOptions(
    "POSTING_TYPE",
    {
      enabled: open,
    },
  );

  const taxTypeValue = watch("taxType");
  const nameValue = watch("name");
  const codeManuallyEditedRef = useRef(false);

  useEffect(() => {
    if (open) {
      codeManuallyEditedRef.current = Boolean(defaultValues?.code);
      reset(getDefaultTaxRateValues(defaultValues));
    }
  }, [open, defaultValues, reset]);

  // Auto-generate code from name while it has not been edited manually.
  useEffect(() => {
    if (open && mode === "create" && !codeManuallyEditedRef.current) {
      setValue("code", generateCodeFromName(nameValue));
    }
  }, [open, mode, nameValue, setValue]);

  const onSubmit = (data: TaxRateFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data: data,
      });
    }
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Tax Rate" : "Edit Tax Rate"}
      size="lg"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., PPN 17%"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.name && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., PPN_17"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.code && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("code", {
              onChange: () => {
                codeManuallyEditedRef.current = true;
              },
            })}
          />
          {errors.code && (
            <p className="text-sm text-red-500">{errors.code.message}</p>
          )}
        </div>
        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Tax rate description"
            disabled={isLoading}
            rows={2}
            className={cn(
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Tax Type Field */}
        <div className="space-y-2">
          <Label htmlFor="taxType" className="text-sm font-medium">
            Tax Type <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("taxType") || ""}
            onValueChange={(value) =>
              setValue("taxType", (value || "") as "PPN" | "PPh" | "")
            }
            options={[
              { value: "PPN", label: "PPN", description: "" },
              { value: "PPh", label: "PPh", description: "" },
            ]}
            placeholder="Select tax type"
            disabled={isLoading}
            className={cn(
              errors.taxType && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.taxType && (
            <p className="text-sm text-red-500">{errors.taxType.message}</p>
          )}
        </div>

        {/* Rate Percent Field */}
        <div className="space-y-2">
          <Label htmlFor="ratePercent" className="text-sm font-medium">
            Rate Percent (%) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ratePercent"
            type="number"
            step="0.01"
            min="0"
            max="100"
            placeholder="e.g., 17.00"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.ratePercent && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("ratePercent", { valueAsNumber: true })}
          />
          {errors.ratePercent && (
            <p className="text-sm text-red-500">{errors.ratePercent.message}</p>
          )}
        </div>

        {/* Coefficient Numerator Field */}
        <div className="space-y-2">
          <Label htmlFor="coefficientNumerator" className="text-sm font-medium">
            Coefficient Numerator <span className="text-red-500">*</span>
          </Label>
          <Input
            id="coefficientNumerator"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g., 17.00"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.coefficientNumerator &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("coefficientNumerator", { valueAsNumber: true })}
          />
          {errors.coefficientNumerator && (
            <p className="text-sm text-red-500">
              {errors.coefficientNumerator.message}
            </p>
          )}
        </div>

        {/* Coefficient Denominator Field */}
        <div className="space-y-2">
          <Label
            htmlFor="coefficientDenominator"
            className="text-sm font-medium"
          >
            Coefficient Denominator <span className="text-red-500">*</span>
          </Label>
          <Input
            id="coefficientDenominator"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="e.g., 100.00"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.coefficientDenominator &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("coefficientDenominator", { valueAsNumber: true })}
          />
          {errors.coefficientDenominator && (
            <p className="text-sm text-red-500">
              {errors.coefficientDenominator.message}
            </p>
          )}
        </div>

        <Activity mode={taxTypeValue === "PPh" ? "visible" : "hidden"}>
          {/* Posting Type Field */}
          <div className="space-y-2">
            <Label htmlFor="postingType" className="text-sm font-medium">
              Posting Type
            </Label>
            <QuerySelect
              value={watch("postingType") || ""}
              onValueChange={(value) => setValue("postingType", value || "")}
              options={(postingTypeOptions?.data || []).map((opt) => ({
                value: opt.alias ?? opt.value,
                label: opt.label,
                description: opt.description ?? opt.label,
              }))}
              placeholder="Select posting type"
              disabled={isLoading}
              className={cn(
                "h-10",
                errors.postingType &&
                  "border-red-500 focus-visible:ring-red-500",
              )}
            />
            {errors.postingType && (
              <p className="text-sm text-red-500">
                {errors.postingType.message}
              </p>
            )}
          </div>
        </Activity>

        {/* Start Date Field */}
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
            <p className="text-sm text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date Field */}
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
            min={watch("startDate") || undefined}
          />
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        <Activity mode={taxTypeValue === "PPh" ? "visible" : "hidden"}>
          {/* Is Posting Required Field */}
          <div className="flex items-center space-x-2">
            <Controller
              name="isPostingRequired"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="isPostingRequired"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label
              htmlFor="isPostingRequired"
              className="font-normal cursor-pointer"
            >
              Posting Required
            </Label>
          </div>
        </Activity>
        {/* Used in RKIP Field */}
        <div className="flex items-center space-x-2">
          <Controller
            name="isUsedInRkip"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isUsedInRkip"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="isUsedInRkip" className="font-normal cursor-pointer">
            Used in RKIP
          </Label>
        </div>
      </form>
    </Modal>
  );
}
