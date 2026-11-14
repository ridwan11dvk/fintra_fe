/**
 * Access Request Feature - Reject Modal
 * Modal for entering rejection reason
 */

import {
  ACCESS_REQUEST_REJECT_ACTION_TEXT,
  ACCESS_REQUEST_REJECT_MODAL_TITLE,
  rejectAccessRequestSchema,
  useChangeAccessRequestStatusMutation,
  type AccessRequestResponse,
} from "@/features/access-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@railfinance/core/ui/button";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useForm } from "react-hook-form";

interface RejectModalProps {
  request: AccessRequestResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const RejectModal = ({
  request,
  open,
  onOpenChange,
  onSuccess,
}: RejectModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(rejectAccessRequestSchema),
    defaultValues: {
      rejectionReason: "",
    },
  });

  const { mutate: changeStatus, isPending } =
    useChangeAccessRequestStatusMutation({
      onSuccess: () => {
        onOpenChange(false);
        onSuccess?.();
        reset();
      },
    });
  const handleFormSubmit = (values: { rejectionReason: string }) => {
    changeStatus({
      requestId: request.id,
      data: {
        status: "REJECTED",
        roles: [],
        responseNotes: values.rejectionReason,
      },
    });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={ACCESS_REQUEST_REJECT_MODAL_TITLE}
      size="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="rejectionReason" className="mb-2 block">
            Rejection Reason
          </Label>
          <Textarea
            id="rejectionReason"
            placeholder="Enter reason for rejecting this access request..."
            className="min-h-25 resize-none"
            disabled={isPending}
            {...register("rejectionReason")}
          />
          {errors.rejectionReason && (
            <p className="text-sm text-destructive mt-2">
              {errors.rejectionReason.message}
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
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Rejecting..." : ACCESS_REQUEST_REJECT_ACTION_TEXT}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
