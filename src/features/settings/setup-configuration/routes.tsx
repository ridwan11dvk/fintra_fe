import { lazy } from "react";
import { Route } from "react-router";
import { SETUP_CONFIGURATION_BASE } from "./data";

const SetupConfigurationPage = lazy(() =>
  import("./pages").then((module) => ({
    default: module.SetupConfigurationPage,
  })),
);

export const setupConfigurationRoutes = (
  <Route
    path={SETUP_CONFIGURATION_BASE}
    element={<SetupConfigurationPage />}
  />
);
