import { NotificationContent } from "@/features/notification/components/notification-content";
import { Card, CardContent, CardHeader, CardTitle } from "@railfinance/core/ui/card";

export function NotificationSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent>
        <NotificationContent asChildren />
      </CardContent>
    </Card>
  );
}

export default NotificationSection;
