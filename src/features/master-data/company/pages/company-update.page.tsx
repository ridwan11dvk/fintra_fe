import {
  COMPANY_LIST_PAGE_TITLE,
  COMPANY_UPDATE_PAGE_TITLE,
  COMPANY_UPDATE_PERMISSION,
  COMPANY_URL,
  CompanyForm,
  companyDetailUrl,
  companyQueryKeys,
  useGetCompanyById,
  useUpdateCompanyMutation,
  type CompanyFormData,
} from "@/features/master-data";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { ProgressLoader } from "@railfinance/core/components/loader";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";

export function CompanyUpdatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const companyId = Number(id);

  const { data: response, isLoading } = useGetCompanyById(companyId);
  const company = response?.data;

  const updateMutation = useUpdateCompanyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.detail(companyId),
      });
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.lists(),
      });
      navigate(companyDetailUrl(companyId));
    },
  });

  const handleSubmit = async (
    data: CompanyFormData & { files?: File[]; fileAliases?: string },
  ) => {
    updateMutation.mutate({
      id: companyId,
      data,
    });
  };

  if (isLoading) {
    return (
      <Page
        type="base"
        title={COMPANY_UPDATE_PAGE_TITLE}
        permission={COMPANY_UPDATE_PERMISSION}
        breadcrumbs={[
          { title: "Master Data", url: "#" },
          { title: COMPANY_LIST_PAGE_TITLE, url: COMPANY_URL },
          { title: "Edit", url: "#" },
        ]}
      >
        <div className="flex justify-center items-center h-96">
          <ProgressLoader />
        </div>
      </Page>
    );
  }

  return (
    <Page
      type="base"
      title={COMPANY_UPDATE_PAGE_TITLE}
      permission={COMPANY_UPDATE_PERMISSION}
      breadcrumbs={[
        { title: "Master Data", url: "#" },
        { title: COMPANY_LIST_PAGE_TITLE, url: COMPANY_URL },
        { title: company?.name || "Edit", url: "#" },
      ]}
    >
      <PageHeader
        title="Edit Company"
        description={`Update information for "${company?.name}"`}
      />

      {company && (
        <CompanyForm
          mode="edit"
          defaultValues={company}
          onSubmit={handleSubmit}
          isLoading={updateMutation.isPending}
        />
      )}
    </Page>
  );
}
