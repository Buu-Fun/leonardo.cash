'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/src/context/wallet.context';
import { Socials } from '@/src/components/Socials/Socials';
// import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function Page() {
  // Hooks
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { chain, address } = useAccount();
  const {
    loading,
    accounts,
    connectTwitterAccount,
    disconnectTwitterAccount,
    connectTelegramAccount,
    disconnectTelegramAccount,
  } = useWallet();
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
      <Button
        // startContent={<ChevronLeftIcon />}
        onPress={() => router.push('/platform')}
      >
        Back to platform
      </Button>
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
          connectTelegramAccount={connectTelegramAccount}
          disconnectTelegramAccount={disconnectTelegramAccount}
        />
      )}
    </main>
  );
}
