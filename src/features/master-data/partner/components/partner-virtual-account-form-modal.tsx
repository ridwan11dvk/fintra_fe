/* eslint-disable react-hooks/incompatible-library */
import {
  partnerVirtualAccountSchema,
  useCreatePartnerVirtualAccountMutation,
  useUpdatePartnerVirtualAccountMutation,
  type PartnerVirtualAccount,
  type PartnerVirtualAccountFormData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuerySelect as Combobox } from "@railfinance/core/components/input";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { useGetBankOptions, useGetCompanyOptions } from "@railfinance/core/masterdata";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

interface PartnerVirtualAccountFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partnerId: number;
  defaultValues?: Partial<PartnerVirtualAccount>;
  onSuccess?: (data?: PartnerVirtualAccount) => void;
}

type FormData = z.input<typeof partnerVirtualAccountSchema>;

export function PartnerVirtualAccountFormModal({
  open,
  onOpenChange,
  mode,
  partnerId = 0,
  defaultValues,
  onSuccess,
}: Readonly<PartnerVirtualAccountFormModalProps>) {
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
    resolver: zodResolver(partnerVirtualAccountSchema),
    defaultValues: {
      number: defaultValues?.number || "",
      holder: defaultValues?.holder || "",
      bankCode: defaultValues?.bankCode || "",
      type: defaultValues?.type || "",
      companyCode: defaultValues?.companyCode || "",
      active: defaultValues?.active ?? true,
    },
  });

  const isActive = watch("active");

  const { data: companiesData } = useGetCompanyOptions();
  const { data: banksData } = useGetBankOptions();

  const createMutation = useCreatePartnerVirtualAccountMutation(partnerId, {
    onSuccess: (data) => {
      reset();
      onOpenChange(false);
      onSuccess?.(data.data);
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdatePartnerVirtualAccountMutation(partnerId, {
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
        const outputData = values as PartnerVirtualAccountFormData;
        if (mode === "create") {
          createMutation.mutate(outputData);
        } else if (mode === "edit" && defaultValues?.id) {
          updateMutation.mutate({
            virtualAccountId: defaultValues.id,
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
        number: defaultValues?.number || "",
        holder: defaultValues?.holder || "",
        bankCode: defaultValues?.bankCode || "",
        type: defaultValues?.type || "",
        companyCode: defaultValues?.companyCode || "",
        active: defaultValues?.active ?? true,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Virtual Account" : "Edit Virtual Account"}
      onConfirm={submitForm}
      isLoading={isLoading}
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="vaType">Account Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={isLoading}
              >
                <SelectTrigger
                  id="vaType"
                  className={cn("w-full", errors.type && "border-red-500")}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bankCode">
            Bank <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="bankCode"
            control={control}
            render={({ field }) => (
              <Combobox
                id="bankCode"
                options={banksData?.data?.map((bank) => ({
                  value: bank.alias as string,
                  label: bank.alias + " - " + bank.label,
                  description: bank.description ?? "",
                }))}
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select bank"
                disabled={isLoading}
                aria-invalid={!!errors.bankCode}
              />
            )}
          />
          {errors.bankCode && (
            <p className="text-sm text-red-500">{errors.bankCode.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="number">
            Virtual Account Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="number"
            {...register("number")}
            type="number"
            placeholder="e.g., 8808012345678901"
            className={cn(errors.number && "border-red-500")}
            disabled={isLoading}
          />
          {errors.number && (
            <p className="text-sm text-red-500">{errors.number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="holder">
            Account Holder <span className="text-red-500">*</span>
          </Label>
          <Input
            id="holder"
            {...register("holder")}
            placeholder="e.g., PT Kereta Api Indonesia"
            className={cn(errors.holder && "border-red-500")}
            disabled={isLoading}
          />
          {errors.holder && (
            <p className="text-sm text-red-500">{errors.holder.message}</p>
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
                  value: company.alias as string,
                  label: company.label,
                  description: company.description ?? "",
                }))}
                value={field.value}
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

export default PartnerVirtualAccountFormModal;
