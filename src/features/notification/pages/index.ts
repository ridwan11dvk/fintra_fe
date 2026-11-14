import { lazy } from "react";

export const NotificationLazyPage = lazy(() =>
  import("./notification.page").then((mod) => ({
    default: mod.NotificationPage,
  })),
);

export const AnnouncementLazyPage = lazy(() =>
  import("./announcement.page").then((mod) => ({
    default: mod.AnnouncementPage,
  })),
);
