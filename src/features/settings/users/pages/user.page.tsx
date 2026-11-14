import {
  EXTERNAL_USER_LIST_PAGE_TITLE,
  ExternalUserList,
  INTERNAL_USER_LIST_PAGE_TITLE,
  InternalUserList,
  SETTINGS_PAGE_TITLE,
  USER_CREATE_PERMISSION,
  USER_LIST_PAGE_TITLE,
  USER_LIST_PERMISSION,
  USER_URL,
  externalUserCreateUrl,
  internalUserCreateUrl,
} from "@/features/settings";
import { ActionButton } from "@railfinance/core/components/actions";
import { Modal } from "@railfinance/core/components/modal";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";
import { useUserChangeEvents } from "@railfinance/core/hooks";
import { cn } from "@railfinance/core/lib";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@railfinance/core/ui/tabs";
import { Building2, UserRound } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const userTypeChoices = [
  {
    value: "internal",
    label: "Internal User",
    description: "Employee account, master data is sourced from ESA.",
    icon: Building2,
  },
  {
    value: "external",
    label: "External User",
    description: "Partner or vendor account with limited access.",
    icon: UserRound,
  },
] as const;

export function UserPage() {
  const [selectUserModalOpen, setSelectUserModalOpen] = useState(false);
  const [userType, setUserType] = useState<string>("internal");

  const navigate = useNavigate();

  // Subscribe to real-time user data change events
  useUserChangeEvents({
    topics: ["user-changed", "role-changed"],
  });

  const handleContinue = () => {
    setSelectUserModalOpen(false);
    if (userType === "internal") {
      navigate(internalUserCreateUrl());
    }
    if (userType === "external") {
      navigate(externalUserCreateUrl());
    }
  };

  return (
    <Page
      type="base"
      title={USER_LIST_PAGE_TITLE}
      permission={USER_LIST_PERMISSION}
      breadcrumbs={[
        { title: SETTINGS_PAGE_TITLE, url: "#" },
        { title: USER_LIST_PAGE_TITLE, url: USER_URL },
      ]}
    >
      <PageHeader
        title={USER_LIST_PAGE_TITLE}
        description="Manage internal and external users of the application."
        actions={
          <ActionButton
            variant="add"
            label="Add User"
            showLabel
            onClick={() => setSelectUserModalOpen(true)}
            permission={USER_CREATE_PERMISSION}
          />
        }
      />

      <Tabs defaultValue="internal">
        <TabsList className="mb-4 h-11 w-full max-w-md bg-muted/50 p-1">
          <TabsTrigger value="internal" className="flex-1">
            {INTERNAL_USER_LIST_PAGE_TITLE}
          </TabsTrigger>
          <TabsTrigger value="external" className="flex-1">
            {EXTERNAL_USER_LIST_PAGE_TITLE}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="internal">
          <div className="rounded-lg border border-border bg-card">
            <InternalUserList />
          </div>
        </TabsContent>
        <TabsContent value="external">
          <div className="rounded-lg border border-border bg-card">
            <ExternalUserList />
          </div>
        </TabsContent>
      </Tabs>

      <Modal
        open={selectUserModalOpen}
        onOpenChange={setSelectUserModalOpen}
        title="Add New User"
        size="default"
        description="Select the user type to continue."
        confirmText="Continue"
        onConfirm={handleContinue}
        onCancel={() => setSelectUserModalOpen(false)}
      >
        <div
          role="radiogroup"
          aria-label="User type"
          className="grid gap-3 sm:grid-cols-2"
        >
          {userTypeChoices.map((choice) => {
            const Icon = choice.icon;
            const selected = userType === choice.value;
            return (
              <label
                key={choice.value}
                className={cn(
                  "flex cursor-pointer flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
                  "hover:bg-muted/50 focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:outline-none",
                  selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border",
                )}
              >
                <input
                  type="radio"
                  name="user-type"
                  value={choice.value}
                  checked={selected}
                  onChange={() => setUserType(choice.value)}
                  data-testid={`radio-${choice.value}`}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "rounded-lg p-2",
                    selected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="text-sm font-semibold">{choice.label}</span>
                <span className="text-xs text-muted-foreground">
                  {choice.description}
                </span>
              </label>
            );
          })}
        </div>
      </Modal>
    </Page>
  );
}

export default UserPage;
