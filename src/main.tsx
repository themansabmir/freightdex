import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/index';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@scss/root.scss';
import { ErrorBoundary } from '@shared/components/Error';
import { queryClient, QueryClientProvider } from '@lib/react-query';
import { AuthProvider } from '@modules/auth/hooks/context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>
);
