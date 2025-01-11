import IERC20Metadata from '@/src/constants/abi/IERC20Metadata.json';
import { ethers } from 'ethers';
import { useState, useCallback, useEffect, useMemo } from 'react';
import useDelayedExecution from './useDelayedExecution';
import { useChain } from '../context/chain.context';
import { SupportedChain } from '../chains';

interface Props {
  chain: SupportedChain;
  address: string;
  account?: string;
  spender?: string;
}

export type Token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
};

export type TokenData = Token & {
  balance: bigint;
  allowance: bigint;
  fetchingBalance: boolean;
  fetchingMetadata: boolean;
  fetchingAllowance: boolean;
};

export const useToken = ({
  chain,
  address,
  account,
  spender,
}: Props): TokenData => {
  const { blockNumbers } = useChain();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(0);
  const [balance, setBalance] = useState(0n);
  const [allowance, setAllowance] = useState(0n);
  const [fetchingBalance, setFetchingBalance] = useState(false);
  const [fetchingMetadata, setFetchingMetadata] = useState(true);
  const [fetchingAllowance, setFetchingAllowance] = useState(false);

  const provider = useMemo(
    () => new ethers.JsonRpcProvider(chain.chain.rpcUrls.default.http[0]),
    [chain],
  );
  const blockNumber = blockNumbers[chain.label] || 0;

  // Fetch metadata, run once on mount or when address or provider changes
  const fetchMetadata = useCallback(async () => {
    if (!address) return;
    try {
      setFetchingMetadata(true);
      const contract = new ethers.Contract(
        address,
        IERC20Metadata.abi,
        provider,
      );
      const [decimals, symbol, name] = await Promise.all([
        contract.decimals(),
        contract.symbol(),
        contract.name(),
      ]);
      setDecimals(decimals);
      setSymbol(symbol);
      setName(name);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    } finally {
      setFetchingMetadata(false);
    }
  }, [address, provider]);

  // Fetch balance with debounce
  const fetchBalance = useCallback(async () => {
    if (!address || !account) return;
    try {
      setFetchingBalance(true);
      const contract = new ethers.Contract(
        address,
        IERC20Metadata.abi,
        provider,
      );
      const balance = await contract.balanceOf(account);
      setBalance(balance);
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      setFetchingBalance(false);
    }
  }, [address, account, provider]);

  // Fetch allowance with debounce
  const fetchAllowance = useCallback(async () => {
    if (!address || !account || !spender) return;
    try {
      setFetchingAllowance(true);
      const contract = new ethers.Contract(
        address,
        IERC20Metadata.abi,
        provider,
      );
      const allowance = await contract.allowance(account, spender);
      setAllowance(allowance);
    } catch (error) {
      console.error('Failed to fetch allowance:', error);
    } finally {
      setFetchingAllowance(false);
    }
  }, [address, account, spender, provider]);

  useDelayedExecution(fetchMetadata, [fetchMetadata], 100);
  useDelayedExecution(fetchBalance, [fetchBalance, blockNumber], 100);
  useDelayedExecution(fetchAllowance, [fetchAllowance, blockNumber], 100);

  const value = useMemo(
    () => ({
      chainId: chain.chain.id,
      address,
      name,
      symbol,
      decimals,
      balance,
      allowance,
      fetchingBalance,
      fetchingMetadata,
      fetchingAllowance,
    }),
    [
      chain,
      address,
      name,
      symbol,
      decimals,
      balance,
      allowance,
      fetchingBalance,
      fetchingMetadata,
      fetchingAllowance,
    ],
  );

  useEffect(() => {
    console.log('useToken value:', value);
  }, [value]);

  return value;
};

export default useToken;
