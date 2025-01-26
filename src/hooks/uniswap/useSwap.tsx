import { useCallback, useState } from 'react';
import { useWalletClient } from 'wagmi';

import { Pool } from '@/src/core/uniswap/pool';
import { swapExactETHForTokens } from '@/src/core/uniswap/swap';

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
