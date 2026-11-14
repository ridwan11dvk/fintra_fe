import App from "@/app/app";
import { installRemoteLoadFailureRecovery } from "@/shared/lib/mfe/pending-update-reload";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

installRemoteLoadFailureRecovery();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
