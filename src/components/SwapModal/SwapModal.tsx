'use client';
import { Modal, ModalContent } from '@nextui-org/react';
import React from 'react';
import styles from './styles.module.css';
interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const SwapModal = ({ isOpen, onOpenChange }: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="modal"
      size="xl"
    >
      <ModalContent>
        {(onClose) => (
          <iframe
            src="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
            height="660px"
            width="100%"
            style={{
              border: '0',
              margin: '0 auto',
              marginBottom: '.5rem',
              display: 'block',
              borderRadius: '10px',
              maxWidth: '960px',
              minWidth: '300px',
              maxHeight: '560px',
            }}
          />
        )}
      </ModalContent>
    </Modal>
  );
};
