/* eslint-disable react-hooks/incompatible-library */
import {
  partnerTaxSchema,
  useCreatePartnerTaxMutation,
  useUpdatePartnerTaxMutation,
  type PartnerTaxFormData,
  type PartnerTaxRate,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { useGetTaxRateOptions } from "@railfinance/core/masterdata";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface PartnerTaxFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId?: number;
  isLocalMode?: boolean;
  defaultValues?: Partial<PartnerTaxRate>;
  onSuccess?: (data?: PartnerTaxRate) => void;
}

export function PartnerTaxFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  isLocalMode = false,
  defaultValues,
  onSuccess,
}: Readonly<PartnerTaxFormModalProps>) {
  // Fetch tax rates for dropdown
  const { data: taxRatesData, isLoading: taxRatesLoading } =
    useGetTaxRateOptions({ enabled: open });

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<PartnerTaxFormData>({
    resolver: zodResolver(partnerTaxSchema),
    defaultValues: {
      taxRateId: defaultValues?.taxRateId || 0,
      active: defaultValues?.active ?? true,
    },
  });

  const createMutation = useCreatePartnerTaxMutation(partnerId, {
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerTaxMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const isSubmitting = isLocalMode
    ? taxRatesLoading
    : createMutation.isPending || updateMutation.isPending || taxRatesLoading;

  const submitForm = handleSubmit((data) => {
    const payload = {
      partnerId,
      taxRateId: data.taxRateId,
      active: data.active,
    };

    if (isLocalMode) {
      // Local mode: just call onSuccess with the data
      onSuccess?.({
        ...payload,
        id: defaultValues?.id
          ? defaultValues.id
          : globalThis.crypto.randomUUID(), // Generate a temporary ID for new entries
      } as unknown as PartnerTaxRate);
      reset();
      onOpenChange(false);
      return;
    }

    if (mode === "create") {
      // API mode: create mutation
      createMutation.mutate(payload);
    } else if (defaultValues?.id) {
      // API mode: update mutation
      updateMutation.mutate({
        partnerId,
        taxId: defaultValues.id,
        data: payload,
      });
    }
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  const taxRates = taxRatesData?.data || taxRatesData || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Partner Tax" : "Edit Partner Tax"}
      description={
        mode === "create"
          ? "Associate a tax rate with this partner"
          : "Edit tax rate association"
      }
      onConfirm={submitForm}
      isLoading={isSubmitting}
    >
      <form className="space-y-4">
        {/* Tax Rate Selection */}
        <div className="space-y-2">
          <Label htmlFor="taxRateId">Tax Rate *</Label>
          <QuerySelect
            value={watch("taxRateId") ? String(watch("taxRateId")) : ""}
            onValueChange={(value) => setValue("taxRateId", Number(value))}
            options={
              (taxRates &&
                Array.isArray(taxRates) &&
                taxRates.map((rate: OptionItem) => ({
                  value: String(rate.value),
                  label: rate.label,
                  description: `${rate.label} (${rate.description})`,
                }))) ||
              []
            }
            placeholder="Select a tax rate"
            disabled={isSubmitting}
            className={cn(errors.taxRateId && "border-red-500")}
          />
          {errors.taxRateId && (
            <p className="text-sm text-red-500">{errors.taxRateId?.message}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="active"
            checked={watch("active")}
            onCheckedChange={(checked) =>
              setValue("active", checked as boolean)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="active" className="font-normal cursor-pointer">
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}
