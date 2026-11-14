/**
 * Profile Feature Routes
 */

import { Route } from "react-router";
import { HomeLazyPage, SelectModuleLazyPage } from "./pages";

export const guestRoutes = (
  <>
    <Route path="/" element={<HomeLazyPage />} />
    <Route path="/select-module" element={<SelectModuleLazyPage />} />
  </>
);
