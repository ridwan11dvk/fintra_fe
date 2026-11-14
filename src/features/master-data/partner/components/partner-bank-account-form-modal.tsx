/* eslint-disable react-hooks/incompatible-library */
import {
  partnerBankAccountSchema,
  useCreatePartnerBankAccountMutation,
  useUpdatePartnerBankAccountMutation,
  type PartnerBankAccount,
  type PartnerBankAccountFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect as Combobox } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { useGetBankOptions, useGetCompanyOptions, useGetCurrencyOptions } from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerBankAccountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerBankAccount>;
  onSuccess?: (data?: PartnerBankAccount) => void;
}

type FormData = z.input<typeof partnerBankAccountSchema>;

export function PartnerBankAccountFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerBankAccountFormModalProps>) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(partnerBankAccountSchema),
    defaultValues: {
      accountNumber: defaultValues?.accountNumber || "",
      holderName: defaultValues?.holderName || "",
      bankCenter: defaultValues?.bankCenter || "",
      bankBranch: defaultValues?.bankBranch || "",
      companyCode: defaultValues?.companyCode || "",
      currency: defaultValues?.currency || "",
      swiftCode: defaultValues?.swiftCode || "",
      isDefaultPayment: defaultValues?.isDefaultPayment ?? false,
      active: defaultValues?.active ?? true,
    },
  });

  const isActive = watch("active");

  const { data: banksData } = useGetBankOptions({ enabled: open });
  const { data: companiesData } = useGetCompanyOptions({ enabled: open });
  const { data: currenciesData } = useGetCurrencyOptions(undefined, { enabled: open });

  const createMutation = useCreatePartnerBankAccountMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerBankAccountMutation(partnerId, {
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
        // After validation by zodResolver, values are transformed to match output type
        const outputData = values as PartnerBankAccountFormData;
        if (mode === "create") {
          createMutation.mutate(outputData);
        } else if (mode === "edit" && defaultValues?.id) {
          updateMutation.mutate({
            bankAccountId: defaultValues.id,
            data: outputData,
          });
        }
      },
      [mode, defaultValues, createMutation, updateMutation],
    ),
  );

  useEffect(() => {
    if (open) {
      reset({
        accountNumber: defaultValues?.accountNumber || "",
        holderName: defaultValues?.holderName || "",
        bankCenter: defaultValues?.bankCenter || "",
        bankBranch: defaultValues?.bankBranch || "",
        companyCode: defaultValues?.companyCode || "",
        currency: defaultValues?.currency || "",
        swiftCode: defaultValues?.swiftCode || "",
        isDefaultPayment: defaultValues?.isDefaultPayment ?? false,
        active: defaultValues?.active ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Bank Account" : "Edit Bank Account"}
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accountNumber">
            Account Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="accountNumber"
            {...register("accountNumber")}
            placeholder="e.g., 1234567890"
            className={cn(errors.accountNumber && "border-red-500")}
            disabled={isLoading}
          />
          {errors.accountNumber && (
            <p className="text-sm text-red-500">
              {errors.accountNumber.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="holderName">
            Account Holder <span className="text-red-500">*</span>
          </Label>
          <Input
            id="holderName"
            {...register("holderName")}
            placeholder="e.g., PT Kereta Api Indonesia"
            className={cn(errors.holderName && "border-red-500")}
            disabled={isLoading}
          />
          {errors.holderName && (
            <p className="text-sm text-red-500">{errors.holderName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankCenter">Bank Center</Label>
          <Controller
            name="bankCenter"
            control={control}
            render={({ field }) => (
              <Combobox
                id="bankCenter"
                options={banksData?.data?.map((bank) => ({
                  value: bank.alias ?? bank.value,
                  label: bank.label ?? bank.value,
                  description: bank.description ?? "",
                }))}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                placeholder="Select bank center"
                disabled={isLoading}
                aria-invalid={!!errors.bankCenter}
              />
            )}
          />
          {errors.bankCenter && (
            <p className="text-sm text-red-500">{errors.bankCenter.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankBranch">Bank Branch</Label>
          <Input
            id="bankBranch"
            {...register("bankBranch")}
            placeholder="e.g., Jakarta Kota"
            className={cn(errors.bankBranch && "border-red-500")}
            disabled={isLoading}
          />
          {errors.bankBranch && (
            <p className="text-sm text-red-500">{errors.bankBranch.message}</p>
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
                options={companiesData?.data?.map((company) => ({
                  value: company.alias ?? company.value,
                  label: company.label,
                  description: company.description ?? "",
                }))}
                value={field.value ?? ""}
                onValueChange={field.onChange}
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
          <Label htmlFor="currency">Currency</Label>
          <Controller
            name="currency"
            control={control}
            render={({ field }) => (
              <Combobox
                id="currency"
                options={currenciesData?.data?.map((currency) => ({
                  value: currency.alias ?? currency.value,
                  label: currency.alias + ' - ' + currency.label,
                  description: currency.description ?? "",
                }))}
                value={field.value ?? ""}
                onValueChange={field.onChange}
                placeholder="Select currency"
                disabled={isLoading}
                aria-invalid={!!errors.currency}
              />
            )}
          />
          {errors.currency && (
            <p className="text-sm text-red-500">{errors.currency.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="swiftCode">Swift Code</Label>
          <Input
            id="swiftCode"
            {...register("swiftCode")}
            placeholder="e.g., CENAIDJA"
            className={cn(errors.swiftCode && "border-red-500")}
            disabled={isLoading}
          />
          {errors.swiftCode && (
            <p className="text-sm text-red-500">{errors.swiftCode.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isDefaultPayment"
            checked={watch("isDefaultPayment")}
            onCheckedChange={(checked) =>
              setValue("isDefaultPayment", checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="isDefaultPayment" className="cursor-pointer">
            Default payment account
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="active"
            checked={isActive}
            onCheckedChange={(checked) =>
              setValue("active", checked as boolean)
            }
            disabled={isLoading}
          />
          <Label htmlFor="active" className="cursor-pointer">
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}

export default PartnerBankAccountFormModal;
