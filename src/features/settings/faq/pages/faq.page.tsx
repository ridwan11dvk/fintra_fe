import { faqColumns } from "@/features/settings/faq/components/faq-columns";
import { FaqFormModal } from "@/features/settings/faq/components/faq-form-modal";
import {
  FAQ_CREATE_PERMISSION,
  FAQ_LIST_PAGE_TITLE,
  FAQ_LIST_PERMISSION,
  FAQ_TARGET_TYPE_CODE,
  FAQ_URL,
  faqQueryKeys,
  faqService,
  useDeleteFaqMutation,
  type FaqResponse,
} from "@/features/settings/faq/data";
import type { OptionItem } from "@railfinance/core/types";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useGetLookupValueOptions } from "@railfinance/core/masterdata";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function FaqPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedFaq, setSelectedFaq] = useState<FaqResponse | undefined>();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<FaqResponse | undefined>();

  const queryClient = useQueryClient();

  const { data: targetsData } = useGetLookupValueOptions(FAQ_TARGET_TYPE_CODE);

  const deleteFaqMutation = useDeleteFaqMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: faqQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setFaqToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedFaq(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: FaqResponse) => {
    setFormMode("edit");
    setSelectedFaq(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: FaqResponse) => {
    setFaqToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (faqToDelete) {
      deleteFaqMutation.mutate(faqToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: faqQueryKeys.lists(),
    });
  };

  const columns = faqColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  const targetFilterOptions =
    targetsData?.data?.map((item: OptionItem) => ({
      value: item.alias ?? item.value,
      label: item.label,
    })) || [];

  return (
    <Page
      type="base"
      title={FAQ_LIST_PAGE_TITLE}
      permission={FAQ_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Setting",
          url: "#",
        },
        {
          title: FAQ_LIST_PAGE_TITLE,
          url: FAQ_URL,
        },
      ]}
    >
      <PageHeader
        title="FAQ Management"
        description="Manage FAQ content displayed on public landing pages"
        actions={
          <div className="flex items-center gap-2">
            <ActionButton
              variant="add"
              label="Add"
              showLabel
              onClick={handleOpenCreate}
              permission={FAQ_CREATE_PERMISSION}
            />
          </div>
        }
      />
      <DataTable<FaqResponse>
        title="All FAQs"
        columns={columns}
        queryFn={faqService.listFaqs}
        queryKey={faqQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by question or target",
        }}
        filters={[
          {
            key: "target",
            label: "Target",
            type: "select",
            options: targetFilterOptions,
            clearable: true,
          },
        ]}
      />

      <FaqFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedFaq}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete FAQ"
        description={`Are you sure you want to delete "${faqToDelete?.question}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteFaqMutation.isPending}
      />
    </Page>
  );
}

export default FaqPage;
