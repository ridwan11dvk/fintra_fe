import {
  PARTNER_UPDATE_PERMISSION,
  PartnerTaxProfileFormModal,
  useDeletePartnerTaxProfileMutation,
  useGetPartnerTaxProfile,
} from "@/features/master-data";
import { ActionButton } from "@railfinance/core/components/actions";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { ConfirmationModal } from "@railfinance/core/components/modal";
import { useState } from "react";

interface PartnerTaxProfilesProps {
  partnerId: number;
  open?: boolean;
}

export function PartnerTaxProfiles({
  partnerId,
  open,
}: Readonly<PartnerTaxProfilesProps>) {
  // 0..1 resource: 404 (not created yet) is a normal state, handled silently
  const taxProfileQuery = useGetPartnerTaxProfile(partnerId, {
    enabled: partnerId > 0 && open,
  });

  const [formModalOpen, setFormModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const deleteMutation = useDeletePartnerTaxProfileMutation({
    onSuccess: () => setDeleteModalOpen(false),
  });

  const taxProfile = taxProfileQuery.data?.data ?? null;
  const isLoading = taxProfileQuery.isLoading;
  // A 404 means the tax profile has not been created yet
  const notCreated = taxProfileQuery.isError;

  const mode: "create" | "edit" = taxProfile ? "edit" : "create";

  const handleDelete = () => {
    if (taxProfile?.id) {
      deleteMutation.mutate({ partnerId, taxProfileId: taxProfile.id });
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <p className="text-sm text-gray-500">Loading tax profile…</p>;
    }
    if (notCreated || !taxProfile) {
      return (
        <p className="text-sm text-gray-500">
          No tax profile has been created for this partner yet.
        </p>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">Taxpayer Name</p>
          <p className="font-medium">{taxProfile.taxpayerName || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">NPWP Number</p>
          <p className="font-medium">{taxProfile.npwpNumber || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">NITKU Number</p>
          <p className="font-medium">{taxProfile.nitkuNumber || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Taxable Employer Number</p>
          <p className="font-medium">{taxProfile.taxableEmployerNo || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">VAT Status</p>
          <p className="font-medium">{taxProfile.vatStatus || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">VAT Rate</p>
          <p className="font-medium">{taxProfile.vatRate || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Classification</p>
          <p className="font-medium">{taxProfile.classification || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">WAPU Status</p>
          <p className="font-medium">{taxProfile.wapuStatus || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Tax Exempt</p>
          <p className="font-medium">{taxProfile.isTaxExempt ? "Yes" : "No"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-gray-500">Tax Address</p>
          <p className="font-medium whitespace-pre-line">
            {taxProfile.address || "-"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Partner Tax Profile</CardTitle>
          <CardDescription>
            NPWP and tax identity details for this partner
          </CardDescription>
          <CardAction>
            {taxProfile ? (
              <div className="flex items-center gap-2">
                <ActionButton
                  variant="edit"
                  buttonVariant="success-outline"
                  showLabel
                  label="Edit"
                  onClick={() => setFormModalOpen(true)}
                  permission={PARTNER_UPDATE_PERMISSION}
                />
                <ActionButton
                  variant="delete"
                  showLabel
                  buttonVariant="destructive-outline"
                  onClick={() => setDeleteModalOpen(true)}
                  permission={PARTNER_UPDATE_PERMISSION}
                />
              </div>
            ) : (
              <ActionButton
                variant="add"
                showLabel
                label="Add Tax Profile"
                onClick={() => setFormModalOpen(true)}
                disabled={isLoading}
                permission={PARTNER_UPDATE_PERMISSION}
              />
            )}
          </CardAction>
        </CardHeader>
        <CardContent>{renderBody()}</CardContent>
      </Card>

      <PartnerTaxProfileFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        mode={mode}
        partnerId={partnerId}
        defaultValues={taxProfile ?? undefined}
        onSuccess={() => {}}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Tax Profile"
        description="Are you sure you want to delete this tax profile? This action cannot be undone."
        onConfirm={handleDelete}
        confirmVariant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
