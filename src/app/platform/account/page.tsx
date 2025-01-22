'use client';
import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '@nextui-org/react';
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
import { useWallet } from '@/src/context/wallet.context';
import { Socials } from '@/src/components/Socials/Socials';
import { useRouter } from 'next/navigation';
import { Id, toast } from 'react-toastify';
import { Toast } from '@/src/components/Toast/Toast';

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
    fetchAccounts,
  } = useWallet();
  const account = address ? accounts[address as string] : undefined;
  const [updatingNotif, setUpdatingNotif] = React.useState<Id>();

  const handleTelegram =
    (fn: (a: string) => Promise<void>) => async (a: string) => {
      await fn(a);
      const notifId = toast.info(
        <Toast
          title="Telegram updating"
          description="Please wait until your account is updated"
        />,
        { autoClose: false },
      );
      setUpdatingNotif(notifId);
    };

  useEffect(() => {
    if (updatingNotif) {
      const interval = setInterval(() => {
        fetchAccounts();
      }, 2000);

      const timeout = setTimeout(() => {
        clearInterval(interval);
        toast.dismiss(updatingNotif);
      }, 10000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [updatingNotif, fetchAccounts]);

  useEffect(() => {
    if (updatingNotif) {
      console.log('telegram id changed', account?.telegramId);
      toast.dismiss(updatingNotif);
    }
  }, [account?.telegramId]);

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        gap: '20px',
      }}
    >
      <Button onPress={() => router.push('/platform')}>Back to platform</Button>
      {chain && !address && (
        <Button
          color="primary"
          onPress={openConnectModal}
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
          connectTelegramAccount={handleTelegram(connectTelegramAccount)}
          disconnectTelegramAccount={handleTelegram(disconnectTelegramAccount)}
        />
      )}
    </main>
  );
}
