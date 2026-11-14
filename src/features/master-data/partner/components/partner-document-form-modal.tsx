import {
  partnerDocumentSchema,
  useListPartnerDocReferences,
  useUpdatePartnerDocumentMutation,
  useUploadPartnerDocumentMutation,
  type Partner,
  type PartnerDocReference,
  type PartnerDocument,
  type PartnerDocumentFormData,
  type PartnerDocumentRequest,
} from "@/features/master-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@railfinance/core/components/modal";
import { cn, setFormErrorsFromApi } from "@railfinance/core/lib";
import { Checkbox } from "@railfinance/core/ui/checkbox";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";

interface PartnerDocumentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  partner?: Partner;
  isLocalMode?: boolean;
  defaultValues?: Partial<PartnerDocument>;
  onSuccess?: (data?: PartnerDocument) => void;
}

export function PartnerDocumentFormModal({
  open,
  onOpenChange,
  mode,
  partner,
  isLocalMode = false,
  defaultValues,
  onSuccess,
}: Readonly<PartnerDocumentFormModalProps>) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const partnerId = partner?.id as number;

  // Fetch document references
  const { data: docRefData } = useListPartnerDocReferences({
    partnerCategoryId: partner?.partnerCategoryId ?? undefined,
    partnerTypeId: partner?.partnerTypeId ?? undefined,
    partnerSubTypeId: partner?.partnerSubTypeId ?? undefined,
    options: { enabled: !!partner?.id && open },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(partnerDocumentSchema),
    defaultValues: {
      partnerDocRefId: defaultValues?.partnerDocRefId,
      documentName: defaultValues?.documentName || "",
      documentType: defaultValues?.documentType || "",
      documentDate: defaultValues?.documentDate || "",
      documentNumber: defaultValues?.documentNumber || "",
      description: defaultValues?.description || "",
      isActive: defaultValues?.isActive ?? true,
    },
  });

  const uploadMutation = useUploadPartnerDocumentMutation({
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

  const updateMutation = useUpdatePartnerDocumentMutation({
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
  const handleDocRefChange = (value: number) => {
    setValue("partnerDocRefId", value);
    const selectedDocRef = docRefData?.data?.find(
      (docRef) => docRef.id === value,
    );
    if (selectedDocRef) {
      setValue("documentName", selectedDocRef.documentName);
    } else {
      setValue("documentName", "");
    }
  };
  const isSubmitting = isLocalMode
    ? false
    : uploadMutation.isPending || updateMutation.isPending;

  const submitForm = handleSubmit((data: PartnerDocumentFormData) => {
    if (mode === "create" && !selectedFile) {
      setError("documentName", {
        type: "manual",
        message: "File is required",
      });
      return;
    }

    const payload: PartnerDocumentRequest = {
      partnerDocRefId: data.partnerDocRefId ?? undefined,
      documentName: data.documentName,
      documentType: data.documentType || null,
      documentDate: data.documentDate || null,
      documentNumber: data.documentNumber || null,
      description: data.description || null,
      isActive: data.isActive,
      file: selectedFile || undefined,
    };

    if (isLocalMode) {
      // Local mode: just call onSuccess with the data
      onSuccess?.({
        ...payload,
        id: defaultValues?.id
          ? defaultValues.id
          : globalThis.crypto.randomUUID(),
        fileName: selectedFile?.name,
        fileSize: selectedFile?.size,
      } as unknown as PartnerDocument);
      reset();
      setSelectedFile(null);
      onOpenChange(false);
      return;
    }

    if (mode === "create") {
      // API mode: use mutations
      uploadMutation.mutate({ partnerId, data: payload });
    } else if (defaultValues?.id) {
      updateMutation.mutate({
        partnerId,
        documentId: defaultValues.id,
        data: payload,
      });
    }
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && defaultValues) {
        reset({
          partnerDocRefId: defaultValues.partnerDocRefId || undefined,
          documentName: defaultValues.documentName || "",
          documentType: defaultValues.documentType || "",
          documentDate: defaultValues.documentDate || "",
          documentNumber: defaultValues.documentNumber || "",
          description: defaultValues.description || "",
          isActive: defaultValues.isActive ?? true,
        });
      } else {
        reset({
          partnerDocRefId: undefined,
          documentName: "",
          documentType: "",
          documentDate: "",
          documentNumber: "",
          description: "",
          isActive: true,
        });
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedFile(null);
    }
  }, [open, reset, mode, defaultValues]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create" ? "Upload Partner Document" : "Edit Partner Document"
      }
      description={
        mode === "create"
          ? "Upload a new document for this partner"
          : "Edit document information"
      }
      onConfirm={submitForm}
      isLoading={isSubmitting}
    >
      <form className="space-y-4">
        {/* Document Reference - Only shown in create mode */}


        <div className="space-y-2">
          <Label htmlFor="docRefId">Document</Label>
          <Controller
            name="partnerDocRefId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value ? String(field.value) : ""}
                onValueChange={(value) => handleDocRefChange(Number(value))}
                disabled={isSubmitting || mode === "edit" || (docRefData?.data && docRefData?.data?.length === 0)}
              >
                <SelectTrigger id="docRefId" className="w-full">
                  <SelectValue placeholder="Select a document reference" />
                </SelectTrigger>
                <SelectContent>
                  {docRefData?.data?.map((docRef: PartnerDocReference) => (
                    <SelectItem key={docRef.id} value={docRef.id.toString()}>
                      {docRef.documentName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.partnerDocRefId && (
            <p className="text-sm text-red-500">{errors.partnerDocRefId.message}</p>
          )}
          {docRefData?.data && docRefData?.data?.length === 0 && (
            <p className="text-sm text-red-500">No document reference available. <Link to="/master-data/document-reference" className="text-underline">Add Document Reference</Link> first.</p>
          )}
        </div>

        {/* Document Name */}
        <div className="space-y-2">
          <Label htmlFor="documentName">Document Name</Label>
          <Input
            id="documentName"
            placeholder="Enter document name"
            {...register("documentName")}
            disabled={isSubmitting}
            className={cn(errors.documentName && "border-red-500")}
          />
          {errors.documentName && (
            <p className="text-sm text-red-500">{errors.documentName.message}</p>
          )}
        </div>
        {/* Document Number */}
        <div className="space-y-2">
          <Label htmlFor="documentNumber">Document Number</Label>
          <Input
            id="documentNumber"
            placeholder="e.g., DOC-2024-001"
            {...register("documentNumber")}
            disabled={isSubmitting}
          />
        </div>


        {/* Document Date */}
        <div className="space-y-2">
          <Label htmlFor="documentDate">Document Date</Label>
          <Input
            id="documentDate"
            type="date"
            {...register("documentDate")}
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter document description..."
            {...register("description")}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        {/* File Upload - Only shown in create mode */}
        {mode === "create" && (
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
              disabled={isSubmitting}
              required
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} (
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </p>
            )}

          </div>
        )}

        {/* Active Status */}
        <div className="flex items-center gap-2">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isActive"
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          <Label htmlFor="isActive" className="font-normal cursor-pointer">
            Active
          </Label>
        </div>
      </form>
    </Modal>
  );
}
