'use client';
import React, { useCallback, useEffect } from 'react';
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
import { useEthersProvider, useEthersSigner } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import IERC4626 from '@/src/abis/IERC4626.json';
import { Button, useDisclosure } from '@nextui-org/react';
import Staking from '@/src/components/Staking/Staking';
import { DepositModal } from '@/src/components/DepositModal/DepositModal';
import { RedeemModal } from '@/src/components/RedeemModal/RedeemModal';
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from '@/src/components/Toast/Toast';
import { LeaderBoard } from '@/src/components/LeaderBoard/LeaderBoard';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Rewards } from '@/src/components/Rewards/Rewards';
import { ponderRequest } from '@/src/gql/client';
import {
  GetStakers,
  GetStakingRewardGlobals,
  GetStakingRewards,
} from '@/src/gql/documents/staking';
import {
  Staker,
  StakingReward,
  StakingRewardGlobal,
} from '@/src/gql/types/graphql';
import { getBoosterValue } from './utils';

const nTopStakers = 100;

export type StakerWithAssets = Staker & { assets: bigint };

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

export default function Page() {
  // Hooks
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const blockNumber = useBlockNumber({ cacheTime: 5000 });
  const signer = useEthersSigner();
  const provider = useEthersProvider();
  const depositDisclosure = useDisclosure();
  const redeemDisclosure = useDisclosure();

  // State
  const [topStakers, setTopStakers] = React.useState<StakerWithAssets[]>([]);
  const [processedBlockNumber, setProcessedBlockNumber] = React.useState(0n);
  const [assetBalance, setAssetBalance] = React.useState(0n);
  const [stakingBalance, setStakingBalance] = React.useState(0n);
  const [stakingAllowance, setStakingAllowance] = React.useState(0n);
  const [price, setPrice] = React.useState(0);
  const [lastBalance, setLastBalance] = React.useState(0n);
  const [sharesBalance, setSharesBalance] = React.useState(0n);
  const [staker, setStaker] = React.useState<Staker>();
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
      setStakingBalance(0n);
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

    const [
      innerAssetBalance,
      innerStakingAllowance,
      innerStakingBalance,
      innerSharesBalance,
    ] = await Promise.all([
      assetContract.balanceOf(address),
      assetContract.allowance(address, STAKING_ADDRESS),
      stakingContract.maxWithdraw(address),
      stakingContract.balanceOf(address),
    ]);
    setAssetBalance(innerAssetBalance);
    setStakingAllowance(innerStakingAllowance);
    setStakingBalance(innerStakingBalance);
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
      setStaker(stakers.items[0]);
    }
  }, [address]);

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
  }, [blockNumber.data, convertSharesToAssets]);

  const fetchStakingReward = useCallback(async () => {
    if (!address) {
      setStakingReward(undefined);
      return;
    }
    const variables = {
      where: {
        chainId: CHAIN === 'base' ? base.id : Sepolia.id,
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

  const handleTx = useCallback(
    async ({
      processingTitle,
      processingDescription,
      successTitle,
      successDescription,
      tx,
    }: {
      processingTitle: string;
      processingDescription: string;
      successTitle: string;
      successDescription: string;
      tx: Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    }) => {
      let toastTx;
      try {
        toastTx = toast.info(
          <Toast title={processingTitle} description={processingDescription} />,
          { autoClose: false },
        );
        const response = await tx;
        await response.wait();
        toast.success(
          <Toast title={successTitle} description={successDescription} />,
        );
      } catch (error) {
        console.error(error);
        toast.error(
          <Toast
            title="Error"
            description={'An error occurred while processing the transaction'}
          />,
        );
      } finally {
        if (toastTx) {
          toast.dismiss(toastTx);
        }
        fetchAll();
      }
    },
    [fetchData],
  );

  const approve = React.useCallback(
    async (amount: bigint) => {
      if (!address || !signer) return;
      const assetContract = new Contract(
        ASSET_ADDRESS,
        IERC20Metadata.abi,
        signer,
      );
      const tx = assetContract.approve(STAKING_ADDRESS, amount);
      await handleTx({
        processingTitle: 'Approve processing',
        processingDescription: 'Waiting for confirmation...',
        successTitle: 'Approve successful',
        successDescription: 'The approval was successful',
        tx,
      });
    },
    [address, signer],
  );

  const deposit = React.useCallback(
    async (amount: bigint) => {
      if (!address || !signer) return;
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        IERC4626.abi,
        signer,
      );
      const tx = stakingContract.deposit(amount, address);
      await handleTx({
        processingTitle: 'Deposit processing',
        processingDescription: 'Waiting for confirmation...',
        successTitle: 'Deposit successful',
        successDescription: 'The deposit was successful',
        tx,
      });
    },
    [address, signer],
  );

  const withdraw = React.useCallback(
    async (amount: bigint) => {
      if (!address || !signer) return;
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        IERC4626.abi,
        signer,
      );
      const tx = stakingContract.withdraw(amount, address, address);
      await handleTx({
        processingTitle: 'Withdraw processing',
        processingDescription: 'Waiting for confirmation...',
        successTitle: 'Withdraw successful',
        successDescription: 'The Withdraw was successful',
        tx,
      });
    },
    [address, signer],
  );

  const withdrawAll = React.useCallback(async () => {
    if (!address || !signer || sharesBalance === 0n) return;
    const stakingContract = new Contract(STAKING_ADDRESS, IERC4626.abi, signer);
    const tx = stakingContract.redeem(sharesBalance, address, address);
    await handleTx({
      processingTitle: 'Withdraw processing',
      processingDescription: 'Waiting for confirmation...',
      successTitle: 'Withdraw successful',
      successDescription: 'The Withdraw was successful',
      tx,
    });
  }, [address, signer, sharesBalance]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const walletIn = stakingBalance >= lastBalance;

  let currentReward = 0n;
  let earningPerDay = 0n;
  let totalRewards = 0n;
  let totalRewardsPerDay = 0n;
  const pos = address
    ? topStakers.map((staker) => staker.staker).indexOf(address)
    : -1;

  if (pos >= 0 && staker && stakingRewardGlobal && stakingReward && price) {
    const now = BigInt(Math.floor(Date.now() / 1000));
    const timeSinceStart = now - BigInt(stakingRewardGlobal.startTime);
    const timeSinceLastUpdate = now - BigInt(stakingRewardGlobal.lastUpdate);
    const rewardsInLastPeriod =
      (BigInt(stakingRewardGlobal.totalRewards) * timeSinceLastUpdate) /
      (BigInt(stakingRewardGlobal.endTime) -
        BigInt(stakingRewardGlobal.startTime));
    const totalBoostedShares = topStakers.reduce(
      (acc: bigint, account: Staker, index: number) => {
        const boostedShare = getBoosterValue(index) * BigInt(account.shares);
        return acc + boostedShare;
      },
      0n,
    ) as bigint;
    const boostedShares = getBoosterValue(pos) * BigInt(staker.shares);
    currentReward = (rewardsInLastPeriod * boostedShares) / totalBoostedShares;
    earningPerDay = (currentReward * 86400n) / timeSinceLastUpdate;
    totalRewards =
      (BigInt(stakingRewardGlobal.totalRewards) * timeSinceStart) /
      (BigInt(stakingRewardGlobal.endTime) -
        BigInt(stakingRewardGlobal.startTime));
    totalRewardsPerDay = (totalRewards * 86400n) / timeSinceStart;
  }

  const earnings = stakingReward
    ? BigInt(stakingReward.amount) + currentReward
    : 0n;
  const totalRewardsUSD =
    parseFloat(
      ethers.formatUnits(totalRewards, parseInt(ASSET_METADATA_DECIMALS)),
    ) * price;
  const totalRewardsPerDayUSD =
    parseFloat(
      ethers.formatUnits(totalRewardsPerDay, parseInt(ASSET_METADATA_DECIMALS)),
    ) * price;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '800px',
        gap: '20px',
      }}
    >
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <DepositModal
        assetBalance={assetBalance}
        stakingAllowance={stakingAllowance}
        approveFn={approve}
        stakeFn={deposit}
        {...depositDisclosure}
      />
      <RedeemModal
        stakingBalance={stakingBalance}
        withdrawFn={withdraw}
        withdrawAllFn={withdrawAll}
        {...redeemDisclosure}
      />
      <Rewards
        totalRewards={totalRewardsUSD}
        totalRewardsPerDay={totalRewardsPerDayUSD}
        mininumRequiredStake={
          topStakers.length === nTopStakers ? lastBalance : 0n
        }
      />
      {address && (
        <Staking
          stakingBalance={stakingBalance}
          earnings={earnings}
          earningsPerDay={earningPerDay}
          redeemFn={redeemDisclosure.onOpen}
          lastBalance={lastBalance}
          walletIn={walletIn}
          claimFn={() => console.log('Claiming')}
        />
      )}
      {!address && (
        <Button
          color="primary"
          onPress={openConnectModal}
          style={{
            width: '100%',
          }}
        >
          Connect wallet
        </Button>
      )}
      {address ? (
        assetBalance > 0n ? (
          <Button
            color="primary"
            onPress={depositDisclosure.onOpen}
            style={{
              width: '100%',
            }}
          >
            Stake $LEONAI
          </Button>
        ) : (
          <a
            href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
            target="_blank"
            rel="noreferrer"
            style={{
              width: '100%',
            }}
          >
            <Button
              color="primary"
              style={{
                width: '100%',
              }}
            >
              Buy $LEONAI
            </Button>
          </a>
        )
      ) : null}

      <LeaderBoard n={nTopStakers} topStakers={topStakers} />
    </main>
  );
}
