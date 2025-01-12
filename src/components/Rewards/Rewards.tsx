'use client';
import { ASSET_ADDRESS, ASSET_METADATA_DECIMALS } from '@/src/config';
import { format, prettyAmount, truncateAddress } from '@/src/utils/format';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Image from 'next/image';
import styles from './styles.module.css';
import {
  CheckIcon,
  ChevronDownIcon,
  ClipboardIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ethers } from 'ethers';
import { X } from '../icons/X';

interface Props {
  totalRewards: number;
  mininumRequiredStake: bigint;
}

const days = 3 * 30;

export const Rewards = ({ totalRewards, mininumRequiredStake }: Props) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ASSET_ADDRESS);
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
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '1rem',
          zIndex: 4,
        }}
      >
        <a href="https://x.com/Leonardo__AI" target="_blank" rel="noreferrer">
          <X className={styles.button} />
        </a>
      </div>

      {/* logo */}
      <div className={styles.logoContainer}>
        {/* image */}
        <div className={styles.logo}>
          <Image src="/leonai.png" alt="$LEONAI" fill />
        </div>
        {/* dropdown */}
        <Dropdown
          classNames={{
            content: styles.dropdownContent,
          }}
        >
          <DropdownTrigger>
            <Button color="primary">
              <span>{truncateAddress(ASSET_ADDRESS)}</span>
              <ChevronDownIcon width={24} height={24} />
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
            <DropdownItem key="copy" onPress={handleCopy}>
              <div className={styles.dropdownItem}>
                {isCopied ? (
                  <CheckIcon width={24} height={24} />
                ) : (
                  <ClipboardIcon width={24} height={24} />
                )}
                <div>Copy address</div>
              </div>
            </DropdownItem>
            <DropdownItem key="explorer">
              <a
                href="https://basescan.org/token/0xb933d4ff5a0e7bfe6ab7da72b5dce2259030252f#balances"
                target="_blank"
                rel="noreferrer"
                className={styles.dropdownItem}
              >
                <MagnifyingGlassIcon width={24} height={24} />
                <span>View on Explorer</span>
              </a>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* values */}
      <div className={styles.values}>
        {/* subtitle */}
        <div className={styles.subtitle}>Total $leonai leonardo reward</div>

        {/* value */}
        <div className={styles.amount}>{`$ ${format({
          value: totalRewards,
          minDecimals: 2,
          maxDecimals: 2,
        })}`}</div>

        {/* more values */}
        <div className={styles.moreValues}>
          <div>
            {`$ ${format({
              value: totalRewards / days,
              minDecimals: 2,
              maxDecimals: 2,
            })} PER DAY`}
          </div>
          <div className={styles.moreValuesAmount}>TO THE TOP 100</div>

          <div className={styles.moreValuesCircle} />

          <div>
            {`${prettyAmount(
              parseFloat(
                ethers.formatUnits(
                  mininumRequiredStake.toString(),
                  parseInt(ASSET_METADATA_DECIMALS),
                ),
              ),
            )} MINIMUM STAKE`}
          </div>
          <div className={styles.moreValuesAmount}> TO EARN</div>
        </div>
      </div>
    </div>
  );
};
