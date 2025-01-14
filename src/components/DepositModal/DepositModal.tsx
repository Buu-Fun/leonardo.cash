'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { Button, Modal, ModalContent } from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import { extractHours, format } from '@/src/utils/format';
import { CheckIcon } from '@heroicons/react/24/outline';
import Disclaimer from '../Disclaimer/Disclaimer';

interface Props {
  assetBalance: bigint;
  stakingAllowance: bigint;
  lastBalance: bigint;
  stakingBalance: bigint;
  isOpen: boolean;
  cooldownTime: bigint;
  onOpenChange: (isOpen: boolean) => void;
  approveFn: (amount: bigint) => Promise<void>;
  stakeFn: (amount: bigint) => Promise<void>;
}

// const percentages = [25, 50, 75, 100];

export const DepositModal = ({
  assetBalance,
  stakingAllowance,
  isOpen,
  cooldownTime,
  lastBalance,
  stakingBalance,
  onOpenChange,
  approveFn,
  stakeFn,
}: Props) => {
  const [approving, setApproving] = React.useState(false);
  const [amount, setAmount] = React.useState('');

  const handleSetAmount = useCallback(
    (value: string) => {
      try {
        const innerValue = value.replace(/,/g, '.'); // 3.1415
        if (innerValue === '') {
          console.log('innerValue === ""');
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

  // const setPercentage = useCallback(
  //   (percentage: bigint) => {
  //     const parsedValue = (assetBalance * percentage) / 100n;
  //     setAmount(
  //       ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
  //     );
  //   },
  //   [assetBalance],
  // );

  const handleApprove = () => async () => {
    setApproving(true);
    await approveFn(ethers.MaxUint256); // approve all
    setApproving(false);
    // onClose();
  };

  const handleStake = useCallback(
    (onClose: () => void) => async () => {
      stakeFn(ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)));
      onClose();
    },
    [amount],
  );

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const isAllowed = stakingAllowance >= ethers.MaxUint256;
  // const isInvalid = false;
  const canStake =
    isAllowed &&
    amount !== '' &&
    ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)) > 0n &&
    stakingAllowance >=
      ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS));

  const youAreInTop100 =
    canStake &&
    stakingBalance +
      ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)) >
      lastBalance;

  const amountLeft = canStake
    ? youAreInTop100
      ? 0n
      : lastBalance -
        (stakingBalance +
          ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)))
    : 0n;

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
                  {!isAllowed && (
                    <Button
                      color="primary"
                      onPress={handleApprove()}
                      isLoading={approving}
                    >
                      Approve
                    </Button>
                  )}
                  {isAllowed && (
                    <CheckIcon
                      color="var(--success-color)"
                      width={24}
                      height={24}
                    />
                  )}
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepIcon}>2</div>
                <div className={styles.stepDescription}>
                  Staking your LEONAI
                </div>
              </div>
            </div>

            {isAllowed && (
              <div className={styles.bottom}>
                <div className={styles.amount}>
                  <div className={styles.label}>Amount to Stake</div>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => handleSetAmount(e.target.value)}
                    className={styles.input}
                    height={48}
                  />
                </div>

                <Button
                  disabled={!canStake}
                  color={canStake ? 'primary' : 'default'}
                  onPress={canStake ? handleStake(onClose) : undefined}
                  style={{
                    height: '48px',
                  }}
                >
                  Stake
                </Button>
              </div>
            )}

            {canStake && (
              <div className={styles.disclaimer}>
                <Disclaimer type={youAreInTop100 ? 'success' : 'error'}>
                  {youAreInTop100
                    ? 'You are in top 100 and will start earning rewards!'
                    : `You need to stake ${format({
                        value: amountLeft.toString(),
                        decimalsOffset: parseInt(ASSET_METADATA_DECIMALS),
                      })} more to be in top 100!`}
                </Disclaimer>
              </div>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
