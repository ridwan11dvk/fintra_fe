import {
  depositEditSchema,
  depositQueryKeys,
  useUpdateDepositMutation,
  type DepositEditFormData,
  type DepositEditRequest,
  type DepositResponse,
} from "@/features/treasury";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@railfinance/core/ui/dialog";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface DepositFormModalProps {
  deposit: DepositResponse | undefined;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function DepositFormModal({
  deposit,
  isOpen,
  onClose,
  onSuccess,
}: Readonly<DepositFormModalProps>) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<DepositEditFormData>({
    resolver: zodResolver(depositEditSchema),
    defaultValues: {
      agentCode: deposit?.agentCode || "",
      virtualAccount: deposit?.virtualAccount || "",
      name: deposit?.name || "",
      referenceNumber: deposit?.referenceNumber || "",
      depositDate: deposit?.depositDate
        ? deposit.depositDate.split("T")[0]
        : "",
      openingBalance: deposit?.openingBalance
        ? String(deposit.openingBalance)
        : "",
      amount: deposit?.amount ? String(deposit.amount) : "",
      closingBalance: deposit?.closingBalance
        ? String(deposit.closingBalance)
        : "",
      bankCode: deposit?.bankCode || "",
      documentPath: deposit?.documentPath || "",
    },
  });

  useEffect(() => {
    if (isOpen && deposit) {
      reset({
        agentCode: deposit.agentCode || "",
        virtualAccount: deposit.virtualAccount || "",
        name: deposit.name || "",
        referenceNumber: deposit.referenceNumber || "",
        depositDate: deposit.depositDate
          ? deposit.depositDate.split("T")[0]
          : "",
        openingBalance: deposit.openingBalance
          ? String(deposit.openingBalance)
          : "",
        amount: deposit.amount ? String(deposit.amount) : "",
        closingBalance: deposit.closingBalance
          ? String(deposit.closingBalance)
          : "",
        bankCode: deposit.bankCode || "",
        documentPath: deposit.documentPath || "",
      });
    }
  }, [isOpen, deposit, reset]);

  const updateMutation = useUpdateDepositMutation({
    onSuccess: () => {
      if (deposit?.id) {
        queryClient.invalidateQueries({
          queryKey: depositQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
          queryKey: depositQueryKeys.detail(deposit.id),
        });
        queryClient.invalidateQueries({
          queryKey: depositQueryKeys.summaries(),
        });
      }
      onClose();
      onSuccess?.();
      reset();
    },
  });

  const onSubmit = (data: DepositEditFormData) => {
    if (!deposit?.id) return;

    // Convert form data (strings) to request data (proper types)
    const requestData: DepositEditRequest = {
      agentCode: data.agentCode || undefined,
      virtualAccount: data.virtualAccount || undefined,
      name: data.name || undefined,
      referenceNumber: data.referenceNumber || undefined,
      depositDate: data.depositDate || undefined,
      openingBalance: data.openingBalance
        ? Number.parseFloat(data.openingBalance)
        : undefined,
      amount: data.amount ? Number.parseFloat(data.amount) : undefined,
      closingBalance: data.closingBalance
        ? Number.parseFloat(data.closingBalance)
        : undefined,
      bankCode: data.bankCode || undefined,
      documentPath: data.documentPath || undefined,
      documentFile: data.documentFile,
    };

    updateMutation.mutate({
      id: deposit.id,
      data: requestData,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deposit</DialogTitle>
          <DialogDescription>
            Update deposit information. Only certain fields are available for
            editing.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Agent Information Section */}
          <div>
            <h3 className="font-semibold mb-4">Agent Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agentCode">Agent Code</Label>
                <Input
                  id="agentCode"
                  placeholder="Max 20 characters"
                  {...register("agentCode")}
                />
                {errors.agentCode && (
                  <span className="text-sm text-destructive">
                    {errors.agentCode.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Max 255 characters"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-sm text-destructive">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="virtualAccount">Virtual Account</Label>
                <Input
                  id="virtualAccount"
                  placeholder="Max 18 characters"
                  {...register("virtualAccount")}
                />
                {errors.virtualAccount && (
                  <span className="text-sm text-destructive">
                    {errors.virtualAccount.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference No.</Label>
                <Input
                  id="referenceNumber"
                  placeholder="Max 255 characters"
                  {...register("referenceNumber")}
                />
                {errors.referenceNumber && (
                  <span className="text-sm text-destructive">
                    {errors.referenceNumber.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Deposit Details Section */}
          <div>
            <h3 className="font-semibold mb-4">Deposit Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="depositDate">Deposit Date</Label>
                <Input
                  id="depositDate"
                  type="date"
                  {...register("depositDate")}
                />
                {errors.depositDate && (
                  <span className="text-sm text-destructive">
                    {errors.depositDate.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankCode">Bank Code</Label>
                <Input
                  id="bankCode"
                  placeholder="Max 20 characters"
                  {...register("bankCode")}
                />
                {errors.bankCode && (
                  <span className="text-sm text-destructive">
                    {errors.bankCode.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingBalance">Opening Balance</Label>
                <Input
                  id="openingBalance"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register("openingBalance")}
                />
                {errors.openingBalance && (
                  <span className="text-sm text-destructive">
                    {errors.openingBalance.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register("amount")}
                />
                {errors.amount && (
                  <span className="text-sm text-destructive">
                    {errors.amount.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="closingBalance">Closing Balance</Label>
                <Input
                  id="closingBalance"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  {...register("closingBalance")}
                />
                {errors.closingBalance && (
                  <span className="text-sm text-destructive">
                    {errors.closingBalance.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Document Section */}
          <div>
            <h3 className="font-semibold mb-4">Document</h3>
            <div className="space-y-2 mb-4">
              <Label htmlFor="documentPath">Document Path</Label>
              <Textarea
                id="documentPath"
                placeholder="Document path or URL"
                {...register("documentPath")}
              />
              {errors.documentPath && (
                <span className="text-sm text-destructive">
                  {errors.documentPath.message}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentFile">Upload Document (Optional)</Label>
              <Controller
                name="documentFile"
                control={control}
                render={({ field: { onChange } }) => (
                  <Input
                    id="documentFile"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      onChange(e.target.files?.[0]);
                    }}
                  />
                )}
              />
              <p className="text-xs text-muted-foreground">
                Supported: PDF, JPG, JPEG, PNG (Max 5MB)
              </p>
              {errors.documentFile && (
                <span className="text-sm text-destructive">
                  {errors.documentFile.message}
                </span>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
