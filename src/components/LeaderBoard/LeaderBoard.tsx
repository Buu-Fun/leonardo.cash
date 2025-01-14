'use client';
import { ASSET_METADATA_DECIMALS, STAKING_ADDRESS } from '@/src/config';
import React, { useCallback, useEffect } from 'react';
import { useAccount } from 'wagmi';

import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { Contract, ethers, uuidV4 } from 'ethers';
import { SecondCrown } from '../icons/SecondCrown';
import { ThirdCrown } from '../icons/ThirdCrown';
import { DefaultCrown } from '../icons/DefaultCrown';
import { Chip } from '@nextui-org/react';
import { FirstCrown } from '../icons/FirstCrown';
import clsx from 'clsx';
import { StakerWithAssetsAndEarnings } from '@/src/app/(dapp)/staking/page';
import { useEthersProvider } from '@/src/utils/ethersAdapter';
import StakingUpgradeable from '@/src/abis/StakingUpgradeable.json';

const chunks = (arr: any[], size: number) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );
};

const chunkSize = 10;

export const LeaderBoard = ({
  now,
  topStakers,
  n,
}: {
  now: bigint;
  topStakers: StakerWithAssetsAndEarnings[];
  n: number;
}) => {
  const memorizedTopStakers = React.useMemo(() => topStakers, [topStakers]);
  const provider = useEthersProvider();
  const [coolingDownAssets, setCoolingDownAssets] = React.useState<{
    [key: string]: bigint;
  }>({});
  const [assets, setAssets] = React.useState<{
    [key: string]: bigint;
  }>({});
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

  const convertSharesToAssets = useCallback(
    async (shares: bigint[]) => {
      const stakingContract = new Contract(
        STAKING_ADDRESS,
        StakingUpgradeable.abi,
        provider,
      );
      const promises = shares.map((share) => {
        return stakingContract.convertToAssets(share);
      });
      return Promise.all(promises);
    },
    [provider],
  );

  const fetchCoolingDownAssets = useCallback(async () => {
    const chunkedStakers = chunks(memorizedTopStakers, chunkSize);
    for (let i = 0; i < chunkedStakers.length; i++) {
      const chunk = chunkedStakers[i];
      const values = await convertSharesToAssets(
        chunk.map((staker) => BigInt(staker.coolingDown)),
      );
      chunk.forEach((staker, index) => {
        setCoolingDownAssets((prev) => {
          return {
            ...prev,
            [staker.staker]: values[index],
          };
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, [memorizedTopStakers]);

  const fetchAssets = useCallback(async () => {
    const chunkedStakers = chunks(memorizedTopStakers, chunkSize);
    for (let i = 0; i < chunkedStakers.length; i++) {
      const chunk = chunkedStakers[i];
      const values = await convertSharesToAssets(
        chunk.map((staker) => BigInt(staker.shares)),
      );
      chunk.forEach((staker, index) => {
        setAssets((prev) => {
          return {
            ...prev,
            [staker.staker]: values[index],
          };
        });
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }, [memorizedTopStakers]);

  useEffect(() => {
    fetchAssets();
    fetchCoolingDownAssets();
    const interval = setInterval(() => {
      fetchAssets();
      fetchCoolingDownAssets();
    }, 10000);
    return () => clearInterval(interval);
  }, [memorizedTopStakers]);

  console.log('coolingDownAssets', coolingDownAssets);
  console.log('assets', assets);

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
                // key={staker.staker}
                key={uuidV4(ethers.randomBytes(16))}
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
                  {/* <div>$350.233 / day</div> */}
                  <div>{`$ ${prettyAmount(
                    staker.earningPerDayUSD,
                  )} / day`}</div>
                  {assets[staker.staker] ? (
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
                            BigInt(staker.releaseTime) < now
                              ? assets[staker.staker] -
                                  coolingDownAssets[staker.staker] || 0n
                              : assets[staker.staker],
                            parseInt(ASSET_METADATA_DECIMALS),
                          ),
                        ),
                      )}
                    </div>
                  ) : (
                    // Loading
                    <div
                      style={{
                        display: 'flex',
                        color: 'rgba(255, 255, 255, 0.45)',
                        fontSize: '14px',
                        gap: '4px',
                      }}
                    >
                      <span>Loading</span>
                    </div>
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
};
