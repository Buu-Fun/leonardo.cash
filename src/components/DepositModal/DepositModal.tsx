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
import React, { useCallback, useEffect } from 'react';

interface Props {
  assetBalance: bigint;
  stakingAllowance: bigint;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  approveFn: (amount: bigint) => Promise<void>;
  stakeFn: (amount: bigint) => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export const DepositModal = ({
  assetBalance,
  stakingAllowance,
  isOpen,
  onOpenChange,
  approveFn,
  stakeFn,
}: Props) => {
  const [approving, setApproving] = React.useState(false);
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
        if (parsedValue <= assetBalance) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(assetBalance, parseInt(ASSET_METADATA_DECIMALS)),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [assetBalance],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      const parsedValue = (assetBalance * percentage) / 100n;
      setAmount(
        ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
      );
    },
    [assetBalance],
  );

  const handleApprove = useCallback(
    (onClose: () => void) => async () => {
      setApproving(true);
      await approveFn(
        ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)),
      );
      setApproving(false);
      // onClose();
    },
    [amount],
  );

  const handleStake = useCallback(
    (onClose: () => void) => async () => {
      stakeFn(ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)));
      onClose();
    },
    [amount],
  );

  const isInvalid = false;

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="modal">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Staking $LEONAI
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
                        (assetBalance * BigInt(percentage)) / 100n,
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
              {amount !== '' &&
                (stakingAllowance <
                ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS)) ? (
                  <Button
                    color="primary"
                    onPress={handleApprove(onClose)}
                    isLoading={approving}
                  >
                    Approve
                  </Button>
                ) : (
                  <Button color="primary" onPress={handleStake(onClose)}>
                    Stake
                  </Button>
                ))}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
