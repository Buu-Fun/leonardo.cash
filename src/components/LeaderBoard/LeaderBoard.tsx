'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import React from 'react';
import { useAccount } from 'wagmi';

import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { ethers } from 'ethers';
import { SecondCrown } from '../icons/SecondCrown';
import { ThirdCrown } from '../icons/ThirdCrown';
import { DefaultCrown } from '../icons/DefaultCrown';
import { Chip } from '@nextui-org/react';
import { FirstCrown } from '../icons/FirstCrown';
import clsx from 'clsx';
import { StakerWithAssetsAndEarnings } from '@/src/app/(dapp)/staking/page';

export const LeaderBoard = ({
  topStakers,
  n,
}: {
  topStakers: StakerWithAssetsAndEarnings[];
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
          {topStakers.map(
            (staker: StakerWithAssetsAndEarnings, index: number) => (
              <tr
                className={clsx(staker.staker === address ? 'you' : '')}
                key={staker.staker}
              >
                <td>
                  {renderRanking(
                    index,
                    staker.staker,
                    staker.staker === address,
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
                  <div>{`$ ${prettyAmount(
                    staker.earningPerDayUSD,
                  )} / day`}</div>
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
                          (staker.assets - staker.coolingDownAssets).toString(),
                          parseInt(ASSET_METADATA_DECIMALS),
                        ),
                      ),
                    )}
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
