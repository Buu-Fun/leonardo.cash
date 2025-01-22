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
}

export const Socials = ({
  loading,
  account,
  address,
  connectTwitterAccount,
  disconnectTwitterAccount,
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
            disabled={loading}
            onPressStart={
              loading
                ? undefined
                : () => disconnectTwitterAccount(address as string)
            }
          >
            Disconnect Twitter
          </Button>
        )}

        {!account?.twitterUsername && (
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            onPressStart={
              loading
                ? undefined
                : () => connectTwitterAccount(address as string)
            }
          >
            Connect Twitter
          </Button>
        )}
      </div>
    </div>
  );
};
