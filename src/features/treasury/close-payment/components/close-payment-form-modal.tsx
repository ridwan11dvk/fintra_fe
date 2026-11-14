import { zodResolver } from "@hookform/resolvers/zod";
import { FileUploadInput } from "@railfinance/core/components/input";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateClosePaymentMutation } from "../data/close-payment.mutation";
import {
  closePaymentEditSchema,
  type ClosePaymentEditFormData,
} from "../data/close-payment.schema";
import type { ClosePaymentResponse } from "../data/close-payment.types";

interface ClosePaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: Partial<ClosePaymentResponse>;
  onSuccess?: () => void;
}

/**
 * Edit Close Payment Modal - Only allows editing specific fields when payment_status = 0
 * Based on PRD section 5.3
 */
export function ClosePaymentFormModal({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
}: Readonly<ClosePaymentFormModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm<ClosePaymentEditFormData>({
    resolver: zodResolver(closePaymentEditSchema),
    defaultValues: {
      transId: defaultValues?.transId ?? "",
      paymentDate: defaultValues?.paymentDate ?? "",
      bankCode: defaultValues?.bankCode ?? "",
      invoiceNumber: defaultValues?.invoiceNumber ?? "",
      ppfNumber: defaultValues?.ppfNumber ?? "",
      bankRuleId: defaultValues?.bankRuleId ?? 0,
      transferReceiptFile: undefined,
    } as ClosePaymentEditFormData,
  });

  const updateMutation = useUpdateClosePaymentMutation({
    onSuccess: () => {
      reset();
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const onSubmit = (data: ClosePaymentEditFormData) => {
    if (defaultValues?.id) {
      updateMutation.mutate({
        id: defaultValues.id,
        data,
      });
    }
  };

  useEffect(() => {
    if (open) {
      reset({
        transId: defaultValues?.transId ?? "",
        paymentDate: defaultValues?.paymentDate ?? "",
        bankCode: defaultValues?.bankCode ?? "",
        invoiceNumber: defaultValues?.invoiceNumber ?? "",
        ppfNumber: defaultValues?.ppfNumber ?? "",
        bankRuleId: defaultValues?.bankRuleId ?? 0,
        transferReceiptFile: undefined,
      });
    }
  }, [open, defaultValues, reset]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Close Payment"
      onConfirm={handleSubmit(onSubmit)}
      confirmText="Update"
      isLoading={updateMutation.isPending}
    >
      <form className="space-y-4">
        <div>
          <Controller
            name="transferReceiptFile"
            control={control}
            render={({ field }) => (
              <FileUploadInput
                id="transferReceiptFile"
                label="Upload Transfer Receipt"
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={5}
                acceptedFormats={["PDF", "JPG", "JPEG", "PNG"]}
                error={errors.transferReceiptFile?.message}
                onChange={(e) => {
                  // Extract the first File from FileList
                  const file = e.target.files?.[0];
                  field.onChange(file);
                }}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className="border-2 rounded-md p-3">
          <div className="space-y-1 mb-3">
            <Label htmlFor="transId">Transaction ID *</Label>
            <Input
              id="transId"
              placeholder="Enter transaction ID (max 100 characters)"
              {...register("transId")}
            />
            {errors.transId && (
              <span className="text-sm text-destructive">
                {errors.transId.message}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <Label htmlFor="paymentDate">Payment Date *</Label>
            <Input
              id="paymentDate"
              type="datetime-local"
              {...register("paymentDate")}
            />
            {errors.paymentDate && (
              <span className="text-sm text-destructive">
                {errors.paymentDate.message}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <Label htmlFor="bankCode">Bank Code *</Label>
            <Input
              id="bankCode"
              placeholder="Enter bank code (e.g., BNI)"
              {...register("bankCode")}
            />
            {errors.bankCode && (
              <span className="text-sm text-destructive">
                {errors.bankCode.message}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <Label htmlFor="invoiceNumber">Invoice Number *</Label>
            <Input
              id="invoiceNumber"
              placeholder="Enter invoice number (max 100 characters)"
              {...register("invoiceNumber")}
            />
            {errors.invoiceNumber && (
              <span className="text-sm text-destructive">
                {errors.invoiceNumber.message}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <Label htmlFor="ppfNumber">PPF Number *</Label>
            <Input
              id="ppfNumber"
              placeholder="Enter PPF number (max 100 characters)"
              {...register("ppfNumber")}
            />
            {errors.ppfNumber && (
              <span className="text-sm text-destructive">
                {errors.ppfNumber.message}
              </span>
            )}
          </div>

          <div className="space-y-1 mb-3">
            <Label htmlFor="bankRuleId">Bank Rule ID *</Label>
            <Input
              id="bankRuleId"
              type="number"
              placeholder="Enter bank rule ID"
              {...register("bankRuleId", { valueAsNumber: true })}
            />
            {errors.bankRuleId && (
              <span className="text-sm text-destructive">
                {errors.bankRuleId.message}
              </span>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
