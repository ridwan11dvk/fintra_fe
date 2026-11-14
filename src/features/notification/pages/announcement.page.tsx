import {
  NOTIFICATION_CREATE_PERMISSION,
  NOTIFICATION_LIST_PAGE_TITLE,
  NOTIFICATION_UPDATE_PERMISSION,
  NOTIFICATION_URL,
  NotificationBulkFormModal,
  notificationColumns,
  NotificationDetailModal,
  NotificationFormModal,
  notificationQueryKeys,
  notificationService,
  useDeleteNotificationMutation,
  type NotificationResponse,
} from "@/features/notification";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useState } from "react";

export function AnnouncementPage() {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationResponse | null>(null);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<
    NotificationResponse | undefined
  >();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);

  const deleteNotificationMutation = useDeleteNotificationMutation({
    onSuccess: () => {
      setIsDeleteConfirmOpen(false);
      setNotificationToDelete(undefined);
    },
  });

  const handleViewDetail = (notification: NotificationResponse) => {
    setSelectedNotification(notification);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (notification: NotificationResponse) => {
    setNotificationToDelete(notification);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (notificationToDelete) {
      deleteNotificationMutation.mutate(notificationToDelete.id);
    }
  };

  const columns = notificationColumns({
    onShow: handleViewDetail,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={NOTIFICATION_LIST_PAGE_TITLE}
      permission={NOTIFICATION_UPDATE_PERMISSION}
      breadcrumbs={[
        {
          title: NOTIFICATION_LIST_PAGE_TITLE,
          url: NOTIFICATION_URL,
        },
      ]}
    >
      <PageHeader
        title="Notifications"
        description="View and manage all notifications sent to users"
        actions={
          <div className="flex gap-2">
            <ActionButton
              variant="add"
              label="Create"
              showLabel
              onClick={() => setIsFormOpen(true)}
              permission={NOTIFICATION_CREATE_PERMISSION}
            />
            <ActionButton
              variant="upload"
              label="Bulk Create"
              showLabel
              onClick={() => setIsBulkFormOpen(true)}
              permission={NOTIFICATION_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<NotificationResponse>
        title="All Notifications"
        columns={columns}
        queryFn={notificationService.listNotifications}
        queryKey={notificationQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by title or category",
        }}
      />

      <NotificationDetailModal
        notification={selectedNotification}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Notification"
        description={`Are you sure you want to delete this notification? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteNotificationMutation.isPending}
      />

      <NotificationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />

      <NotificationBulkFormModal
        isOpen={isBulkFormOpen}
        onClose={() => setIsBulkFormOpen(false)}
      />
    </Page>
  );
}

export default AnnouncementPage;
