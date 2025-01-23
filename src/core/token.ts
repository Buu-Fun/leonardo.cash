import type { Abi, Client, Hex } from 'viem';

import { erc20Abi as abi } from 'viem';
import { multicall } from 'viem/actions';

export async function getTokenDetails(client: Client, addresses: Hex[]) {
  type Contract = { address: Hex; abi: Abi; functionName: string };
  const contracts = new Array<Contract>(addresses.length * 3);
  for (let i = 0, j = 0; i < addresses.length; i++, j += 3) {
    const address = addresses[i];
    contracts[j] = { address, abi, functionName: 'decimals' };
    contracts[j + 1] = { address, abi, functionName: 'symbol' };
    contracts[j + 2] = { address, abi, functionName: 'name' };
  }

  const results = await multicall(client, { contracts });

  type Detail = { decimals: number; symbol: string; name: string };

  const details = new Array<Detail>(addresses.length);
  for (let i = 0, j = 0; i < addresses.length; i++, j += 3) {
    details[i] = {
      decimals: results[j].result as number,
      symbol: results[j + 1].result as string,
      name: results[j + 2].result as string,
    };
  }

  return details;
}
