'use client';
import React, { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Contract, ethers } from 'ethers';

import {
  ASSET_ADDRESS,
  ASSET_METADATA_DECIMALS,
  CHAIN,
  REWARDS_ADDRESS,
  STAKING_ADDRESS,
} from '@/src/config';
import { useEthersSigner } from '@/src/utils/ethersAdapter';
import RewardsUpgradeable from '@/src/abis/RewardsUpgradeable.json';
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
import { SignedStakingReward, Staker } from '@/src/gql/types/graphql';
import { getBoosterValue } from './utils';
import { useStaking } from '@/src/context/staking.context';
import { serverRequest } from '@/src/gql/client';
import { GetSignedStakingReward } from '@/src/gql/documents/backend';
import { base, sepolia as Sepolia } from 'wagmi/chains';

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
  const signer = useEthersSigner();
  const depositDisclosure = useDisclosure();
  const redeemDisclosure = useDisclosure();

  const {
    topStakers,
    assetBalance,
    stakingAllowance,
    sharesBalance,
    stakingBalance,
    price,
    lastBalance,
    staker,
    stakingReward,
    stakingRewardGlobal,
    fetchAll,
  } = useStaking();

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
        await response.wait(2);
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
    [fetchAll],
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

  const claim = React.useCallback(async () => {
    if (!address || !signer) return;

    const { getSignedStakingReward } = (await serverRequest(
      GetSignedStakingReward,
      {
        input: {
          chainId: CHAIN === 'base' ? base.id : Sepolia.id,
          stakerAddress: address,
        },
      },
    )) as { getSignedStakingReward: SignedStakingReward | undefined };
    if (!getSignedStakingReward) {
      toast.error(
        <Toast
          title="Error"
          description={'An error occurred while processing the transaction'}
        />,
      );
      return;
    }

    const rewardContract = new Contract(
      REWARDS_ADDRESS,
      RewardsUpgradeable.abi,
      signer,
    );

    const tx = rewardContract.claim(
      getSignedStakingReward.asset,
      getSignedStakingReward.vault,
      getSignedStakingReward.staker,
      getSignedStakingReward.amount,
      getSignedStakingReward.signer,
      getSignedStakingReward.signature,
    );

    await handleTx({
      processingTitle: 'Claim processing',
      processingDescription: 'Waiting for confirmation...',
      successTitle: 'Claim successful',
      successDescription: 'The Claim was successful',
      tx,
    });
  }, [address, signer]);

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
    ? BigInt(stakingReward.available) + currentReward
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
          claimFn={claim}
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
