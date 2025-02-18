'use client';
import * as React from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

import '../../styles/solana-modal.css';
import { PRIVY_APP_ID } from '@/src/config';
import { AuthenticationProvider } from '@/src/context/account.context';
import { WalletProvider } from '@/src/context/wallet.context';
import '@solana/wallet-adapter-react-ui/styles.css';

// e

import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import {
  CoinbaseWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export default function Providers({ children }: { children: React.ReactNode }) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);

  const wallets = React.useMemo(
    () => [
      new CoinbaseWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    [network],
  );

  return (
    <PrivyProvider
      appId={PRIVY_APP_ID as string}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <WalletProvider>
              <AuthenticationProvider>{children}</AuthenticationProvider>
            </WalletProvider>
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </PrivyProvider>
  );
}
