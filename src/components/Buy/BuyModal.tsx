import { Button, Modal, ModalContent } from '@nextui-org/react';
import { TokenInput } from './TokenInput';
import { usePrice } from '@/src/context/price.context';
import { useAccount, useBalance } from 'wagmi';

import { ASSET_ADDRESS, POOL_ADDRESS } from '@/src/config';
import { formatUnits, Hex } from 'viem';
import { useCallback, useState } from 'react';

import { usePool } from '@/src/hooks/uniswap/usePool';
import { useQuote } from '@/src/hooks/uniswap/useQuote';
import { useSwap } from '@/src/hooks/uniswap/useSwap';

import styles from './styles.module.css';
import { prettyAmount } from '@/src/utils/format';

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

export default function BuyModal({
  isOpen,
  onOpenChange,
  handleTx,
}: BuyModalProps) {
  const [sellAmount, setSellAmount] = useState(0n);
  const { price, wethPrice } = usePrice();
  const { address } = useAccount();
  const { pool } = usePool(POOL_ADDRESS as Hex);
  const { quote } = useQuote(pool, sellAmount);
  const { swap, isLoading: isSwaping } = useSwap(pool, sellAmount);
  const buyAmount = (sellAmount && quote?.amount) || 0n;
  const ethBalance = useBalance({ address });
  const leonBalance = useBalance({ address, token: ASSET_ADDRESS as Hex });

  const buy = useCallback(async () => {
    const amount = prettyAmount(parseFloat(formatUnits(buyAmount, 18)));

    await handleTx({
      confirmingDescription: `Buying ${amount} $LEONAI`,
      processingDescription: `Buying ${amount} $LEONAI`,
      successDescription: `Bought ${amount} $LEONAI`,
      tx: swap().then(() => setSellAmount(0n)),
    });
  }, [handleTx, swap]);

  const ETH = {
    symbol: 'ETH',
    icon: '/eth.png',
    decimals: 18,
    usd: wethPrice,
    balance: ethBalance.data?.value,
  };

  const LEONARDO = {
    symbol: 'LEONAI',
    icon: '/leonai.png',
    decimals: 18,
    usd: price,
    balance: leonBalance.data?.value,
  };

  const hasEnough = sellAmount <= (ETH.balance ?? 0n) - (quote?.gas ?? 0n);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className="modal"
      size="xl"
    >
      <ModalContent>
        <form className={styles.layout}>
          <h3 className={styles.title}>Buy</h3>
          <TokenInput
            isValid={hasEnough}
            label="Sell"
            amount={sellAmount}
            setAmount={setSellAmount}
            token={ETH}
          />

          <TokenInput
            isValid={buyAmount > 0n}
            readonly={true}
            label="Buy"
            amount={buyAmount}
            setAmount={() => {}}
            token={LEONARDO}
          />

          <BuyButton
            isSwaping={isSwaping}
            isReady={true}
            needApproval={false}
            hasEnough={hasEnough}
            approve={() => {}}
            buy={buy}
          />

          <a
            href="https://app.uniswap.org/swap?exactField=output&&outputCurrency=0xb933D4FF5A0e7bFE6AB7Da72b5DCE2259030252f&inputCurrency=ETH&chain=base"
            target="_blank"
            rel="noreferrer"
            className="w-full text-center mt-2"
            style={{ fontSize: '12px' }}
          >
            Buy on Uniswap
          </a>
        </form>
      </ModalContent>
    </Modal>
  );
}

type BuyButtonProps = {
  hasEnough: boolean;
  isSwaping: boolean;
  needApproval: boolean;
  isReady: boolean;
  approve: () => void;
  buy: () => void;
};

function BuyButton({
  approve,
  buy,
  isReady,
  needApproval,
  isSwaping,
  hasEnough,
}: BuyButtonProps) {
  const style = { width: '100%' };

  if (!isReady) return <></>;

  if (isSwaping) {
    return (
      <Button disabled={true} color="primary" style={style} onPress={approve}>
        Buying...
      </Button>
    );
  }

  if (needApproval) {
    return (
      <Button color="primary" style={style} onPress={approve}>
        Approve
      </Button>
    );
  }

  if (!hasEnough) {
    return (
      <Button disabled={true} color="primary" style={style}>
        Insufficient Funds
      </Button>
    );
  }

  return (
    <Button color="primary" style={style} onPress={buy}>
      Buy Leonardo
    </Button>
  );
}
