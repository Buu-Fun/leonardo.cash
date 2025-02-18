import { WalletConnectionType } from '@/src/context/wallet.context';
import { Button, Modal, ModalContent } from '@nextui-org/react';

import styles from './WalletConnectionTypeModal.module.css';

export const WalletConnectionTypeModal = ({
  isOpen,
  onOpenChange,
  connect,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  connect: (connectionType: WalletConnectionType) => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="modal"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.layout}>
            <div className={styles.title}>Sign in</div>

            <div className={styles.subtitle}>
              {`Choose the type of wallet you want to connect`}
            </div>

            <div className={styles.bottom}>
              <Button
                onPress={() => {
                  connect(WalletConnectionType.Web2);
                  onClose();
                }}
              >
                Login
              </Button>
              <Button
                color="primary"
                onPress={() => {
                  connect(WalletConnectionType.Web3);
                  onClose();
                }}
              >
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};
