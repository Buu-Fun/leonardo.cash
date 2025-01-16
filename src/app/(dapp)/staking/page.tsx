'use client';
import React, { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Contract, ethers, MaxUint256 } from 'ethers';

import {
  ASSET_ADDRESS,
  ASSET_METADATA_DECIMALS,
  ASSET_METADATA_SYMBOL,
  CHAIN,
  REWARDS_ADDRESS,
  STAKING_ADDRESS,
} from '@/src/config';
import { useEthersSigner } from '@/src/utils/ethersAdapter';
import RewardsUpgradeable from '@/src/abis/RewardsUpgradeable.json';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import StakingUpgradeable from '@/src/abis/StakingUpgradeable.json';
import { Button, useDisclosure } from '@nextui-org/react';
import Staking from '@/src/components/Staking/Staking';
import { DepositModal } from '@/src/components/DepositModal/DepositModal';
import { RedeemModal } from '@/src/components/RedeemModal/RedeemModal';
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from '@/src/components/Toast/Toast';
import { LeaderBoard } from '@/src/components/LeaderBoard/LeaderBoard';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Rewards } from '@/src/components/Rewards/Rewards';
import {
  SignedStakingReward,
  Staker,
  StakingRewardGlobal,
} from '@/src/gql/types/graphql';
import { useStaking } from '@/src/context/staking.context';
import { serverRequest } from '@/src/gql/client';
import { GetSignedStakingReward } from '@/src/gql/documents/server';
import { base, sepolia as Sepolia } from 'wagmi/chains';
import { getBoosterValue } from '@/src/utils/shares';
import { prettyAmount } from '@/src/utils/format';
import Cooldown from '@/src/components/Cooldown/Cooldown';
import { SwapModal } from '@/src/components/SwapModal/SwapModal';

const nTopStakers = 100;

export type StakerWithAssets = Staker & {
  assets: bigint;
  coolingDownAssets: bigint;
};

export type StakerWithAssetsAndEarnings = StakerWithAssets & {
  earningPerDay: bigint;
  earningPerDayUSD: number;
};

const calculateEarningPerDayStakers = ({
  topStakers,
  stakingRewardGlobal,
  price,
}: {
  topStakers: Staker[];
  stakingRewardGlobal: StakingRewardGlobal;
  price: number;
}) => {
  const now = BigInt(Math.floor(Date.now() / 1000));
  const timeSinceLastUpdate = now - BigInt(stakingRewardGlobal.lastUpdate);
  const rewardsInLastPeriod =
    (BigInt(stakingRewardGlobal.totalRewards) * timeSinceLastUpdate) /
    (BigInt(stakingRewardGlobal.endTime) -
      BigInt(stakingRewardGlobal.startTime));
  const totalBoostedShares = topStakers.reduce(
    (acc: bigint, account: Staker, index: number) => {
      const boostedShares =
        getBoosterValue(index) *
        (BigInt(account.shares) - BigInt(account.coolingDown));
      return acc + boostedShares;
    },
    0n,
  ) as bigint;
  return topStakers.map((staker, index) => {
    const boostedShares =
      getBoosterValue(index) *
      (BigInt(staker.shares) - BigInt(staker.coolingDown));
    const currentReward =
      (rewardsInLastPeriod * boostedShares) / totalBoostedShares;
    const earningPerDay = (currentReward * 86400n) / timeSinceLastUpdate;
    const earningPerDayUSD =
      parseFloat(
        ethers.formatUnits(earningPerDay, parseInt(ASSET_METADATA_DECIMALS)),
      ) * price;
    return {
      ...staker,
      earningPerDay,
      earningPerDayUSD,
    } as StakerWithAssetsAndEarnings;
  });
};

export default function Page() {
  // Hooks
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const signer = useEthersSigner();
  const depositDisclosure = useDisclosure();
  const redeemDisclosure = useDisclosure();
  const swapDisclosure = useDisclosure();

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
    coolingDownAssets,
    fetchAll,
    convertSharesToAssets,
  } = useStaking();

  const handleTx = useCallback(
    async ({
      confirmingDescription,
      processingDescription,
      successDescription,
      tx,
    }: {
      confirmingDescription: string;
      processingDescription: string;
      successDescription: string;
      tx: Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    }) => {
      let confirmingToast;
      let processingToast;
      try {
        confirmingToast = toast.info(
          <Toast
            title={'Confirming operation'}
            description={confirmingDescription}
          />,
          { autoClose: false },
        );
        const response = await tx;
        toast.dismiss(confirmingToast);

        processingToast = toast.info(
          <Toast
            title={'Processing operation'}
            description={processingDescription}
          />,
          { autoClose: false },
        );
        await response.wait();
        toast.dismiss(processingToast);

        toast.success(
          <Toast
            type="success"
            title={'Operation successful'}
            description={successDescription}
          />,
        );
      } catch (error) {
        console.error(error);
        toast.error(
          <Toast
            type="error"
            title="An error occurred"
            description={'An error occurred while processing the transaction'}
          />,
        );
      } finally {
        if (confirmingToast) {
          toast.dismiss(confirmingToast);
        }
        if (processingToast) {
          toast.dismiss(processingToast);
        }
        await fetchAll();
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
      const prettifiedAmount =
        amount === MaxUint256
          ? 'all'
          : prettyAmount(
              parseFloat(
                ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
              ),
            );
      await handleTx({
        confirmingDescription: `Approving ${prettifiedAmount} ${ASSET_METADATA_SYMBOL} on the staking contract`,
        processingDescription: `Approving ${prettifiedAmount} ${ASSET_METADATA_SYMBOL} on the staking contract`,
        successDescription: `The approval of ${prettifiedAmount} ${ASSET_METADATA_SYMBOL} was successful`,
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
        StakingUpgradeable.abi,
        signer,
      );
      const tx = stakingContract.deposit(amount, address);
      await handleTx({
        confirmingDescription: `Staking ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL}`,
        processingDescription: `Staking ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL}`,
        successDescription: `The staking of ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL} was successful`,
        tx,
      });
    },
    [address, signer],
  );

  const requestWithdraw = React.useCallback(
    async (amount: bigint) => {
      if (!address || !signer) return;
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        StakingUpgradeable.abi,
        signer,
      );
      const tx = stakingContract.requestWithdraw(amount);
      await handleTx({
        confirmingDescription: `Requesting to withdraw ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL}`,
        processingDescription: `Requesting to withdraw ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL}`,
        successDescription: `The request to withdraw ${prettyAmount(
          parseFloat(
            ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
          ),
        )} ${ASSET_METADATA_SYMBOL} was successful`,
        tx,
      });
    },
    [address, signer],
  );

  const requestWithdrawAll = React.useCallback(async () => {
    if (!address || !signer || sharesBalance === 0n) return;

    const stakingContract = new Contract(
      STAKING_ADDRESS,
      StakingUpgradeable.abi,
      signer,
    );
    const tx = stakingContract.requestRedeem(sharesBalance);
    await handleTx({
      confirmingDescription: `Requesting to withdraw ${prettyAmount(
        parseFloat(
          ethers.formatUnits(stakingBalance, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      processingDescription: `Requesting to withdraw ${prettyAmount(
        parseFloat(
          ethers.formatUnits(stakingBalance, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      successDescription: `The request to withdraw ${prettyAmount(
        parseFloat(
          ethers.formatUnits(stakingBalance, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL} was successful`,
      tx,
    });
  }, [address, signer, sharesBalance]);

  const withdrawAll = React.useCallback(async () => {
    if (!address || !signer || sharesBalance === 0n || !staker) return;

    const stakingContract = new Contract(
      STAKING_ADDRESS,
      StakingUpgradeable.abi,
      signer,
    );
    const tx = stakingContract.redeem(staker.coolingDown, address, address);
    await handleTx({
      confirmingDescription: `Withdrawing ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            coolingDownAssets,
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      processingDescription: `Withdrawing ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            coolingDownAssets,
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      successDescription: `The withdrawal of ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            coolingDownAssets,
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL} was successful`,
      tx,
    });
  }, [address, signer, sharesBalance]);

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
    if (!getSignedStakingReward?.amount) {
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
      confirmingDescription: `Claiming ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            BigInt(getSignedStakingReward.amount) -
              BigInt(stakingReward?.claimed || 0),
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      processingDescription: `Claiming ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            BigInt(getSignedStakingReward.amount) -
              BigInt(stakingReward?.claimed || 0),
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      successDescription: `The claim of ${prettyAmount(
        parseFloat(
          ethers.formatUnits(
            BigInt(getSignedStakingReward.amount) -
              BigInt(stakingReward?.claimed || 0),
            parseInt(ASSET_METADATA_DECIMALS),
          ),
        ),
      )} ${ASSET_METADATA_SYMBOL} was successful`,
      tx,
    });
  }, [address, signer]);

  const now = BigInt(Math.floor(Date.now() / 1000));
  // const now = useMemo(() => BigInt(Math.floor(Date.now() / 1000)), []);

  const lockedAmount = stakingBalance - (staker?.coolingDownAssets || 0n);

  const walletIn = lockedAmount > 0n && lockedAmount >= lastBalance;

  const totalStakedAssets = stakingRewardGlobal
    ? convertSharesToAssets(stakingRewardGlobal.totalShares)
    : 0n;

  const totalValueLocked =
    parseFloat(
      ethers.formatUnits(totalStakedAssets, parseInt(ASSET_METADATA_DECIMALS)),
    ) * price;

  let currentReward = 0n;
  let earningPerDay = 0n;
  let totalRewards = 0n;
  let totalRewardsPerDay = 0n;
  let pos = -1;
  let nextStakingBalance = 0n;

  if (stakingRewardGlobal) {
    pos = address
      ? topStakers.map((staker) => staker.staker).indexOf(address)
      : -1;

    const timeSinceLastUpdate = now - BigInt(stakingRewardGlobal.lastUpdate);
    const timeSinceStart = now - BigInt(stakingRewardGlobal.startTime);
    const rewardsInLastPeriod =
      (BigInt(stakingRewardGlobal.totalRewards) * timeSinceLastUpdate) /
      (BigInt(stakingRewardGlobal.endTime) -
        BigInt(stakingRewardGlobal.startTime));

    totalRewards =
      (BigInt(stakingRewardGlobal.totalRewards) * timeSinceStart) /
      (BigInt(stakingRewardGlobal.endTime) -
        BigInt(stakingRewardGlobal.startTime));
    totalRewardsPerDay = (totalRewards * 86400n) / timeSinceStart;

    if (pos >= 0 && staker && stakingRewardGlobal && price) {
      const totalBoostedShares = topStakers.reduce(
        (acc: bigint, account: Staker, index: number) => {
          return (
            acc +
            getBoosterValue(index) *
              (BigInt(account.shares) - BigInt(account.coolingDown))
          );
        },
        0n,
      ) as bigint;
      currentReward =
        (rewardsInLastPeriod *
          getBoosterValue(pos) *
          (BigInt(staker.shares) - BigInt(staker.coolingDown))) /
        totalBoostedShares;
      earningPerDay = (currentReward * 86400n) / timeSinceLastUpdate;

      const nextStaker = pos > 0 ? topStakers[pos - 1] : undefined;
      nextStakingBalance = nextStaker
        ? BigInt(nextStaker.shares) - BigInt(nextStaker.coolingDown)
        : 0n;
    }
  }

  const earnings = stakingReward
    ? BigInt(stakingReward.amount) -
      BigInt(stakingReward.claimed) +
      currentReward
    : currentReward;

  const earningsUSD =
    parseFloat(
      ethers.formatUnits(earnings, parseInt(ASSET_METADATA_DECIMALS)),
    ) * price;
  const earningPerDayUSD =
    parseFloat(
      ethers.formatUnits(earningPerDay, parseInt(ASSET_METADATA_DECIMALS)),
    ) * price;

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
      <SwapModal {...swapDisclosure} />
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
        lastBalance={lastBalance}
        stakingBalance={stakingBalance}
        cooldownTime={BigInt(stakingRewardGlobal?.cooldownTime || 0)}
        approveFn={approve}
        stakeFn={deposit}
        {...depositDisclosure}
      />
      <RedeemModal
        stakingBalance={stakingBalance}
        coolingDown={BigInt(staker?.coolingDown || 0)}
        withdrawFn={requestWithdraw}
        withdrawAllFn={requestWithdrawAll}
        coolDownTime={BigInt(stakingRewardGlobal?.cooldownTime || 0)}
        {...redeemDisclosure}
      />
      <Rewards
        totalRewards={totalRewardsUSD}
        totalRewardsPerDay={totalRewardsPerDayUSD}
        totalValueLocked={totalValueLocked}
        mininumRequiredStake={
          topStakers.length === nTopStakers ? lastBalance : 0n
        }
      />
      {address && (
        <Staking
          pos={pos}
          stakingBalance={stakingBalance}
          nextStakingBalance={nextStakingBalance}
          coolingDownAssets={staker?.coolingDownAssets || 0n}
          earningsUSD={earningsUSD || 0}
          earningsPerDayUSD={earningPerDayUSD || 0}
          redeemFn={redeemDisclosure.onOpen}
          lastBalance={lastBalance}
          walletIn={walletIn}
          releaseTime={BigInt(staker?.releaseTime || 0)}
          claimFn={claim}
        />
      )}
      {!address && (
        <Button
          color="primary"
          onPressStart={openConnectModal}
          onClick={openConnectModal}
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
            onPressStart={depositDisclosure.onOpen}
            onClick={depositDisclosure.onOpen}
            style={{
              width: '100%',
            }}
          >
            Stake LEONAI
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
              Buy LEONAI
            </Button>
          </a>
        )
      ) : null}

      <Cooldown
        coolingDown={BigInt(staker?.coolingDown || 0)}
        releaseTime={BigInt(staker?.releaseTime || 0)}
        coolingDownAssets={coolingDownAssets}
        withdrawAllFn={withdrawAll}
      />

      {topStakers && topStakers.length > 0 && stakingRewardGlobal ? (
        <LeaderBoard
          n={nTopStakers}
          topStakers={calculateEarningPerDayStakers({
            topStakers,
            stakingRewardGlobal,
            price,
          })}
        />
      ) : null}
    </main>
  );
}
