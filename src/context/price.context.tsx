'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useAccount } from 'wagmi';
import { defaultChain } from '../wagmi';
import { BIRDEYE_API_KEY } from '../config';
import { Chain } from '@rainbow-me/rainbowkit';
import { getAddresses } from '../addresses';

interface Props {
  children: React.ReactNode;
}

// Define the types for the context state
interface PriceState {
  price: number;
  priceChange24h: number;
  fetchPrice: () => Promise<void>;
}

const PriceContext = createContext<PriceState>({
  price: 0,
  priceChange24h: 0,
  fetchPrice: async () => {},
});

export const PriceProvider = ({ children }: Props) => {
  const { chain: accountChain } = useAccount();
  const chain = accountChain || (defaultChain as Chain);
  const addresses = getAddresses(chain?.id);
  const assetAddress = addresses.asset;

  // State
  const [price, setPrice] = React.useState(0);
  const [priceChange24h, setPriceChange24h] = React.useState(0);

  const fetchPrice = useCallback(async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-chain': chain.name,
        'X-API-KEY': BIRDEYE_API_KEY,
      },
    } as RequestInit;

    const response = await fetch(
      `https://public-api.birdeye.so/defi/price?address=${assetAddress}`,
      options,
    );
    const data = (await response.json()) as {
      data: {
        value: number;
        updateUnixTime: number;
        updateHumanTime: string;
        priceChange24h: number;
      };
    };
    setPrice(data.data.value);
    setPriceChange24h(data.data.priceChange24h);
  }, [chain, assetAddress]);

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(() => {
      fetchPrice();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPrice]);

  // Memoize the context value
  const value = useMemo<PriceState>(
    () => ({
      price,
      priceChange24h,
      fetchPrice,
    }),
    [price, priceChange24h, fetchPrice],
  );

  return (
    <PriceContext.Provider value={value}>{children}</PriceContext.Provider>
  );
};

export function usePrice() {
  const context = useContext(PriceContext);
  if (context === undefined) {
    throw new Error(`usePrice must be used within a PriceProvider`);
  }
  return context;
}
