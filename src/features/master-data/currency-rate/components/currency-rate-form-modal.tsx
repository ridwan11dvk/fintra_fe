/* eslint-disable react-hooks/incompatible-library */
import {
  currencyRateSchema,
  useCreateCurrencyRateMutation,
  useUpdateCurrencyRateMutation,
  type CurrencyRateResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { useGetCurrencyOptions } from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type CurrencyRateFormData = z.output<typeof currencyRateSchema>;

interface CurrencyRateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<CurrencyRateResponse>;
  onSuccess?: () => void;
}

export function CurrencyRateFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<CurrencyRateFormModalProps>) {
  const { data: currenciesData } = useGetCurrencyOptions(undefined, {
    enabled: open,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<CurrencyRateFormData>({
    resolver: zodResolver(currencyRateSchema),
    defaultValues: {
      currencyCode: defaultValues?.currencyCode || "",
      rateType: defaultValues?.rateType || "KMK",
      rate: defaultValues?.rate || 0,
      description: defaultValues?.description || "",
      startDate: defaultValues?.startDate
        ? defaultValues.startDate.split("T")[0]
        : "",
      endDate: defaultValues?.endDate
        ? defaultValues.endDate.split("T")[0]
        : "",
    },
  });

  const createMutation = useCreateCurrencyRateMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCurrencyRateMutation({
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
        currencyCode: defaultValues?.currencyCode || "",
        rateType: defaultValues?.rateType || "KMK",
        rate: defaultValues?.rate || 0,
        description: defaultValues?.description || "",
        startDate: defaultValues?.startDate
          ? defaultValues.startDate.split("T")[0]
          : "",
        endDate: defaultValues?.endDate
          ? defaultValues.endDate.split("T")[0]
          : "",
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: CurrencyRateFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  const currencyOptions =
    currenciesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label + (item.alias ? ` (${item.alias})` : ""),
      description: item.description ?? "",
    })) || [];

  const rateTypeOptions = [
    { value: "KMK", label: "KMK", description: "Ministry of Finance" },
    { value: "BI", label: "BI", description: "Bank Indonesia" },
  ];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Currency Rate" : "Edit Currency Rate"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Currency Code Field */}
        <div className="space-y-2">
          <Label htmlFor="currencyCode" className="text-sm font-medium">
            Currency Code <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("currencyCode")}
            onValueChange={(value) => setValue("currencyCode", value)}
            options={currencyOptions}
            placeholder="Select a currency"
            disabled={isLoading}
            aria-invalid={!!errors.currencyCode}
          />
          {errors.currencyCode && (
            <p className="text-xs text-red-500">
              {errors.currencyCode.message}
            </p>
          )}
        </div>

        {/* Rate Type Field */}
        <div className="space-y-2">
          <Label htmlFor="rateType" className="text-sm font-medium">
            Rate Type <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("rateType")}
            onValueChange={(value) => setValue("rateType", value)}
            options={rateTypeOptions}
            placeholder="Select rate type"
            disabled={isLoading}
            aria-invalid={!!errors.rateType}
          />
          {errors.rateType && (
            <p className="text-xs text-red-500">{errors.rateType.message}</p>
          )}
        </div>

        {/* Rate Field */}
        <div className="space-y-2">
          <Label htmlFor="rate" className="text-sm font-medium">
            Rate <span className="text-red-500">*</span>
          </Label>
          <Input
            id="rate"
            type="number"
            placeholder="e.g., 15500.500000"
            step="0.000001"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.rate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("rate", {
              valueAsNumber: true,
            })}
          />
          {errors.rate && (
            <p className="text-xs text-red-500">{errors.rate.message}</p>
          )}
        </div>

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
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        {/* End Date Field */}
        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date (Optional - Leave empty for ongoing)
          </Label>
          <Input
            id="endDate"
            type="date"
            disabled={isLoading}
            min={watch("startDate") || undefined}
            className={cn(
              "h-10",
              errors.endDate && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("endDate")}
          />
          {errors.endDate && (
            <p className="text-xs text-red-500">{errors.endDate.message}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description (Optional)
          </Label>
          <textarea
            id="description"
            placeholder="e.g., Official rate for import duties"
            maxLength={500}
            disabled={isLoading}
            className={cn(
              "h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              errors.description && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-red-500">{errors.description.message}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CurrencyRateFormModal;
