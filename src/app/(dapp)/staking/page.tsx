'use client';
import React, {
  useCallback,
  // useMemo
} from 'react';
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
import { useChainModal, useConnectModal } from '@rainbow-me/rainbowkit';
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
import { getBoosterValue, getNextLevelPos } from '@/src/utils/shares';
import { prettyAmount } from '@/src/utils/format';
import Cooldown from '@/src/components/Cooldown/Cooldown';
import { SwapModal } from '@/src/components/SwapModal/SwapModal';
import DynamicLeaderBoard from '@/src/components/DynamicLeaderBoard/DynamicLeaderBoard';
import Buy from '@/src/components/Buy/Buy';

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
  const { openChainModal } = useChainModal();
  const { address } = useAccount();
  const signer = useEthersSigner();
  const depositDisclosure = useDisclosure();
  const redeemDisclosure = useDisclosure();
  const swapDisclosure = useDisclosure();

  const [depositAmount, setDepositAmount] = React.useState('');

  const {
    chain,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.code === 'ACTION_REJECTED') {
          toast.error(
            <Toast
              type="error"
              title="Transaction rejected"
              description={'The transaction was rejected by the user'}
            />,
          );
        } else {
          console.error(error);
          toast.error(
            <Toast
              type="error"
              title="An error occurred"
              description={'An error occurred while processing the transaction'}
            />,
          );
        }
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
      const formattedAmount = prettyAmount(
        parseFloat(
          ethers.formatUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      );
      await handleTx({
        confirmingDescription:
          amount === 0n
            ? 'Confirming to cancel unstake request'
            : `Requesting to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL}`,
        processingDescription:
          amount === 0n
            ? 'Processing cancellation of unstake'
            : `Requesting to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL}`,
        successDescription:
          amount === 0n
            ? 'The cancellation of the unstake request was successful'
            : `The request to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL} was successful`,
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

    const formattedAmount = prettyAmount(
      parseFloat(
        ethers.formatUnits(stakingBalance, parseInt(ASSET_METADATA_DECIMALS)),
      ),
    );
    await handleTx({
      confirmingDescription: `Requesting to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL}`,
      processingDescription: `Requesting to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL}`,
      successDescription: `The request to withdraw ${formattedAmount} ${ASSET_METADATA_SYMBOL} was successful`,
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
  }, [address, signer, sharesBalance, staker]);

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
    if (!getSignedStakingReward || !getSignedStakingReward?.amount) {
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

    const available =
      BigInt(getSignedStakingReward.amount) -
      BigInt(stakingReward?.claimed || 0);

    await handleTx({
      confirmingDescription: `Claiming & Restaking ${prettyAmount(
        parseFloat(
          ethers.formatUnits(available, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      processingDescription: `Claiming & Restaking ${prettyAmount(
        parseFloat(
          ethers.formatUnits(available, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL}`,
      successDescription: `The restaking of ${prettyAmount(
        parseFloat(
          ethers.formatUnits(available, parseInt(ASSET_METADATA_DECIMALS)),
        ),
      )} ${ASSET_METADATA_SYMBOL} was successful`,
      tx,
    });
  }, [address, signer, stakingReward]);

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
  let nextLevelBalance = 0n;
  let topStakersWithAssetsAndEarnings: StakerWithAssetsAndEarnings[] = [];

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

      const nextLevel = getNextLevelPos(pos);
      const nextLevelStaker = topStakers[nextLevel];
      nextLevelBalance = nextLevelStaker
        ? BigInt(nextLevelStaker.shares) - BigInt(nextLevelStaker.coolingDown)
        : 0n;
    }
    topStakersWithAssetsAndEarnings = calculateEarningPerDayStakers({
      topStakers,
      stakingRewardGlobal,
      price,
    });
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

  const toNextLevel = nextLevelBalance - lockedAmount + 1n;

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
      {stakingRewardGlobal && (
        <DepositModal
          topStakers={topStakersWithAssetsAndEarnings}
          amount={depositAmount}
          setAmount={setDepositAmount}
          assetBalance={assetBalance}
          stakingAllowance={stakingAllowance}
          lastBalance={lastBalance}
          stakingBalance={stakingBalance}
          coolingDownAssets={coolingDownAssets}
          cooldownTime={BigInt(stakingRewardGlobal?.cooldownTime || 0)}
          approveFn={approve}
          stakeFn={deposit}
          {...depositDisclosure}
        />
      )}
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
      {chain && address && (
        <Staking
          pos={pos}
          stakingBalance={stakingBalance}
          nextLevelBalance={nextLevelBalance}
          coolingDownAssets={staker?.coolingDownAssets || 0n}
          earningsUSD={earningsUSD || 0}
          earningsPerDayUSD={earningPerDayUSD || 0}
          redeemFn={redeemDisclosure.onOpen}
          lastBalance={lastBalance}
          walletIn={walletIn}
          releaseTime={BigInt(staker?.releaseTime || 0)}
          claimFn={claim}
          setDepositAmount={setDepositAmount}
          openDepositModal={depositDisclosure.onOpen}
        />
      )}
      {chain && !address && (
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

      {!chain && address && (
        <Button
          color="danger"
          onPressStart={openChainModal}
          onClick={openChainModal}
          style={{
            width: '100%',
            background: 'var(--danger-color)',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          Wrong network
        </Button>
      )}

      {chain && address ? (
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
        ) : null
      ) : null}
      <Buy />

      <Cooldown
        coolingDown={BigInt(staker?.coolingDown || 0)}
        releaseTime={BigInt(staker?.releaseTime || 0)}
        coolingDownAssets={coolingDownAssets}
        requestWithdrawFn={requestWithdraw}
        withdrawAllFn={withdrawAll}
      />

      {topStakers && topStakers.length > 0 && stakingRewardGlobal ? (
        <DynamicLeaderBoard
          n={nTopStakers}
          topStakersWithAssetsAndEarnings={topStakersWithAssetsAndEarnings}
          setDepositAmount={setDepositAmount}
          openDepositModal={depositDisclosure.onOpen}
          toNextLevel={toNextLevel}
        />
      ) : null}
    </main>
  );
}
