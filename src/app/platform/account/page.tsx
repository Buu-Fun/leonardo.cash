'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/src/context/wallet.context';
import { Socials } from '@/src/components/Socials/Socials';

export default function Page() {
  // Hooks
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { chain, address } = useAccount();
  const { loading, accounts, connectTwitterAccount, disconnectTwitterAccount } =
    useWallet();
  const account = address ? accounts[address as string] : undefined;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        gap: '20px',
      }}
    >
      {chain && !address && (
        <Button
          color="primary"
          onPressStart={openConnectModal}
          style={{
            width: '100%',
          }}
        >
          Connect wallet
        </Button>
      )}

      {!chain && address && (
        <Button
          color="danger"
          onPressStart={openChainModal}
          onClick={openChainModal}
          style={{
            width: '100%',
            background: 'var(--danger-color)',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Wrong network
        </Button>
      )}

      {account && (
        <Socials
          loading={loading}
          account={account}
          address={address as string}
          connectTwitterAccount={connectTwitterAccount}
          disconnectTwitterAccount={disconnectTwitterAccount}
        />
      )}
    </main>
  );
}
