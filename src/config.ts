const {
  NODE_ENV = 'development',
  ASSET_METADATA_NAME = 'LEONARDO by Virtuals',
  ASSET_METADATA_SYMBOL = 'LEONAI',
  ASSET_METADATA_DECIMALS = '18',
  ASSET_SEPOLIA_ADDRESS = '0x4c4236Cc1CAFfC09AB830c85C4B2ECFD72239e8A',
  ASSET_BASE_ADDRESS = '0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f',
  STAKING_SEPOLIA_ADDRESS = '0x59E20e8351A7877565427b974406C82f09041E74',
  STAKING_BASE_ADDRESS = '',
  NEXT_PUBLIC_PONDER_URL = 'http://localhost:42069',
} = process.env;

let ASSET_ADDRESS = ASSET_SEPOLIA_ADDRESS;
let STAKING_ADDRESS = STAKING_SEPOLIA_ADDRESS;

if (NODE_ENV === 'production') {
  ASSET_ADDRESS = ASSET_BASE_ADDRESS;
  STAKING_ADDRESS = STAKING_BASE_ADDRESS;
}

export {
  NODE_ENV,
  ASSET_METADATA_NAME,
  ASSET_METADATA_SYMBOL,
  ASSET_METADATA_DECIMALS,
  ASSET_ADDRESS,
  STAKING_ADDRESS,
  NEXT_PUBLIC_PONDER_URL,
};
