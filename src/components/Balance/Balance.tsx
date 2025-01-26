'use client';
import { prettyAmount } from '@/src/utils/format';
import styles from './Balance.module.css';
import { ethers } from 'ethers';
import { useStaking } from '@/src/context/staking.context';
import { ASSET_METADATA_DECIMALS, ASSET_METADATA_SYMBOL } from '@/src/config';
import { Button } from '@nextui-org/react';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Balance = () => {
  const { assetBalance: balance } = useStaking();
  return (
    <div className={styles.balance}>
      <Button className={styles.amount}>
        <span>
          {prettyAmount(
            parseFloat(
              ethers.formatUnits(balance, parseInt(ASSET_METADATA_DECIMALS)),
            ),
          )}
        </span>
        <span className={styles.amountSymbol}>{ASSET_METADATA_SYMBOL}</span>
      </Button>

      <Button
        color="secondary"
        className={styles.balanceButton}
        onPressStart={() =>
          window.open(
            'https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base',
          )
        }
      >
        <PlusIcon className={styles.plusIcon} />
        Buy more
      </Button>
    </div>
  );
};
