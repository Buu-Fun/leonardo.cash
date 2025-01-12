'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { ponderRequest } from '@/src/gql/client';
import { GetStakers } from '@/src/gql/documents/staking';
import React, { useCallback } from 'react';
import { useAccount, useBlockNumber } from 'wagmi';
// import styles from './styles.module.css';

import { Staker } from '@/src/gql/types/graphql';
import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { ethers, uuidV4 } from 'ethers';
import { SecondCrown } from '../icons/SecondCrown';
import { ThirdCrown } from '../icons/ThirdCrown';
import { DefaultCrown } from '../icons/DefaultCrown';
import { Chip } from '@nextui-org/react';
import { FirstCrown } from '../icons/FirstCrown';
import clsx from 'clsx';

// const mockLeaderBoard = (staker: Staker, n: number) => {
//   const mockedStaker = {
//     ...staker,
//     balance: 123n * 10n ** 18n,
//     address: ethers.ZeroAddress,
//   } as Staker;
//   const mock = [mockedStaker]
//     .concat(staker)
//     .concat(Array(n - 2).fill(mockedStaker));
//   return mock;
// };

export const LeaderBoard = ({
  topStakers,
  n,
}: {
  topStakers: Staker[];
  n: number;
}) => {
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1rem',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <div>Top {n} Stakers</div>
      <table>
        <thead>
          <tr>
            <th>RANK</th>
            <th>REWARDS</th>
          </tr>
        </thead>
        <tbody>
          {topStakers.map((staker: Staker, index: number) => (
            <tr
              className={clsx(staker?.address === address ? 'you' : '')}
              key={uuidV4(ethers.randomBytes(16))}
            >
              <td>
                {renderRanking(
                  index,
                  staker.address,
                  staker.address === address,
                )}
              </td>
              <td
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: 'fit-content',
                  whiteSpace: 'nowrap',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <div>$350.233 / day</div>
                <div
                  style={{
                    display: 'flex',
                    color: 'rgba(255, 255, 255, 0.45)',
                    fontSize: '14px',
                    gap: '4px',
                  }}
                >
                  <span>Total staked:</span>
                  {prettyAmount(
                    parseFloat(
                      ethers.formatUnits(
                        staker.balance.toString(),
                        parseInt(ASSET_METADATA_DECIMALS),
                      ),
                    ),
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
