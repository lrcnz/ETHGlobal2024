"use client";

import { W3SProvider } from '@/components/providers/w3s-provider';
import { createStore, Provider as StorageProvider } from 'jotai';
import { WagmiProvider } from './wagmi-provider';
import Updater from './updater';

export const store = createStore();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <WagmiProvider>
        <StorageProvider store={store}>
          <W3SProvider>
            {children}
            <Updater />
          </W3SProvider>
        </StorageProvider>
      </WagmiProvider>
    </div>
  );
}