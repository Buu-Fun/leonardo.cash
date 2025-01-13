'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useAccount, useBlockNumber } from 'wagmi';
import { Contract, ethers } from 'ethers';
import { base, sepolia as Sepolia } from 'wagmi/chains';

import {
  ASSET_ADDRESS,
  ASSET_METADATA_DECIMALS,
  CHAIN,
  POOL_ADDRESS,
  STAKING_ADDRESS,
  USDC_ADDRESS,
} from '@/src/config';
import { useEthersProvider } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import IERC4626 from '@/src/abis/IERC4626.json';
import { ponderRequest } from '@/src/gql/client';
import {
  GetStakers,
  GetStakingRewardGlobals,
  GetStakingRewards,
} from '@/src/gql/documents/ponder';
import {
  Staker,
  StakingReward,
  StakingRewardGlobal,
} from '@/src/gql/types/graphql';

export type StakerWithAssets = Staker & { assets: bigint };

interface Props {
  children: React.ReactNode;
}

// Define the types for the context state
interface StakingState {
  assetBalance: bigint;
  stakingAllowance: bigint;
  sharesBalance: bigint;
  topStakers: StakerWithAssets[];
  lastBalance: bigint;
  price: number;
  stakingBalance: bigint;
  staker?: StakerWithAssets;
  stakingReward?: StakingReward;
  stakingRewardGlobal?: StakingRewardGlobal;
  fetchAll: () => Promise<void>;
}

const nTopStakers = 100;

// const mockLeaderBoard = (staker: StakerWithAssets, n: number) => {
//   const mockedStaker = {
//     ...staker,
//     balance: 123n * 10n ** 18n,
//     address: ethers.ZeroAddress,
//   } as StakerWithAssets;
//   const mock = [mockedStaker]
//     .concat(staker)
//     .concat(Array(n - 2).fill(mockedStaker));
//   return mock;
// };

const StakingContext = createContext<StakingState>({
  assetBalance: 0n,
  stakingAllowance: 0n,
  sharesBalance: 0n,
  topStakers: [],
  lastBalance: 0n,
  price: 0,
  stakingBalance: 0n,
  staker: undefined,
  stakingReward: undefined,
  stakingRewardGlobal: undefined,
  fetchAll: async () => {},
});

export const StakingProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const blockNumber = useBlockNumber();
  const provider = useEthersProvider();

  // State
  const [topStakers, setTopStakers] = React.useState<StakerWithAssets[]>([]);
  const [processedBlockNumber, setProcessedBlockNumber] = React.useState(0n);
  const [assetBalance, setAssetBalance] = React.useState(0n);
  const [stakingBalance, setStakingBalance] = React.useState(0n);
  const [stakingAllowance, setStakingAllowance] = React.useState(0n);
  const [price, setPrice] = React.useState(0);
  const [lastBalance, setLastBalance] = React.useState(0n);
  const [sharesBalance, setSharesBalance] = React.useState(0n);
  const [staker, setStaker] = React.useState<StakerWithAssets>();
  const [stakingReward, setStakingReward] = React.useState<StakingReward>();
  const [stakingRewardGlobal, setStakingRewardGlobal] =
    React.useState<StakingRewardGlobal>();

  const convertSharesToAssets = useCallback(
    async (shares: bigint) => {
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        IERC4626.abi,
        provider,
      );
      return stakingContract.convertToAssets(shares);
    },
    [provider],
  );

  const fetchData = useCallback(async () => {
    if (!address) {
      setAssetBalance(0n);
      setStakingAllowance(0n);
      return;
    }
    const assetContract = new Contract(
      ASSET_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );

    const stakingContract = new Contract(
      STAKING_ADDRESS,
      IERC4626.abi,
      provider,
    );

    const [innerAssetBalance, innerStakingAllowance, innerSharesBalance] =
      await Promise.all([
        assetContract.balanceOf(address),
        assetContract.allowance(address, STAKING_ADDRESS),
        stakingContract.maxWithdraw(address),
        stakingContract.balanceOf(address),
      ]);
    setAssetBalance(innerAssetBalance);
    setStakingAllowance(innerStakingAllowance);
    setSharesBalance(innerSharesBalance);
  }, [address, provider]);

  const fetchPrice = useCallback(async () => {
    if (!provider) {
      setPrice(0);
      return;
    }
    const assetContract = new Contract(
      ASSET_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );
    const usdcContract = new Contract(
      USDC_ADDRESS,
      IERC20Metadata.abi,
      provider,
    );
    const [assetBalanceOfPool, usdcBalanceOfPool, usdcDecimals] =
      await Promise.all([
        assetContract.balanceOf(POOL_ADDRESS),
        usdcContract.balanceOf(POOL_ADDRESS),
        usdcContract.decimals(),
      ]);

    const price = parseFloat(
      ethers.formatUnits(
        (usdcBalanceOfPool * 10n ** BigInt(ASSET_METADATA_DECIMALS)) /
          assetBalanceOfPool,
        usdcDecimals,
      ),
    );

    setPrice(price);
  }, [provider]);

  const fetchStaker = useCallback(async () => {
    if (!address) {
      setStaker(undefined);
      setStakingBalance(0n);
      return;
    }
    const variables = {
      where: {
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
        staker: address,
      },
      limit: 1,
    };
    const { stakers } = await ponderRequest(GetStakers, variables);
    if (stakers.items.length > 0) {
      const innerStakingBalance = await convertSharesToAssets(
        stakers.items[0].shares,
      );
      setStaker({
        ...stakers.items[0],
        assets: innerStakingBalance,
      });
      setStakingBalance(innerStakingBalance);
    }
  }, [address, convertSharesToAssets]);

  const fetchTopStakers = useCallback(async () => {
    // Fetch top stakers
    const variables = {
      where: {
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
      },
      limit: nTopStakers,
      orderBy: 'shares',
      orderDirection: 'desc',
    };
    const { stakers } = await ponderRequest(GetStakers, variables);
    // const items = mockLeaderBoard(
    //   stakers.items[0] || {
    //     balance: 0n,
    //     address: ethers.ZeroAddress,
    //   },
    //   nTopStakers,
    // );
    const { items } = stakers;
    if (items.length > 0) {
      const assetsPromises = items.map(async (staker: Staker) => {
        const assets = await convertSharesToAssets(staker.shares);
        return { ...staker, assets };
      });
      const stakersWithAssets = await Promise.all(assetsPromises);
      setTopStakers(stakersWithAssets);
      setLastBalance(stakersWithAssets[stakersWithAssets.length - 1].assets);
    }
  }, [convertSharesToAssets]);

  const fetchStakingReward = useCallback(async () => {
    if (!address) {
      setStakingReward(undefined);
      return;
    }
    const variables = {
      where: {
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
        address: STAKING_ADDRESS,
        staker: address,
      },
      limit: 1,
    };

    const { stakingRewards } = await ponderRequest(
      GetStakingRewards,
      variables,
    );

    if (stakingRewards.items.length > 0) {
      setStakingReward(stakingRewards.items[0]);
    }
  }, [address]);

  const fetchStakingRewardGlobal = useCallback(async () => {
    const variables = {
      where: {
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
      },
      limit: 1,
    };

    const { stakingRewardGlobals } = await ponderRequest(
      GetStakingRewardGlobals,
      variables,
    );

    if (stakingRewardGlobals.items.length > 0) {
      setStakingRewardGlobal(stakingRewardGlobals.items[0]);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    if (blockNumber.data && processedBlockNumber < blockNumber.data) {
      await Promise.all([
        fetchData(),
        fetchPrice(),
        fetchTopStakers(),
        fetchStaker(),
        fetchStakingReward(),
        fetchStakingRewardGlobal(),
      ]);
      setProcessedBlockNumber(BigInt(blockNumber.data));
    }
  }, [
    fetchData,
    fetchPrice,
    fetchTopStakers,
    fetchStaker,
    fetchStakingReward,
    fetchStakingRewardGlobal,
    blockNumber.data,
    processedBlockNumber,
  ]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      fetchAll();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  // Memoize the context value
  const value = useMemo<StakingState>(
    () => ({
      assetBalance,
      stakingAllowance,
      sharesBalance,
      topStakers,
      lastBalance,
      price,
      stakingBalance,
      staker,
      stakingReward,
      stakingRewardGlobal,
      fetchAll,
    }),
    [
      assetBalance,
      stakingAllowance,
      sharesBalance,
      topStakers,
      lastBalance,
      price,
      stakingBalance,
      staker,
      stakingReward,
      stakingRewardGlobal,
    ],
  );

  return (
    <StakingContext.Provider value={value}>{children}</StakingContext.Provider>
  );
};

export function useStaking() {
  const context = useContext(StakingContext);
  if (context === undefined) {
    throw new Error(`useStaking must be used within a StakingProvider`);
  }
  return context;
}
