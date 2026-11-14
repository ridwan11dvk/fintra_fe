import type { Partner, PartnerRequest } from "@/features/master-data";
import {
  PARTNER_LIST_PAGE_TITLE,
  PARTNER_UPDATE_PAGE_TITLE,
  PARTNER_UPDATE_PERMISSION,
  PARTNER_URL,
  PartnerForm,
  partnerDetailUrl,
  partnerQueryKeys,
  useGetPartnerById,
  useUpdatePartnerMutation,
} from "@/features/master-data";
import type { ApiResponse, ErrorItem } from "@railfinance/core/types";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { getErrorItems } from "@railfinance/core/lib";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

export function PartnerUpdatePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [apiErrors, setApiErrors] = useState<ErrorItem[]>([]);

  const partnerId = id ? Number(id) : undefined;

  const getPartnerQuery = useGetPartnerById(partnerId!, {
    enabled: !!partnerId,
  });

  const updatePartnerMutation = useUpdatePartnerMutation({
    onSuccess: (data: ApiResponse<Partner>) => {
      if (data.status === "SUCCESS") {
        queryClient.invalidateQueries({
          queryKey: partnerQueryKeys.detail(partnerId!),
        });
        queryClient.invalidateQueries({
          queryKey: partnerQueryKeys.lists(),
        });
        navigate(partnerDetailUrl(partnerId!));
      }
    },
    onError: (error) => {
      setApiErrors(getErrorItems(error));
    },
  });

  const handleSubmit = async (data: PartnerRequest) => {
    if (partnerId) {
      updatePartnerMutation.mutate({ id: partnerId, data });
    }
  };

  if (getPartnerQuery.isLoading) {
    return <Page type="base" isLoading />;
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

  return (
    <Page
      type="base"
      title={PARTNER_UPDATE_PAGE_TITLE}
      permission={PARTNER_UPDATE_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: PARTNER_LIST_PAGE_TITLE,
          url: PARTNER_URL,
        },
      ]}
    >
      <div className="flex flex-col gap-6">
        <PageHeader
          title={PARTNER_UPDATE_PAGE_TITLE}
          description={`Update information for partner: ${getPartnerQuery.data.data.name}`}
        />

        <PartnerForm
          mode="edit"
          defaultValues={getPartnerQuery.data.data}
          onSubmit={handleSubmit}
          isLoading={updatePartnerMutation.isPending}
          apiErrors={apiErrors}
        />
      </div>
    </Page>
  );
}

export default PartnerUpdatePage;
