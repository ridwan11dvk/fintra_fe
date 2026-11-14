import type { CompanyFileResponse } from "@/features/master-data";
import {
  COMPANY_DETAIL_PAGE_TITLE,
  COMPANY_LIST_PAGE_TITLE,
  COMPANY_READ_PERMISSION,
  COMPANY_UPDATE_PERMISSION,
  COMPANY_URL,
  CompanyFileFormModal,
  CompanyFilePreviewModal,
  companyDetailUrl,
  companyEditUrl,
  companyQueryKeys,
  useDeleteCompanyFileMutation,
  useGetCompanyById,
} from "@/features/master-data";
import type { ModuleResponse } from "@railfinance/core/masterdata";
import { ActionButton } from "@railfinance/core/components/actions";
import { Badge } from "@railfinance/core/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ColumnHeader, OfflineDataTable } from "@railfinance/core/components/data-table";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { formatDate } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

interface CompanyFileColumnsConfig {
  onEdit: (file: CompanyFileResponse) => void;
  onPreview: (file: CompanyFileResponse) => void;
  onDelete: (file: CompanyFileResponse) => void;
  isDeleting: boolean;
}

function createCompanyFileColumns({
  onEdit,
  onPreview,
  onDelete,
  isDeleting,
}: Readonly<CompanyFileColumnsConfig>): ColumnDef<CompanyFileResponse>[] {
  return [
    {
      accessorKey: "name",
      meta: { title: "Name" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: (info) => (
        <div className="font-medium">{info.row.original.name}</div>
      ),
    },
    {
      accessorKey: "alias",
      meta: { title: "Alias" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: (info) => <div>{info.row.original.alias}</div>,
    },
    {
      accessorKey: "uploadedDate",
      meta: { title: "Uploaded" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: (info) => {
        const uploaded = info.row.original.uploadedDate;
        return uploaded ? new Date(uploaded).toLocaleDateString() : "\u2014";
      },
    },
    {
      accessorKey: "documentDate",
      meta: { title: "Document Date" },
      header: ({ column }) => <ColumnHeader column={column} />,
      cell: (info) => {
        const date = info.row.original.documentDate;
        return date ? formatDate(date) : "\u2014";
      },
    },
    {
      id: "status",
      meta: { title: "Status" },
      header: () => <div className="text-center font-medium">Status</div>,
      cell: (info) => {
        const file = info.row.original;
        return (
          <div className="flex justify-center">
            <Badge variant={file.isActive ? "default" : "secondary"}>
              {file.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        );
      },
      enableSorting: false,
    },
    {
      id: "actions",
      meta: { title: "Actions" },
      header: () => <div className="text-center font-medium">Actions</div>,
      cell: (info) => (
        <div className="flex justify-center gap-1">
          <ActionButton
            variant="edit"
            onClick={() => onEdit(info.row.original)}
            disabled={isDeleting}
            permission={COMPANY_UPDATE_PERMISSION}
          />
          <ActionButton
            variant="show"
            onClick={() => onPreview(info.row.original)}
            disabled={isDeleting}
            permission={COMPANY_READ_PERMISSION}
          />
          <ActionButton
            variant="delete"
            onClick={() => onDelete(info.row.original)}
            disabled={isDeleting}
            permission={COMPANY_UPDATE_PERMISSION}
          />
        </div>
      ),
      enableSorting: false,
    },
  ];
}

export function CompanyShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = Number(id);

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<
    CompanyFileResponse | undefined
  >();
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [fileToPreview, setFileToPreview] =
    useState<CompanyFileResponse | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<
    CompanyFileResponse | undefined
  >();

  const { data: response, isLoading } = useGetCompanyById(companyId);
  const company = response?.data;

  const deleteFileMutation = useDeleteCompanyFileMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.detail(companyId),
      });
      setIsDeleteConfirmOpen(false);
      setFileToDelete(undefined);
    },
  });

  const handleAddFile = () => {
    setFileToEdit(undefined);
    setFormModalOpen(true);
  };

  const handleEditFile = (file: CompanyFileResponse) => {
    setFileToEdit(file);
    setFormModalOpen(true);
  };

  const handleDeleteFile = (file: CompanyFileResponse) => {
    setFileToDelete(file);
    setIsDeleteConfirmOpen(true);
  };

  const handlePreviewFile = (file: CompanyFileResponse) => {
    setFileToPreview(file);
    setPreviewModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      deleteFileMutation.mutate({
        companyId,
        fileId: fileToDelete.id,
      });
    }
  };

  // File table columns
  const fileColumns = createCompanyFileColumns({
    onEdit: handleEditFile,
    onPreview: handlePreviewFile,
    onDelete: handleDeleteFile,
    isDeleting: deleteFileMutation.isPending,
  });

  if (isLoading) {
    return (
      <Page
        type="base"
        title={COMPANY_DETAIL_PAGE_TITLE}
        permission={COMPANY_READ_PERMISSION}
        breadcrumbs={[
          { title: "Master Data", url: "#" },
          { title: COMPANY_LIST_PAGE_TITLE, url: COMPANY_URL },
          { title: "Details", url: "#" },
        ]}
      >
        <div className="flex justify-center items-center h-96">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  if (!company) {
    return (
      <Page
        type="base"
        title={COMPANY_DETAIL_PAGE_TITLE}
        permission={COMPANY_READ_PERMISSION}
        breadcrumbs={[
          { title: "Master Data", url: "#" },
          { title: COMPANY_LIST_PAGE_TITLE, url: COMPANY_URL },
          { title: "Details", url: "#" },
        ]}
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Company not found</h3>
            <p className="text-sm text-red-700">
              The company you are looking for does not exist.
            </p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page
      type="base"
      title={COMPANY_DETAIL_PAGE_TITLE}
      permission={COMPANY_READ_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: COMPANY_LIST_PAGE_TITLE, url: COMPANY_URL },
        { title: company.name, url: companyDetailUrl(companyId) },
      ]}
    >
      <PageHeader
        title="Company Details"
        description={`View and manage company "${company.name}"`}
        actions={
          <ActionButton
            variant="edit"
            buttonVariant="success"
            showLabel
            onClick={() => navigate(companyEditUrl(companyId))}
            permission={COMPANY_UPDATE_PERMISSION}
          />
        }
      />

      {/* Company Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Code</p>
              <p className="mt-1 text-lg font-mono">{company.code}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="mt-1 text-lg font-semibold">{company.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Alias</p>
              <p className="mt-1">{company.alias || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">NPWP</p>
              <p className="mt-1 font-mono">{company.npwp || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                PG Merchant ID
              </p>
              <p className="mt-1 font-mono">{company.pgMerchantId || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">City</p>
              <p className="mt-1">{company.city || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Business Type</p>
              <p className="mt-1">{company.businessType || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Address</p>
              <p className="mt-1">{company.address || "-"}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-gray-600">Modules</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {company.modules && company.modules.length > 0 ? (
                  company.modules.map((mod: ModuleResponse) => (
                    <Badge key={mod.id} variant="outline">
                      {mod.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Status</p>
              <div className="mt-1">
                <Badge variant={company.isActive ? "default" : "secondary"}>
                  {company.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Documents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Company Document Elements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Logo */}
            {company.logoFile && (
              <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
                <img src={company.logoFile} alt="Company Logo" />
                <div className="text-center">
                  <p className="text-sm font-medium">Logo</p>
                  <p className="text-xs text-gray-500">Company Logo</p>
                </div>
              </div>
            )}

            {/* Header Document */}
            {company.headerDocFile && (
              <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
                <img src={company.headerDocFile} alt="Header Document" />
                <div className="text-center">
                  <p className="text-sm font-medium">Header Doc</p>
                  <p className="text-xs text-gray-500">Header Document</p>
                </div>
              </div>
            )}

            {/* Footer Document */}
            {company.footerDocFile && (
              <div className="border rounded-lg p-4 flex flex-col items-center gap-3">
                <img src={company.footerDocFile} alt="Footer Document" />

                <div className="text-center">
                  <p className="text-sm font-medium">Footer Doc</p>
                  <p className="text-xs text-gray-500">Footer Document</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Files */}
      {company.files && company.files.length > 0 && (
        <OfflineDataTable<CompanyFileResponse>
          title="Additional Documents"
          actions={
            <ActionButton
              variant="add"
              showLabel
              onClick={handleAddFile}
              permission={COMPANY_UPDATE_PERMISSION}
            />
          }
          columns={fileColumns}
          data={company.files}
          enablePagination={true}
        />
      )}

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete File"
        description={`Are you sure you want to delete "${fileToDelete?.name}"?`}
        isLoading={deleteFileMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setFileToDelete(undefined);
        }}
      />

      <CompanyFileFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        mode={fileToEdit ? "edit" : "create"}
        companyId={companyId}
        defaultValues={fileToEdit}
        onSuccess={() => {
          queryClient.invalidateQueries({
            queryKey: companyQueryKeys.detail(companyId),
          });
          setFormModalOpen(false);
          setFileToEdit(undefined);
        }}
        isLocalMode={false}
      />

      <CompanyFilePreviewModal
        open={previewModalOpen}
        onOpenChange={setPreviewModalOpen}
        file={fileToPreview}
        companyId={companyId}
      />
    </Page>
  );
}
