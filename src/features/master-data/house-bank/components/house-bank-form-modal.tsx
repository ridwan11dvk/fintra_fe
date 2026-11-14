/* eslint-disable react-hooks/incompatible-library */
import {
  houseBankSchema,
  useCreateHouseBankMutation,
  useUpdateHouseBankMutation,
  type HouseBankResponse,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetBankOptions,
  useGetCompanyOptions,
  useGetCurrencyOptions,
} from "@railfinance/core/masterdata";
import type { OptionItem } from "@railfinance/core/types";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type HouseBankFormData = z.output<typeof houseBankSchema>;

interface HouseBankFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  defaultValues?: Partial<HouseBankResponse>;
  onSuccess?: () => void;
}

export function HouseBankFormModal({
  open,
  onOpenChange,
  mode,
  defaultValues,
  onSuccess,
}: Readonly<HouseBankFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(houseBankSchema),
    defaultValues: {
      bankCode: defaultValues?.bankCode || "",
      companyCode: defaultValues?.companyCode || "",
      currencyCode: defaultValues?.currencyCode || "",
      accountId: defaultValues?.accountId || "",
      accountNumber: defaultValues?.accountNumber || "",
      accountName: defaultValues?.accountName || "",
      erpCode: defaultValues?.erpCode || "",
      isActive: defaultValues?.isActive ?? true,
    } satisfies HouseBankFormData,
  });

  const createMutation = useCreateHouseBankMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateHouseBankMutation({
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

  const { data: banksData } = useGetBankOptions({ enabled: open });
  const { data: companiesData } = useGetCompanyOptions({ enabled: open });
  const { data: currenciesData } = useGetCurrencyOptions(undefined, {
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      reset({
        bankCode: defaultValues?.bankCode || "",
        companyCode: defaultValues?.companyCode || "",
        currencyCode: defaultValues?.currencyCode || "",
        accountId: defaultValues?.accountId || "",
        accountNumber: defaultValues?.accountNumber || "",
        accountName: defaultValues?.accountName || "",
        erpCode: defaultValues?.erpCode || "",
        isActive: defaultValues?.isActive ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  const onSubmit = (data: HouseBankFormData) => {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  const bankOptions =
    banksData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  const companyOptions =
    companiesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  const currencyOptions =
    currenciesData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
      description: item.description,
    })) || [];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add House Bank" : "Edit House Bank"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Create" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Bank Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Bank <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("bankCode")}
            onValueChange={(value) => setValue("bankCode", value)}
            options={bankOptions}
            placeholder="Select a bank"
            disabled={isLoading}
            aria-invalid={!!errors.bankCode}
            className={cn(
              errors.bankCode && "border-red-500 focus-visible:ring-red-500",
            )}
          />
          {errors.bankCode && (
            <p className="text-xs text-red-500">{errors.bankCode.message}</p>
          )}
        </div>

        {/* Account ID */}
        <div className="space-y-2">
          <Label htmlFor="accountId" className="text-sm font-medium">
            Account ID <span className="text-red-500">*</span>
          </Label>
          <Input
            id="accountId"
            placeholder="HB-BCA-001"
            {...register("accountId")}
            className={cn(
              "h-10",
              errors.accountId && "border-red-500 focus-visible:ring-red-500",
            )}
            disabled={isLoading}
          />
          {errors.accountId && (
            <p className="text-xs text-red-500">{errors.accountId.message}</p>
          )}
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <Label htmlFor="accountNumber" className="text-sm font-medium">
            Account Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="accountNumber"
            placeholder="1234567890"
            {...register("accountNumber")}
            className={cn(
              "h-10",
              errors.accountNumber &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            disabled={isLoading}
          />
          {errors.accountNumber && (
            <p className="text-xs text-red-500">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        {/* Company Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Company Code <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("companyCode")}
            onValueChange={(value) => setValue("companyCode", value)}
            options={companyOptions}
            placeholder="Select company..."
            disabled={isLoading}
            aria-invalid={!!errors.companyCode}
          />
          {errors.companyCode && (
            <p className="text-xs text-red-500">{errors.companyCode.message}</p>
          )}
        </div>

        {/* Currency Code */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Currency Code <span className="text-red-500">*</span>
          </Label>
          <QuerySelect
            value={watch("currencyCode")}
            onValueChange={(value) => setValue("currencyCode", value)}
            options={currencyOptions}
            placeholder="Select currency..."
            disabled={isLoading}
            aria-invalid={!!errors.currencyCode}
          />
          {errors.currencyCode && (
            <p className="text-xs text-red-500">
              {errors.currencyCode.message}
            </p>
          )}
        </div>

        {/* Account Name */}
        <div className="space-y-2">
          <Label htmlFor="accountName" className="text-sm font-medium">
            Account Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="accountName"
            placeholder="PT Fintra - BCA Operasional"
            {...register("accountName")}
            className={cn(
              "h-10",
              errors.accountName && "border-red-500 focus-visible:ring-red-500",
            )}
            disabled={isLoading}
          />
          {errors.accountName && (
            <p className="text-xs text-red-500">{errors.accountName.message}</p>
          )}
        </div>

        {/* ERP Code */}
        <div className="space-y-2">
          <Label htmlFor="erpCode" className="text-sm font-medium">
            ERP Code
          </Label>
          <Input
            id="erpCode"
            placeholder="ERP-BCA1"
            {...register("erpCode")}
            className={cn(
              "h-10",
              errors.erpCode && "border-red-500 focus-visible:ring-red-500",
            )}
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Optional: For ERP system integration
          </p>
          {errors.erpCode && (
            <p className="text-xs text-red-500">{errors.erpCode.message}</p>
          )}
        </div>

        {/* Active Status */}
        <div className="flex items-center space-x-3 pt-2">
          <Checkbox
            id="isActive"
            name="isActive"
            checked={watch("isActive")}
            onCheckedChange={(value) => setValue("isActive", value as boolean)}
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

export default HouseBankFormModal;
