'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';

export default function Page() {
  // Hooks
  const { openConnectModal } = useConnectModal();
  const { openChainModal } = useChainModal();
  const { chain, address } = useAccount();
  // const signer = useEthersSigner();

  // const { accessTokens } = useWallet();

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
    </main>
  );
}
