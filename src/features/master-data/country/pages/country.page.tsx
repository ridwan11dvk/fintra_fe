import {
  COUNTRY_CREATE_PERMISSION,
  COUNTRY_LIST_PAGE_TITLE,
  COUNTRY_LIST_PERMISSION,
  COUNTRY_URL,
  CountryFormModal,
  countryColumns,
  countryQueryKeys,
  countryService,
  useDeleteCountryMutation,
  type CountryResponse,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { DataTable } from "@railfinance/core/components/data-table";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CountryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedCountry, setSelectedCountry] = useState<
    CountryResponse | undefined
  >();

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState<
    CountryResponse | undefined
  >();

  const queryClient = useQueryClient();

  const deleteCountryMutation = useDeleteCountryMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: countryQueryKeys.lists(),
      });
      setIsDeleteConfirmOpen(false);
      setCountryToDelete(undefined);
    },
  });

  const handleOpenCreate = () => {
    setFormMode("create");
    setSelectedCountry(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (data: CountryResponse) => {
    setFormMode("edit");
    setSelectedCountry(data);
    setIsFormOpen(true);
  };

  const handleDelete = (data: CountryResponse) => {
    setCountryToDelete(data);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (countryToDelete) {
      deleteCountryMutation.mutate(countryToDelete.id);
    }
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: countryQueryKeys.lists(),
    });
  };

  const columns = countryColumns({
    onEdit: handleOpenEdit,
    onDelete: handleDelete,
  });

  return (
    <Page
      type="base"
      title={COUNTRY_LIST_PAGE_TITLE}
      permission={COUNTRY_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: COUNTRY_LIST_PAGE_TITLE,
          url: COUNTRY_URL,
        },
      ]}
    >
      <PageHeader
        title="Country"
        description="Manage country master data including ISO codes and dial codes for international identification"
        actions={
          <ActionButton
            variant="add"
            label="Add"
            showLabel
            onClick={handleOpenCreate}
            permission={COUNTRY_CREATE_PERMISSION}
          />
        }
      />
      <DataTable<CountryResponse>
        title="All Countries"
        columns={columns}
        queryFn={countryService.listCountries}
        queryKey={countryQueryKeys.lists()}
        search={{
          key: "search",
          placeholder: "Search by country name, code, or dial code",
        }}
      />

      <CountryFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        defaultValues={selectedCountry}
        onSuccess={handleFormSuccess}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete Country"
        description={`Are you sure you want to delete "${countryToDelete?.name}"? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={deleteCountryMutation.isPending}
      />
    </Page>
  );
}

export default CountryPage;
