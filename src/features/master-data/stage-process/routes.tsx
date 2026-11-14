import { Route } from "react-router";
import { STAGE_PROCESS_BASE } from "./data/stage-process.utils";
import { StageProcessLazyPage } from "./pages";

export const stageProcessRoutes = <Route path={STAGE_PROCESS_BASE} element={<StageProcessLazyPage />} />;
