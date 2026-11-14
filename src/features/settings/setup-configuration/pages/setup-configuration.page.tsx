import {
  Page,
  PageHeader,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@railfinance/core";
import {
  ComplianceFsscTab,
  FinancialControlValidationTab,
} from "../components";
import { StageProcessContent } from "@/features/master-data/stage-process";
import {
  COMPLIANCE_FSSC_TAB_TITLE,
  FINANCIAL_CONTROL_TAB_TITLE,
  PROCESS_REFERENCE_TAB_TITLE,
  SETUP_CONFIGURATION_PAGE_TITLE,
  SETUP_CONFIGURATION_URL,
} from "../data";

export function SetupConfigurationPage() {
  return (
    <Page
      type="base"
      title={SETUP_CONFIGURATION_PAGE_TITLE}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: SETUP_CONFIGURATION_PAGE_TITLE,
          url: SETUP_CONFIGURATION_URL,
        },
      ]}
    >
      <div className="space-y-6 w-full">
        <PageHeader
          title={SETUP_CONFIGURATION_PAGE_TITLE}
          withBackButton={false}
        />
        <Separator className="w-full" />

        <Tabs
          defaultValue="process-reference"
          className="w-full space-y-6"
        >
          <TabsList className="border border-border/80 h-10 p-1 bg-muted/30 rounded-lg">
            <TabsTrigger value="process-reference" className="px-4 py-1.5">
              {PROCESS_REFERENCE_TAB_TITLE}
            </TabsTrigger>
            <TabsTrigger value="compliance-fssc" className="px-4 py-1.5">
              {COMPLIANCE_FSSC_TAB_TITLE}
            </TabsTrigger>
            <TabsTrigger
              value="financial-control-validation"
              className="px-4 py-1.5"
            >
              {FINANCIAL_CONTROL_TAB_TITLE}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="process-reference">
            <StageProcessContent />
          </TabsContent>

          <TabsContent value="compliance-fssc">
            <ComplianceFsscTab />
          </TabsContent>

          <TabsContent value="financial-control-validation">
            <FinancialControlValidationTab />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}

export default SetupConfigurationPage;
