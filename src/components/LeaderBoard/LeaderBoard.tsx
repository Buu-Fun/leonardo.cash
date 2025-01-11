'use client';
import { ASSET_METADATA_DECIMALS, NODE_ENV } from '@/src/config';
import { ponderRequest } from '@/src/gql/client';
import { GetStakers } from '@/src/gql/documents/staking';
import React, { useCallback } from 'react';
import { useBlockNumber } from 'wagmi';
import { base, sepolia as Sepolia } from 'wagmi/chains';
import styles from './styles.module.css';

import FirstCrown from '../../../public/icons/FirstCrown.svg';
import SecondCrown from '../../../public/icons/SecondCrown.svg';
import ThirdCrown from '../../../public/icons/ThirdCrown.svg';
import DefaultCrown from '../../../public/icons/DefaultCrown.svg';
import { Staker } from '@/src/gql/types/graphql';
import { prettyAmount, truncateAddress } from '@/src/utils/format';
import { ethers } from 'ethers';

export const LeaderBoard = ({ n }: { n: number }) => {
  const blockNumber = useBlockNumber({ cacheTime: 1000 });

  const [topStakers, setTopStakers] = React.useState([]);
  const [processedBlockNumber, setProcessedBlockNumber] = React.useState(0n);

  const fetchTopStakers = useCallback(async () => {
    // Fetch top stakers
    if (blockNumber.data && processedBlockNumber < blockNumber.data) {
      const variables = {
        where: {
          chainId: NODE_ENV === 'production' ? base.id : Sepolia.id,
        },
        limit: n,
        orderBy: 'balance',
        orderDirection: 'desc',
      };
      const { stakers } = await ponderRequest(GetStakers, variables);
      setTopStakers(stakers.items);
      setProcessedBlockNumber(BigInt(blockNumber.data));
    }
  }, [n, blockNumber.data]);

  React.useEffect(() => {
    const interval = setInterval(fetchTopStakers, 1000);
    return () => clearInterval(interval);
  }, [fetchTopStakers]);

  const renderRankingIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FirstCrown />;
      case 1:
        return <SecondCrown />;
      case 2:
        return <ThirdCrown />;
      default:
        return <DefaultCrown />;
    }
  };

  return (
    <div>
      <h1>LeaderBoard</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>RANK</th>
            <th>ADDRESS</th>
            <th>STAKED</th>
          </tr>
        </thead>
        <tbody>
          {topStakers.map((staker: Staker, index: number) => (
            <tr key={staker.address}>
              {/* <td>{renderRankingIcon(index)}</td> */}
              <td>{index + 1}</td>
              <td>{truncateAddress(staker.address)}</td>
              <td>
                {prettyAmount(
                  parseFloat(
                    ethers.formatUnits(
                      staker.balance.toString(),
                      parseInt(ASSET_METADATA_DECIMALS),
                    ),
                  ),
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
