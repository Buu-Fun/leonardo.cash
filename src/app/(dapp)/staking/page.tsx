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
import { GetStakers } from '@/src/gql/documents/staking';
import { Staker } from '@/src/gql/types/graphql';

const nTopStakers = 100;
// const totalRewards = ethers.parseUnits('20000000', ASSET_METADATA_DECIMALS);
const totalRewards = 20000000;

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
  const [topStakers, setTopStakers] = React.useState<Staker[]>([]);
  const [processedBlockNumber, setProcessedBlockNumber] = React.useState(0n);
  const [assetBalance, setAssetBalance] = React.useState(0n);
  const [stakingBalance, setStakingBalance] = React.useState(0n);
  const [stakingAllowance, setStakingAllowance] = React.useState(0n);
  const [price, setPrice] = React.useState(0);

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

    const [innerAssetBalance, innerStakingAllowance, innerStakingBalance] =
      await Promise.all([
        assetContract.balanceOf(address),
        assetContract.allowance(address, STAKING_ADDRESS),
        stakingContract.maxWithdraw(address),
      ]);
    setAssetBalance(innerAssetBalance);
    setStakingAllowance(innerStakingAllowance);
    setStakingBalance(innerStakingBalance);
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

  const fetchTopStakers = useCallback(async () => {
    // Fetch top stakers
    if (blockNumber.data && processedBlockNumber < blockNumber.data) {
      const variables = {
        where: {
          chainId: CHAIN === 'base' ? base.id : Sepolia.id,
        },
        limit: nTopStakers,
        orderBy: 'balance',
        orderDirection: 'desc',
      };
      const { stakers } = await ponderRequest(GetStakers, variables);
      setTopStakers(stakers.items);
      // Mock
      // setTopStakers(
      //   mockLeaderBoard(
      //     stakers.items[0] || {
      //       balance: 0n,
      //       address: ethers.ZeroAddress,
      //     },
      //     n,
      //   ),
      // );
      setProcessedBlockNumber(BigInt(blockNumber.data));
    }
  }, [blockNumber.data]);

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
        fetchData();
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

  const redeem = React.useCallback(
    async (amount: bigint) => {
      if (!address || !signer) return;
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        IERC4626.abi,
        signer,
      );
      const tx = stakingContract.redeem(amount, address, address);
      await handleTx({
        processingTitle: 'Redeem processing',
        processingDescription: 'Waiting for confirmation...',
        successTitle: 'Redeem successful',
        successDescription: 'The redeem was successful',
        tx,
      });
    },
    [address, signer],
  );

  const fetchAll = useCallback(async () => {
    if (blockNumber.data && processedBlockNumber < blockNumber.data) {
      await Promise.all([fetchData(), fetchPrice(), fetchTopStakers()]);
      setProcessedBlockNumber(BigInt(blockNumber.data));
    }
  }, [fetchData, fetchPrice, blockNumber.data, processedBlockNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAll();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const lastStaker =
    topStakers.length > 0 ? topStakers[topStakers.length - 1] : undefined;
  const lastBalance = lastStaker?.balance ?? 0n;
  const walletIn = stakingBalance >= lastBalance;
  const totalRewardsUSD = totalRewards * price;

  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        // paddingTop: '60px',
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
        sharesBalance={stakingBalance}
        redeemFn={redeem}
        {...redeemDisclosure}
      />
      <Rewards
        totalRewards={totalRewardsUSD}
        mininumRequiredStake={
          topStakers.length === nTopStakers ? lastBalance : 0n
        }
      />
      {address && (
        <Staking
          stakingBalance={stakingBalance}
          earnings={0n}
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
            Stake more
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

      <LeaderBoard n={topStakers.length} topStakers={topStakers} />
    </main>
  );
}
