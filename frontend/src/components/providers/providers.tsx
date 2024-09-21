"use client";

import { W3SProvider } from '@/components/providers/w3s-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStore, Provider as StorageProvider } from 'jotai';

const store = createStore();
const client = new QueryClient();

export default function Providers ({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <QueryClientProvider client={client}>
        <StorageProvider store={store}>
          <W3SProvider>
            {children}
          </W3SProvider>
        </StorageProvider>
      </QueryClientProvider>
    </div>
  );
}