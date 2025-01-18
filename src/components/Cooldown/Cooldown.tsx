'use client';
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import clsx from 'clsx';
import { prettyAmount, timeDifference } from '@/src/utils/format';
import { ethers } from 'ethers';
import { ASSET_METADATA_DECIMALS, ASSET_METADATA_SYMBOL } from '@/src/config';
import { Button } from '@nextui-org/react';
import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Props {
  coolingDown: bigint;
  releaseTime: bigint;
  coolingDownAssets: bigint;
  requestWithdrawFn: (amount: bigint) => Promise<void>;
  withdrawAllFn: () => Promise<void>;
}

function Cooldown({
  coolingDown,
  coolingDownAssets,
  releaseTime,
  requestWithdrawFn,
  withdrawAllFn,
}: Props) {
  const [withdrawing, setWithdrawing] = useState(false);
  const [now, setNow] = useState(BigInt(Math.floor(Date.now() / 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(BigInt(Math.floor(Date.now() / 1000)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleWithdrawAll = async () => {
    setWithdrawing(true);
    await withdrawAllFn();
    setWithdrawing(false);
  };

  const unlocked = releaseTime <= now;

  if (coolingDown === 0n) {
    return null;
  }

  return (
    <div className={styles.layout}>
      {/* left */}
      <div className={styles.left}>
        <div
          className={clsx(
            styles.title,
            unlocked ? styles.unlocked : styles.locked,
          )}
        >
          {unlocked && (
            <CheckIcon width={16} height={16} stroke="var(--success-color)" />
          )}
          {!unlocked && (
            <ClockIcon width={16} height={16} stroke="var(--warning-color)" />
          )}

          {unlocked
            ? 'Cooldown: Unlocked.'
            : `Cooldown: ${timeDifference(parseInt(releaseTime.toString()))} to unlock.`}

          {!unlocked && (
            <div
              className={styles.cancel}
              onClick={async () => {
                setWithdrawing(true);
                await requestWithdrawFn(0n);
                setWithdrawing(false);
              }}
            >
              Cancel
            </div>
          )}
        </div>

        <div className={styles.amount}>
          <div>
            {prettyAmount(
              parseFloat(
                ethers.formatUnits(
                  coolingDownAssets.toString(),
                  parseInt(ASSET_METADATA_DECIMALS),
                ),
              ),
            )}
          </div>
          {ASSET_METADATA_SYMBOL}
        </div>
      </div>

      <Button
        fullWidth
        isLoading={unlocked ? withdrawing : true}
        color={unlocked ? 'primary' : 'default'}
        onPressStart={withdrawing ? undefined : handleWithdrawAll}
        onClick={withdrawing ? undefined : handleWithdrawAll}
      >
        {unlocked ? 'Withdraw' : 'Cooling down'}
      </Button>
    </div>
  );
}

export default Cooldown;
