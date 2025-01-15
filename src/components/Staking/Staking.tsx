'use client';
import React, { useMemo, useState } from 'react';
import styles from './styles.module.css';
import { format, prettyAmount } from '../../utils/format';
import { ASSET_METADATA_DECIMALS, ASSET_METADATA_SYMBOL } from '@/src/config';
import { Button } from '@nextui-org/react';
import { ethers } from 'ethers';
import clsx from 'clsx';
import {
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useDynamicAmount } from '@/src/hooks/useDynamicAmount';

interface Props {
  stakingBalance: bigint;
  lastBalance: bigint;
  earningsUSD: number;
  earningsPerDayUSD: number;
  walletIn: boolean;
  coolingDown: bigint;
  releaseTime: bigint;
  redeemFn: () => void;
  claimFn: () => Promise<void>;
}

function Staking({
  lastBalance,
  stakingBalance,
  earningsUSD,
  earningsPerDayUSD,
  walletIn = false,
  coolingDown,
  redeemFn,
  claimFn,
}: Props) {
  const [claiming, setClaiming] = useState(false);
  const now = useMemo(() => Date.now(), [earningsUSD, earningsPerDayUSD]);
  const earningsAmount = useDynamicAmount({
    offset: earningsUSD,
    toAdd: earningsPerDayUSD,
    startTime: now,
    endTime: now + 86400000,
  });

  const lockedAmount = stakingBalance - coolingDown;

  const handleClaim = async () => {
    setClaiming(true);
    await claimFn();
    setClaiming(false);
  };

  return (
    <div
      className={clsx(
        styles.layout,
        walletIn ? styles.layoutIn : styles.layoutOut,
      )}
    >
      {/* Banner */}
      <div
        className={clsx(
          styles.banner,
          walletIn ? styles.bannerIn : styles.bannerOut,
        )}
      >
        <div
          className={clsx(
            styles.display,
            walletIn ? styles.displayIn : styles.displayOut,
          )}
        >
          <div
            className={clsx(
              styles.circle,
              walletIn ? styles.circleIn : styles.circleOut,
            )}
          />
          <div className={styles.text}>{walletIn ? 'IN' : 'OUT'}</div>
        </div>

        {!walletIn && (
          <div className={clsx(styles.messageOut, styles.message)}>
            <ExclamationTriangleIcon className={styles.icon} />
            <div className={styles.text}>
              {`Stake ${prettyAmount(
                parseFloat(
                  ethers.formatUnits(
                    (walletIn ? lastBalance - stakingBalance : 0n).toString(),
                    parseInt(ASSET_METADATA_DECIMALS),
                  ),
                ),
              )} LEONAI to start earning.`}
            </div>
          </div>
        )}

        {walletIn && (
          <div className={clsx(styles.messageIn, styles.message)}>
            <CheckBadgeIcon className={styles.icon} />
            <div className={styles.text}>{`You are a top staker!`}</div>
          </div>
        )}
      </div>

      {/* Info */}
      <div
        className={clsx(styles.info, walletIn ? styles.infoIn : styles.infoOut)}
      >
        <div className={styles.left}>
          <div className={styles.title}>Your Total Staked</div>
          <div className={styles.data}>
            <div className={styles.amount}>
              <div className={styles.value}>
                {prettyAmount(
                  parseFloat(
                    ethers.formatUnits(
                      lockedAmount.toString(),
                      parseInt(ASSET_METADATA_DECIMALS),
                    ),
                  ),
                )}
              </div>
              <div className={styles.symbol}>{ASSET_METADATA_SYMBOL}</div>
            </div>
            {lockedAmount > 0n && (
              <Button color="default" onPress={redeemFn}>
                Unstake
              </Button>
            )}
          </div>
          <div className={styles.description}>
            The more you stake, the more you earn
          </div>
        </div>

        <div className={walletIn ? styles.dividerIn : styles.dividerOut} />

        <div className={styles.right}>
          <div className={styles.title}>Your Earnings</div>
          <div className={styles.data}>
            <div className={styles.amount}>
              <div className={styles.value}>
                {`$ ${format({
                  value: earningsAmount,
                  minDecimals: 4,
                  maxDecimals: 4,
                })}`}
              </div>
            </div>
            {earningsUSD > 0 && (
              <Button
                color="primary"
                isLoading={claiming}
                onPress={claiming ? undefined : handleClaim}
                style={{
                  color: 'white',
                  width: '100%',
                }}
              >
                Claim and Stake
              </Button>
            )}
          </div>
          <div className={styles.description}>
            {`Earning $ ${prettyAmount(earningsPerDayUSD)} / day`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
