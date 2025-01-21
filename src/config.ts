import { getAddresses, NetworkNames } from './addresses';

const NEXT_PUBLIC_CHAIN = process.env.NEXT_PUBLIC_CHAIN || NetworkNames.Local;
const NEXT_PUBLIC_ASSET_METADATA_NAME =
  process.env.NEXT_PUBLIC_ASSET_METADATA_NAME || 'LEONARDO by Virtuals';
const NEXT_PUBLIC_ASSET_METADATA_SYMBOL =
  process.env.NEXT_PUBLIC_ASSET_METADATA_SYMBOL || 'LEONAI';
const NEXT_PUBLIC_ASSET_METADATA_DECIMALS =
  process.env.NEXT_PUBLIC_ASSET_METADATA_DECIMALS || '18';
const NEXT_PUBLIC_PONDER_URL =
  process.env.NEXT_PUBLIC_PONDER_URL || 'http://localhost:42069';
const NEXT_PUBLIC_SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000/graphql';

const NEXT_PUBLIC_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
const NEXT_PUBLIC_WALLETCONNECT_API_KEY =
  process.env.NEXT_PUBLIC_WALLETCONNECT_API_KEY;
const NEXT_PUBLIC_BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY;
const NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY =
  process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || 'refreshToken';

const CHAIN = NEXT_PUBLIC_CHAIN;
const ASSET_METADATA_NAME = NEXT_PUBLIC_ASSET_METADATA_NAME;
const ASSET_METADATA_SYMBOL = NEXT_PUBLIC_ASSET_METADATA_SYMBOL;
const ASSET_METADATA_DECIMALS = NEXT_PUBLIC_ASSET_METADATA_DECIMALS;
const PONDER_URL = NEXT_PUBLIC_PONDER_URL;
const SERVER_URL = NEXT_PUBLIC_SERVER_URL;
const ALCHEMY_API_KEY = NEXT_PUBLIC_ALCHEMY_API_KEY;
const WALLETCONNECT_API_KEY = NEXT_PUBLIC_WALLETCONNECT_API_KEY;
const BIRDEYE_API_KEY = NEXT_PUBLIC_BIRDEYE_API_KEY;
const REFRESH_TOKEN_COOKIE_KEY = NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_KEY;

const Addresses = getAddresses(CHAIN as NetworkNames);

const ASSET_ADDRESS = Addresses.asset;
const STAKING_ADDRESS = Addresses.staking;
const REWARDS_ADDRESS = Addresses.rewards;
const USDC_ADDRESS = Addresses.usdc;
const WETH_ADDRESS = Addresses.weth;
const POOL_ADDRESS = Addresses.uniswapV3Pool;
const USDC_POOL_ADDRESS = Addresses.usdcPool;

export {
  CHAIN,
  ASSET_METADATA_NAME,
  ASSET_METADATA_SYMBOL,
  ASSET_METADATA_DECIMALS,
  ASSET_ADDRESS,
  STAKING_ADDRESS,
  REWARDS_ADDRESS,
  USDC_ADDRESS,
  POOL_ADDRESS,
  WETH_ADDRESS,
  USDC_POOL_ADDRESS,
  PONDER_URL,
  SERVER_URL,
  ALCHEMY_API_KEY,
  WALLETCONNECT_API_KEY,
  BIRDEYE_API_KEY,
  REFRESH_TOKEN_COOKIE_KEY,
};
