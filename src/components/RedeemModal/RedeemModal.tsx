'use client';
import { ASSET_METADATA_DECIMALS } from '@/src/config';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { useCallback } from 'react';

interface Props {
  sharesBalance: bigint;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  redeemFn: (amount: bigint) => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export const RedeemModal = ({
  sharesBalance,
  isOpen,
  onOpenChange,
  redeemFn,
}: Props) => {
  const [amount, setAmount] = React.useState('');

  const handleSetAmount = useCallback(
    (value: string) => {
      try {
        const innerValue = value.replace(/,/g, '.'); // 3.1415
        if (innerValue === '') {
          console.log('innerValue === ""');
          setAmount('');
          return;
        }
        const parsedValue = ethers.parseUnits(
          innerValue,
          parseInt(ASSET_METADATA_DECIMALS),
        );
        if (parsedValue <= sharesBalance) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(
              sharesBalance,
              parseInt(ASSET_METADATA_DECIMALS),
            ),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [sharesBalance],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      const parsedValue = (sharesBalance * percentage) / 100n;
      setAmount(
        ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
      );
    },
    [sharesBalance],
  );

  const handleClose = (onClose: () => void) => () => {
    setAmount('');
    onClose();
  };

  const handleRedeem = useCallback(
    (onClose: () => void) => async () => {
      await redeemFn(
        ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
      );
      handleClose(onClose)();
    },
    [amount],
  );

  const isInvalid = false;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Unstaking $LEONAI
            </ModalHeader>
            <ModalBody>
              <Input
                color={isInvalid ? 'danger' : 'primary'}
                errorMessage="Please enter a valid email"
                label="Amount"
                type="text"
                value={amount}
                onValueChange={handleSetAmount}
              />

              <div className="flex gap-2 justify-between">
                {percentages.map((percentage) => (
                  <Button
                    key={percentage}
                    color="primary"
                    variant={
                      amount ===
                      ethers.formatUnits(
                        (sharesBalance * BigInt(percentage)) / 100n,
                        parseInt(ASSET_METADATA_DECIMALS),
                      )
                        ? undefined
                        : 'light'
                    }
                    onPress={() => setPercentage(BigInt(percentage))}
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={handleClose(onClose)}
              >
                Close
              </Button>
              {amount !== '' && (
                <Button color="primary" onPress={handleRedeem(onClose)}>
                  Unstake
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
