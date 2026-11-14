import {
  NOTIFICATION_LIST_PAGE_TITLE,
  NOTIFICATION_URL,
  NotificationContent,
} from "@/features/notification";
import { Card, CardContent } from "@railfinance/core/ui/card";
import { Page } from "@railfinance/core/components/page-shell";
import { PageHeader } from "@railfinance/core/components/page-header";

export function NotificationPage() {
  return (
    <Page
      type="base"
      title={NOTIFICATION_LIST_PAGE_TITLE}
      breadcrumbs={[
        {
          title: NOTIFICATION_LIST_PAGE_TITLE,
          url: NOTIFICATION_URL,
        },
      ]}
    >
      <PageHeader
        title="Notifications"
        description="View and manage all notifications sent to users"
      />
      <Card className="w-full">
        <CardContent>
          <NotificationContent />
        </CardContent>
      </Card>
    </Page>
  );
}

export default NotificationPage;
