'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useAccount } from 'wagmi';
import { Contract } from 'ethers';
import { base, sepolia as Sepolia } from 'wagmi/chains';

import { CHAIN, ASSET_ADDRESS, STAKING_ADDRESS } from '@/src/config';
import { useEthersProvider } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import StakingUpgradeable from '@/src/abis/StakingUpgradeable.json';
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
import { usePrice } from './price.context';

export type StakerWithAssets = Staker & {
  assets: bigint;
  coolingDownAssets: bigint;
};

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
  coolingDownAssets: bigint;
  fetchAll: () => Promise<void>;
  convertSharesToAssets: (shares: bigint) => bigint;
}

const nTopStakers = 100;

// const mockLeaderBoard = (staker: StakerWithAssets, n: number) => {
//   const mockedStaker = {
//     ...staker,
//     balance: 123n * 10n ** 18n,
//     staker: ethers.ZeroAddress,
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
  coolingDownAssets: 0n,
  fetchAll: async () => {},
  convertSharesToAssets: (shares: bigint) => shares,
});

export const StakingProvider = ({ children }: Props) => {
  const { address } = useAccount();
  const provider = useEthersProvider();
  const { price } = usePrice();

  // State
  const [topStakers, setTopStakers] = React.useState<StakerWithAssets[]>([]);
  const [assetBalance, setAssetBalance] = React.useState(0n);
  const [stakingBalance, setStakingBalance] = React.useState(0n);
  const [stakingAllowance, setStakingAllowance] = React.useState(0n);
  const [sharesBalance, setSharesBalance] = React.useState(0n);
  const [staker, setStaker] = React.useState<StakerWithAssets>();
  const [stakingReward, setStakingReward] = React.useState<StakingReward>();
  const [stakingRewardGlobal, setStakingRewardGlobal] =
    React.useState<StakingRewardGlobal>();
  const [coolingDownAssets, setCoolingDownAssets] = React.useState(0n);
  const [lastBalance, setLastBalance] = React.useState(0n);

  const convertSharesToAssets = useCallback((shares: bigint) => {
    if (!stakingRewardGlobal) {
      return shares;
    }

    return (
      (shares * BigInt(stakingRewardGlobal.totalAssets)) /
      BigInt(stakingRewardGlobal.totalShares)
    );
  }, []);

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
      StakingUpgradeable.abi,
      provider,
    );

    const [innerAssetBalance, innerStakingAllowance, innerSharesBalance] =
      await Promise.all([
        assetContract.balanceOf(address),
        assetContract.allowance(address, STAKING_ADDRESS),
        stakingContract.balanceOf(address),
      ]);
    setAssetBalance(innerAssetBalance);
    setStakingAllowance(innerStakingAllowance);
    setSharesBalance(innerSharesBalance);
  }, [address, provider]);

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
      const innerStakingBalance = convertSharesToAssets(
        BigInt(stakers.items[0].shares),
      );
      const innerCoolingDownAssets = convertSharesToAssets(
        BigInt(stakers.items[0].coolingDown),
      );
      setStaker({
        ...stakers.items[0],
        assets: convertSharesToAssets(BigInt(stakers.items[0].shares)),
        coolingDownAssets: convertSharesToAssets(
          BigInt(stakers.items[0].coolingDown),
        ),
      });
      setStakingBalance(innerStakingBalance);
      setCoolingDownAssets(innerCoolingDownAssets);
    } else {
      setStaker(undefined);
      setStakingBalance(0n);
      setCoolingDownAssets(0n);
    }
  }, [address, convertSharesToAssets]);

  const fetchTopStakers = useCallback(async () => {
    // Fetch top stakers
    const variables = {
      where: {
        address: STAKING_ADDRESS,
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
        computing_gt: '0',
      },
      limit: nTopStakers,
      orderBy: 'computing',
      orderDirection: 'desc',
    };
    const { stakers } = await ponderRequest(GetStakers, variables);
    const { items } = stakers;
    if (items.length > 0) {
      // setTopStakers(mockLeaderBoard(items[0], nTopStakers));
      setTopStakers(
        items.map((staker: Staker) => ({
          ...staker,
          assets: convertSharesToAssets(BigInt(staker.shares)),
          coolingDownAssets: convertSharesToAssets(BigInt(staker.coolingDown)),
        })),
      );
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
    await Promise.all([
      fetchData(),
      fetchTopStakers(),
      fetchStaker(),
      fetchStakingReward(),
      fetchStakingRewardGlobal(),
    ]);
  }, [
    fetchData,
    fetchTopStakers,
    fetchStaker,
    fetchStakingReward,
    fetchStakingRewardGlobal,
  ]);

  const fetchLastBalance = useCallback(async () => {
    if (topStakers.length >= nTopStakers) {
      const lastBalance = await convertSharesToAssets(
        BigInt(topStakers[topStakers.length - 1].shares),
      );
      setLastBalance(lastBalance);
    }
  }, [topStakers]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => {
      fetchAll();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    fetchLastBalance();
  }, [fetchLastBalance]);

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
      coolingDownAssets,
      fetchAll,
      convertSharesToAssets,
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
      coolingDownAssets,
      fetchAll,
      convertSharesToAssets,
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
