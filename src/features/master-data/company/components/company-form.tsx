import {
  CompanyAdditionalDocuments,
  CompanyDocumentElements,
  type CompanyDocumentElementsRef,
  CompanyFileFormModal,
  type CompanyFileRequest,
  type CompanyFormData,
  companyFormSchema,
  type CompanyResponse,
  COMPANY_URL,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardContent } from "@railfinance/core/ui/card";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { QuerySelect } from "@railfinance/core/components/input";
import { setFormErrorsFromApi } from "@railfinance/core/lib";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useGetModuleOptions } from "@railfinance/core/masterdata";
import { Fragment, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";

interface AdditionalFileItem extends CompanyFileRequest {
  id: string;
  alias: string; // Override to make required
}

interface CompanyFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CompanyResponse>;
  onSubmit: (
    data: CompanyFormData & { files?: File[]; fileAliases?: string },
  ) => Promise<void>;
  isLoading?: boolean;
}

export function CompanyForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
}: Readonly<CompanyFormProps>) {
  const navigate = useNavigate();
  const documentElementsRef = useRef<CompanyDocumentElementsRef>(null);
  const [additionalFiles, setAdditionalFiles] = useState<AdditionalFileItem[]>(
    [],
  );
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [selectedFileForEdit, setSelectedFileForEdit] =
    useState<AdditionalFileItem | null>(null);

  const { data: modulesData, isLoading: isLoadingModules } =
    useGetModuleOptions();
  const moduleOptions = (modulesData?.data || []).map((mod) => ({
    label: mod.label,
    value: mod.value,
    description: "",
  }));

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      code: defaultValues?.code || "",
      name: defaultValues?.name || "",
      alias: defaultValues?.alias || "",
      npwp: defaultValues?.npwp || "",
      pgMerchantId: defaultValues?.pgMerchantId || "",
      city: defaultValues?.city || "",
      address: defaultValues?.address || "",
      businessType: defaultValues?.businessType || "",
      moduleIds: defaultValues?.modules?.map((mod) => mod.id) || [],
      isActive: defaultValues?.isActive ?? true,
    } satisfies CompanyFormData,
  });

  const handleRemoveAdditionalFile = (id: string) => {
    setAdditionalFiles(additionalFiles.filter((item) => item.id !== id));
  };

  const handleOpenAddFileModal = () => {
    setSelectedFileForEdit(null);
    setFileModalOpen(true);
  };

  const handleOpenEditFileModal = (file: AdditionalFileItem) => {
    setSelectedFileForEdit(file);
    setFileModalOpen(true);
  };

  const handleFileModalSuccess = (fileData: CompanyFileRequest) => {
    if (selectedFileForEdit) {
      // Edit mode - update existing file and/or metadata
      setAdditionalFiles(
        additionalFiles.map((item) =>
          item.id === selectedFileForEdit.id
            ? {
                ...item,
                ...(fileData.file && { file: fileData.file }),
                ...(fileData.fileName && { fileName: fileData.fileName }),
                ...(fileData.fileSize && { fileSize: fileData.fileSize }),
                alias: fileData.alias || item.alias,
                name: fileData.name || item.name,
              }
            : item,
        ),
      );
    } else if (fileData.file) {
      // Create mode - add new file
      const newFile: AdditionalFileItem = {
        ...fileData,
        id: `${Date.now()}-${globalThis.crypto.randomUUID()}`,
        file: fileData.file,
        fileName: fileData.fileName || fileData.file.name,
        fileSize: fileData.fileSize || fileData.file.size,
        alias: fileData.alias || fileData.file.name.split(".")[0].toUpperCase(),
        name: fileData.name || fileData.file.name,
      };
      setAdditionalFiles([...additionalFiles, newFile]);
    }
    setFileModalOpen(false);
    setSelectedFileForEdit(null);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onHandleSubmit = async (data: CompanyFormData) => {
    try {
      // Collect all files
      const allFiles: File[] = [];
      const fileAliases: string[] = [];

      // Get files from document elements component
      const documentFiles = documentElementsRef.current?.getFiles();
      if (documentFiles) {
        if (documentFiles.logo) {
          allFiles.push(documentFiles.logo);
          fileAliases.push("LOGO");
        }
        if (documentFiles.header) {
          allFiles.push(documentFiles.header);
          fileAliases.push("HEADER_DOC");
        }
        if (documentFiles.footer) {
          allFiles.push(documentFiles.footer);
          fileAliases.push("FOOTER_DOC");
        }
      }

      // Get files from additional documents
      additionalFiles.forEach((item) => {
        if (item.file && item.alias) {
          allFiles.push(item.file);
          fileAliases.push(item.alias);
        }
      });

      const submitData = {
        ...data,
        ...(additionalFiles.length > 0 && {
          companyFiles: additionalFiles.map((item) => ({
            name: item.name,
            alias: item.alias,
            documentDate: item.documentDate,
            validFrom: item.validFrom,
            validTo: item.validTo,
            isActive: item.isActive,
          })),
        }),
        ...(allFiles.length > 0 && { files: allFiles }),
        ...(fileAliases.length > 0 && {
          fileAliases: fileAliases.map((alias, i) => `${i}=${alias}`).join(","),
        }),
      };

      await onSubmit(submitData);
    } catch (error) {
      setFormErrorsFromApi(error, setError);
    }
  };

  const handleFormSubmit = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      handleSubmit(onHandleSubmit)(e);
    },
    [handleSubmit, onHandleSubmit],
  );

  return (
    <Fragment>
      <form onSubmit={handleFormSubmit} className="space-y-6 w-full">
        <Card>
          <CardContent className="space-y-6">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Company Code *</Label>
              <Input
                id="code"
                placeholder="e.g., COMP001"
                {...register("code")}
                disabled={isLoading}
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && (
                <p className="text-xs text-red-500">{errors.code.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                placeholder="e.g., PT Company Indonesia"
                {...register("name")}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Alias */}
            <div className="space-y-2">
              <Label htmlFor="alias">Alias</Label>
              <Input
                id="alias"
                placeholder="e.g., Short name or abbreviation"
                {...register("alias")}
                disabled={isLoading}
                className={errors.alias ? "border-red-500" : ""}
              />
              {errors.alias && (
                <p className="text-xs text-red-500">{errors.alias.message}</p>
              )}
            </div>

            {/* NPWP */}
            <div className="space-y-2">
              <Label htmlFor="npwp">NPWP</Label>
              <Input
                id="npwp"
                placeholder="e.g., 010000164093000"
                {...register("npwp")}
                disabled={isLoading}
                className={errors.npwp ? "border-red-500" : ""}
              />
              {errors.npwp && (
                <p className="text-xs text-red-500">{errors.npwp.message}</p>
              )}
            </div>

            {/* PG Merchant ID */}
            <div className="space-y-2">
              <Label htmlFor="pgMerchantId">PG Merchant ID</Label>
              <Input
                id="pgMerchantId"
                placeholder="e.g., KAI-PG-001"
                {...register("pgMerchantId")}
                disabled={isLoading}
                className={errors.pgMerchantId ? "border-red-500" : ""}
              />
              {errors.pgMerchantId && (
                <p className="text-xs text-red-500">
                  {errors.pgMerchantId.message}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g., Bandung"
                {...register("city")}
                disabled={isLoading}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>

            {/* Business Type */}
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                placeholder="e.g., Railway Passenger & Freight Transport"
                {...register("businessType")}
                disabled={isLoading}
                className={errors.businessType ? "border-red-500" : ""}
              />
              {errors.businessType && (
                <p className="text-xs text-red-500">
                  {errors.businessType.message}
                </p>
              )}
            </div>

            {/* Modules */}
            <div className="space-y-2">
              <Label htmlFor="moduleIds">Modules</Label>
              <Controller
                name="moduleIds"
                control={control}
                render={({ field }) => (
                  <QuerySelect
                    multiple
                    id="moduleIds"
                    value={field.value || []}
                    onValueChange={(value: unknown) => {
                      const parsedIds = Array.isArray(value)
                        ? value.map(Number)
                        : [];
                      field.onChange(parsedIds);
                    }}
                    options={moduleOptions}
                    placeholder="Select modules..."
                    disabled={isLoading || isLoadingModules}
                    aria-invalid={!!errors.moduleIds}
                  />
                )}
              />
              {errors.moduleIds && (
                <p className="text-xs text-red-500">
                  {errors.moduleIds.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Enter company address"
                {...register("address")}
                disabled={isLoading}
                rows={4}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <>
                    <Checkbox
                      id="isActive"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor="isActive"
                      className="font-normal cursor-pointer"
                    >
                      Active
                    </Label>
                  </>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* File Upload Section - Only for Create Mode */}
        {mode === "create" && (
          <CompanyDocumentElements
            ref={documentElementsRef}
            isLoading={isLoading}
          />
        )}

        {mode === "create" && (
          <CompanyAdditionalDocuments
            additionalFiles={additionalFiles}
            fileModalOpen={fileModalOpen}
            selectedFileForEdit={selectedFileForEdit}
            isLoading={isLoading}
            onOpenAddFileModal={handleOpenAddFileModal}
            onOpenEditFileModal={handleOpenEditFileModal}
            onRemoveAdditionalFile={handleRemoveAdditionalFile}
            onFileModalOpenChange={setFileModalOpen}
            onFileModalSuccess={handleFileModalSuccess}
          />
        )}
        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <ActionButton
            variant="back"
            showLabel
            disabled={isLoading}
            onClick={() => navigate(COMPANY_URL)}
          />
          <ActionButton
            variant="save"
            showLabel
            disabled={isLoading}
            label={isLoading ? "Saving..." : "Save Company"}
          />
        </div>
      </form>
      <CompanyFileFormModal
        open={fileModalOpen}
        onOpenChange={setFileModalOpen}
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
            handleFileModalSuccess(fileData);
          }
        }}
      />
    </Fragment>
  );
}
