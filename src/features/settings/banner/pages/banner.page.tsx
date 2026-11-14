import { bannerColumns } from "@/features/settings/banner/components/banner-columns";
import { BannerFormModal } from "@/features/settings/banner/components/banner-form-modal";
import {
  BANNER_CREATE_PERMISSION,
  BANNER_LIST_PAGE_TITLE,
  BANNER_LIST_PERMISSION,
  BANNER_URL,
  bannerQueryKeys,
  bannerService,
  useDeleteBannerMutation,
  type BannerResponse,
} from "@/features/settings/banner/data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function BannerPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedBanner, setSelectedBanner] = useState<
    BannerResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<
    BannerResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteBannerMutation = useDeleteBannerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setBannerToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedBanner(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: BannerResponse) => {
    setFormMode("edit");
    setSelectedBanner(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: BannerResponse) => {
    setBannerToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bannerToDelete) {
      deleteBannerMutation.mutate(bannerToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: bannerQueryKeys.lists(),
    });
  };

  const columns = bannerColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={BANNER_LIST_PAGE_TITLE}
      permission={BANNER_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Setting",
          url: "#",
        },
        {
          title: BANNER_LIST_PAGE_TITLE,
          url: BANNER_URL,
        },
      ]}
    >
      <PageHeader
        title="Banner Management"
        description="Manage banner/carousel content displayed across applications"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={BANNER_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<BannerResponse>
        title="All Banners"
        columns={columns}
        queryFn={bannerService.listBanners}
        queryKey={bannerQueryKeys.lists()}
        search={{
          key: "title",
          placeholder: "Search by title or target",
        }}
      />

      <BannerFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedBanner}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Banner"
        description={`Are you sure you want to delete "${bannerToDelete?.title}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteBannerMutation.isPending}
      />
    </Page>
  );
}

export default BannerPage;
