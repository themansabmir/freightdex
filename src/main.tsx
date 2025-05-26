import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@scss/root.scss";
import { ErrorBoundary } from "@shared/components/Error";
import { queryClient, QueryClientProvider} from '@lib/react-query'
import {toast, ToastContainer} from "react-toastify"


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
);
