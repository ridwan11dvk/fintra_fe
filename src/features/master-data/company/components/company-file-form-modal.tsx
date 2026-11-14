import {
  companyFileEditSchema,
  companyFileWithFileSchema,
  useUpdateCompanyFileMutation,
  useUploadCompanyFileMutation,
  type CompanyFileEditData,
  type CompanyFileRequest,
  type CompanyFileResponse,
  type CompanyFileWithFileData,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Modal } from "@railfinance/core/components/modal";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface CompanyFileFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  companyId?: number;
  defaultValues?: Partial<CompanyFileResponse>;
  onSuccess?: (fileData?: CompanyFileRequest) => void;
  isLocalMode?: boolean;
}

export function CompanyFileFormModal({
  open,
  onOpenChange,
  mode,
  companyId = 0,
  defaultValues,
  onSuccess,
  isLocalMode = true,
}: Readonly<CompanyFileFormModalProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use different schemas based on mode
  const schema =
    mode === "create" ? companyFileWithFileSchema : companyFileEditSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
    setValue,
  } = useForm<CompanyFileWithFileData | CompanyFileEditData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
      alias: defaultValues?.alias || "",
      documentDate: defaultValues?.documentDate || "",
      validFrom: defaultValues?.validFrom || "",
      validTo: defaultValues?.validTo || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const uploadMutation = useUploadCompanyFileMutation({
    onSuccess: () => {
      reset();
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const updateMutation = useUpdateCompanyFileMutation({
    onSuccess: () => {
      reset();
      setSelectedFile(null);
      onOpenChange(false);
      onSuccess?.();
    },
    onError: (error) => {
      setFormErrorsFromApi(error, setError);
    },
  });

  const mutation = mode === "create" ? uploadMutation : updateMutation;

  useEffect(() => {
    if (open) {
      reset({
        name: defaultValues?.name || "",
        alias: defaultValues?.alias || "",
        documentDate: defaultValues?.documentDate || "",
        validFrom: defaultValues?.validFrom || "",
        validTo: defaultValues?.validTo || "",
        isActive: defaultValues?.isActive ?? true,
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
    }
  }, [open, defaultValues, reset]);

  const isLoading = isLocalMode ? isSubmitting : mutation.isPending;

  const handleLocalCreate = (data: CompanyFileWithFileData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess?.({
        ...data,
        file: data.file,
        fileName: data.file.name,
        fileSize: data.file.size,
        alias: data.alias,
        name: data.name || data.file.name,
      } as CompanyFileRequest);
      setIsSubmitting(false);
    }, 300);
  };

  const handleLocalEdit = (data: CompanyFileEditData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess?.({
        ...data,
        ...(data.file && {
          file: data.file,
          fileName: data.file.name,
          fileSize: data.file.size,
        }),
        alias: data.alias,
        name: data.name,
      } as CompanyFileRequest);
      setIsSubmitting(false);
    }, 300);
  };

  const handleServerCreate = (data: CompanyFileWithFileData) => {
    uploadMutation.mutate({
      ...data,
      companyId,
    } as CompanyFileRequest);
  };

  const handleServerEdit = (data: CompanyFileEditData) => {
    if (defaultValues?.id) {
      updateMutation.mutate({
        companyId,
        fileId: defaultValues.id,
        data: { ...defaultValues, ...data } as CompanyFileRequest,
      });
    }
  };

  // Local mode only notifies the parent, server mode talks to the API. The
  // variant is resolved once here so `onSubmit` only has to branch on `mode`.
  const createHandler: (data: CompanyFileWithFileData) => void = isLocalMode
    ? handleLocalCreate
    : handleServerCreate;
  const editHandler: (data: CompanyFileEditData) => void = isLocalMode
    ? handleLocalEdit
    : handleServerEdit;

  const onSubmit = (data: CompanyFileWithFileData | CompanyFileEditData) => {
    if (mode === "create") {
      createHandler(data as CompanyFileWithFileData);
      return;
    }
    editHandler(data);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "create" ? "Add Company File" : "Edit Company File"}
      size="default"
      onConfirm={handleSubmit(onSubmit)}
      confirmText={mode === "create" ? "Upload" : "Update"}
      cancelText="Cancel"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* File Upload Field - Create and Edit */}
        <div className="space-y-2">
          <Label htmlFor="file" className="text-sm font-medium">
            Select File{" "}
            {mode === "create" && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id="file"
            type="file"
            disabled={isLoading}
            className={cn(
              "h-10",
              (errors as Record<string, { message?: string }>)?.file &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                // Set file value for Zod validation
                setValue("file" as never, file as never);
              }
            }}
          />
          {(errors as Record<string, { message?: string }>)?.file && (
            <p className="text-xs text-red-500">
              {(errors as Record<string, { message?: string }>).file?.message}
            </p>
          )}
          {selectedFile && (
            <p className="text-xs text-green-600">
              Selected: {selectedFile.name} (
              {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
            </p>
          )}
          {mode === "edit" && !selectedFile && defaultValues?.filePath && (
            <p className="text-xs text-gray-600">
              Current file: {defaultValues.name || "File uploaded"}
            </p>
          )}
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            File Name
          </Label>
          <Input
            id="name"
            placeholder="e.g., Company Charter"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.name && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Alias Field */}
        <div className="space-y-2">
          <Label htmlFor="alias" className="text-sm font-medium">
            Alias
          </Label>
          <Input
            id="alias"
            placeholder="e.g., Charter"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.alias && "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("alias")}
          />
          {errors.alias && (
            <p className="text-xs text-red-500">{errors.alias.message}</p>
          )}
        </div>

        {/* Document Date Field */}
        <div className="space-y-2">
          <Label htmlFor="documentDate" className="text-sm font-medium">
            Document Date
          </Label>
          <Input
            id="documentDate"
            type="date"
            disabled={isLoading}
            className={cn(
              "h-10",
              errors.documentDate &&
                "border-red-500 focus-visible:ring-red-500",
            )}
            {...register("documentDate")}
          />
          {errors.documentDate && (
            <p className="text-xs text-red-500">
              {errors.documentDate.message}
            </p>
          )}
        </div>

        {/* Validity Period Section */}
        {/* <div className="pt-2 border-t space-y-3">
          <h3 className="text-sm font-medium">Validity Period</h3>

          <div className="space-y-2">
            <Label htmlFor="validFrom" className="text-sm">
              Valid From
            </Label>
            <Input
              id="validFrom"
              type="date"
              disabled={isLoading}
              className="h-10"
              {...register("validFrom")}
            />
            {errors.validFrom && (
              <p className="text-xs text-red-500">{errors.validFrom.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="validTo" className="text-sm">
              Valid To
            </Label>
            <Input
              id="validTo"
              type="date"
              disabled={isLoading}
              className="h-10"
              {...register("validTo")}
            />
            {errors.validTo && (
              <p className="text-xs text-red-500">{errors.validTo.message}</p>
            )}
          </div>
        </div> */}

        {/* Active Checkbox */}
        <div className="flex items-center space-x-3 pt-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isLoading}
              />
            )}
          />
          <Label
            htmlFor="isActive"
            className="text-sm font-medium cursor-pointer"
          >
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}

export default CompanyFileFormModal;
