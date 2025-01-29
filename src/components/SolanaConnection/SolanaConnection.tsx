import React from 'react';
import styles from './SolanaConnection.module.css';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { Account } from '@/src/gql/types/graphql';
import { truncateSolanaAddress } from '@/src/utils/format';
import { PublicKey } from '@solana/web3.js';
import {
  ArrowLeftCircleIcon,
  CheckIcon,
  ClipboardIcon,
} from '@heroicons/react/24/outline';
interface Props {
  account: Account;
  linkSolana: (solanaPubKey: string) => Promise<void>;
  unlinkSolana: () => Promise<void>;
}

export const SolanaConnection = ({
  account,
  linkSolana,
  unlinkSolana,
}: Props) => {
  const [solanaPubKey, setSolanaPubKey] = React.useState<string>();
  const [isCopied, setIsCopied] = React.useState(false);

  const checkValidSolanaPubKey = (solanaPubKey: string) => {
    try {
      const pubKey = new PublicKey(solanaPubKey);
      if (pubKey) {
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        return;
      }
      setSolanaPubKey(clipboardText);
    } catch (error) {
      console.error('Failed to read clipboard', error);
    }
  };

  const handleCopyAddress = async () => {
    if (!account.solanaPubKey) {
      return;
    }
    try {
      await navigator.clipboard.writeText(account.solanaPubKey);
      setIsCopied(true);

      // Volver al ícono original después de la duración especificada
      setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
  };

  const isValid = checkValidSolanaPubKey(solanaPubKey || '');
  const isSameWallet = account.solanaPubKey === solanaPubKey;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Link your Solana wallet</div>
      <div className={styles.subContainer}>
        <input
          placeholder="Link a new wallet here"
          className={styles.input}
          value={solanaPubKey}
          onChange={(e) => setSolanaPubKey(e.target.value)}
        />

        {solanaPubKey && solanaPubKey !== '' ? (
          isSameWallet ? (
            <Button color="default" disabled>
              Insert a different wallet
            </Button>
          ) : isValid ? (
            <Button color="primary" onPress={() => linkSolana(solanaPubKey)}>
              Link wallet
            </Button>
          ) : (
            <Button color="danger" disabled>
              Invalid Solana Wallet
            </Button>
          )
        ) : (
          <Button color="primary" onPress={handlePaste}>
            Paste your wallet
          </Button>
        )}
      </div>
      <div className={styles.subContainer}>
        <div className={styles.subtitle}>Current wallet</div>
        {account.solanaPubKey ? (
          <Dropdown
            classNames={{
              content: styles.dropdownContent,
            }}
          >
            <DropdownTrigger>
              <div className={styles.account}>
                <div> {account.solanaPubKey}</div>
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Account actions"
              className={styles.dropdown}
            >
              <DropdownItem key="copy" isReadOnly>
                <div
                  onClick={handleCopyAddress}
                  className={styles.dropdownItem}
                >
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
              <DropdownItem key="disconnect" color="danger">
                <div
                  onClick={() => unlinkSolana()}
                  className={styles.dropdownItem}
                >
                  <div className={styles.icon}>
                    <ArrowLeftCircleIcon />
                  </div>
                  <span>Unlink</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          'No wallet linked yet'
        )}
      </div>
    </div>
  );
};
