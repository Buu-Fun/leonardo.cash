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
import React, { use, useCallback, useEffect } from 'react';

interface Props {
  stakingBalance: bigint;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  withdrawFn: (amount: bigint) => Promise<void>;
  withdrawAllFn: () => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export const RedeemModal = ({
  stakingBalance,
  isOpen,
  onOpenChange,
  withdrawFn,
  withdrawAllFn,
}: Props) => {
  const [amount, setAmount] = React.useState('');

  const handleSetAmount = useCallback(
    (value: string) => {
      try {
        const innerValue = value.replace(/,/g, '.'); // 3.1415
        if (innerValue === '') {
          setAmount('');
          return;
        }
        const parsedValue = ethers.parseUnits(
          innerValue,
          parseInt(ASSET_METADATA_DECIMALS),
        );
        if (parsedValue <= stakingBalance) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(
              stakingBalance,
              parseInt(ASSET_METADATA_DECIMALS),
            ),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [stakingBalance],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      const parsedValue = (stakingBalance * percentage) / 100n;
      setAmount(
        ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
      );
    },
    [stakingBalance],
  );

  const handleRedeem = useCallback(
    (onClose: () => void) => async () => {
      const bnAmount = ethers.parseUnits(
        amount,
        parseInt(ASSET_METADATA_DECIMALS),
      );
      if (bnAmount === stakingBalance) {
        withdrawAllFn();
      } else {
        withdrawFn(bnAmount);
      }
      onClose();
    },
    [amount],
  );

  useEffect(() => {
    if (isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  const isInvalid = false;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="modal">
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
                variant="bordered"
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
                        (stakingBalance * BigInt(percentage)) / 100n,
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
              <Button color="danger" variant="light" onPress={onClose}>
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
