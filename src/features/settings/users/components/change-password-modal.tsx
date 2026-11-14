import {
  adminChangePasswordSchema,
  type AdminChangePasswordFormData,
} from "@/features/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { Field, FieldGroup, FieldLabel } from "@railfinance/core/ui/field";
import { PasswordInput } from "@railfinance/core/components/input";
import { useForm } from "react-hook-form";

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userName: string;
  onSubmit: (data: AdminChangePasswordFormData) => void;
  isLoading?: boolean;
}

export function ChangePasswordModal({
  open,
  onOpenChange,
  userName,
  onSubmit,
  isLoading = false,
}: Readonly<ChangePasswordModalProps>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminChangePasswordFormData>({
    resolver: zodResolver(adminChangePasswordSchema),
  });

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
    }
    onOpenChange(isOpen);
  };

  const handleFormSubmit = (data: AdminChangePasswordFormData) => {
    onSubmit(data);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <ConfirmationModal
      open={open}
      onOpenChange={handleClose}
      title="Change Password"
      description={`Change password for user "${userName}".`}
      onConfirm={handleSubmit(handleFormSubmit)}
      onCancel={handleCancel}
      confirmText={isLoading ? "Saving..." : "Change Password"}
      cancelText="Cancel"
      isLoading={isLoading}
      size="sm"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="py-4">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <PasswordInput
              id="newPassword"
              placeholder="Enter new password"
              {...register("newPassword")}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </Field>
        </FieldGroup>
      </form>
    </ConfirmationModal>
  );
}
