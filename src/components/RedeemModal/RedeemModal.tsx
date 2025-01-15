'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { Button, Modal, ModalContent } from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { useCallback, useEffect } from 'react';
import styles from './styles.module.css';
import { extractHours, format } from '@/src/utils/format';
import Disclaimer from '../Disclaimer/Disclaimer';

interface Props {
  stakingBalance: bigint;
  isOpen: boolean;
  coolDownTime: bigint;
  coolingDown: bigint;
  onOpenChange: (isOpen: boolean) => void;
  withdrawFn: (amount: bigint) => Promise<void>;
  withdrawAllFn: () => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export const RedeemModal = ({
  stakingBalance,
  isOpen,
  coolDownTime,
  coolingDown,
  onOpenChange,
  withdrawFn,
  withdrawAllFn,
}: Props) => {
  const [withdrawing, setWithdrawing] = React.useState(false);
  const [amount, setAmount] = React.useState('');

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
        if (parsedValue <= stakingBalance) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(
              stakingBalance,
              parseInt(ASSET_METADATA_DECIMALS),
            ),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [stakingBalance],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      const parsedValue = (stakingBalance * percentage) / 100n;
      setAmount(
        ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
      );
    },
    [stakingBalance],
  );

  const handleRedeem = useCallback(
    (onClose: () => void) => async () => {
      setWithdrawing(true);
      const bnAmount = ethers.parseUnits(
        amount,
        parseInt(ASSET_METADATA_DECIMALS),
      );
      if (bnAmount === stakingBalance) {
        await withdrawAllFn();
      } else {
        await withdrawFn(bnAmount);
      }
      onClose();
      setWithdrawing(false);
    },
    [amount],
  );

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const canUnstake =
    amount !== '' &&
    ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)) > 0n;

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
            <div className={styles.title}>Unstake</div>

            <div className={styles.subtitle}>
              {`After you unstake you won’t able to withdraw until after the cooldown period. However, any token you unstake no longer counts towards earning rewards.`}
            </div>

            <div className={styles.bottom}>
              <div className={styles.amount}>
                <div className={styles.labels}>
                  <div className={styles.label}>Amount to Unstake</div>
                  <div
                    className={styles.label}
                    style={{
                      color: 'var(--text-color-muted)',
                      cursor: withdrawing ? 'unset' : 'pointer',
                    }}
                    onClick={
                      withdrawing ? undefined : () => setPercentage(BigInt(100))
                    }
                  >{`Balance: ${format({
                    value: stakingBalance.toString(),
                    decimalsOffset: parseInt(ASSET_METADATA_DECIMALS),
                  })}`}</div>
                </div>
                <input
                  type="text"
                  color={withdrawing ? 'disabled' : 'primary'}
                  value={amount}
                  onChange={(e) => handleSetAmount(e.target.value)}
                  className={styles.input}
                  disabled={withdrawing}
                  style={{
                    color: withdrawing ? 'var(--text-color-muted)' : undefined,
                  }}
                  height={48}
                />

                <div className={styles.buttons}>
                  {percentages.map((percentage) => (
                    <Button
                      fullWidth
                      size="sm"
                      key={percentage}
                      color={withdrawing ? 'default' : 'primary'}
                      variant={
                        amount ===
                        ethers.formatUnits(
                          (stakingBalance * BigInt(percentage)) / 100n,
                          parseInt(ASSET_METADATA_DECIMALS),
                        )
                          ? undefined
                          : 'light'
                      }
                      disabled={withdrawing}
                      onPress={
                        withdrawing
                          ? undefined
                          : () => setPercentage(BigInt(percentage))
                      }
                      style={{
                        color: withdrawing
                          ? 'var(--text-color-muted)'
                          : undefined,
                      }}
                    >
                      {percentage}%
                    </Button>
                  ))}
                </div>
              </div>

              <div className={styles.amount}>
                <div className={styles.label}>Cooldown period</div>

                <input
                  type="text"
                  value={`${extractHours(parseInt(coolDownTime.toString()))} hours`}
                  className={styles.input}
                  height={48}
                  style={{
                    cursor: 'normal',

                    color: 'var(--text-color-muted)',
                  }}
                  disabled
                />
              </div>
            </div>
            <Button
              fullWidth
              disabled={!canUnstake}
              isLoading={withdrawing}
              color={canUnstake ? 'primary' : 'default'}
              onPress={
                canUnstake
                  ? withdrawing
                    ? undefined
                    : handleRedeem(onClose)
                  : undefined
              }
              style={{
                height: '48px',
              }}
            >
              Unstake
            </Button>

            {coolingDown > 0n && (
              <div className={styles.disclaimer}>
                <Disclaimer type="error">
                  You have a pending amount on cooldown, requesting a new amount
                  will reset the cooldown period.
                </Disclaimer>
              </div>
            )}
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
