'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { ethers } from 'ethers';
import { SecondCrown } from '../icons/SecondCrown';
import { ThirdCrown } from '../icons/ThirdCrown';
import { DefaultCrown } from '../icons/DefaultCrown';
import { Chip } from '@nextui-org/react';
import { FirstCrown } from '../icons/FirstCrown';
import clsx from 'clsx';
import styles from './DynamicLeaderBoard.module.css';
import { StakerWithAssetsAndEarnings } from '@/src/app/(dapp)/staking/page';

interface Props {
  n: number;
  topStakersWithAssetsAndEarnings: StakerWithAssetsAndEarnings[];
  rowHeight?: number;
}

const DynamicLeaderBoard = ({
  n,
  topStakersWithAssetsAndEarnings,
  rowHeight = 120,
}: Props) => {
  const totalHeight = topStakersWithAssetsAndEarnings.length * rowHeight + 40; // + Padding

  const topStakers = topStakersWithAssetsAndEarnings;

  const { address } = useAccount();
  const renderRankingIcon = (index: number) => {
    switch (index) {
      case 0:
        return (
          <div
            style={{
              filter:
                'drop-shadow(0px 0px 9.611px #90FFFC) drop-shadow(0px 0px 20.893px #90FFFC)',
            }}
          >
            <FirstCrown />
          </div>
        );
      case 1:
        return <SecondCrown />;
      case 2:
        return <ThirdCrown />;
      default:
        return <DefaultCrown />;
    }
  };

  const chipColors = {
    0: '#2E7D7B',
    1: '#636363',
    2: '#4A402F',
  } as Record<number, string>;

  const renderRanking = (index: number, address: string, isYou?: boolean) => {
    return (
      <div className="flex items-center gap-2">
        <div>
          {renderRankingIcon(index)}
          <Chip
            style={{
              backgroundColor: chipColors[index] || '#421E7C',
              color: 'white',
              fontSize: '12px',
              padding: '2px 6px',
            }}
          >
            #{index + 1}
          </Chip>
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.45)',
          }}
        >
          {isYou ? 'You' : truncateAddress(address)}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div>Top {n} Stakers</div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.tableHeaderCell}>RANK</div>
            <div className={styles.tableHeaderCell}>REWARDS</div>
          </div>
        </div>
        <div className={styles.tableBody} style={{ height: totalHeight }}>
          {topStakers.map(
            (staker: StakerWithAssetsAndEarnings, index: number) => (
              <div
                className={clsx(
                  styles.tableRow,
                  staker.staker === address ? styles.you : '',
                )}
                key={staker.staker}
                style={{ height: rowHeight, top: index * rowHeight }}
              >
                <div className={styles.tableCellStaker}>
                  {renderRanking(
                    index,
                    staker.staker,
                    staker.staker === address,
                  )}
                </div>
                <div className={styles.tableCellAmount}>
                  <div>{`$ ${prettyAmount(
                    staker.earningPerDayUSD * 30,
                  )} / month`}</div>
                  <div className={styles.tableCellAmountSub}>
                    <span>Total staked:</span>
                    {prettyAmount(
                      parseFloat(
                        ethers.formatUnits(
                          (staker.assets - staker.coolingDownAssets).toString(),
                          parseInt(ASSET_METADATA_DECIMALS),
                        ),
                      ),
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicLeaderBoard;
