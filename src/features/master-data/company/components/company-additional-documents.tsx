import type { CompanyFileRequest } from "@/features/master-data";
import { CompanyFileFormModal } from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import type { CellContext, ColumnDef } from "@tanstack/react-table";

interface AdditionalFileItem extends CompanyFileRequest {
  id: string;
  alias: string;
}

interface CompanyAdditionalDocumentsProps {
  additionalFiles: AdditionalFileItem[];
  fileModalOpen: boolean;
  selectedFileForEdit: AdditionalFileItem | null;
  isLoading?: boolean;
  onOpenAddFileModal: () => void;
  onOpenEditFileModal: (file: AdditionalFileItem) => void;
  onRemoveAdditionalFile: (id: string) => void;
  onFileModalOpenChange: (open: boolean) => void;
  onFileModalSuccess: (fileData: {
    file?: File;
    alias?: string;
    name?: string;
    fileName?: string;
    fileSize?: number;
  }) => void;
}

function createAdditionalFileColumns(
  additionalFiles: AdditionalFileItem[],
  isLoading: boolean,
  onOpenEditFileModal: (file: AdditionalFileItem) => void,
  onRemoveAdditionalFile: (id: string) => void,
): ColumnDef<AdditionalFileItem>[] {
  return [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "alias",
      header: "Alias",
      accessorKey: "alias",
    },
    {
      id: "fileName",
      header: "Actual File Name",
      accessorKey: "fileName",
    },
    {
      id: "fileSize",
      header: "File Size",
      cell: (info: CellContext<AdditionalFileItem, unknown>) => {
        const size = additionalFiles[info.row.index]?.fileSize || 0;
        const sizeInMB = (size / (1024 * 1024)).toFixed(2);
        return `${sizeInMB} MB`;
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: (info: CellContext<AdditionalFileItem, unknown>) => (
        <div className="flex items-center gap-2">
          <ActionButton
            variant="edit"
            onClick={() => onOpenEditFileModal(additionalFiles[info.row.index])}
            disabled={isLoading}
          />
          <ActionButton
            variant="delete"
            onClick={() =>
              onRemoveAdditionalFile(additionalFiles[info.row.index].id)
            }
            disabled={isLoading}
          />
        </div>
      ),
    },
  ];
}

export function CompanyAdditionalDocuments({
  additionalFiles,
  fileModalOpen,
  selectedFileForEdit,
  isLoading = false,
  onOpenAddFileModal,
  onOpenEditFileModal,
  onRemoveAdditionalFile,
  onFileModalOpenChange,
  onFileModalSuccess,
}: Readonly<CompanyAdditionalDocumentsProps>) {
  const columns = createAdditionalFileColumns(
    additionalFiles,
    isLoading,
    onOpenEditFileModal,
    onRemoveAdditionalFile,
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Company Additional Documents</CardTitle>
          <CardDescription>
            Attach company additional documents such as licenses,
            certifications, or other relevant files. You can add multiple files
            and specify an alias for each to identify their purpose.
          </CardDescription>
          <CardAction>
            <ActionButton
              variant="add"
              type="button"
              showLabel
              onClick={onOpenAddFileModal}
              disabled={isLoading}
            />
          </CardAction>
        </CardHeader>

        <CardContent>
          <OfflineDataTable<AdditionalFileItem>
            title="Attached Files"
            columns={columns}
            data={additionalFiles}
            enablePagination={false}
            toolbar={{ enableColumnToggle: false }}
          />
        </CardContent>
      </Card>

      <CompanyFileFormModal
        open={fileModalOpen}
        onOpenChange={onFileModalOpenChange}
        mode={selectedFileForEdit ? "edit" : "create"}
        companyId={0}
        isLocalMode={true}
        defaultValues={
          selectedFileForEdit
            ? {
                id: Number.parseInt(selectedFileForEdit.id, 10),
                name: selectedFileForEdit.name,
                alias: selectedFileForEdit.alias,
                isActive: true,
                companyId: 0,
                filePath: "",
                uploadedDate: new Date().toISOString(),
                createdOn: new Date().toISOString(),
                modifiedOn: new Date().toISOString(),
              }
            : undefined
        }
        onSuccess={(fileData) => {
          if (fileData) {
            onFileModalSuccess(fileData);
          }
        }}
      />
    </>
  );
}
