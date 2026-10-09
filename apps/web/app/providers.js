'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function Providers({ children }) {
  useEffect(() => {
    // Suppress unhandled errors and rejections coming from browser extensions (e.g. CRX Emulator, Adblockers)
    const handleError = (event) => {
      const isExtensionError =
        event.filename?.includes('chrome-extension://') ||
        event.filename?.includes('moz-extension://') ||
        event.message?.includes('chrome: call method') ||
        event.message?.includes('chrome-extension://') ||
        event.error?.stack?.includes('chrome-extension://') ||
        event.error?.stack?.includes('moz-extension://');

      if (isExtensionError) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    const handleRejection = (event) => {
      const reason = event.reason;
      const msg = reason?.message || String(reason || '');
      const stack = reason?.stack || '';
      const isExtensionError =
        msg.includes('chrome: call method') ||
        msg.includes('chrome-extension://') ||
        stack.includes('chrome-extension://') ||
        stack.includes('moz-extension://');

      if (isExtensionError) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleRejection, true);

    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleRejection, true);
    };
  }, []);

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}
