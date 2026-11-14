import {
  internalUserColumns,
  internalUserDetailUrl,
  internalUserEditUrl,
  useBulkUpdateInternalUserRkipDateLimitMutation,
  useChangeInternalUserPasswordMutation,
  useDeleteInternalUserMutation,
  useDeleteInternalUserRkipDateLimitMutation,
  useFilteredRoles,
  userQueryKeys,
  userService,
  useUpdateAllInternalUsersRkipDateLimitMutation,
  useUpdateInternalUserRkipDateLimitMutation,
  type AdminChangePasswordFormData,
  type InternalUserResponse,
} from "@/features/settings";
import { useAuth } from "@railfinance/core";
import { DataTable } from "@railfinance/core/components/data-table";
import { DatePicker, QuerySelect } from "@railfinance/core/components/input";
import { ConfirmationModal, Modal } from "@railfinance/core/components/modal";
import { Visibility } from "@railfinance/core/components/visibility";
import { formatDate, toast } from "@railfinance/core/lib";
import { Button } from "@railfinance/core/ui/button";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Label } from "@railfinance/core/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChangePasswordModal } from "./change-password-modal";
export function InternalUserList() {
  const navigate = useNavigate();
  const { data: rolesData } = useFilteredRoles();

  const roles = (rolesData?.data || []).map((role) => ({
    value: String(role.id),
    label: role.name,
    description: role.description || "",
  }));

  const { hasModule } = useAuth();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    data: InternalUserResponse | null;
  }>({ open: false, data: null });

  const [changePasswordModal, setChangePasswordModal] = useState<{
    open: boolean;
    data: InternalUserResponse | null;
  }>({ open: false, data: null });

  const [updateDateModal, setUpdateDateModal] = useState<{
    open: boolean;
    data: InternalUserResponse | null;
    selectedDate: Date | undefined;
  }>({ open: false, data: null, selectedDate: undefined });

  const [deleteRkipDateModal, setDeleteRkipDateModal] = useState<{
    open: boolean;
    data: InternalUserResponse | null;
  }>({ open: false, data: null });

  const [bulkUpdateModal, setBulkUpdateModal] = useState<{
    open: boolean;
    allUsers: boolean;
    selectedRoleIds: number[];
    selectedDate: Date | undefined;
  }>({
    open: false,
    allUsers: false,
    selectedRoleIds: [],
    selectedDate: undefined,
  });

  const deleteMutation = useDeleteInternalUserMutation({
    onSuccess: () => {
      toast.success("Internal user deleted successfully");
      setDeleteModal({ open: false, data: null });
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  const changePasswordMutation = useChangeInternalUserPasswordMutation({
    onSuccess: () => {
      toast.success("Password changed successfully");
      setChangePasswordModal({ open: false, data: null });
    },
    onError: (error) => {
      toast.error(`Failed to change password: ${error.message}`);
    },
  });

  const updateRkipDateLimitMutation =
    useUpdateInternalUserRkipDateLimitMutation({
      onSuccess: () => {
        toast.success("RKIP date limit updated successfully");
        setUpdateDateModal({
          open: false,
          data: null,
          selectedDate: undefined,
        });
      },
      onError: (error) => {
        toast.error(`Failed to update RKIP date limit: ${error.message}`);
      },
    });

  const bulkUpdateMutation = useBulkUpdateInternalUserRkipDateLimitMutation({
    onSuccess: (response) => {
      toast.success(response.message || "RKIP date limit updated successfully");
      setBulkUpdateModal({
        open: false,
        allUsers: false,
        selectedRoleIds: [],
        selectedDate: undefined,
      });
    },
    onError: (error) => {
      toast.error(`Failed to bulk update RKIP date limit: ${error.message}`);
    },
  });

  const updateAllMutation = useUpdateAllInternalUsersRkipDateLimitMutation({
    onSuccess: (response) => {
      toast.success(
        response.message || "RKIP date limit updated for all users",
      );
      setBulkUpdateModal({
        open: false,
        allUsers: false,
        selectedRoleIds: [],
        selectedDate: undefined,
      });
    },
    onError: (error) => {
      toast.error(
        `Failed to update RKIP date limit for all users: ${error.message}`,
      );
    },
  });

  const deleteRkipDateLimitMutation =
    useDeleteInternalUserRkipDateLimitMutation({
      onSuccess: () => {
        toast.success("RKIP date limit deleted successfully");
        setDeleteRkipDateModal({ open: false, data: null });
        setUpdateDateModal({
          open: false,
          data: null,
          selectedDate: undefined,
        });
      },
      onError: (error) => {
        toast.error(`Failed to delete RKIP date limit: ${error.message}`);
      },
    });

  const handleShow = (data: InternalUserResponse) => {
    navigate(internalUserDetailUrl(data.id));
  };

  const handleEdit = (data: InternalUserResponse) => {
    navigate(internalUserEditUrl(data.id));
  };

  const handleDelete = (data: InternalUserResponse) => {
    setDeleteModal({ open: true, data });
  };

  const handleChangePassword = (data: InternalUserResponse) => {
    setChangePasswordModal({ open: true, data });
  };

  const confirmDelete = () => {
    if (deleteModal.data) {
      deleteMutation.mutate(deleteModal.data.id);
    }
  };

  const handleChangeDateLimit = (data: InternalUserResponse) => {
    setUpdateDateModal({
      open: true,
      data,
      selectedDate: data.rkipInputPeriodUntil
        ? new Date(data.rkipInputPeriodUntil)
        : undefined,
    });
  };

  const handleUpdateRkipDateLimit = () => {
    if (updateDateModal.data && updateDateModal.selectedDate) {
      const dateString = formatDate(
        updateDateModal.selectedDate,
        "YYYY-MM-DD",
        false,
      );
      updateRkipDateLimitMutation.mutate({
        id: updateDateModal.data.id,
        dateLimit: dateString,
      });
    }
  };

  const handleDeleteRkipDateLimit = (data: InternalUserResponse) => {
    setDeleteRkipDateModal({ open: true, data });
  };

  const handleOpenBulkUpdate = () => {
    setBulkUpdateModal({
      open: true,
      allUsers: false,
      selectedRoleIds: [],
      selectedDate: undefined,
    });
  };

  const handleBulkUpdateRkipDateLimit = () => {
    if (bulkUpdateModal.selectedDate) {
      const dateString = formatDate(
        bulkUpdateModal.selectedDate,
        "YYYY-MM-DD",
        false,
      );
      if (bulkUpdateModal.allUsers) {
        updateAllMutation.mutate({ dateLimit: dateString });
      } else if (bulkUpdateModal.selectedRoleIds.length > 0) {
        bulkUpdateMutation.mutate({
          roleIds: bulkUpdateModal.selectedRoleIds,
          dateLimit: dateString,
        });
      }
    }
  };

  const confirmDeleteRkipDateLimit = () => {
    if (deleteRkipDateModal.data) {
      deleteRkipDateLimitMutation.mutate(deleteRkipDateModal.data.id);
    }
  };

  const columns = internalUserColumns({
    onShow: handleShow,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onChangePassword: handleChangePassword,
    onChangeInputDate: handleChangeDateLimit,
  });

  return (
    <>
      <DataTable<InternalUserResponse>
        title="All Internal User"
        columns={columns}
        queryFn={userService.listInternalUsers}
        queryKey={userQueryKeys.internal()}
        search={{
          key: "search",
          placeholder: "Search by name, email, or nipp",
        }}
        filters={[
          {
            type: "select-search",
            key: "roleId",
            label: "Role",
            placeholder: "Filter by role",
            options: roles,
          },
        ]}
        actions={
          <Visibility visible={hasModule("Tax")}>
            <Button onClick={handleOpenBulkUpdate}>
              Update RKIP Input Period
            </Button>
          </Visibility>
        }
      />

      <Modal
        open={bulkUpdateModal.open}
        onOpenChange={(open) =>
          setBulkUpdateModal({
            open,
            allUsers: open ? bulkUpdateModal.allUsers : false,
            selectedRoleIds: open ? bulkUpdateModal.selectedRoleIds : [],
            selectedDate: open ? bulkUpdateModal.selectedDate : undefined,
          })
        }
        title="Bulk Update RKIP Date Limit"
        description={
          bulkUpdateModal.allUsers
            ? "Update RKIP input period limit date for ALL internal users."
            : "Update RKIP input period limit date for all users with selected roles."
        }
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() =>
                setBulkUpdateModal({
                  open: false,
                  allUsers: false,
                  selectedRoleIds: [],
                  selectedDate: undefined,
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkUpdateRkipDateLimit}
              disabled={
                !bulkUpdateModal.selectedDate ||
                (!bulkUpdateModal.allUsers &&
                  bulkUpdateModal.selectedRoleIds.length === 0) ||
                bulkUpdateMutation.isPending ||
                updateAllMutation.isPending
              }
            >
              {bulkUpdateMutation.isPending || updateAllMutation.isPending
                ? "Saving..."
                : "Save"}
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="all-users"
              checked={bulkUpdateModal.allUsers}
              onCheckedChange={(checked) =>
                setBulkUpdateModal({
                  ...bulkUpdateModal,
                  allUsers: checked === true,
                  selectedRoleIds: [],
                })
              }
            />
            <Label htmlFor="all-users" className="cursor-pointer">
              All Tax Module Users
            </Label>
          </div>
          {!bulkUpdateModal.allUsers && (
            <div className="flex flex-col gap-2">
              <Label>Select Roles</Label>
              <QuerySelect
                multiple
                placeholder="Select roles..."
                value={bulkUpdateModal.selectedRoleIds}
                onValueChange={(value) =>
                  setBulkUpdateModal({
                    ...bulkUpdateModal,
                    selectedRoleIds: (value as (string | number)[]).map(Number),
                  })
                }
                options={roles}
              />
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label>RKIP Date Limit</Label>
            <DatePicker
              value={bulkUpdateModal.selectedDate}
              minDate={new Date()}
              onChange={(date) =>
                setBulkUpdateModal({
                  ...bulkUpdateModal,
                  selectedDate: date,
                })
              }
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={updateDateModal.open}
        onOpenChange={(open) =>
          setUpdateDateModal({
            open,
            data: open ? updateDateModal.data : null,
            selectedDate: open ? updateDateModal.selectedDate : undefined,
          })
        }
        title="Update RKIP Date Limit"
        description={`Update RKIP input period limit date for user "${updateDateModal.data?.name}".`}
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() =>
                setUpdateDateModal({
                  open: false,
                  data: null,
                  selectedDate: undefined,
                })
              }
            >
              Cancel
            </Button>
            {updateDateModal.data?.rkipInputPeriodUntil && (
              <Button
                variant="destructive"
                onClick={() => {
                  if (updateDateModal.data) {
                    handleDeleteRkipDateLimit(updateDateModal.data);
                  }
                }}
                disabled={updateRkipDateLimitMutation.isPending}
              >
                Remove Limit
              </Button>
            )}
            <Button
              onClick={handleUpdateRkipDateLimit}
              disabled={
                !updateDateModal.selectedDate ||
                updateRkipDateLimitMutation.isPending
              }
            >
              {updateRkipDateLimitMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        }
      >
        <div className="py-4">
          <DatePicker
            value={updateDateModal.selectedDate}
            minDate={new Date()}
            onChange={(date) =>
              setUpdateDateModal({
                ...updateDateModal,
                selectedDate: date,
              })
            }
          />
        </div>
      </Modal>
      <ConfirmationModal
        open={deleteRkipDateModal.open}
        onOpenChange={(open) =>
          setDeleteRkipDateModal({
            open,
            data: open ? deleteRkipDateModal.data : null,
          })
        }
        title="Remove RKIP Date Limit"
        description={`Are you sure you want to remove the RKIP date limit for user "${deleteRkipDateModal.data?.name}"?`}
        onConfirm={confirmDeleteRkipDateLimit}
        onCancel={() => setDeleteRkipDateModal({ open: false, data: null })}
        confirmText="Remove"
        cancelText="Cancel"
        confirmVariant="destructive"
        isLoading={deleteRkipDateLimitMutation.isPending}
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

export default InternalUserList;
