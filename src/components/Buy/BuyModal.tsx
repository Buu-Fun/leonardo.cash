import { Button, Modal, ModalContent } from '@nextui-org/react';
// import { TokenInput } from './TokenInput';
import { usePrice } from '@/src/context/price.context';
import { useAccount, useBalance } from 'wagmi';

import {
  ASSET_ADDRESS,
  ASSET_METADATA_DECIMALS,
  POOL_ADDRESS,
} from '@/src/config';
import { formatUnits, Hex } from 'viem';
import { useCallback, useEffect, useState } from 'react';

import { usePool } from '@/src/hooks/uniswap/usePool';
import { useQuote } from '@/src/hooks/uniswap/useQuote';
import { useSwap } from '@/src/hooks/uniswap/useSwap';

import styles from './BuyModal.module.css';
import { prettyAmount } from '@/src/utils/format';
import { ethers } from 'ethers';

type HandleTxInput = {
  confirmingDescription: string;
  processingDescription: string;
  successDescription: string;
  tx: Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

interface BuyModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  handleTx: (i: HandleTxInput) => Promise<void>;
}

const percentages = [25, 50, 75, 100];

export default function BuyModal({
  isOpen,
  onOpenChange,
  handleTx,
}: BuyModalProps) {
  const [buying, setBuying] = useState(false);
  const [amount, setAmount] = useState('');
  const amountBn =
    amount !== ''
      ? ethers.parseUnits(amount, parseInt(ASSET_METADATA_DECIMALS))
      : 0n;
  // const [sellAmount, setSellAmount] = useState(0n);
  const { price, wethPrice } = usePrice();
  const { address } = useAccount();
  const { pool } = usePool(POOL_ADDRESS as Hex);
  const { quote } = useQuote(pool, amountBn);
  const { swap } = useSwap(pool, amountBn);
  // const buyAmount = (amountBn && quote?.amount) || 0n;
  const ethBalance = useBalance({ address });
  const leonBalance = useBalance({ address, token: ASSET_ADDRESS as Hex });

  const maxEthValue = (ethBalance.data?.value || 0n) - (quote?.gas || 0n);

  const handleSetAmount = useCallback(
    (value: string) => {
      try {
        if (maxEthValue === 0n) return;
        const innerValue = value.replace(/,/g, '.'); // 3.1415
        if (innerValue === '') {
          setAmount('');
          return;
        }
        const parsedValue = ethers.parseUnits(
          innerValue,
          parseInt(ASSET_METADATA_DECIMALS),
        );
        if (parsedValue <= maxEthValue) {
          setAmount(innerValue);
        } else {
          setAmount(
            ethers.formatUnits(maxEthValue, parseInt(ASSET_METADATA_DECIMALS)),
          );
        }
      } catch (error) {
        console.warn(error);
      }
    },
    [maxEthValue],
  );

  const buy = useCallback(
    async (onClose: () => void) => {
      const formattedAmount = prettyAmount(
        parseFloat(formatUnits(amountBn, 18)),
      );

      setBuying(true);
      await handleTx({
        confirmingDescription: `Buying ${formattedAmount} $LEONAI`,
        processingDescription: `Buying ${formattedAmount} $LEONAI`,
        successDescription: `Bought ${formattedAmount} $LEONAI`,
        tx: swap().then(() => setAmount('')),
      });
      setBuying(false);
      onClose();
    },
    [amountBn, handleTx, swap],
  );

  const setPercentage = useCallback(
    (percentage: bigint) => {
      if (maxEthValue === 0n) {
        return;
      }
      if (percentage === 100n) {
        setAmount(
          ethers.formatUnits(maxEthValue, parseInt(ASSET_METADATA_DECIMALS)),
        );
      } else {
        if (ethBalance.data?.value === undefined) {
          return;
        }
        const parsedValue = (ethBalance.data.value * percentage) / 100n;
        setAmount(
          ethers.formatUnits(parsedValue, parseInt(ASSET_METADATA_DECIMALS)),
        );
      }
    },
    [ethBalance.data?.value, maxEthValue, setAmount],
  );

  const ETH = {
    symbol: 'ETH',
    icon: '/eth.png',
    decimals: 18,
    usd: wethPrice,
    balance: maxEthValue,
  };

  // const LEONARDO = {
  //   symbol: 'LEONAI',
  //   icon: '/leonai.png',
  //   decimals: 18,
  //   usd: price,
  //   balance: leonBalance.data?.value,
  // };

  const hasEnough = amountBn <= (ETH.balance ?? 0n) - (quote?.gas ?? 0n);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
    }
  }, [isOpen]);

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
            <div className={styles.title}>Buy</div>

            <div className={styles.bottom}>
              <div className={styles.amount}>
                <div className={styles.labels}>
                  <div className={styles.label}>Amount to sell</div>
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    color={buying ? 'disabled' : 'primary'}
                    value={amount}
                    onChange={(e) => handleSetAmount(e.target.value)}
                    className={styles.input}
                    height={48}
                    disabled={buying}
                    style={{
                      color: buying ? 'var(--text-color-muted)' : undefined,
                    }}
                  />
                  <span className={styles.chip}>
                    <img src={ETH.icon} alt={ETH.symbol} />
                    {ETH.symbol}
                  </span>
                </div>

                <div className={styles.buttons}>
                  {percentages.map((percentage) => (
                    <Button
                      fullWidth
                      size="sm"
                      key={percentage}
                      color={buying ? 'default' : 'primary'}
                      variant={
                        amountBn ===
                        (ethBalance?.data?.value || 0n * BigInt(percentage)) /
                          100n
                          ? undefined
                          : 'light'
                      }
                      disabled={buying}
                      onPressStart={
                        buying
                          ? undefined
                          : () => setPercentage(BigInt(percentage))
                      }
                      onClick={
                        buying
                          ? undefined
                          : () => setPercentage(BigInt(percentage))
                      }
                      style={{
                        color: buying ? 'var(--text-color-muted)' : undefined,
                      }}
                    >
                      {percentage === 100 ? 'MAX' : `${percentage}%`}
                    </Button>
                  ))}
                </div>

                <div className={styles.labels}>
                  <div className={styles.label}>Amount to buy</div>
                </div>

                <div className={styles.inputContainer}>
                  <input
                    type="text"
                    color={'disabled'}
                    value={ethers.formatUnits(
                      quote?.amount || 0n,
                      parseInt(ASSET_METADATA_DECIMALS),
                    )}
                    // onChange={(e) => handleSetAmount(e.target.value)}
                    className={styles.input}
                    height={48}
                    disabled
                    style={{
                      color: 'var(--text-color-muted)',
                    }}
                  />
                  <span className={styles.chip}>
                    <img src="/leonai.png" alt="LEONAI" />
                    LEONAI
                  </span>
                </div>
              </div>
            </div>

            <Button
              isLoading={buying}
              color="primary"
              style={{ width: '100%' }}
              onPress={buying ? undefined : () => buy(onClose)}
              disabled={!hasEnough}
            >
              Buy
            </Button>

            <a
              href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
              target="_blank"
              rel="noreferrer"
              className="w-full text-center mt-2"
              style={{ fontSize: '12px' }}
            >
              Buy on Uniswap
            </a>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}
