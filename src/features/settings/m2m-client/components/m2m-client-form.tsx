import { zodResolver } from "@hookform/resolvers/zod";
import type { FormMode } from "@railfinance/core/types";
import { Button } from "@railfinance/core/ui/button";
import { Input } from "@railfinance/core/ui/input";
import { Label } from "@railfinance/core/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@railfinance/core/ui/select";
import { Controller, useForm } from "react-hook-form";
import {
  m2mClientCreateSchema,
  m2mClientUpdateSchema,
  type M2mClientCreateFormData,
  type M2mClientUpdateFormData,
} from "../data/m2m-client.schema";
import type { M2mClientResponse } from "../data/m2m-client.types";

interface M2mClientFormProps {
  mode: FormMode;
  initialData?: M2mClientResponse;
  onSubmit: (data: M2mClientCreateFormData | M2mClientUpdateFormData) => void;
  isLoading?: boolean;
}

export default function M2mClientForm({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}: Readonly<M2mClientFormProps>) {
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<M2mClientCreateFormData | M2mClientUpdateFormData>({
    resolver: zodResolver(
      isEdit ? m2mClientUpdateSchema : m2mClientCreateSchema,
    ),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      ...(isEdit && {
        status: initialData?.status || "ACTIVE",
        expiresAt: initialData?.expiresAt || null,
      }),
      ...(!isEdit && {
        permissionIds: initialData?.permissions?.map((p) => p.id) || [],
        expiresAt: initialData?.expiresAt || null,
      }),
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="e.g., SAP Integration"
          disabled={mode === "view"}
        />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          {...register("description")}
          placeholder="Brief description of the integration"
          disabled={mode === "view"}
        />
        {errors.description && (
          <p className="text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      {isEdit && (
        <div className="space-y-2">
          <Label>Status</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {"status" in errors && errors.status && (
            <p className="text-sm text-red-600">
              {"status" in errors && errors.status?.message}
            </p>
          )}
        </div>
      )}

      {mode !== "view" && (
        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}
    </form>
  );
}
