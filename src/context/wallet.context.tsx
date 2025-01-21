'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useAccountEffect, useDisconnect } from 'wagmi';
import { serverRequest } from '../gql/client';
import {
  LoginAuthMutation,
  LoginChallengeMutation,
  LoginRefreshMutation,
} from '../gql/documents/server';
import { LoginAuth } from '../gql/types/graphql';
import { useEthersSigner } from '../utils/ethersAdapter';
import { ethers } from 'ethers';

interface Props {
  children: React.ReactNode;
}

interface WalletContextType {
  accessTokens: Authenticated;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface Authenticated {
  [key: string]: string;
}

export const WalletProvider = ({ children }: Props) => {
  const signer = useEthersSigner();
  const [accessTokens, setAccessTokens] = React.useState<Authenticated>({});
  const { disconnect } = useDisconnect();

  const authenticate = async (signer: ethers.Signer) => {
    try {
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
    }
  };

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

  const value = useMemo(() => ({ accessTokens }), [accessTokens]);

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
