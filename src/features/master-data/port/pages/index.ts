import { lazy } from "react";

export const PortLazyPage = lazy(() =>
  import("./port.page").then((mod) => ({
    default: mod.PortPage,
  })),
);
