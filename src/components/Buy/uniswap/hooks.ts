import type { Hex } from 'viem';
import type { Pool } from './pool';
import type { Quote } from './swap';

import { useCallback, useEffect, useState } from 'react';
import { getPoolDetails } from './pool';
import { getQuoteSingle, swapExactETHForTokens } from './swap';
import { useAccount, useClient, useWalletClient } from 'wagmi';

interface UsePoolResult {
  pool: Pool | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

interface UseQuoteResult {
  quote: Quote | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
}

export function usePool(address: Hex) {
  const [pool, setPool] = useState<Pool | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const client = useClient();

  const fetch = useCallback(async () => {
    if (!client || !address) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [details] = await getPoolDetails(client, [address]);
      setPool(details);
    } catch {
      setPool(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [client, address]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { pool, isLoading, refetch: fetch } as UsePoolResult;
}

export function useQuote(pool?: Pool, amount?: bigint) {
  const [quote, setQuote] = useState<Quote | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const client = useClient();

  const fetch = useCallback(async () => {
    if (!client || !pool || !amount) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const newQuote = await getQuoteSingle(client, 'in', pool, amount);
      setQuote(newQuote);
    } catch {
      setQuote(undefined);
    } finally {
      setIsLoading(false);
    }
  }, [client, pool, amount]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { quote, isLoading, refetch: fetch } as UseQuoteResult;
}

export function useSwap(pool?: Pool, amount?: bigint) {
  const client = useWalletClient();
  const [isLoading, setIsLoading] = useState(false);

  const swap = useCallback(async () => {
    if (!client.data || !client.data.account || !pool || !amount) return;

    try {
      setIsLoading(true);
      await swapExactETHForTokens(
        client.data,
        client.data.account,
        pool,
        amount,
      );
    } catch (e) {
      console.error('Failed to swap', e);
    }
    setIsLoading(false);
  }, [client, pool, amount]);

  return { swap, isLoading } as const;
}
