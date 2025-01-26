import { truncateAddress } from '@/src/utils/format';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import styles from './AccountButton.module.css';
import { blo } from 'blo';
import Image from 'next/image';
import {
  ArrowLeftCircleIcon,
  CheckIcon,
  ClipboardIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const AccountButton = () => {
  const router = useRouter();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();

  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (!address) {
      return;
    }
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);

      // Volver al ícono original después de la duración especificada
      setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
  };

  return isConnected && address ? (
    <Dropdown
      classNames={{
        content: styles.dropdownContent,
      }}
    >
      <DropdownTrigger>
        <div className={styles.account}>
          <div className={styles.accountIdenticon}>
            <Image src={blo(address)} alt={address} fill />
          </div>
          <div> {truncateAddress(address)}</div>
        </div>
      </DropdownTrigger>
      <DropdownMenu aria-label="Account actions" className={styles.dropdown}>
        <DropdownItem key="copy" isReadOnly>
          <div onClick={handleCopyAddress} className={styles.dropdownItem}>
            {isCopied ? (
              <div
                className={styles.icon}
                style={{ color: 'var(--success-color)' }}
              >
                <CheckIcon />
              </div>
            ) : (
              <div className={styles.icon}>
                <ClipboardIcon />
              </div>
            )}
            <span className={styles.copy}>Copy address</span>
          </div>
        </DropdownItem>
        <DropdownItem key="settings" isReadOnly>
          <div
            onClick={() => {
              router.push('/platform/account');
            }}
            className={styles.dropdownItem}
          >
            <div className={styles.icon}>
              <Cog6ToothIcon />
            </div>
            <span>Settings</span>
          </div>
        </DropdownItem>
        <DropdownItem key="disconnect" color="danger">
          <div onClick={() => disconnect()} className={styles.dropdownItem}>
            <div className={styles.icon}>
              <ArrowLeftCircleIcon />
            </div>
            <span>Disconnect</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <Button
      onPress={openConnectModal}
      color="primary"
      className={styles.button}
    >
      Connect wallet
    </Button>
  );
};
