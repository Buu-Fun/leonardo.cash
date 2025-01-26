import React from 'react';
import styles from './Socials.module.css';
import { Button, User } from '@nextui-org/react';
import { Account } from '@/src/gql/types/graphql';

interface Props {
  loading: boolean;
  account: Account;
  address: string;
  connectTwitterAccount: (address: string) => Promise<void>;
  disconnectTwitterAccount: (address: string) => Promise<void>;
  connectTelegramAccount: (address: string) => Promise<void>;
  disconnectTelegramAccount: (address: string) => Promise<void>;
}

export const Socials = ({
  loading,
  account,
  address,
  connectTwitterAccount,
  disconnectTwitterAccount,
  connectTelegramAccount,
  disconnectTelegramAccount,
}: Props) => {
  return (
    <div className={styles.container}>
      <div className={styles.twitter}>
        <div className={styles.title}>Link your X account</div>
        {account?.twitterUsername && (
          <User
            avatarProps={{
              src: account.twitterAvatar || undefined,
            }}
            description={account.twitterUsername}
            name={account.twitterName}
          />
        )}

        {account?.twitterUsername && (
          <Button
            fullWidth
            disabled={loading}
            onPress={
              loading
                ? undefined
                : () => disconnectTwitterAccount(address as string)
            }
          >
            Disconnect
          </Button>
        )}

        {!account?.twitterUsername && (
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            onPress={
              loading
                ? undefined
                : () => connectTwitterAccount(address as string)
            }
          >
            Connect
          </Button>
        )}
      </div>
      <div className={styles.telegram}>
        <div className={styles.title}>Link your Telegram account</div>

        {account?.telegramUsername && (
          <User
            avatarProps={{
              src: account.telegramAvatar || undefined,
            }}
            description={account.telegramUsername}
            name={account.telegramName}
          />
        )}

        {account?.telegramUsername && (
          <Button
            fullWidth
            disabled={loading}
            onPress={
              loading
                ? undefined
                : () => disconnectTelegramAccount(address as string)
            }
          >
            Disconnect
          </Button>
        )}

        {!account?.telegramUsername && (
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            onPress={
              loading
                ? undefined
                : () => connectTelegramAccount(address as string)
            }
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
