/**
 * Access Request Feature - Reject Modal
 * Modal for entering rejection reason
 */

import {
  ACCESS_REQUEST_APPROVE_ACTION_TEXT,
  ACCESS_REQUEST_APPROVE_MODAL_TITLE,
  approveAccessRequestSchema,
  useChangeAccessRequestStatusMutation,
  type AccessRequestResponse,
} from "@/features/access-request";
import { useFilteredRoles } from "@/features/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { getZodErrorMessage } from "@railfinance/core/lib";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { QuerySelect } from "@railfinance/core/components/input";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

interface ApproveModalProps {
  request: AccessRequestResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const ApproveModal = ({
  request,
  open,
  onOpenChange,
  onSuccess,
}: ApproveModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(approveAccessRequestSchema),
    defaultValues: {
      roles: [],
      responseNotes: "",
    },
  });

  const { data: rolesData, isLoading: isLoadingRoles } = useFilteredRoles();

  const roles = rolesData?.data || [];

  useEffect(() => {
    if (
      !isLoadingRoles &&
      !rolesData?.data?.every(
        (role) => !request.roles.some((r) => r.id === role.id),
      )
    ) {
      //  pre-select only the requested roles that are available
      setValue(
        "roles",
        request.roles
          .filter((r) => rolesData?.data?.some((role) => role.id === r.id))
          .map((r) => r.id),
      );
    }
  }, [isLoadingRoles, rolesData, request.roles, setValue]);

  const { mutate: changeStatus, isPending } =
    useChangeAccessRequestStatusMutation({
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
        reset();
      },
    });

  const handleFormSubmit = (values: {
    responseNotes: string;
    roles: Array<number>;
  }) => {
    changeStatus({
      requestId: request.id,
      data: {
        status: "APPROVED",
        roles: values.roles,
        responseNotes: values.responseNotes,
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={ACCESS_REQUEST_APPROVE_MODAL_TITLE}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label className="mb-2 block">
            Roles <span className="text-destructive">*</span>
          </Label>
          <div className="flex-1 space-y-1 w-full">
            <Controller
              name="roles"
              control={control}
              render={({ field }) => (
                <QuerySelect
                  multiple
                  value={field.value || []}
                  onValueChange={(values) => field.onChange(values.map(Number))}
                  options={roles.map((role) => ({
                    label: role.name,
                    value: String(role.id),
                    description: role.description ?? role.name,
                  }))}
                  placeholder="Select roles..."
                  disabled={isPending || isLoadingRoles}
                  aria-invalid={!!errors.roles}
                />
              )}
            />
            {errors.roles && (
              <p className="text-sm text-destructive">
                {getZodErrorMessage(errors.roles)}
              </p>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="rejectionReason" className="mb-2 block">
            Notes
          </Label>
          <Textarea
            id="rejectionReason"
            placeholder="Enter notes for approving this access request (optional)..."
            className="min-h-25 resize-none"
            disabled={isPending}
            {...register("responseNotes")}
          />
          {errors.responseNotes && (
            <p className="text-sm text-destructive mt-2">
              {errors.responseNotes.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="success-outline" disabled={isPending}>
            {isPending ? "Approving..." : ACCESS_REQUEST_APPROVE_ACTION_TEXT}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
