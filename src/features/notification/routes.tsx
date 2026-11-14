/**
 * Notification Feature Routes
 */

import { Route } from "react-router";
import {
  ANNOUNCEMENT_BASE,
  NOTIFICATION_BASE,
} from "./data/notification.utils";
import { AnnouncementLazyPage, NotificationLazyPage } from "./pages";

export const notificationRoutes = (
  <Route>
    <Route path={NOTIFICATION_BASE} element={<NotificationLazyPage />} />

    <Route path={ANNOUNCEMENT_BASE} element={<AnnouncementLazyPage />} />
  </Route>
);
