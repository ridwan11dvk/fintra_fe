import {
  IDENTITY_NUMBER_TYPES,
  PartnerDocumentFormModal,
  PartnerTaxFormModal,
  partnerFormSchema,
  useGetPartnerClassificationOptions,
  type Partner,
  type PartnerDocument,
  type PartnerFormData,
  type PartnerRequest,
  type PartnerTaxRate,
  PARTNER_URL,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { OfflineDataTable } from "@railfinance/core/components/data-table";
import { formatDate, setFormErrorsFromApi } from "@railfinance/core/lib";
import {
  useGetActivePartnerCategories,
  useGetLookupValueOptions,
} from "@railfinance/core/masterdata";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@railfinance/core/ui/card";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { useNavigate } from "react-router";
import { RadioGroup, RadioGroupItem } from "@railfinance/core/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@railfinance/core/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@railfinance/core/ui/tabs";
import { Textarea } from "@railfinance/core/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import type { ErrorItem, OptionItem } from "@railfinance/core/types";

import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

function getDocumentColumns(
  onEdit: (doc: PartnerDocument) => void,
  onDelete: (id: number) => void,
  loading: boolean,
): ColumnDef<PartnerDocument>[] {
  return [
    { accessorKey: "documentName", header: "Document Name" },
    { accessorKey: "documentType", header: "Type" },
    { accessorKey: "documentNumber", header: "Number" },
    {
      accessorKey: "documentDate",
      header: "Date",
      cell: (info) =>
        info.getValue() ? formatDate(String(info.getValue())) : "-",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-xs text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-xs text-red-600 font-medium">Inactive</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <ActionButton
            variant="edit"
            onClick={() => onEdit(info.row.original)}
            disabled={loading}
          />
          <ActionButton
            variant="delete"
            onClick={() => onDelete(info.row.original.id ?? 0)}
            disabled={loading}
          />
        </div>
      ),
    },
  ];
}

function getTaxColumns(
  onEdit: (tax: PartnerTaxRate) => void,
  onDelete: (id: number) => void,
  loading: boolean,
): ColumnDef<PartnerTaxRate>[] {
  return [
    {
      accessorKey: "taxRate",
      header: "Tax Rate",
      cell: (info) => {
        const taxRate = info.row.original.taxRate;
        return taxRate ? `${taxRate.name} (${taxRate.ratePercent}%)` : "-";
      },
    },
    {
      accessorKey: "active",
      header: "Status",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-xs text-green-600 font-medium">Active</span>
        ) : (
          <span className="text-xs text-red-600 font-medium">Inactive</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (info) => (
        <div className="flex gap-2">
          <ActionButton
            variant="edit"
            onClick={() => onEdit(info.row.original)}
            disabled={loading}
          />
          <ActionButton
            variant="delete"
            onClick={() => onDelete(info.row.original.id ?? 0)}
            disabled={loading}
          />
        </div>
      ),
    },
  ];
}

const NUMERIC_ALLOWED_KEYS = new Set([
  "Backspace",
  "Tab",
  "Escape",
  "Enter",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "Delete",
]);

function handleNumericKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (NUMERIC_ALLOWED_KEYS.has(e.key)) return;
  if ((e.ctrlKey || e.metaKey) && ["a", "c", "v", "x"].includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

function handleNumericPaste(e: React.ClipboardEvent<HTMLInputElement>) {
  e.preventDefault();
  const text = e.clipboardData.getData("text").replaceAll(/\D/g, "");
  if (text) document.execCommand("insertText", false, text); //NOSONAR
}

interface PartnerFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Partner>;
  onSubmit: (data: PartnerRequest) => Promise<void>;
  isLoading?: boolean;
  apiErrors?: ErrorItem[];
}

type PartnerDocumentRow = PartnerDocument & {
  file?: File;
  fileName?: string;
};

export function PartnerForm({
  mode,
  defaultValues,
  onSubmit,
  isLoading = false,
  apiErrors,
}: Readonly<PartnerFormProps>) {
  const navigate = useNavigate();
  // State for local items (documents, taxes)
  const [documents, setDocuments] = useState<PartnerDocumentRow[]>([]);
  const [taxes, setTaxes] = useState<PartnerTaxRate[]>([]);

  // Modal states
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [selectedDocumentForEdit, setSelectedDocumentForEdit] =
    useState<PartnerDocumentRow | null>(null);

  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [selectedTaxForEdit, setSelectedTaxForEdit] =
    useState<PartnerTaxRate | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    getValues,
  } = useForm({
    resolver: zodResolver(partnerFormSchema),
    defaultValues: {
      partnerCode: defaultValues?.partnerCode || "",
      name: defaultValues?.name || "",
      partnerClassificationId: defaultValues?.partnerClassificationId || null,
      partnerCategoryId: (defaultValues?.partnerCategoryId as number) || null,
      partnerTypeId: (defaultValues?.partnerTypeId as number) || null,
      partnerSubTypeId: defaultValues?.partnerSubTypeId || null,
      identityNumber: defaultValues?.identityNumber || "",
      identityNumberType: (defaultValues?.identityNumberType ||
        "NIK") as PartnerFormData["identityNumberType"],
      region: defaultValues?.region || "",
      taxpayerName: defaultValues?.taxpayerName || "",
      vatStatus: defaultValues?.vatStatus || "",
      taxAddress: defaultValues?.taxAddress || "",
      taxableEmployerNo: defaultValues?.taxableEmployerNo || "",
      npwpNumber: defaultValues?.npwpNumber || "",
      npwpDocument: defaultValues?.npwpDocument || "",
      nitkuNumber: defaultValues?.nitkuNumber || "",
      taxDocument: defaultValues?.taxDocument || "",
      taxClassification: defaultValues?.taxClassification || "",
      vatRate: defaultValues?.vatRate || "",
      wapuStatus: defaultValues?.wapuStatus || "",
      isTaxExempt: defaultValues?.isTaxExempt ?? false,
      taxExemptDocument: defaultValues?.taxExemptDocument || "",
      companyEmail: defaultValues?.companyEmail || "",
      companyPhoneNumber: defaultValues?.companyPhoneNumber || "",
      status: defaultValues?.status || "ACTIVE",
      blacklistReason: defaultValues?.blacklistReason || "",
      blacklistDocument: defaultValues?.blacklistDocument || null,
      blacklistDocumentObject: null,
      isValidatedByDjp: defaultValues?.isValidatedByDjp ?? false,
      integratedToErp: defaultValues?.integratedToErp ?? false,
    } satisfies PartnerFormData,
  });

  // Handlers for documents
  const handleAddDocument = (doc: PartnerDocumentRow) => {
    setDocuments([...documents, doc]);
  };

  const handleEditDocument = (doc: PartnerDocumentRow) => {
    setDocuments(documents.map((d) => (d.id === doc.id ? doc : d)));
  };

  const handleRemoveDocument = (id: number) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  // Handlers for taxes
  const handleAddTax = (tax: PartnerTaxRate) => {
    setTaxes([...taxes, tax]);
  };

  const handleEditTax = (tax: PartnerTaxRate) => {
    setTaxes(taxes.map((t) => (t.id === tax.id ? tax : t)));
  };

  const handleRemoveTax = (id: number) => {
    setTaxes(taxes.filter((t) => t.id !== id));
  };

  // Modal open/close handlers
  const handleOpenAddDocument = () => {
    setSelectedDocumentForEdit(null);
    setDocumentModalOpen(true);
  };

  const handleOpenEditDocument = (doc: PartnerDocument) => {
    setSelectedDocumentForEdit(doc);
    setDocumentModalOpen(true);
  };

  const handleDocumentModalSuccess = (data?: PartnerDocument) => {
    if (!data) return;
    const documentData = data;
    if (selectedDocumentForEdit) {
      handleEditDocument(documentData);
    } else {
      handleAddDocument(documentData);
    }
    setDocumentModalOpen(false);
    setSelectedDocumentForEdit(null);
  };

  const handleOpenAddTax = () => {
    setSelectedTaxForEdit(null);
    setTaxModalOpen(true);
  };

  const handleOpenEditTax = (tax: PartnerTaxRate) => {
    setSelectedTaxForEdit(tax);
    setTaxModalOpen(true);
  };

  const handleTaxModalSuccess = (data?: PartnerTaxRate) => {
    if (!data) return;
    const taxData = data;
    if (selectedTaxForEdit) {
      handleEditTax(taxData);
    } else {
      handleAddTax(taxData);
    }
    setTaxModalOpen(false);
    setSelectedTaxForEdit(null);
  };

  const status = useWatch({
    control,
    name: "status",
  });

  const isBlacklisted = status === "BLACKLISTED";

  // Fetch option data
  const { data: classificationData } = useGetPartnerClassificationOptions();
  const { data: categoriesData } = useGetActivePartnerCategories();

  const { data: regionsData } = useGetLookupValueOptions("PARTNER_REGION");

  useEffect(() => {
    setFormErrorsFromApi(apiErrors, setError);
  }, [apiErrors, setError]);

  // Wrapper to collect local items data and submit
  const handleFormSubmit = async (data: PartnerFormData) => {
    // Collect all files from documents
    const allFiles: File[] = [];
    const fileMapping: string[] = [];

    documents.forEach((doc, index) => {
      if (doc.file) {
        allFiles.push(doc.file);
        const alias = `DOC_${index}`;
        fileMapping.push(`${index}=${alias}`);
      }
    });

    // Create the final payload
    const submitPayload = {
      ...data,
      ...(documents.length > 0 && {
        partnerDocuments: documents.map((doc) => ({
          documentName: doc.documentName,
          documentType: doc.documentType,
          documentDate: doc.documentDate,
          documentNumber: doc.documentNumber,
          description: doc.description,
          isActive: doc.isActive,
        })),
      }),
      ...(allFiles.length > 0 && { files: allFiles }),
      ...(fileMapping.length > 0 && {
        fileIndexMapping: fileMapping.join(","),
      }),
    };

    await onSubmit(submitPayload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Classification */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnerClassificationId">
                Classification<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="partnerClassificationId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => {
                      field.onChange(Number(val));
                    }}
                    disabled={isLoading}
                    aria-invalid={!!errors.partnerClassificationId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select classification" />
                    </SelectTrigger>
                    <SelectContent>
                      {classificationData?.data?.map((cat: OptionItem) => (
                        <SelectItem
                          key={cat.value}
                          value={cat.value.toString()}
                        >
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.partnerClassificationId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.partnerClassificationId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="partnerCategoryId">
                Category<span className="text-red-500">*</span>
              </Label>
              <Controller
                name="partnerCategoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => {
                      field.onChange(Number(val));
                    }}
                    disabled={isLoading}
                    aria-invalid={!!errors.partnerCategoryId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesData?.data?.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.partnerCategoryId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.partnerCategoryId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={isLoading}
                    aria-invalid={!!errors.region}
                  >
                    <SelectTrigger id="region" className="w-full">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regionsData?.data?.map((region) => (
                        <SelectItem key={region.value} value={region.label}>
                          {region.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.region && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.region.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="partnerCode">
                Partner Code<span className="text-red-500">*</span>
              </Label>
              <Input
                id="partnerCode"
                placeholder="Partner code"
                {...register("partnerCode")}
                disabled={isLoading}
                aria-invalid={!!errors.partnerCode}
              />
              {errors.partnerCode && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.partnerCode.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">
                Partner Name<span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Partner name"
                {...register("name")}
                disabled={isLoading}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="companyPhoneNumber">Phone Number</Label>
              <Input
                id="companyPhoneNumber"
                placeholder="Phone number"
                {...register("companyPhoneNumber")}
                disabled={isLoading}
                aria-invalid={!!errors.companyPhoneNumber}
              />
              {errors.companyPhoneNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyPhoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                placeholder="Email address"
                {...register("companyEmail")}
                disabled={isLoading}
                aria-invalid={!!errors.companyEmail}
              />
              {errors.companyEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.companyEmail.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Tax & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="identityNumberType">Identity Number Type</Label>
              <Controller
                name="identityNumberType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || "NIK"}
                    onValueChange={field.onChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select identity number type" />
                    </SelectTrigger>
                    <SelectContent>
                      {IDENTITY_NUMBER_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.identityNumberType && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.identityNumberType.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="identityNumber">Identity Number</Label>
              <Input
                id="identityNumber"
                type="text"
                maxLength={16}
                inputMode="numeric"
                placeholder="NIK / Passport Number"
                {...register("identityNumber")}
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
                disabled={isLoading}
                aria-invalid={!!errors.identityNumber}
              />
              {errors.identityNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.identityNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Tax profile (NPWP / NITKU and the rest of the tax identity) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="npwpNumber">
                NPWP<span className="text-red-500">*</span>
              </Label>
              <Input
                id="npwpNumber"
                {...register("npwpNumber")}
                disabled={isLoading}
                maxLength={16}
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
                aria-invalid={!!errors.npwpNumber}
              />
              {errors.npwpNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.npwpNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nitkuNumber">NITKU</Label>
              <Input
                id="nitkuNumber"
                {...register("nitkuNumber")}
                disabled={isLoading}
                maxLength={22}
                onKeyDown={handleNumericKeyDown}
                onPaste={handleNumericPaste}
                aria-invalid={!!errors.nitkuNumber}
              />
              {errors.nitkuNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nitkuNumber.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle>Status Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ACTIVE" id="status-active" />
                    <Label htmlFor="status-active">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="INACTIVE" id="status-inactive" />
                    <Label htmlFor="status-inactive">Inactive</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DRAFT" id="status-draft" />
                    <Label htmlFor="status-draft">Draft</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="BLACKLISTED" id="status-blacklist" />
                    <Label htmlFor="status-blacklist">Blacklist</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="blacklistReason">Blacklist Reason</Label>
            <Textarea
              id="blacklistReason"
              placeholder="Blacklist reason"
              {...register("blacklistReason")}
              disabled={isLoading || !isBlacklisted}
            />
            {errors.blacklistReason && (
              <p className="mt-1 text-sm text-red-600">
                {errors.blacklistReason.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="blacklistDocumentObject">Blacklist Document</Label>
            <Controller
              name="blacklistDocumentObject"
              control={control}
              render={({ field }) => (
                <Input
                  id="blacklistDocumentObject"
                  type="file"
                  multiple={false}
                  disabled={isLoading || !isBlacklisted}
                  onChange={(e) => {
                    const fileList = e.target.files;
                    field.onChange(fileList?.[0] || null);
                  }}
                />
              )}
            />
            {errors.blacklistDocumentObject && (
              <p className="mt-1 text-sm text-red-600">
                {errors.blacklistDocumentObject.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Information - enable when mode === "create" */}

      {(mode as string) === "disabled-feature" && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="document" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="document">Document</TabsTrigger>
                <TabsTrigger value="tax">Tax</TabsTrigger>
              </TabsList>
              <TabsContent value="document" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Documents</h3>
                  <ActionButton
                    variant="add"
                    showLabel
                    onClick={handleOpenAddDocument}
                    disabled={isLoading}
                    label="Add Document"
                  />
                </div>
                <OfflineDataTable
                  columns={getDocumentColumns(
                    handleOpenEditDocument,
                    handleRemoveDocument,
                    isLoading,
                  )}
                  data={documents}
                  enablePagination={false}
                  title=""
                  toolbar={{
                    enableColumnToggle: false,
                  }}
                />

                <PartnerDocumentFormModal
                  open={documentModalOpen}
                  partner={getValues() as Partner}
                  onOpenChange={setDocumentModalOpen}
                  mode={selectedDocumentForEdit ? "edit" : "create"}
                  isLocalMode={true}
                  defaultValues={selectedDocumentForEdit ?? undefined}
                  onSuccess={handleDocumentModalSuccess}
                />
              </TabsContent>
              <TabsContent value="tax" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Taxes</h3>
                  <ActionButton
                    variant="add"
                    showLabel
                    onClick={handleOpenAddTax}
                    disabled={isLoading}
                    label="Add Tax"
                  />
                </div>
                <OfflineDataTable
                  columns={getTaxColumns(
                    handleOpenEditTax,
                    handleRemoveTax,
                    isLoading,
                  )}
                  data={taxes}
                  enablePagination={false}
                  title=""
                  toolbar={{
                    enableColumnToggle: false,
                  }}
                />

                <PartnerTaxFormModal
                  open={taxModalOpen}
                  onOpenChange={setTaxModalOpen}
                  mode={selectedTaxForEdit ? "edit" : "create"}
                  isLocalMode={true}
                  defaultValues={selectedTaxForEdit ?? undefined}
                  onSuccess={handleTaxModalSuccess}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          variant="back"
          showLabel
          disabled={isLoading}
          onClick={() => navigate(PARTNER_URL)}
        />
        <ActionButton
          variant="save"
          type="submit"
          disabled={isLoading}
          showLabel
        >
          {mode === "create" ? "Create Partner" : "Update Partner"}
        </ActionButton>
      </div>
    </form>
  );
}
