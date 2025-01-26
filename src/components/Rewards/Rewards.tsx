'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import { format, prettyAmount, truncateAddress } from '@/src/utils/format';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import styles from './Rewards.module.css';
import {
  CheckIcon,
  ChevronDownIcon,
  ClipboardIcon,
  MagnifyingGlassIcon,
  MapIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';
import { ethers } from 'ethers';
import { X } from '../icons/X';
import { useDynamicAmount } from '@/src/hooks/useDynamicAmount';
import { TelegramIcon } from '../icons/TelegramIcon';
import { useAccount } from 'wagmi';
import { getAddresses } from '@/src/addresses';

interface Props {
  totalRewards: number;
  totalRewardsPerDay: number;
  totalValueLocked: number;
  mininumRequiredStake: bigint;
}

export const Rewards = ({
  totalRewards,
  totalRewardsPerDay,
  totalValueLocked,
  mininumRequiredStake,
}: Props) => {
  const { chain } = useAccount();
  const now = useMemo(() => Date.now(), [totalRewards, totalRewardsPerDay]);
  const totalRewardsAmount = useDynamicAmount({
    offset: totalRewards,
    toAdd: totalRewardsPerDay,
    startTime: now,
    endTime: now + 86400000,
  });
  const [isCopied, setIsCopied] = useState(false);
  const addresses = getAddresses(chain?.id);
  const assetAddress = addresses.asset;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(assetAddress);
      setIsCopied(true);

      // Volver al ícono original después de la duración especificada
      setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
  };

  return (
    <div className={styles.layout}>
      {/* X icon */}
      <div className={styles.socials}>
        <div onClick={() => window.open('https://x.com/Leonardo__AI')}>
          <X className={styles.button} />
        </div>

        <div onClick={() => window.open('https://t.me/leonardo_ai_official')}>
          <TelegramIcon className={styles.button} />
        </div>
      </div>

      {/* logo */}
      <div className={styles.logoContainer}>
        {/* image */}
        <div className={styles.logo}>
          <Image src="/leonai.png" alt="$LEONAI" fill />
        </div>
        <div className={styles.logoButtons}>
          <Button onPressStart={handleCopy} onClick={handleCopy}>
            <div>{truncateAddress(assetAddress)}</div>

            {isCopied ? (
              <CheckIcon
                width={16}
                height={16}
                style={{
                  stroke: 'var(--success-color)',
                }}
              />
            ) : (
              <ClipboardIcon width={16} height={16} />
            )}
          </Button>

          {/* dropdown */}
          <Dropdown
            classNames={{
              content: styles.dropdownContent,
            }}
          >
            <DropdownTrigger>
              <Button color="primary">
                <span>More</span>
                <ChevronDownIcon width={14} height={14} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Static Actions"
              className={styles.dropdown}
              style={{
                margin: 0,
                padding: 0,
              }}
            >
              <DropdownItem key="bubblemaps">
                <div
                  onClick={() =>
                    window.open(
                      'https://app.bubblemaps.io/base/token/0xb933d4ff5a0e7bfe6ab7da72b5dce2259030252f',
                    )
                  }
                  className={styles.dropdownItem}
                >
                  <MapIcon width={24} height={24} />
                  <span>Bubblemaps</span>
                </div>
              </DropdownItem>
              <DropdownItem key="skynet">
                <div
                  onClick={() =>
                    window.open(
                      'https://skynet.certik.com/tools/token-scan/base/0xb933d4ff5a0e7bfe6ab7da72b5dce2259030252f',
                    )
                  }
                  className={styles.dropdownItem}
                >
                  <ShieldCheckIcon width={24} height={24} />
                  <span>Skynet audit</span>
                </div>
              </DropdownItem>
              <DropdownItem key="explorer">
                <div
                  onClick={() =>
                    window.open(
                      'https://basescan.org/token/0xb933d4ff5a0e7bfe6ab7da72b5dce2259030252f#balances',
                    )
                  }
                  className={styles.dropdownItem}
                >
                  <MagnifyingGlassIcon width={24} height={24} />
                  <span>View on Explorer</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* values */}
      <div className={styles.values}>
        {/* subtitle */}
        <div className={styles.subtitle}>Total rewards distributed ($)</div>

        {/* value */}
        <div className={styles.amount}>{`${format({
          value: totalRewardsAmount,
          minDecimals: 4,
          maxDecimals: 4,
        })}`}</div>

        {/* more values */}
        <div className={styles.moreValues}>
          <div>
            {`$ ${format({
              value: totalRewardsPerDay,
              minDecimals: 2,
              maxDecimals: 2,
            })} per day`}
          </div>
          <div className={styles.moreValuesAmount}>to the top 100</div>

          <div className={styles.moreValuesCircle} />

          <div>
            {`${prettyAmount(
              parseFloat(
                ethers.formatUnits(
                  mininumRequiredStake.toString(),
                  parseInt(ASSET_METADATA_DECIMALS),
                ),
              ),
            )} minimum stake`}
          </div>
          <div className={styles.moreValuesAmount}>to earn</div>
        </div>

        <div className={styles.divider} />

        {/* tvl */}
        <div className={styles.tvl}>
          <div className={styles.tvlTitle}>Total Value Locked ($)</div>
          <div className={styles.tvlAmount}>{`${format({
            value: totalValueLocked,
            minDecimals: 2,
            maxDecimals: 2,
          })}`}</div>
        </div>
      </div>
    </div>
  );
};
