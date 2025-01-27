'use client';
import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useAccount, useAccountEffect, useDisconnect } from 'wagmi';
import { serverRequest } from '../gql/client';
import {
  DisconnectTelegram,
  DisconnectTwitter,
  Me,
  LoginAuthMutation,
  LoginChallengeMutation,
  LoginRefreshMutation,
  LinkSolanaRequest,
  LinkSolanaVerify,
  UnlinkSolana,
} from '../gql/documents/server';
import { Account, LoginAuth } from '../gql/types/graphql';
import { useEthersSigner } from '../utils/ethersAdapter';
import { ethers } from 'ethers';
import { SERVER_URL, TELEGRAM_AUTH_BOT_HANDLE } from '../config';
import {
  useWallet as useSolanaWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import bs58 from 'bs58';

interface Props {
  children: React.ReactNode;
}

interface WalletContextType {
  loading: boolean;
  accounts: { [key: string]: Account };
  solanaWallet: WalletContextState;
  fetchAccount: (account: string) => Promise<Account | undefined>;
  fetchAccounts: () => Promise<void>;
  getAccessToken: (account: string) => string | null;
  connectTwitterAccount: (account: string) => Promise<void>;
  disconnectTwitterAccount: (account: string) => Promise<void>;
  connectTelegramAccount: (account: string) => Promise<void>;
  disconnectTelegramAccount: (account: string) => Promise<void>;
  verifySolana: () => Promise<void>;
  unlinkSolana: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: Props) => {
  const solanaWallet = useSolanaWallet();
  const solanaWalletAddress = solanaWallet.publicKey?.toString();

  const { address, addresses } = useAccount();
  const signer = useEthersSigner();
  const [loading, setLoading] = React.useState(true);
  const { disconnect } = useDisconnect();
  const [accounts, setAccounts] = React.useState<{ [key: string]: Account }>(
    {},
  );

  const getAccessTokenKeys = () => {
    const value = localStorage.getItem('x-accessToken-keys');
    if (value) {
      return JSON.parse(value) as string[];
    }
    return [];
  };

  const getAccessTokenKey = (account: string) => `x-accessToken-${account}`;

  const getAccessToken = (account: string) => {
    const value = localStorage.getItem(getAccessTokenKey(account));
    if (value) {
      return JSON.parse(value) as string;
    }
    return null;
  };

  const authenticate = async (signer: ethers.Signer) => {
    try {
      setLoading(true);
      const address = await signer.getAddress();
      const accessToken = getAccessToken(address);
      if (accessToken) {
        const { loginRefresh } = (await serverRequest(
          LoginRefreshMutation,
          {
            input: {
              account: address,
            },
          },
          {
            Authorization: `Bearer ${getAccessToken(address)}`,
          },
        )) as { loginRefresh: LoginAuth | null };

        if (loginRefresh && loginRefresh.token) {
          localStorage.setItem(
            getAccessTokenKey(address),
            JSON.stringify(loginRefresh.token),
          );
          const accessTokenKeys = getAccessTokenKeys();
          const accessTokenKey = getAccessTokenKey(address);
          if (!accessTokenKeys.includes(accessTokenKey)) {
            localStorage.setItem(
              'x-accessToken-keys',
              JSON.stringify([...accessTokenKeys, accessTokenKey]),
            );
          }
          return;
        }
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
            localStorage.setItem(
              getAccessTokenKey(address),
              JSON.stringify(loginAuth.token),
            );
            const accessTokenKeys = getAccessTokenKeys();
            const accessTokenKey = getAccessTokenKey(address);
            if (!accessTokenKeys.includes(accessTokenKey)) {
              localStorage.setItem(
                'x-accessToken-keys',
                JSON.stringify([...accessTokenKeys, accessTokenKey]),
              );
            }
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
      fetchAccounts();
    }
  };

  const fetchAccount = async (account: string) => {
    if (accounts[account]) {
      return accounts[account];
    }
    const accessToken = getAccessToken(account);
    if (!accessToken) return;
    const response = await serverRequest(
      Me,
      {},
      {
        Authorization: `Bearer ${accessToken}`,
      },
    );
    return response.me;
  };

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    if (!addresses || addresses.length === 0) {
      setLoading(false);
      return;
    }
    const innerAccounts = (
      await Promise.all(
        addresses.map((account) => fetchAccount(account as string)),
      )
    ).filter((account) => account) as Account[];
    const newAccounts = innerAccounts.reduce(
      (acc, account) => {
        acc[account.address] = account;
        return acc;
      },
      {} as { [key: string]: Account },
    );
    setAccounts(newAccounts);
    setLoading(false);
  }, [addresses]);

  const connectTwitterAccount = useCallback(async (account: string) => {
    const accessToken = getAccessToken(account);
    if (!accessToken) return;
    const token = encodeURIComponent(accessToken);
    const url = `${SERVER_URL}/accounts/auth/twitter?token=${token}`;
    window.location.href = url; // Redirige al backend
  }, []);

  const disconnectTwitterAccount = useCallback(
    async (account: string) => {
      await serverRequest(
        DisconnectTwitter,
        {},
        {
          Authorization: `Bearer ${getAccessToken(account)}`,
        },
      );
      await fetchAccounts();
    },
    [fetchAccounts],
  );

  const connectTelegramAccount = useCallback(async (account: string) => {
    const text = `Hey!\n\nPlease link my wallet ${account} to my Telegram account.\n\nMy verification code is:\n\n$${getAccessToken(account)}$\n\nThanks!`;
    const url = `https://t.me/${TELEGRAM_AUTH_BOT_HANDLE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }, []);

  const disconnectTelegramAccount = useCallback(
    async (account: string) => {
      await serverRequest(
        DisconnectTelegram,
        {},
        {
          Authorization: `Bearer ${getAccessToken(account)}`,
        },
      );
      await fetchAccounts();
    },
    [fetchAccounts],
  );

  const verifySolana = useCallback(async () => {
    try {
      if (!solanaWallet.signMessage || !solanaWallet || !address) {
        return;
      }
      const { linkSolanaRequest } = await serverRequest(
        LinkSolanaRequest,
        {
          pubKey: solanaWalletAddress,
        },
        {
          Authorization: `Bearer ${getAccessToken(address)}`,
        },
      );

      if (linkSolanaRequest?.message) {
        const encodedMessage = new TextEncoder().encode(
          linkSolanaRequest.message,
        );
        const signedMessage = await solanaWallet.signMessage(encodedMessage);
        const signature = bs58.encode(signedMessage);

        const { linkSolanaVerify } = await serverRequest(
          LinkSolanaVerify,
          {
            signature,
          },
          {
            Authorization: `Bearer ${getAccessToken(address)}`,
          },
        );
        if (!linkSolanaVerify) {
          console.error('error verifying solana');
          return;
        }
        fetchAccounts();
      }
    } catch (e) {
      console.error('error', e);
    }
  }, [solanaWallet.signMessage, solanaWalletAddress, address, fetchAccounts]);

  const unlinkSolana = useCallback(async () => {
    if (!address) return;
    await serverRequest(
      UnlinkSolana,
      {},
      {
        Authorization: `Bearer ${getAccessToken(address)}`,
      },
    );
    await fetchAccounts();
  }, [address, fetchAccounts]);

  useAccountEffect({
    onDisconnect() {
      const accessTokenKeys = getAccessTokenKeys();
      accessTokenKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
      localStorage.removeItem('x-accessToken-keys');
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
  }, [fetchAccounts]);

  const value = useMemo(
    () => ({
      loading,
      accounts,
      solanaWallet,
      fetchAccount,
      fetchAccounts,
      getAccessToken,
      connectTwitterAccount,
      disconnectTwitterAccount,
      connectTelegramAccount,
      disconnectTelegramAccount,
      verifySolana,
      unlinkSolana,
    }),
    [
      loading,
      accounts,
      solanaWallet,
      fetchAccount,
      fetchAccounts,
      getAccessToken,
      connectTwitterAccount,
      disconnectTwitterAccount,
      connectTelegramAccount,
      disconnectTelegramAccount,
      verifySolana,
      unlinkSolana,
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
