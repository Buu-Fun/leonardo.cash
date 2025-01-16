'use client';
import * as React from 'react';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import config from '../../wagmi';
import { PriceProvider } from '@/src/context/price.context';
import { StakingProvider } from '@/src/context/staking.context';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#803bf1',
            accentColorForeground: 'white',
            // borderRadius: 'none',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <PriceProvider>
            <StakingProvider>{children}</StakingProvider>
          </PriceProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
