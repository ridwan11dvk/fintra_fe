import {
  PARTNER_BANK_LIST_PERMISSION,
  PARTNER_BUSINESS_FIELD_LIST_PERMISSION,
  PARTNER_CONTACT_LIST_PERMISSION,
  PARTNER_DOCUMENT_LIST_PERMISSION,
  PARTNER_ERP_CODE_LIST_PERMISSION,
  PARTNER_LEGALITY_LIST_PERMISSION,
  PARTNER_LIST_PAGE_TITLE,
  PARTNER_READ_PERMISSION,
  PARTNER_ROLE_LIST_PERMISSION,
  PARTNER_TAX_LIST_PERMISSION,
  PARTNER_UPDATE_PERMISSION,
  PARTNER_VA_LIST_PERMISSION,
  PARTNER_URL,
  PartnerBankAccounts,
  PartnerContacts,
  partnerDetailUrl,
  PartnerDocuments,
  partnerEditUrl,
  PartnerErpCodes,
  PartnerRoles,
  PartnerTaxes,
  PartnerTaxProfiles,
  PartnerVirtualAccounts,
  useGetPartnerById,
} from "@/features/master-data";
import { Visibility } from "@railfinance/core";
import { ActionButton } from "@railfinance/core/components/actions";
import { StatusBadge } from "@railfinance/core/components/badges";
import { PageHeader } from "@railfinance/core/components/page-header";
import { Page } from "@railfinance/core/components/page-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@railfinance/core/ui/tabs";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PartnerKblis, PartnerLegalityContent } from "../components";

function getPartnerStatusBadge(status?: string | null) {
  let badgeStatus: "active" | "inactive" | "error" | "info" = "info";
  if (status === "ACTIVE") {
    badgeStatus = "active";
  } else if (status === "INACTIVE") {
    badgeStatus = "inactive";
  } else if (status === "BLACKLISTED") {
    badgeStatus = "error";
  }
  return <StatusBadge status={badgeStatus} label={status ?? "DRAFT"} />;
}

export function PartnerShowPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const partnerId = id ? Number(id) : undefined;

  const [tabValue, setTabValue] = useState("details");

  // Queries
  const getPartnerQuery = useGetPartnerById(partnerId!, {
    enabled: !!partnerId,
  });

  if (getPartnerQuery.isLoading) {
    return <Page type="base" title="Load Partner Data" isLoading />;
  }

  if (getPartnerQuery.isError || !getPartnerQuery.data?.data) {
    return (
      <Page type="base">
        <div className="flex items-center justify-center">
          <p>Failed to load partner data</p>
        </div>
      </Page>
    );
  }

  const partner = getPartnerQuery.data.data;

  const handleEdit = () => {
    navigate(partnerEditUrl(partner.id));
  };

  return (
    <Page
      type="base"
      title={partner.name}
      permission={PARTNER_READ_PERMISSION}
      breadcrumbs={[
        {
          url: PARTNER_URL,
          title: PARTNER_LIST_PAGE_TITLE,
        },
        {
          url: partnerDetailUrl(partner.id),
          title: partner.name,
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={partner.name}
          description={`Partner Code: ${partner.partnerCode}`}
          actions={
            <div className="flex gap-2">
              <ActionButton
                variant="edit"
                buttonVariant="success-outline"
                label="Edit Partner"
                showLabel
                onClick={handleEdit}
                permission={PARTNER_UPDATE_PERMISSION}
              />
            </div>
          }
        />

        <Tabs
          defaultValue="details"
          value={tabValue}
          onValueChange={setTabValue}
          className="w-full"
        >
          <TabsList className="flex w-full overflow-x-auto h-auto flex-wrap gap-1 justify-start bg-muted p-1 rounded-md">
            <TabsTrigger value="details" className="shrink-0">
              Details
            </TabsTrigger>
            <Visibility permission={PARTNER_ROLE_LIST_PERMISSION}>
              <TabsTrigger value="roles" className="shrink-0">
                Roles
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_BUSINESS_FIELD_LIST_PERMISSION}>
              <TabsTrigger value="business-fields" className="shrink-0">
                Business Fields
              </TabsTrigger>
            </Visibility>

            <Visibility permission={PARTNER_CONTACT_LIST_PERMISSION}>
              <TabsTrigger value="contacts" className="shrink-0">
                Contacts
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_LEGALITY_LIST_PERMISSION}>
              <TabsTrigger value="legality" className="shrink-0">
                Legality
              </TabsTrigger>
            </Visibility>
            <TabsTrigger value="tax-profile" className="shrink-0">
              Tax Profile
            </TabsTrigger>
            <Visibility permission={PARTNER_BANK_LIST_PERMISSION}>
              <TabsTrigger value="bank-accounts" className="shrink-0">
                Bank Accounts
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_VA_LIST_PERMISSION}>
              <TabsTrigger value="virtual-accounts" className="shrink-0">
                Virtual Accounts
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_TAX_LIST_PERMISSION}>
              <TabsTrigger value="taxes" className="shrink-0">
                Taxes
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_DOCUMENT_LIST_PERMISSION}>
              <TabsTrigger value="documents" className="shrink-0">
                Documents
              </TabsTrigger>
            </Visibility>
            <Visibility permission={PARTNER_ERP_CODE_LIST_PERMISSION}>
              <TabsTrigger value="erp-codes" className="shrink-0">
                ERP Codes
              </TabsTrigger>
            </Visibility>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Code</p>
                    <p className="font-medium">{partner.partnerCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{partner.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{partner.companyEmail || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">
                      {partner.companyPhoneNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {getPartnerStatusBadge(partner.status)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Identity Number</p>
                    <p className="font-medium">
                      {partner.identityNumber || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Identity Number Type</p>
                    <p className="font-medium">
                      {partner.identityNumberType || "-"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Validated by DJP</p>
                    <StatusBadge
                      status={partner.isValidatedByDjp ? "active" : "inactive"}
                      label={partner.isValidatedByDjp ? "Yes" : "No"}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Integrated to ERP</p>
                    <StatusBadge
                      status={partner.integratedToErp ? "active" : "inactive"}
                      label={partner.integratedToErp ? "Yes" : "No"}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  NPWP / tax identification details are managed in the Tax
                  Profile tab; addresses are held per partner address records
                  and contact persons have their own tab.
                </p>
              </CardContent>
            </Card>
          </TabsContent>


          {/* Roles Tab */}
          <Visibility permission={PARTNER_ROLE_LIST_PERMISSION}>
            <TabsContent value="roles" className="space-y-4">
              <PartnerRoles partnerId={partnerId!} open={tabValue === "roles"} />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_BUSINESS_FIELD_LIST_PERMISSION}>
            <TabsContent value="business-fields" className="space-y-4">
              <PartnerKblis partnerId={partnerId!} open={tabValue === "business-fields"} />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_DOCUMENT_LIST_PERMISSION}>
            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-4">
              <PartnerDocuments
                partner={partner}
                open={tabValue === "documents"}
              />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_CONTACT_LIST_PERMISSION}>
            {/* Contacts Tab */}
            <TabsContent value="contacts" className="space-y-4">
              <PartnerContacts
                partnerId={partnerId!}
                open={tabValue === "contacts"}
              />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_LEGALITY_LIST_PERMISSION}>
            {/* Legality Tab */}
            <TabsContent value="legality" className="space-y-4">
              <PartnerLegalityContent
                partnerId={partnerId!}
                open={tabValue === "legality"}
              />
            </TabsContent>
          </Visibility>

          {/* Tax Profile Tab */}
          <TabsContent value="tax-profile" className="space-y-4">
            <PartnerTaxProfiles
              partnerId={partnerId!}
              open={tabValue === "tax-profile"}
            />
          </TabsContent>

          <Visibility permission={PARTNER_TAX_LIST_PERMISSION}>
            {/* Taxes Tab */}
            <TabsContent value="taxes" className="space-y-4">
              <PartnerTaxes partnerId={partnerId!} open={tabValue === "taxes"} />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_BANK_LIST_PERMISSION}>
            {/* Bank Accounts Tab */}
            <TabsContent value="bank-accounts" className="space-y-4">
              <PartnerBankAccounts
                partnerId={partnerId!}
                open={tabValue === "bank-accounts"}
              />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_VA_LIST_PERMISSION}>
            {/* Virtual Accounts Tab */}
            <TabsContent value="virtual-accounts" className="space-y-4">
              <PartnerVirtualAccounts
                partnerId={partnerId!}
                open={tabValue === "virtual-accounts"}
              />
            </TabsContent>
          </Visibility>

          <Visibility permission={PARTNER_ERP_CODE_LIST_PERMISSION}>
            {/* ERP Codes Tab */}
            <TabsContent value="erp-codes" className="space-y-4">
              <PartnerErpCodes
                partnerId={partnerId!}
                open={tabValue === "erp-codes"}
              />
            </TabsContent>
          </Visibility>
        </Tabs>
      </div>
    </Page>
  );
}

export default PartnerShowPage;
