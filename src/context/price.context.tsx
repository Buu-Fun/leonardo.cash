'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Contract, ethers } from 'ethers';

import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { useEthersProvider } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import { getAddresses, NetworkNames } from '../addresses';
import { useAccount } from 'wagmi';

interface Props {
  children: React.ReactNode;
}

// Define the types for the context state
interface PriceState {
  price: number;
  fetchPrice: () => Promise<void>;
}

const PriceContext = createContext<PriceState>({
  price: 0,
  fetchPrice: async () => {},
});

export const PriceProvider = ({ children }: Props) => {
  const { chain } = useAccount();
  const provider = useEthersProvider();
  const addresses = getAddresses(chain?.id);
  const assetAddress = addresses.asset;
  const wethAddress = addresses.weth;
  const usdcAddress = addresses.usdc;
  const poolAddress = addresses.uniswapV3Pool;
  const usdcPoolAddress = addresses.usdcPool;

  // State
  const [price, setPrice] = React.useState(0);

  const fetchPrice = useCallback(async () => {
    if (!provider || !chain) {
      setPrice(0);
      return;
    }
    if (chain?.name === NetworkNames.Local) {
      setPrice(0.0008);
    }
    const assetContract = new Contract(
      assetAddress,
      IERC20Metadata.abi,
      provider,
    );
    const wethContract = new Contract(
      wethAddress,
      IERC20Metadata.abi,
      provider,
    );
    const usdcContract = new Contract(
      usdcAddress,
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
      assetContract.balanceOf(poolAddress),
      wethContract.balanceOf(poolAddress),
      wethContract.decimals(),
      wethContract.balanceOf(usdcPoolAddress),
      usdcContract.balanceOf(usdcPoolAddress),
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
  }, [chain, provider]);

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
      fetchPrice,
    }),
    [price, fetchPrice],
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
