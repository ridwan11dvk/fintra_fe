import {
  externalUserColumns,
  externalUserDetailUrl,
  externalUserEditUrl,
  useChangeExternalUserPasswordMutation,
  useDeleteExternalUserMutation,
  userQueryKeys,
  userService,
  type AdminChangePasswordFormData,
  type ExternalUser,
} from "@/features/settings";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { toast } from "@railfinance/core/lib";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChangePasswordModal } from "./change-password-modal";
export function ExternalUserList() {
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: ExternalUser | null;
  }>({ open: false, data: null });

  const [changePasswordModal, setChangePasswordModal] = useState<{
    open: boolean;
    data: ExternalUser | null;
  }>({ open: false, data: null });

  const deleteMutation = useDeleteExternalUserMutation({
    onSuccess: () => {
      toast.success("External user deleted successfully");
      setDeleteModal({ open: false, data: null });
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  const changePasswordMutation = useChangeExternalUserPasswordMutation({
    onSuccess: () => {
      toast.success("Password changed successfully");
      setChangePasswordModal({ open: false, data: null });
    },
    onError: (error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
  });

  const handleShow = (data: ExternalUser) => {
    navigate(externalUserDetailUrl(data.id));
  };

  const handleEdit = (data: ExternalUser) => {
    navigate(externalUserEditUrl(data.id));
  };

  const handleDelete = (data: ExternalUser) => {
    setDeleteModal({ open: true, data });
  };

  const handleChangePassword = (data: ExternalUser) => {
    setChangePasswordModal({ open: true, data });
  };

  const confirmDelete = () => {
    if (deleteModal.data) {
      deleteMutation.mutate(deleteModal.data.id);
    }
  };

  const columns = externalUserColumns({
    onShow: handleShow,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onChangePassword: handleChangePassword,
  });

  return (
    <>
      <DataTable<ExternalUser>
        title="All External Users"
        columns={columns}
        queryFn={userService.listExternalUsers}
        queryKey={userQueryKeys.external()}
        search={{
          key: "search",
          placeholder: "Search by name, email, or username",
        }}
      />
      <ConfirmationModal
        open={deleteModal.open}
        onOpenChange={(open) =>
          setDeleteModal({ open, data: open ? deleteModal.data : null })
        }
        title="Delete User"
        description={`Are you sure you want to delete the user "${deleteModal.data?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ open: false, data: null })}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
      <ChangePasswordModal
        open={changePasswordModal.open}
        onOpenChange={(open) =>
          setChangePasswordModal({
            open,
            data: open ? changePasswordModal.data : null,
          })
        }
        userName={changePasswordModal.data?.name ?? ""}
        onSubmit={(data: AdminChangePasswordFormData) => {
          if (changePasswordModal.data) {
            changePasswordMutation.mutate({
              id: changePasswordModal.data.id,
              data,
            });
          }
        }}
        isLoading={changePasswordMutation.isPending}
      />
    </>
  );
}

export default ExternalUserList;
