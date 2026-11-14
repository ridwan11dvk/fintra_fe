import type { CompanyFileResponse } from "@/features/master-data";
import { useGetCompanyFilePresignedUrl } from "@/features/master-data";
import { Modal } from "@railfinance/core/components/modal";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { AlertCircle } from "lucide-react";

interface CompanyFilePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: CompanyFileResponse | null;
  companyId: number;
}

export function CompanyFilePreviewModal({
  open,
  onOpenChange,
  file,
  companyId,
}: Readonly<CompanyFilePreviewModalProps>) {
  const {
    data: urlResponse,
    isLoading,
    isError,
  } = useGetCompanyFilePresignedUrl(companyId, file?.id || 0, {
    enabled: open && !!file?.id,
  });

  const fileUrl = urlResponse?.data;
  const isPdf = file?.filePath?.toLowerCase().endsWith(".pdf");
  const isImage = file?.filePath
    ?.toLowerCase()
    .match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={file?.name}
      cancelText="Close"
    >
      <div className="w-full">
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <ProgressLoader />
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-900">
                Failed to load file
              </p>
              <p className="text-xs text-red-700">
                Unable to generate preview link for this file.
              </p>
            </div>
          </div>
        )}

        {!isLoading && !isError && fileUrl && (
          <div className="space-y-4">
            {/* File Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 font-medium">File Name</p>
                <p className="mt-1">{file?.name}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Alias</p>
                <p className="mt-1">{file?.alias}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Uploaded</p>
                <p className="mt-1">
                  {new Date(file?.uploadedDate || "").toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Status</p>
                <p className="mt-1">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                      file?.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {file?.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            </div>

            {/* Preview */}
            <div className="border rounded-lg bg-gray-50 p-4">
              {isPdf && (
                <embed
                  src={fileUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  className="rounded"
                />
              )}

              {isImage && (
                <div className="flex justify-center">
                  <img
                    src={fileUrl}
                    alt={file?.name}
                    className="max-w-full max-h-96 rounded"
                  />
                </div>
              )}

              {!isPdf && !isImage && (
                <div className="flex items-center justify-center py-12 text-center">
                  <div>
                    <p className="text-gray-600 mb-2">
                      Preview not available for this file type
                    </p>
                    <a
                      href={fileUrl}
                      download={file?.name}
                      className="inline-block px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
