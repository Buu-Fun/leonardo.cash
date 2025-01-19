'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Contract, ethers } from 'ethers';

import {
  ASSET_ADDRESS,
  ASSET_METADATA_DECIMALS,
  POOL_ADDRESS,
  USDC_ADDRESS,
  USDC_POOL_ADDRESS,
  WETH_ADDRESS,
} from '@/src/config';
import { useEthersProvider } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';

interface Props {
  children: React.ReactNode;
}

// Define the types for the context state
interface PriceState {
  price: number;
  wethPrice: number;
  fetchPrice: () => Promise<void>;
}

const PriceContext = createContext<PriceState>({
  price: 0,
  wethPrice: 0,
  fetchPrice: async () => {},
});

export const PriceProvider = ({ children }: Props) => {
  const provider = useEthersProvider();

  // State
  const [price, setPrice] = React.useState(0);
  const [wethPrice, setWETHPrice] = React.useState(0);

  const fetchPrice = useCallback(async () => {
    if (!provider) {
      setPrice(0);
      return;
    }
    const assetContract = new Contract(
      ASSET_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );
    const wethContract = new Contract(
      WETH_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );
    const usdcContract = new Contract(
      USDC_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );
    const [
      assetBalanceOfPool,
      wethBalanceOfPool,
      wethDecimals,
      wethInUsdcPool,
      usdcInUsdcPool,
      usdcDecimals,
    ] = await Promise.all([
      assetContract.balanceOf(POOL_ADDRESS),
      wethContract.balanceOf(POOL_ADDRESS),
      wethContract.decimals(),
      wethContract.balanceOf(USDC_POOL_ADDRESS),
      usdcContract.balanceOf(USDC_POOL_ADDRESS),
      usdcContract.decimals(),
    ]);

    const wethAmount = ethers.formatUnits(wethInUsdcPool, wethDecimals);
    const usdcAmount = ethers.formatUnits(usdcInUsdcPool, usdcDecimals);

    const wethPrice = parseFloat(usdcAmount) / parseFloat(wethAmount);

    const wethAmountInPool = ethers.formatUnits(
      wethBalanceOfPool,
      wethDecimals,
    );
    const assetAmountInPool = ethers.formatUnits(
      assetBalanceOfPool,
      parseInt(ASSET_METADATA_DECIMALS),
    );

    const price =
      (parseFloat(wethAmountInPool) / parseFloat(assetAmountInPool)) *
      wethPrice;
    setPrice(price);
    setWETHPrice(wethPrice);
  }, [provider]);

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
      wethPrice,
      price,
      fetchPrice,
    }),
    [wethPrice, price, fetchPrice],
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
