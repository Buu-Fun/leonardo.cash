import type { Account, Client, Hex, WalletClient } from 'viem';
import type { Pool } from './pool';

import { encodeFunctionData, decodeFunctionResult } from 'viem';
import { call, sendTransaction, waitForTransactionReceipt } from 'viem/actions';

import { IUniswapV3QuoterV2ABI, ISwapRouterABI } from './abi';

const QUOTER = '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a' as const;
const ROUTER = '0x2626664c2603336E57B271c5C0b26F421741e481' as const;

type Mode = 'in' | 'out';

function encodePath(tokens: Hex[], fees: number[], mode: Mode) {
  let path = '0x';
  tokens = mode === 'in' ? tokens : tokens.toReversed();
  fees = mode === 'in' ? fees : fees.toReversed();
  for (let i = 0; i < tokens.length - 1; i++) {
    path += tokens[i].slice(2).padStart(40, '0'); // Token address
    path += fees[i].toString(16).padStart(6, '0'); // Fee
  }
  path += tokens[tokens.length - 1].slice(2).padStart(40, '0'); // Last token address
  return path as Hex;
}

async function getQuote(client: Client, mode: Mode, path: Hex, amount: bigint) {
  const address = QUOTER as Hex;
  const abi = IUniswapV3QuoterV2ABI;
  const functionName = mode === 'in' ? 'quoteExactInput' : 'quoteExactOutput';
  const data = encodeFunctionData({ abi, functionName, args: [path, amount] });
  const result = await call(client, { to: address, data: data });
  if (!result.data) return;
  const decoded = decodeFunctionResult({
    abi,
    functionName,
    data: result.data,
  }) as any;
  return {
    amount: decoded[0] as bigint,
    after: decoded[1] as bigint[],
    ticks: decoded[2] as number[],
    gas: decoded[3] as bigint,
  };
}

export type Quote = {
  amount: bigint;
  after: bigint;
  tick: number;
  gas: bigint;
};

export async function getQuoteSingle(
  client: Client,
  mode: Mode,
  pool: Pool,
  amount: bigint,
) {
  const isIn = mode === 'in';
  const address = QUOTER;
  const abi = IUniswapV3QuoterV2ABI;
  const functionName = isIn
    ? 'quoteExactInputSingle'
    : 'quoteExactOutputSingle';

  const [tokenIn, tokenOut] = pool.tokens;
  const parmas = {
    tokenIn,
    tokenOut,
    [isIn ? 'amountIn' : 'amountIn']: amount,
    fee: pool.fee,
    sqrtPriceLimitX96: 0,
  };

  //@ts-expect-error TODO: Fix this
  const data = encodeFunctionData({ abi, functionName, args: [parmas] });
  const result = await call(client, { to: address, data: data });
  if (!result.data) return;
  const decoded = decodeFunctionResult({
    abi,
    functionName,
    data: result.data,
  }) as any;
  return {
    amount: decoded[0] as bigint,
    after: decoded[1] as bigint,
    tick: decoded[2] as number,
    gas: decoded[3] as bigint,
  };
}

export async function swapExactETHForTokens(
  client: WalletClient,
  account: Account,
  pool: Pool,
  amount: bigint,
  slippage: number = 0.005,
) {
  const path = encodePath(pool.tokens, [pool.fee], 'in');
  const quote = await getQuote(client, 'in', path, amount);
  if (!quote) throw new Error('Failed to get quote');
  const min = (quote.amount * BigInt((1 - slippage) * 1e6)) / BigInt(1e6);
  // const deadline = Math.floor(Date.now() / 1000) + 1800;

  const params = {
    path,
    recipient: account.address,
    amountIn: amount,
    amountOutMinimum: min,
  };

  const data = encodeFunctionData({
    abi: ISwapRouterABI,
    functionName: 'exactInput',
    args: [params],
  });

  const hash = await sendTransaction(client, {
    chain: client.chain,
    account,
    to: ROUTER,
    data,
    value: amount,
  });

  return waitForTransactionReceipt(client, { hash });
}
