import { useCallback, useEffect, useState } from 'react';
import { Hex } from 'viem';
import { useClient } from 'wagmi';

import { getPoolDetails, Pool } from '@/src/core/uniswap/pool';

interface UsePoolResult {
  pool: Pool | undefined;
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
