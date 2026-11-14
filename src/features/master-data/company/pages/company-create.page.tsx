import {
  COMPANY_CREATE_PAGE_TITLE,
  COMPANY_CREATE_PERMISSION,
  COMPANY_LIST_PAGE_TITLE,
  COMPANY_URL,
  CompanyForm,
  companyCreateUrl,
  companyQueryKeys,
  useCreateCompanyMutation,
  type CompanyFormData,
} from "@/features/master-data";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export function CompanyCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useCreateCompanyMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.lists(),
      });
      navigate(COMPANY_URL);
    },
  });

  const handleSubmit = async (
    data: CompanyFormData & { files?: File[]; fileAliases?: string },
  ) => {
    createMutation.mutate(data);
  };

  return (
    <Page
      type="base"
      title={COMPANY_CREATE_PAGE_TITLE}
      permission={COMPANY_CREATE_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: COMPANY_LIST_PAGE_TITLE,
          url: COMPANY_URL,
        },
        {
          title: COMPANY_CREATE_PAGE_TITLE,
          url: companyCreateUrl(),
        },
      ]}
    >
      <PageHeader
        title="Create New Company"
        description="Add a new company to the system"
      />

      <CompanyForm
        mode="create"
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending}
      />
    </Page>
  );
}
