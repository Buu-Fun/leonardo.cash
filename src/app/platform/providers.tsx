'use client';
import * as React from 'react';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import config from '../../wagmi';
import { PriceProvider } from '@/src/context/price.context';
import { StakingProvider } from '@/src/context/staking.context';

import { WalletProvider } from '@/src/context/wallet.context';
import '../../styles/solana-modal.css';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#803bf1',
            accentColorForeground: 'white',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
        >
          <WalletProvider>
            <PriceProvider>
              <StakingProvider>{children}</StakingProvider>
            </PriceProvider>
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
