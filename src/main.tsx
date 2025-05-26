<<<<<<< HEAD
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/index";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "@scss/root.scss";
import { ErrorBoundary } from "@shared/components/Error";
import { queryClient, QueryClientProvider} from '@lib/react-query'
import {toast, ToastContainer} from "react-toastify"
=======
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/index';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@scss/root.scss';
import { ErrorBoundary } from '@shared/components/Error';
import { queryClient, QueryClientProvider } from '@lib/react-query';
import { AuthProvider } from '@modules/auth/hooks/context';
>>>>>>> fbae4b695843fc2359647fb29b68d3d555e30d28

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
<<<<<<< HEAD
      <QueryClientProvider client={queryClient}>
        <App />
        <ToastContainer />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
=======
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
>>>>>>> fbae4b695843fc2359647fb29b68d3d555e30d28
    </ErrorBoundary>
  </StrictMode>
);
