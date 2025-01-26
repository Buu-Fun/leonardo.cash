import { Client, Hex } from 'viem';
import { multicall } from 'viem/actions';
import { abi } from '@/src/abis/uniswap/IUniswapV3Pool.json';

const Q96 = 2n ** 96n;
const E18 = 10n ** 18n;

export type Pool = {
  fee: number;
  liquidity: bigint;
  slot0: [bigint, number];
  tokens: [Hex, Hex];
};

export async function getPoolDetails(client: Client, addresses: Hex[]) {
  type Contract = { address: Hex; abi: typeof abi; functionName: string };
  const contracts = new Array<Contract>(addresses.length * 5);

  for (let i = 0, j = 0; i < addresses.length; i++, j += 5) {
    const address = addresses[i];
    contracts[j] = { address, abi, functionName: 'fee' };
    contracts[j + 1] = { address, abi, functionName: 'liquidity' };
    contracts[j + 2] = { address, abi, functionName: 'slot0' };
    contracts[j + 3] = { address, abi, functionName: 'token0' };
    contracts[j + 4] = { address, abi, functionName: 'token1' };
  }

  //@ts-expect-error TODO: Fix ABI type
  const results = await multicall(client, { contracts });

  const details = new Array<Pool>(addresses.length);
  for (let i = 0, j = 0; i < addresses.length; i++, j += 5) {
    details[i] = {
      fee: results[j].result as number,
      liquidity: results[j + 1].result as bigint,
      slot0: results[j + 2].result as [bigint, number],
      tokens: [results[j + 3].result, results[j + 4].result] as [Hex, Hex],
    };
  }

  return details;
}

export function getTokenPrices(pool: Pool, decimals: [number, number]) {
  const squared = pool.slot0[0] ** 2n / Q96 ** 2n;
  const adjustment = [10n ** BigInt(decimals[0]), 10n ** BigInt(decimals[1])];

  return [
    (E18 * squared * adjustment[0]) / adjustment[1],
    (E18 * adjustment[1]) / (squared * adjustment[0]),
  ];
}
