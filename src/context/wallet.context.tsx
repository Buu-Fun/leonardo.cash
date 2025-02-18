'use client';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import {
  ConnectedSolanaWallet,
  usePrivy,
  useSolanaWallets,
} from '@privy-io/react-auth';
import { useWallet as useWeb3Wallet } from '@solana/wallet-adapter-react';
import { Adapter } from '@solana/wallet-adapter-base';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useDisclosure } from '@nextui-org/react';
import { WalletConnectionTypeModal } from '../components/WalletConnectionTypeModal/WalletConnectionTypeModal';

interface Props {
  children: React.ReactNode;
}

export enum WalletConnectionType {
  Web2 = 'web2',
  Web3 = 'web3',
}

interface WalletContextType {
  address?: string | null;
  adapter?: Adapter | ConnectedSolanaWallet;
  connectionType?: WalletConnectionType;
  openConnectionModal: () => void;
  disconnect: () => Promise<void>;
  switchConnectionType: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: Props) => {
  const connectionDisclosure = useDisclosure();
  const { login, logout } = usePrivy();
  const { wallets } = useSolanaWallets();
  const { wallet, disconnect: disconnectWeb3Wallet } = useWeb3Wallet();
  const { setVisible } = useWalletModal();
  const [connectionType, setConnectionType] =
    React.useState<WalletConnectionType>(WalletConnectionType.Web2);

  const disconnect = useCallback(async () => {
    // Disconnect wallet
    logout();
    disconnectWeb3Wallet();
  }, [logout, disconnectWeb3Wallet]);

  const connect = useCallback(
    async (type: WalletConnectionType) => {
      // Connect to wallet
      if (type === WalletConnectionType.Web2) {
        login();
        setConnectionType(WalletConnectionType.Web2);
      } else {
        // Connect to web3 wallet
        setVisible(true);
        setConnectionType(WalletConnectionType.Web3);
      }
    },
    [disconnect, login, setVisible],
  );

  const switchConnectionType = useCallback(async () => {
    if (connectionType === WalletConnectionType.Web2) {
      if (wallet) {
        setConnectionType(WalletConnectionType.Web3);
      } else {
        connect(WalletConnectionType.Web3);
      }
    } else {
      if (wallets.length > 0) {
        setConnectionType(WalletConnectionType.Web2);
      } else {
        connect(WalletConnectionType.Web2);
      }
    }
  }, [connect, connectionType, wallet, wallets]);

  const address =
    connectionType === WalletConnectionType.Web2
      ? wallets[0]?.address
      : wallet?.adapter.publicKey?.toString();
  const adapter =
    connectionType === WalletConnectionType.Web2 ? wallets[0] : wallet?.adapter;

  const value = useMemo(
    () => ({
      address,
      adapter,
      connectionType,
      openConnectionModal: () => connectionDisclosure.onOpen(),
      disconnect,
      switchConnectionType,
    }),
    [
      address,
      adapter,
      connectionType,
      connectionDisclosure,
      disconnect,
      switchConnectionType,
    ],
  );

  return (
    <WalletContext.Provider value={value}>
      <WalletConnectionTypeModal
        isOpen={connectionDisclosure.isOpen}
        onOpenChange={connectionDisclosure.onOpenChange}
        connect={connect}
      />
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error(`useWallet must be used within a WalletProvider`);
  }
  return context;
}
