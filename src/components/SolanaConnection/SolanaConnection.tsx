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
import {
  useWallet as useSolanaWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  ArrowLeftCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { truncateSolanaAddress } from '@/src/utils/format';

interface Props {
  account: Account;
  solanaWallet: WalletContextState;
  verifySolana: () => Promise<void>;
  disconnectSolana: () => Promise<void>;
}

export const SolanaConnection = ({
  account,
  solanaWallet,
  verifySolana,
  disconnectSolana,
}: Props) => {
  const { disconnect } = useSolanaWallet();
  const { setVisible } = useWalletModal();

  const linked = solanaWallet.publicKey?.toString() === account.solanaPubKey;

  return (
    <div className={styles.container}>
      <div className={styles.title}>Link your Solana wallet</div>

      <div className={styles.subContainer}>
        <div className={styles.subtitle}>Connected</div>
        {solanaWallet.connected && solanaWallet.publicKey && (
          <Dropdown
            classNames={{
              content: styles.dropdownContent,
            }}
          >
            <DropdownTrigger>
              <Button>
                <span>
                  {truncateSolanaAddress(solanaWallet.publicKey.toString())}
                </span>
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
              <DropdownItem key="change">
                <div
                  onClick={() => setVisible(true)}
                  className={styles.dropdownItem}
                >
                  <ArrowPathIcon width={24} height={24} />
                  <span>Change wallet</span>
                </div>
              </DropdownItem>
              <DropdownItem key="disconnect">
                <div
                  onClick={() => disconnect()}
                  className={styles.dropdownItem}
                >
                  <ArrowLeftCircleIcon width={24} height={24} />
                  <span>Disconnect wallet</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
        {!solanaWallet.connected && (
          <Button
            color="primary"
            onPress={() => setVisible(true)}
            style={{
              width: '100%',
            }}
          >
            Connect wallet
          </Button>
        )}
      </div>

      <div className={styles.subContainer}>
        <div className={styles.subtitle}>Linked</div>
        <div>
          {account.solanaPubKey
            ? truncateSolanaAddress(account.solanaPubKey)
            : 'None'}
        </div>
        {linked && (
          <Button color="danger" onPress={disconnectSolana}>
            Unlink wallet
          </Button>
        )}
        {solanaWallet.connected && !linked && (
          <Button color="primary" onPress={verifySolana}>
            Link wallet
          </Button>
        )}
      </div>
    </div>
  );
};
