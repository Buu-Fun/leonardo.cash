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
  pos: number;
  nextStakingBalance: bigint;
  stakingBalance: bigint;
  lastBalance: bigint;
  earningsUSD: number;
  earningsPerDayUSD: number;
  walletIn: boolean;
  coolingDownAssets: bigint;
  releaseTime: bigint;
  redeemFn: () => void;
  claimFn: () => Promise<void>;
}

function Staking({
  pos,
  lastBalance,
  nextStakingBalance,
  stakingBalance,
  earningsUSD,
  earningsPerDayUSD,
  walletIn = false,
  coolingDownAssets,
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

  const lockedAmount = stakingBalance - coolingDownAssets;

  const handleClaim = async () => {
    setClaiming(true);
    await claimFn();
    setClaiming(false);
  };

  const toNextPos = nextStakingBalance - lockedAmount;

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
              {lastBalance > 0n
                ? `Stake ${prettyAmount(
                    parseFloat(
                      ethers.formatUnits(
                        (walletIn
                          ? lastBalance - stakingBalance
                          : 0n
                        ).toString(),
                        parseInt(ASSET_METADATA_DECIMALS),
                      ),
                    ),
                  )} LEONAI to start earning.`
                : 'Stake LEONAI to start earning.'}
            </div>
          </div>
        )}

        {walletIn && (
          <div className={clsx(styles.messageIn, styles.message)}>
            <CheckBadgeIcon className={styles.icon} />
            <div className={styles.text}>
              {pos === 0
                ? 'You are the whale!'
                : `${prettyAmount(
                    parseFloat(
                      ethers.formatUnits(
                        toNextPos.toString(),
                        parseInt(ASSET_METADATA_DECIMALS),
                      ),
                    ),
                  )} LEONAI to reach the next position.`}
            </div>
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
              <Button
                color="default"
                onPressStart={redeemFn}
                onClick={redeemFn}
              >
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
          <div className={styles.title}>Your Earnings ($)</div>
          <div className={styles.data}>
            <div className={styles.amount}>
              <div className={styles.value}>
                {`${format({
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
                Claim + Restake
              </Button>
            )}
          </div>
          <div className={styles.description}>
            {`Earning $ ${prettyAmount(earningsPerDayUSD * 30)} / month`}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Staking;
