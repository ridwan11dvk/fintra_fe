/* eslint-disable react-hooks/incompatible-library */
import {
  currencySchema,
  useCreateCurrencyMutation,
  useUpdateCurrencyMutation,
  type CurrencyResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetCountryOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type CurrencyFormData = z.output<typeof currencySchema>;

interface CurrencyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<CurrencyResponse>;
  onSuccess?: () => void;
}

export function CurrencyFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<CurrencyFormModalProps>) {
  const { data: countriesData } = useGetCountryOptions({ enabled: open });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      countryId: defaultValues?.countryId || 0,
      code: defaultValues?.code?.toUpperCase() || "",
      name: defaultValues?.name || "",
      symbol: defaultValues?.symbol || "",
      lowestValue: defaultValues?.lowestValue || undefined,
      isPrimary: defaultValues?.isPrimary || false,
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const createMutation = useCreateCurrencyMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCurrencyMutation({
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
        countryId: defaultValues?.countryId || 0,
        code: defaultValues?.code?.toUpperCase() || "",
        name: defaultValues?.name || "",
        symbol: defaultValues?.symbol || "",
        lowestValue: defaultValues?.lowestValue || undefined,
        isPrimary: defaultValues?.isPrimary || false,
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: CurrencyFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  const countries = countriesData?.data || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Currency" : "Edit Currency"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Country Field */}
        <div className="space-y-2">
          <Label htmlFor="countryId" className="text-sm font-medium">
            Country <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("countryId")?.toString() || ""}
            onValueChange={(value) =>
              value && setValue("countryId", Number.parseInt(value, 10))
            }
            options={(countries || []).map((country) => ({
              value: country.value.toString(),
              label: country.description ?? "",
              description: country.description ?? "",
            }))}
            placeholder="Select a country"
            disabled={isLoading}
            className={cn(
              errors.countryId && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.countryId && (
            <p className="text-xs text-red-500">{errors.countryId.message}</p>
          )}
        </div>

        {/* Currency Code Field */}
        <div className="space-y-2">
          <Label htmlFor="code" className="text-sm font-medium">
            Currency Code <span className="text-red-500">*</span>
          </Label>
          <Input
            id="code"
            placeholder="e.g., IDR"
            maxLength={3}
            disabled={isLoading}
            className={cn(
              "h-10 uppercase",
              errors.code && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("code")}
          />
          {errors.code && (
            <p className="text-xs text-red-500">{errors.code.message}</p>
          )}
        </div>

        {/* Currency Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Currency Name
          </Label>
          <Input
            id="name"
            placeholder="e.g., Indonesian Rupiah"
            maxLength={100}
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.name && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Currency Symbol Field */}
        <div className="space-y-2">
          <Label htmlFor="symbol" className="text-sm font-medium">
            Symbol
          </Label>
          <Input
            id="symbol"
            placeholder="e.g., Rp"
            maxLength={10}
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.symbol && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("symbol")}
          />
          {errors.symbol && (
            <p className="text-xs text-red-500">{errors.symbol.message}</p>
          )}
        </div>

        {/* Lowest Value Field */}
        <div className="space-y-2">
          <Label htmlFor="lowestValue" className="text-sm font-medium">
            Lowest Value
          </Label>
          <Input
            id="lowestValue"
            type="number"
            placeholder="e.g., 1.0"
            step="0.01"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.lowestValue && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("lowestValue", {
              setValueAs: (v: unknown) => {
                if (v === "" || v === null || v === undefined) return undefined;
                const n = Number(v);
                return Number.isNaN(n) ? undefined : n;
              },
            })}
          />
          {errors.lowestValue && (
            <p className="text-xs text-red-500">{errors.lowestValue.message}</p>
          )}
        </div>

        {/* Primary Checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="isPrimary"
            checked={watch("isPrimary")}
            onCheckedChange={(checked) =>
              setValue("isPrimary", checked === true)
            }
            disabled={isLoading}
          />
          <Label
            htmlFor="isPrimary"
            className="text-sm font-medium cursor-pointer"
          >
            Primary Currency
          </Label>
        </div>

        {/* Active Checkbox */}
        <div className="flex items-center space-x-3">
          <Checkbox
            id="isActive"
            checked={watch("isActive")}
            onCheckedChange={(checked) =>
              setValue("isActive", checked === true)
            }
            disabled={isLoading}
          />
          <Label
            htmlFor="isActive"
            className="text-sm font-medium cursor-pointer"
          >
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}

export default CurrencyFormModal;
