'use client';
import React, { useCallback, useEffect } from 'react';
import { useAccount, useBlockNumber } from 'wagmi';
import { Contract } from 'ethers';

import { ASSET_ADDRESS, STAKING_ADDRESS } from '@/src/config';
import { useEthersSigner } from '@/src/utils/ethersAdapter';
import IERC20Metadata from '@/src/abis/IERC20Metadata.json';
import IERC4626 from '@/src/abis/IERC4626.json';
import { Button, useDisclosure } from '@nextui-org/react';
import Staking from '@/src/components/Staking/Staking';
import { DepositModal } from '@/src/components/DepositModal/DepositModal';
import { RedeemModal } from '@/src/components/RedeemModal/RedeemModal';
import { ToastContainer, toast } from 'react-toastify';
import { Toast } from '@/src/components/Toast/Toast';
import { LeaderBoard } from '@/src/components/LeaderBoard/LeaderBoard';

export default function Page() {
  // Hooks
  const { address } = useAccount();
  const blockNumber = useBlockNumber({ cacheTime: 1000 });
  const signer = useEthersSigner();
  const depositDisclosure = useDisclosure();
  const redeemDisclosure = useDisclosure();

  // State
  const [processedBlockNumber, setProcessedBlockNumber] = React.useState(0n);
  const [assetBalance, setAssetBalance] = React.useState(0n);
  const [stakingBalance, setStakingBalance] = React.useState(0n);
  const [stakingAllowance, setStakingAllowance] = React.useState(0n);

  const fetchData = useCallback(async () => {
    if (!address || !signer) {
      setAssetBalance(0n);
      setStakingAllowance(0n);
      setStakingBalance(0n);
      return;
    }

    if (blockNumber.data && processedBlockNumber < blockNumber.data) {
      const assetContract = new Contract(
        ASSET_ADDRESS,
        IERC20Metadata.abi,
        signer,
      );

      const stakingContract = new Contract(
        STAKING_ADDRESS,
        IERC4626.abi,
        signer,
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
      setProcessedBlockNumber(blockNumber.data);
    }
  }, [address, blockNumber.data, processedBlockNumber, signer]);

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
      try {
        const toastTx = toast.info(
          <Toast title={processingTitle} description={processingDescription} />,
          { autoClose: false },
        );
        const response = await tx;
        await response.wait();
        toast.success(
          <Toast title={successTitle} description={successDescription} />,
        );
        toast.dismiss(toastTx);
        fetchData();
      } catch (error) {
        console.error(error);
        toast.error(
          <Toast
            title="Error"
            description={'An error occurred while processing the transaction'}
          />,
        );
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
      handleTx({
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
      handleTx({
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
      handleTx({
        processingTitle: 'Redeem processing',
        processingDescription: 'Waiting for confirmation...',
        successTitle: 'Redeem successful',
        successDescription: 'The redeem was successful',
        tx,
      });
    },
    [address, signer],
  );

  useEffect(() => {
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1rem',
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
      <Staking
        stakingBalance={stakingBalance}
        earnings={0n}
        redeemFn={redeemDisclosure.onOpen}
      />
      {assetBalance > 0n ? (
        <Button onPress={depositDisclosure.onOpen}>Stake more</Button>
      ) : (
        <Button onPress={() => {}}>Buy tokens</Button>
      )}

      <LeaderBoard n={100} />
    </div>
  );
}
