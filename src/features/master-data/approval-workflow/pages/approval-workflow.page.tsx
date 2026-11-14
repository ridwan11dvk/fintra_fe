import {
  Badge,
  Button,
  Card,
  CardContent,
  Page,
  PageHeader,
  SectionCard,
  Visibility,
} from "@railfinance/core";
import { ArrowRight, Edit3, Eye, PlusCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router";
import {
  APPROVAL_WORKFLOW_CREATE_PERMISSION,
  APPROVAL_WORKFLOW_CREATE_URL,
  APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
  APPROVAL_WORKFLOW_LIST_PERMISSION,
  APPROVAL_WORKFLOW_READ_PERMISSION,
  APPROVAL_WORKFLOW_UPDATE_PERMISSION,
  APPROVAL_WORKFLOW_URL,
  getApprovalWorkflowDetailUrl,
  getApprovalWorkflowEditUrl,
  useListApprovalWorkflows,
} from "../data";

export function ApprovalWorkflowPage() {
  const navigate = useNavigate();
  const { data: response } = useListApprovalWorkflows();

  const workflows = response?.data ?? [];

  return (
    <Page
      type="base"
      title={APPROVAL_WORKFLOW_LIST_PAGE_TITLE}
      permission={APPROVAL_WORKFLOW_LIST_PERMISSION}
      breadcrumbs={[
        {
          title: "Master Data",
          url: "#",
        },
        {
          title: APPROVAL_WORKFLOW_LIST_PAGE_TITLE,
          url: APPROVAL_WORKFLOW_URL,
        },
      ]}
    >
      {/* Page Header */}
      <PageHeader
        title="Approval Workflow Configuration"
        description="Configure approval steps for different transaction types"
        withBackButton={false}
        actions={
          <Visibility permission={APPROVAL_WORKFLOW_CREATE_PERMISSION}>
            <Button
              className="bg-[#1b2559] hover:bg-[#1b2559]/90 text-white font-medium gap-2 px-4 shadow-xs"
              onClick={() => navigate(APPROVAL_WORKFLOW_CREATE_URL)}
            >
              <PlusCircle className="size-4" />
              <span>Add Approval Workflow</span>
            </Button>
          </Visibility>
        }
      />

      {/* Main Container wrapping all SectionCard workflow items */}
      <Card className="w-full rounded-2xl border border-border bg-card p-6 shadow-xs">
        <CardContent className="p-0 space-y-4">
          {workflows.map((workflow) => {
            const targetId = workflow.transactionType;

            return (
              <SectionCard
                key={workflow.transactionType}
                title={workflow.transactionTypeName || String(workflow.transactionType)}
                description={workflow.description}
                className="rounded-xl border border-border/80 shadow-xs hover:border-primary/20 transition-colors"
                action={
                  <div className="flex items-center gap-2">
                    <Visibility permission={APPROVAL_WORKFLOW_READ_PERMISSION}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5 border-border hover:bg-muted"
                        onClick={() =>
                          navigate(getApprovalWorkflowDetailUrl(targetId))
                        }
                      >
                        <Eye className="size-3.5 text-muted-foreground" />
                        <span>View Detail</span>
                      </Button>
                    </Visibility>
                    <Visibility permission={APPROVAL_WORKFLOW_UPDATE_PERMISSION}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs gap-1.5 border-border hover:bg-muted"
                        onClick={() =>
                          navigate(getApprovalWorkflowEditUrl(targetId))
                        }
                      >
                        <Edit3 className="size-3.5 text-muted-foreground" />
                        <span>Edit Flow</span>
                      </Button>
                    </Visibility>
                  </div>
                }
              >
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {workflow.roles?.map((role, idx) => (
                    <React.Fragment
                      key={`${workflow.transactionType}-${role}-${idx}`}
                    >
                      <Badge
                        variant="warning-outline"
                        className="px-3 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-700 border-amber-300 dark:bg-amber-950/20 dark:border-amber-700 dark:text-amber-300"
                      >
                        {role}
                      </Badge>
                      {idx < workflow.roles.length - 1 && (
                        <ArrowRight className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </SectionCard>
            );
          })}
        </CardContent>
      </Card>
    </Page>
  );
}

export default ApprovalWorkflowPage;
