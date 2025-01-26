import { useCallback, useEffect, useState } from 'react';
import { useClient } from 'wagmi';

import { getQuoteSingle, Quote } from '@/src/core/uniswap/swap';
import { Pool } from '@/src/core/uniswap/pool';

interface UseQuoteResult {
  quote: Quote | undefined;
  isLoading: boolean;
  refetch: () => Promise<void>;
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
