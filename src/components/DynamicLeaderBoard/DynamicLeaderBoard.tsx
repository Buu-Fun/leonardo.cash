'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { ethers } from 'ethers';
import { SecondCrown } from '../icons/SecondCrown';
import { ThirdCrown } from '../icons/ThirdCrown';
import { DefaultCrown } from '../icons/DefaultCrown';
import { Button, Chip } from '@nextui-org/react';
import { FirstCrown } from '../icons/FirstCrown';
import clsx from 'clsx';
import styles from './DynamicLeaderBoard.module.css';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { StakerWithAssetsAndEarnings } from '@/src/app/platform/staking/page';

// function shuffleArray(array: any[] = []) {
//   if (array.length <= 1) return array;

//   const shuffled = [...array];

//   for (let i = shuffled.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
//   }

//   return shuffled;
// }

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

interface RowProps {
  address: string;
  staker: StakerWithAssetsAndEarnings;
  index: number;
  setDepositAmount: (amount: string) => void;
  openDepositModal: () => void;
  toNextLevel: bigint;
}

const Row = ({
  staker,
  address,
  index,
  setDepositAmount,
  openDepositModal,
  toNextLevel,
}: RowProps) => {
  return (
    <motion.div layout>
      <div
        className={clsx(
          styles.tableRow,
          staker.staker === address ? styles.you : '',
        )}
      >
        <div className={styles.tableCellStaker}>
          {renderRanking(index, staker.staker, staker.staker === address)}
        </div>
        {staker.staker === address && (
          <div
            className={clsx(styles.tableCellStaker, styles.tableCellStakerYou)}
          >
            <Button
              onPress={() => {
                setDepositAmount(
                  ethers
                    .formatUnits(
                      toNextLevel.toString(),
                      parseInt(ASSET_METADATA_DECIMALS),
                    )
                    .toString(),
                );
                openDepositModal();
              }}
              color="default"
            >
              <ArrowUpCircleIcon className={styles.icon} />
              Next level
            </Button>
          </div>
        )}
        <div className={styles.tableCellAmount}>
          <div>{`$ ${prettyAmount(staker.earningPerDayUSD * 30)} / month`}</div>
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
    </motion.div>
  );
};

interface Props {
  n: number;
  topStakersWithAssetsAndEarnings: StakerWithAssetsAndEarnings[];
  rowHeight?: number;
  setDepositAmount: (amount: string) => void;
  openDepositModal: () => void;
  toNextLevel: bigint;
}

const DynamicLeaderBoard = ({
  n,
  topStakersWithAssetsAndEarnings,
  setDepositAmount,
  openDepositModal,
  toNextLevel,
}: Props) => {
  const { address } = useAccount();
  return (
    <div className={styles.container}>
      <div>Top {n} Stakers</div>
      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRowHeader}>
            <div className={styles.tableHeaderCell}>RANK</div>
            <div className={styles.tableHeaderCell}>REWARDS</div>
          </div>
        </div>
        <div className={styles.tableBody}>
          <AnimatePresence>
            {topStakersWithAssetsAndEarnings.map(
              (staker: StakerWithAssetsAndEarnings, index: number) => {
                return (
                  <Row
                    key={staker.staker}
                    staker={staker}
                    index={index}
                    address={address as string}
                    setDepositAmount={setDepositAmount}
                    openDepositModal={openDepositModal}
                    toNextLevel={toNextLevel}
                  />
                );
              },
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default DynamicLeaderBoard;
