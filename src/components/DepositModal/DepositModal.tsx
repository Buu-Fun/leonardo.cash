'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { Button, Modal, ModalContent } from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import { extractHours, format } from '@/src/utils/format';
import { CheckIcon } from '@heroicons/react/24/outline';
import Disclaimer from '../Disclaimer/Disclaimer';
import { StakerWithAssetsAndEarnings } from '@/src/app/(dapp)/staking/page';

interface Props {
  topStakers: StakerWithAssetsAndEarnings[];
  amount: string;
  setAmount: (amount: string) => void;
  assetBalance: bigint;
  stakingAllowance: bigint;
  lastBalance: bigint;
  stakingBalance: bigint;
  coolingDownAssets: bigint;
  isOpen: boolean;
  cooldownTime: bigint;
  onOpenChange: (isOpen: boolean) => void;
  approveFn: (amount: bigint) => Promise<void>;
  stakeFn: (amount: bigint) => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export const DepositModal = ({
  topStakers,
  amount,
  setAmount,
  assetBalance,
  stakingAllowance,
  isOpen,
  cooldownTime,
  lastBalance,
  stakingBalance,
  coolingDownAssets,
  onOpenChange,
  approveFn,
  stakeFn,
}: Props) => {
  const [depositing, setDepositing] = React.useState(false);
  const [approving, setApproving] = React.useState(false);
  const amountBn =
    amount !== ''
      ? ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS))
      : 0n;

  const handleSetAmount = useCallback(
    (value: string) => {
      try {
        const innerValue = value.replace(/,/g, '.'); // 3.1415
        if (innerValue === '') {
          setAmount('');
          return;
        }
        const parsedValue = ethers.parseUnits(
          innerValue,
          parseInt(ASSET_METADATA_DECIMALS),
        );
        if (parsedValue <= assetBalance) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(assetBalance, parseInt(ASSET_METADATA_DECIMALS)),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [assetBalance],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      const parsedValue = (assetBalance * percentage) / 100n;
      setAmount(
        ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
      );
    },
    [assetBalance],
  );

  const handleApprove = useCallback(
    () => async () => {
      setApproving(true);
      await approveFn(amountBn);
      setApproving(false);
    },
    [amountBn],
  );

  const handleStake = useCallback(
    (onClose: () => void) => async () => {
      setDepositing(true);
      await stakeFn(
        ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
      );
      onClose();
      setDepositing(false);
    },
    [amount],
  );

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const isAllowed = stakingAllowance >= amountBn;
  const canStake =
    isAllowed &&
    amount !== '' &&
    amountBn > 0n &&
    stakingAllowance >=
      ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS));

  const youAreTop100 = stakingBalance - coolingDownAssets >= lastBalance;
  const youWillBeTop100 =
    stakingBalance - coolingDownAssets + amountBn > lastBalance;

  const amountLeft =
    lastBalance - (stakingBalance - coolingDownAssets) - amountBn;

  const estimatePos = topStakers.findIndex((staker) => {
    const stakerBalance = BigInt(staker.shares) - BigInt(staker.coolingDown);
    return stakerBalance < stakingBalance - coolingDownAssets + amountBn;
  });
  console.log('estimatePos', estimatePos);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="modal"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.layout}>
            <div className={styles.title}>Stake</div>

            <div className={styles.subtitle}>
              {`If you're in top 100 stakers, you'll start instantly earning
              rewards. Once you unstake, there’s a `}
              <span
                className={styles.highlighted}
              >{`${extractHours(parseInt(cooldownTime.toString()))} hours cooldown`}</span>
              {` period.`}
            </div>

            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepIcon}>1</div>
                <div className={styles.stepDescription}>
                  <span>Approving LEONAI usage by the Staking contract</span>
                  {amountBn > 0n && !isAllowed && (
                    <Button
                      color="primary"
                      onPressStart={handleApprove()}
                      onClick={handleApprove()}
                      isLoading={approving}
                      style={{
                        paddingLeft: '20px',
                        paddingRight: '20px',
                      }}
                    >
                      Approve
                    </Button>
                  )}
                  {amountBn > 0n && isAllowed && (
                    <CheckIcon
                      color="var(--success-color)"
                      width={26}
                      height={26}
                    />
                  )}
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>2</div>
                <div className={styles.stepDescription}>
                  <span>Staking your LEONAI</span>
                  {canStake && (
                    <Button
                      disabled={!canStake}
                      color={canStake ? 'primary' : 'default'}
                      isLoading={depositing}
                      onPressStart={
                        canStake
                          ? depositing
                            ? undefined
                            : handleStake(onClose)
                          : undefined
                      }
                      onClick={
                        canStake
                          ? depositing
                            ? undefined
                            : handleStake(onClose)
                          : undefined
                      }
                      style={{
                        color: canStake ? undefined : 'var(--text-color-muted)',
                      }}
                    >
                      Stake
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.bottom}>
              <div className={styles.amount}>
                <div className={styles.labels}>
                  <div className={styles.label}>Amount to Stake</div>
                  <div
                    className={styles.balance}
                    style={{
                      cursor: depositing || approving ? 'unset' : 'pointer',
                    }}
                    onClick={
                      depositing || approving
                        ? undefined
                        : () => setPercentage(BigInt(100))
                    }
                  >{`Balance: ${format({
                    value: assetBalance.toString(),
                    decimalsOffset: parseInt(ASSET_METADATA_DECIMALS),
                  })}`}</div>
                </div>
                <input
                  type="text"
                  color={depositing || approving ? 'disabled' : 'primary'}
                  value={amount}
                  onChange={(e) => handleSetAmount(e.target.value)}
                  className={styles.input}
                  height={48}
                  disabled={depositing || approving}
                  style={{
                    color:
                      depositing || approving
                        ? 'var(--text-color-muted)'
                        : undefined,
                  }}
                />

                <div className={styles.buttons}>
                  {percentages.map((percentage) => (
                    <Button
                      fullWidth
                      size="sm"
                      key={percentage}
                      color={depositing || approving ? 'default' : 'primary'}
                      variant={
                        amountBn === (assetBalance * BigInt(percentage)) / 100n
                          ? undefined
                          : 'light'
                      }
                      disabled={depositing || approving}
                      onPressStart={
                        depositing || approving
                          ? undefined
                          : () => setPercentage(BigInt(percentage))
                      }
                      onClick={
                        depositing || approving
                          ? undefined
                          : () => setPercentage(BigInt(percentage))
                      }
                      style={{
                        color:
                          depositing || approving
                            ? 'var(--text-color-muted)'
                            : undefined,
                      }}
                    >
                      {percentage === 100 ? 'MAX' : `${percentage}%`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.disclaimer}>
              <Disclaimer
                type={youAreTop100 || youWillBeTop100 ? 'success' : 'error'}
              >
                {amountBn > 0n
                  ? youWillBeTop100
                    ? `You will be the #${estimatePos + 1} staker!`
                    : `You need to stake ${format({
                        value: amountLeft.toString(),
                        decimalsOffset: parseInt(ASSET_METADATA_DECIMALS),
                      })} more to be in the top 100!`
                  : youAreTop100
                    ? `You are the #${estimatePos + 1} staker!`
                    : `You need to stake ${format({
                        value: amountLeft.toString(),
                        decimalsOffset: parseInt(ASSET_METADATA_DECIMALS),
                      })} more to be in the top 100! `}
              </Disclaimer>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
