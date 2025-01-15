import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base as Base, sepolia as Sepolia } from 'wagmi/chains';
import { CHAIN, ALCHEMY_API_KEY, WALLETCONNECT_API_KEY } from './config';

let sepolia = Sepolia;
let base = Base;

if (ALCHEMY_API_KEY) {
  const sepoliaAlchemyRpcUrl = `https://https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  const baseAlchemyRpcUrl = `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
  sepolia = {
    ...Sepolia,
    rpcUrls: {
      ...Sepolia.rpcUrls,
      default: {
        http: [sepoliaAlchemyRpcUrl as any],
      },
    },
  };
  base = {
    ...Base,
    rpcUrls: {
      ...Base.rpcUrls,
      default: {
        http: [baseAlchemyRpcUrl as any],
      },
    },
  };
}
const config = getDefaultConfig({
  appName: 'Leonardo AI',
  projectId: WALLETCONNECT_API_KEY as string,
  chains: CHAIN === 'base' ? [base] : [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;
