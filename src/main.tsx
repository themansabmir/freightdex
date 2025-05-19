import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/index";
import "@scss/root.scss";
import { ErrorBoundary } from "@shared/components/Error";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
