/* eslint-disable react-hooks/incompatible-library */
import {
  ROLE_CREATE_PERMISSION,
  ROLE_UPDATE_PERMISSION,
  useCreateRole,
  useUpdateRole,
  type Permission,
} from "@/features/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanyResponse, ModuleResponse, RoleDetailResponse } from "@railfinance/core/masterdata";
import { Accordion, AccordionCard } from "@railfinance/core/ui/accordion";
import { ActionButton } from "@railfinance/core/components/actions";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { QuerySelect } from "@railfinance/core/components/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { Separator } from "@railfinance/core/ui/separator";
import { setFormErrorsFromApi, toast } from "@railfinance/core/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@railfinance/core/ui/tabs";
import { Textarea } from "@railfinance/core/ui/textarea";
import { useGetActiveBusinessAreas, useGetActiveCompanies } from "@railfinance/core/masterdata";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { roleSchema, type RoleFormData } from "../data/role.schema";
import { RolePermissionSection } from "./role-permission-section";

interface RoleFormProps {
  role?: RoleDetailResponse | null;
  onSuccess?: () => void;
  /** Called when the user cancels in inline (page) mode */
  onCancel?: () => void;
}

export function RoleForm({
  role,
  onSuccess,
  onCancel,
}: Readonly<RoleFormProps>) {
  const isEditing = !!role;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || "",
      code: role?.code || "",
      companyCode: role?.companyCode || "",
      isActive: role?.isActive ?? true,
      type: role ? role?.type || "" : "ENTITY",
      businessAreaIds:
        role?.businessAreas?.map((ba) => ba.id) || role?.businessAreaIds || [],
      permissionIds: role?.permissions?.map((p) => p.id) || [],
      description: role?.description || "",
    },
  });

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetActiveCompanies();

  // Find selected company to get its modules
  const watchedCompanyCode = watch("companyCode");
  const selectedCompany = companiesData?.data?.find(
    (c: CompanyResponse) => c.code === watchedCompanyCode,
  );
  const companyModules: ModuleResponse[] = useMemo(
    () => selectedCompany?.modules || [],
    [selectedCompany],
  );

  // Get business areas based on selected company code
  const { data: businessAreasData, isLoading: isLoadingBusinessAreas } =
    useGetActiveBusinessAreas(watchedCompanyCode || undefined, {
      enabled: !!watchedCompanyCode,
    });

  const createRoleMutation = useCreateRole();
  const updateRoleMutation = useUpdateRole();

  const [selectedModuleTab, setSelectedModuleTab] = useState<string>("");

  const watchedName = watch("name");
  const watchedIsActive = watch("isActive");
  const watchedType = watch("type");
  const codeManuallyEditedRef = useRef(false);

  // Auto-generate code from name when creating a new role
  useEffect(() => {
    if (!isEditing && !codeManuallyEditedRef.current) {
      const generatedCode = watchedName
        .trim()
        .toUpperCase()
        .replaceAll(/[^A-Z0-9\s]/g, "")
        .replaceAll(/\s+/g, "_")
        .substring(0, 100);
      setValue("code", generatedCode);
    }
  }, [watchedName, isEditing, setValue]);

  // Mark code as manually edited when user types in it
  const handleCodeChange = () => {
    codeManuallyEditedRef.current = true;
  };

  // Permission state lifted from RolePermissionSection
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<
    Set<number>
  >(new Set());

  // Initialize permission state from role data
  useEffect(() => {
    const rolePermissions = role?.permissions || [];
    const ids = rolePermissions.map((p: Permission) => p.id);
    setSelectedPermissionIds(new Set(ids));
    codeManuallyEditedRef.current = !!role?.code;
  }, [role]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds((prev) => {
      const next = new Set(prev);
      if (next.has(permissionId)) {
        next.delete(permissionId);
      } else {
        next.add(permissionId);
      }
      // Sync to form state
      setValue("permissionIds", Array.from(next));
      return next;
    });
  };

  // Set initial module tab from role data (only once when modules load)
  useEffect(() => {
    if (selectedModuleTab) return; // Already set, don't override
    if (companyModules.length > 0) {
      setSelectedModuleTab(String(companyModules[0].id));
    }
  }, [companyModules, selectedModuleTab]);

  // Reset module tab and business areas when company changes
  useEffect(() => {
    if (!isEditing && watchedCompanyCode) {
      // Reset module selection to first module of new company
      if (companyModules.length > 0) {
        setSelectedModuleTab(String(companyModules[0].id));
      } else {
        setSelectedModuleTab("");
      }
      // Reset business area selection
      setValue("businessAreaIds", []);
    }
  }, [watchedCompanyCode, isEditing, companyModules, setValue]);

  const handleApiError = (error: unknown) => {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
          errors?: Array<{ field: string; message: string }>;
        };
      };
    };

    const permissionError = apiError?.response?.data?.errors?.find(
      (e) => e.field === "permissionIds",
    );

    if (permissionError) {
      toast.error(permissionError.message);
      return;
    }

    setFormErrorsFromApi(error, setError);
  };

  const onSubmit = (data: RoleFormData) => {
    if (isEditing && role) {
      updateRoleMutation.mutate(
        { id: role.id, role: data },
        {
          onSuccess: () => {
            onSuccess?.();
            reset();
          },
          onError: handleApiError,
        },
      );
    } else {
      createRoleMutation.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
          reset();
        },
        onError: handleApiError,
      });
    }
  };

  const handleCancel = () => {
    onCancel?.();
    reset();
  };

  const isLoading =
    createRoleMutation.isPending || updateRoleMutation.isPending;

  const companyOptions =
    companiesData?.data?.map((company: CompanyResponse) => ({
      value: company.code,
      label: company.name,
      description: company.code,
    })) || [];

  const businessAreaOptions =
    businessAreasData?.data?.map((ba) => ({
      value: String(ba.id),
      label: ba.name,
      description: ba.baCode,
    })) || [];

  const inlineButtons = (
    <div className="flex justify-end gap-2 pt-4">
      <ActionButton
        variant="cancel"
        onClick={handleCancel}
        disabled={isLoading}
        showLabel
      />
      <ActionButton
        variant="save"
        type="submit"
        disabled={isLoading}
        showLabel
        label={isEditing ? "Update Role" : "Create Role"}
        permission={isEditing ? ROLE_UPDATE_PERMISSION : ROLE_CREATE_PERMISSION}
      />
    </div>
  );

  const content = (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Accordion type="multiple" defaultValue={["role-info"]}>
        <AccordionCard trigger="Role Information" value="role-info">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Role Name <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Name suggestion: Role-Module-Business Area (Optional)
                </p>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter role name"
                  disabled={isLoading}
                />

                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="code">
                  Role Code <span className="text-red-500">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  This field is auto generated but editable
                </p>
                <Input
                  id="code"
                  {...register("code")}
                  placeholder="Enter role code"
                  disabled={isLoading}
                  onInput={handleCodeChange}
                />

                {errors.code && (
                  <p className="text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Company <span className="text-red-500">*</span>
                </Label>
                <QuerySelect
                  value={watch("companyCode")}
                  onValueChange={(value) => setValue("companyCode", value)}
                  options={companyOptions}
                  placeholder="Select company..."
                  disabled={isLoading || isLoadingCompanies}
                  aria-invalid={!!errors.companyCode}
                />
                {errors.companyCode && (
                  <p className="text-sm text-red-600">
                    {errors.companyCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Business Area Assignment</Label>
                <QuerySelect
                  multiple
                  value={watch("businessAreaIds") || []}
                  onValueChange={(value) =>
                    setValue(
                      "businessAreaIds",
                      (value as Array<string | number>).map(Number),
                    )
                  }
                  options={businessAreaOptions}
                  placeholder="Search business areas..."
                  disabled={isLoading || isLoadingBusinessAreas}
                  aria-invalid={!!errors.businessAreaIds}
                />
                {errors.businessAreaIds && (
                  <p className="text-sm text-red-600">
                    {errors.businessAreaIds.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>
                  Status <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedIsActive ? "active" : "inactive"}
                  onValueChange={(value) =>
                    setValue("isActive", value === "active")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Type{""}
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watchedType || ""}
                  onValueChange={(value) =>
                    setValue("type", value as "CORE" | "ENTITY")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CORE">Core</SelectItem>
                    <SelectItem value="ENTITY">Entity</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter role description"
                  rows={3}
                  disabled={isLoading}
                />
                {errors.description && (
                  <p className="text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </AccordionCard>
      </Accordion>
      {companyModules.length > 0 && (
        <Tabs
          value={selectedModuleTab}
          onValueChange={setSelectedModuleTab}
          className="w-full"
        >
          <div className="w-full relative flex items-center justify-center">
            <Separator className="absolute inset-0 top-1/2" />

            <TabsList variant="boxed">
              {companyModules.map((module: ModuleResponse) => (
                <TabsTrigger
                  key={module.id}
                  value={String(module.id)}
                  className="bg-background"
                >
                  {module.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {companyModules.map((module: ModuleResponse) => (
            <TabsContent
              key={module.id}
              value={String(module.id)}
              className="mt-4"
            >
              <RolePermissionSection
                roleId={role?.id}
                moduleId={module.id}
                moduleName={module.name}
                isEditing={isEditing}
                isPending={isLoading}
                selectedPermissionIds={selectedPermissionIds}
                onPermissionToggle={handlePermissionToggle}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {inlineButtons}
    </form>
  );

  return content;
}
