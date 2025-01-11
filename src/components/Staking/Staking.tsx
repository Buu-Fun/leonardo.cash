'use client';
import React from 'react';
import styles from './styles.module.css';
import { format, prettyAmount } from '../../utils/format';
import { ASSET_METADATA_DECIMALS, ASSET_METADATA_SYMBOL } from '@/src/config';
import { Button } from '@nextui-org/react';
import { ethers } from 'ethers';

interface Props {
  stakingBalance: bigint;
  earnings: bigint;
  redeemFn: () => void;
}

function Staking({ stakingBalance, earnings, redeemFn }: Props) {
  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.title}>Your Total Staked</div>
        <div className={styles.data}>
          <div className={styles.amount}>
            <div className={styles.value}>
              {prettyAmount(
                parseFloat(
                  ethers.formatUnits(
                    stakingBalance.toString(),
                    parseInt(ASSET_METADATA_DECIMALS),
                  ),
                ),
              )}
            </div>
            <div className={styles.symbol}>{ASSET_METADATA_SYMBOL}</div>
          </div>
          {stakingBalance > 0n && <Button onPress={redeemFn}>Unstake</Button>}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.title}>Your Earnings</div>
        <div className={styles.data}>
          <div className={styles.amount}>
            <div className={styles.value}>
              {prettyAmount(
                parseFloat(
                  ethers.formatUnits(
                    earnings.toString(),
                    parseInt(ASSET_METADATA_DECIMALS),
                  ),
                ),
              )}
            </div>
            <div className={styles.symbol}>{ASSET_METADATA_SYMBOL}</div>
          </div>
          {earnings > 0n && <Button onPress={() => {}}>Claim</Button>}
        </div>
      </div>
    </div>
  );
}

export default Staking;
