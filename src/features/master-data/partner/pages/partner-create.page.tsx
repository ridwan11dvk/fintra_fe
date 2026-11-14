import type { Partner, PartnerRequest } from "@/features/master-data";
import {
  PARTNER_CREATE_PAGE_TITLE,
  PARTNER_CREATE_PERMISSION,
  PARTNER_LIST_PAGE_TITLE,
  PARTNER_URL,
  PartnerForm,
  partnerCreateUrl,
  partnerDetailUrl,
  useCreatePartnerMutation,
} from "@/features/master-data";
import type { ApiResponse, ErrorItem } from "@railfinance/core/types";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { getErrorItems } from "@railfinance/core/lib";
import { useState } from "react";
import { useNavigate } from "react-router";

export function PartnerCreatePage() {
  const navigate = useNavigate();
  const [apiErrors, setApiErrors] = useState<ErrorItem[]>([]);

  const createPartnerMutation = useCreatePartnerMutation({
    onSuccess: (data: ApiResponse<Partner>) => {
      if (data.status === "SUCCESS") {
        navigate(partnerDetailUrl(data.data!.id));
      }
    },
    onError: (error) => {
      setApiErrors(getErrorItems(error));
    },
  });

  const handleSubmit = async (data: PartnerRequest) => {
    createPartnerMutation.mutate(data);
  };

  return (
    <Page
      type="base"
      title={PARTNER_CREATE_PAGE_TITLE}
      permission={PARTNER_CREATE_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: PARTNER_LIST_PAGE_TITLE, url: PARTNER_URL },
        { title: PARTNER_CREATE_PAGE_TITLE, url: partnerCreateUrl() },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={PARTNER_CREATE_PAGE_TITLE}
          description="Add a new partner to the system"
        />

        <PartnerForm
          mode="create"
          onSubmit={handleSubmit}
          isLoading={createPartnerMutation.isPending}
          apiErrors={apiErrors}
        />
      </div>
    </Page>
  );
}

export default PartnerCreatePage;
