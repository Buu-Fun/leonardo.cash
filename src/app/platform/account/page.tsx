'use client';
import React from 'react';
import { Button } from '@nextui-org/react';
import { Socials } from '@/src/components/Socials/Socials';
import { useRouter } from 'next/navigation';
import { Id, toast } from 'react-toastify';
import { Toast } from '@/src/components/Toast/Toast';
import { useAuthentication } from '@/src/context/account.context';
import { useWallet } from '@/src/context/wallet.context';

export default function Page() {
  // Hooks
  const router = useRouter();

  const { address, openConnectionModal } = useWallet();
  const {
    account,
    loading,
    connectTwitterAccount,
    disconnectTwitterAccount,
    connectTelegramAccount,
    disconnectTelegramAccount,
  } = useAuthentication();
  const [, setUpdatingNotif] = React.useState<Id>();

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

  // useEffect(() => {
  //   if (updatingNotif) {
  //     const interval = setInterval(() => {
  //       fetchAccounts();
  //     }, 2000);

  //     const timeout = setTimeout(() => {
  //       clearInterval(interval);
  //       toast.dismiss(updatingNotif);
  //     }, 10000);

  //     return () => {
  //       clearInterval(interval);
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [updatingNotif, fetchAccounts]);

  // useEffect(() => {
  //   if (updatingNotif) {
  //     console.log('telegram id changed', account?.telegramId);
  //     toast.dismiss(updatingNotif);
  //   }
  // }, [account?.telegramId]);

  const chain = 'devnet';

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
          onPress={openConnectionModal}
          style={{
            width: '100%',
          }}
        >
          Connect wallet
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
