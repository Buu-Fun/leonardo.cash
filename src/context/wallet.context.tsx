'use client';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAccountEffect, useDisconnect } from 'wagmi';
import { serverRequest } from '../gql/client';
import {
  DisconnectTwitter,
  GetMyAccount,
  LoginAuthMutation,
  LoginChallengeMutation,
  LoginRefreshMutation,
} from '../gql/documents/server';
import { Account, LoginAuth } from '../gql/types/graphql';
import { useEthersSigner } from '../utils/ethersAdapter';
import { ethers } from 'ethers';

interface Props {
  children: React.ReactNode;
}

interface WalletContextType {
  loading: boolean;
  accounts: { [key: string]: Account };
  accessTokens: Authenticated;
  connectTwitterAccount: (account: string) => Promise<void>;
  disconnectTwitterAccount: (account: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface Authenticated {
  [key: string]: string;
}

export const WalletProvider = ({ children }: Props) => {
  const signer = useEthersSigner();
  const [loading, setLoading] = React.useState(true);
  const [accessTokens, setAccessTokens] = React.useState<Authenticated>({});
  const { disconnect } = useDisconnect();
  const [accounts, setAccounts] = React.useState<{ [key: string]: Account }>(
    {},
  );

  const authenticate = async (signer: ethers.Signer) => {
    try {
      setLoading(true);
      const address = await signer.getAddress();
      const { loginRefresh } = (await serverRequest(LoginRefreshMutation, {
        input: {
          account: address,
        },
      })) as { loginRefresh: LoginAuth | null };

      if (loginRefresh && loginRefresh.token) {
        setAccessTokens((prev) => ({
          ...prev,
          [address]: loginRefresh.token,
        }));
        return;
      }

      const { loginChallenge } = await serverRequest(LoginChallengeMutation, {
        account: address,
      });

      if (loginChallenge) {
        const signature = await signer.signTypedData(
          loginChallenge.domain,
          loginChallenge.types,
          loginChallenge.value,
        );

        if (signature) {
          const { loginAuth } = (await serverRequest(LoginAuthMutation, {
            input: {
              account: address,
              signature,
            },
          })) as { loginAuth: LoginAuth | null };

          if (loginAuth && loginAuth.token) {
            setAccessTokens((prev) => ({
              ...prev,
              [address]: loginAuth.token,
            }));
          } else {
            disconnect();
          }
        } else {
          disconnect();
        }
      }
    } catch (error: unknown) {
      console.error('Authentication error:', error);
      disconnect();
    } finally {
      setLoading(false);
    }
  };

  const fetchAccount = async (account: string, accessToken: string) => {
    if (accounts[account]) {
      return accounts[account];
    }
    const response = await serverRequest(
      GetMyAccount,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
    return response.getMyAccount;
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    const accounts = (await Promise.all(
      Object.entries(accessTokens).map(([account, accessToken]) =>
        fetchAccount(account, accessToken),
      ),
    )) as Account[];
    const newAccounts = accounts.reduce(
      (acc, account) => {
        acc[account.address] = account;
        return acc;
      },
      {} as { [key: string]: Account },
    );
    setAccounts(newAccounts);
    setLoading(false);
  }, [accessTokens]);

  const connectTwitterAccount = useCallback(
    async (account: string) => {
      const token = encodeURIComponent(accessTokens[account]); // Codifica el token para evitar problemas con caracteres especiales
      const url = `http://localhost:4003/auth/twitter?token=${token}`;
      window.location.href = url; // Redirige al backend
    },
    [accessTokens],
  );

  const disconnectTwitterAccount = useCallback(
    async (account: string) => {
      await serverRequest(
        DisconnectTwitter,
        {},
        {
          Authorization: `Bearer ${accessTokens[account]}`,
        },
      );
      await fetchAccounts();
    },
    [accessTokens],
  );

  useAccountEffect({
    onDisconnect() {
      setAccessTokens({});
    },
  });

  React.useEffect(() => {
    if (!signer) return;
    authenticate(signer);
    const interval = setInterval(
      async () => authenticate(signer),
      1000 * 60 * 5, // Review: refresh before expiration of token (tokenExpiry)
    ); // 5 minutes
    // const interval = setInterval(authenticate, 1000 * 10); // 10 seconds
    return () => clearInterval(interval);
  }, [signer]);

  React.useEffect(() => {
    fetchAccounts();
  }, [accessTokens]);

  const value = useMemo(
    () => ({
      loading,
      accounts,
      accessTokens,
      connectTwitterAccount,
      disconnectTwitterAccount,
    }),
    [
      loading,
      accounts,
      accessTokens,
      connectTwitterAccount,
      disconnectTwitterAccount,
    ],
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error(`useWallet must be used within a WalletProvider`);
  }
  return context;
}
